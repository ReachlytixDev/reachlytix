/**
 * Gemini AI Service - Real AI Integration for CRM
 * Powered by Google's Gemini 2.5 Pro and Flash models
 */

export interface GeminiConfig {
  apiKey: string
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash'
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  content: string
  confidence: number
  reasoning?: string
  suggestions?: string[]
  metadata?: Record<string, any>
}

export interface LeadAnalysis {
  score: number
  qualification: 'hot' | 'warm' | 'cold' | 'unqualified'
  reasoning: string
  nextActions: string[]
  estimatedValue: number
  conversionProbability: number
  recommendedApproach: string
}

export interface CallScript {
  opening: string
  questions: string[]
  objectionHandling: Record<string, string>
  closing: string
  fallbackResponses: string[]
}

export interface EmailContent {
  subject: string
  body: string
  callToAction: string
  personalization: Record<string, string>
  followUpSequence: string[]
}

export interface CampaignOptimization {
  recommendations: string[]
  channelAdjustments: Record<string, any>
  timingOptimizations: string[]
  contentImprovements: string[]
  targetingRefinements: string[]
  expectedImpact: number
}

export class GeminiAIService {
  private static instance: GeminiAIService
  private config: GeminiConfig
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  private constructor() {
    this.config = {
      apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key-here',
      model: 'gemini-2.5-pro',
      temperature: 0.7,
      maxTokens: 2048
    }
  }

