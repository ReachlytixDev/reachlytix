import * as React from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "../../lib/utils"
import { ChatMessage, CopilotSession } from "../../types"

interface CopilotChatProps {
  className?: string
}

export function CopilotChat({ className }: CopilotChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI-powered CRM assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I understand you need help with that. Let me assist you with your CRM tasks.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className={cn("crm-flex crm-flex-col crm-h-full", className)}>
      <CardHeader>
        <CardTitle className="crm-flex crm-items-center crm-space-x-2">
          <Bot size={20} />
          <span>Co-pilot Reacher</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="crm-flex crm-flex-col crm-flex-1 crm-space-y-4">
        {/* Messages Area */}
        <div className="crm-flex-1 crm-overflow-y-auto crm-space-y-4 crm-pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "crm-flex crm-space-x-3",
                message.role === "user" ? "crm-justify-end" : "crm-justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="crm-flex-shrink-0">
                  <div className="crm-w-8 crm-h-8 crm-bg-primary crm-rounded-full crm-flex crm-items-center crm-justify-center">
                    <Bot size={16} className="crm-text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <div
                className={cn(
                  "crm-max-w-xs crm-lg:max-w-md crm-px-4 crm-py-2 crm-rounded-lg",
                  message.role === "user"
                    ? "crm-bg-primary crm-text-primary-foreground"
                    : "crm-bg-muted crm-text-muted-foreground"
                )}
              >
                <p className="crm-text-sm">{message.content}</p>
                <p className="crm-text-xs crm-opacity-70 crm-mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === "user" && (
                <div className="crm-flex-shrink-0">
                  <div className="crm-w-8 crm-h-8 crm-bg-secondary crm-rounded-full crm-flex crm-items-center crm-justify-center">
                    <User size={16} className="crm-text-secondary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="crm-flex crm-space-x-3">
              <div className="crm-flex-shrink-0">
                <div className="crm-w-8 crm-h-8 crm-bg-primary crm-rounded-full crm-flex crm-items-center crm-justify-center">
                  <Bot size={16} className="crm-text-primary-foreground" />
                </div>
              </div>
              <div className="crm-bg-muted crm-px-4 crm-py-2 crm-rounded-lg">
                <div className="crm-flex crm-space-x-1">
                  <div className="crm-w-2 crm-h-2 crm-bg-muted-foreground crm-rounded-full crm-animate-bounce"></div>
                  <div className="crm-w-2 crm-h-2 crm-bg-muted-foreground crm-rounded-full crm-animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="crm-w-2 crm-h-2 crm-bg-muted-foreground crm-rounded-full crm-animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="crm-flex crm-space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your CRM..."
            className="crm-flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}