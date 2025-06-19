# AI-Powered CRM for VS Code

A comprehensive Customer Relationship Management system built on top of VS Code's rich foundation, utilizing modern web technologies and AI-powered automation.

## 🚀 Features

### ⚡ Co-pilot Reacher
- AI-powered chat assistant for CRM navigation
- Natural language task automation
- Context-aware suggestions and insights
- ChatGPT-like interface for seamless interaction

### 🏠 Home Dashboard
- **Dashboard**: Overview of all CRM activities and metrics
- **Leads**: Lead management and tracking
- **Tasks**: Task assignment and progress monitoring
- **Analytics**: Performance insights and reporting

### 📞 VOIP Dialer
- **Manual Dialer**: Direct calling interface with Twilio integration
- **Automated Dialer**: Sequential lead calling for call center efficiency
- **Scripts**: Telemarketing and sales pitch management
- **Call Logs**: Comprehensive call history and analytics

### 🪟 Campaigns Management
- **Email Marketing**: Full inbox, drafts, sent, junk, and trash management
- **SMS Marketing**: AI-driven SMS campaign automation
- **Telemarketing**: Comprehensive telemarketing campaign tools

### 🤖 Agent Studio
- **LeadGen**: AI-powered lead generation and scraping
- **AgentHub**: 
  - Realtime TTS/STT AI calling agents
  - Email marketing automation agents
  - SMS marketing automation agents
  - Campaign creator and orchestrator agents
  - AI copywriting agents for scripts and content
- **Automation Studio**: n8n/Zapier-like automation pipeline

### ⚙️ Settings
- User management and permissions
- System configuration
- Tiered upgrade plans and limitations

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS (with `crm-` prefix)
- **Icons**: Lucide React
- **Integration**: VS Code Workbench patches

## 📁 Project Structure

```
src/browser/crm/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── activity-bar/    # Activity bar components
│   ├── copilot/         # Co-pilot chat interface
│   ├── home/            # Dashboard and home components
│   ├── dialer/          # VOIP dialer components
│   ├── campaigns/       # Campaign management
│   ├── agent-studio/    # AI agent building
│   └── settings/        # Settings and configuration
├── pages/               # Page-level components
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
├── styles/              # CSS and styling
└── index.tsx           # Main entry point
```

## 🔧 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build VS Code with CRM Integration**:
   ```bash
   npm run build:vscode
   npm run build
   ```

3. **Start Development Server**:
   ```bash
   npm run watch
   ```

## 🎨 UI Components

The CRM uses a comprehensive set of shadcn/ui components with Tailwind CSS styling:

- **Button**: Various variants and sizes
- **Card**: Content containers with headers and footers
- **Input**: Form input fields
- **Dialog**: Modal dialogs and overlays
- **Dropdown**: Menu and selection components
- **Toast**: Notification system

All components use the `crm-` prefix to avoid conflicts with VS Code's existing styles.

## 🔌 Integration with VS Code

The CRM integrates with VS Code through a series of patches:

1. **Workbench Integration**: Adds CRM container to the main layout
2. **Activity Bar**: Registers CRM activity bar items
3. **Service Registration**: Adds CRM service to the dependency injection system
4. **Layout Management**: Handles CRM panel visibility and positioning

## 🚀 Development Workflow

1. **Component Development**: Create new components in the appropriate directory
2. **Type Safety**: Define TypeScript interfaces in `types/index.ts`
3. **Styling**: Use Tailwind classes with `crm-` prefix
4. **Testing**: Add tests for new components and features
5. **Integration**: Update patches if VS Code integration changes

## 📊 Data Models

Key TypeScript interfaces:

- `User`: User management and roles
- `Lead`: Lead information and status tracking
- `Task`: Task management and assignment
- `CallLog`: Call history and analytics
- `Campaign`: Marketing campaign data
- `Agent`: AI agent configuration
- `Script`: Sales and marketing scripts

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user CRM access
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: Companion mobile application
- **Third-party Integrations**: Salesforce, HubSpot, etc.
- **Voice Commands**: Voice-controlled CRM operations
- **Workflow Automation**: Advanced business process automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

---

Built with ❤️ for the future of CRM and development productivity.