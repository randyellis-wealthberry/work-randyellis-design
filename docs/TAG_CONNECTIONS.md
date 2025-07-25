# Google Analytics Tag Connections

This document explains how to connect additional Google tags to your existing Google Analytics implementation, similar to Context-7's functionality.

## Overview

Instead of adding multiple script tags to your site, you can connect additional Google products (like Google Ads, secondary GA4 properties, etc.) to your existing Google Analytics tag. This approach:

- Reduces page load time
- Simplifies tag management
- Ensures consistent data collection
- Provides better performance

## Environment Configuration

Add the following environment variables to your `.env.local` file:

```bash
# Primary Google Analytics (required)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0E5MSVVSQE

# Google Ads tracking (optional)
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-1234567890

# Secondary GA4 property (optional)
NEXT_PUBLIC_GA4_SECONDARY_ID=G-ABCDEFGHIJ

# Custom connected tags - comma-separated (optional)
NEXT_PUBLIC_CUSTOM_TAGS=G-CUSTOM123,AW-CUSTOM456
```

## Supported Tag Formats

- **GA4**: `G-XXXXXXXXXX`
- **Google Ads**: `AW-XXXXXXXXXX`
- **Google Tag Manager**: `GT-XXXXXXXXXX`
- **Legacy Universal Analytics**: `UA-XXXXXXXX-X`

## Usage Examples

### 1. Basic Event Tracking

```typescript
import { trackEvent } from "@/lib/analytics";

// Sends to all connected GA4 tags
trackEvent("button_click", "engagement", "header_cta");

// Send to primary tag only
trackEvent("button_click", "engagement", "header_cta", undefined, false);
```

### 2. Google Ads Conversion Tracking

```typescript
import { trackConversion } from "@/lib/analytics";

// Track a conversion (requires NEXT_PUBLIC_GOOGLE_ADS_ID)
trackConversion("purchase_conversion", 99.99, "USD");
```

### 3. Enhanced Ecommerce

```typescript
import { trackPurchase } from "@/lib/analytics";

trackPurchase("TX-12345", 149.99, [
  {
    item_id: "PROD-001",
    item_name: "Premium Widget",
    category: "Widgets",
    quantity: 1,
    price: 149.99,
  },
]);
```

### 4. Runtime Tag Connection

```typescript
import { connectTag } from "@/lib/analytics";

// Connect a new tag dynamically
connectTag("G-NEWPROPERTY", "ga4");
```

### 5. Tag Manager Integration

```typescript
import { createTagManager } from "@/lib/tag-manager";

const tagManager = createTagManager({
  primaryGaId: "G-0E5MSVVSQE",
  googleAdsId: "AW-1234567890",
  secondaryGaId: "G-SECONDARY",
});

// Send event to all GA4 tags
tagManager.sendEventToGA4("custom_event", {
  custom_parameter: "value",
});

// Send conversion to Google Ads
tagManager.sendConversionToAds("purchase_label", 99.99);
```

## Development Helpers

### View Current Configuration

```typescript
import { logTagConfig } from "@/lib/analytics";

// In development, this will log your current tag setup
logTagConfig();
```

### Check Connected Tags

```typescript
import { hasConnectedTags } from "@/lib/tag-config";

if (hasConnectedTags()) {
  console.log("Connected tags are configured");
}
```

## Tag Connection Process (Manual)

If you prefer to connect tags manually through Google Tag Manager:

1. Go to your Google Tag Manager account
2. Navigate to the tag you want to connect
3. Use the "Connect a tag" interface
4. Enter the tag ID you want to connect
5. Add an optional nickname for identification
6. Click "Connect"

## Best Practices

1. **Use Environment Variables**: Keep all tag IDs in environment variables for easy management
2. **Test in Development**: Use the development helpers to verify your configuration
3. **Monitor Performance**: Connected tags share the same script load, improving performance
4. **Validate Tag IDs**: The system validates tag ID formats automatically
5. **Gradual Rollout**: Add one connected tag at a time to test functionality

## Troubleshooting

### Common Issues

1. **Tag not firing**: Check the tag ID format and environment variable name
2. **Console warnings**: Invalid tag IDs will show warnings in development
3. **Missing conversions**: Ensure Google Ads ID is correctly configured
4. **Duplicate events**: Make sure you're not sending the same event multiple times

### Debug Mode

In development mode, the system will log helpful information about tag configuration and connections.

## Migration from Context-7

If you were using Context-7 MCP server, this implementation provides the same functionality:

- **Connect tags**: Use environment variables or runtime connection
- **Multiple properties**: Support for secondary GA4 properties
- **Google Ads integration**: Built-in conversion tracking
- **Custom tags**: Support for any Google tag format

The main difference is that configuration is done through environment variables instead of the Context-7 interface.
