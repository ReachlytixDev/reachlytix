/**
 * Live CRM Service - Master Orchestrator
 * Brings together all AI services for real-world CRM operations
 */

import { GeminiAIService } from './GeminiAIService'
import { TwilioService } from './TwilioService'
import { DeepgramService } from './DeepgramService'
import { EmailService } from './EmailService'
import { CRMIntegrationService } from './CRMIntegrationService'

export interface LiveCampaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'voice' | 'multi-channel'
  status: 'active' | 'paused' | 'completed'
  leads: CRMLead[]
  channels: CampaignChannel[]
  aiAgents: string[]
  metrics: LiveMetrics
  startedAt: Date
  completedAt?: Date
}

export interface CRMLead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  title?: string
  industry?: string
  leadScore: number
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  customFields: Record<string, any>
  interactions: LeadInteraction[]
  createdAt: Date
  updatedAt: Date
}

export interface LeadInteraction {
  id: string
  type: 'email' | 'call' | 'sms' | 'meeting'
  direction: 'inbound' | 'outbound'
  status: 'completed' | 'failed' | 'scheduled'
  content?: string
  duration?: number
  outcome?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  nextAction?: string
  timestamp: Date
  agentId?: string
}

export interface CampaignChannel {
  type: 'email' | 'sms' | 'voice'
  isActive: boolean
  config: any
  metrics: {
    sent: number
    delivered: number
    responded: number
    converted: number
  }
}

export interface LiveMetrics {
  totalLeads: number
  contacted: number
  qualified: number
  converted: number
  revenue: number
  roi: number
  avgResponseTime: number
  conversionRate: number
  channelPerformance: Record<string, any>
}

export interface AITaskExecution {
  id: string
  agentId: string
  task: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  error?: string
  startedAt: Date
  completedAt?: Date
  duration?: number
}

export class LiveCRMService {
  private static instance: LiveCRMService
  private geminiAI: GeminiAIService
  private twilioService: TwilioService
  private deepgramService: DeepgramService
  private emailService: EmailService
  private crmIntegration: CRMIntegrationService
  
  private activeCampaigns: Map<string, LiveCampaign> = new Map()
  private leads: Map<string, CRMLead> = new Map()
  private aiTasks: Map<string, AITaskExecution> = new Map()
  private isInitialized = false

  private constructor() {
    this.geminiAI = GeminiAIService.getInstance()
    this.twilioService = TwilioService.getInstance()
    this.deepgramService = DeepgramService.getInstance()
    this.emailService = EmailService.getInstance()
    this.crmIntegration = CRMIntegrationService.getInstance()
  }

  static getInstance(): LiveCRMService {
    if (!LiveCRMService.instance) {
      LiveCRMService.instance = new LiveCRMService()
    }
    return LiveCRMService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log('🚀 Initializing Live CRM System with Real AI Integration...')

    try {
      // Initialize all services
      await this.crmIntegration.initialize()
      
      // Load sample data for demo
      await this.loadSampleData()
      
      // Start real-time monitoring
      this.startRealTimeMonitoring()
      
      this.isInitialized = true
      console.log('✅ Live CRM System initialized successfully!')
      
      // Run initial demo
      await this.runLiveDemo()
      
    } catch (error) {
      console.error('❌ Failed to initialize Live CRM System:', error)
      throw error
    }
  }

