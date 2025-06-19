import * as React from "react"
import { 
  Users,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  Plus,
  Settings,
  Crown,
  Shield,
  User,
  Eye,
  Clock,
  MapPin,
  Globe,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  PhoneOff,
  Bot,
  FileText,
  Download,
  Languages,
  Sparkles
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "../../lib/utils"

interface TeamCollaborationProps {
  className?: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'manager' | 'agent' | 'viewer'
  avatar: string
  status: 'online' | 'offline' | 'busy'
  lastActive: string
}

interface ActiveMeeting {
  id: string
  title: string
  participants: number
  duration: string
  isRecording: boolean
  hasAI: boolean
}

interface ScheduledMeeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  participants: number
  hasAI: boolean
}

export function TeamCollaboration({ className }: TeamCollaborationProps) {
  const [selectedMeeting, setSelectedMeeting] = React.useState<string | null>(null)
  const [showMeetingRoom, setShowMeetingRoom] = React.useState(false)

  // Sample data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'owner',
      avatar: 'JS',
      status: 'online',
      lastActive: '2 min ago'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'admin',
      avatar: 'SJ',
      status: 'online',
      lastActive: '5 min ago'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'manager',
      avatar: 'MC',
      status: 'busy',
      lastActive: '1 hour ago'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@company.com',
      role: 'agent',
      avatar: 'ED',
      status: 'offline',
      lastActive: '3 hours ago'
    }
  ]

  const activeMeetings: ActiveMeeting[] = [
    {
      id: 'meeting-1',
      title: 'Weekly Team Standup',
      participants: 5,
      duration: '12:34',
      isRecording: true,
      hasAI: true
    },
    {
      id: 'meeting-2',
      title: 'Client Demo Prep',
      participants: 3,
      duration: '05:22',
      isRecording: false,
      hasAI: true
    }
  ]

  const scheduledMeetings: ScheduledMeeting[] = [
    {
      id: 'scheduled-1',
      title: 'Q1 Planning Session',
      description: 'Strategic planning for next quarter',
      date: 'Today',
      time: '2:00 PM',
      participants: 8,
      hasAI: true
    },
    {
      id: 'scheduled-2',
      title: 'Product Review',
      description: 'Review latest product features',
      date: 'Tomorrow',
      time: '10:00 AM',
      participants: 6,
      hasAI: true
    }
  ]

  const createInstantMeeting = () => {
    setSelectedMeeting('instant-meeting')
    setShowMeetingRoom(true)
  }

  const joinMeeting = (meetingId: string) => {
    setSelectedMeeting(meetingId)
    setShowMeetingRoom(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="crm-h-4 crm-w-4 crm-text-yellow-500" />
      case 'admin': return <Shield className="crm-h-4 crm-w-4 crm-text-blue-500" />
      case 'manager': return <User className="crm-h-4 crm-w-4 crm-text-green-500" />
      default: return <User className="crm-h-4 crm-w-4 crm-text-gray-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default'
      case 'admin': return 'secondary'
      case 'manager': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'crm-bg-green-500'
      case 'busy': return 'crm-bg-yellow-500'
      case 'offline': return 'crm-bg-gray-400'
      default: return 'crm-bg-gray-400'
    }
  }

  const renderTeamMember = (member: TeamMember) => (
    <Card key={member.id} className="crm-p-4">
      <div className="crm-flex crm-items-center crm-space-x-3">
        <div className="crm-relative">
          <div className="crm-w-10 crm-h-10 crm-bg-gradient-to-r crm-from-blue-500 crm-to-purple-600 crm-rounded-full crm-flex crm-items-center crm-justify-center crm-text-white crm-font-semibold">
            {member.avatar}
          </div>
          <div className={cn("crm-absolute -crm-bottom-1 -crm-right-1 crm-w-3 crm-h-3 crm-rounded-full crm-border-2 crm-border-white", getStatusColor(member.status))}></div>
        </div>
        <div className="crm-flex-1">
          <div className="crm-flex crm-items-center crm-gap-2">
            <h4 className="crm-font-medium">{member.name}</h4>
            {getRoleIcon(member.role)}
          </div>
          <p className="crm-text-sm crm-text-muted-foreground">{member.email}</p>
          <div className="crm-flex crm-items-center crm-gap-2 crm-mt-1">
            <Badge variant={getRoleBadgeVariant(member.role)} className="crm-text-xs">
              {member.role}
            </Badge>
            <span className="crm-text-xs crm-text-muted-foreground">
              <Clock className="crm-h-3 crm-w-3 crm-inline crm-mr-1" />
              {member.lastActive}
            </span>
          </div>
        </div>
        <div className="crm-flex crm-gap-1">
          <Button size="sm" variant="outline">
            <MessageSquare className="crm-h-3 crm-w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Video className="crm-h-3 crm-w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )

  const renderActiveMeeting = (meeting: ActiveMeeting) => (
    <Card key={meeting.id} className="crm-border-green-200 crm-bg-green-50">
      <CardContent className="crm-p-4">
        <div className="crm-flex crm-items-center crm-justify-between crm-mb-3">
          <div>
            <h4 className="crm-font-semibold crm-flex crm-items-center crm-gap-2">
              <div className="crm-w-2 crm-h-2 crm-bg-green-500 crm-rounded-full crm-animate-pulse"></div>
              {meeting.title}
            </h4>
            <p className="crm-text-sm crm-text-muted-foreground">
              {meeting.participants} participants • {meeting.duration}
            </p>
          </div>
          <div className="crm-flex crm-gap-1">
            {meeting.isRecording && (
              <Badge variant="destructive" className="crm-text-xs">
                <div className="crm-w-2 crm-h-2 crm-bg-white crm-rounded-full crm-mr-1"></div>
                REC
              </Badge>
            )}
            {meeting.hasAI && (
              <Badge variant="secondary" className="crm-text-xs">
                <Bot className="crm-h-3 crm-w-3 crm-mr-1" />
                AI
              </Badge>
            )}
          </div>
        </div>
        <div className="crm-flex crm-gap-2">
          <Button size="sm" className="crm-flex-1" onClick={() => joinMeeting(meeting.id)}>
            <Video className="crm-h-3 crm-w-3 crm-mr-1" />
            Join
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="crm-h-3 crm-w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderScheduledMeeting = (meeting: ScheduledMeeting) => (
    <Card key={meeting.id} className="crm-p-4">
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h4 className="crm-font-medium">{meeting.title}</h4>
          <p className="crm-text-sm crm-text-muted-foreground">{meeting.description}</p>
          <div className="crm-flex crm-items-center crm-gap-4 crm-mt-2 crm-text-xs crm-text-muted-foreground">
            <span>
              <Calendar className="crm-h-3 crm-w-3 crm-inline crm-mr-1" />
              {meeting.date}
            </span>
            <span>
              <Clock className="crm-h-3 crm-w-3 crm-inline crm-mr-1" />
              {meeting.time}
            </span>
            <span>
              <Users className="crm-h-3 crm-w-3 crm-inline crm-mr-1" />
              {meeting.participants} participants
            </span>
          </div>
        </div>
        <div className="crm-flex crm-gap-2">
          {meeting.hasAI && (
            <Badge variant="secondary" className="crm-text-xs">
              <Bot className="crm-h-3 crm-w-3 crm-mr-1" />
              AI Assistant
            </Badge>
          )}
          <Button size="sm" onClick={() => joinMeeting(meeting.id)}>
            <Video className="crm-h-3 crm-w-3 crm-mr-1" />
            Join
          </Button>
        </div>
      </div>
    </Card>
  )

  if (showMeetingRoom) {
    return <MeetingRoom meetingId={selectedMeeting} onLeave={() => setShowMeetingRoom(false)} />
  }

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight crm-flex crm-items-center crm-gap-2">
            <Users className="crm-h-8 crm-w-8 crm-text-primary" />
            Team Collaboration
          </h1>
          <p className="crm-text-muted-foreground">
            Your Organization • {teamMembers.length} team members
          </p>
        </div>
        <div className="crm-flex crm-gap-2">
          <Button onClick={createInstantMeeting}>
            <Video className="crm-h-4 crm-w-4 crm-mr-2" />
            Instant Meeting
          </Button>
          <Button variant="outline">
            <Calendar className="crm-h-4 crm-w-4 crm-mr-2" />
            Schedule
          </Button>
          <Button variant="outline">
            <Settings className="crm-h-4 crm-w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="crm-grid crm-gap-4 md:crm-grid-cols-4">
        <Card className="crm-p-4 crm-text-center crm-cursor-pointer crm-hover:bg-muted/50 crm-transition-colors" onClick={createInstantMeeting}>
          <Video className="crm-h-8 crm-w-8 crm-mx-auto crm-mb-2 crm-text-primary" />
          <h3 className="crm-font-medium">Start Meeting</h3>
          <p className="crm-text-xs crm-text-muted-foreground">Instant video call</p>
        </Card>
        <Card className="crm-p-4 crm-text-center crm-cursor-pointer crm-hover:bg-muted/50 crm-transition-colors">
          <Phone className="crm-h-8 crm-w-8 crm-mx-auto crm-mb-2 crm-text-primary" />
          <h3 className="crm-font-medium">Audio Call</h3>
          <p className="crm-text-xs crm-text-muted-foreground">Voice only meeting</p>
        </Card>
        <Card className="crm-p-4 crm-text-center crm-cursor-pointer crm-hover:bg-muted/50 crm-transition-colors">
          <ScreenShare className="crm-h-8 crm-w-8 crm-mx-auto crm-mb-2 crm-text-primary" />
          <h3 className="crm-font-medium">Screen Share</h3>
          <p className="crm-text-xs crm-text-muted-foreground">Share your screen</p>
        </Card>
        <Card className="crm-p-4 crm-text-center crm-cursor-pointer crm-hover:bg-muted/50 crm-transition-colors">
          <Bot className="crm-h-8 crm-w-8 crm-mx-auto crm-mb-2 crm-text-primary" />
          <h3 className="crm-font-medium">AI Meeting</h3>
          <p className="crm-text-xs crm-text-muted-foreground">With AI assistant</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="crm-space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Meetings</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="crm-space-y-4">
          <div className="crm-grid crm-gap-4 md:crm-grid-cols-2">
            {activeMeetings.length > 0 ? (
              activeMeetings.map(renderActiveMeeting)
            ) : (
              <Card className="crm-col-span-2 crm-p-8 crm-text-center">
                <Video className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4 crm-text-muted-foreground" />
                <h3 className="crm-font-medium crm-mb-2">No Active Meetings</h3>
                <p className="crm-text-muted-foreground crm-mb-4">Start an instant meeting or schedule one for later</p>
                <Button onClick={createInstantMeeting}>
                  <Plus className="crm-h-4 crm-w-4 crm-mr-2" />
                  Start Meeting
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="crm-space-y-4">
          <div className="crm-space-y-4">
            {scheduledMeetings.length > 0 ? (
              scheduledMeetings.map(renderScheduledMeeting)
            ) : (
              <Card className="crm-p-8 crm-text-center">
                <Calendar className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4 crm-text-muted-foreground" />
                <h3 className="crm-font-medium crm-mb-2">No Scheduled Meetings</h3>
                <p className="crm-text-muted-foreground crm-mb-4">Schedule your first team meeting</p>
                <Button>
                  <Plus className="crm-h-4 crm-w-4 crm-mr-2" />
                  Schedule Meeting
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="crm-space-y-4">
          <div className="crm-grid crm-gap-4 md:crm-grid-cols-2">
            {teamMembers.map(renderTeamMember)}
          </div>
        </TabsContent>

        <TabsContent value="recordings" className="crm-space-y-4">
          <Card className="crm-p-8 crm-text-center">
            <FileText className="crm-h-12 crm-w-12 crm-mx-auto crm-mb-4 crm-text-muted-foreground" />
            <h3 className="crm-font-medium crm-mb-2">Meeting Recordings</h3>
            <p className="crm-text-muted-foreground crm-mb-4">AI-generated summaries and transcriptions</p>
            <Button variant="outline">
              <Download className="crm-h-4 crm-w-4 crm-mr-2" />
              View Recordings
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Meeting Room Component
interface MeetingRoomProps {
  meetingId: string | null
  onLeave: () => void
}

function MeetingRoom({ meetingId, onLeave }: MeetingRoomProps) {
  const [isAudioMuted, setIsAudioMuted] = React.useState(false)
  const [isVideoMuted, setIsVideoMuted] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const [showTranscription, setShowTranscription] = React.useState(false)
  const meetingContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Initialize Jitsi Meet here
    console.log('Initializing meeting room for:', meetingId)
  }, [meetingId])

  const toggleAudio = () => setIsAudioMuted(!isAudioMuted)
  const toggleVideo = () => setIsVideoMuted(!isVideoMuted)
  const toggleRecording = () => setIsRecording(!isRecording)
  const shareScreen = () => console.log('Share screen')
  const leaveMeeting = () => onLeave()

  return (
    <div className="crm-h-screen crm-flex crm-flex-col crm-bg-black">
      {/* Meeting Header */}
      <div className="crm-bg-gray-900 crm-text-white crm-p-4 crm-flex crm-items-center crm-justify-between">
        <div>
          <h2 className="crm-font-semibold">AI-Powered Team Meeting</h2>
          <p className="crm-text-sm crm-text-gray-300">
            {new Date().toLocaleString()}
          </p>
        </div>
        <div className="crm-flex crm-items-center crm-gap-4">
          <Badge variant="secondary" className="crm-bg-green-600 crm-text-white">
            <Bot className="crm-h-3 crm-w-3 crm-mr-1" />
            AI Assistant Active
          </Badge>
          {isRecording && (
            <Badge variant="destructive">
              <div className="crm-w-2 crm-h-2 crm-bg-white crm-rounded-full crm-mr-1 crm-animate-pulse"></div>
              Recording
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowTranscription(!showTranscription)}>
            <Languages className="crm-h-4 crm-w-4 crm-mr-1" />
            Transcription
          </Button>
        </div>
      </div>

      {/* Meeting Content */}
      <div className="crm-flex-1 crm-flex">
        {/* Video Area */}
        <div className="crm-flex-1 crm-bg-gray-800 crm-flex crm-items-center crm-justify-center">
          <div ref={meetingContainerRef} className="crm-w-full crm-h-full crm-flex crm-items-center crm-justify-center">
            <div className="crm-text-white crm-text-center">
              <Video className="crm-h-16 crm-w-16 crm-mx-auto crm-mb-4 crm-opacity-50" />
              <p className="crm-text-lg crm-font-medium">Jitsi Meet Integration</p>
              <p className="crm-text-sm crm-opacity-75">Video conference will load here</p>
            </div>
          </div>
        </div>

        {/* Transcription Panel */}
        {showTranscription && (
          <div className="crm-w-80 crm-bg-white crm-border-l crm-flex crm-flex-col">
            <div className="crm-p-4 crm-border-b">
              <h3 className="crm-font-semibold crm-flex crm-items-center crm-gap-2">
                <Sparkles className="crm-h-4 crm-w-4 crm-text-primary" />
                Live Transcription
              </h3>
              <p className="crm-text-xs crm-text-muted-foreground">AI-powered real-time transcription</p>
            </div>
            <div className="crm-flex-1 crm-p-4 crm-overflow-y-auto crm-space-y-2">
              <div className="crm-text-sm">
                <span className="crm-font-medium crm-text-blue-600">John:</span>
                <span className="crm-ml-2">Welcome everyone to today's meeting. Let's start with the quarterly review.</span>
              </div>
              <div className="crm-text-sm">
                <span className="crm-font-medium crm-text-green-600">Sarah:</span>
                <span className="crm-ml-2">Thanks John. I have the latest metrics ready to share.</span>
              </div>
              <div className="crm-text-sm crm-bg-blue-50 crm-p-2 crm-rounded">
                <span className="crm-font-medium crm-text-purple-600">🤖 AI Assistant:</span>
                <span className="crm-ml-2">I've detected discussion about quarterly metrics. Would you like me to take notes on key performance indicators?</span>
              </div>
            </div>
            <div className="crm-p-4 crm-border-t">
              <Button size="sm" className="crm-w-full">
                <FileText className="crm-h-3 crm-w-3 crm-mr-1" />
                Generate Summary
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <div className="crm-bg-gray-900 crm-p-4 crm-flex crm-items-center crm-justify-center crm-gap-4">
        <Button
          variant={isAudioMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleAudio}
          className="crm-rounded-full crm-w-12 crm-h-12"
        >
          {isAudioMuted ? <MicOff className="crm-h-5 crm-w-5" /> : <Mic className="crm-h-5 crm-w-5" />}
        </Button>

        <Button
          variant={isVideoMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleVideo}
          className="crm-rounded-full crm-w-12 crm-h-12"
        >
          {isVideoMuted ? <VideoOff className="crm-h-5 crm-w-5" /> : <Video className="crm-h-5 crm-w-5" />}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={shareScreen}
          className="crm-rounded-full crm-w-12 crm-h-12"
        >
          <ScreenShare className="crm-h-5 crm-w-5" />
        </Button>

        <Button
          variant={isRecording ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleRecording}
          className="crm-rounded-full crm-w-12 crm-h-12"
        >
          <div className={cn("crm-w-3 crm-h-3 crm-rounded-full", isRecording ? "crm-bg-white" : "crm-bg-red-500")} />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={leaveMeeting}
          className="crm-rounded-full crm-w-12 crm-h-12"
        >
          <PhoneOff className="crm-h-5 crm-w-5" />
        </Button>
      </div>
    </div>
  )
}