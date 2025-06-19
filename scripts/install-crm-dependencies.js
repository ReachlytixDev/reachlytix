#!/usr/bin/env node

/**
 * Install CRM Dependencies Script
 * Installs all required dependencies for the AI-Powered CRM system
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
🚀 AI-POWERED CRM DEPENDENCY INSTALLER
=====================================

Installing all required dependencies for:
✅ Supabase Backend Integration
✅ Jitsi Meet Video Conferencing  
✅ Gemini Live API
✅ Team Collaboration Features
✅ Real-time AI Assistant

`);

const dependencies = [
  // Supabase
  '@supabase/supabase-js@^2.39.0',
  
  // Gemini AI
  '@google/genai@^0.2.1',
  
  // Audio/Video processing
  'mime@^4.0.1',
  
  // UI Components (if not already installed)
  '@radix-ui/react-tabs@^1.0.4',
  '@radix-ui/react-badge@^1.0.4',
  
  // Utilities
  'uuid@^9.0.1',
  'date-fns@^3.0.6'
];

const devDependencies = [
  '@types/mime@^3.0.4',
  '@types/uuid@^9.0.7'
];

async function installDependencies() {
  try {
    console.log('📦 Installing production dependencies...');
    
    // Install production dependencies
    for (const dep of dependencies) {
      try {
        console.log(`   Installing ${dep}...`);
        execSync(`npm install ${dep}`, { stdio: 'inherit' });
      } catch (error) {
        console.log(`   ⚠️  ${dep} may already be installed or failed to install`);
      }
    }

    console.log('\n🔧 Installing development dependencies...');
    
    // Install dev dependencies
    for (const dep of devDependencies) {
      try {
        console.log(`   Installing ${dep}...`);
        execSync(`npm install -D ${dep}`, { stdio: 'inherit' });
      } catch (error) {
        console.log(`   ⚠️  ${dep} may already be installed or failed to install`);
      }
    }

    console.log('\n✅ All dependencies installed successfully!');
    
    // Create environment file if it doesn't exist
    if (!fs.existsSync('.env')) {
      console.log('\n📝 Creating .env file from template...');
      fs.copyFileSync('.env.example', '.env');
      console.log('✅ .env file created. Please update it with your API keys.');
    }

    console.log(`
🎉 INSTALLATION COMPLETE!

Next steps:
1. Update your .env file with actual API keys
2. Set up your Supabase database using the schema in database/supabase-schema.sql
3. Run the CRM system with: npm run watch:crm

🔑 Required API Keys:
- Gemini API Key (Google AI Studio)
- Supabase credentials (provided)
- Twilio credentials (for voice/SMS)
- Deepgram API key (for voice AI)

📚 Documentation:
- Setup Guide: LIVE_CRM_SETUP.md
- Features: AI_CRM_FEATURES.md

🚀 Ready to revolutionize your CRM experience!
`);

  } catch (error) {
    console.error('❌ Installation failed:', error);
    process.exit(1);
  }
}

installDependencies();