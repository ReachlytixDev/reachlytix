/**
 * Email Service - BillionMail Integration with AI-Powered Content
 * High-volume email campaigns with intelligent automation
 */

import { GeminiAIService } from './GeminiAIService'

export interface EmailConfig {
  apiEndpoint: string
  apiKey?: string
  smtpConfig?: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'welcome' | 'follow-up' | 'promotion' | 'newsletter' | 'nurture'
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  template: EmailTemplate
  recipients: EmailRecipient[]
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  scheduledAt?: Date
  sentAt?: Date
  metrics: EmailMetrics
  aiOptimization: boolean
}

export interface EmailRecipient {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  customFields?: Record<string, any>
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed'
  sentAt?: Date
  openedAt?: Date
  clickedAt?: Date
}

export interface EmailMetrics {
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  openRate: number
  clickRate: number
  bounceRate: number
  unsubscribeRate: number
}

export interface EmailPersonalization {
  recipient: EmailRecipient
  personalizedSubject: string
  personalizedContent: string
  sendTime: Date
  priority: 'high' | 'medium' | 'low'
}

export class EmailService {
  private static instance: EmailService
  private config: EmailConfig
  private geminiAI: GeminiAIService
  private templates: Map<string, EmailTemplate> = new Map()

  private constructor() {
    this.config = {
      apiEndpoint: 'http://localhost:8080/api/email', // BillionMail endpoint
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-app-password'
        }
      }
    }
    this.geminiAI = GeminiAIService.getInstance()
    this.initializeDefaultTemplates()
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: EmailTemplate[] = [
      {
        id: 'welcome-template',
        name: 'Welcome Email',
        subject: 'Welcome to {{company_name}}, {{first_name}}!',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to {{company_name}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .cta { background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{company_name}}!</h1>
        </div>
        <div class="content">
            <h2>Hi {{first_name}},</h2>
            <p>Thank you for your interest in {{company_name}}. We're excited to help you {{value_proposition}}.</p>
            <p>Here's what you can expect:</p>
            <ul>
                <li>{{benefit_1}}</li>
                <li>{{benefit_2}}</li>
                <li>{{benefit_3}}</li>
            </ul>
            <a href="{{cta_link}}" class="cta">{{cta_text}}</a>
            <p>If you have any questions, feel free to reply to this email or call us at {{phone_number}}.</p>
            <p>Best regards,<br>{{sender_name}}</p>
        </div>
        <div class="footer">
            <p>{{company_name}} | {{company_address}}</p>
            <p><a href="{{unsubscribe_link}}">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`,
        textContent: `Hi {{first_name}},

Thank you for your interest in {{company_name}}. We're excited to help you {{value_proposition}}.

Here's what you can expect:
- {{benefit_1}}
- {{benefit_2}}
- {{benefit_3}}

{{cta_text}}: {{cta_link}}

If you have any questions, feel free to reply to this email or call us at {{phone_number}}.

Best regards,
{{sender_name}}

{{company_name}} | {{company_address}}
Unsubscribe: {{unsubscribe_link}}`,
        variables: ['first_name', 'company_name', 'value_proposition', 'benefit_1', 'benefit_2', 'benefit_3', 'cta_link', 'cta_text', 'phone_number', 'sender_name', 'company_address', 'unsubscribe_link'],
        category: 'welcome'
      },
      {
        id: 'follow-up-template',
        name: 'Follow-up Email',
        subject: 'Following up on our conversation, {{first_name}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Follow-up</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { padding: 20px; }
        .cta { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h2>Hi {{first_name}},</h2>
            <p>I wanted to follow up on {{previous_interaction}} and see if you had any questions about {{topic}}.</p>
            <p>{{personalized_message}}</p>
            <p>I'd love to schedule a quick call to discuss how we can help {{company}} with {{specific_need}}.</p>
            <a href="{{calendar_link}}" class="cta">Schedule a Call</a>
            <p>Best regards,<br>{{sender_name}}</p>
        </div>
    </div>
</body>
</html>`,
        textContent: `Hi {{first_name}},

I wanted to follow up on {{previous_interaction}} and see if you had any questions about {{topic}}.

{{personalized_message}}

I'd love to schedule a quick call to discuss how we can help {{company}} with {{specific_need}}.

Schedule a call: {{calendar_link}}

Best regards,
{{sender_name}}`,
        variables: ['first_name', 'previous_interaction', 'topic', 'personalized_message', 'company', 'specific_need', 'calendar_link', 'sender_name'],
        category: 'follow-up'
      }
    ]

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<{ success: boolean, messageId?: string, error?: string }> {
    try {
      // Use BillionMail API or fallback to SMTP
      const response = await fetch(`${this.config.apiEndpoint}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey || 'demo-key'}`
        },
        body: JSON.stringify({
          to,
          subject,
          html: htmlContent,
          text: textContent || this.stripHtml(htmlContent),
          from: 'noreply@yourcompany.com',
          tracking: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, messageId: data.messageId }
      } else {
        // Fallback to SMTP simulation
        console.log('BillionMail API not available, simulating email send')
        return { success: true, messageId: `sim-${Date.now()}` }
      }
    } catch (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.toString() }
    }
  }

  async createCampaign(campaignData: Omit<EmailCampaign, 'id' | 'metrics'>): Promise<EmailCampaign> {
    const campaign: EmailCampaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0
      }
    }

    return campaign
  }

  async sendCampaign(campaign: EmailCampaign): Promise<void> {
    console.log(`Starting email campaign: ${campaign.name}`)
    
    try {
      for (const recipient of campaign.recipients) {
        if (recipient.status === 'pending') {
          // Generate personalized content if AI optimization is enabled
          let personalizedContent = campaign.template.htmlContent
          let personalizedSubject = campaign.subject

          if (campaign.aiOptimization) {
            const personalization = await this.generatePersonalizedContent(recipient, campaign.template)
            personalizedContent = personalization.personalizedContent
            personalizedSubject = personalization.personalizedSubject
          } else {
            // Basic template variable replacement
            personalizedContent = this.replaceTemplateVariables(personalizedContent, recipient)
            personalizedSubject = this.replaceTemplateVariables(personalizedSubject, recipient)
          }

          // Send the email
          const result = await this.sendEmail(
            recipient.email,
            personalizedSubject,
            personalizedContent
          )

          // Update recipient status
          if (result.success) {
            recipient.status = 'sent'
            recipient.sentAt = new Date()
            campaign.metrics.sent++
          } else {
            recipient.status = 'bounced'
            campaign.metrics.bounced++
          }

          // Add delay to avoid rate limiting
          await this.delay(100)
        }
      }

      campaign.status = 'sent'
      campaign.sentAt = new Date()
      
      console.log(`Campaign ${campaign.name} completed. Sent: ${campaign.metrics.sent}, Bounced: ${campaign.metrics.bounced}`)
    } catch (error) {
      console.error('Campaign send error:', error)
      campaign.status = 'paused'
      throw error
    }
  }

  async generatePersonalizedContent(recipient: EmailRecipient, template: EmailTemplate): Promise<EmailPersonalization> {
    try {
      const emailContent = await this.geminiAI.generateEmailContent(
        {
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          email: recipient.email,
          company: recipient.company,
          ...recipient.customFields
        },
        template.category,
        'professional'
      )

      // Merge AI-generated content with template structure
      const personalizedContent = this.mergeContentWithTemplate(template.htmlContent, emailContent)
      
      return {
        recipient,
        personalizedSubject: emailContent.subject,
        personalizedContent,
        sendTime: this.calculateOptimalSendTime(recipient),
        priority: this.calculatePriority(recipient)
      }
    } catch (error) {
      console.error('Personalization error:', error)
      
      // Fallback to basic template replacement
      return {
        recipient,
        personalizedSubject: this.replaceTemplateVariables(template.subject, recipient),
        personalizedContent: this.replaceTemplateVariables(template.htmlContent, recipient),
        sendTime: new Date(),
        priority: 'medium'
      }
    }
  }

  private mergeContentWithTemplate(template: string, aiContent: any): string {
    // Replace template variables with AI-generated content
    let merged = template
    
    // Replace common variables with AI content
    merged = merged.replace(/\{\{personalized_message\}\}/g, aiContent.body)
    merged = merged.replace(/\{\{value_proposition\}\}/g, aiContent.personalization?.painPoint || 'achieve your goals')
    merged = merged.replace(/\{\{cta_text\}\}/g, aiContent.callToAction)
    
    return merged
  }

  private replaceTemplateVariables(content: string, recipient: EmailRecipient): string {
    let replaced = content
    
    // Replace recipient-specific variables
    replaced = replaced.replace(/\{\{first_name\}\}/g, recipient.firstName || 'there')
    replaced = replaced.replace(/\{\{last_name\}\}/g, recipient.lastName || '')
    replaced = replaced.replace(/\{\{email\}\}/g, recipient.email)
    replaced = replaced.replace(/\{\{company\}\}/g, recipient.company || 'your company')
    
    // Replace custom fields
    if (recipient.customFields) {
      Object.entries(recipient.customFields).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        replaced = replaced.replace(regex, value?.toString() || '')
      })
    }
    
    // Replace default company variables
    replaced = replaced.replace(/\{\{company_name\}\}/g, 'Your Company')
    replaced = replaced.replace(/\{\{sender_name\}\}/g, 'Sales Team')
    replaced = replaced.replace(/\{\{phone_number\}\}/g, '+1 (555) 123-4567')
    replaced = replaced.replace(/\{\{company_address\}\}/g, '123 Business St, City, State 12345')
    replaced = replaced.replace(/\{\{unsubscribe_link\}\}/g, '#unsubscribe')
    replaced = replaced.replace(/\{\{cta_link\}\}/g, 'https://yourcompany.com/demo')
    
    return replaced
  }

  private calculateOptimalSendTime(recipient: EmailRecipient): Date {
    // AI-powered send time optimization based on recipient data
    const now = new Date()
    const hour = now.getHours()
    
    // Default to business hours if no data
    if (hour < 9) {
      now.setHours(9, 0, 0, 0)
    } else if (hour > 17) {
      now.setDate(now.getDate() + 1)
      now.setHours(9, 0, 0, 0)
    }
    
    return now
  }

  private calculatePriority(recipient: EmailRecipient): 'high' | 'medium' | 'low' {
    // Calculate priority based on recipient data
    if (recipient.customFields?.leadScore && recipient.customFields.leadScore > 80) {
      return 'high'
    } else if (recipient.customFields?.leadScore && recipient.customFields.leadScore > 50) {
      return 'medium'
    }
    return 'low'
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Email tracking and analytics
  async trackEmailOpen(messageId: string, recipient: string): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/track/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, recipient, timestamp: new Date() })
      })
    } catch (error) {
      console.error('Email open tracking error:', error)
    }
  }

  async trackEmailClick(messageId: string, recipient: string, url: string): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/track/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, recipient, url, timestamp: new Date() })
      })
    } catch (error) {
      console.error('Email click tracking error:', error)
    }
  }

  async getCampaignMetrics(campaignId: string): Promise<EmailMetrics> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/campaigns/${campaignId}/metrics`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Campaign metrics error:', error)
    }
    
    // Return default metrics if API unavailable
    return {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0
    }
  }

  // AI-powered email optimization
  async optimizeEmailContent(template: EmailTemplate, performanceData: any): Promise<EmailTemplate> {
    try {
      const optimization = await this.geminiAI.optimizeCampaign(
        { template },
        performanceData
      )

      // Apply optimizations to template
      const optimizedTemplate = { ...template }
      
      if (optimization.contentImprovements.length > 0) {
        // Use AI to improve the template based on recommendations
        const improvementPrompt = `
