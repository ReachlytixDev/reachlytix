/**
 * Deepgram Service - Real-time Voice AI Integration
 * Speech-to-Text, Text-to-Speech, and Voice Analytics
 */

import { GeminiAIService } from './GeminiAIService'

export interface DeepgramConfig {
  apiKey: string
  baseUrl: string
}

export interface TranscriptionOptions {
  model?: 'nova-2' | 'nova' | 'enhanced' | 'base'
  language?: string
  punctuate?: boolean
  diarize?: boolean
  sentiment?: boolean
  summarize?: boolean
  detect_language?: boolean
  smart_format?: boolean
}

export interface TranscriptionResult {
  transcript: string
  confidence: number
  words: Array<{
    word: string
    start: number
    end: number
    confidence: number
    speaker?: number
  }>
  sentiment?: {
    sentiment: 'positive' | 'neutral' | 'negative'
    confidence: number
  }
  summary?: string
  language?: string
  speakers?: number
}

export interface TTSOptions {
  model?: 'aura-asteria-en' | 'aura-luna-en' | 'aura-stella-en' | 'aura-athena-en' | 'aura-hera-en' | 'aura-orion-en' | 'aura-arcas-en' | 'aura-perseus-en' | 'aura-angus-en' | 'aura-orpheus-en' | 'aura-helios-en' | 'aura-zeus-en'
  encoding?: 'linear16' | 'flac' | 'mulaw' | 'amr-nb' | 'amr-wb' | 'opus' | 'speex'
  container?: 'wav' | 'mp3' | 'flac' | 'opus'
  sample_rate?: number
}

export interface VoiceAnalytics {
  speakingTime: number
  silenceTime: number
  wordsPerMinute: number
  sentiment: 'positive' | 'neutral' | 'negative'
  emotions: string[]
  keyTopics: string[]
  actionItems: string[]
  callQuality: number
  customerSatisfaction: number
}

export interface RealTimeTranscription {
  isLive: boolean
  transcript: string
  confidence: number
  isFinal: boolean
  speaker?: number
}

export class DeepgramService {
  private static instance: DeepgramService
  private config: DeepgramConfig
  private geminiAI: GeminiAIService
  private activeConnections: Map<string, WebSocket> = new Map()

  private constructor() {
    this.config = {
      apiKey: process.env.DEEPGRAM_API_KEY || 'your-deepgram-api-key',
      baseUrl: 'https://api.deepgram.com/v1'
    }
    this.geminiAI = GeminiAIService.getInstance()
  }

  static getInstance(): DeepgramService {
    if (!DeepgramService.instance) {
      DeepgramService.instance = new DeepgramService()
    }
    return DeepgramService.instance
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Token ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  async transcribeAudio(audioData: Blob | ArrayBuffer, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
    const url = `${this.config.baseUrl}/listen`
    
    const params = new URLSearchParams({
      model: options.model || 'nova-2',
      language: options.language || 'en-US',
      punctuate: (options.punctuate !== false).toString(),
      diarize: (options.diarize || true).toString(),
      sentiment: (options.sentiment || true).toString(),
      summarize: (options.summarize || true).toString(),
      smart_format: (options.smart_format !== false).toString(),
      detect_language: (options.detect_language || false).toString()
    })

    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/octet-stream'
        },
        body: audioData
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Deepgram API error: ${response.status} ${error}`)
      }

      const data = await response.json()
      const result = data.results?.channels?.[0]?.alternatives?.[0]

      if (!result) {
        throw new Error('No transcription result found')
      }

      return {
        transcript: result.transcript || '',
        confidence: result.confidence || 0,
        words: result.words || [],
        sentiment: data.results?.sentiment ? {
          sentiment: data.results.sentiment.segments?.[0]?.sentiment || 'neutral',
          confidence: data.results.sentiment.segments?.[0]?.sentiment_score || 0
        } : undefined,
        summary: data.results?.summary?.short || undefined,
        language: data.results?.language || options.language,
        speakers: data.results?.channels?.[0]?.detected_language || 1
      }
    } catch (error) {
      console.error('Deepgram transcription error:', error)
      throw new Error(`Failed to transcribe audio: ${error}`)
    }
  }

  async synthesizeSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
    const url = `${this.config.baseUrl}/speak`
    
    const params = new URLSearchParams({
      model: options.model || 'aura-asteria-en',
      encoding: options.encoding || 'linear16',
      container: options.container || 'wav',
      sample_rate: (options.sample_rate || 24000).toString()
    })

    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Deepgram TTS error: ${response.status} ${error}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('Deepgram TTS error:', error)
      throw new Error(`Failed to synthesize speech: ${error}`)
    }
  }

  // Real-time transcription for live calls
  async startRealTimeTranscription(
    callId: string, 
    onTranscript: (result: RealTimeTranscription) => void,
    options: TranscriptionOptions = {}
  ): Promise<void> {
    const wsUrl = `wss://api.deepgram.com/v1/listen`
    const params = new URLSearchParams({
      model: options.model || 'nova-2',
      language: options.language || 'en-US',
      punctuate: 'true',
      diarize: 'true',
      sentiment: 'true',
      interim_results: 'true',
      endpointing: '300',
      vad_events: 'true'
    })

    try {
      const ws = new WebSocket(`${wsUrl}?${params}`, ['token', this.config.apiKey])
      
      ws.onopen = () => {
        console.log(`Real-time transcription started for call ${callId}`)
        this.activeConnections.set(callId, ws)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'Results') {
            const result = data.channel?.alternatives?.[0]
            if (result) {
              onTranscript({
                isLive: true,
                transcript: result.transcript || '',
                confidence: result.confidence || 0,
                isFinal: data.is_final || false,
                speaker: data.channel?.detected_language || 0
              })
            }
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.activeConnections.delete(callId)
      }

      ws.onclose = () => {
        console.log(`Real-time transcription ended for call ${callId}`)
        this.activeConnections.delete(callId)
      }

    } catch (error) {
      console.error('Real-time transcription setup error:', error)
      throw error
    }
  }

