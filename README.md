# Care Fabric Experience - CMS-Powered Display System

A professional remote control + display system with **Strapi CMS** for content management and real-time data integration.

## 🎯 What's New - Strapi CMS Integration

Your team can now manage all display content through a powerful admin interface:
- ✅ **Visual Editor** - No code needed to update content
- ✅ **Media Management** - Upload images and videos directly
- ✅ **Real-time Stats** - Live data updates on displays
- ✅ **Multiple Templates** - Choose layout styles per product
- ✅ **Flexible Sections** - Mix and match content blocks
- ✅ **Team Collaboration** - Multiple editors with role permissions

## 🚀 Quick Start

### 1. Install Everything
```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Create and setup Strapi CMS
npx create-strapi-app@latest cms --quickstart
```

### 2. Configure Strapi
Follow the **[STRAPI_SETUP.md](./STRAPI_SETUP.md)** guide to:
1. Create content types (Product, ContentSection, etc.)
2. Set up permissions
3. Add your first product
4. Get API token

### 3. Configure Environment
Create `.env` file:
```env
REACT_APP_SERVER_URL=http://localhost:3001
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_STRAPI_TOKEN=your-api-token-here
```

### 4. Start Everything
```bash
# Option 1: Start all services at once
npm run dev:all

# Option 2: Start individually
# Terminal 1: Frontend
npm start

# Terminal 2: WebSocket Server
npm run server

# Terminal 3: Strapi CMS
npm run strapi
```

### 5. Access the System
- **Remote Control**: http://localhost:3000
- **Display**: http://localhost:3000/display
- **Strapi Admin**: http://localhost:1337/admin

## 📚 Documentation

- **[STRAPI_SETUP.md](./STRAPI_SETUP.md)** - Complete Strapi configuration guide
- **[SAMPLE_PRODUCTS.md](./SAMPLE_PRODUCTS.md)** - Example product data templates
- **[SETUP.md](./SETUP.md)** - Deployment and network configuration
- **[SYSTEM.md](./SYSTEM.md)** - Technical architecture overview

## 🎨 Content Management Workflow

### For Content Editors

1. **Log into Strapi** at http://localhost:1337/admin
2. **Navigate to Products** in Content Manager
3. **Create/Edit Product**:
   - Fill in basic info (title, tagline, description)
   - Choose a color and template
   - Upload hero image/video
   - Add content sections (features, stats, videos, etc.)
   - Configure real-time data (optional)
4. **Save & Publish**
5. **Display Updates Automatically** - No code deployment needed!

### Content Section Types

| Section Type | Use For | Example |
|--------------|---------|---------|
| **Features** | Product capabilities | Key features list with descriptions |
| **Stats** | Metrics and numbers | User counts, performance stats (can be live!) |
| **Video** | Demo videos | Product demos, testimonials |
| **Gallery** | Image collections | Screenshots, photos |
| **Text** | Rich content | Descriptions, why choose us, etc. |
| **Custom** | Anything else | JSON data for special layouts |

### Templates Available

- **standard** - Full-featured product page with all sections
- **analytics** - Data-focused with prominent stats
- **service** - Service offering with text-heavy content
- **video** - Video-first presentation

## 🔴 Real-time Data Integration

### Enable Live Stats

1. **In Strapi Product Editor**:
   - Enable "Realtime Config"
   - Set refresh interval (e.g., 30000 = 30 seconds)

2. **Add Stats Data**:
   - Go to StatData collection
   - Create entries with productId and metrics
   - Stats auto-update on display!

3. **Custom Endpoints** (Optional):
   - Create custom API endpoints in Strapi
   - Point `realtimeConfig.endpoint` to your API
   - Display polls and updates automatically

See **[STRAPI_SETUP.md](./STRAPI_SETUP.md)** for full real-time setup.

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Remote Control │◄───────►│ WebSocket    │◄───────►│     Display     │
│   (Wheel UI)    │         │   Server     │         │  (Content View) │
│   Port 3000     │         │  Port 3001   │         │    Port 3000    │
└─────────────────┘         └──────────────┘         └─────────────────┘
                                                                ▲
                                                                │
                                                                ▼
                                                      ┌─────────────────┐
                                                      │  Strapi CMS     │
                                                      │  (Content Mgmt) │
                                                      │   Port 1337     │
                                                      └─────────────────┘
```

## 🚀 Production Deployment

### Database Setup (Recommended)
Switch from SQLite to PostgreSQL for production:

```bash
cd cms
npm install pg

# Configure in cms/config/database.js
# See STRAPI_SETUP.md for details
```

### Media Storage
Use S3, Azure Blob, or CDN for production media:

```bash
cd cms
npm install @strapi/provider-upload-aws-s3

# Configure in cms/config/plugins.js
# See STRAPI_SETUP.md for details
```

### Deployment Options

**All-in-One Server:**
- Deploy Strapi, WebSocket server, and frontend together
- Good for: Small teams, single location

**Distributed:**
- Strapi on cloud server (Heroku, AWS, etc.)
- WebSocket server on local network
- Frontend served from CDN
- Good for: Multiple locations, high availability

See **[SETUP.md](./SETUP.md)** for detailed deployment instructions.

## 🔒 Security Checklist

- [ ] Change default Strapi admin password
- [ ] Use API tokens (not public permissions)
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up Strapi rate limiting
- [ ] Regular database backups
- [ ] Keep all packages updated

## 📊 Product Configuration

### Quick Example

Add a product to Strapi with this structure:

```javascript
{
  productId: "myAvatar",
  title: "myAvatar", 
  tagline: "Comprehensive EHR",
  color: "#2563eb",
  template: "standard",
  sections: [
    {
      sectionType: "features",
      content: { items: ["Feature 1", "Feature 2"] }
    },
    {
      sectionType: "stats",
      content: { 
        metrics: [
          { label: "Users", value: "10,000+", trend: "+23%" }
        ]
      }
    }
  ]
}
```

See **[SAMPLE_PRODUCTS.md](./SAMPLE_PRODUCTS.md)** for complete examples.

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| CMS | Strapi 4 | Content management & API |
| Frontend | React 19 + TypeScript | UI framework |
| Real-time | Socket.io | WebSocket communication |
| Backend | Node.js + Express | WebSocket server |
| Database | SQLite/PostgreSQL | CMS data storage |
| Styling | CSS3 | Custom styling |
| Animation | Framer Motion | Smooth transitions |

## 🐛 Troubleshooting

### Strapi Not Connecting
```bash
# Check if Strapi is running
curl http://localhost:1337/api

# Restart Strapi
cd cms
npm run develop
```

### Content Not Updating
- Check API token in `.env`
- Verify product is "Published" in Strapi
- Clear browser cache
- Check browser console for errors

### Real-time Stats Not Working
- Verify `realtimeConfig.enabled` is true
- Check StatData entries exist
- Verify refresh interval is set
- Check browser console for API errors

## 📞 Support

For technical questions:
1. Check documentation files in this repo
2. Review Strapi logs: `cms/logs/`
3. Check browser console for errors
4. Review WebSocket server logs

## 🎓 Next Steps

1. ✅ Complete Strapi setup (STRAPI_SETUP.md)
2. ✅ Add your first product
3. ✅ Test remote + display connection
4. ✅ Configure real-time stats
5. ✅ Customize templates and styling
6. ✅ Deploy to production
7. ✅ Train content team on Strapi

## 📝 License

Private - Internal Use Only
