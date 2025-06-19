export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  AGENT = "agent",
  VIEWER = "viewer",
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  title?: string
  status: LeadStatus
  source: LeadSource
  value?: number
  notes?: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  lastContactedAt?: Date
}

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost",
}

export enum LeadSource {
  WEBSITE = "website",
  REFERRAL = "referral",
  COLD_CALL = "cold_call",
  EMAIL = "email",
  SOCIAL_MEDIA = "social_media",
  TRADE_SHOW = "trade_show",
  OTHER = "other",
}

export interface Task {
  id: string
  title: string
  description?: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  assignedTo: string
  leadId?: string
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum TaskType {
  CALL = "call",
  EMAIL = "email",
  MEETING = "meeting",
  FOLLOW_UP = "follow_up",
  DEMO = "demo",
  PROPOSAL = "proposal",
  OTHER = "other",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface CallLog {
  id: string
  leadId: string
  agentId: string
  phoneNumber: string
  direction: CallDirection
  status: CallStatus
  duration?: number
  recording?: string
  notes?: string
  startedAt: Date
  endedAt?: Date
}

export enum CallDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

export enum CallStatus {
  COMPLETED = "completed",
  NO_ANSWER = "no_answer",
  BUSY = "busy",
  FAILED = "failed",
  VOICEMAIL = "voicemail",
}

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  description?: string
  targetAudience?: string
  startDate: Date
  endDate?: Date
  budget?: number
  spent?: number
  leads?: number
  conversions?: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum CampaignType {
  EMAIL = "email",
  SMS = "sms",
  TELEMARKETING = "telemarketing",
  MIXED = "mixed",
}

export enum CampaignStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Script {
  id: string
  name: string
  type: ScriptType
  content: string
  variables?: string[]
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum ScriptType {
  COLD_CALL = "cold_call",
  FOLLOW_UP = "follow_up",
  EMAIL_TEMPLATE = "email_template",
  SMS_TEMPLATE = "sms_template",
  OBJECTION_HANDLING = "objection_handling",
}

export interface Agent {
  id: string
  name: string
  type: AgentType
  description?: string
  prompt?: string
  model?: string
  isActive: boolean
  configuration: Record<string, any>
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum AgentType {
  CALLING = "calling",
  EMAIL_MARKETING = "email_marketing",
  SMS_MARKETING = "sms_marketing",
  LEAD_GENERATION = "lead_generation",
  CAMPAIGN_CREATOR = "campaign_creator",
  SCRIPT_WRITER = "script_writer",
}

export interface ActivityBarItem {
  id: string
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
}

export interface DashboardMetric {
  id: string
  label: string
  value: number | string
  change?: number
  changeType?: "increase" | "decrease"
  icon?: string
  color?: string
}

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export interface CopilotSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}