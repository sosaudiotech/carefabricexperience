# Strapi CMS Setup Guide

## 🚀 Quick Start

### 1. Create Strapi Project
```bash
# From project root
npx create-strapi-app@latest cms --quickstart

# This will create a cms/ directory and start the admin panel
# Default URL: http://localhost:1337/admin
```

### 2. First Time Setup
1. Open http://localhost:1337/admin
2. Create your admin account (remember these credentials!)
3. You'll see the Strapi dashboard

### 3. Create Content Types

We'll create these content types in the Strapi admin:

#### A. **Product** (Collection Type)
Click "Content-Type Builder" → "Create new collection type" → Name: "Product"

Add these fields:

| Field Name | Type | Settings |
|------------|------|----------|
| productId | Text | Required, Unique |
| title | Text | Required |
| tagline | Text | |
| description | Rich Text | |
| color | Text | Default: "#2563eb" |
| subcategory | Text | |
| template | Enumeration | Values: standard, analytics, service, video |
| heroMedia | Media | Single image or video |
| gallery | Media | Multiple files |
| active | Boolean | Default: true |
| sortOrder | Number | |

#### B. **Content Section** (Component - Repeatable)
Click "Content-Type Builder" → "Create new component" → Name: "ContentSection"

| Field Name | Type | Settings |
|------------|------|----------|
| sectionType | Enumeration | Values: hero, features, stats, video, gallery, text, custom |
| title | Text | |
| layout | Enumeration | Values: full, split, grid, sidebar |
| content | JSON | For flexible data |
| media | Media | Multiple files |
| order | Number | |

#### C. **Add sections to Product**
Go back to Product content type → Add field → Component → Select "ContentSection" → Make it repeatable

#### D. **Realtime Config** (Component - Single)
Create component "RealtimeConfig":

| Field Name | Type | Settings |
|------------|------|----------|
| enabled | Boolean | Default: false |
| endpoint | Text | |
| refreshInterval | Number | Default: 30000 |
| authRequired | Boolean | Default: false |

Add to Product → Add field → Component → Select "RealtimeConfig"

#### E. **Stats Data** (Collection Type) - For real-time stats
Create collection "StatData":

| Field Name | Type | Settings |
|------------|------|----------|
| productId | Text | Required |
| metric | Text | Required (e.g., "activeUsers", "totalSessions") |
| value | Text | Required |
| trend | Text | Optional (e.g., "+23%") |
| timestamp | DateTime | Required, Default: now |

### 4. Configure Permissions

1. Go to Settings → Users & Permissions → Roles → Public
2. Enable these permissions:
   - Product: find, findOne
   - StatData: find, findOne
   - Upload: find, findOne (for media)

### 5. Add Sample Product

1. Go to Content Manager → Product → Create new entry
2. Fill in:
   - productId: "myAvatar"
   - title: "myAvatar"
   - tagline: "Comprehensive EHR for Behavioral Health"
   - description: "Full-featured electronic health record..."
   - color: "#2563eb"
   - template: "standard"
   - Upload a hero image/video
3. Add content sections:
   - Section 1: type=features, title="Key Features", content={"items": ["Feature 1", "Feature 2"]}
   - Section 2: type=stats, title="By the Numbers", content={"metrics": [...]}
4. Save and Publish

## 🔧 Environment Configuration

Add to your `.env` file:
```env
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_STRAPI_TOKEN=your-api-token-here
```

To get API token:
1. Settings → API Tokens → Create new API Token
2. Name: "Display Access"
3. Token type: Read-only
4. Copy the token (you'll only see it once!)

## 📊 Production Setup

### Database Configuration
For production, switch from SQLite to PostgreSQL:

```bash
cd cms
npm install pg
```

Edit `cms/config/database.js`:
```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'carefabric'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
```

### Media Storage
For production, use S3 or similar:

```bash
cd cms
npm install @strapi/provider-upload-aws-s3
```

Create `cms/config/plugins.js`:
```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
});
```

## 🚀 Deployment

### Option 1: Same Server as App
```bash
# Build Strapi for production
cd cms
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

Runs on port 1337 by default.

### Option 2: Separate Server
Deploy Strapi to:
- Heroku (easy, free tier available)
- DigitalOcean App Platform
- AWS/Azure/GCP
- Your own VPS

Update `.env` with production Strapi URL:
```env
REACT_APP_STRAPI_URL=https://cms.yourdomain.com
```

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Set up API tokens (not public permissions in production)
- [ ] Enable rate limiting
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Regular backups of database
- [ ] Keep Strapi updated

## 📝 Content Workflow

1. **Content Team** logs into Strapi admin
2. Creates/edits products with rich editor
3. Uploads media files
4. Clicks "Publish"
5. **Display** automatically shows new content (no code deploy needed!)

## 🔄 Adding Real-time Stats Endpoint

Create custom endpoint in Strapi:

```bash
cd cms
npm run strapi generate
# Select: api
# Name: stats
```

Edit `cms/src/api/stats/routes/stats.js`:
```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/stats/live/:productId',
      handler: 'stats.getLiveStats',
    },
  ],
};
```

Edit `cms/src/api/stats/controllers/stats.js`:
```javascript
module.exports = {
  async getLiveStats(ctx) {
    const { productId } = ctx.params;
    
    // Fetch latest stats from database
    const stats = await strapi.entityService.findMany(
      'api::stat-data.stat-data',
      {
        filters: { productId },
        sort: { timestamp: 'desc' },
        limit: 10,
      }
    );
    
    return stats;
  },
};
```

Now you have: `http://localhost:1337/api/stats/live/myAvatar`
