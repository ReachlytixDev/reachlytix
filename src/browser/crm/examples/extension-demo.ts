/**
 * CRM Extension Integration Demo
 * This file demonstrates how to use the extension integration features
 */

import { 
  ExtensionManager, 
  RooCodeIntegration, 
  CRMWorkspaceManager 
} from '../integrations/extensions'
import { CRMWorkspaceManager as WorkspaceManager } from '../integrations/workspace'

// Demo: Setting up the CRM with extension integrations
export async function setupCRMDemo() {
  console.log('🚀 Starting CRM Extension Integration Demo...')

  // 1. Initialize Extension Manager
  const extensionManager = ExtensionManager.getInstance()
  await extensionManager.checkInstalledExtensions()

  // 2. Install required extensions
  console.log('📦 Installing required extensions...')
  const requiredExtensions = extensionManager.getRequiredExtensions()
  
  for (const extension of requiredExtensions) {
    console.log(`Installing ${extension.name}...`)
    await extensionManager.installExtension(extension.id)
  }

  // 3. Initialize AI agents
  console.log('🤖 Setting up AI agents...')
  const rooCodeIntegration = RooCodeIntegration.getInstance()
  await rooCodeIntegration.initializeAllAgents()

  // 4. Create a sample workspace
  console.log('📁 Creating sample workspace...')
  const workspaceManager = CRMWorkspaceManager.getInstance()
  const workspace = await workspaceManager.createWorkspace('lead-generation', 'Demo Lead Generation')

  console.log('✅ CRM setup complete!')
  return { extensionManager, rooCodeIntegration, workspaceManager, workspace }
}