  async sendAudioChunk(callId: string, audioChunk: ArrayBuffer): Promise<void> {
    const ws = this.activeConnections.get(callId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(audioChunk)
    } else {
      console.warn(`No active connection for call ${callId}`)
    }
  }

  async stopRealTimeTranscription(callId: string): Promise<void> {
    const ws = this.activeConnections.get(callId)
    if (ws) {
      ws.close()
      this.activeConnections.delete(callId)
    }
  }

  // AI-Enhanced Voice Analytics
  async analyzeCallRecording(audioData: ArrayBuffer, callContext: any): Promise<VoiceAnalytics> {
    try {
      // First, transcribe the audio with full analysis
      const transcription = await this.transcribeAudio(audioData, {
        model: 'nova-2',
        diarize: true,
        sentiment: true,
        summarize: true,
        punctuate: true,
        smart_format: true
      })

      // Use AI to analyze the conversation
      const analysisPrompt = `
Analyze this sales call transcript and provide detailed insights:

Transcript: "${transcription.transcript}"
Call Context: ${JSON.stringify(callContext)}

Provide analysis in JSON format:
{
  "speakingTime": number (seconds),
  "silenceTime": number (seconds),
  "wordsPerMinute": number,
  "sentiment": "positive|neutral|negative",
  "emotions": ["emotion1", "emotion2"],
  "keyTopics": ["topic1", "topic2"],
  "actionItems": ["action1", "action2"],
  "callQuality": number (1-10),
  "customerSatisfaction": number (1-10),
  "insights": "detailed insights",
  "recommendations": ["rec1", "rec2"]
}
`

      const aiAnalysis = await this.geminiAI.generateContent(analysisPrompt)
      const analysis = JSON.parse(aiAnalysis.content)

      // Calculate speaking metrics from word timing
      const speakingTime = this.calculateSpeakingTime(transcription.words)
      const totalTime = callContext.duration || 300 // fallback to 5 minutes
      const silenceTime = totalTime - speakingTime
      const wordsPerMinute = transcription.words.length > 0 ? 
        Math.round((transcription.words.length / totalTime) * 60) : 0

      return {
        speakingTime,
        silenceTime,
        wordsPerMinute,
        sentiment: analysis.sentiment || transcription.sentiment?.sentiment || 'neutral',
        emotions: analysis.emotions || [],
        keyTopics: analysis.keyTopics || [],
        actionItems: analysis.actionItems || [],
        callQuality: analysis.callQuality || 5,
        customerSatisfaction: analysis.customerSatisfaction || 5
      }
    } catch (error) {
      console.error('Call analysis error:', error)
      
      // Return basic analysis on error
      return {
        speakingTime: 0,
        silenceTime: 0,
        wordsPerMinute: 0,
        sentiment: 'neutral',
        emotions: [],
        keyTopics: [],
        actionItems: [],
        callQuality: 5,
        customerSatisfaction: 5
      }
    }
  }

