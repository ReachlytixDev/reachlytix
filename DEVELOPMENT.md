# AI-Powered CRM Development Guide

This guide helps you get started with developing and testing the AI-Powered CRM integration in code-server.

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Clone the repository (if not already done)
git clone https://github.com/ReachlytixDev/code-server.git
cd code-server

# Switch to the CRM feature branch
git checkout feature/ai-crm-ui

# Run the build script
./scripts/build-crm.sh
```

### 2. Development Workflow

```bash
# Start development server with hot reload
npm run watch

# In another terminal, watch Tailwind CSS changes
npx tailwindcss -i ./src/browser/crm/styles/globals.css -o ./src/browser/crm/styles/output.css --watch

# Open your browser to http://localhost:8080
```

## 🏗️ Architecture Overview

### CRM Integration Points

1. **Activity Bar**: Custom CRM icons added to VS Code's activity bar
2. **Workbench**: CRM panels integrated into the main workbench layout
3. **Services**: CRM service registered with VS Code's dependency injection
4. **Patches**: Minimal patches to VS Code core for integration

### Component Hierarchy

```
CRMLayout
├── Header (Organization, Profile, Support, Theme toggle)
├── ActivityBar (6 main CRM sections)
└── ContentArea
    ├── CopilotChat (AI assistant)
    ├── Dashboard (Home overview)
    ├── Dialer (VOIP calling)
    ├── Campaigns (Marketing)
    ├── AgentStudio (AI automation)
    └── Settings (Configuration)
```

## 🛠️ Development Tasks

### Adding New Components

1. Create component in appropriate directory:
   ```bash
   # Example: Adding a new leads component
   mkdir -p src/browser/crm/components/leads
   touch src/browser/crm/components/leads/LeadsList.tsx
   ```

2. Follow the component template:
   ```tsx
   import * as React from "react"
   import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
   import { cn } from "../../lib/utils"

   interface LeadsListProps {
     className?: string
   }

   export function LeadsList({ className }: LeadsListProps) {
     return (
       <Card className={cn("crm-w-full", className)}>
         <CardHeader>
           <CardTitle>Leads</CardTitle>
         </CardHeader>
         <CardContent>
           {/* Component content */}
         </CardContent>
       </Card>
     )
   }
   ```

3. Export from index file:
   ```tsx
   // src/browser/crm/components/index.ts
   export { LeadsList } from "./leads/LeadsList"
   ```

### Styling Guidelines

- Use Tailwind CSS classes with `crm-` prefix
- Follow shadcn/ui component patterns
- Maintain consistent spacing and typography
- Support both light and dark themes

### TypeScript Types

Add new types to `src/browser/crm/types/index.ts`:

```tsx
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: LeadStatus
  // ... other properties
}
```

## 🧪 Testing

### Component Testing

```bash
# Run component tests (when implemented)
npm run test:crm

# Run specific component test
npm run test src/browser/crm/components/copilot/CopilotChat.test.tsx
```

### Integration Testing

```bash
# Build and test full integration
./scripts/build-crm.sh

# Start development server
npm run watch

# Test CRM functionality in browser
open http://localhost:8080
```

## 📦 Building for Production

```bash
# Full production build
npm run build

# Build only CRM assets
npm run build:crm

# Build with specific environment
NODE_ENV=production npm run build
```

## 🔧 Troubleshooting

### Common Issues

1. **Tailwind classes not working**:
   - Ensure Tailwind is built: `npx tailwindcss -i ./src/browser/crm/styles/globals.css -o ./src/browser/crm/styles/output.css`
   - Check that classes use `crm-` prefix

2. **VS Code patches not applied**:
   - Run `npm run postinstall` to apply patches
   - Check `patches/series` includes `crm-integration.diff`

3. **React components not rendering**:
   - Verify React dependencies are installed
   - Check browser console for errors
   - Ensure components are properly exported

4. **Build failures**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check VS Code submodule: `git submodule update --init --recursive`

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
export DEBUG=crm:*

# Start with verbose logging
npm run watch -- --verbose
```

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

1. Create a feature branch from `feature/ai-crm-ui`
2. Make your changes following the guidelines above
3. Test thoroughly
4. Submit a pull request with detailed description

## 📞 Support

For development questions:
- Check existing issues in the repository
- Review the CRM README: `src/browser/crm/README.md`
- Contact the development team

---

Happy coding! 🚀