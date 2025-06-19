import * as React from "react"
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Activity,
  Brain,
  MessageSquare,
  Mail,
  Phone,
  Target,
  PenTool
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import { 
  RooCodeIntegration, 
  CRM_AI_AGENTS, 
  RooCodeAgent 
} from "../../integrations/extensions"

interface AgentStudioProps {
  className?: string
}

const roleIcons = {
  'lead-generator': Target,
  'data-analyst': Brain,
  'email-marketer': Mail,
  'call-agent': Phone,
  'campaign-manager': Activity,
}

const roleColors = {
  'lead-generator': 'crm-bg-blue-100 crm-text-blue-800',
  'data-analyst': 'crm-bg-purple-100 crm-text-purple-800',
  'email-marketer': 'crm-bg-green-100 crm-text-green-800',
  'call-agent': 'crm-bg-orange-100 crm-text-orange-800',
  'campaign-manager': 'crm-bg-pink-100 crm-text-pink-800',
}

export function AgentStudio({ className }: AgentStudioProps) {
  const [agents, setAgents] = React.useState(CRM_AI_AGENTS)
  const [activeTab, setActiveTab] = React.useState("agents")
  const [selectedAgent, setSelectedAgent] = React.useState<RooCodeAgent | null>(null)
  const [taskInput, setTaskInput] = React.useState("")
  const [isExecuting, setIsExecuting] = React.useState(false)
  const [executionResults, setExecutionResults] = React.useState<Record<string, any>>({})

  const rooCodeIntegration = RooCodeIntegration.getInstance()

  React.useEffect(() => {
    // Initialize agents on component mount
    rooCodeIntegration.initializeAllAgents()
  }, [])

  const handleToggleAgent = async (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, isActive: !agent.isActive }
        : agent
    ))
  }

  const handleExecuteTask = async () => {
    if (!selectedAgent || !taskInput.trim()) return

    setIsExecuting(true)
    try {
      const result = await rooCodeIntegration.executeAgentTask(
        selectedAgent.id, 
        taskInput,
        { timestamp: new Date().toISOString() }
      )
      
      setExecutionResults(prev => ({
        ...prev,
        [selectedAgent.id]: {
          task: taskInput,
          result,
          timestamp: new Date().toISOString()
        }
      }))
      
      setTaskInput("")
    } catch (error) {
      console.error('Failed to execute task:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleCreateCustomAgent = async () => {
    // This would open a dialog to create a custom agent
    console.log('Creating custom agent...')
  }

  const renderAgentCard = (agent: RooCodeAgent) => {
    const IconComponent = roleIcons[agent.role]
    const colorClass = roleColors[agent.role]
    const lastResult = executionResults[agent.id]

    return (
      <Card 
        key={agent.id} 
        className={cn(
          "crm-cursor-pointer crm-transition-all hover:crm-shadow-md",
          selectedAgent?.id === agent.id && "crm-ring-2 crm-ring-primary"
        )}
        onClick={() => setSelectedAgent(agent)}
      >
        <CardHeader>
          <div className="crm-flex crm-items-start crm-justify-between">
            <div className="crm-flex crm-items-center crm-gap-3">
              <div className={cn("crm-p-2 crm-rounded-lg", colorClass)}>
                <IconComponent className="crm-h-5 crm-w-5" />
              </div>
              <div>
                <CardTitle className="crm-text-lg">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </div>
            </div>
            <div className="crm-flex crm-items-center crm-gap-2">
              <Badge variant={agent.isActive ? "default" : "secondary"}>
                {agent.isActive ? "Active" : "Inactive"}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleAgent(agent.id)
                }}
              >
                {agent.isActive ? <Pause className="crm-h-4 crm-w-4" /> : <Play className="crm-h-4 crm-w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="crm-space-y-3">
            {/* Tools */}
            <div>
              <p className="crm-text-sm crm-font-medium crm-mb-2">Tools</p>
              <div className="crm-flex crm-flex-wrap crm-gap-1">
                {agent.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="crm-text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Model */}
            <div className="crm-flex crm-items-center crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Model:</span>
              <Badge variant="secondary">{agent.model}</Badge>
            </div>

            {/* Last Execution */}
            {lastResult && (
              <div className="crm-p-3 crm-bg-muted crm-rounded-md">
                <p className="crm-text-xs crm-font-medium crm-mb-1">Last Task</p>
                <p className="crm-text-xs crm-text-muted-foreground crm-truncate">
                  {lastResult.task}
                </p>
                <p className="crm-text-xs crm-text-muted-foreground crm-mt-1">
                  {new Date(lastResult.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderAgentDetails = () => {
    if (!selectedAgent) {
      return (
        <Card className="crm-h-full crm-flex crm-items-center crm-justify-center">
          <CardContent>
            <div className="crm-text-center crm-text-muted-foreground">
              <Bot className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4" />
              <p>Select an agent to view details and execute tasks</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    const IconComponent = roleIcons[selectedAgent.role]
    const colorClass = roleColors[selectedAgent.role]

    return (
      <Card className="crm-h-full">
        <CardHeader>
          <div className="crm-flex crm-items-center crm-gap-3">
            <div className={cn("crm-p-3 crm-rounded-lg", colorClass)}>
              <IconComponent className="crm-h-6 crm-w-6" />
            </div>
            <div>
              <CardTitle>{selectedAgent.name}</CardTitle>
              <CardDescription>{selectedAgent.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="crm-space-y-6">
          {/* Agent Prompt */}
          <div>
            <h4 className="crm-text-sm crm-font-medium crm-mb-2">System Prompt</h4>
            <div className="crm-p-3 crm-bg-muted crm-rounded-md crm-text-sm crm-max-h-32 crm-overflow-y-auto">
              {selectedAgent.prompt}
            </div>
          </div>

          {/* Task Execution */}
          <div>
            <h4 className="crm-text-sm crm-font-medium crm-mb-2">Execute Task</h4>
            <div className="crm-space-y-3">
              <Input
                placeholder="Describe the task you want this agent to perform..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleExecuteTask()}
              />
              <Button 
                onClick={handleExecuteTask}
                disabled={!taskInput.trim() || isExecuting}
                className="crm-w-full"
              >
                {isExecuting ? (
                  <>Executing...</>
                ) : (
                  <>
                    <Play className="crm-h-4 crm-w-4 crm-mr-2" />
                    Execute Task
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Execution History */}
          {executionResults[selectedAgent.id] && (
            <div>
              <h4 className="crm-text-sm crm-font-medium crm-mb-2">Last Execution Result</h4>
              <div className="crm-p-3 crm-bg-muted crm-rounded-md crm-text-sm">
                <p className="crm-font-medium crm-mb-2">Task: {executionResults[selectedAgent.id].task}</p>
                <p className="crm-text-muted-foreground">
                  Result: {JSON.stringify(executionResults[selectedAgent.id].result, null, 2)}
                </p>
              </div>
            </div>
          )}

          {/* Agent Configuration */}
          <div className="crm-flex crm-gap-2">
            <Button variant="outline" className="crm-flex-1">
              <Edit className="crm-h-4 crm-w-4 crm-mr-2" />
              Edit Agent
            </Button>
            <Button variant="outline" className="crm-flex-1">
              <Settings className="crm-h-4 crm-w-4 crm-mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight">Agent Studio</h1>
          <p className="crm-text-muted-foreground">
            Create and manage AI agents powered by Roo Code
          </p>
        </div>
        <Button onClick={handleCreateCustomAgent}>
          <Plus className="crm-h-4 crm-w-4 crm-mr-2" />
          Create Custom Agent
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="agents" className="crm-flex crm-items-center crm-gap-2">
            <Bot className="crm-h-4 crm-w-4" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="workflows" className="crm-flex crm-items-center crm-gap-2">
            <Activity className="crm-h-4 crm-w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="templates" className="crm-flex crm-items-center crm-gap-2">
            <PenTool className="crm-h-4 crm-w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="crm-space-y-4">
          <div className="crm-grid crm-gap-6 lg:crm-grid-cols-2">
            {/* Agent List */}
            <div className="crm-space-y-4">
              <h3 className="crm-text-lg crm-font-semibold">Available Agents</h3>
              <div className="crm-space-y-3">
                {agents.map(renderAgentCard)}
              </div>
            </div>

            {/* Agent Details */}
            <div>
              <h3 className="crm-text-lg crm-font-semibold crm-mb-4">Agent Details</h3>
              {renderAgentDetails()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="crm-space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Workflows</CardTitle>
              <CardDescription>
                Create multi-agent workflows for complex CRM automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="crm-text-center crm-text-muted-foreground crm-py-8">
                <Activity className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4" />
                <p>Workflow builder coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="crm-space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Templates</CardTitle>
              <CardDescription>
                Pre-built agent templates for common CRM tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="crm-text-center crm-text-muted-foreground crm-py-8">
                <PenTool className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4" />
                <p>Template library coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}