  private calculateSpeakingTime(words: any[]): number {
    if (words.length === 0) return 0
    
    const firstWord = words[0]
    const lastWord = words[words.length - 1]
    
    return lastWord.end - firstWord.start
  }

  // AI-Powered Voice Response Generation
  async generateVoiceResponse(transcript: string, callContext: any): Promise<{ text: string, audio: ArrayBuffer }> {
    try {
      // Generate AI response text
      const responseText = await this.geminiAI.handleVoiceConversation(transcript, callContext)
      
      // Convert to speech
      const audioBuffer = await this.synthesizeSpeech(responseText, {
        model: 'aura-asteria-en', // Professional female voice
        encoding: 'linear16',
        container: 'wav',
        sample_rate: 24000
      })

      return {
        text: responseText,
        audio: audioBuffer
      }
    } catch (error) {
      console.error('Voice response generation error:', error)
      
      // Fallback response
      const fallbackText = "I understand. Let me help you with that."
      const fallbackAudio = await this.synthesizeSpeech(fallbackText)
      
      return {
        text: fallbackText,
        audio: fallbackAudio
      }
    }
  }

  // Batch processing for multiple recordings
  async batchAnalyzeRecordings(recordings: Array<{ id: string, audio: ArrayBuffer, context: any }>): Promise<VoiceAnalytics[]> {
    const analyses = await Promise.all(
      recordings.map(recording => 
        this.analyzeCallRecording(recording.audio, recording.context)
      )
    )
    return analyses
  }

  // Real-time conversation coaching
  async provideRealTimeCoaching(transcript: string, callContext: any): Promise<string[]> {
    const coachingPrompt = `
You are a sales coach providing real-time guidance during a call.

Current conversation: "${transcript}"
Call context: ${JSON.stringify(callContext)}

Provide 2-3 brief coaching tips for the sales agent right now:
- What they should say next
- How to handle objections
- Opportunities to close

Keep tips concise and actionable.
`

    try {
      const response = await this.geminiAI.generateContent(coachingPrompt)
      return response.content.split('\n').filter(tip => tip.trim().length > 0)
    } catch (error) {
      console.error('Real-time coaching error:', error)
      return ['Stay focused on the customer\'s needs', 'Ask open-ended questions', 'Listen actively']
    }
  }

  // Voice quality assessment
  async assessVoiceQuality(audioData: ArrayBuffer): Promise<{ quality: number, issues: string[], recommendations: string[] }> {
    try {
      // This would typically use audio analysis APIs
      // For now, we'll simulate quality assessment
      const quality = Math.random() * 4 + 6 // 6-10 range
      
      const issues = []
      const recommendations = []
      
      if (quality < 7) {
        issues.push('Audio clarity could be improved')
        recommendations.push('Check microphone settings')
      }
      
      if (quality < 8) {
        issues.push('Some background noise detected')
        recommendations.push('Use noise cancellation')
      }

      return { quality, issues, recommendations }
    } catch (error) {
      console.error('Voice quality assessment error:', error)
      return { quality: 7, issues: [], recommendations: [] }
    }
  }

  // Integration with Twilio for seamless voice AI
  async handleTwilioVoiceWebhook(audioStream: ReadableStream, callContext: any): Promise<string> {
    try {
      // Convert stream to buffer
      const reader = audioStream.getReader()
      const chunks = []
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
      
      const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        audioBuffer.set(chunk, offset)
        offset += chunk.length
      }

      // Transcribe the audio
      const transcription = await this.transcribeAudio(audioBuffer.buffer, {
        model: 'nova-2',
        language: 'en-US',
        punctuate: true,
        sentiment: true
      })

      // Generate AI response
      const response = await this.geminiAI.handleVoiceConversation(
        transcription.transcript, 
        callContext
      )

      return response
    } catch (error) {
      console.error('Twilio voice webhook error:', error)
      return "I apologize, but I'm having trouble processing that. Could you please repeat?"
    }
  }
}