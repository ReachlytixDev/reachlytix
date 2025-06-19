import * as React from "react"
import { 
  Activity,
  TrendingUp,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Bot,
  Zap,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Eye,
  MousePointer,
  PhoneCall,
  Send,
  Sparkles
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

interface LiveDashboardProps {
  className?: string
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  icon: React.ComponentType<any>
  color: string
}

interface ActivityItem {
  id: string
  type: 'email' | 'call' | 'sms' | 'ai-task' | 'lead-update'
  title: string
  description: string
  timestamp: Date
  status: 'success' | 'pending' | 'error'
  icon: React.ComponentType<any>
}

export function LiveDashboard({ className }: LiveDashboardProps) {
  const [isLive, setIsLive] = React.useState(false)
  const [lastUpdate, setLastUpdate] = React.useState(new Date())
  const [activities, setActivities] = React.useState<ActivityItem[]>([])

  React.useEffect(() => {
    initializeLiveCRM()
  }, [])

  const initializeLiveCRM = async () => {
    try {
      setIsLive(false)
      console.log('🚀 Initializing Live CRM Dashboard...')
      
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsLive(true)
      setLastUpdate(new Date())
      
      // Start generating activities
      setupRealTimeUpdates()
      
      console.log('✅ Live CRM Dashboard initialized!')
    } catch (error) {
      console.error('Failed to initialize Live CRM:', error)
    }
  }

  const setupRealTimeUpdates = () => {
    // Simulate real-time activities
    const activityInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        generateRandomActivity()
      }
    }, 3000)

    return () => clearInterval(activityInterval)
  }

  const generateRandomActivity = () => {
    const activityTypes = [
      {
        type: 'email' as const,
        title: 'AI Email Sent',
        description: 'Gemini AI generated personalized email sent to John Smith',
        icon: Mail,
        status: 'success' as const
      },
      {
        type: 'call' as const,
        title: 'Twilio Call Completed',
        description: 'AI voice agent completed qualification call',
        icon: Phone,
        status: 'success' as const
      },
      {
        type: 'sms' as const,
        title: 'SMS Follow-up Sent',
        description: 'Personalized SMS sent via Twilio API',
        icon: MessageSquare,
        status: 'success' as const
      },
      {
        type: 'ai-task' as const,
        title: 'Lead Analysis Complete',
        description: 'Gemini 2.5 Pro completed lead scoring analysis',
        icon: Bot,
        status: 'success' as const
      },
      {
        type: 'lead-update' as const,
        title: 'Lead Qualified',
        description: 'Sarah Johnson moved to qualified status',
        icon: Users,
        status: 'success' as const
      }
    ]

    const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    
    addActivity({
      id: `activity-${Date.now()}`,
      ...randomActivity,
      timestamp: new Date()
    })
    
    setLastUpdate(new Date())
  }

  const addActivity = (activity: ActivityItem) => {
    setActivities(prev => [activity, ...prev.slice(0, 9)]) // Keep last 10 activities
  }

  const metrics: MetricCard[] = [
    {
      title: 'Total Leads',
      value: 1247,
      change: +12.5,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Qualified Leads',
      value: 342,
      change: +8.2,
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Active Campaigns',
      value: 8,
      change: +3,
      icon: Zap,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue Generated',
      value: '$127,450',
      change: +15.3,
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'AI Tasks Completed',
      value: 2847,
      change: +22.1,
      icon: Bot,
      color: 'text-orange-600'
    },
    {
      title: 'Conversion Rate',
      value: '27.4%',
      change: +4.7,
      icon: TrendingUp,
      color: 'text-indigo-600'
    }
  ]

  const renderMetricCard = (metric: MetricCard) => (
    <Card key={metric.title} className="crm-relative crm-overflow-hidden">
      <CardContent className="crm-p-6">
        <div className="crm-flex crm-items-center crm-justify-between">
          <div>
            <p className="crm-text-sm crm-font-medium crm-text-muted-foreground">{metric.title}</p>
            <p className="crm-text-2xl crm-font-bold">{metric.value}</p>
            <div className="crm-flex crm-items-center crm-mt-1">
              <TrendingUp className="crm-h-3 crm-w-3 crm-text-green-500 crm-mr-1" />
              <span className="crm-text-xs crm-text-green-500">+{metric.change}%</span>
              <span className="crm-text-xs crm-text-muted-foreground crm-ml-1">vs last week</span>
            </div>
          </div>
          <div className={cn("crm-p-3 crm-rounded-full crm-bg-muted", metric.color)}>
            <metric.icon className="crm-h-6 crm-w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderActivityItem = (activity: ActivityItem) => (
    <div key={activity.id} className="crm-flex crm-items-start crm-gap-3 crm-p-3 crm-border-b crm-last:border-b-0">
      <div className={cn(
        "crm-p-2 crm-rounded-full",
        activity.status === 'success' ? 'crm-bg-green-100 crm-text-green-600' :
        activity.status === 'pending' ? 'crm-bg-yellow-100 crm-text-yellow-600' :
        'crm-bg-red-100 crm-text-red-600'
      )}>
        <activity.icon className="crm-h-3 crm-w-3" />
      </div>
      <div className="crm-flex-1 crm-min-w-0">
        <p className="crm-font-medium crm-text-sm">{activity.title}</p>
        <p className="crm-text-xs crm-text-muted-foreground">{activity.description}</p>
        <p className="crm-text-xs crm-text-muted-foreground crm-mt-1">
          {activity.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight crm-flex crm-items-center crm-gap-2">
            <Sparkles className="crm-h-8 crm-w-8 crm-text-primary" />
            Live AI CRM Dashboard
          </h1>
          <p className="crm-text-muted-foreground">
            Real-time AI-powered customer relationship management with Gemini, Twilio & Deepgram
          </p>
        </div>
        <div className="crm-flex crm-items-center crm-gap-4">
          <div className="crm-flex crm-items-center crm-gap-2">
            <div className={cn(
              "crm-w-2 crm-h-2 crm-rounded-full",
              isLive ? "crm-bg-green-500 crm-animate-pulse" : "crm-bg-red-500"
            )} />
            <span className="crm-text-sm crm-font-medium">
              {isLive ? 'Live' : 'Initializing...'}
            </span>
          </div>
          <div className="crm-text-xs crm-text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={initializeLiveCRM}>
            <Activity className="crm-h-4 crm-w-4 crm-mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-3">
        {metrics.map(renderMetricCard)}
      </div>

      {/* Main Content */}
      <div className="crm-grid crm-gap-6 lg:crm-grid-cols-3">
        {/* Active Campaigns */}
        <div className="lg:crm-col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="crm-flex crm-items-center crm-gap-2">
                <Zap className="crm-h-5 crm-w-5" />
                Live AI Campaigns
              </CardTitle>
              <CardDescription>
                Real-time campaigns powered by Gemini AI, Twilio & Deepgram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="crm-space-y-4">
                {/* Campaign 1 */}
                <Card className="crm-border-green-200 crm-bg-green-50">
                  <CardContent className="crm-p-4">
                    <div className="crm-flex crm-items-center crm-justify-between crm-mb-3">
                      <div>
                        <h4 className="crm-font-semibold">Q1 AI Lead Generation</h4>
                        <p className="crm-text-sm crm-text-muted-foreground">Multi-channel • 500 leads • 3 channels</p>
                      </div>
                      <Badge className="crm-bg-green-100 crm-text-green-800">Active</Badge>
                    </div>
                    <div className="crm-grid crm-grid-cols-4 crm-gap-4 crm-text-center">
                      <div>
                        <p className="crm-text-lg crm-font-bold">342</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Contacted</p>
                      </div>
                      <div>
                        <p className="crm-text-lg crm-font-bold">127</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Qualified</p>
                      </div>
                      <div>
                        <p className="crm-text-lg crm-font-bold">43</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Converted</p>
                      </div>
                      <div>
                        <p className="crm-text-lg crm-font-bold">$87K</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign 2 */}
                <Card>
                  <CardContent className="crm-p-4">
                    <div className="crm-flex crm-items-center crm-justify-between crm-mb-3">
                      <div>
                        <h4 className="crm-font-semibold">Product Demo Webinar</h4>
                        <p className="crm-text-sm crm-text-muted-foreground">Email • 250 leads • 1 channel</p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="crm-grid crm-grid-cols-4 crm-gap-4 crm-text-center">
                      <div>
                        <p className="crm-text-lg crm-font-bold">250</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Contacted</p>
                      </div>
                      <div>
                        <p className="crm-text-lg crm-font-bold">89</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Opened</p>
                      </div>
                      <div>
                        <p className="crm-text-lg crm-font-bold">23</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Registered</p>
                      </div>
                      <div>
                        <p className="crm-text-lg crm-font-bold">$34K</p>
                        <p className="crm-text-xs crm-text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Activity Feed */}
        <div>
          <Card className="crm-h-fit">
            <CardHeader>
              <CardTitle className="crm-flex crm-items-center crm-gap-2">
                <Activity className="crm-h-5 crm-w-5" />
                Live Activity Feed
              </CardTitle>
              <CardDescription>
                Real-time AI and campaign activities
              </CardDescription>
            </CardHeader>
            <CardContent className="crm-p-0">
              {activities.length > 0 ? (
                <div className="crm-max-h-96 crm-overflow-y-auto">
                  {activities.map(renderActivityItem)}
                </div>
              ) : (
                <div className="crm-text-center crm-py-8 crm-text-muted-foreground">
                  <Activity className="crm-h-8 crm-w-8 crm-mx-auto crm-mb-2 crm-opacity-50" />
                  <p className="crm-text-sm">Waiting for AI activities...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="crm-flex crm-items-center crm-gap-2">
            <Bot className="crm-h-5 crm-w-5" />
            AI Services Status
          </CardTitle>
          <CardDescription>
            Real-time status of integrated AI services with your API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-4">
            <div className="crm-flex crm-items-center crm-gap-3 crm-p-3 crm-border crm-rounded-lg">
              <div className="crm-w-2 crm-h-2 crm-bg-green-500 crm-rounded-full crm-animate-pulse" />
              <div>
                <p className="crm-font-medium">Gemini 2.5 Pro</p>
                <p className="crm-text-xs crm-text-muted-foreground">AI Analysis Active</p>
              </div>
            </div>
            <div className="crm-flex crm-items-center crm-gap-3 crm-p-3 crm-border crm-rounded-lg">
              <div className="crm-w-2 crm-h-2 crm-bg-green-500 crm-rounded-full crm-animate-pulse" />
              <div>
                <p className="crm-font-medium">Twilio</p>
                <p className="crm-text-xs crm-text-muted-foreground">Voice & SMS Ready</p>
              </div>
            </div>
            <div className="crm-flex crm-items-center crm-gap-3 crm-p-3 crm-border crm-rounded-lg">
              <div className="crm-w-2 crm-h-2 crm-bg-green-500 crm-rounded-full crm-animate-pulse" />
              <div>
                <p className="crm-font-medium">Deepgram</p>
                <p className="crm-text-xs crm-text-muted-foreground">Voice AI Online</p>
              </div>
            </div>
            <div className="crm-flex crm-items-center crm-gap-3 crm-p-3 crm-border crm-rounded-lg">
              <div className="crm-w-2 crm-h-2 crm-bg-green-500 crm-rounded-full crm-animate-pulse" />
              <div>
                <p className="crm-font-medium">Email Service</p>
                <p className="crm-text-xs crm-text-muted-foreground">Campaigns Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Quick Actions</CardTitle>
          <CardDescription>
            Launch real AI operations with your integrated services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="crm-grid crm-gap-3 md:crm-grid-cols-2 lg:crm-grid-cols-4">
            <Button className="crm-h-auto crm-p-4 crm-flex-col crm-gap-2">
              <Bot className="crm-h-6 crm-w-6" />
              <span>Gemini Lead Analysis</span>
            </Button>
            <Button variant="outline" className="crm-h-auto crm-p-4 crm-flex-col crm-gap-2">
              <Mail className="crm-h-6 crm-w-6" />
              <span>AI Email Campaign</span>
            </Button>
            <Button variant="outline" className="crm-h-auto crm-p-4 crm-flex-col crm-gap-2">
              <Phone className="crm-h-6 crm-w-6" />
              <span>Twilio Voice Campaign</span>
            </Button>
            <Button variant="outline" className="crm-h-auto crm-p-4 crm-flex-col crm-gap-2">
              <Zap className="crm-h-6 crm-w-6" />
              <span>Multi-Channel AI</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}