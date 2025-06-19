import * as React from "react"
import { 
  Zap, 
  Home, 
  Phone, 
  Window, 
  Bot, 
  Settings,
  User,
  Headphones,
  Moon,
  Sun,
  Building
} from "lucide-react"
import { cn } from "../../lib/utils"
import { ActivityBarItem } from "../../types"

interface ActivityBarProps {
  activeItem: string
  onItemClick: (itemId: string) => void
  className?: string
}

const activityItems: ActivityBarItem[] = [
  {
    id: "copilot",
    icon: "Zap",
    label: "Co-pilot Reacher",
    isActive: false,
    onClick: () => {},
  },
  {
    id: "home",
    icon: "Home", 
    label: "Home",
    isActive: false,
    onClick: () => {},
  },
  {
    id: "dialer",
    icon: "Phone",
    label: "VOIP Dialer",
    isActive: false,
    onClick: () => {},
  },
  {
    id: "campaigns",
    icon: "Window",
    label: "Campaigns",
    isActive: false,
    onClick: () => {},
  },
  {
    id: "agent-studio",
    icon: "Bot",
    label: "Agent Studio",
    isActive: false,
    onClick: () => {},
  },
  {
    id: "settings",
    icon: "Settings",
    label: "Settings",
    isActive: false,
    onClick: () => {},
  },
]

const iconMap = {
  Zap,
  Home,
  Phone,
  Window,
  Bot,
  Settings,
  User,
  Headphones,
  Moon,
  Sun,
  Building,
}

export function ActivityBar({ activeItem, onItemClick, className }: ActivityBarProps) {
  return (
    <div className={cn("crm-activity-bar", className)}>
      {/* Activity Items */}
      <div className="crm-flex crm-flex-col crm-space-y-1">
        {activityItems.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap]
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "crm-activity-item",
                activeItem === item.id && "active"
              )}
              title={item.label}
            >
              <IconComponent size={20} />
            </button>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="crm-flex-1" />

      {/* Bottom Items */}
      <div className="crm-flex crm-flex-col crm-space-y-1">
        <button
          className="crm-activity-item"
          title="Settings"
          onClick={() => onItemClick("settings")}
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}