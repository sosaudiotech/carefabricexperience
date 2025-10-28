# Content Editor Quick Reference Card

## 🚀 Getting Started

### Access Strapi Admin
1. Open browser to: `http://localhost:1337/admin`
2. Login with your credentials
3. Click "Content Manager" in left sidebar

## ➕ Creating a New Product

### Step 1: Basic Information
| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| **productId** | ✅ Yes | Unique ID (must match wheel button) | `myAvatar` |
| **title** | ✅ Yes | Display name | `myAvatar` |
| **tagline** | No | Short description | `Comprehensive EHR` |
| **description** | No | Full description (2-3 sentences) | `Full-featured electronic health record...` |
| **color** | ✅ Yes | Hex color code | `#2563eb` |
| **subcategory** | No | Category name | `Enterprise` |
| **template** | ✅ Yes | Layout template | `standard` |
| **active** | ✅ Yes | Show on display? | Toggle ON |
| **sortOrder** | No | Display order | `1` |

### Step 2: Upload Media (Optional)
- **Hero Media**: Main image/video (shows at top)
- **Gallery**: Additional images (shows in gallery section)

**Tip**: Videos auto-play, images are static

### Step 3: Add Content Sections
Click "+ Add component" to add sections. Choose from:

#### 📋 Features Section
- **Use for**: Product capabilities, feature lists
- **Setup**:
  - sectionType: `features`
  - title: `"Key Features"`
  - layout: `grid` or `split`
  - content: 
    ```json
    {
      "items": [
        {
          "title": "Feature Name",
          "description": "What it does"
        }
      ]
    }
    ```

#### 📊 Stats Section
- **Use for**: Numbers, metrics, live data
- **Setup**:
  - sectionType: `stats`
  - title: `"By the Numbers"`
  - layout: `grid`
  - content:
    ```json
    {
      "metrics": [
        {
          "label": "Active Users",
          "value": "10,000+",
          "trend": "+23%"
        }
      ]
    }
    ```

#### 🎬 Video Section
- **Use for**: Product demos, testimonials
- **Setup**:
  - sectionType: `video`
  - title: `"See It In Action"`
  - layout: `full`
  - content:
    ```json
    {
      "url": "/uploads/demo.mp4",
      "autoplay": true,
      "loop": true
    }
    ```

#### 🖼️ Gallery Section
- **Use for**: Screenshots, photos
- **Setup**:
  - sectionType: `gallery`
  - title: `"Screenshots"`
  - layout: `grid`
  - Upload images in "media" field

#### 📝 Text Section
- **Use for**: Paragraphs, why choose us
- **Setup**:
  - sectionType: `text`
  - title: `"Why Choose Us?"`
  - layout: `full`
  - content:
    ```json
    {
      "text": "Your paragraph text here..."
    }
    ```

### Step 4: Real-time Stats (Optional)
Only enable if you want live updating numbers!

- **enabled**: Toggle ON
- **refreshInterval**: `30000` (30 seconds)
- **endpoint**: Leave empty (uses default)
- **authRequired**: Leave OFF

### Step 5: Save & Publish
1. Click **"Save"** button (top right)
2. Click **"Publish"** button
3. ✅ Your product is now live!

## 📊 Adding Live Stats

1. Go to **Content Manager** → **Stat Data**
2. Click **"Create new entry"**
3. Fill in:
   - **productId**: Must match product ID
   - **metric**: Internal name (e.g., `activeUsers`)
   - **value**: Display value (e.g., `1,247`)
   - **trend**: Optional (e.g., `+23%`)
   - **timestamp**: Auto-set to now
4. Save & Publish

**Tip**: Create multiple stat entries for the same product - they'll all show up!

## 🎨 Color Codes

Use these hex codes for consistency:

| Color | Code | Use For |
|-------|------|---------|
| Blue | `#2563eb` | Technology, Innovation |
| Purple | `#7c3aed` | Analytics, Data |
| Green | `#059669` | Healthcare, Growth |
| Teal | `#0891b2` | Services, Support |
| Pink | `#ec4899` | Special Features |
| Red | `#dc2626` | Critical Services |
| Orange | `#ea580c` | Action Items |
| Yellow | `#ca8a04` | Highlights |

## 📐 Layout Options

| Layout | Best For | Description |
|--------|----------|-------------|
| **full** | Text, Videos | Full width section |
| **split** | Features, Text | Two columns |
| **grid** | Features, Stats, Gallery | Auto-sizing grid |
| **sidebar** | Mixed content | Main + sidebar |

## ⚡ Pro Tips

### Content Length Guidelines
- **Title**: 1-3 words
- **Tagline**: 3-7 words
- **Description**: 2-3 sentences (150-300 chars)
- **Feature title**: 2-4 words
- **Feature description**: 1-2 sentences

### Image/Video Specs
- **Hero Image**: 1920x1080px (landscape)
- **Hero Video**: 1920x1080px, MP4, <50MB
- **Gallery Images**: 1200x800px minimum
- **File Size**: Keep under 5MB for fast loading

### Section Order
Use the `order` field to control sequence:
- 1 = First section (top)
- 2 = Second section
- etc.

### When to Use Each Template
- **standard**: Most products (default)
- **analytics**: Data-heavy products with lots of stats
- **service**: Consulting, services (text-focused)
- **video**: Video demonstrations, virtual products

## 🔄 Editing Existing Products

1. Content Manager → Product → Click product name
2. Make your changes
3. Click **"Save"**
4. Changes appear immediately on display!

**Note**: You don't need to re-publish unless it was unpublished

## ❌ Common Mistakes to Avoid

| ❌ Don't Do This | ✅ Do This Instead |
|------------------|-------------------|
| Leave productId empty | Must match button ID exactly |
| Forget to publish | Always click Publish button |
| Upload huge videos (>100MB) | Keep videos under 50MB |
| Use spaces in productId | Use camelCase: `myProduct` |
| Set refreshInterval too low | Minimum 10000 (10 seconds) |
| Upload missing images | Check files are .jpg, .png, .mp4 |

## 🆘 Help!

### Product Not Showing on Display
- ✅ Check "active" toggle is ON
- ✅ Check "Publish" button clicked
- ✅ Check productId matches button exactly
- ✅ Refresh display page

### Live Stats Not Updating
- ✅ Check realtimeConfig enabled
- ✅ Check StatData entries exist
- ✅ Check productId matches exactly
- ✅ Wait for refresh interval (30+ seconds)

### Media Not Loading
- ✅ Check file uploaded successfully
- ✅ Check file size under 10MB
- ✅ Check file format (jpg, png, mp4)
- ✅ Try re-uploading

## 📞 Getting Help

1. Check this Quick Reference Card first
2. Review SAMPLE_PRODUCTS.md for examples
3. Ask your technical team
4. Check Strapi documentation: https://docs.strapi.io

---

**Remember**: Save early, save often! Strapi auto-saves drafts. 🎉
