# Sample Product Data for Strapi

Use these as templates when creating products in Strapi CMS.

## Example 1: Standard Product (myAvatar)

```json
{
  "productId": "myAvatar",
  "title": "myAvatar",
  "tagline": "Comprehensive EHR for Behavioral Health",
  "description": "myAvatar is a fully integrated electronic health record and practice management system designed specifically for behavioral health and human services organizations. It streamlines clinical workflows, improves care coordination, and ensures compliance with industry regulations.",
  "color": "#2563eb",
  "subcategory": "Enterprise",
  "template": "standard",
  "active": true,
  "sortOrder": 1,
  "sections": [
    {
      "sectionType": "features",
      "title": "Key Features",
      "layout": "grid",
      "order": 1,
      "content": {
        "items": [
          {
            "title": "Clinical Documentation",
            "description": "Comprehensive progress notes, treatment plans, and assessments with customizable templates"
          },
          {
            "title": "Practice Management",
            "description": "Scheduling, billing, and revenue cycle management in one unified platform"
          },
          {
            "title": "Care Coordination",
            "description": "Seamless communication and data sharing across your care team"
          },
          {
            "title": "Compliance & Reporting",
            "description": "Built-in compliance checks and automated reporting for regulatory requirements"
          }
        ]
      }
    },
    {
      "sectionType": "stats",
      "title": "By the Numbers",
      "layout": "grid",
      "order": 2,
      "content": {
        "metrics": [
          {
            "label": "Active Users",
            "value": "50,000+",
            "trend": "+23%"
          },
          {
            "label": "Organizations",
            "value": "2,500+",
            "trend": "+15%"
          },
          {
            "label": "Client Records",
            "value": "8M+",
            "trend": "+18%"
          },
          {
            "label": "Uptime",
            "value": "99.9%",
            "trend": ""
          }
        ]
      }
    },
    {
      "sectionType": "text",
      "title": "Why Choose myAvatar?",
      "layout": "full",
      "order": 3,
      "content": {
        "text": "myAvatar has been the trusted EHR solution for behavioral health providers for over 15 years. Our platform is built by clinicians, for clinicians, ensuring that every feature directly supports better patient care and more efficient operations."
      }
    }
  ],
  "realtimeConfig": {
    "enabled": true,
    "refreshInterval": 30000
  }
}
```

## Example 2: Analytics Product (coreAnalytics)

```json
{
  "productId": "coreAnalytics",
  "title": "Core Analytics",
  "tagline": "Enterprise-Wide Healthcare Analytics",
  "description": "Transform your healthcare data into actionable insights with Core Analytics. Our powerful platform aggregates data from multiple sources, providing real-time dashboards and predictive analytics to drive better clinical and business outcomes.",
  "color": "#7c3aed",
  "subcategory": "DataSolutions",
  "template": "analytics",
  "active": true,
  "sortOrder": 10,
  "sections": [
    {
      "sectionType": "stats",
      "title": "Live Performance Metrics",
      "layout": "grid",
      "order": 1,
      "content": {
        "metrics": [
          {
            "metric": "activeUsers",
            "label": "Active Sessions",
            "value": "1,247"
          },
          {
            "metric": "queriesPerSecond",
            "label": "Queries/Second",
            "value": "3,892"
          },
          {
            "metric": "dataProcessed",
            "label": "Data Processed Today",
            "value": "2.4 TB"
          },
          {
            "metric": "avgResponseTime",
            "label": "Avg Response Time",
            "value": "127ms"
          }
        ]
      }
    },
    {
      "sectionType": "features",
      "title": "Analytics Capabilities",
      "layout": "split",
      "order": 2,
      "content": {
        "items": [
          "Real-time data streaming and processing",
          "Predictive analytics and machine learning",
          "Custom dashboard builder",
          "Automated report generation",
          "Data visualization tools",
          "API access for custom integrations"
        ]
      }
    }
  ],
  "realtimeConfig": {
    "enabled": true,
    "endpoint": "/api/stats/live/coreAnalytics",
    "refreshInterval": 10000,
    "authRequired": false
  }
}
```

