import * as React from "react"
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Settings, 
  Play,
  Database,
  Bot,
  MessageSquare,
  BarChart3,
  FolderKanban
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "../../lib/utils"
import { 
  ExtensionManager as ExtManager, 
  CRM_EXTENSIONS, 
  ExtensionIntegration,
  CRMExtensionRegistry 
} from "../../integrations/extensions"

interface ExtensionManagerProps {
  className?: string
}

const categoryIcons = {
  dataManagement: Database,
  aiAutomation: Bot,
  communication: MessageSquare,
  analytics: BarChart3,
  projectManagement: FolderKanban,
}

const categoryLabels = {
  dataManagement: "Data Management",
  aiAutomation: "AI & Automation",
  communication: "Communication",
  analytics: "Analytics & Reporting",
  projectManagement: "Project Management",
}

export function ExtensionManager({ className }: ExtensionManagerProps) {
  const [extensions, setExtensions] = React.useState(CRM_EXTENSIONS)
  const [installing, setInstalling] = React.useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = React.useState<keyof CRMExtensionRegistry>("dataManagement")

  const extensionManager = ExtManager.getInstance()

  React.useEffect(() => {
    // Check installed extensions on component mount
    extensionManager.checkInstalledExtensions()
  }, [])

  const handleInstallExtension = async (extensionId: string) => {
    setInstalling(prev => new Set(prev).add(extensionId))
    
    try {
      const success = await extensionManager.installExtension(extensionId)
      if (success) {
        // Update local state to reflect installation
        setExtensions(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(category => {
            updated[category as keyof CRMExtensionRegistry] = updated[category as keyof CRMExtensionRegistry].map(ext => 
              ext.id === extensionId ? { ...ext, isInstalled: true } : ext
            )
          })
          return updated
        })
      }
    } catch (error) {
      console.error('Failed to install extension:', error)
    } finally {
      setInstalling(prev => {
        const updated = new Set(prev)
        updated.delete(extensionId)
        return updated
      })
    }
  }

  const handleExecuteCommand = async (extensionId: string, commandId: string) => {
    try {
      await extensionManager.executeExtensionCommand(extensionId, commandId)
    } catch (error) {
      console.error('Failed to execute command:', error)
    }
  }

  const getRequiredExtensions = () => {
    return extensionManager.getRequiredExtensions()
  }

  const renderExtensionCard = (extension: ExtensionIntegration) => {
    const isInstalling = installing.has(extension.id)
    
    return (
      <Card key={extension.id} className="crm-h-full">
        <CardHeader>
          <div className="crm-flex crm-items-start crm-justify-between">
            <div className="crm-flex-1">
              <CardTitle className="crm-flex crm-items-center crm-gap-2">
                {extension.name}
                {extension.isInstalled ? (
                  <CheckCircle className="crm-h-4 crm-w-4 crm-text-green-500" />
                ) : extension.isRequired ? (
                  <AlertCircle className="crm-h-4 crm-w-4 crm-text-orange-500" />
                ) : null}
              </CardTitle>
              <CardDescription className="crm-mt-1">
                {extension.description}
              </CardDescription>
            </div>
            <div className="crm-flex crm-gap-2">
              {extension.isRequired && (
                <Badge variant="secondary">Required</Badge>
              )}
              {extension.isInstalled ? (
                <Badge variant="default">Installed</Badge>
              ) : (
                <Badge variant="outline">Not Installed</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="crm-space-y-4">
            {/* Capabilities */}
            <div>
              <h4 className="crm-text-sm crm-font-medium crm-mb-2">Capabilities</h4>
              <ul className="crm-text-sm crm-text-muted-foreground crm-space-y-1">
                {extension.capabilities.map((capability, index) => (
                  <li key={index} className="crm-flex crm-items-center crm-gap-2">
                    <div className="crm-w-1 crm-h-1 crm-bg-muted-foreground crm-rounded-full" />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>

            {/* Commands */}
            {extension.commands.length > 0 && (
              <div>
                <h4 className="crm-text-sm crm-font-medium crm-mb-2">Available Commands</h4>
                <div className="crm-space-y-2">
                  {extension.commands.map((command) => (
                    <div key={command.id} className="crm-flex crm-items-center crm-justify-between crm-p-2 crm-bg-muted crm-rounded-md">
                      <div className="crm-flex-1">
                        <p className="crm-text-sm crm-font-medium">{command.title}</p>
                        <p className="crm-text-xs crm-text-muted-foreground">{command.description}</p>
                      </div>
                      {extension.isInstalled && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExecuteCommand(extension.id, command.id)}
                        >
                          <Play className="crm-h-3 crm-w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="crm-flex crm-gap-2 crm-pt-2">
              {!extension.isInstalled ? (
                <Button
                  onClick={() => handleInstallExtension(extension.id)}
                  disabled={isInstalling}
                  className="crm-flex-1"
                >
                  {isInstalling ? (
                    <>Installing...</>
                  ) : (
                    <>
                      <Download className="crm-h-4 crm-w-4 crm-mr-2" />
                      Install
                    </>
                  )}
                </Button>
              ) : (
                <Button variant="outline" className="crm-flex-1">
                  <Settings className="crm-h-4 crm-w-4 crm-mr-2" />
                  Configure
                </Button>
              )}
              
              <Button variant="ghost" size="icon">
                <ExternalLink className="crm-h-4 crm-w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const requiredExtensions = getRequiredExtensions()

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight">Extension Manager</h1>
        <p className="crm-text-muted-foreground">
          Manage VS Code extensions that enhance your CRM experience
        </p>
      </div>

      {/* Required Extensions Alert */}
      {requiredExtensions.length > 0 && (
        <Card className="crm-border-orange-200 crm-bg-orange-50">
          <CardHeader>
            <CardTitle className="crm-flex crm-items-center crm-gap-2 crm-text-orange-800">
              <AlertCircle className="crm-h-5 crm-w-5" />
              Required Extensions Missing
            </CardTitle>
            <CardDescription className="crm-text-orange-700">
              The following extensions are required for full CRM functionality:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="crm-flex crm-flex-wrap crm-gap-2">
              {requiredExtensions.map((ext) => (
                <Badge key={ext.id} variant="outline" className="crm-border-orange-300">
                  {ext.name}
                </Badge>
              ))}
            </div>
            <Button 
              className="crm-mt-4" 
              onClick={() => {
                requiredExtensions.forEach(ext => handleInstallExtension(ext.id))
              }}
            >
              Install All Required Extensions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Extension Categories */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof CRMExtensionRegistry)}>
        <TabsList className="crm-grid crm-w-full crm-grid-cols-5">
          {Object.keys(extensions).map((category) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons]
            return (
              <TabsTrigger key={category} value={category} className="crm-flex crm-items-center crm-gap-2">
                <IconComponent className="crm-h-4 crm-w-4" />
                <span className="crm-hidden sm:crm-inline">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(extensions).map(([category, categoryExtensions]) => (
          <TabsContent key={category} value={category} className="crm-space-y-4">
            <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-3">
              {categoryExtensions.map(renderExtensionCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}