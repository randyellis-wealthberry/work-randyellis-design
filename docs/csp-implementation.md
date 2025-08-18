# Content Security Policy (CSP) Implementation

## Overview

This document describes the comprehensive Content Security Policy implementation for the Randy Ellis portfolio website. The implementation follows security best practices while maintaining compatibility with necessary third-party services.

## Architecture

### 1. Middleware-Based CSP Headers (`middleware.ts`)

The CSP implementation is integrated into the existing Next.js middleware, providing:

- **Unique nonce generation** for each request
- **Environment-aware policies** (report-only in development, enforcing in production)
- **Security headers** (X-Content-Type-Options, X-Frame-Options, etc.)
- **Integration with existing rate limiting**

### 2. CSP Utilities (`lib/security/csp-utils.ts`)

Core utilities for CSP management:

- **`generateCSPNonce()`**: Cryptographically secure nonce generation
- **`isValidNonce()`**: Nonce validation
- **`CSPBuilder`**: Fluent API for building CSP policies
- **`createDefaultCSP()`**: Pre-configured policy for the portfolio site
- **Violation analysis tools**: Domain extraction, danger assessment

### 3. Violation Reporting (`app/api/csp-report/route.ts`)

Dedicated endpoint for handling CSP violations:

- **Rate limiting** to prevent spam
- **Violation categorization** (dangerous vs. benign)
- **Structured logging** for monitoring
- **Error handling** for malformed reports

### 4. Nonce Integration (`lib/security/nonce.tsx`)

Client-server nonce coordination:

- **Server-side nonce access** via headers
- **Client-side nonce access** via meta tags
- **NonceScript component** for automatic nonce inclusion

## Security Policy

### Allowed Sources

#### Script Sources (`script-src`)
- `'self'` - Same origin scripts
- `'nonce-{random}'` - Inline scripts with valid nonce
- `vitals.vercel-insights.com` - Vercel Analytics
- `*.googletagmanager.com` - Google Tag Manager
- `*.google-analytics.com` - Google Analytics
- `'unsafe-eval'` - Only in development for hot reloading

#### Style Sources (`style-src`)
- `'self'` - Same origin stylesheets
- `'unsafe-inline'` - Required for CSS-in-JS libraries
- `fonts.googleapis.com` - Google Fonts CSS

#### Image Sources (`img-src`)
- `'self'` - Same origin images
- `data:` - Data URLs for small images/icons
- `blob:` - Blob URLs for generated content
- `images.unsplash.com` - Unsplash images
- `cdn.cosmos.so` - CDN images
- `*.google-analytics.com` - Analytics tracking pixels
- `*.googletagmanager.com` - GTM images

#### Connect Sources (`connect-src`)
- `'self'` - Same origin API calls
- `vitals.vercel-insights.com` - Vercel Analytics API
- `*.google-analytics.com` - Analytics endpoints
- `*.analytics.google.com` - Enhanced analytics
- `*.googletagmanager.com` - Tag Manager API

#### Font Sources (`font-src`)
- `'self'` - Same origin fonts
- `data:` - Data URL fonts
- `fonts.gstatic.com` - Google Fonts files

#### Restricted Sources
- `object-src 'none'` - No Flash, Java applets, etc.
- `frame-ancestors 'none'` - Prevent embedding in frames
- `base-uri 'self'` - Restrict base tag usage

### Additional Security Directives

- **`upgrade-insecure-requests`**: Automatically upgrade HTTP to HTTPS
- **`report-uri /api/csp-report`**: Legacy violation reporting
- **`report-to csp-endpoint`**: Modern violation reporting

## Implementation Details

### Nonce Generation

- **Algorithm**: Cryptographically secure random 16-byte values
- **Encoding**: Base64 for HTTP header compatibility
- **Uniqueness**: New nonce per request
- **Entropy**: 128-bit minimum for security

### Environment Modes

#### Development
- **Policy**: Report-only mode (`Content-Security-Policy-Report-Only`)
- **Eval**: Allowed for hot reloading
- **Violations**: Logged to console

#### Production
- **Policy**: Enforcing mode (`Content-Security-Policy`)
- **Eval**: Blocked for security
- **Violations**: Logged and monitored

### Violation Handling

1. **Rate Limiting**: Max 10 reports per IP per minute
2. **Validation**: Content-Type and JSON structure checks
3. **Size Limits**: 10KB maximum payload
4. **Classification**: Automatic danger assessment
5. **Logging**: Structured logs with severity levels

## Testing

### Test Coverage

The implementation includes comprehensive tests:

1. **CSP Headers Tests** (`__tests__/security/csp-headers.test.ts`)
   - Header presence validation
   - Directive configuration checks
   - Nonce integration testing
   - Environment-specific behavior
   - Performance validation

2. **Nonce Generation Tests** (`__tests__/security/nonce-generation.test.ts`)
   - Cryptographic security verification
   - Uniqueness and entropy testing
   - Performance and memory checks
   - Validation function testing

3. **Violation Reporting Tests** (`__tests__/security/csp-violations.test.ts`)
   - Endpoint functionality
   - Rate limiting behavior
   - Error handling scenarios
   - Violation processing logic

### Running Tests

```bash
# Run all security tests
npm test -- __tests__/security/

# Run specific test suite
npm test -- __tests__/security/csp-headers.test.ts

# Run with coverage
npm test -- __tests__/security/ --coverage
```

## Monitoring and Maintenance

### Violation Monitoring

CSP violations are automatically:
- **Logged** with structured data
- **Categorized** by severity
- **Rate limited** to prevent spam
- **Available** for monitoring service integration

### Regular Maintenance

1. **Review violation reports** monthly
2. **Update allowed domains** as needed
3. **Test policy changes** in development
4. **Monitor performance impact**

### Common Violations

Expected violations that can be ignored:
- Browser extensions injecting scripts
- Legitimate third-party widgets
- Development tools in dev mode

Concerning violations that need investigation:
- Unknown script sources
- Data URI script attempts
- External object sources

## Troubleshooting

### Common Issues

1. **Scripts not loading**
   - Check if domain is in script-src
   - Verify nonce is present for inline scripts
   - Review browser console for CSP errors

2. **Styles not applying**
   - Ensure 'unsafe-inline' for CSS-in-JS
   - Check font sources are allowed
   - Verify external stylesheet domains

3. **Images not displaying**
   - Add image domains to img-src
   - Check for data: and blob: support
   - Verify CDN domains are included

### Debug Mode

To debug CSP issues:
1. Check browser console for violation reports
2. Review middleware logs for nonce generation
3. Test with report-only mode first
4. Use browser developer tools CSP analysis

## Future Enhancements

1. **Strict CSP**: Gradually remove 'unsafe-inline' for styles
2. **Monitoring Integration**: Connect to Sentry or DataDog
3. **Dynamic Policies**: Per-route CSP customization
4. **CSP Level 3**: Adopt newer CSP features as browser support improves

## References

- [Content Security Policy MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Best Practices](https://web.dev/csp/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)