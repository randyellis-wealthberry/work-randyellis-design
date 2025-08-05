# Troubleshooting Guide

Common issues and solutions for the Randy Ellis Portfolio project.

---

## Development Issues

### Port 3000 Already in Use
**Problem**: `Error: Port 3000 is already in use`

**Solution**: The project includes an automatic port cleanup script:
```bash
npm run dev  # Uses custom dev-clean.js script
```

**Manual cleanup**:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Build Failures

#### ESLint Violations
**Problem**: Build fails due to linting errors

**Solution**:
```bash
npm run lint          # Check specific issues
npm run lint --fix    # Auto-fix when possible
```

#### TypeScript Errors
**Problem**: Type errors during build

**Solution**:
```bash
npx tsc --noEmit      # Check TypeScript without compiling
```

### Performance Issues

#### Slow Development Server
**Problem**: Hot reload is slow or unresponsive

**Solutions**:
1. Clear Next.js cache: `rm -rf .next`
2. Restart with clean port: `npm run dev`
3. Check for large dependencies

#### Large Bundle Sizes
**Problem**: Production bundles are too large

**Solutions**:
1. Analyze bundle: `npm run build:analyze`
2. Check dynamic imports usage
3. Review dependency tree

---

## Deployment Issues

### Vercel Build Failures

#### Out of Memory
**Problem**: Build process runs out of memory

**Solution**: Optimize build process:
```bash
# Local testing
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Environment Variables Missing
**Problem**: Build fails due to missing environment variables

**Solution**: Verify in Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

### Database Connection Issues

#### Redis Connection Failures
**Problem**: Redis connection timeouts

**Solutions**:
1. Check Redis server status
2. Verify connection strings
3. Check network connectivity

---

## Feature-Specific Issues

### Newsletter Signup

#### Subscription Failures
**Problem**: Newsletter signups not working

**Diagnostic Steps**:
1. Check API endpoint: `/api/newsletter/subscribe`
2. Verify Loops integration
3. Check rate limiting (5 requests/minute)
4. Validate email format

**Common Solutions**:
- Clear localStorage: `localStorage.clear()`
- Check network requests in dev tools
- Verify GDPR consent checkbox

### Email System

#### GDPR Compliance Errors
**Problem**: Email collection not GDPR compliant

**Solution**: Ensure:
- Explicit consent checkbox is checked
- Privacy policy link is visible
- Unsubscribe mechanism works

### Analytics

#### Missing Analytics Data
**Problem**: Analytics not tracking events

**Solutions**:
1. Check console for errors
2. Verify analytics initialization
3. Test in incognito mode
4. Check ad blockers

---

## Performance Debugging

### Core Web Vitals Issues

#### Poor LCP (Largest Contentful Paint)
**Solutions**:
- Optimize hero images
- Preload critical resources
- Check font loading strategy

#### High CLS (Cumulative Layout Shift)
**Solutions**:
- Add proper image dimensions
- Reserve space for dynamic content
- Check font swap strategy

#### Poor FID (First Input Delay)
**Solutions**:
- Reduce JavaScript bundle size
- Use code splitting
- Optimize third-party scripts

### Memory Leaks

#### Development Server Memory Issues
**Solutions**:
1. Restart development server
2. Clear browser cache
3. Close unused browser tabs
4. Check for infinite re-renders

---

## Testing Issues

### Jest Test Failures

#### Timeout Errors
**Problem**: Tests timeout during execution

**Solution**:
```bash
npm test -- --testTimeout=10000  # Increase timeout
```

#### Mock Issues
**Problem**: Mocks not working properly

**Solutions**:
1. Clear Jest cache: `npx jest --clearCache`
2. Check mock setup in `jest.setup.js`
3. Verify mock file locations

### Accessibility Testing

#### jest-axe Failures
**Problem**: Accessibility tests failing

**Solutions**:
1. Check specific a11y violations
2. Update ARIA attributes
3. Verify color contrast ratios
4. Test with screen readers

---

## Environment-Specific Issues

### macOS Issues

#### Permission Errors
**Solution**:
```bash
sudo chown -R $(whoami) ~/.npm
```

#### Node Version Issues
**Solution**: Use Node Version Manager:
```bash
nvm use 18  # or latest LTS
```

### Windows Issues

#### Line Ending Problems
**Solution**: Configure Git:
```bash
git config --global core.autocrlf true
```

### Linux Issues

#### Missing Dependencies
**Solution**: Install build tools:
```bash
sudo apt-get install build-essential
```

---

## Getting Help

### Debug Information to Collect
When reporting issues, include:
- Node.js version: `node --version`
- npm version: `npm --version`
- Operating system and version
- Browser and version (for client issues)
- Error messages and stack traces
- Steps to reproduce

### Log Analysis
Check relevant logs:
- Browser console (F12)
- Terminal output during build/dev
- Vercel deployment logs
- Network tab in browser dev tools

### Performance Profiling
Use built-in tools:
```bash
npm run monitor:performance  # Custom performance analysis
```

---

*This guide is continuously updated. If you encounter issues not covered here, please document the solution for future reference.*