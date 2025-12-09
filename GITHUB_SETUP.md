# 🚀 GitHub Setup & Deployment Guide

## Quick Start: Push to GitHub

### 1. Initialize Git Repository (if not already done)

```bash
cd "D:/Courses/Big Data Engineering/Final Project Resources/sa-weather-analytics-ui"
git init
git add .
git commit -m "Initial commit: SA Weather Analytics Dashboard"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `sa-weather-analytics-ui`
3. Description: `Real-time weather analytics dashboard for Saudi Arabia`
4. **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have them)
6. Click "Create repository"

### 3. Connect to GitHub and Push

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/sa-weather-analytics-ui.git
git branch -M main
git push -u origin main
```

---

## Netlify Deployment Setup

### Option 1: Connect GitHub to Netlify (Recommended)

1. **Go to Netlify**: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your repository: `sa-weather-analytics-ui`
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Environment variables:**
   - Click "Show advanced"
   - Add variable:
     - Key: `VITE_API_BASE_URL`
     - Value: `https://your-backend-api.com/api` (your actual backend URL)
7. Click **"Deploy site"**

### Option 2: Manual Deploy via Netlify CLI

```bash
# If not installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Update Environment Variables on Netlify

1. Go to your site dashboard on Netlify
2. **Site settings** → **Environment variables**
3. Add/Update:
   - `VITE_API_BASE_URL`: Your backend API URL

---

## Update README with Your Info

After pushing to GitHub, update these placeholders in `README.md`:

```markdown
# Replace these:
YOUR-USERNAME → your actual GitHub username
YOUR-SITE-NAME → your Netlify site name (e.g., sa-weather-analytics)
your-app.netlify.app → your actual Netlify URL
```

### Get Your Netlify Badge

1. Go to Netlify dashboard → Site settings → Status badges
2. Copy the markdown code
3. Replace the badge in README.md

---

## Git Workflow for Future Updates

### Making Changes

```bash
# Create a new branch for your feature
git checkout -b feature/new-feature-name

# Make your changes...

# Stage and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature-name
```

### Create Pull Request

1. Go to your GitHub repository
2. Click "Compare & pull request"
3. Fill in the PR template
4. Click "Create pull request"

### Merge and Deploy

1. Once PR is approved, merge it
2. Netlify will automatically deploy the changes (if connected)

---

## Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log --oneline

# Create and switch to new branch
git checkout -b branch-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# Discard local changes
git checkout -- .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## Branch Strategy

### Main Branches
- `main` - Production-ready code (protected)
- `develop` - Development branch (optional)

### Feature Branches
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation` - Documentation updates
- `refactor/component-name` - Code refactoring

---

## Protecting Your Main Branch

1. Go to GitHub repository → **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass (if CI is set up)
   - ✅ Include administrators

---

## GitHub Secrets for CI/CD

If you want to use GitHub Actions:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secret:
   - Name: `VITE_API_BASE_URL`
   - Value: Your backend API URL

---

## Netlify Configuration

The `netlify.toml` file is already configured with:
- ✅ Build command
- ✅ Publish directory
- ✅ SPA redirects (fixes routing issues)
- ✅ Security headers
- ✅ Asset caching

---

## Troubleshooting

### "Failed to load data" on deployed site
**Solution:** Set `VITE_API_BASE_URL` in Netlify environment variables

### Routes not working (404 errors)
**Solution:** `netlify.toml` already has redirects configured

### Build fails on Netlify
**Solution:** 
1. Check build log
2. Verify `package.json` dependencies
3. Make sure Node version is 18+ (set in `netlify.toml`)

### CORS errors
**Solution:** Configure CORS on your backend to allow your Netlify domain

---

## Next Steps After Deployment

1. ✅ Test all pages on production URL
2. ✅ Verify API connection works
3. ✅ Check browser console for errors
4. ✅ Test on mobile devices
5. ✅ Share the link! 🎉

---

## GitHub Repository Setup Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] README badges updated with your info
- [ ] Branch protection rules set (optional)
- [ ] GitHub Actions configured (optional)
- [ ] Contributors added (if team project)
- [ ] Repository description and topics added
- [ ] License file present (MIT)

## Netlify Deployment Checklist

- [ ] Site connected to GitHub
- [ ] Environment variables configured
- [ ] Custom domain added (optional)
- [ ] SSL certificate enabled (automatic)
- [ ] Deploy previews enabled for PRs
- [ ] Build hooks configured (optional)
- [ ] Status badge added to README

---

## Example: Complete Setup in 2 Minutes

```bash
# 1. Initialize and commit
git init
git add .
git commit -m "Initial commit"

# 2. Create repo on GitHub (via web)

# 3. Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/sa-weather-analytics-ui.git
git branch -M main
git push -u origin main

# 4. Deploy to Netlify (via web or CLI)
netlify deploy --prod

# Done! 🎉
```

---

**Your dashboard is now live and ready to showcase!** 🌤️

For questions or issues, check the main README or open an issue on GitHub.
