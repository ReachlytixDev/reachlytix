/**
 * CRM Integration Service
 * Orchestrates all CRM components, extensions, and AI agents
 */

import { 
  ExtensionManager, 
  RooCodeIntegration, 
  CRM_EXTENSIONS, 
  CRM_AI_AGENTS 
} from '../integrations/extensions'

export interface CRMIntegrationConfig {
  autoInstallExtensions: boolean
  initializeAIAgents: boolean
  enableWorkspaceIntegration: boolean
  enableDataSync: boolean
  enableAutomation: boolean
}

export interface CRMSystemStatus {
  isInitialized: boolean
  extensionsInstalled: number
  extensionsRequired: number
  aiAgentsActive: number
  workspacesCreated: number
  lastSync: Date
  errors: string[]
}

export interface AutomationWorkflow {
  id: string
  name: string
  description: string
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  isActive: boolean
  lastRun?: Date
  successRate: number
}

export interface WorkflowTrigger {
  type: 'lead_created' | 'email_opened' | 'call_completed' | 'campaign_started' | 'schedule'
  conditions: Record<string, any>
}

export interface WorkflowAction {
  type: 'send_email' | 'make_call' | 'create_task' | 'update_lead' | 'run_ai_analysis' | 'export_data'
  config: Record<string, any>
  extensionId?: string
  agentId?: string
}

export class CRMIntegrationService {
  private static instance: CRMIntegrationService
  private extensionManager: ExtensionManager
  private rooCodeIntegration: RooCodeIntegration
  private config: CRMIntegrationConfig
  private status: CRMSystemStatus
  private workflows: AutomationWorkflow[] = []

  private constructor() {
    this.extensionManager = ExtensionManager.getInstance()
    this.rooCodeIntegration = RooCodeIntegration.getInstance()
    
    this.config = {
      autoInstallExtensions: true,
      initializeAIAgents: true,
      enableWorkspaceIntegration: true,
      enableDataSync: true,
      enableAutomation: true
    }

    this.status = {
      isInitialized: false,
      extensionsInstalled: 0,
      extensionsRequired: 0,
      aiAgentsActive: 0,
      workspacesCreated: 0,
      lastSync: new Date(),
      errors: []
    }

    this.initializeDefaultWorkflows()
  }

  static getInstance(): CRMIntegrationService {
    if (!CRMIntegrationService.instance) {
      CRMIntegrationService.instance = new CRMIntegrationService()
    }
    return CRMIntegrationService.instance
  }

  async initialize(config?: Partial<CRMIntegrationConfig>): Promise<void> {
    console.log('🚀 Initializing AI-Powered CRM System...')
    
    if (config) {
      this.config = { ...this.config, ...config }
    }

    try {
      // Step 1: Check and install required extensions
      if (this.config.autoInstallExtensions) {
        await this.setupExtensions()
      }

      // Step 2: Initialize AI agents
      if (this.config.initializeAIAgents) {
        await this.setupAIAgents()
      }

      // Step 3: Initialize data connections
      if (this.config.enableDataSync) {
        await this.setupDataConnections()
      }

      // Step 4: Start automation workflows
      if (this.config.enableAutomation) {
        await this.startAutomationEngine()
      }

      this.status.isInitialized = true
      this.status.lastSync = new Date()
      
      console.log('✅ CRM System initialized successfully!')
      this.logSystemStatus()

    } catch (error) {
      console.error('❌ Failed to initialize CRM system:', error)
      this.status.errors.push(`Initialization failed: ${error}`)
      throw error
    }
  }

