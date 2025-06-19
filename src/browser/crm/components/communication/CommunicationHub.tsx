import * as React from "react"
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  MessageSquare, 
  Mail, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Square,
  Clock,
  User,
  Bot,
  Headphones,
  Settings,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Timer,
  TrendingUp
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import { 
  ExtensionManager, 
  RooCodeIntegration 
} from "../../integrations/extensions"

interface CommunicationHubProps {
  className?: string
}

interface CallLog {
  id: string
  leadId: string
  leadName: string
  leadCompany: string
  type: 'inbound' | 'outbound' | 'ai-automated'
  status: 'completed' | 'missed' | 'busy' | 'no-answer' | 'in-progress'
  duration: number
  startTime: Date
  endTime?: Date
  agentId?: string
  agentName?: string
  isAICall: boolean
  recording?: string
  transcript?: string
  notes: string
  outcome: 'qualified' | 'not-interested' | 'callback' | 'meeting-scheduled' | 'no-outcome'
  nextAction?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  score: number
}

interface ActiveCall {
  id: string
  leadId: string
  leadName: string
  leadPhone: string
  type: 'manual' | 'ai-automated'
  status: 'dialing' | 'ringing' | 'connected' | 'on-hold'
  duration: number
  isRecording: boolean
  isMuted: boolean
  agentId?: string
  script?: CallScript
}

interface CallScript {
  id: string
  name: string
  type: 'sales' | 'support' | 'qualification' | 'follow-up'
  content: string
  aiPrompts: string[]
  expectedDuration: number
  successCriteria: string[]
}

const mockCallLogs: CallLog[] = [
  {
    id: 'call-001',
    leadId: 'lead-123',
    leadName: 'John Smith',
    leadCompany: 'TechCorp Inc',
    type: 'outbound',
    status: 'completed',
    duration: 420,
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(Date.now() - 3180000),
    agentId: 'agent-001',
    agentName: 'Sarah Johnson',
    isAICall: false,
    notes: 'Interested in our enterprise solution. Scheduled demo for next week.',
    outcome: 'meeting-scheduled',
    nextAction: 'Send calendar invite and demo materials',
    sentiment: 'positive',
    score: 8.5
  },
  {
    id: 'call-002',
    leadId: 'lead-456',
    leadName: 'Emily Davis',
    leadCompany: 'StartupXYZ',
    type: 'ai-automated',
    status: 'completed',
    duration: 180,
    startTime: new Date(Date.now() - 7200000),
    endTime: new Date(Date.now() - 6900000),
    isAICall: true,
    notes: 'AI qualification call completed. Lead shows high interest.',
    outcome: 'qualified',
    nextAction: 'Transfer to human sales rep',
    sentiment: 'positive',
    score: 7.2
  }
]

const mockCallScripts: CallScript[] = [
  {
    id: 'script-001',
    name: 'Lead Qualification Script',
    type: 'qualification',
    content: `Hi [LEAD_NAME], this is [AGENT_NAME] from [COMPANY]. 

I'm calling because you recently showed interest in our [PRODUCT/SERVICE]. 

I'd like to ask a few quick questions to see if we might be a good fit:

1. What's your current challenge with [PAIN_POINT]?
2. How are you currently handling [PROCESS]?
3. What's your timeline for making a decision?
4. Who else would be involved in this decision?

Based on your answers, I can determine if our solution would be valuable for you.`,
    aiPrompts: [
      'Listen for pain points and challenges',
      'Identify decision-making process and timeline',
      'Assess budget and authority',
      'Determine fit score based on responses'
    ],
    expectedDuration: 300,
    successCriteria: [
      'Identified clear pain point',
      'Confirmed budget availability',
      'Established decision timeline',
      'Scheduled follow-up or demo'
    ]
  }
]