## Example 3: Service Product (AdvisoryConsulting)

```json
{
  "productId": "AdvisoryConsulting",
  "title": "Advisory & Consulting Services",
  "tagline": "Strategic Healthcare Consulting",
  "description": "Our team of healthcare experts provides strategic consulting services to help your organization optimize operations, improve clinical outcomes, and navigate the complex healthcare landscape.",
  "color": "#dc2626",
  "subcategory": "Services",
  "template": "service",
  "active": true,
  "sortOrder": 15,
  "sections": [
    {
      "sectionType": "text",
      "title": "Our Approach",
      "layout": "full",
      "order": 1,
      "content": {
        "text": "We partner with healthcare organizations to develop tailored strategies that address their unique challenges. Our consultants bring decades of combined experience across clinical operations, technology implementation, and healthcare administration."
      }
    },
    {
      "sectionType": "features",
      "title": "Service Areas",
      "layout": "grid",
      "order": 2,
      "content": {
        "items": [
          {
            "title": "Strategic Planning",
            "description": "Long-term roadmaps for organizational growth and transformation"
          },
          {
            "title": "EHR Implementation",
            "description": "End-to-end support for EHR selection, implementation, and optimization"
          },
          {
            "title": "Workflow Optimization",
            "description": "Process improvement and efficiency consulting"
          },
          {
            "title": "Change Management",
            "description": "Support for organizational change and staff training"
          }
        ]
      }
    }
  ],
  "realtimeConfig": {
    "enabled": false
  }
}
```

## Example 4: Video-Focused Product (netsmartTelehealth)

```json
{
  "productId": "netsmartTelehealth",
  "title": "Netsmart Telehealth",
  "tagline": "Virtual Care Made Simple",
  "description": "Deliver high-quality care remotely with our HIPAA-compliant telehealth platform. Built specifically for behavioral health providers, our solution integrates seamlessly with your existing EHR.",
  "color": "#059669",
  "subcategory": "CareGuidanceSolutions",
  "template": "video",
  "active": true,
  "sortOrder": 20,
  "sections": [
    {
      "sectionType": "video",
      "title": "See It In Action",
      "layout": "full",
      "order": 1,
      "content": {
        "url": "/media/telehealth-demo.mp4",
        "autoplay": true,
        "loop": true
      }
    },
    {
      "sectionType": "features",
      "title": "Platform Features",
      "layout": "grid",
      "order": 2,
      "content": {
        "items": [
          "HD video and audio quality",
          "HIPAA-compliant security",
          "Screen sharing and document collaboration",
          "Virtual waiting room",
          "Integrated scheduling",
          "Mobile app for iOS and Android"
        ]
      }
    },
    {
      "sectionType": "stats",
      "title": "Usage Statistics",
      "layout": "grid",
      "order": 3,
      "content": {
        "metrics": [
          {
            "label": "Sessions This Month",
            "value": "125,000+",
            "trend": "+45%"
          },
          {
            "label": "Avg Session Quality",
            "value": "4.8/5.0",
            "trend": "+0.2"
          },
          {
            "label": "Connection Success Rate",
            "value": "99.2%",
            "trend": "+1.5%"
          }
        ]
      }
    }
  ],
  "realtimeConfig": {
    "enabled": true,
    "refreshInterval": 60000
  }
}
```

## Creating Products in Strapi

1. Log into Strapi admin: http://localhost:1337/admin
2. Go to Content Manager → Product → Create new entry
3. Copy the relevant JSON data above
4. Fill in each field manually OR use the import plugin
5. Upload media files (hero images/videos)
6. Click "Save" then "Publish"

## Real-time Stats Setup

To enable live stats, create entries in the StatData collection:

```json
{
  "productId": "myAvatar",
  "metric": "activeUsers",
  "value": "1,247",
  "trend": "+23%",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

The display will automatically poll for updates at the interval specified in `realtimeConfig.refreshInterval`.