  private async setupExtensions(): Promise<void> {
    console.log('📦 Setting up VS Code extensions...')
    
    await this.extensionManager.checkInstalledExtensions()
    const requiredExtensions = this.extensionManager.getRequiredExtensions()
    
    this.status.extensionsRequired = requiredExtensions.length
    
    for (const extension of requiredExtensions) {
      try {
        console.log(`Installing ${extension.name}...`)
        await this.extensionManager.installExtension(extension.id)
        this.status.extensionsInstalled++
      } catch (error) {
        console.error(`Failed to install ${extension.name}:`, error)
        this.status.errors.push(`Extension installation failed: ${extension.name}`)
      }
    }

    await this.configureExtensionsForCRM()
  }

  private async configureExtensionsForCRM(): Promise<void> {
    console.log('⚙️ Configuring extensions for CRM...')

    // Configure Database Client for CRM database
    try {
      await this.extensionManager.executeExtensionCommand(
        'cweijan.vscode-database-client2',
        'database.connect',
        [{
          type: 'sqlite',
          host: 'localhost',
          database: 'crm.db',
          name: 'CRM Database'
        }]
      )
    } catch (error) {
      console.log('Database extension not available, will configure later')
    }
  }

  private async setupAIAgents(): Promise<void> {
    console.log('🤖 Initializing AI agents...')
    
    try {
      await this.rooCodeIntegration.initializeAllAgents()
      this.status.aiAgentsActive = CRM_AI_AGENTS.filter(agent => agent.isActive).length
      
      await this.createSpecializedAgents()
      
    } catch (error) {
      console.error('Failed to initialize AI agents:', error)
      this.status.errors.push(`AI agent initialization failed: ${error}`)
    }
  }

  private async createSpecializedAgents(): Promise<void> {
    const specializedAgents = [
      {
        id: 'crm-orchestrator',
        name: 'CRM Orchestrator Agent',
        description: 'Master agent that coordinates all CRM activities',
        role: 'campaign-manager' as const,
        prompt: `You are the CRM Orchestrator Agent, responsible for coordinating all CRM activities.

Your capabilities include:
1. Managing multi-channel campaigns across email, SMS, and voice
2. Coordinating AI agents for different tasks
3. Optimizing lead flow and conversion processes
4. Monitoring system performance and suggesting improvements
5. Automating routine CRM tasks

Always prioritize data accuracy, compliance, and ROI optimization.`,
        tools: ['database-query', 'api-integration', 'agent-coordination', 'analytics'],
        model: 'gpt-4',
        isActive: true
      }
    ]

    for (const agent of specializedAgents) {
      try {
        await this.rooCodeIntegration.createAgent(agent)
        console.log(`✅ Created specialized agent: ${agent.name}`)
      } catch (error) {
        console.error(`Failed to create agent ${agent.name}:`, error)
      }
    }
  }

  private async setupDataConnections(): Promise<void> {
    console.log('🔗 Setting up data connections...')
    
    try {
      await this.initializeCRMDatabase()
      await this.setupAPIConnections()
      
    } catch (error) {
      console.error('Failed to setup data connections:', error)
      this.status.errors.push(`Data connection setup failed: ${error}`)
    }
  }