export function CommunicationHub({ className }: CommunicationHubProps) {
  const [activeTab, setActiveTab] = React.useState("dialer")
  const [callLogs, setCallLogs] = React.useState(mockCallLogs)
  const [activeCall, setActiveCall] = React.useState<ActiveCall | null>(null)
  const [selectedScript, setSelectedScript] = React.useState<CallScript | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialing, setIsDialing] = React.useState(false)

  const extensionManager = ExtensionManager.getInstance()
  const rooCodeIntegration = RooCodeIntegration.getInstance()

  const handleManualCall = async (leadPhone: string, leadName: string) => {
    setIsDialing(true)
    try {
      // Integrate with Twilio API using Thunder Client
      await extensionManager.executeExtensionCommand(
        'rangav.vscode-thunder-client',
        'thunder-client.newRequest',
        [{
          method: 'POST',
          url: '/api/twilio/calls',
          body: {
            to: leadPhone,
            from: '+1234567890',
            url: '/api/twilio/voice-response'
          }
        }]
      )

      const newCall: ActiveCall = {
        id: `call-${Date.now()}`,
        leadId: 'manual-lead',
        leadName,
        leadPhone,
        type: 'manual',
        status: 'dialing',
        duration: 0,
        isRecording: true,
        isMuted: false
      }

      setActiveCall(newCall)
      
    } catch (error) {
      console.error('Failed to initiate call:', error)
    } finally {
      setIsDialing(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: CallLog['status']) => {
    switch (status) {
      case 'completed':
        return 'crm-bg-green-100 crm-text-green-800'
      case 'missed':
        return 'crm-bg-red-100 crm-text-red-800'
      case 'busy':
        return 'crm-bg-yellow-100 crm-text-yellow-800'
      case 'no-answer':
        return 'crm-bg-gray-100 crm-text-gray-800'
      case 'in-progress':
        return 'crm-bg-blue-100 crm-text-blue-800'
      default:
        return 'crm-bg-gray-100 crm-text-gray-800'
    }
  }

  const renderCallLogItem = (call: CallLog) => (
    <Card key={call.id} className="crm-mb-3">
      <CardContent className="crm-p-4">
        <div className="crm-flex crm-items-start crm-justify-between">
          <div className="crm-flex crm-items-start crm-gap-3">
            <div className="crm-p-2 crm-bg-muted crm-rounded-lg">
              {call.type === 'inbound' ? (
                <PhoneIncoming className="crm-h-4 crm-w-4" />
              ) : call.isAICall ? (
                <Bot className="crm-h-4 crm-w-4" />
              ) : (
                <PhoneOutgoing className="crm-h-4 crm-w-4" />
              )}
            </div>
            <div className="crm-flex-1">
              <div className="crm-flex crm-items-center crm-gap-2 crm-mb-1">
                <p className="crm-font-medium">{call.leadName}</p>
                <Badge className={getStatusColor(call.status)}>
                  {call.status}
                </Badge>
                {call.isAICall && (
                  <Badge variant="outline">
                    <Bot className="crm-h-3 crm-w-3 crm-mr-1" />
                    AI Call
                  </Badge>
                )}
              </div>
              <p className="crm-text-sm crm-text-muted-foreground">{call.leadCompany}</p>
              <p className="crm-text-sm crm-text-muted-foreground">
                {call.startTime.toLocaleString()} • {formatDuration(call.duration)}
              </p>
              {call.notes && (
                <p className="crm-text-sm crm-mt-2">{call.notes}</p>
              )}
            </div>
          </div>
          
          <div className="crm-flex crm-items-center crm-gap-2">
            <div className="crm-text-right crm-text-sm">
              <p className="crm-font-medium">Score: {call.score}/10</p>
              <p className="crm-text-muted-foreground">{call.sentiment}</p>
            </div>
            <Button size="sm" variant="outline">
              <FileText className="crm-h-3 crm-w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight">Communication Hub</h1>
          <p className="crm-text-muted-foreground">
            AI-powered calling, messaging, and communication management
          </p>
        </div>
        <div className="crm-flex crm-gap-2">
          <Button variant="outline">
            <Settings className="crm-h-4 crm-w-4 crm-mr-2" />
            Configure Twilio
          </Button>
          <Button>
            <Phone className="crm-h-4 crm-w-4 crm-mr-2" />
            Manual Call
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dialer" className="crm-flex crm-items-center crm-gap-2">
            <Phone className="crm-h-4 crm-w-4" />
            Manual Dialer
          </TabsTrigger>
          <TabsTrigger value="auto-dialer" className="crm-flex crm-items-center crm-gap-2">
            <Bot className="crm-h-4 crm-w-4" />
            Auto Dialer
          </TabsTrigger>
          <TabsTrigger value="scripts" className="crm-flex crm-items-center crm-gap-2">
            <FileText className="crm-h-4 crm-w-4" />
            Call Scripts
          </TabsTrigger>
          <TabsTrigger value="logs" className="crm-flex crm-items-center crm-gap-2">
            <Clock className="crm-h-4 crm-w-4" />
            Call Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dialer" className="crm-space-y-4">
          <div className="crm-grid crm-gap-6 lg:crm-grid-cols-2">
            {/* Manual Dialer */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Dialer</CardTitle>
                <CardDescription>Make individual calls with AI assistance</CardDescription>
              </CardHeader>
              <CardContent className="crm-space-y-4">
                <div className="crm-space-y-3">
                  <Input placeholder="Lead name" />
                  <Input placeholder="Phone number" />
                  <select className="crm-w-full crm-p-2 crm-border crm-rounded-md">
                    <option>Select call script</option>
                    {mockCallScripts.map(script => (
                      <option key={script.id} value={script.id}>{script.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="crm-flex crm-gap-2">
                  <Button 
                    className="crm-flex-1"
                    onClick={() => handleManualCall('+1234567890', 'Test Lead')}
                    disabled={isDialing}
                  >
                    <PhoneCall className="crm-h-4 crm-w-4 crm-mr-2" />
                    {isDialing ? 'Dialing...' : 'Call Now'}
                  </Button>
                  <Button variant="outline">
                    <Bot className="crm-h-4 crm-w-4 crm-mr-2" />
                    AI Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common calling tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="crm-space-y-3">
                <Button variant="outline" className="crm-w-full crm-justify-start">
                  <Upload className="crm-h-4 crm-w-4 crm-mr-2" />
                  Import Lead List
                </Button>
                <Button variant="outline" className="crm-w-full crm-justify-start">
                  <Calendar className="crm-h-4 crm-w-4 crm-mr-2" />
                  Schedule Callbacks
                </Button>
                <Button variant="outline" className="crm-w-full crm-justify-start">
                  <Download className="crm-h-4 crm-w-4 crm-mr-2" />
                  Export Call Reports
                </Button>
                <Button variant="outline" className="crm-w-full crm-justify-start">
                  <TrendingUp className="crm-h-4 crm-w-4 crm-mr-2" />
                  Performance Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="crm-space-y-4">
          <div className="crm-flex crm-items-center crm-gap-4 crm-mb-6">
            <div className="crm-flex-1">
              <Input
                placeholder="Search call logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="crm-max-w-sm"
              />
            </div>
            <Button variant="outline">
              <Filter className="crm-h-4 crm-w-4 crm-mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="crm-h-4 crm-w-4 crm-mr-2" />
              Export
            </Button>
          </div>

          <div className="crm-space-y-3">
            {callLogs
              .filter(call => 
                call.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                call.leadCompany.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(renderCallLogItem)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}