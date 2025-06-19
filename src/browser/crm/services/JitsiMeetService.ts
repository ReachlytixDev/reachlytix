/**
 * Jitsi Meet Service - Video Conferencing with AI Integration
 * Enhanced with Gemini Live API for real-time meeting assistance
 */

import { GeminiLiveService } from './GeminiLiveService'
import { SupabaseService } from './SupabaseService'

export interface JitsiConfig {
  domain: string
  roomName: string
  width: string | number
  height: string | number
  parentNode: HTMLElement | null
  configOverwrite: JitsiConfigOverwrite
  interfaceConfigOverwrite: JitsiInterfaceConfig
}

export interface JitsiConfigOverwrite {
  startWithAudioMuted: boolean
  startWithVideoMuted: boolean
  enableWelcomePage: boolean
  enableUserRolesBasedOnToken: boolean
  enableFeaturesBasedOnToken: boolean
  resolution: number
  constraints: {
    video: {
      height: { ideal: number, max: number, min: number }
      width: { ideal: number, max: number, min: number }
    }
  }
  disableDeepLinking: boolean
  defaultLanguage: string
  enableNoAudioDetection: boolean
  enableNoisyMicDetection: boolean
  channelLastN: number
  enableLayerSuspension: boolean
  p2p: {
    enabled: boolean
    stunServers: Array<{ urls: string }>
  }
  analytics: {
    disabled: boolean
  }
  localRecording: {
    enabled: boolean
    format: string
  }
  recordingService: {
    enabled: boolean
    sharingEnabled: boolean
  }
  liveStreaming: {
    enabled: boolean
  }
  fileRecordingsEnabled: boolean
  transcribingEnabled: boolean
  autoCaptionsEnabled: boolean
}

export interface JitsiInterfaceConfig {
  TOOLBAR_BUTTONS: string[]
  SETTINGS_SECTIONS: string[]
  VIDEO_LAYOUT_FIT: string
  filmStripOnly: boolean
  SHOW_JITSI_WATERMARK: boolean
  SHOW_WATERMARK_FOR_GUESTS: boolean
  SHOW_BRAND_WATERMARK: boolean
  BRAND_WATERMARK_LINK: string
  SHOW_POWERED_BY: boolean
  SHOW_PROMOTIONAL_CLOSE_PAGE: boolean
  RANDOM_AVATAR_URL_PREFIX: boolean
  RANDOM_AVATAR_URL_SUFFIX: boolean
  FILM_STRIP_MAX_HEIGHT: number
  ENABLE_FEEDBACK_ANIMATION: boolean
  DISABLE_FOCUS_INDICATOR: boolean
  DISABLE_DOMINANT_SPEAKER_INDICATOR: boolean
  DISABLE_TRANSCRIPTION_SUBTITLES: boolean
  DISABLE_RINGING: boolean
  AUDIO_LEVEL_PRIMARY_COLOR: string
  AUDIO_LEVEL_SECONDARY_COLOR: string
  POLICY_LOGO: null
  LOCAL_THUMBNAIL_RATIO: number
  REMOTE_THUMBNAIL_RATIO: number
  LIVE_STREAMING_HELP_LINK: string
  MOBILE_APP_PROMO: boolean
  MAXIMUM_ZOOMING_COEFFICIENT: number
  SUPPORT_URL: string
  CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: boolean
  CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: number
  CONNECTION_INDICATOR_DISABLED: boolean
  VIDEO_QUALITY_LABEL_DISABLED: boolean
  RECENT_LIST_ENABLED: boolean
  OPTIMAL_BROWSERS: string[]
  UNSUPPORTED_BROWSERS: string[]
  AUTO_PIN_LATEST_SCREEN_SHARE: boolean
  DISABLE_PRESENCE_STATUS: boolean
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: boolean
}

export interface MeetingParticipant {
  id: string
  displayName: string
  email?: string
  avatarURL?: string
  role: 'moderator' | 'participant'
  isLocal: boolean
  isModerator: boolean
  isAudioMuted: boolean
  isVideoMuted: boolean
  connectionStatus: string
  joinedAt: Date
  speakingTime: number
}