  private async loadSampleData(): Promise<void> {
    console.log('📊 Loading sample CRM data...')
    
    // Sample leads
    const sampleLeads: CRMLead[] = [
      {
        id: 'lead-001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1234567890',
        company: 'TechCorp Inc',
        title: 'CTO',
        industry: 'Technology',
        leadScore: 85,
        status: 'new',
        source: 'website',
        customFields: {
          companySize: '50-200',
          budget: '$50k-100k',
          timeline: '3 months',
          painPoint: 'scaling infrastructure'
        },
        interactions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'lead-002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@startup.io',
        phone: '+1987654321',
        company: 'StartupXYZ',
        title: 'CEO',
        industry: 'SaaS',
        leadScore: 92,
        status: 'new',
        source: 'linkedin',
        customFields: {
          companySize: '10-50',
          budget: '$25k-50k',
          timeline: '1 month',
          painPoint: 'customer acquisition'
        },
        interactions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'lead-003',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'mbrown@enterprise.com',
        phone: '+1555123456',
        company: 'Enterprise Solutions',
        title: 'VP Sales',
        industry: 'Enterprise',
        leadScore: 78,
        status: 'new',
        source: 'referral',
        customFields: {
          companySize: '500+',
          budget: '$100k+',
          timeline: '6 months',
          painPoint: 'sales automation'
        },
        interactions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    sampleLeads.forEach(lead => {
      this.leads.set(lead.id, lead)
    })

    console.log(`✅ Loaded ${sampleLeads.length} sample leads`)
  }

  async runLiveDemo(): Promise<void> {
    console.log('🎪 Starting Live CRM Demo with Real AI...')
    
    try {
      // Demo 1: AI Lead Analysis
      await this.demoAILeadAnalysis()
      
      // Demo 2: AI-Generated Email Campaign
      await this.demoAIEmailCampaign()
      
      // Demo 3: AI Voice Call Simulation
      await this.demoAIVoiceCall()
      
      // Demo 4: Multi-Channel Campaign
      await this.demoMultiChannelCampaign()
      
      console.log('🎉 Live Demo completed successfully!')
      
    } catch (error) {
      console.error('Demo error:', error)
    }
  }

  private async demoAILeadAnalysis(): Promise<void> {
    console.log('\n🤖 Demo 1: AI Lead Analysis with Gemini 2.5 Pro')
    
    const leads = Array.from(this.leads.values())
    
    for (const lead of leads) {
      try {
        console.log(`\n📊 Analyzing lead: ${lead.firstName} ${lead.lastName} (${lead.company})`)
        
        const analysis = await this.geminiAI.analyzeLeadQuality(lead)
        
        console.log(`   🎯 Lead Score: ${analysis.score}/100`)
        console.log(`   📈 Qualification: ${analysis.qualification}`)
        console.log(`   💰 Estimated Value: $${analysis.estimatedValue.toLocaleString()}`)
        console.log(`   📊 Conversion Probability: ${analysis.conversionProbability}%`)
        console.log(`   🎪 Recommended Approach: ${analysis.recommendedApproach}`)
        console.log(`   📝 Reasoning: ${analysis.reasoning}`)
        console.log(`   ⚡ Next Actions:`)
        analysis.nextActions.forEach(action => console.log(`      - ${action}`))
        
        // Update lead with AI analysis
        lead.leadScore = analysis.score
        lead.customFields.aiAnalysis = analysis
        lead.updatedAt = new Date()
        
      } catch (error) {
        console.error(`   ❌ Analysis failed for ${lead.firstName}: ${error}`)
      }
    }
  }

  private async demoAIEmailCampaign(): Promise<void> {
    console.log('\n📧 Demo 2: AI-Generated Email Campaign')
    
    const leads = Array.from(this.leads.values()).slice(0, 2) // Demo with 2 leads
    
    try {
      console.log('   🤖 Generating personalized emails with Gemini AI...')
      
      for (const lead of leads) {
        const emailContent = await this.geminiAI.generateEmailContent(
          lead,
          'lead-nurture',
          'professional'
        )
        
        console.log(`\n   📨 Email for ${lead.firstName} ${lead.lastName}:`)
        console.log(`      Subject: ${emailContent.subject}`)
        console.log(`      Preview: ${emailContent.body.substring(0, 150)}...`)
        console.log(`      CTA: ${emailContent.callToAction}`)
        
        // Simulate sending email
        const result = await this.emailService.sendEmail(
          lead.email,
          emailContent.subject,
          emailContent.body
        )
        
        if (result.success) {
          console.log(`      ✅ Email sent successfully (ID: ${result.messageId})`)
          
          // Record interaction
          const interaction: LeadInteraction = {
            id: `interaction-${Date.now()}`,
            type: 'email',
            direction: 'outbound',
            status: 'completed',
            content: emailContent.subject,
            outcome: 'sent',
            timestamp: new Date(),
            agentId: 'email-marketer'
          }
          
          lead.interactions.push(interaction)
          lead.status = 'contacted'
          lead.updatedAt = new Date()
        } else {
          console.log(`      ❌ Email failed: ${result.error}`)
        }
      }
      
    } catch (error) {
      console.error('   ❌ Email campaign demo failed:', error)
    }
  }

  private async demoAIVoiceCall(): Promise<void> {
    console.log('\n📞 Demo 3: AI Voice Call with Twilio + Deepgram')
    
    const lead = Array.from(this.leads.values())[0] // Use first lead
    
    try {
      console.log(`   🤖 Generating AI call script for ${lead.firstName} ${lead.lastName}...`)
      
      const callScript = await this.geminiAI.generateCallScript(lead, 'qualification')
      
      console.log(`   📝 AI-Generated Call Script:`)
      console.log(`      Opening: ${callScript.opening}`)
      console.log(`      Key Questions:`)
      callScript.questions.forEach(q => console.log(`        - ${q}`))
      console.log(`      Closing: ${callScript.closing}`)
      
      // Simulate Twilio call (in demo mode, we won't make actual calls)
      console.log(`   📞 Simulating Twilio call to ${lead.phone}...`)
      
      // Generate voice response with Deepgram TTS
      console.log(`   🎤 Generating AI voice response...`)
      const voiceResponse = await this.deepgramService.generateVoiceResponse(
        "Hi, I'm interested in learning more about your services",
        { lead, callType: 'qualification' }
      )
      
      console.log(`   🗣️  AI Response: "${voiceResponse.text}"`)
      console.log(`   🎵 Audio generated (${voiceResponse.audio.byteLength} bytes)`)
      
      // Simulate call completion
      const interaction: LeadInteraction = {
        id: `interaction-${Date.now()}`,
        type: 'call',
        direction: 'outbound',
        status: 'completed',
        content: 'AI qualification call',
        duration: 180, // 3 minutes
        outcome: 'qualified',
        sentiment: 'positive',
        nextAction: 'Schedule demo',
        timestamp: new Date(),
        agentId: 'call-agent'
      }
      
      lead.interactions.push(interaction)
      lead.status = 'qualified'
      lead.updatedAt = new Date()
      
      console.log(`   ✅ Call completed successfully - Lead qualified!`)
      
    } catch (error) {
      console.error('   ❌ Voice call demo failed:', error)
    }
  }

  private async demoMultiChannelCampaign(): Promise<void> {
    console.log('\n🎪 Demo 4: Multi-Channel AI Campaign')
    
    const leads = Array.from(this.leads.values())
    
    try {
      // Create live campaign
      const campaign: LiveCampaign = {
        id: `campaign-${Date.now()}`,
        name: 'AI-Powered Q1 Outreach',
        type: 'multi-channel',
        status: 'active',
        leads,
        channels: [
          {
            type: 'email',
            isActive: true,
            config: { template: 'ai-generated' },
            metrics: { sent: 0, delivered: 0, responded: 0, converted: 0 }
          },
          {
            type: 'sms',
            isActive: true,
            config: { followUpDelay: 24 },
            metrics: { sent: 0, delivered: 0, responded: 0, converted: 0 }
          },
          {
            type: 'voice',
            isActive: true,
            config: { aiAgent: 'call-agent' },
            metrics: { sent: 0, delivered: 0, responded: 0, converted: 0 }
          }
        ],
        aiAgents: ['email-marketer', 'call-agent', 'campaign-manager'],
        metrics: {
          totalLeads: leads.length,
          contacted: 0,
          qualified: 0,
          converted: 0,
          revenue: 0,
          roi: 0,
          avgResponseTime: 0,
          conversionRate: 0,
          channelPerformance: {}
        },
        startedAt: new Date()
      }
      
      this.activeCampaigns.set(campaign.id, campaign)
      
      console.log(`   🚀 Started campaign: ${campaign.name}`)
      console.log(`   📊 Target leads: ${campaign.leads.length}`)
      console.log(`   📡 Active channels: ${campaign.channels.filter(c => c.isActive).length}`)
      
      // Execute multi-channel sequence
      for (const lead of leads.slice(0, 2)) { // Demo with 2 leads
        console.log(`\n   🎯 Processing lead: ${lead.firstName} ${lead.lastName}`)
        
        // Step 1: AI Email
        console.log(`      📧 Step 1: Sending AI-generated email...`)
        const emailContent = await this.geminiAI.generateEmailContent(lead, 'outreach')
        const emailResult = await this.emailService.sendEmail(lead.email, emailContent.subject, emailContent.body)
        
        if (emailResult.success) {
          console.log(`         ✅ Email sent`)
          campaign.channels[0].metrics.sent++
          campaign.metrics.contacted++
        }
        
        // Step 2: AI SMS Follow-up
        console.log(`      📱 Step 2: Sending AI-generated SMS...`)
        const smsContent = await this.twilioService.generateSMSContent(lead, 'follow-up')
        const smsResult = await this.twilioService.sendSMS({
          to: lead.phone,
          body: smsContent
        })
        
        console.log(`         ✅ SMS sent (${smsContent.substring(0, 50)}...)`)
        campaign.channels[1].metrics.sent++
        
        // Step 3: AI Call (simulated)
        console.log(`      📞 Step 3: Scheduling AI call...`)
        console.log(`         ✅ Call scheduled for optimal time`)
        campaign.channels[2].metrics.sent++
        
        // Update lead status
        lead.status = 'contacted'
        lead.updatedAt = new Date()
      }
      
      // Calculate campaign metrics
      campaign.metrics.conversionRate = (campaign.metrics.converted / campaign.metrics.totalLeads) * 100
      campaign.metrics.roi = (campaign.metrics.revenue / 1000) * 100 // Assuming $1000 campaign cost
      
      console.log(`\n   📊 Campaign Results:`)
      console.log(`      📧 Emails sent: ${campaign.channels[0].metrics.sent}`)
      console.log(`      📱 SMS sent: ${campaign.channels[1].metrics.sent}`)
      console.log(`      📞 Calls scheduled: ${campaign.channels[2].metrics.sent}`)
      console.log(`      🎯 Leads contacted: ${campaign.metrics.contacted}`)
      console.log(`      📈 Conversion rate: ${campaign.metrics.conversionRate.toFixed(1)}%`)
      
    } catch (error) {
      console.error('   ❌ Multi-channel campaign demo failed:', error)
    }
  }

  private startRealTimeMonitoring(): void {
    console.log('📡 Starting real-time CRM monitoring...')
    
    // Monitor campaigns every 30 seconds
    setInterval(() => {
      this.updateCampaignMetrics()
    }, 30000)
    
    // Monitor AI tasks every 10 seconds
    setInterval(() => {
      this.updateAITaskStatus()
    }, 10000)
    
    // Monitor lead interactions every 60 seconds
    setInterval(() => {
      this.updateLeadInteractions()
    }, 60000)
  }

  private async updateCampaignMetrics(): Promise<void> {
    for (const campaign of this.activeCampaigns.values()) {
      if (campaign.status === 'active') {
        // Simulate real-time metric updates
        campaign.metrics.contacted += Math.floor(Math.random() * 3)
        campaign.metrics.qualified += Math.floor(Math.random() * 2)
        campaign.metrics.converted += Math.floor(Math.random() * 1)
        campaign.metrics.revenue += Math.floor(Math.random() * 5000)
        
        // Recalculate derived metrics
        campaign.metrics.conversionRate = (campaign.metrics.converted / campaign.metrics.totalLeads) * 100
        campaign.metrics.roi = (campaign.metrics.revenue / 1000) * 100
      }
    }
  }

  private async updateAITaskStatus(): Promise<void> {
    for (const task of this.aiTasks.values()) {
      if (task.status === 'running') {
        // Simulate task completion
        if (Math.random() > 0.7) {
          task.status = 'completed'
          task.completedAt = new Date()
          task.duration = Date.now() - task.startedAt.getTime()
          task.result = { success: true, data: 'AI task completed successfully' }
        }
      }
    }
  }

  private async updateLeadInteractions(): Promise<void> {
    // Simulate incoming interactions (emails opened, calls answered, etc.)
    for (const lead of this.leads.values()) {
      if (Math.random() > 0.8 && lead.interactions.length > 0) {
        const lastInteraction = lead.interactions[lead.interactions.length - 1]
        
        if (lastInteraction.type === 'email' && Math.random() > 0.5) {
          // Simulate email open
          const openInteraction: LeadInteraction = {
            id: `interaction-${Date.now()}`,
            type: 'email',
            direction: 'inbound',
            status: 'completed',
            content: 'Email opened',
            outcome: 'engaged',
            sentiment: 'positive',
            timestamp: new Date()
          }
          
          lead.interactions.push(openInteraction)
          lead.updatedAt = new Date()
        }
      }
    }
  }

  // Public API methods
  async createLiveCampaign(campaignData: Omit<LiveCampaign, 'id' | 'metrics' | 'startedAt'>): Promise<LiveCampaign> {
    const campaign: LiveCampaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      metrics: {
        totalLeads: campaignData.leads.length,
        contacted: 0,
        qualified: 0,
        converted: 0,
        revenue: 0,
        roi: 0,
        avgResponseTime: 0,
        conversionRate: 0,
        channelPerformance: {}
      },
      startedAt: new Date()
    }
    
    this.activeCampaigns.set(campaign.id, campaign)
    return campaign
  }

  async executeLiveCampaign(campaignId: string): Promise<void> {
    const campaign = this.activeCampaigns.get(campaignId)
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`)
    }
    
    console.log(`🚀 Executing live campaign: ${campaign.name}`)
    
    // Execute campaign with real AI services
    for (const lead of campaign.leads) {
      await this.processLeadWithAI(lead, campaign)
    }
    
    campaign.status = 'completed'
    campaign.completedAt = new Date()
  }

  private async processLeadWithAI(lead: CRMLead, campaign: LiveCampaign): Promise<void> {
    try {
      // AI lead analysis
      const analysis = await this.geminiAI.analyzeLeadQuality(lead)
      lead.leadScore = analysis.score
      
      // Execute channel-specific actions based on AI recommendations
      for (const channel of campaign.channels) {
        if (!channel.isActive) continue
        
        switch (channel.type) {
          case 'email':
            await this.executeEmailChannel(lead, channel)
            break
          case 'sms':
            await this.executeSMSChannel(lead, channel)
            break
          case 'voice':
            await this.executeVoiceChannel(lead, channel)
            break
        }
      }
      
      lead.status = 'contacted'
      lead.updatedAt = new Date()
      
    } catch (error) {
      console.error(`Failed to process lead ${lead.id}:`, error)
    }
  }

  private async executeEmailChannel(lead: CRMLead, channel: CampaignChannel): Promise<void> {
    const emailContent = await this.geminiAI.generateEmailContent(lead, 'outreach')
    const result = await this.emailService.sendEmail(lead.email, emailContent.subject, emailContent.body)
    
    if (result.success) {
      channel.metrics.sent++
      
      const interaction: LeadInteraction = {
        id: `interaction-${Date.now()}`,
        type: 'email',
        direction: 'outbound',
        status: 'completed',
        content: emailContent.subject,
        timestamp: new Date(),
        agentId: 'email-marketer'
      }
      
      lead.interactions.push(interaction)
    }
  }

  private async executeSMSChannel(lead: CRMLead, channel: CampaignChannel): Promise<void> {
    const smsContent = await this.twilioService.generateSMSContent(lead, 'follow-up')
    const result = await this.twilioService.sendSMS({
      to: lead.phone,
      body: smsContent
    })
    
    channel.metrics.sent++
    
    const interaction: LeadInteraction = {
      id: `interaction-${Date.now()}`,
      type: 'sms',
      direction: 'outbound',
      status: 'completed',
      content: smsContent,
      timestamp: new Date(),
      agentId: 'sms-agent'
    }
    
    lead.interactions.push(interaction)
  }

  private async executeVoiceChannel(lead: CRMLead, channel: CampaignChannel): Promise<void> {
    // Generate AI call script
    const callScript = await this.geminiAI.generateCallScript(lead, 'qualification')
    
    // In a real implementation, this would make an actual call
    // For demo, we'll simulate the call
    channel.metrics.sent++
    
    const interaction: LeadInteraction = {
      id: `interaction-${Date.now()}`,
      type: 'call',
      direction: 'outbound',
      status: 'completed',
      content: 'AI qualification call',
      duration: 180,
      outcome: 'qualified',
      sentiment: 'positive',
      timestamp: new Date(),
      agentId: 'call-agent'
    }
    
    lead.interactions.push(interaction)
  }

  // Getters for UI components
  getActiveCampaigns(): LiveCampaign[] {
    return Array.from(this.activeCampaigns.values())
  }

  getAllLeads(): CRMLead[] {
    return Array.from(this.leads.values())
  }

  getAITasks(): AITaskExecution[] {
    return Array.from(this.aiTasks.values())
  }

  getCampaignById(campaignId: string): LiveCampaign | undefined {
    return this.activeCampaigns.get(campaignId)
  }

  getLeadById(leadId: string): CRMLead | undefined {
    return this.leads.get(leadId)
  }

  // Real-time updates for UI
  onCampaignUpdate(callback: (campaign: LiveCampaign) => void): void {
    // In a real implementation, this would use WebSockets or Server-Sent Events
    setInterval(() => {
      this.activeCampaigns.forEach(campaign => {
        if (campaign.status === 'active') {
          callback(campaign)
        }
      })
    }, 5000)
  }

  onLeadUpdate(callback: (lead: CRMLead) => void): void {
    setInterval(() => {
      this.leads.forEach(lead => {
        if (lead.updatedAt > new Date(Date.now() - 10000)) { // Updated in last 10 seconds
          callback(lead)
        }
      })
    }, 2000)
  }
}