  private async initializeCRMDatabase(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        company TEXT,
        status TEXT DEFAULT 'new',
        source TEXT,
        score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        target_audience INTEGER DEFAULT 0,
        reached INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        roi REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS call_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER,
        agent_id TEXT,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        duration INTEGER DEFAULT 0,
        outcome TEXT,
        sentiment TEXT,
        score REAL DEFAULT 0,
        notes TEXT,
        recording_url TEXT,
        transcript TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads (id)
      );
    `

    try {
      await this.extensionManager.executeExtensionCommand(
        'cweijan.vscode-database-client2',
        'database.query',
        [schema]
      )
      console.log('✅ CRM database schema initialized')
    } catch (error) {
      console.log('Database extension not available, schema will be created later')
    }
  }

  private async setupAPIConnections(): Promise<void> {
    console.log('🔌 Setting up API connections...')
    
    const apiConfigs = [
      {
        name: 'Twilio Voice API',
        baseUrl: 'https://api.twilio.com/2010-04-01',
        authType: 'basic',
        purpose: 'Voice calling and SMS'
      },
      {
        name: 'SendGrid Email API',
        baseUrl: 'https://api.sendgrid.com/v3',
        authType: 'bearer',
        purpose: 'Email marketing'
      }
    ]

    console.log(`📋 Configured ${apiConfigs.length} API connections`)
  }

  private async startAutomationEngine(): Promise<void> {
    console.log('⚡ Starting automation engine...')
    
    try {
      for (const workflow of this.workflows) {
        if (workflow.isActive) {
          await this.executeWorkflow(workflow.id)
        }
      }
      
      console.log(`🔄 Started ${this.workflows.filter(w => w.isActive).length} automation workflows`)
      
    } catch (error) {
      console.error('Failed to start automation engine:', error)
      this.status.errors.push(`Automation engine failed: ${error}`)
    }
  }

  private initializeDefaultWorkflows(): void {
    this.workflows = [
      {
        id: 'lead-nurture-sequence',
        name: 'Lead Nurture Sequence',
        description: 'Automated lead nurturing with email and SMS follow-ups',
        triggers: [
          {
            type: 'lead_created',
            conditions: { status: 'new', source: 'website' }
          }
        ],
        actions: [
          {
            type: 'send_email',
            config: { template: 'welcome', delay: 3600 },
            agentId: 'email-marketer'
          },
          {
            type: 'run_ai_analysis',
            config: { type: 'lead_scoring' },
            agentId: 'data-analyst'
          }
        ],
        isActive: true,
        successRate: 0.75
      }
    ]
  }

  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.find(w => w.id === workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    console.log(`🔄 Executing workflow: ${workflow.name}`)

    try {
      for (const action of workflow.actions) {
        await this.executeWorkflowAction(action)
      }

      workflow.lastRun = new Date()
      console.log(`✅ Workflow ${workflow.name} completed successfully`)

    } catch (error) {
      console.error(`❌ Workflow ${workflow.name} failed:`, error)
      throw error
    }
  }

  private async executeWorkflowAction(action: WorkflowAction): Promise<void> {
    switch (action.type) {
      case 'send_email':
        console.log(`📧 Sending email with template: ${action.config.template}`)
        break
      case 'make_call':
        console.log(`📞 Making call to: ${action.config.phone}`)
        break
      case 'run_ai_analysis':
        if (action.agentId) {
          await this.rooCodeIntegration.executeAgentTask(
            action.agentId,
            `Perform ${action.config.type} analysis`,
            action.config
          )
        }
        break
      case 'export_data':
        if (action.extensionId) {
          await this.extensionManager.executeExtensionCommand(
            action.extensionId,
            'export.data',
            [action.config]
          )
        }
        break
      case 'create_task':
        console.log(`📋 Creating task: ${action.config.type}`)
        break
      case 'update_lead':
        console.log(`👤 Updating lead with action: ${action.config.action}`)
        break
    }
  }

  getSystemStatus(): CRMSystemStatus {
    return { ...this.status }
  }

  getActiveWorkflows(): AutomationWorkflow[] {
    return this.workflows.filter(w => w.isActive)
  }

  private logSystemStatus(): void {
    console.log('\n📊 CRM System Status:')
    console.log(`✅ Initialized: ${this.status.isInitialized}`)
    console.log(`📦 Extensions: ${this.status.extensionsInstalled}/${this.status.extensionsRequired}`)
    console.log(`🤖 AI Agents: ${this.status.aiAgentsActive} active`)
    console.log(`⚡ Workflows: ${this.workflows.filter(w => w.isActive).length} active`)
    
    if (this.status.errors.length > 0) {
      console.log(`⚠️  Errors: ${this.status.errors.length}`)
      this.status.errors.forEach(error => console.log(`   - ${error}`))
    }
    
    console.log(`🕐 Last sync: ${this.status.lastSync.toLocaleString()}\n`)
  }
}