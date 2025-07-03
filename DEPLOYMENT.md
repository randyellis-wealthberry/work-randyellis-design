# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- GitHub CLI (optional) or Vercel CLI

## 📦 GitHub Deployment

### Option 1: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not already installed
# brew install gh (macOS)
# Or visit: https://cli.github.com/

# Authenticate with GitHub
gh auth login

# Create repository and push
gh repo create work-randyellis-design --public --push --source=.
```

### Option 2: Manual GitHub Setup
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `work-randyellis-design`
3. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/work-randyellis-design.git
git push -u origin main
```

## ⚡ Vercel Deployment

### Option 1: Using Vercel CLI (Recommended)
```bash
# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

### Option 2: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Deploy with default settings

## 🔧 Environment Variables (Optional)
If you need environment variables, create them in:
- Vercel Dashboard → Project Settings → Environment Variables
- Or locally in `.env.local` (not committed to git)

## 📝 Post-Deployment Checklist
- [ ] Test the live site
- [ ] Verify all animations work
- [ ] Check mobile responsiveness
- [ ] Test blog posts load correctly
- [ ] Ensure all images and assets load

## 🎯 Performance Tips
- The site is already optimized for Core Web Vitals
- Images are automatically optimized by Next.js
- Static generation is enabled for best performance
- Motion-Primitives are tree-shaken for minimal bundle size

## 🔄 Continuous Deployment
- Vercel automatically deploys on every push to main branch
- Preview deployments are created for pull requests
- No additional configuration needed!
