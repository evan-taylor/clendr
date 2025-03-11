#!/bin/bash

echo "🔍 Fixing Next.js static asset issues..."

# Kill any running Next.js processes
echo "📋 Stopping any running Next.js processes..."
pkill -f "next dev" || true
pkill -f "next" || true

# Clear Next.js build directories completely
echo "🗑️ Removing Next.js build cache..."
rm -rf .next
rm -rf node_modules/.cache

# Clear npm cache for this project
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Perform a clean build
echo "🏗️ Building the application from scratch..."
npm run build

# Start the development server
echo "🚀 Starting Next.js development server..."
npm run dev 