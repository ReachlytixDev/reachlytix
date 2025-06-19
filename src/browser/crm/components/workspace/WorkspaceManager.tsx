import * as React from "react"
import { 
  FolderOpen, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Calendar,
  Users,
  Target,
  BarChart3,
  Mail,
  Bot,
  FileText,
  Database,
  Code,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import { 
  CRMWorkspaceManager, 
  CRMWorkspace, 
  CRMProject, 
  CRM_WORKSPACE_TEMPLATES 
} from "../../integrations/workspace"

interface WorkspaceManagerProps {
  className?: string
}

const workspaceTypeIcons = {
  'campaign': Mail,
  'lead-generation': Target,
  'data-analysis': BarChart3,
  'automation': Bot,
  'general': FolderOpen,
}

const workspaceTypeColors = {
  'campaign': 'crm-bg-blue-100 crm-text-blue-800',
  'lead-generation': 'crm-bg-green-100 crm-text-green-800',
  'data-analysis': 'crm-bg-purple-100 crm-text-purple-800',
  'automation': 'crm-bg-orange-100 crm-text-orange-800',
  'general': 'crm-bg-gray-100 crm-text-gray-800',
}

const projectStatusIcons = {
  'active': Play,
  'completed': CheckCircle,
  'paused': Pause,
  'archived': FileText,
}

const projectStatusColors = {
  'active': 'crm-bg-green-100 crm-text-green-800',
  'completed': 'crm-bg-blue-100 crm-text-blue-800',
  'paused': 'crm-bg-yellow-100 crm-text-yellow-800',
  'archived': 'crm-bg-gray-100 crm-text-gray-800',
}

const taskStatusIcons = {
  'pending': Clock,
  'in-progress': Play,
  'completed': CheckCircle,
  'failed': AlertCircle,
}

export function WorkspaceManager({ className }: WorkspaceManagerProps) {
  const [activeTab, setActiveTab] = React.useState("workspaces")
  const [workspaces, setWorkspaces] = React.useState<CRMWorkspace[]>([])
  const [projects, setProjects] = React.useState<CRMProject[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<CRMWorkspace | null>(null)
  const [selectedProject, setSelectedProject] = React.useState<CRMProject | null>(null)
  const [isCreating, setIsCreating] = React.useState(false)

  const workspaceManager = CRMWorkspaceManager.getInstance()

  React.useEffect(() => {
    // Load existing workspaces and projects
    setWorkspaces(workspaceManager.getWorkspaces())
    setProjects(workspaceManager.getProjects())
  }, [])

  const handleCreateWorkspace = async (template: string, customName?: string) => {
    setIsCreating(true)
    try {
      const workspace = await workspaceManager.createWorkspace(template, customName)
      setWorkspaces(prev => [...prev, workspace])
    } catch (error) {
      console.error('Failed to create workspace:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleOpenWorkspace = async (workspaceId: string) => {
    try {
      await workspaceManager.openWorkspace(workspaceId)
    } catch (error) {
      console.error('Failed to open workspace:', error)
    }
  }

  const handleCreateProject = async (workspaceId: string, projectData: any) => {
    try {
      const project = await workspaceManager.createProject(workspaceId, projectData)
      setProjects(prev => [...prev, project])
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleExecuteTask = async (projectId: string, taskId: string) => {
    try {
      await workspaceManager.executeProjectTask(projectId, taskId)
      // Refresh projects to show updated task status
      setProjects(workspaceManager.getProjects())
    } catch (error) {
      console.error('Failed to execute task:', error)
    }
  }

  const renderWorkspaceCard = (workspace: CRMWorkspace) => {
    const IconComponent = workspaceTypeIcons[workspace.type]
    const colorClass = workspaceTypeColors[workspace.type]
    const projectCount = projects.filter(p => p.workspace.id === workspace.id).length

    return (
      <Card 
        key={workspace.id}
        className={cn(
          "crm-cursor-pointer crm-transition-all hover:crm-shadow-md",
          selectedWorkspace?.id === workspace.id && "crm-ring-2 crm-ring-primary"
        )}
        onClick={() => setSelectedWorkspace(workspace)}
      >
        <CardHeader>
          <div className="crm-flex crm-items-start crm-justify-between">
            <div className="crm-flex crm-items-center crm-gap-3">
              <div className={cn("crm-p-2 crm-rounded-lg", colorClass)}>
                <IconComponent className="crm-h-5 crm-w-5" />
              </div>
              <div>
                <CardTitle className="crm-text-lg">{workspace.name}</CardTitle>
                <CardDescription>{workspace.description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline">{workspace.type}</Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="crm-space-y-3">
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Projects:</span>
              <span className="crm-font-medium">{projectCount}</span>
            </div>
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Files:</span>
              <span className="crm-font-medium">{workspace.files.length}</span>
            </div>
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Last Modified:</span>
              <span className="crm-font-medium">{workspace.lastModified.toLocaleDateString()}</span>
            </div>
            
            <div className="crm-flex crm-gap-2 crm-mt-4">
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenWorkspace(workspace.id)
                }}
              >
                <FolderOpen className="crm-h-3 crm-w-3 crm-mr-1" />
                Open
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="crm-h-3 crm-w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderProjectCard = (project: CRMProject) => {
    const StatusIcon = projectStatusIcons[project.status]
    const statusColor = projectStatusColors[project.status]
    const completedTasks = project.tasks.filter(t => t.status === 'completed').length
    const totalTasks = project.tasks.length

    return (
      <Card 
        key={project.id}
        className={cn(
          "crm-cursor-pointer crm-transition-all hover:crm-shadow-md",
          selectedProject?.id === project.id && "crm-ring-2 crm-ring-primary"
        )}
        onClick={() => setSelectedProject(project)}
      >
        <CardHeader>
          <div className="crm-flex crm-items-start crm-justify-between">
            <div>
              <CardTitle className="crm-flex crm-items-center crm-gap-2">
                {project.name}
                <StatusIcon className="crm-h-4 crm-w-4" />
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            <Badge className={statusColor}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="crm-space-y-3">
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Progress:</span>
              <span className="crm-font-medium">{project.progress}%</span>
            </div>
            <div className="crm-w-full crm-bg-gray-200 crm-rounded-full crm-h-2">
              <div 
                className="crm-bg-primary crm-h-2 crm-rounded-full" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Tasks:</span>
              <span className="crm-font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            {project.deadline && (
              <div className="crm-flex crm-justify-between crm-text-sm">
                <span className="crm-text-muted-foreground">Deadline:</span>
                <span className="crm-font-medium">{project.deadline.toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="crm-flex crm-gap-2 crm-mt-4">
              <Button size="sm">
                <Play className="crm-h-3 crm-w-3 crm-mr-1" />
                Continue
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="crm-h-3 crm-w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderProjectDetails = () => {
    if (!selectedProject) {
      return (
        <Card className="crm-h-full crm-flex crm-items-center crm-justify-center">
          <CardContent>
            <div className="crm-text-center crm-text-muted-foreground">
              <Target className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4" />
              <p>Select a project to view details and manage tasks</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="crm-h-full">
        <CardHeader>
          <CardTitle>{selectedProject.name}</CardTitle>
          <CardDescription>{selectedProject.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="crm-space-y-6">
          {/* Project Info */}
          <div className="crm-grid crm-grid-cols-2 crm-gap-4">
            <div>
              <p className="crm-text-sm crm-font-medium crm-text-muted-foreground">Status</p>
              <Badge className={projectStatusColors[selectedProject.status]}>
                {selectedProject.status}
              </Badge>
            </div>
            <div>
              <p className="crm-text-sm crm-font-medium crm-text-muted-foreground">Progress</p>
              <p className="crm-text-lg crm-font-semibold">{selectedProject.progress}%</p>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <h4 className="crm-text-sm crm-font-medium crm-mb-3">Tasks</h4>
            <div className="crm-space-y-2">
              {selectedProject.tasks.map((task) => {
                const TaskStatusIcon = taskStatusIcons[task.status]
                return (
                  <div key={task.id} className="crm-flex crm-items-center crm-justify-between crm-p-3 crm-border crm-rounded-lg">
                    <div className="crm-flex crm-items-center crm-gap-3">
                      <TaskStatusIcon className="crm-h-4 crm-w-4 crm-text-muted-foreground" />
                      <div>
                        <p className="crm-font-medium">{task.title}</p>
                        <p className="crm-text-sm crm-text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <div className="crm-flex crm-items-center crm-gap-2">
                      <Badge variant="outline">{task.type}</Badge>
                      {task.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleExecuteTask(selectedProject.id, task.id)}
                        >
                          <Play className="crm-h-3 crm-w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Agents */}
          {selectedProject.agents.length > 0 && (
            <div>
              <h4 className="crm-text-sm crm-font-medium crm-mb-3">AI Agents</h4>
              <div className="crm-flex crm-flex-wrap crm-gap-2">
                {selectedProject.agents.map((agent) => (
                  <Badge key={agent} variant="secondary">
                    <Bot className="crm-h-3 crm-w-3 crm-mr-1" />
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight">Workspace Manager</h1>
          <p className="crm-text-muted-foreground">
            Organize your CRM work with VS Code workspaces and projects
          </p>
        </div>
        <div className="crm-flex crm-gap-2">
          <Button variant="outline">
            <Plus className="crm-h-4 crm-w-4 crm-mr-2" />
            New Project
          </Button>
          <Button>
            <Plus className="crm-h-4 crm-w-4 crm-mr-2" />
            New Workspace
          </Button>
        </div>
      </div>

      {/* Workspace Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>
            Create a new workspace from predefined templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-4">
            {Object.entries(CRM_WORKSPACE_TEMPLATES).map(([key, template]) => {
              const IconComponent = workspaceTypeIcons[template.type || 'general']
              const colorClass = workspaceTypeColors[template.type || 'general']
              
              return (
                <Card key={key} className="crm-cursor-pointer hover:crm-shadow-md crm-transition-all">
                  <CardContent className="crm-p-4">
                    <div className="crm-flex crm-items-center crm-gap-3 crm-mb-3">
                      <div className={cn("crm-p-2 crm-rounded-lg", colorClass)}>
                        <IconComponent className="crm-h-4 crm-w-4" />
                      </div>
                      <div>
                        <p className="crm-font-medium">{template.name}</p>
                        <p className="crm-text-xs crm-text-muted-foreground">{template.type}</p>
                      </div>
                    </div>
                    <p className="crm-text-sm crm-text-muted-foreground crm-mb-3">
                      {template.description}
                    </p>
                    <Button 
                      size="sm" 
                      className="crm-w-full"
                      onClick={() => handleCreateWorkspace(key)}
                      disabled={isCreating}
                    >
                      Create Workspace
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="workspaces" className="crm-flex crm-items-center crm-gap-2">
            <FolderOpen className="crm-h-4 crm-w-4" />
            Workspaces
          </TabsTrigger>
          <TabsTrigger value="projects" className="crm-flex crm-items-center crm-gap-2">
            <Target className="crm-h-4 crm-w-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspaces" className="crm-space-y-4">
          <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-3">
            {workspaces.map(renderWorkspaceCard)}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="crm-space-y-4">
          <div className="crm-grid crm-gap-6 lg:crm-grid-cols-2">
            {/* Project List */}
            <div className="crm-space-y-4">
              <h3 className="crm-text-lg crm-font-semibold">Active Projects</h3>
              <div className="crm-space-y-3">
                {projects.map(renderProjectCard)}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="crm-text-lg crm-font-semibold crm-mb-4">Project Details</h3>
              {renderProjectDetails()}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}