#!/bin/bash

echo "🧹 Cleaning Next.js cache..."
rm -rf .next/cache
rm -rf .next/static

echo "🔄 Clearing node_modules/.cache..."
rm -rf ../../node_modules/.cache

echo "🌐 Creating dummy files for static resources to prevent 404s..."
mkdir -p public/_next/static/chunks
touch public/_next/static/chunks/main.js
touch public/_next/static/chunks/react-refresh.js
touch public/_next/static/chunks/webpack.js
mkdir -p public/_next/static/chunks/pages
touch public/_next/static/chunks/pages/_app.js
touch public/_next/static/chunks/pages/index.js

echo "✅ Done! Now restart your development server with 'npm run dev'" 