import * as React from "react"
import { ActivityBar } from "./activity-bar/ActivityBar"
import { Header } from "./ui/header"
import { CopilotChat } from "./copilot/CopilotChat"
import { Dashboard } from "./home/Dashboard"
import { ExtensionManager } from "./extensions/ExtensionManager"
import { AgentStudio } from "./agent-studio/AgentStudio"
import { DataIntegration } from "./data/DataIntegration"
import { WorkspaceManager } from "./workspace/WorkspaceManager"
import { SmartCampaignOrchestrator } from "./campaigns/SmartCampaignOrchestrator"
import { CommunicationHub } from "./communication/CommunicationHub"
import { LiveDashboard } from "./live/LiveDashboard"
import { TeamCollaboration } from "./collaboration/TeamCollaboration"
import { cn } from "../lib/utils"

interface CRMLayoutProps {
  className?: string
}

export function CRMLayout({ className }: CRMLayoutProps) {
  const [activeItem, setActiveItem] = React.useState("copilot")
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
  }

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real implementation, you would also update the document class
    // document.documentElement.classList.toggle('dark', !isDarkMode)
  }

  const renderContent = () => {
    switch (activeItem) {
      case "copilot":
        return <CopilotChat className="crm-h-full" />
      case "home":
        return <LiveDashboard />
      case "dialer":
        return <TeamCollaboration />
      case "campaigns":
        return <SmartCampaignOrchestrator />
      case "agent-studio":
        return <AgentStudio />
      case "settings":
        return (
          <div className="crm-space-y-6 crm-p-6">
            <div className="crm-space-y-8">
              <ExtensionManager />
              <DataIntegration />
              <WorkspaceManager />
            </div>
          </div>
        )
      default:
        return <CopilotChat className="crm-h-full" />
    }
  }

  return (
    <div className={cn("crm-container", isDarkMode && "dark", className)}>
      {/* Header */}
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content */}
      <div className="crm-main-content">
        {/* Activity Bar */}
        <ActivityBar 
          activeItem={activeItem} 
          onItemClick={handleItemClick}
        />

        {/* Content Area */}
        <div className="crm-content-area">
          <div className="crm-page-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}