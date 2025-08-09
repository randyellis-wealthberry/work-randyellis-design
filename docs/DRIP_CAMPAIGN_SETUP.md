# Drip Campaign Setup Guide for Loops.so

## Overview

This guide provides step-by-step instructions for setting up automated email drip campaigns in Loops.so that will be triggered when users subscribe to your newsletter.

## Prerequisites

- ✅ Email capture system is working (test with `/admin/email-test`)
- ✅ Loops.so API integration is functional
- ✅ You have access to your Loops.so dashboard

## Step 1: Access the Loop Builder

1. Visit your Loops.so dashboard: https://app.loops.so
2. Navigate to **Loops** in the left sidebar
3. Click **"Create Loop"** to start building your first drip campaign

## Step 2: Choose Your Trigger

Your email capture system now sends enhanced data to Loops.so, giving you multiple trigger options:

### Option A: Contact Created Trigger (Recommended)

- **Trigger**: "Contact created"
- **Why**: Fires immediately when someone subscribes
- **Best for**: Welcome sequences and immediate onboarding

### Option B: Event-Based Trigger (Advanced)

- **Trigger**: "Event received"
- **Event name**: `newsletter_signup`
- **Why**: More specific trigger with additional event data
- **Best for**: Behavioral-based campaigns with conditions

### Option C: Contact Property Trigger

- **Trigger**: "Contact property updated"
- **Property**: `subscribed` becomes `true`
- **Why**: Triggers when subscription status changes
- **Best for**: Re-engagement campaigns

## Step 3: Add Conditions (Optional)

Refine your audience using the enhanced contact properties:

```
Contact Properties Available:
- firstName (string): User's first name if provided
- source (string): "Website newsletter signup"
- signupSource (string): "Newsletter form"
- signupDate (datetime): ISO timestamp of subscription
- userAgent (string): Browser/device information
- referer (string): Page where they signed up
- ipAddress (string): User's IP address for geolocation
- signupPage (string): Referring page URL
- subscriptionMethod (string): "Website form"
```

### Example Conditions:

- **Has first name**: `firstName` is not empty
- **Specific signup page**: `referer` contains "/projects"
- **Recent signups**: `signupDate` is within last 7 days
- **Mobile users**: `userAgent` contains "Mobile"

## Step 4: Design Your Email Sequence

### Template 1: Welcome Series (5 emails over 2 weeks)

```
📧 Email 1: Welcome (Immediate)
Subject: Welcome to [Your Newsletter Name]!
Content: Thank them, set expectations, deliver promised value

⏰ Wait: 2 days

📧 Email 2: Best Resources (Day 2)
Subject: The 3 resources every [target audience] needs
Content: Share your top resources, establish authority

⏰ Wait: 3 days

📧 Email 3: Personal Story (Day 5)
Subject: Why I started sharing [your topic]
Content: Personal connection, build relationship

⏰ Wait: 4 days

📧 Email 4: Community/Social Proof (Day 9)
Subject: What [number] subscribers have taught me
Content: Social proof, community highlights

⏰ Wait: 5 days

📧 Email 5: Call to Action (Day 14)
Subject: Ready for the next step?
Content: Soft pitch for product/service, feedback request
```

### Template 2: Quick Value Series (3 emails over 1 week)

```
📧 Email 1: Immediate Value (Immediate)
Subject: Your [resource/guide] is ready!
Content: Deliver on signup promise, provide value

⏰ Wait: 3 days

📧 Email 2: Pro Tips (Day 3)
Subject: 5 [expert tips/mistakes to avoid]
Content: Advanced insights, position as expert

⏰ Wait: 4 days

📧 Email 3: What's Next (Day 7)
Subject: What would you like to learn next?
Content: Survey/feedback request, segment for future campaigns
```

## Step 5: Email Personalization

Use contact properties for personalization:

### Basic Personalization:

```
Hi {{firstName}},

Welcome to the newsletter!

[If firstName is empty, use: "Hi there," or "Hello,"]
```

### Advanced Personalization:

```
Subject: Welcome to [Newsletter], {{firstName}}!

Hi {{firstName}},

I noticed you found us through {{signupPage}} - great choice!

Since you're interested in [topic related to signup page],
I wanted to share...

[Conditional content based on referrer/signup source]
```

### Conditional Content Examples:

```
{% if signupPage contains "/projects" %}
Since you were checking out my projects, you might enjoy this case study...
{% elsif signupPage contains "/blog" %}
I see you were reading my blog - here are my most popular posts...
{% else %}
Welcome! Here's what you can expect from this newsletter...
{% endif %}
```