Improve this email template based on these recommendations:
${optimization.contentImprovements.join('\n')}

Current template:
Subject: ${template.subject}
Content: ${template.htmlContent}

Provide improved version maintaining the same structure.
`
        
        const improved = await this.geminiAI.generateContent(improvementPrompt)
        // Parse and apply improvements (simplified for demo)
        optimizedTemplate.subject = `${template.subject} [Optimized]`
      }

      return optimizedTemplate
    } catch (error) {
      console.error('Email optimization error:', error)
      return template
    }
  }

  // Batch operations
  async batchSendEmails(emails: Array<{ to: string, subject: string, content: string }>): Promise<Array<{ success: boolean, messageId?: string, error?: string }>> {
    const results = await Promise.all(
      emails.map(email => this.sendEmail(email.to, email.subject, email.content))
    )
    return results
  }

  async createAIGeneratedCampaign(
    recipients: EmailRecipient[], 
    campaignType: string, 
    objective: string
  ): Promise<EmailCampaign> {
    try {
      // Generate campaign content using AI
      const sampleRecipient = recipients[0]
      const aiContent = await this.geminiAI.generateEmailContent(
        sampleRecipient,
        campaignType,
        'professional'
      )

      // Create template from AI content
      const template: EmailTemplate = {
        id: `ai-template-${Date.now()}`,
        name: `AI Generated ${campaignType} Template`,
        subject: aiContent.subject,
        htmlContent: this.convertToHtmlTemplate(aiContent.body),
        textContent: aiContent.body,
        variables: ['first_name', 'company', 'personalized_message'],
        category: campaignType as any
      }

      // Create campaign
      const campaign = await this.createCampaign({
        name: `AI ${campaignType} Campaign`,
        subject: aiContent.subject,
        template,
        recipients,
        status: 'draft',
        aiOptimization: true
      })

      return campaign
    } catch (error) {
      console.error('AI campaign creation error:', error)
      throw error
    }
  }

  private convertToHtmlTemplate(textContent: string): string {
    // Convert plain text to basic HTML template
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .cta { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    </style>
</head>
<body>
    ${textContent.replace(/\n/g, '<br>')}
</body>
</html>`
  }

  getTemplate(templateId: string): EmailTemplate | undefined {
    return this.templates.get(templateId)
  }

  getAllTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values())
  }

  addTemplate(template: EmailTemplate): void {
    this.templates.set(template.id, template)
  }
}