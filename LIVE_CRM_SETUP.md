# 🚀 Live AI-Powered CRM Setup Guide

## 🎯 Quick Start

This guide will help you set up the complete AI-Powered CRM system with real API integrations.

### 📋 Prerequisites

- Node.js 16+ installed
- VS Code or code-server
- API accounts for the services below

### 🔑 Required API Keys

#### 1. Google Gemini AI
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the key for `GEMINI_API_KEY`

#### 2. Twilio (Voice & SMS)
- Sign up at [Twilio](https://www.twilio.com/)
- Get your Account SID and Auth Token from the console
- Purchase a phone number
- Create API keys in the console

#### 3. Deepgram (Voice AI)
- Sign up at [Deepgram](https://deepgram.com/)
- Get your API key from the dashboard
- You get $200 free credit

#### 4. Email Service (Optional)
- Set up BillionMail or use SMTP
- Configure email service credentials

## 🛠️ Installation Steps

### 1. Clone and Setup
```bash
git clone https://github.com/ReachlytixDev/code-server.git
cd code-server
git checkout feature/ai-crm-ui
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual API keys
nano .env
```

### 3. Configure Your API Keys
Edit `.env` file with your credentials:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your-actual-gemini-api-key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-actual-twilio-account-sid
TWILIO_AUTH_TOKEN=your-actual-twilio-auth-token
TWILIO_PHONE_NUMBER=your-actual-twilio-phone-number
TWILIO_API_KEY_SID=your-actual-twilio-api-key-sid
TWILIO_API_KEY_SECRET=your-actual-twilio-api-key-secret

# Deepgram Configuration
DEEPGRAM_API_KEY=your-actual-deepgram-api-key
```

### 4. Build and Start
```bash
# Build the CRM system
npm run build:crm

# Start the development server
npm run watch:crm

# Or start the production server
npm start
```

### 5. Access the CRM
- Open your browser to `http://localhost:8080`
- Navigate to the CRM section
- You'll see the Live AI Dashboard

## 🎪 Running the Live Demo

### Interactive Demo
```bash
# Run the interactive demo
node scripts/demo-live-crm.js

# Open the generated demo.html in your browser
```

### Manual Testing

#### 1. Test AI Lead Analysis
```javascript
// In the browser console
const geminiAI = GeminiAIService.getInstance()
const analysis = await geminiAI.analyzeLeadQuality({
  firstName: 'John',
  lastName: 'Smith',
  company: 'TechCorp',
  email: 'john@techcorp.com',
  phone: '+1234567890'
})
console.log(analysis)
```

#### 2. Test Twilio Integration
```javascript
// Test SMS sending
const twilio = TwilioService.getInstance()
const sms = await twilio.sendSMS({
  to: '+1234567890',
  body: 'Test message from AI CRM'
})
console.log(sms)
```

#### 3. Test Voice AI
```javascript
// Test voice synthesis
const deepgram = DeepgramService.getInstance()
const audio = await deepgram.synthesizeSpeech('Hello from AI CRM!')
console.log('Audio generated:', audio.byteLength, 'bytes')
```

## 🔧 VS Code Extension Setup

The CRM automatically installs and configures these extensions:

### Required Extensions
- **Database Client** (`cweijan.vscode-database-client2`)
- **Excel Viewer** (`GrapeCity.gc-excelviewer`)
- **Thunder Client** (`rangav.vscode-thunder-client`)
- **Rainbow CSV** (`mechatroner.rainbow-csv`)
- **Roo Code** (`RooVeterinaryInc.roo-cline`)

### Auto-Installation
Extensions are automatically installed when you first access the CRM. You can also manually install them:

```bash
# Install extensions via command line
code --install-extension cweijan.vscode-database-client2
code --install-extension GrapeCity.gc-excelviewer
code --install-extension rangav.vscode-thunder-client
code --install-extension mechatroner.rainbow-csv
code --install-extension RooVeterinaryInc.roo-cline
```

## 📊 Features Overview

### 🤖 AI-Powered Features
- **Lead Analysis**: Real-time lead scoring with Gemini AI
- **Content Generation**: AI-generated emails and call scripts
- **Conversation AI**: Intelligent call handling and responses
- **Predictive Analytics**: AI-driven insights and recommendations

### 📞 Communication Features
- **Voice Calls**: Real Twilio integration for outbound calls
- **SMS Campaigns**: Automated SMS with personalization
- **Voice AI**: Real-time transcription and voice synthesis
- **Call Analytics**: Sentiment analysis and performance tracking

### 📧 Email Features
- **AI Email Generation**: Personalized content at scale
- **Campaign Management**: Multi-channel coordination
- **Real-time Tracking**: Open rates, click rates, conversions
- **Template System**: AI-enhanced email templates

### 📈 Analytics Features
- **Live Dashboard**: Real-time metrics and activities
- **Campaign Performance**: Multi-channel analytics
- **AI Task Monitoring**: Track AI agent activities
- **ROI Tracking**: Revenue and conversion analytics

## 🚀 Production Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t ai-crm .

# Run with environment variables
docker run -d \
  -p 8080:8080 \
  -e GEMINI_API_KEY=your-key \
  -e TWILIO_ACCOUNT_SID=your-sid \
  -e TWILIO_AUTH_TOKEN=your-token \
  ai-crm
```

### Cloud Deployment
The system can be deployed to:
- **AWS**: EC2, ECS, or Lambda
- **Google Cloud**: Compute Engine or Cloud Run
- **Azure**: App Service or Container Instances
- **Vercel/Netlify**: For frontend-only deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@host:5432/crm
REDIS_URL=redis://localhost:6379
```

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables or secret management
- Rotate keys regularly
- Monitor API usage

### Data Protection
- Enable HTTPS in production
- Implement proper authentication
- Use database encryption
- Follow GDPR/privacy regulations

## 🐛 Troubleshooting

### Common Issues

#### 1. API Key Errors
```
Error: Gemini API error: 401 Unauthorized
```
**Solution**: Check your `GEMINI_API_KEY` in `.env`

#### 2. Twilio Connection Issues
```
Error: Twilio API error: 403 Forbidden
```
**Solution**: Verify your Twilio credentials and account status

#### 3. Extension Installation Failures
```
Error: Failed to install extension
```
**Solution**: Install extensions manually or check VS Code permissions

#### 4. Build Errors
```
Error: Module not found
```
**Solution**: Run `npm install` and ensure all dependencies are installed

### Debug Mode
Enable debug logging:
```env
DEBUG=crm:*
LOG_LEVEL=debug
```

## 📞 Support

### Getting Help
- Check the [GitHub Issues](https://github.com/ReachlytixDev/code-server/issues)
- Review the [Documentation](./AI_CRM_FEATURES.md)
- Run the demo script for examples

### Contributing
- Fork the repository
- Create a feature branch
- Submit a pull request
- Follow the coding standards

## 🎉 Success!

If everything is set up correctly, you should see:
- ✅ Live AI Dashboard with real-time updates
- ✅ AI services showing as "Active"
- ✅ Ability to create and run campaigns
- ✅ Real API integrations working
- ✅ VS Code extensions installed and configured

**You now have a fully functional AI-Powered CRM system!** 🚀

## 🔮 Next Steps

1. **Import Your Data**: Use the data integration features to import leads
2. **Create Campaigns**: Set up your first AI-powered campaign
3. **Configure Workflows**: Customize automation rules
4. **Monitor Performance**: Use the live dashboard to track results
5. **Scale Up**: Add more AI agents and integrations

Welcome to the future of CRM! 🎪✨