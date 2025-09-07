#!/bin/bash

# Build script for the messaging core library
# This script compiles TypeScript and prepares the package for publishing

set -e

echo " Building @astrojose/nestjs-messaging-core..."

# Navigate to the core directory
cd "$(dirname "$0")"

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Build TypeScript
echo "Compiling TypeScript..."
npx tsc

# Copy additional files
echo "Copying additional files..."
cp package.json dist/
cp README.md dist/
cp *.md dist/ 2>/dev/null || true

echo "Build completed successfully!"
echo "Output directory: ./dist"
echo ""
echo "To publish:"
echo "  cd dist && npm publish"
echo ""
echo "To test locally:"
echo "  cd dist && npm pack"