## Step 6: Set Email Timing

### Best Practices:

- **Email 1**: Immediate (within 5 minutes)
- **Email 2**: 2-3 days later
- **Email 3**: 5-7 days after Email 2
- **Subsequent emails**: 7-14 day intervals

### Timing Considerations:

- **B2B audience**: Tuesday-Thursday, 10 AM - 2 PM
- **Consumer audience**: Weekends and evenings often work well
- **Global audience**: Consider time zones of your primary audience

## Step 7: A/B Testing Setup

Test different elements of your campaign:

### Subject Lines:

```
Version A: "Welcome to [Newsletter Name]!"
Version B: "Your [benefit/resource] is ready!"
Version C: "Hi {{firstName}}, welcome aboard!"
```

### Send Times:

```
Version A: Immediate
Version B: 1 hour delay
Version C: 24 hour delay
```

### Content Approaches:

```
Version A: Formal, professional tone
Version B: Casual, personal tone
Version C: Story-driven approach
```

## Step 8: Campaign Activation

1. **Review your campaign**: Check all emails, timing, and conditions
2. **Test with your own email**: Use the email testing tool at `/admin/email-test`
3. **Set to "Active"**: Toggle the campaign to active status
4. **Monitor initial performance**: Watch open rates, click rates, unsubscribes

## Step 9: Monitoring and Optimization

### Key Metrics to Track:

- **Open Rate**: Aim for 20-25% for welcome emails
- **Click Rate**: Aim for 3-5% average
- **Unsubscribe Rate**: Should be <1% for welcome series
- **Conversion Rate**: Track based on your goals

### Optimization Tips:

- **A/B test subject lines** regularly
- **Monitor drop-off points** in your sequence
- **Update content** based on feedback and performance
- **Segment campaigns** based on signup source or behavior

## Advanced Campaign Ideas

### 1. Onboarding by Interest

Create different sequences based on `referer` or signup source:

- **Project-focused**: For visitors from /projects
- **Blog-focused**: For visitors from /blog posts
- **General**: For direct visitors

### 2. Engagement-Based Progression

Use email engagement to determine next steps:

- **High engagement**: Move to premium content
- **Medium engagement**: Continue standard sequence
- **Low engagement**: Send re-engagement campaign

### 3. Time-Based Campaigns

Leverage `signupDate` for special occasions:

- **Anniversary emails**: 6 months, 1 year after signup
- **Seasonal content**: Holiday-themed campaigns
- **Milestone celebrations**: When you reach subscriber goals

## Troubleshooting Common Issues

### Campaign Not Triggering

1. **Check trigger conditions**: Ensure they match your contact data
2. **Verify campaign is active**: Toggle status in dashboard
3. **Review contact properties**: Confirm contacts have required properties
4. **Test with known contact**: Use `/admin/email-test` tool

### Low Open Rates

1. **Improve subject lines**: Make them more compelling/personal
2. **Check sender reputation**: Monitor deliverability metrics
3. **Review send timing**: Test different times of day
4. **Clean your list**: Remove inactive subscribers

### High Unsubscribe Rates

1. **Review expectations**: Ensure you're delivering on promises
2. **Check email frequency**: You might be sending too often
3. **Improve content relevance**: Better segmentation needed
4. **Add preference center**: Let subscribers choose frequency

## Integration with Your Website

### Newsletter Form Enhancement

You can enhance your newsletter form to collect more data for better segmentation:

```typescript
// Add to newsletter signup form
const extendedSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(), // Topics of interest
  mailingLists: z.array(z.string()).optional(), // Specific lists to join
});
```

### Event Tracking for Advanced Campaigns

Track additional events to trigger more sophisticated campaigns:

```typescript
// Send additional events to Loops.so
await loops.sendEvent({
  email: userEmail,
  eventName: "blog_post_read",
  eventProperties: {
    postTitle: "Advanced Email Marketing",
    category: "Marketing",
    readTime: 300, // seconds
  },
});
```

## Next Steps

1. **Create your first welcome campaign** using Template 1
2. **Test the campaign** with the email testing tool
3. **Monitor performance** for the first week
4. **Iterate and improve** based on metrics
5. **Create additional campaigns** for different user segments

## Resources

- [Loops.so Documentation](https://loops.so/docs)
- [Email Testing Tool](/admin/email-test)
- [Email Flow Guide](./EMAIL_FLOW_GUIDE.md)
- [Newsletter Signup Component](../components/ui/newsletter-signup.tsx)

---

**Need Help?** Check the troubleshooting section above or review your email flow with the testing tool at `/admin/email-test`.