// Demo: Lead generation workflow using extensions
export async function leadGenerationDemo() {
  console.log('🎯 Starting Lead Generation Demo...')

  const { extensionManager, rooCodeIntegration, workspaceManager } = await setupCRMDemo()

  // 1. Create a lead generation project
  const project = await workspaceManager.createProject('demo-workspace', {
    name: 'Q1 Lead Generation Campaign',
    description: 'Generate leads for software companies in the US',
    agents: ['lead-generator', 'data-analyst'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  })

  // 2. Add tasks to the project
  await workspaceManager.addTaskToProject(project.id, {
    title: 'Research Target Companies',
    description: 'Find software companies with 50-500 employees',
    type: 'data-collection',
    status: 'pending',
    estimatedTime: 120, // 2 hours
    dependencies: [],
    files: ['data/target-companies.csv']
  })

  await workspaceManager.addTaskToProject(project.id, {
    title: 'Validate Contact Information',
    description: 'Verify email addresses and phone numbers',
    type: 'data-collection',
    status: 'pending',
    estimatedTime: 60, // 1 hour
    dependencies: ['research-target-companies'],
    files: ['data/validated-contacts.csv']
  })

  await workspaceManager.addTaskToProject(project.id, {
    title: 'Generate Outreach Templates',
    description: 'Create personalized email templates',
    type: 'automation',
    status: 'pending',
    estimatedTime: 90, // 1.5 hours
    dependencies: ['validate-contact-information'],
    files: ['templates/outreach-email.html']
  })

  // 3. Execute tasks using AI agents
  console.log('🤖 Executing tasks with AI agents...')

  // Task 1: Research using Lead Generator Agent
  await rooCodeIntegration.executeAgentTask(
    'lead-generator',
    'Research software companies in the US with 50-500 employees. Focus on companies that might need CRM solutions.',
    {
      criteria: {
        industry: 'software',
        employeeCount: { min: 50, max: 500 },
        location: 'United States',
        keywords: ['CRM', 'sales', 'marketing', 'customer management']
      },
      outputFormat: 'csv',
      maxResults: 100
    }
  )

  // Task 2: Data validation using Data Analyst Agent
  await rooCodeIntegration.executeAgentTask(
    'data-analyst',
    'Validate and clean the lead data. Check email formats, remove duplicates, and score leads.',
    {
      inputFile: 'data/target-companies.csv',
      validationRules: {
        emailFormat: true,
        removeDuplicates: true,
        scoreLeads: true
      },
      outputFile: 'data/validated-contacts.csv'
    }
  )

  // Task 3: Template generation using Email Marketing Agent
  await rooCodeIntegration.executeAgentTask(
    'email-marketer',
    'Create personalized email templates for outreach to software companies.',
    {
      templateType: 'cold-outreach',
      personalization: ['company_name', 'industry', 'employee_count'],
      tone: 'professional',
      callToAction: 'schedule_demo'
    }
  )

  console.log('✅ Lead generation workflow complete!')
  return project
}

// Demo: Data analysis workflow using extensions
export async function dataAnalysisDemo() {
  console.log('📊 Starting Data Analysis Demo...')

  const { extensionManager, rooCodeIntegration } = await setupCRMDemo()

  // 1. Open CSV data with Rainbow CSV extension
  console.log('📈 Opening lead data with Rainbow CSV...')
  await extensionManager.executeExtensionCommand(
    'mechatroner.rainbow-csv',
    'rainbow-csv.query',
    ['data/leads.csv']
  )

  // 2. Connect to database with Database Client
  console.log('🗄️ Connecting to CRM database...')
  await extensionManager.executeExtensionCommand(
    'cweijan.vscode-database-client2',
    'database.connect'
  )

  // 3. Execute analysis queries
  console.log('🔍 Running analysis queries...')
  const queries = [
    'SELECT status, COUNT(*) as count FROM leads GROUP BY status',
    'SELECT DATE(created_at) as date, COUNT(*) as daily_leads FROM leads GROUP BY DATE(created_at)',
    'SELECT company_size, AVG(lead_score) as avg_score FROM leads GROUP BY company_size'
  ]

  for (const query of queries) {
    await extensionManager.executeExtensionCommand(
      'cweijan.vscode-database-client2',
      'database.query',
      [query]
    )
  }

  // 4. Generate analysis report using Data Analyst Agent
  console.log('📋 Generating analysis report...')
  await rooCodeIntegration.executeAgentTask(
    'data-analyst',
    'Analyze the CRM data and generate a comprehensive report with insights and recommendations.',
    {
      dataSource: 'crm-database',
      analysisType: 'comprehensive',
      includeCharts: true,
      outputFormat: 'markdown',
      sections: [
        'lead_conversion_rates',
        'source_performance',
        'seasonal_trends',
        'recommendations'
      ]
    }
  )

  console.log('✅ Data analysis complete!')
}

// Demo: API integration workflow
export async function apiIntegrationDemo() {
  console.log('🔌 Starting API Integration Demo...')

  const { extensionManager, rooCodeIntegration } = await setupCRMDemo()

  // 1. Set up Thunder Client for API testing
  console.log('⚡ Setting up Thunder Client...')
  await extensionManager.executeExtensionCommand(
    'rangav.vscode-thunder-client',
    'thunder-client.newRequest'
  )

  // 2. Test Twilio API for VOIP functionality
  console.log('📞 Testing Twilio API...')
  const twilioTestRequest = {
    method: 'POST',
    url: 'https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Calls.json',
    headers: {
      'Authorization': 'Basic {base64_encoded_credentials}',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: {
      'To': '+1234567890',
      'From': '+0987654321',
      'Url': 'http://demo.twilio.com/docs/voice.xml'
    }
  }

  // 3. Test email service API
  console.log('📧 Testing email service API...')
  const emailTestRequest = {
    method: 'POST',
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      'Authorization': 'Bearer {api_key}',
      'Content-Type': 'application/json'
    },
    body: {
      'personalizations': [{
        'to': [{ 'email': 'test@example.com' }],
        'subject': 'Test Email from CRM'
      }],
      'from': { 'email': 'crm@yourcompany.com' },
      'content': [{
        'type': 'text/plain',
        'value': 'This is a test email from the CRM system.'
      }]
    }
  }

  // 4. Create automation agent for API management
  console.log('🤖 Creating API management agent...')
  await rooCodeIntegration.executeAgentTask(
    'campaign-manager',
    'Set up automated API workflows for email and SMS campaigns.',
    {
      apis: ['twilio', 'sendgrid'],
      workflows: ['lead_nurturing', 'follow_up_sequence'],
      scheduling: 'automated',
      errorHandling: 'retry_with_backoff'
    }
  )

  console.log('✅ API integration setup complete!')
}

// Demo: Workspace automation
export async function workspaceAutomationDemo() {
  console.log('⚙️ Starting Workspace Automation Demo...')

  const workspaceManager = CRMWorkspaceManager.getInstance()

  // 1. Create different types of workspaces
  console.log('📁 Creating specialized workspaces...')
  
  const workspaces = await Promise.all([
    workspaceManager.createWorkspace('lead-generation', 'Q1 Lead Gen'),
    workspaceManager.createWorkspace('data-analysis', 'Monthly Analytics'),
    workspaceManager.createWorkspace('email-campaign', 'Product Launch Campaign'),
    workspaceManager.createWorkspace('automation-studio', 'CRM Automation Hub')
  ])

  // 2. Create projects in each workspace
  console.log('🎯 Creating projects...')
  
  for (const workspace of workspaces) {
    const project = await workspaceManager.createProject(workspace.id, {
      name: `${workspace.name} Project`,
      description: `Automated project for ${workspace.type} workspace`,
      status: 'active',
      agents: ['lead-generator', 'data-analyst', 'email-marketer']
    })

    // Add sample tasks
    await workspaceManager.addTaskToProject(project.id, {
      title: 'Initialize Workspace',
      description: 'Set up workspace configuration and tools',
      type: 'automation',
      status: 'pending',
      estimatedTime: 30,
      dependencies: [],
      files: ['config/workspace-settings.json']
    })
  }

  // 3. Open workspaces in VS Code
  console.log('🚀 Opening workspaces...')
  for (const workspace of workspaces) {
    await workspaceManager.openWorkspace(workspace.id)
  }

  console.log('✅ Workspace automation complete!')
  return workspaces
}

// Main demo function
export async function runFullDemo() {
  console.log('🎉 Starting Full CRM Extension Integration Demo...')

  try {
    // Run all demo workflows
    await setupCRMDemo()
    await leadGenerationDemo()
    await dataAnalysisDemo()
    await apiIntegrationDemo()
    await workspaceAutomationDemo()

    console.log('🎊 Full demo completed successfully!')
    console.log('🔗 Check the following for results:')
    console.log('  - Extension Manager: See installed extensions')
    console.log('  - Agent Studio: View active AI agents')
    console.log('  - Data Integration: Check connected data sources')
    console.log('  - Workspace Manager: Browse created workspaces and projects')

  } catch (error) {
    console.error('❌ Demo failed:', error)
    throw error
  }
}

// Export demo functions for use in the CRM interface
export const CRMExtensionDemo = {
  setup: setupCRMDemo,
  leadGeneration: leadGenerationDemo,
  dataAnalysis: dataAnalysisDemo,
  apiIntegration: apiIntegrationDemo,
  workspaceAutomation: workspaceAutomationDemo,
  runFull: runFullDemo
}