#!/bin/bash
# GitHub Setup Script for AI Second Brain

echo "🚀 Setting up GitHub repository for AI Second Brain"
echo "=================================================="

# Step 1: Initialize git repository
echo ""
echo "📍 Step 1: Initializing local Git repository..."
git init

# Step 2: Add all files
echo "📍 Step 2: Adding all project files..."
git add .

# Step 3: Create initial commit
echo "📍 Step 3: Creating initial commit..."
git commit -m "Initial commit: AI Second Brain - Full-stack health tracking application

- React dashboard for daily logging
- Express.js backend API
- SQLite database
- Streamlit AI analysis tool
- OpenAI integration for insights"

# Step 4: Show next steps
echo ""
echo "✅ Local repository initialized!"
echo ""
echo "📋 NEXT STEPS:"
echo "============="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: AI-Second-Brain"
echo "   - Description: Full-stack health tracking app with AI-powered insights"
echo "   - Make it PUBLIC (recommended)"
echo "   - DO NOT initialize with README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""
echo "2. Push to GitHub using one of these commands:"
echo ""
echo "   Option A (HTTPS - simpler):"
echo "   git remote add origin https://github.com/Aradhana2602/AI-Second-Brain.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "   Option B (SSH - requires SSH key setup):"
echo "   git remote add origin git@github.com:Aradhana2602/AI-Second-Brain.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. After pushing, your repository will be at:"
echo "   https://github.com/Aradhana2602/AI-Second-Brain"
echo ""
