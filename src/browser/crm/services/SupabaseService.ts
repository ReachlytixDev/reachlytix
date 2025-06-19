/**
 * Supabase Service - Multi-Tenant CRM Backend
 * Handles authentication, organizations, and real-time collaboration
 */

import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  settings: OrganizationSettings
  created_at: string
  updated_at: string
  owner_id: string
}

export interface OrganizationSettings {
  ai_features_enabled: boolean
  video_conferencing_enabled: boolean
  meeting_ai_assistant: boolean
  auto_transcription: boolean
  auto_translation: boolean
  default_language: string
  timezone: string
  business_hours: {
    start: string
    end: string
    days: number[]
  }
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'manager' | 'agent' | 'viewer'
  permissions: string[]
  joined_at: string
  last_active: string
  status: 'active' | 'inactive' | 'suspended'
}

export interface CRMUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  timezone: string
  language: string
  preferences: UserPreferences
  created_at: string
  updated_at: string
  last_sign_in: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    meeting_reminders: boolean
    ai_insights: boolean
  }
  ai_assistant: {
    voice_enabled: boolean
    auto_summarize: boolean
    language_detection: boolean
    preferred_voice: string
  }
}

export interface Meeting {
  id: string
  organization_id: string
  title: string
  description?: string
  start_time: string
  end_time?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  meeting_type: 'video' | 'audio' | 'screen-share'
  jitsi_room_id: string
  participants: MeetingParticipant[]
  ai_assistant_enabled: boolean
  recording_enabled: boolean
  transcription?: string
  summary?: string
  action_items: ActionItem[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface MeetingParticipant {
  user_id: string
  role: 'host' | 'participant'
  joined_at?: string
  left_at?: string
  duration?: number
  speaking_time?: number
}

export interface ActionItem {
  id: string
  meeting_id: string
  title: string
  description?: string
  assigned_to?: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  created_from_ai: boolean
  created_at: string
}

export interface CRMContact {
  id: string
  organization_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  title?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  lead_score: number
  source: string
  tags: string[]
  custom_fields: Record<string, any>
  assigned_to?: string
  last_interaction?: string
  created_at: string
  updated_at: string
}

export interface CRMCampaign {
  id: string
  organization_id: string
  name: string
  description?: string
  type: 'email' | 'sms' | 'voice' | 'multi-channel'
  status: 'draft' | 'active' | 'paused' | 'completed'
  target_contacts: string[]
  channels: CampaignChannel[]
  ai_optimization: boolean
  metrics: CampaignMetrics
  created_by: string
  created_at: string
  updated_at: string
}

export interface CampaignChannel {
  type: 'email' | 'sms' | 'voice'
  enabled: boolean
  config: Record<string, any>
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    responded: number
    converted: number
  }
}

export interface CampaignMetrics {
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_responded: number
  total_converted: number
  open_rate: number
  click_rate: number
  response_rate: number
  conversion_rate: number
  roi: number
}

export class SupabaseService {
  private static instance: SupabaseService
  private supabase: SupabaseClient
  private config: SupabaseConfig
  private currentUser: User | null = null
  private currentSession: Session | null = null
  private currentOrganization: Organization | null = null

  private constructor() {
    this.config = {
      url: process.env.SUPABASE_URL || 'https://xveiopfzmlidfropujsf.supabase.co',
      anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZWlvcGZ6bWxpZGZyb3B1anNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTg4NDksImV4cCI6MjA2MzgzNDg0OX0.FwtzVDOnG5iJLrWk9uWVyQj0A-tj6HlCuK0U_Q1__iw',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
    }

    this.supabase = createClient(this.config.url, this.config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })

