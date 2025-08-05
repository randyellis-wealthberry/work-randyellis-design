# Email Capture Flow & Drip Campaign Integration Guide

## Overview

This guide explains how captured emails flow from your website newsletter form into Loops.so's drip campaign system, providing complete visibility into the email journey.

## Email Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Submits  │    │   Form Submit   │    │  Rate Limiting  │    │   API Endpoint  │
│ Newsletter Form │───▶│   Validation    │───▶│   Middleware    │───▶│   /subscribe    │
│                 │    │   (Zod Schema)  │    │  (5/min per IP) │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                                                                              │
                                                                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local JSON    │    │   Loops.so API  │    │ Contact Created │    │ Automatic Drip  │
│    Storage      │◀───│  updateContact  │───▶│  or Updated     │───▶│   Campaign      │
│ (Data Backup)   │    │  (subscribed:   │    │ in Loops.so     │    │   Enrollment    │
└─────────────────┘    │     true)       │    └─────────────────┘    └─────────────────┘
                       └─────────────────┘
```

## Step-by-Step Email Journey

### 1. **Form Submission** (`components/ui/newsletter-signup.tsx`)
- User enters email in newsletter form
- React Hook Form validates with Zod schema
- Form prevents HTML5 validation conflicts with `noValidate`

### 2. **Rate Limiting** (`middleware.ts`)
- Middleware checks IP address against rate limits
- 5 requests per minute per IP address
- Returns 429 status if limit exceeded

### 3. **API Processing** (`app/api/newsletter/subscribe/route.ts`)
- Validates email format with Zod
- Extracts user metadata (IP, user agent, referrer)
- Processes both local storage and Loops.so integration

### 4. **Local Storage** (`lib/email-storage.ts`)
- Stores email in `data/email-subscriptions.json`
- Includes metadata: IP address, user agent, referrer, consent timestamp
- Provides data backup and GDPR compliance

### 5. **Loops.so Integration**
- Calls `loops.updateContact()` with:
  ```javascript
  {
    firstName: firstName || "",
    source: "Website newsletter signup",
    subscribed: true,
    signupSource: "Newsletter form",
    signupDate: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") || "",
    referer: request.headers.get("referer") || ""
  }
  ```

### 6. **Contact Creation in Loops.so**
- Contact appears in https://app.loops.so/audience
- Contact properties include all metadata for segmentation
- Contact is marked as `subscribed: true`

### 7. **Drip Campaign Enrollment**
- Loops.so automatically enrolls new contacts into active "Loops" (drip campaigns)
- Campaigns can be triggered by:
  - New contact creation
  - Subscription status change
  - Custom events
  - Contact property updates

## Where to Find Your Captured Emails

### In Your Local System
- **File Location**: `data/email-subscriptions.json`
- **API Endpoint**: `GET /api/newsletter/stats` (analytics)
- **Export**: `GET /api/newsletter/export` (requires API key)

### In Loops.so Dashboard
- **All Contacts**: https://app.loops.so/audience
- **Mailing Lists**: https://app.loops.so/audience (organize contacts)
- **Drip Campaigns**: https://app.loops.so/loops (automated sequences)
- **Campaign History**: https://app.loops.so/campaigns

## Current Integration Status

### ✅ **Working Features**
- Email capture and validation
- Rate limiting protection
- Local data storage with GDPR compliance
- Loops.so contact creation/update
- Comprehensive error handling
- 105 automated tests covering all functionality

### ⚠️ **Setup Required in Loops.so**
- Create automated "Loops" (drip campaigns) in dashboard
- Set triggers for new subscriber enrollment
- Design email sequences for your campaigns

## Setting Up Drip Campaigns in Loops.so

### 1. **Access Loop Builder**
Visit https://app.loops.so/loops and click "Create Loop"

### 2. **Choose Trigger**
- **"Contact created"** - Triggers when new email is captured
- **"Contact subscribed"** - Triggers when subscription status changes
- **Custom events** - For more advanced triggers

### 3. **Build Email Sequence**
- Add delays between emails (e.g., 1 day, 1 week)
- Create personalized content using contact properties
- Set conditions based on contact behavior

### 4. **Contact Properties Available**
Your captured emails include these properties for personalization:
- `firstName` (if provided)
- `source` ("Website newsletter signup")
- `signupSource` ("Newsletter form")
- `signupDate` (ISO timestamp)
- `userAgent` (browser information)
- `referer` (page where they signed up)

### 5. **Example Welcome Sequence**
```
Day 0: Welcome email with setup tips
Day 3: Featured content or case study
Day 7: Weekly newsletter explanation
Day 14: Feedback request or survey
```

## Testing Your Email Flow

### 1. **Submit Test Email**
Use the newsletter form on your website with a test email address

### 2. **Verify Local Storage**
Check `data/email-subscriptions.json` for the new entry

### 3. **Check Loops.so Dashboard**
Visit https://app.loops.so/audience to confirm contact creation

### 4. **Monitor Campaign Enrollment**
Check https://app.loops.so/loops to see if contact entered active campaigns

## Troubleshooting Common Issues

### Email Not Appearing in Loops.so
1. Check `LOOPS_API_KEY` environment variable
2. Verify API key permissions in Loops.so settings
3. Check server logs for Loops.so API errors
4. Confirm email format passes validation

### Drip Campaigns Not Triggering
1. Ensure Loop is "Active" in dashboard
2. Check trigger conditions match your use case
3. Verify contact meets all campaign criteria
4. Review campaign analytics for delivery issues

### Local Storage Issues
1. Ensure `data/` directory exists and is writable
2. Check for JSON parsing errors in server logs
3. Verify file permissions on production server

## Next Steps

1. **Create Your First Drip Campaign**: Visit Loops.so dashboard to build automated sequences
2. **Customize Contact Properties**: Add more fields to newsletter form for better segmentation
3. **Set Up Campaign Analytics**: Monitor open rates, click rates, and conversion metrics
4. **A/B Testing**: Create multiple campaign variants to optimize performance

## API Reference

### Newsletter Subscription
```bash
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John" // optional
}
```

### Get Subscription Stats
```bash
GET /api/newsletter/stats
```

### Export Data (GDPR)
```bash
GET /api/newsletter/export
Authorization: Bearer YOUR_ADMIN_API_KEY
```

### Unsubscribe
```bash
POST /api/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "reason": "Too many emails" // optional
}
```

---

For technical support or questions about this integration, refer to:
- [Loops.so Documentation](https://loops.so/docs)
- [Project README](../README.md)
- [API Tests](../__tests__/api/newsletter.test.ts)