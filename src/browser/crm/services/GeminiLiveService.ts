/**
 * Gemini Live Service - Real-time AI Assistant for Meetings
 * Implements Google's Gemini Live API for voice and real-time processing
 */

import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai'

export interface GeminiLiveConfig {
  apiKey: string
  model: string
  responseModalities: Modality[]
  mediaResolution: MediaResolution
  speechConfig: {
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: string
      }
    }
  }
  contextWindowCompression: {
    triggerTokens: string
    slidingWindow: { targetTokens: string }
  }
}

export interface TranscriptionOptions {
  onTranscription: (transcription: any) => void
  onTranslation?: (translation: any) => void
  language: string
  realTimeTranslation: boolean
}

export interface LiveSummaryData {
  meetingId: string
  participants: any[]
  transcriptions: any[]
  duration: number
}

export interface ActionItem {
  task: string
  assignee?: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
}

export class GeminiLiveService {
  private static instance: GeminiLiveService
  private ai: GoogleGenAI
  private config: GeminiLiveConfig
  private session: Session | undefined = undefined
  private responseQueue: LiveServerMessage[] = []
  private isInitialized = false
  private isTranscribing = false
  private audioParts: string[] = []

  private constructor() {
    this.config = {
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key',
      model: 'models/gemini-2.5-flash-preview-native-audio-dialog',
      responseModalities: [Modality.AUDIO, Modality.TEXT],
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: 'Zephyr'
          }
        }
      },
      contextWindowCompression: {
        triggerTokens: '25600',
        slidingWindow: { targetTokens: '12800' }
      }
    }

    this.ai = new GoogleGenAI({
      apiKey: this.config.apiKey
    })
  }

  static getInstance(): GeminiLiveService {
    if (!GeminiLiveService.instance) {
      GeminiLiveService.instance = new GeminiLiveService()
    }
    return GeminiLiveService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      console.log('🤖 Initializing Gemini Live Service...')

      // Test API connection
      await this.testConnection()

      this.isInitialized = true
      console.log('✅ Gemini Live Service initialized successfully')

    } catch (error) {
      console.error('❌ Failed to initialize Gemini Live Service:', error)
      throw error
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      const result = await model.generateContent('Test connection')
      console.log('✅ Gemini API connection successful')
    } catch (error) {
      console.error('❌ Gemini API connection failed:', error)
      throw new Error('Failed to connect to Gemini API')
    }
  }

  async startLiveSession(): Promise<void> {
    try {
      if (this.session) {
        console.log('Live session already active')
        return
      }

      this.session = await this.ai.live.connect({
        model: this.config.model,
        callbacks: {
          onopen: () => {
            console.log('🎤 Gemini Live session opened')
          },
          onmessage: (message: LiveServerMessage) => {
            this.responseQueue.push(message)
            this.handleLiveMessage(message)
          },
          onerror: (e: ErrorEvent) => {
            console.error('❌ Gemini Live error:', e.message)
          },
          onclose: (e: CloseEvent) => {
            console.log('🔌 Gemini Live session closed:', e.reason)
            this.session = undefined
          }
        },
        config: {
          responseModalities: this.config.responseModalities,
          mediaResolution: this.config.mediaResolution,
          speechConfig: this.config.speechConfig,
          contextWindowCompression: this.config.contextWindowCompression
        }
      })

      console.log('✅ Gemini Live session started')

    } catch (error) {
      console.error('❌ Failed to start Gemini Live session:', error)
      throw error
    }
  }

  async stopLiveSession(): Promise<void> {
    if (this.session) {
      this.session.close()
      this.session = undefined
      this.responseQueue = []
      this.audioParts = []
      console.log('🔌 Gemini Live session stopped')
    }
  }

  private handleLiveMessage(message: LiveServerMessage): void {
    if (message.serverContent?.modelTurn?.parts) {
      const part = message.serverContent.modelTurn.parts[0]

      // Handle text responses
      if (part?.text) {
        console.log('🤖 Gemini response:', part.text)
        this.onTextResponse?.(part.text)
      }

      // Handle audio responses
      if (part?.inlineData) {
        this.handleAudioResponse(part.inlineData)
      }

      // Handle file data
      if (part?.fileData) {
        console.log('📁 File response:', part.fileData.fileUri)
      }
    }
  }

  private handleAudioResponse(inlineData: any): void {
    const fileName = 'ai_response.wav'
    this.audioParts.push(inlineData?.data ?? '')

    const buffer = this.convertToWav(this.audioParts, inlineData.mimeType ?? '')
    
    // Play audio response
    this.playAudioBuffer(buffer)
    
    console.log('🎵 AI audio response generated')
  }

  private convertToWav(rawData: string[], mimeType: string): Buffer {
    const options = this.parseMimeType(mimeType)
    const dataLength = rawData.reduce((a, b) => a + b.length, 0)
    const wavHeader = this.createWavHeader(dataLength, options)
    const buffer = Buffer.concat(rawData.map(data => Buffer.from(data, 'base64')))

    return Buffer.concat([wavHeader, buffer])
  }

  private parseMimeType(mimeType: string): any {
    const [fileType, ...params] = mimeType.split(';').map(s => s.trim())
    const [_, format] = fileType.split('/')

    const options = {
      numChannels: 1,
      bitsPerSample: 16,
      sampleRate: 24000
    }

    if (format && format.startsWith('L')) {
      const bits = parseInt(format.slice(1), 10)
      if (!isNaN(bits)) {
        options.bitsPerSample = bits
      }
    }

    for (const param of params) {
      const [key, value] = param.split('=').map(s => s.trim())
      if (key === 'rate') {
        options.sampleRate = parseInt(value, 10)
      }
    }

    return options
  }

  private createWavHeader(dataLength: number, options: any): Buffer {
    const { numChannels, sampleRate, bitsPerSample } = options
    const byteRate = sampleRate * numChannels * bitsPerSample / 8
    const blockAlign = numChannels * bitsPerSample / 8
    const buffer = Buffer.alloc(44)

    buffer.write('RIFF', 0)
    buffer.writeUInt32LE(36 + dataLength, 4)
    buffer.write('WAVE', 8)
    buffer.write('fmt ', 12)
    buffer.writeUInt32LE(16, 16)
    buffer.writeUInt16LE(1, 20)
    buffer.writeUInt16LE(numChannels, 22)
    buffer.writeUInt32LE(sampleRate, 24)
    buffer.writeUInt32LE(byteRate, 28)
    buffer.writeUInt16LE(blockAlign, 32)
    buffer.writeUInt16LE(bitsPerSample, 34)
    buffer.write('data', 36)
    buffer.writeUInt32LE(dataLength, 40)

    return buffer
  }

  private playAudioBuffer(buffer: Buffer): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      audioContext.decodeAudioData(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
        .then(audioBuffer => {
          const source = audioContext.createBufferSource()
          source.buffer = audioBuffer
          source.connect(audioContext.destination)
          source.start()
        })
        .catch(error => {
          console.error('Error playing audio:', error)
        })
    } catch (error) {
      console.error('Error creating audio context:', error)
    }
  }

  async startTranscription(options: TranscriptionOptions): Promise<void> {
    try {
      if (!this.session) {
        await this.startLiveSession()
      }

      this.isTranscribing = true

      // Set up audio capture
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        } 
      })

      // Process audio stream
      this.processAudioStream(stream, options)

      console.log('🎤 Real-time transcription started')

    } catch (error) {
      console.error('❌ Failed to start transcription:', error)
      this.isTranscribing = false
      throw error
    }
  }

  async stopTranscription(): Promise<void> {
    this.isTranscribing = false
    console.log('🎤 Transcription stopped')
  }

  private async processAudioStream(stream: MediaStream, options: TranscriptionOptions): Promise<void> {
    const audioContext = new AudioContext({ sampleRate: 24000 })
    const source = audioContext.createMediaStreamSource(stream)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)

    processor.onaudioprocess = async (event) => {
      if (!this.isTranscribing || !this.session) return

      const inputBuffer = event.inputBuffer
      const inputData = inputBuffer.getChannelData(0)
      
      // Convert to base64 for Gemini Live
      const audioData = this.audioBufferToBase64(inputData)
      
      // Send to Gemini Live for processing
      try {
        this.session.sendClientContent({
          turns: [{
            role: 'user',
            parts: [{
              inlineData: {
                mimeType: 'audio/pcm;rate=24000',
                data: audioData
              }
            }]
          }]
        })

        // Process response
        const response = await this.waitForResponse()
        if (response) {
          this.handleTranscriptionResponse(response, options)
        }

      } catch (error) {
        console.error('Error processing audio:', error)
      }
    }

    source.connect(processor)
    processor.connect(audioContext.destination)
  }

  private audioBufferToBase64(buffer: Float32Array): string {
    // Convert Float32Array to Int16Array
    const int16Array = new Int16Array(buffer.length)
    for (let i = 0; i < buffer.length; i++) {
      int16Array[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32768))
    }
    
    // Convert to base64
    const uint8Array = new Uint8Array(int16Array.buffer)
    return btoa(String.fromCharCode(...uint8Array))
  }

  private async waitForResponse(): Promise<LiveServerMessage | null> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 1000)
      
      const checkQueue = () => {
        const message = this.responseQueue.shift()
        if (message) {
          clearTimeout(timeout)
          resolve(message)
        } else {
          setTimeout(checkQueue, 50)
        }
      }
      
      checkQueue()
    })
  }

  private handleTranscriptionResponse(response: LiveServerMessage, options: TranscriptionOptions): void {
    if (response.serverContent?.modelTurn?.parts) {
      const part = response.serverContent.modelTurn.parts[0]
      
      if (part?.text) {
        const transcription = {
          text: part.text,
          confidence: 0.9, // Gemini doesn't provide confidence, using default
          language: 'auto-detected',
          timestamp: new Date(),
          participantId: 'current-speaker'
        }

        options.onTranscription(transcription)

        // Handle translation if enabled
        if (options.realTimeTranslation && options.onTranslation) {
          this.translateText(part.text, 'en').then(translation => {
            options.onTranslation?.({
              originalText: part.text,
              translatedText: translation,
              sourceLanguage: 'auto',
              targetLanguage: 'en',
              confidence: 0.9
            })
          })
        }
      }
    }
  }

  async processQuery(query: string): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `You are an AI meeting assistant. Respond helpfully and concisely to this query: ${query}`
      
      const result = await model.generateContent(prompt)
      const response = result.response
      
      return response.text() || 'I apologize, but I couldn\'t process your request.'

    } catch (error) {
      console.error('Error processing query:', error)
      return 'I encountered an error processing your request. Please try again.'
    }
  }

  async generateLiveSummary(transcriptions: any[]): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const transcriptText = transcriptions.map(t => `${t.speakerName || 'Speaker'}: ${t.text}`).join('\n')
      
      const prompt = `
Generate a concise live summary of this meeting conversation so far:

${transcriptText}

Provide:
1. Key topics discussed
2. Main decisions made
3. Current discussion focus

Keep it brief and actionable.`

      const result = await model.generateContent(prompt)
      return result.response.text() || 'Unable to generate summary at this time.'

    } catch (error) {
      console.error('Error generating live summary:', error)
      return 'Failed to generate summary.'
    }
  }

  async extractActionItems(transcriptions: any[]): Promise<ActionItem[]> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const transcriptText = transcriptions.map(t => `${t.speakerName || 'Speaker'}: ${t.text}`).join('\n')
      
      const prompt = `
Extract action items from this meeting conversation:

${transcriptText}

Return a JSON array of action items with this format:
[
  {
    "task": "description of the task",
    "assignee": "person assigned (if mentioned)",
    "dueDate": "due date (if mentioned)",
    "priority": "low|medium|high"
  }
]

Only include clear, actionable items that were explicitly discussed.`

      const result = await model.generateContent(prompt)
      const responseText = result.response.text() || '[]'
      
      try {
        return JSON.parse(responseText)
      } catch {
        // If JSON parsing fails, return empty array
        return []
      }

    } catch (error) {
      console.error('Error extracting action items:', error)
      return []
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const prompt = `Translate this text to ${targetLanguage}: "${text}"`
      
      const result = await model.generateContent(prompt)
      return result.response.text() || text

    } catch (error) {
      console.error('Error translating text:', error)
      return text
    }
  }

  async generateMeetingNotes(transcriptions: any[]): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const transcriptText = transcriptions.map(t => `${t.speakerName || 'Speaker'}: ${t.text}`).join('\n')
      
      const prompt = `
Generate structured meeting notes from this conversation:

${transcriptText}

Format as:
## Meeting Notes

### Key Discussion Points
- Point 1
- Point 2

### Decisions Made
- Decision 1
- Decision 2

### Action Items
- [ ] Task 1
- [ ] Task 2

### Next Steps
- Step 1
- Step 2

Keep it organized and professional.`

      const result = await model.generateContent(prompt)
      return result.response.text() || 'Unable to generate meeting notes.'

    } catch (error) {
      console.error('Error generating meeting notes:', error)
      return 'Failed to generate meeting notes.'
    }
  }

  async generateCompleteMeetingSummary(data: LiveSummaryData): Promise<any> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-pro' })
      
      const transcriptText = data.transcriptions.map(t => `${t.speakerName || 'Speaker'}: ${t.text}`).join('\n')
      const participantNames = data.participants.map(p => p.displayName).join(', ')
      
      const prompt = `
Generate a comprehensive meeting summary:

Meeting Duration: ${data.duration} minutes
Participants: ${participantNames}

Full Transcript:
${transcriptText}

Provide a detailed JSON response with:
{
  "summary": "Executive summary of the meeting",
  "keyTopics": ["topic1", "topic2"],
  "decisions": ["decision1", "decision2"],
  "actionItems": [
    {
      "task": "task description",
      "assignee": "person",
      "dueDate": "date",
      "priority": "high|medium|low"
    }
  ],
  "nextSteps": ["step1", "step2"],
  "sentiment": "positive|neutral|negative",
  "engagementScore": 85,
  "fullTranscription": "${transcriptText}"
}`

      const result = await model.generateContent(prompt)
      const responseText = result.response.text() || '{}'
      
      try {
        const summary = JSON.parse(responseText)
        summary.meetingId = data.meetingId
        summary.generatedAt = new Date()
        return summary
      } catch {
        // Fallback if JSON parsing fails
        return {
          meetingId: data.meetingId,
          summary: result.response.text() || 'Summary generation failed',
          keyTopics: [],
          decisions: [],
          actionItems: [],
          nextSteps: [],
          sentiment: 'neutral',
          engagementScore: 0,
          fullTranscription: transcriptText,
          generatedAt: new Date()
        }
      }

    } catch (error) {
      console.error('Error generating complete meeting summary:', error)
      throw error
    }
  }

  // Event handlers (can be overridden)
  onTextResponse?: (text: string) => void
  onAudioResponse?: (audioBuffer: Buffer) => void
  onTranscriptionUpdate?: (transcription: any) => void

  // Getters
  isSessionActive(): boolean {
    return !!this.session
  }

  isCurrentlyTranscribing(): boolean {
    return this.isTranscribing
  }

  getConfig(): GeminiLiveConfig {
    return this.config
  }
}