    this.initializeAuth()
  }

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService()
    }
    return SupabaseService.instance
  }

  private async initializeAuth(): Promise<void> {
    // Listen for auth changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      this.currentSession = session
      this.currentUser = session?.user || null

      if (session?.user) {
        await this.handleUserSignIn(session.user)
      } else {
        this.currentOrganization = null
      }
    })

    // Check for existing session
    const { data: { session } } = await this.supabase.auth.getSession()
    if (session) {
      this.currentSession = session
      this.currentUser = session.user
      await this.handleUserSignIn(session.user)
    }
  }

  private async handleUserSignIn(user: User): Promise<void> {
    try {
      // Ensure user exists in our users table
      await this.upsertUser(user)
      
      // Load user's organization
      await this.loadUserOrganization(user.id)
      
    } catch (error) {
      console.error('Error handling user sign in:', error)
    }
  }

  private async upsertUser(user: User): Promise<void> {
    const userData: Partial<CRMUser> = {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      preferences: {
        theme: 'auto',
        notifications: {
          email: true,
          push: true,
          meeting_reminders: true,
          ai_insights: true
        },
        ai_assistant: {
          voice_enabled: true,
          auto_summarize: true,
          language_detection: true,
          preferred_voice: 'Zephyr'
        }
      },
      last_sign_in: new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })

    if (error) {
      console.error('Error upserting user:', error)
    }
  }

  private async loadUserOrganization(userId: string): Promise<void> {
    try {
      // Get user's organization membership
      const { data: membership, error } = await this.supabase
        .from('organization_members')
        .select(`
          organization_id,
          role,
          organizations (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error || !membership) {
        console.log('No organization found for user')
        return
      }

      this.currentOrganization = membership.organizations as Organization
    } catch (error) {
      console.error('Error loading user organization:', error)
    }
  }

  // Authentication Methods
  async signInWithProvider(provider: 'google' | 'github' | 'linkedin_oidc') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/crm`
      }
    })

    if (error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }

    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`)
    }
    
    this.currentUser = null
    this.currentSession = null
    this.currentOrganization = null
  }

  // Organization Management
  async createOrganization(orgData: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<Organization> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated')
    }

    const organizationData = {
      ...orgData,
      owner_id: this.currentUser.id,
      settings: {
        ai_features_enabled: true,
        video_conferencing_enabled: true,
        meeting_ai_assistant: true,
        auto_transcription: true,
        auto_translation: true,
        default_language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        business_hours: {
          start: '09:00',
          end: '17:00',
          days: [1, 2, 3, 4, 5]
        },
        ...orgData.settings
      }
    }

    const { data, error } = await this.supabase
      .from('organizations')
      .insert(organizationData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create organization: ${error.message}`)
    }

    // Add owner as organization member
    await this.addOrganizationMember(data.id, this.currentUser.id, 'owner')

    this.currentOrganization = data
    return data
  }

  async addOrganizationMember(organizationId: string, userId: string, role: OrganizationMember['role']): Promise<OrganizationMember> {
    const memberData = {
      organization_id: organizationId,
      user_id: userId,
      role,
      permissions: this.getDefaultPermissions(role),
      status: 'active'
    }

    const { data, error } = await this.supabase
      .from('organization_members')
      .insert(memberData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add organization member: ${error.message}`)
    }

    return data
  }

  private getDefaultPermissions(role: OrganizationMember['role']): string[] {
    const permissions = {
      owner: ['*'],
      admin: ['manage_users', 'manage_campaigns', 'manage_meetings', 'view_analytics', 'manage_settings'],
      manager: ['manage_campaigns', 'manage_meetings', 'view_analytics', 'manage_contacts'],
      agent: ['manage_contacts', 'join_meetings', 'view_campaigns'],
      viewer: ['view_contacts', 'join_meetings', 'view_campaigns']
    }
    return permissions[role] || permissions.viewer
  }

  async getOrganizationMembers(organizationId?: string): Promise<OrganizationMember[]> {
    const orgId = organizationId || this.currentOrganization?.id
    if (!orgId) {
      throw new Error('No organization selected')
    }

    const { data, error } = await this.supabase
      .from('organization_members')
      .select(`
        *,
        users (
          id,
          email,
          full_name,
          avatar_url,
          last_sign_in
        )
      `)
      .eq('organization_id', orgId)
      .eq('status', 'active')

    if (error) {
      throw new Error(`Failed to get organization members: ${error.message}`)
    }

    return data || []
  }

  // Contact Management
  async createContact(contactData: Omit<CRMContact, 'id' | 'organization_id' | 'created_at' | 'updated_at'>): Promise<CRMContact> {
    if (!this.currentOrganization) {
      throw new Error('No organization selected')
    }

    const contact = {
      ...contactData,
      organization_id: this.currentOrganization.id
    }

    const { data, error } = await this.supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create contact: ${error.message}`)
    }

    return data
  }

  async getContacts(filters?: { status?: string, assigned_to?: string }): Promise<CRMContact[]> {
    if (!this.currentOrganization) {
      throw new Error('No organization selected')
    }

    let query = this.supabase
      .from('contacts')
      .select('*')
      .eq('organization_id', this.currentOrganization.id)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get contacts: ${error.message}`)
    }

    return data || []
  }

  async updateContact(contactId: string, updates: Partial<CRMContact>): Promise<CRMContact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', contactId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update contact: ${error.message}`)
    }

    return data
  }

  // Campaign Management
  async createCampaign(campaignData: Omit<CRMCampaign, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<CRMCampaign> {
    if (!this.currentOrganization || !this.currentUser) {
      throw new Error('User must be authenticated and have an organization')
    }

    const campaign = {
      ...campaignData,
      organization_id: this.currentOrganization.id,
      created_by: this.currentUser.id
    }

    const { data, error } = await this.supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create campaign: ${error.message}`)
    }

    return data
  }

  async getCampaigns(): Promise<CRMCampaign[]> {
    if (!this.currentOrganization) {
      throw new Error('No organization selected')
    }

    const { data, error } = await this.supabase
      .from('campaigns')
      .select('*')
      .eq('organization_id', this.currentOrganization.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get campaigns: ${error.message}`)
    }

    return data || []
  }

  // Meeting Management
  async createMeeting(meetingData: Omit<Meeting, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at' | 'jitsi_room_id'>): Promise<Meeting> {
    if (!this.currentOrganization || !this.currentUser) {
      throw new Error('User must be authenticated and have an organization')
    }

    const jitsiRoomId = `crm-${this.currentOrganization.id}-${Date.now()}`

    const meeting = {
      ...meetingData,
      organization_id: this.currentOrganization.id,
      created_by: this.currentUser.id,
      jitsi_room_id: jitsiRoomId
    }

    const { data, error } = await this.supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create meeting: ${error.message}`)
    }

    return data
  }

  async getMeetings(filters?: { status?: string, date_range?: { start: string, end: string } }): Promise<Meeting[]> {
    if (!this.currentOrganization) {
      throw new Error('No organization selected')
    }

    let query = this.supabase
      .from('meetings')
      .select('*')
      .eq('organization_id', this.currentOrganization.id)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.date_range) {
      query = query
        .gte('start_time', filters.date_range.start)
        .lte('start_time', filters.date_range.end)
    }

    const { data, error } = await query.order('start_time', { ascending: false })

    if (error) {
      throw new Error(`Failed to get meetings: ${error.message}`)
    }

    return data || []
  }

  async updateMeeting(meetingId: string, updates: Partial<Meeting>): Promise<Meeting> {
    const { data, error } = await this.supabase
      .from('meetings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', meetingId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update meeting: ${error.message}`)
    }

    return data
  }

  // Real-time subscriptions
  subscribeToOrganizationUpdates(callback: (payload: any) => void) {
    if (!this.currentOrganization) {
      throw new Error('No organization selected')
    }

    return this.supabase
      .channel(`organization-${this.currentOrganization.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        filter: `organization_id=eq.${this.currentOrganization.id}`
      }, callback)
      .subscribe()
  }

  subscribeTo MeetingUpdates(meetingId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`meeting-${meetingId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meetings',
        filter: `id=eq.${meetingId}`
      }, callback)
      .subscribe()
  }

  // Getters
  getCurrentUser(): User | null {
    return this.currentUser
  }

  getCurrentSession(): Session | null {
    return this.currentSession
  }

  getCurrentOrganization(): Organization | null {
    return this.currentOrganization
  }

  isAuthenticated(): boolean {
    return !!this.currentUser
  }

  hasOrganization(): boolean {
    return !!this.currentOrganization
  }
}