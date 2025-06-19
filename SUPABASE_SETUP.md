# 🚀 Supabase Multi-Tenant CRM Setup Guide

## 🎯 Overview

This guide will help you set up the complete multi-tenant CRM system with Supabase backend, team collaboration, and AI-powered meeting assistance.

## 📋 Prerequisites

- Supabase account and project
- Node.js 16+ installed
- Your provided Supabase credentials

## 🔑 Your Supabase Credentials

```
Project URL: https://xveiopfzmlidfropujsf.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZWlvcGZ6bWxpZGZyb3B1anNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTg4NDksImV4cCI6MjA2MzgzNDg0OX0.FwtzVDOnG5iJLrWk9uWVyQj0A-tj6HlCuK0U_Q1__iw
Service Role: [Use your provided service role key]
Organization: umnbcdzlyyfhyezfgbtp
```

## 🛠️ Step 1: Database Setup

### 1.1 Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in with your credentials
3. Navigate to your project: `xveiopfzmlidfropujsf`

### 1.2 Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database/supabase-schema.sql`
3. Paste and execute the SQL script
4. This will create all necessary tables with Row Level Security (RLS)

### 1.3 Verify Tables Created
Check that these tables were created:
- `users` - User profiles and preferences
- `organizations` - Multi-tenant organizations
- `organization_members` - Team membership
- `contacts` - CRM contacts/leads
- `meetings` - Video conference meetings
- `campaigns` - Marketing campaigns

## 🔧 Step 2: Environment Configuration

### 2.1 Install Dependencies
```bash
# Install CRM dependencies
node scripts/install-crm-dependencies.js

# Or manually install key packages
npm install @supabase/supabase-js @google/genai mime
```

### 2.2 Configure Environment Variables
Create `.env` file from template:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
# Supabase Configuration
SUPABASE_URL=https://xveiopfzmlidfropujsf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZWlvcGZ6bWxpZGZyb3B1anNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTg4NDksImV4cCI6MjA2MzgzNDg0OX0.FwtzVDOnG5iJLrWk9uWVyQj0A-tj6HlCuK0U_Q1__iw
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Twilio Configuration (for voice/SMS)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Deepgram Configuration (for voice AI)
DEEPGRAM_API_KEY=your-deepgram-api-key
```

## 🎪 Step 3: Authentication Setup

### 3.1 Configure OAuth Providers
In your Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable and configure:
   - **Google** (Gmail login)
   - **GitHub** 
   - **LinkedIn** (if available)

3. Set redirect URLs:
   - Development: `http://localhost:8080/crm`
   - Production: `https://your-domain.com/crm`

### 3.2 Test Authentication
The system will automatically:
- Create user profiles on first login
- Set up default organizations
- Handle multi-tenant access

## 🎥 Step 4: Video Conferencing Setup

### 4.1 Jitsi Meet Integration
The system uses Jitsi Meet for video conferencing:
- No additional setup required for basic usage
- Uses public Jitsi servers by default
- Can be configured for private Jitsi servers

### 4.2 AI Meeting Assistant
Requires Gemini API key for:
- Real-time transcription
- Meeting summaries
- Action item extraction
- Multi-language translation

## 🤖 Step 5: AI Services Configuration

### 5.1 Gemini AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` file
3. Test with: `node scripts/test-ai-integration.js`

### 5.2 Voice AI Setup (Optional)
For advanced voice features:
1. Get Deepgram API key
2. Get Twilio credentials
3. Configure in `.env`

## 🚀 Step 6: Launch the System

### 6.1 Development Mode
```bash
# Start development server
npm run watch:crm

# Or build and start
npm run build:crm
npm start
```

### 6.2 Access the CRM
1. Open `http://localhost:8080`
2. Navigate to CRM section
3. Sign in with Google/GitHub/LinkedIn
4. Start using the AI-powered CRM!

## 🎯 Step 7: Team Setup

### 7.1 Invite Team Members
1. Share the CRM URL with team members
2. They sign in with OAuth
3. Add them to your organization
4. Assign roles (owner, admin, manager, agent, viewer)

### 7.2 Test Collaboration Features
- Start instant video meetings
- Use AI meeting assistant
- Test real-time transcription
- Generate meeting summaries

## 📊 Features Overview

### 🏢 Multi-Tenant Architecture
- **Organizations**: Separate workspaces for different companies
- **Team Members**: Role-based access control
- **Data Isolation**: Complete separation between organizations

### 🎥 Video Conferencing
- **Jitsi Meet Integration**: Professional video calls
- **AI Assistant**: Real-time meeting help
- **Transcription**: Live speech-to-text
- **Translation**: Multi-language support
- **Recording**: Meeting recordings with AI summaries

### 🤖 AI-Powered Features
- **Meeting Notes**: Automatic note generation
- **Action Items**: AI-extracted tasks
- **Sentiment Analysis**: Meeting mood tracking
- **Smart Summaries**: Concise meeting overviews

### 📱 Team Collaboration
- **Instant Meetings**: One-click video calls
- **Screen Sharing**: Present and collaborate
- **Chat Integration**: In-meeting messaging
- **Member Management**: Team organization

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their organization's data
- Automatic data isolation
- Secure multi-tenancy

### Authentication
- OAuth with major providers
- Secure session management
- Role-based permissions

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: Failed to connect to Supabase
```
**Solution**: Check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`

#### 2. Authentication Redirect Error
```
Error: Invalid redirect URL
```
**Solution**: Add your domain to Supabase Auth settings

#### 3. AI Features Not Working
```
Error: Gemini API error
```
**Solution**: Verify your `GEMINI_API_KEY` is correct

#### 4. Video Calls Not Loading
```
Error: Jitsi Meet failed to load
```
**Solution**: Check browser permissions for camera/microphone

### Debug Mode
Enable debug logging:
```env
DEBUG=crm:*
LOG_LEVEL=debug
```

## 📞 Support

### Getting Help
- Check the [GitHub Issues](https://github.com/ReachlytixDev/code-server/issues)
- Review the [Main Documentation](./LIVE_CRM_SETUP.md)
- Test with the demo script: `node scripts/demo-live-crm.js`

### Database Management
Use Supabase dashboard for:
- Viewing data
- Managing users
- Monitoring performance
- Setting up backups

## 🎉 Success Checklist

- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] Authentication working
- [ ] Can create organizations
- [ ] Team members can join
- [ ] Video meetings work
- [ ] AI assistant responds
- [ ] Real-time transcription active
- [ ] Meeting summaries generated

## 🔮 Next Steps

1. **Customize Branding**: Update organization logos and themes
2. **Add Integrations**: Connect external CRM systems
3. **Scale Infrastructure**: Move to production Supabase plan
4. **Advanced AI**: Configure custom AI models
5. **Mobile Access**: Set up mobile-friendly interface

**You now have a fully functional, multi-tenant, AI-powered CRM with team collaboration!** 🚀

## 🌟 Advanced Features

### Custom AI Models
- Train custom Gemini models for your industry
- Create specialized meeting assistants
- Build domain-specific transcription

### Enterprise Features
- Single Sign-On (SSO)
- Advanced analytics
- Custom integrations
- White-label solutions

### Scaling
- Multiple regions
- Load balancing
- CDN integration
- Performance monitoring

Welcome to the future of collaborative CRM! 🎪✨