import * as React from "react"
import { Building, User, Headphones, Moon, Sun } from "lucide-react"
import { Button } from "./button"
import { cn } from "../../lib/utils"

interface HeaderProps {
  className?: string
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
}

export function Header({ className, isDarkMode = false, onToggleDarkMode }: HeaderProps) {
  return (
    <div className={cn("crm-header", className)}>
      {/* Left side - Organization Settings */}
      <div className="crm-flex crm-items-center crm-space-x-2">
        <Button variant="ghost" size="sm" className="crm-flex crm-items-center crm-space-x-2">
          <Building size={16} />
          <span>Organization Settings</span>
        </Button>
      </div>

      {/* Right side - User controls */}
      <div className="crm-flex crm-items-center crm-space-x-2">
        {/* Dark/Light Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDarkMode}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        {/* Contact Support */}
        <Button variant="ghost" size="sm" className="crm-flex crm-items-center crm-space-x-2">
          <Headphones size={16} />
          <span>Contact Support</span>
        </Button>

        {/* Profile Settings */}
        <Button variant="ghost" size="sm" className="crm-flex crm-items-center crm-space-x-2">
          <User size={16} />
          <span>Profile Settings</span>
        </Button>
      </div>
    </div>
  )
}