# 🚀 Quick Start Checklist

Use this checklist for initial setup and testing.

## ✅ Initial Setup (One-Time)

### 1. Install Node.js
- [ ] Download from https://nodejs.org (v18 or higher)
- [ ] Verify: `node --version` and `npm --version`

### 2. Clone/Setup Project
```bash
cd C:\Users\sosau\source\repos\carefabricexperience
```

### 3. Install Dependencies
- [ ] Frontend: `npm install`
- [ ] Server: `cd server && npm install && cd ..`

### 4. Create Strapi CMS
- [ ] Run: `npx create-strapi-app@latest cms --quickstart`
- [ ] Wait for Strapi to open in browser
- [ ] Create admin account (save credentials!)

### 5. Configure Strapi Content Types

Follow **STRAPI_SETUP.md** Section 3 to create:

#### A. Product Collection Type
- [ ] Click "Content-Type Builder"
- [ ] Create "Product" collection
- [ ] Add fields: productId, title, tagline, description, color, etc.
- [ ] Save

#### B. Content Section Component
- [ ] Create "ContentSection" component
- [ ] Add fields: sectionType, title, layout, content, media, order
- [ ] Save

#### C. Add sections to Product
- [ ] Edit Product content type
- [ ] Add "sections" field (repeatable component)
- [ ] Select ContentSection
- [ ] Save

#### D. Realtime Config Component
- [ ] Create "RealtimeConfig" component
- [ ] Add fields: enabled, endpoint, refreshInterval
- [ ] Save
- [ ] Add to Product as single component

#### E. Stat Data Collection
- [ ] Create "StatData" collection
- [ ] Add fields: productId, metric, value, trend, timestamp
- [ ] Save

### 6. Set Permissions
- [ ] Settings → Users & Permissions → Roles → Public
- [ ] Enable: Product (find, findOne)
- [ ] Enable: StatData (find, findOne)
- [ ] Enable: Upload (find, findOne)
- [ ] Save

### 7. Get API Token
- [ ] Settings → API Tokens → Create new
- [ ] Name: "Display Access"
- [ ] Type: Read-only
- [ ] Duration: Unlimited
- [ ] Copy token (you'll only see it once!)

### 8. Configure Environment
- [ ] Create `.env` file in project root:
```env
REACT_APP_SERVER_URL=http://localhost:3001
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_STRAPI_TOKEN=paste-your-token-here
```

### 9. Add Test Product
- [ ] Go to Content Manager → Product → Create new entry
- [ ] Fill in:
  - productId: `myAvatar`
  - title: `myAvatar`
  - color: `#2563eb`
  - template: `standard`
  - active: ON
- [ ] Add a features section:
  ```json
  {
    "items": ["Feature 1", "Feature 2", "Feature 3"]
  }
  ```
- [ ] Save & Publish

---

## 🎬 Daily Startup (Every Time)

### Terminal 1: Start Frontend
```bash
npm start
```
Wait for: "Compiled successfully!" and browser opens to http://localhost:3000

### Terminal 2: Start WebSocket Server
```bash
cd server
npm start
```
Wait for: "Server running on port 3001"

### Terminal 3: Start Strapi
```bash
cd cms
npm run develop
```
Wait for: "Server started" and browser opens to http://localhost:1337/admin

**OR use one command:**
```bash
npm run dev:all
```

---

## ✅ Verification Tests

### Test 1: Check All Services Running
- [ ] Frontend: http://localhost:3000 (shows wheel)
- [ ] Display: http://localhost:3000/display (shows "waiting for selection")
- [ ] Strapi: http://localhost:1337/admin (shows admin panel)
- [ ] WebSocket: All connection dots are GREEN

### Test 2: Test Remote → Display Communication
- [ ] Open http://localhost:3000 in one window
- [ ] Open http://localhost:3000/display in another window
- [ ] Click a category on wheel
- [ ] Click a product button
- [ ] Display should update immediately!

### Test 3: Test Strapi Content
- [ ] Display should show your test product (myAvatar)
- [ ] Check product title, color, and features appear
- [ ] No error messages in browser console

### Test 4: Test Content Editing
- [ ] Go to Strapi admin
- [ ] Edit your test product
- [ ] Change title to "myAvatar - Updated"
- [ ] Save
- [ ] Click button again on remote
- [ ] Display should show updated title

### Test 5: Test Real-time Stats (Optional)
- [ ] In Strapi: Enable realtimeConfig on product
- [ ] Create StatData entry:
  - productId: `myAvatar`
  - metric: `activeUsers`
  - value: `1,234`
  - timestamp: (auto)
- [ ] Add stats section to product:
  ```json
  {
    "metrics": [
      {
        "metric": "activeUsers",
        "label": "Active Users",
        "value": "Loading..."
      }
    ]
  }
  ```
- [ ] Save & Publish
- [ ] Click product button
- [ ] Wait 30 seconds - value should update to "1,234"

---

## 🐛 Troubleshooting Quick Fixes

### "Cannot connect to server"
```bash
# Restart WebSocket server
cd server
npm start
```

### "Strapi not found"
```bash
# Check if cms folder exists
ls cms

# If not, create Strapi
npx create-strapi-app@latest cms --quickstart
```

### "Product not found"
- Check productId matches exactly (case-sensitive!)
- Check product is Published
- Check Public permissions are enabled

### "Port already in use"
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Clear Cache & Restart
```bash
# Stop all servers (Ctrl+C in each terminal)

# Clear caches
rm -rf node_modules/.cache
cd cms && rm -rf .cache && cd ..

# Restart everything
npm run dev:all
```

---

## 📦 Production Deployment Checklist

### Before Deploying
- [ ] Switch to PostgreSQL (see STRAPI_SETUP.md)
- [ ] Set up S3/CDN for media (see STRAPI_SETUP.md)
- [ ] Configure production environment variables
- [ ] Test on production-like environment
- [ ] Create database backups
- [ ] Document server credentials

### Deploy Strapi
- [ ] Deploy to Heroku/AWS/DigitalOcean
- [ ] Update REACT_APP_STRAPI_URL in production
- [ ] Test API endpoints work
- [ ] Verify media uploads work

### Deploy Frontend & Server
- [ ] Build frontend: `npm run build`
- [ ] Deploy static files to CDN/server
- [ ] Start WebSocket server on production
- [ ] Update firewall rules for port 3001

### Post-Deploy
- [ ] Test remote → display connection
- [ ] Test content updates from Strapi
- [ ] Monitor logs for errors
- [ ] Train content team on Strapi

---

## 🎓 Next Steps

After completing this checklist:

1. Read **EDITOR_GUIDE.md** - For content team
2. Review **SAMPLE_PRODUCTS.md** - For content examples
3. Check **STRAPI_SETUP.md** - For advanced Strapi features
4. See **SETUP.md** - For network configuration

---

## 📋 Status Tracking

| Task | Status | Date | Notes |
|------|--------|------|-------|
| Initial setup | ⬜ | | |
| Strapi configured | ⬜ | | |
| First product added | ⬜ | | |
| Remote→Display tested | ⬜ | | |
| Content team trained | ⬜ | | |
| Production deployed | ⬜ | | |

---

**Need help?** Check the docs or ask your technical lead! 🚀
