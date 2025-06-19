/**
 * Twilio Service - Real Voice Calls and SMS Integration
 * Powered by Twilio API with AI-driven conversations
 */

import { GeminiAIService } from './GeminiAIService'

export interface TwilioConfig {
  accountSid: string
  authToken: string
  phoneNumber: string
  apiKeySid?: string
  apiKeySecret?: string
}

export interface CallOptions {
  to: string
  from?: string
  url?: string
  method?: 'GET' | 'POST'
  statusCallback?: string
  statusCallbackMethod?: 'GET' | 'POST'
  timeout?: number
  record?: boolean
  machineDetection?: boolean
}

export interface SMSOptions {
  to: string
  from?: string
  body: string
  mediaUrl?: string[]
  statusCallback?: string
}

export interface CallStatus {
  sid: string
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled'
  direction: 'inbound' | 'outbound'
  duration?: number
  startTime?: Date
  endTime?: Date
  price?: string
  recording?: string
}

export interface SMSStatus {
  sid: string
  status: 'queued' | 'sending' | 'sent' | 'failed' | 'delivered' | 'undelivered' | 'receiving' | 'received'
  direction: 'inbound' | 'outbound'
  body: string
  price?: string
  dateCreated: Date
}

export interface VoiceResponse {
  twiml: string
  actions: VoiceAction[]
}

export interface VoiceAction {
  type: 'say' | 'gather' | 'record' | 'dial' | 'hangup' | 'pause' | 'redirect'
  content?: string
  attributes?: Record<string, any>
}

export class TwilioService {
  private static instance: TwilioService
  private config: TwilioConfig
  private geminiAI: GeminiAIService
  private baseUrl = 'https://api.twilio.com/2010-04-01'