  static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService()
    }
    return GeminiAIService.instance
  }

  async generateContent(prompt: string, model?: 'gemini-2.5-pro' | 'gemini-2.5-flash'): Promise<AIResponse> {
    const selectedModel = model || this.config.model
    
    try {
      const response = await fetch(`${this.baseUrl}/models/${selectedModel}:generateContent?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens,
            topP: 0.8,
            topK: 40
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        content,
        confidence: this.calculateConfidence(data),
        metadata: {
          model: selectedModel,
          timestamp: new Date().toISOString(),
          usage: data.usageMetadata
        }
      }
    } catch (error) {
      console.error('Gemini AI Service error:', error)
      throw new Error(`Failed to generate content: ${error}`)
    }
  }

  async analyzeLeadQuality(leadData: any): Promise<LeadAnalysis> {
    const prompt = `
You are an expert CRM lead analyst. Analyze this lead and provide a comprehensive assessment.

Lead Data:
${JSON.stringify(leadData, null, 2)}

Provide a detailed analysis including:
1. Lead score (0-100)
2. Qualification level (hot/warm/cold/unqualified)
3. Detailed reasoning for the score
4. Specific next actions to take
5. Estimated deal value
6. Conversion probability percentage
7. Recommended approach strategy

Format your response as JSON with the following structure:
{
  "score": number,
  "qualification": "hot|warm|cold|unqualified",
  "reasoning": "detailed explanation",
  "nextActions": ["action1", "action2", "action3"],
  "estimatedValue": number,
  "conversionProbability": number,
  "recommendedApproach": "strategy description"
}
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-pro')
      const analysis = JSON.parse(response.content)
      
      return {
        score: analysis.score || 0,
        qualification: analysis.qualification || 'unqualified',
        reasoning: analysis.reasoning || 'Analysis unavailable',
        nextActions: analysis.nextActions || [],
        estimatedValue: analysis.estimatedValue || 0,
        conversionProbability: analysis.conversionProbability || 0,
        recommendedApproach: analysis.recommendedApproach || 'Standard approach'
      }
    } catch (error) {
      console.error('Lead analysis error:', error)
      throw new Error(`Failed to analyze lead: ${error}`)
    }
  }

  async generateCallScript(leadData: any, objective: string): Promise<CallScript> {
    const prompt = `
You are an expert sales script writer. Create a personalized call script for this lead.

Lead Information:
${JSON.stringify(leadData, null, 2)}

Call Objective: ${objective}

Create a comprehensive call script with:
1. Engaging opening that mentions specific lead details
2. Discovery questions to uncover needs
3. Objection handling for common responses
4. Strong closing that moves to next step
5. Fallback responses for difficult situations

Make it conversational, natural, and highly personalized.

Format as JSON:
{
  "opening": "personalized opening script",
  "questions": ["question1", "question2", "question3"],
  "objectionHandling": {
    "not_interested": "response",
    "no_budget": "response",
    "need_to_think": "response",
    "wrong_timing": "response"
  },
  "closing": "closing script",
  "fallbackResponses": ["response1", "response2"]
}
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-flash')
      const script = JSON.parse(response.content)
      
      return {
        opening: script.opening || 'Hello, this is a call regarding your recent inquiry.',
        questions: script.questions || [],
        objectionHandling: script.objectionHandling || {},
        closing: script.closing || 'Thank you for your time.',
        fallbackResponses: script.fallbackResponses || []
      }
    } catch (error) {
      console.error('Call script generation error:', error)
      throw new Error(`Failed to generate call script: ${error}`)
    }
  }

  async generateEmailContent(leadData: any, campaignType: string, tone: string = 'professional'): Promise<EmailContent> {
    const prompt = `
You are an expert email marketing copywriter. Create a highly personalized email for this lead.

Lead Information:
${JSON.stringify(leadData, null, 2)}

Campaign Type: ${campaignType}
Tone: ${tone}

Create an email that:
1. Has a compelling, personalized subject line
2. Opens with relevant personalization
3. Addresses the lead's likely pain points
4. Provides clear value proposition
5. Includes a strong call-to-action
6. Plans a follow-up sequence

Format as JSON:
{
  "subject": "compelling subject line",
  "body": "full email body with personalization",
  "callToAction": "specific CTA",
  "personalization": {
    "company": "value",
    "industry": "value",
    "painPoint": "value"
  },
  "followUpSequence": ["followup1", "followup2", "followup3"]
}
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-flash')
      const email = JSON.parse(response.content)
      
      return {
        subject: email.subject || 'Following up on your inquiry',
        body: email.body || 'Thank you for your interest.',
        callToAction: email.callToAction || 'Schedule a call',
        personalization: email.personalization || {},
        followUpSequence: email.followUpSequence || []
      }
    } catch (error) {
      console.error('Email content generation error:', error)
      throw new Error(`Failed to generate email content: ${error}`)
    }
  }

  async optimizeCampaign(campaignData: any, performanceMetrics: any): Promise<CampaignOptimization> {
    const prompt = `
You are a campaign optimization expert. Analyze this campaign and provide actionable recommendations.

Campaign Data:
${JSON.stringify(campaignData, null, 2)}

Performance Metrics:
${JSON.stringify(performanceMetrics, null, 2)}

Provide optimization recommendations for:
1. Overall campaign strategy
2. Channel-specific adjustments
3. Timing optimizations
4. Content improvements
5. Targeting refinements
6. Expected impact of changes

Format as JSON:
{
  "recommendations": ["rec1", "rec2", "rec3"],
  "channelAdjustments": {
    "email": "adjustment",
    "sms": "adjustment",
    "voice": "adjustment"
  },
  "timingOptimizations": ["timing1", "timing2"],
  "contentImprovements": ["content1", "content2"],
  "targetingRefinements": ["targeting1", "targeting2"],
  "expectedImpact": number
}
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-pro')
      const optimization = JSON.parse(response.content)
      
      return {
        recommendations: optimization.recommendations || [],
        channelAdjustments: optimization.channelAdjustments || {},
        timingOptimizations: optimization.timingOptimizations || [],
        contentImprovements: optimization.contentImprovements || [],
        targetingRefinements: optimization.targetingRefinements || [],
        expectedImpact: optimization.expectedImpact || 0
      }
    } catch (error) {
      console.error('Campaign optimization error:', error)
      throw new Error(`Failed to optimize campaign: ${error}`)
    }
  }

  async generateConversationResponse(context: string, userMessage: string, agentRole: string): Promise<string> {
    const prompt = `
You are a ${agentRole} having a conversation. 

Context: ${context}
User said: "${userMessage}"

Respond naturally and helpfully as a ${agentRole}. Keep it conversational and focused on moving the conversation forward productively.
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-flash')
      return response.content
    } catch (error) {
      console.error('Conversation response error:', error)
      return "I apologize, but I'm having trouble processing that right now. Could you please repeat your question?"
    }
  }

  async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'neutral' | 'negative', confidence: number, emotions: string[] }> {
    const prompt = `
Analyze the sentiment and emotions in this text:

"${text}"

Provide:
1. Overall sentiment (positive/neutral/negative)
2. Confidence level (0-1)
3. Detected emotions

Format as JSON:
{
  "sentiment": "positive|neutral|negative",
  "confidence": number,
  "emotions": ["emotion1", "emotion2"]
}
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-flash')
      const analysis = JSON.parse(response.content)
      
      return {
        sentiment: analysis.sentiment || 'neutral',
        confidence: analysis.confidence || 0.5,
        emotions: analysis.emotions || []
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error)
      return { sentiment: 'neutral', confidence: 0.5, emotions: [] }
    }
  }

  private calculateConfidence(data: any): number {
    // Calculate confidence based on response metadata
    const safetyRatings = data.candidates?.[0]?.safetyRatings || []
    const finishReason = data.candidates?.[0]?.finishReason
    
    if (finishReason === 'STOP') {
      return 0.9
    } else if (finishReason === 'MAX_TOKENS') {
      return 0.7
    } else {
      return 0.5
    }
  }

  // Batch processing for multiple requests
  async batchAnalyzeLeads(leads: any[]): Promise<LeadAnalysis[]> {
    const analyses = await Promise.all(
      leads.map(lead => this.analyzeLeadQuality(lead))
    )
    return analyses
  }

  async batchGenerateEmails(leads: any[], campaignType: string): Promise<EmailContent[]> {
    const emails = await Promise.all(
      leads.map(lead => this.generateEmailContent(lead, campaignType))
    )
    return emails
  }

  // Real-time conversation for voice calls
  async handleVoiceConversation(transcript: string, context: any): Promise<string> {
    const prompt = `
You are an AI sales agent on a phone call. 

Call Context: ${JSON.stringify(context)}
Customer just said: "${transcript}"

Respond naturally and professionally. Keep responses concise for voice conversation.
Focus on understanding their needs and moving toward a positive outcome.
`

    try {
      const response = await this.generateContent(prompt, 'gemini-2.5-flash')
      return response.content
    } catch (error) {
      console.error('Voice conversation error:', error)
      return "I understand. Let me help you with that."
    }
  }
}