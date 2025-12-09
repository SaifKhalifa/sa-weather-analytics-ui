# 🚀 Quick Command Reference

## Git Commands

### Initial Setup
```bash
# Navigate to project
cd "D:/Courses/Big Data Engineering/Final Project Resources/sa-weather-analytics-ui"

# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial commit - SA Weather Analytics Dashboard"

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/sa-weather-analytics-ui.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Daily Git Workflow
```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: your feature description"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature
```

---

## NPM Commands

### Development
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run lint
```

### Clean Install
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Netlify Commands

### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login
```

### Deployment
```bash
# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open

# Check site status
netlify status
```

---

## Useful Git Shortcuts

```bash
# Quick commit all changes
git add . && git commit -m "update: your message" && git push

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git checkout -- .

# View commit history
git log --oneline --graph

# View file changes
git diff

# View staged changes
git diff --staged

# Tag a release
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

---

## Troubleshooting Commands

### Fix Git Issues
```bash
# Remove remote and re-add
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/sa-weather-analytics-ui.git

# Force push (use carefully!)
git push -f origin main

# Clone your repo elsewhere
git clone https://github.com/YOUR-USERNAME/sa-weather-analytics-ui.git
```

### Fix NPM Issues
```bash
# Clear npm cache
npm cache clean --force

# Rebuild node_modules
rm -rf node_modules package-lock.json
npm install

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

### Fix Build Issues
```bash
# Clean build
rm -rf dist
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Verify environment
echo $VITE_API_BASE_URL
```

---

## Environment Variables

### Local (.env.local)
```bash
# View environment
cat .env.local

# Edit environment
nano .env.local
# or
notepad .env.local
```

### Netlify Environment
```bash
# Set via CLI
netlify env:set VITE_API_BASE_URL "https://your-api.com/api"

# List environment variables
netlify env:list

# Or set in dashboard:
# https://app.netlify.com → Site settings → Environment variables
```

---

## Project Structure Commands

```bash
# List all files (including hidden)
ls -la

# View project structure
tree -L 2

# Count lines of code
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Find specific file
find . -name "*.tsx"

# Search in files
grep -r "searchterm" .
```

---

## Quick Deploy (Complete Flow)

```bash
# 1. Build locally
npm run build

# 2. Test build
npm run preview

# 3. Commit changes
git add .
git commit -m "build: ready for production"

# 4. Push to GitHub
git push

# 5. Deploy to Netlify (if using CLI)
netlify deploy --prod
```

---

## One-Line Deploy

```bash
# Build, commit, push, and deploy
npm run build && git add . && git commit -m "deploy: production update" && git push && netlify deploy --prod
```

---

## Useful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
# Git aliases
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline'

# NPM aliases
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrp='npm run preview'

# Combined aliases
alias deploy='npm run build && git add . && git commit -m "deploy" && git push'
```

---

## Check Everything Works

```bash
# Full verification
npm install                    # Should succeed
npm run build                  # Should succeed (0 errors)
git status                     # Should show clean or changes
netlify status                 # Should show site info (if deployed)
```

---

## Emergency Commands

### Reset Everything
```bash
# Nuclear option - start fresh
rm -rf node_modules dist .git
git init
npm install
npm run build
```

### Recover from Bad Commit
```bash
# Go back to previous commit
git reset --hard HEAD~1

# Go to specific commit
git log --oneline              # Find commit hash
git reset --hard <commit-hash>
```

### Fix Merge Conflicts
```bash
# Abort merge
git merge --abort

# Accept all theirs
git checkout --theirs .

# Accept all ours
git checkout --ours .
```

---

## Monitoring & Logs

### Netlify Logs
```bash
# View deploy logs
netlify logs

# Watch live logs
netlify logs --follow
```

### Git Logs
```bash
# Detailed log
git log

# Graph view
git log --graph --oneline --all

# Specific file history
git log --follow path/to/file
```

---

## Common Workflows

### Feature Development
```bash
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
# Create PR on GitHub
```

### Bug Fix
```bash
git checkout -b fix/bug-description
# ... fix bug ...
git add .
git commit -m "fix: resolve bug description"
git push origin fix/bug-description
# Create PR on GitHub
```

### Update Dependencies
```bash
npm outdated                   # Check what's outdated
npm update                     # Update minor versions
npm install package@latest     # Update specific package
npm run build                  # Test build
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

---

## Testing Before Deploy

```bash
# Full test workflow
npm install                    # ✅ Dependencies
npm run build                  # ✅ Build succeeds
npm run preview                # ✅ Test production build
# Open http://localhost:4173
# Test all pages
# Check browser console (F12)
```

---

**Save this file for quick reference!** 📌
