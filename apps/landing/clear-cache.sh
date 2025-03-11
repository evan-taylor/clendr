#!/bin/bash

# Stop any running Next.js dev servers
echo "Stopping any running Next.js servers..."
pkill -f "next dev" || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next/cache
rm -rf .next/static

# Install dependencies if needed
echo "Checking dependencies..."
npm install

# Start the dev server
echo "Starting Next.js dev server..."
npm run dev 