  private constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-account-sid',
      authToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-auth-token',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      apiKeySid: process.env.TWILIO_API_KEY_SID || 'your-api-key-sid',
      apiKeySecret: process.env.TWILIO_API_KEY_SECRET || 'your-api-key-secret'
    }
    this.geminiAI = GeminiAIService.getInstance()
  }

  static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService()
    }
    return TwilioService.instance
  }

  private getAuthHeader(): string {
    const credentials = btoa(`${this.config.accountSid}:${this.config.authToken}`)
    return `Basic ${credentials}`
  }

  async makeCall(options: CallOptions): Promise<CallStatus> {
    const url = `${this.baseUrl}/Accounts/${this.config.accountSid}/Calls.json`
    
    const formData = new URLSearchParams({
      To: options.to,
      From: options.from || this.config.phoneNumber,
      Url: options.url || await this.generateVoiceResponseUrl(),
      Method: options.method || 'POST',
      Timeout: (options.timeout || 60).toString(),
      Record: (options.record || true).toString(),
      MachineDetection: (options.machineDetection || true).toString()
    })

    if (options.statusCallback) {
      formData.append('StatusCallback', options.statusCallback)
      formData.append('StatusCallbackMethod', options.statusCallbackMethod || 'POST')
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Twilio API error: ${response.status} ${error}`)
      }

      const data = await response.json()
      
      return {
        sid: data.sid,
        status: data.status,
        direction: data.direction,
        startTime: data.start_time ? new Date(data.start_time) : undefined,
        price: data.price
      }
    } catch (error) {
      console.error('Twilio call error:', error)
      throw new Error(`Failed to make call: ${error}`)
    }
  }

  async sendSMS(options: SMSOptions): Promise<SMSStatus> {
    const url = `${this.baseUrl}/Accounts/${this.config.accountSid}/Messages.json`
    
    const formData = new URLSearchParams({
      To: options.to,
      From: options.from || this.config.phoneNumber,
      Body: options.body
    })

    if (options.mediaUrl && options.mediaUrl.length > 0) {
      options.mediaUrl.forEach(url => formData.append('MediaUrl', url))
    }

    if (options.statusCallback) {
      formData.append('StatusCallback', options.statusCallback)
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Twilio API error: ${response.status} ${error}`)
      }

      const data = await response.json()
      
      return {
        sid: data.sid,
        status: data.status,
        direction: data.direction,
        body: data.body,
        dateCreated: new Date(data.date_created),
        price: data.price
      }
    } catch (error) {
      console.error('Twilio SMS error:', error)
      throw new Error(`Failed to send SMS: ${error}`)
    }
  }

  async getCallStatus(callSid: string): Promise<CallStatus> {
    const url = `${this.baseUrl}/Accounts/${this.config.accountSid}/Calls/${callSid}.json`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader()
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get call status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        sid: data.sid,
        status: data.status,
        direction: data.direction,
        duration: data.duration ? parseInt(data.duration) : undefined,
        startTime: data.start_time ? new Date(data.start_time) : undefined,
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        price: data.price,
        recording: data.recording_url
      }
    } catch (error) {
      console.error('Get call status error:', error)
      throw error
    }
  }

  async getSMSStatus(messageSid: string): Promise<SMSStatus> {
    const url = `${this.baseUrl}/Accounts/${this.config.accountSid}/Messages/${messageSid}.json`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader()
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get SMS status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        sid: data.sid,
        status: data.status,
        direction: data.direction,
        body: data.body,
        dateCreated: new Date(data.date_created),
        price: data.price
      }
    } catch (error) {
      console.error('Get SMS status error:', error)
      throw error
    }
  }

  // AI-Powered Voice Response Generation
  async generateVoiceResponse(leadData: any, callContext?: any): Promise<VoiceResponse> {
    try {
      const script = await this.geminiAI.generateCallScript(leadData, 'qualification')
      
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">${script.opening}</Say>
    <Gather input="speech" timeout="10" speechTimeout="auto" action="/api/voice/gather" method="POST">
        <Say voice="alice">${script.questions[0]}</Say>
    </Gather>
    <Say voice="alice">I didn't catch that. Let me transfer you to a human representative.</Say>
    <Dial>+1234567890</Dial>
</Response>`

      return {
        twiml,
        actions: [
          { type: 'say', content: script.opening },
          { type: 'gather', content: script.questions[0], attributes: { timeout: 10 } }
        ]
      }
    } catch (error) {
      console.error('Voice response generation error:', error)
      
      // Fallback response
      const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Hello! Thank you for your interest in our services. I'm calling to learn more about your needs. How can we help you today?</Say>
    <Gather input="speech" timeout="10" action="/api/voice/gather" method="POST">
        <Say voice="alice">Please tell me about your current challenges.</Say>
    </Gather>
</Response>`

      return {
        twiml: fallbackTwiml,
        actions: [
          { type: 'say', content: 'Hello! Thank you for your interest in our services.' }
        ]
      }
    }
  }

  // AI-Powered SMS Generation
  async generateSMSContent(leadData: any, campaignType: string): Promise<string> {
    try {
      const emailContent = await this.geminiAI.generateEmailContent(leadData, campaignType, 'casual')
      
      // Convert email content to SMS format (shorter, more direct)
      const smsPrompt = `Convert this email content to a concise SMS message (160 characters max):
      
Subject: ${emailContent.subject}
Body: ${emailContent.body}

Make it personal, engaging, and include a clear call-to-action.`

      const response = await this.geminiAI.generateContent(smsPrompt)
      return response.content.substring(0, 160) // Ensure SMS length limit
      
    } catch (error) {
      console.error('SMS content generation error:', error)
      return `Hi ${leadData.firstName || 'there'}! Thanks for your interest. I'd love to chat about how we can help. When's a good time for a quick call?`
    }
  }

  // Batch Operations
  async batchSendSMS(recipients: Array<{ phone: string, leadData: any }>, campaignType: string): Promise<SMSStatus[]> {
    const results = await Promise.all(
      recipients.map(async ({ phone, leadData }) => {
        try {
          const content = await this.generateSMSContent(leadData, campaignType)
          return await this.sendSMS({
            to: phone,
            body: content
          })
        } catch (error) {
          console.error(`Failed to send SMS to ${phone}:`, error)
          throw error
        }
      })
    )
    
    return results
  }

  async batchMakeCalls(recipients: Array<{ phone: string, leadData: any }>): Promise<CallStatus[]> {
    const results = await Promise.all(
      recipients.map(async ({ phone, leadData }) => {
        try {
          const voiceUrl = await this.generateVoiceResponseUrl(leadData)
          return await this.makeCall({
            to: phone,
            url: voiceUrl,
            record: true,
            machineDetection: true
          })
        } catch (error) {
          console.error(`Failed to call ${phone}:`, error)
          throw error
        }
      })
    )
    
    return results
  }

  // Voice Response URL Generation (for webhook endpoints)
  private async generateVoiceResponseUrl(leadData?: any): Promise<string> {
    // In a real implementation, this would be your server endpoint
    // For now, we'll use a placeholder that would serve the TwiML
    return '/api/voice/response' + (leadData ? `?leadId=${leadData.id}` : '')
  }

  // Real-time call handling with AI
  async handleIncomingCall(callSid: string, from: string, to: string): Promise<VoiceResponse> {
    try {
      // Look up lead data based on phone number
      const leadData = await this.lookupLeadByPhone(from)
      
      if (leadData) {
        return await this.generateVoiceResponse(leadData, { type: 'inbound', callSid })
      } else {
        // Handle unknown caller
        const unknownCallerTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Hello! Thank you for calling. I'd be happy to help you learn about our services. May I get your name and company?</Say>
    <Gather input="speech" timeout="10" action="/api/voice/gather-info" method="POST">
        <Say voice="alice">Please tell me your name and company.</Say>
    </Gather>
</Response>`

        return {
          twiml: unknownCallerTwiml,
          actions: [
            { type: 'say', content: 'Hello! Thank you for calling.' }
          ]
        }
      }
    } catch (error) {
      console.error('Incoming call handling error:', error)
      throw error
    }
  }

  async handleVoiceInput(transcript: string, callContext: any): Promise<VoiceResponse> {
    try {
      // Use AI to generate appropriate response
      const aiResponse = await this.geminiAI.handleVoiceConversation(transcript, callContext)
      
      const responseTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">${aiResponse}</Say>
    <Gather input="speech" timeout="10" action="/api/voice/gather" method="POST">
        <Say voice="alice">Is there anything else I can help you with?</Say>
    </Gather>
</Response>`

      return {
        twiml: responseTwiml,
        actions: [
          { type: 'say', content: aiResponse }
        ]
      }
    } catch (error) {
      console.error('Voice input handling error:', error)
      
      const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">I understand. Let me connect you with one of our specialists who can better assist you.</Say>
    <Dial>+1234567890</Dial>
</Response>`

      return {
        twiml: fallbackTwiml,
        actions: [
          { type: 'say', content: 'Let me connect you with a specialist.' }
        ]
      }
    }
  }

  private async lookupLeadByPhone(phoneNumber: string): Promise<any> {
    // This would integrate with your CRM database
    // For now, return mock data
    return {
      id: 'lead-123',
      firstName: 'John',
      lastName: 'Smith',
      company: 'TechCorp',
      phone: phoneNumber,
      status: 'qualified'
    }
  }

  // Analytics and Reporting
  async getCallAnalytics(dateRange: { start: Date, end: Date }): Promise<any> {
    const url = `${this.baseUrl}/Accounts/${this.config.accountSid}/Calls.json`
    const params = new URLSearchParams({
      StartTime: dateRange.start.toISOString(),
      EndTime: dateRange.end.toISOString(),
      PageSize: '1000'
    })

    try {
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': this.getAuthHeader()
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get call analytics: ${response.status}`)
      }

      const data = await response.json()
      
      // Process and analyze the data
      const analytics = {
        totalCalls: data.calls.length,
        completedCalls: data.calls.filter((call: any) => call.status === 'completed').length,
        averageDuration: this.calculateAverageDuration(data.calls),
        successRate: this.calculateSuccessRate(data.calls),
        costAnalysis: this.calculateCostAnalysis(data.calls)
      }

      return analytics
    } catch (error) {
      console.error('Call analytics error:', error)
      throw error
    }
  }

  private calculateAverageDuration(calls: any[]): number {
    const completedCalls = calls.filter(call => call.duration)
    if (completedCalls.length === 0) return 0
    
    const totalDuration = completedCalls.reduce((sum, call) => sum + parseInt(call.duration), 0)
    return Math.round(totalDuration / completedCalls.length)
  }

  private calculateSuccessRate(calls: any[]): number {
    if (calls.length === 0) return 0
    
    const successfulCalls = calls.filter(call => 
      call.status === 'completed' && parseInt(call.duration) > 30
    ).length
    
    return Math.round((successfulCalls / calls.length) * 100)
  }

  private calculateCostAnalysis(calls: any[]): any {
    const totalCost = calls.reduce((sum, call) => {
      return sum + (call.price ? parseFloat(call.price) : 0)
    }, 0)

    return {
      totalCost: totalCost.toFixed(2),
      averageCostPerCall: calls.length > 0 ? (totalCost / calls.length).toFixed(2) : '0.00',
      currency: 'USD'
    }
  }
}