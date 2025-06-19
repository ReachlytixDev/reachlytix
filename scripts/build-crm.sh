#!/bin/bash

# Build script for AI-Powered CRM integration
# This script helps build and test the CRM components

set -e

echo "🚀 Building AI-Powered CRM for code-server..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the code-server root directory"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if VS Code submodule is initialized
if [ ! -f "lib/vscode/package.json" ]; then
    echo "📥 Initializing VS Code submodule..."
    git submodule update --init --recursive
else
    echo "✅ VS Code submodule already initialized"
fi

# Apply patches
echo "🔧 Applying patches..."
npm run postinstall

# Build Tailwind CSS for CRM
echo "🎨 Building Tailwind CSS..."
npx tailwindcss -i ./src/browser/crm/styles/globals.css -o ./src/browser/crm/styles/output.css --watch=false

# Build the project
echo "🔨 Building code-server with CRM integration..."
npm run build

echo "✅ Build complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the development server: npm run watch"
echo "2. Open http://localhost:8080 to see code-server with CRM"
echo "3. Look for the CRM activity bar items on the left side"
echo ""
echo "📖 For more information, see src/browser/crm/README.md"