export interface MeetingEvent {
  type: 'participantJoined' | 'participantLeft' | 'audioMuteStatusChanged' | 'videoMuteStatusChanged' | 'displayNameChange' | 'subjectChange' | 'recordingStatusChanged' | 'transcriptionStatusChanged'
  participant?: MeetingParticipant
  data?: any
  timestamp: Date
}

export interface AITranscription {
  id: string
  meetingId: string
  participantId: string
  text: string
  confidence: number
  language: string
  timestamp: Date
  speakerName?: string
  isTranslated: boolean
  originalLanguage?: string
}

export interface AIMeetingSummary {
  meetingId: string
  title: string
  duration: number
  participants: string[]
  keyTopics: string[]
  decisions: string[]
  actionItems: Array<{
    task: string
    assignee?: string
    dueDate?: string
    priority: 'low' | 'medium' | 'high'
  }>
  nextSteps: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  engagementScore: number
  summary: string
  fullTranscription: string
  generatedAt: Date
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export class JitsiMeetService {
  private static instance: JitsiMeetService
  private api: any = null
  private geminiLive: GeminiLiveService
  private supabase: SupabaseService
  private currentMeeting: any = null
  private participants: Map<string, MeetingParticipant> = new Map()
  private transcriptions: AITranscription[] = []
  private isRecording = false
  private isTranscribing = false
  private aiAssistantEnabled = false

  private constructor() {
    this.geminiLive = GeminiLiveService.getInstance()
    this.supabase = SupabaseService.getInstance()
  }

  static getInstance(): JitsiMeetService {
    if (!JitsiMeetService.instance) {
      JitsiMeetService.instance = new JitsiMeetService()
    }
    return JitsiMeetService.instance
  }

  async loadJitsiAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'))
      document.head.appendChild(script)
    })
  }

  async createMeeting(meetingData: {
    roomName: string
    displayName: string
    email?: string
    avatarUrl?: string
    parentElement: HTMLElement
    aiAssistantEnabled?: boolean
    recordingEnabled?: boolean
    width?: string | number
    height?: string | number
  }): Promise<void> {
    try {
      await this.loadJitsiAPI()

      const config: JitsiConfig = {
        domain: 'meet.jit.si',
        roomName: meetingData.roomName,
        width: meetingData.width || '100%',
        height: meetingData.height || '600px',
        parentNode: meetingData.parentElement,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          enableUserRolesBasedOnToken: false,
          enableFeaturesBasedOnToken: false,
          resolution: 720,
          constraints: {
            video: {
              height: { ideal: 720, max: 1080, min: 240 },
              width: { ideal: 1280, max: 1920, min: 320 }
            }
          },
          disableDeepLinking: true,
          defaultLanguage: 'en',
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          channelLastN: 20,
          enableLayerSuspension: true,
          p2p: {
            enabled: true,
            stunServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' }
            ]
          },
          analytics: {
            disabled: false
          },
          localRecording: {
            enabled: true,
            format: 'flac'
          },
          recordingService: {
            enabled: meetingData.recordingEnabled || false,
            sharingEnabled: true
          },
          liveStreaming: {
            enabled: false
          },
          fileRecordingsEnabled: meetingData.recordingEnabled || false,
          transcribingEnabled: true,
          autoCaptionsEnabled: true
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting',
            'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
          SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
          VIDEO_LAYOUT_FIT: 'both',
          filmStripOnly: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          RANDOM_AVATAR_URL_PREFIX: false,
          RANDOM_AVATAR_URL_SUFFIX: false,
          FILM_STRIP_MAX_HEIGHT: 120,
          ENABLE_FEEDBACK_ANIMATION: false,
          DISABLE_FOCUS_INDICATOR: false,
          DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
          DISABLE_TRANSCRIPTION_SUBTITLES: false,
          DISABLE_RINGING: false,
          AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
          AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',
          POLICY_LOGO: null,
          LOCAL_THUMBNAIL_RATIO: 16 / 9,
          REMOTE_THUMBNAIL_RATIO: 1,
          LIVE_STREAMING_HELP_LINK: 'https://jitsi.org/live',
          MOBILE_APP_PROMO: false,
          MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
          SUPPORT_URL: 'https://community.jitsi.org/',
          CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
          CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
          CONNECTION_INDICATOR_DISABLED: false,
          VIDEO_QUALITY_LABEL_DISABLED: false,
          RECENT_LIST_ENABLED: true,
          OPTIMAL_BROWSERS: ['chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari'],
          UNSUPPORTED_BROWSERS: [],
          AUTO_PIN_LATEST_SCREEN_SHARE: true,
          DISABLE_PRESENCE_STATUS: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false
        }
      }

      this.api = new window.JitsiMeetExternalAPI(config.domain, config)

      // Set user info
      this.api.executeCommand('displayName', meetingData.displayName)
      if (meetingData.email) {
        this.api.executeCommand('email', meetingData.email)
      }
      if (meetingData.avatarUrl) {
        this.api.executeCommand('avatarUrl', meetingData.avatarUrl)
      }

      // Set up event listeners
      this.setupEventListeners()

      // Enable AI assistant if requested
      if (meetingData.aiAssistantEnabled) {
        await this.enableAIAssistant()
      }

      console.log('✅ Jitsi Meet conference created successfully')

    } catch (error) {
      console.error('❌ Failed to create Jitsi Meet conference:', error)
      throw error
    }
  }

  private setupEventListeners(): void {
    if (!this.api) return

    // Conference events
    this.api.addEventListener('videoConferenceJoined', (event: any) => {
      console.log('🎪 Conference joined:', event)
      this.handleConferenceJoined(event)
    })

    this.api.addEventListener('videoConferenceLeft', (event: any) => {
      console.log('👋 Conference left:', event)
      this.handleConferenceLeft(event)
    })

    // Participant events
    this.api.addEventListener('participantJoined', (event: any) => {
      console.log('👤 Participant joined:', event)
      this.handleParticipantJoined(event)
    })

    this.api.addEventListener('participantLeft', (event: any) => {
      console.log('👤 Participant left:', event)
      this.handleParticipantLeft(event)
    })

    // Audio/Video events
    this.api.addEventListener('audioMuteStatusChanged', (event: any) => {
      this.handleAudioMuteStatusChanged(event)
    })

    this.api.addEventListener('videoMuteStatusChanged', (event: any) => {
      this.handleVideoMuteStatusChanged(event)
    })

    // Recording events
    this.api.addEventListener('recordingStatusChanged', (event: any) => {
      console.log('🎥 Recording status changed:', event)
      this.handleRecordingStatusChanged(event)
    })

    // Chat events
    this.api.addEventListener('incomingMessage', (event: any) => {
      console.log('💬 Incoming message:', event)
      this.handleIncomingMessage(event)
    })

    // Screen sharing events
    this.api.addEventListener('screenSharingStatusChanged', (event: any) => {
      console.log('🖥️ Screen sharing status changed:', event)
    })

    // Dominant speaker events
    this.api.addEventListener('dominantSpeakerChanged', (event: any) => {
      this.handleDominantSpeakerChanged(event)
    })
  }

  private async handleConferenceJoined(event: any): Promise<void> {
    try {
      // Update meeting status in database
      if (this.currentMeeting) {
        await this.supabase.updateMeeting(this.currentMeeting.id, {
          status: 'in-progress'
        })
      }

      // Start AI transcription if enabled
      if (this.aiAssistantEnabled) {
        await this.startAITranscription()
      }

    } catch (error) {
      console.error('Error handling conference joined:', error)
    }
  }

  private async handleConferenceLeft(event: any): Promise<void> {
    try {
      // Stop AI transcription
      if (this.isTranscribing) {
        await this.stopAITranscription()
      }

      // Generate meeting summary
      if (this.aiAssistantEnabled && this.transcriptions.length > 0) {
        await this.generateMeetingSummary()
      }

      // Update meeting status in database
      if (this.currentMeeting) {
        await this.supabase.updateMeeting(this.currentMeeting.id, {
          status: 'completed',
          end_time: new Date().toISOString()
        })
      }

      // Clean up
      this.participants.clear()
      this.transcriptions = []
      this.currentMeeting = null

    } catch (error) {
      console.error('Error handling conference left:', error)
    }
  }

  private handleParticipantJoined(event: any): void {
    const participant: MeetingParticipant = {
      id: event.id,
      displayName: event.displayName || 'Unknown',
      email: event.email,
      avatarURL: event.avatarURL,
      role: event.role || 'participant',
      isLocal: event.isLocal || false,
      isModerator: event.role === 'moderator',
      isAudioMuted: false,
      isVideoMuted: false,
      connectionStatus: 'active',
      joinedAt: new Date(),
      speakingTime: 0
    }

    this.participants.set(event.id, participant)

    // Send welcome message from AI assistant
    if (this.aiAssistantEnabled && !participant.isLocal) {
      this.sendAIWelcomeMessage(participant)
    }
  }

  private handleParticipantLeft(event: any): void {
    this.participants.delete(event.id)
  }

  private handleAudioMuteStatusChanged(event: any): void {
    const participant = this.participants.get(event.id)
    if (participant) {
      participant.isAudioMuted = event.muted
      this.participants.set(event.id, participant)
    }
  }

  private handleVideoMuteStatusChanged(event: any): void {
    const participant = this.participants.get(event.id)
    if (participant) {
      participant.isVideoMuted = event.muted
      this.participants.set(event.id, participant)
    }
  }

  private handleRecordingStatusChanged(event: any): void {
    this.isRecording = event.on
    
    if (this.isRecording) {
      console.log('🎥 Recording started')
      this.sendChatMessage('🤖 AI Assistant: Recording started. I\'ll generate a summary and action items when the meeting ends.')
    } else {
      console.log('🎥 Recording stopped')
    }
  }

  private async handleIncomingMessage(event: any): Promise<void> {
    // Check if message is directed to AI assistant
    if (event.message.toLowerCase().includes('@ai') || event.message.toLowerCase().includes('ai assistant')) {
      await this.handleAICommand(event.message, event.from)
    }
  }

  private handleDominantSpeakerChanged(event: any): void {
    // Track speaking time for analytics
    const participant = this.participants.get(event.id)
    if (participant) {
      participant.speakingTime += 1 // Increment speaking time
      this.participants.set(event.id, participant)
    }
  }

  private async enableAIAssistant(): Promise<void> {
    try {
      this.aiAssistantEnabled = true
      
      // Initialize Gemini Live for real-time transcription
      await this.geminiLive.initialize()
      
      // Send welcome message
      this.sendChatMessage('🤖 AI Assistant: Hello! I\'m your AI meeting assistant. I\'ll help with transcription, translation, and generate meeting notes. Type "@ai help" for commands.')
      
      console.log('✅ AI Assistant enabled')
    } catch (error) {
      console.error('❌ Failed to enable AI Assistant:', error)
      this.aiAssistantEnabled = false
    }
  }

  private async startAITranscription(): Promise<void> {
    try {
      if (!this.aiAssistantEnabled) return

      this.isTranscribing = true
      
      // Start Gemini Live transcription
      await this.geminiLive.startTranscription({
        onTranscription: (transcription) => {
          this.handleAITranscription(transcription)
        },
        onTranslation: (translation) => {
          this.handleAITranslation(translation)
        },
        language: 'auto-detect',
        realTimeTranslation: true
      })

      console.log('🎤 AI Transcription started')
      this.sendChatMessage('🤖 AI Assistant: Real-time transcription and translation started!')

    } catch (error) {
      console.error('❌ Failed to start AI transcription:', error)
      this.isTranscribing = false
    }
  }

  private async stopAITranscription(): Promise<void> {
    try {
      if (!this.isTranscribing) return

      await this.geminiLive.stopTranscription()
      this.isTranscribing = false

      console.log('🎤 AI Transcription stopped')
    } catch (error) {
      console.error('❌ Failed to stop AI transcription:', error)
    }
  }

  private handleAITranscription(transcription: any): void {
    const aiTranscription: AITranscription = {
      id: `transcription-${Date.now()}`,
      meetingId: this.currentMeeting?.id || 'unknown',
      participantId: transcription.participantId || 'unknown',
      text: transcription.text,
      confidence: transcription.confidence || 0.9,
      language: transcription.language || 'en',
      timestamp: new Date(),
      speakerName: transcription.speakerName,
      isTranslated: false,
      originalLanguage: transcription.language
    }

    this.transcriptions.push(aiTranscription)

    // Send live captions to chat if confidence is high
    if (transcription.confidence > 0.8) {
      this.sendChatMessage(`📝 ${transcription.speakerName || 'Speaker'}: ${transcription.text}`)
    }
  }

  private handleAITranslation(translation: any): void {
    const translatedTranscription: AITranscription = {
      id: `translation-${Date.now()}`,
      meetingId: this.currentMeeting?.id || 'unknown',
      participantId: translation.participantId || 'unknown',
      text: translation.translatedText,
      confidence: translation.confidence || 0.9,
      language: translation.targetLanguage || 'en',
      timestamp: new Date(),
      speakerName: translation.speakerName,
      isTranslated: true,
      originalLanguage: translation.sourceLanguage
    }

    this.transcriptions.push(translatedTranscription)

    // Send translation to chat
    this.sendChatMessage(`🌐 Translation (${translation.targetLanguage}): ${translation.translatedText}`)
  }

  private async handleAICommand(message: string, fromParticipant: string): Promise<void> {
    const command = message.toLowerCase()

    try {
      if (command.includes('help')) {
        this.sendAIHelpMessage()
      } else if (command.includes('summary')) {
        await this.generateLiveSummary()
      } else if (command.includes('action items')) {
        await this.generateActionItems()
      } else if (command.includes('translate')) {
        const targetLang = this.extractLanguageFromCommand(command)
        await this.translateLastMessages(targetLang)
      } else if (command.includes('notes')) {
        await this.generateMeetingNotes()
      } else {
        // General AI query
        const response = await this.geminiLive.processQuery(message)
        this.sendChatMessage(`🤖 AI Assistant: ${response}`)
      }
    } catch (error) {
      console.error('Error handling AI command:', error)
      this.sendChatMessage('🤖 AI Assistant: Sorry, I encountered an error processing your request.')
    }
  }

  private sendAIHelpMessage(): void {
    const helpMessage = `🤖 AI Assistant Commands:
• @ai summary - Generate live meeting summary
• @ai action items - Extract action items
• @ai translate [language] - Translate recent messages
• @ai notes - Generate meeting notes
• @ai help - Show this help message

I'm also providing real-time transcription and will generate a full summary when the meeting ends!`

    this.sendChatMessage(helpMessage)
  }

  private async generateLiveSummary(): Promise<void> {
    if (this.transcriptions.length === 0) {
      this.sendChatMessage('🤖 AI Assistant: No transcription data available yet.')
      return
    }

    try {
      const recentTranscriptions = this.transcriptions.slice(-20) // Last 20 transcriptions
      const summary = await this.geminiLive.generateLiveSummary(recentTranscriptions)
      
      this.sendChatMessage(`📊 Live Summary: ${summary}`)
    } catch (error) {
      console.error('Error generating live summary:', error)
      this.sendChatMessage('🤖 AI Assistant: Failed to generate summary.')
    }
  }

  private async generateActionItems(): Promise<void> {
    if (this.transcriptions.length === 0) {
      this.sendChatMessage('🤖 AI Assistant: No transcription data available yet.')
      return
    }

    try {
      const actionItems = await this.geminiLive.extractActionItems(this.transcriptions)
      
      if (actionItems.length === 0) {
        this.sendChatMessage('🤖 AI Assistant: No action items identified yet.')
        return
      }

      let message = '✅ Action Items:\n'
      actionItems.forEach((item, index) => {
        message += `${index + 1}. ${item.task}`
        if (item.assignee) message += ` (${item.assignee})`
        if (item.dueDate) message += ` - Due: ${item.dueDate}`
        message += '\n'
      })

      this.sendChatMessage(message)
    } catch (error) {
      console.error('Error generating action items:', error)
      this.sendChatMessage('🤖 AI Assistant: Failed to extract action items.')
    }
  }

  private async translateLastMessages(targetLanguage: string): Promise<void> {
    const recentMessages = this.transcriptions.slice(-5) // Last 5 messages
    
    try {
      for (const transcription of recentMessages) {
        if (!transcription.isTranslated) {
          const translation = await this.geminiLive.translateText(transcription.text, targetLanguage)
          this.sendChatMessage(`🌐 ${transcription.speakerName} (${targetLanguage}): ${translation}`)
        }
      }
    } catch (error) {
      console.error('Error translating messages:', error)
      this.sendChatMessage('🤖 AI Assistant: Failed to translate messages.')
    }
  }

  private async generateMeetingNotes(): Promise<void> {
    if (this.transcriptions.length === 0) {
      this.sendChatMessage('🤖 AI Assistant: No transcription data available yet.')
      return
    }

    try {
      const notes = await this.geminiLive.generateMeetingNotes(this.transcriptions)
      this.sendChatMessage(`📝 Meeting Notes: ${notes}`)
    } catch (error) {
      console.error('Error generating meeting notes:', error)
      this.sendChatMessage('🤖 AI Assistant: Failed to generate meeting notes.')
    }
  }

  private async generateMeetingSummary(): Promise<AIMeetingSummary | null> {
    if (this.transcriptions.length === 0) {
      console.log('No transcriptions available for summary')
      return null
    }

    try {
      const summary = await this.geminiLive.generateCompleteMeetingSummary({
        meetingId: this.currentMeeting?.id || 'unknown',
        participants: Array.from(this.participants.values()),
        transcriptions: this.transcriptions,
        duration: this.calculateMeetingDuration()
      })

      // Save summary to database
      if (this.currentMeeting) {
        await this.supabase.updateMeeting(this.currentMeeting.id, {
          summary: summary.summary,
          transcription: summary.fullTranscription,
          action_items: summary.actionItems
        })
      }

      console.log('✅ Meeting summary generated and saved')
      return summary

    } catch (error) {
      console.error('❌ Failed to generate meeting summary:', error)
      return null
    }
  }

  private sendAIWelcomeMessage(participant: MeetingParticipant): void {
    setTimeout(() => {
      this.sendChatMessage(`🤖 AI Assistant: Welcome ${participant.displayName}! I'm here to help with transcription, translation, and meeting notes. Type "@ai help" for commands.`)
    }, 2000)
  }

  private extractLanguageFromCommand(command: string): string {
    const languages = ['spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese', 'korean', 'arabic', 'hindi']
    for (const lang of languages) {
      if (command.includes(lang)) {
        return lang
      }
    }
    return 'english'
  }

  private calculateMeetingDuration(): number {
    // Calculate duration in minutes
    const startTime = this.currentMeeting?.start_time ? new Date(this.currentMeeting.start_time) : new Date()
    const endTime = new Date()
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
  }

  // Public API methods
  sendChatMessage(message: string): void {
    if (this.api) {
      this.api.executeCommand('sendChatMessage', message)
    }
  }

  muteAudio(): void {
    if (this.api) {
      this.api.executeCommand('toggleAudio')
    }
  }

  muteVideo(): void {
    if (this.api) {
      this.api.executeCommand('toggleVideo')
    }
  }

  startRecording(): void {
    if (this.api) {
      this.api.executeCommand('startRecording', {
        mode: 'file'
      })
    }
  }

  stopRecording(): void {
    if (this.api) {
      this.api.executeCommand('stopRecording')
    }
  }

  shareScreen(): void {
    if (this.api) {
      this.api.executeCommand('toggleShareScreen')
    }
  }

  hangUp(): void {
    if (this.api) {
      this.api.executeCommand('hangup')
    }
  }

  setSubject(subject: string): void {
    if (this.api) {
      this.api.executeCommand('subject', subject)
    }
  }

  getParticipants(): MeetingParticipant[] {
    return Array.from(this.participants.values())
  }

  getTranscriptions(): AITranscription[] {
    return this.transcriptions
  }

  isAIAssistantEnabled(): boolean {
    return this.aiAssistantEnabled
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording
  }

  isCurrentlyTranscribing(): boolean {
    return this.isTranscribing
  }

  dispose(): void {
    if (this.api) {
      this.api.dispose()
      this.api = null
    }
    this.participants.clear()
    this.transcriptions = []
    this.currentMeeting = null
    this.isRecording = false
    this.isTranscribing = false
    this.aiAssistantEnabled = false
  }
}