# Infrastructure and Deployment Guide

This document provides comprehensive guidance for managing the infrastructure, deployment, and operational aspects of the Randy Ellis Portfolio.

## 🏗️ Infrastructure Overview

### Architecture
- **Frontend**: Next.js 15 with App Router
- **Hosting**: Vercel (Production & Preview environments)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics + Google Analytics
- **Monitoring**: Custom monitoring + DataDog (optional)
- **Error Tracking**: Sentry (optional)
- **Email**: Loops.so + Resend
- **CI/CD**: GitHub Actions

### Performance Specifications
- **Target Load Time**: < 2.5s (LCP)
- **Uptime SLA**: 99.9%
- **Error Rate Budget**: < 0.5%
- **Core Web Vitals**: All metrics in "Good" range

## 🚀 Deployment Process

### Automated Deployment
```bash
# Run complete automated deployment with health checks
npm run deploy:automated

# Manual deployment to Vercel
vercel deploy --prod

# Deploy with performance analysis
npm run build:analyze && vercel deploy --prod
```

### Deployment Pipeline Stages
1. **Pre-deployment Checks**
   - Git status validation
   - Test suite execution
   - Security audit
   - Build validation
   - Environment validation

2. **Deployment Execution**
   - Vercel deployment
   - Health check validation
   - Performance monitoring

3. **Post-deployment Validation**
   - Health checks across all endpoints
   - Performance validation
   - Smoke tests
   - SEO validation

4. **Monitoring & Alerting**
   - Real-time monitoring activation
   - Automated rollback on failure
   - Team notifications

### Rollback Procedures
```bash
# Automatic rollback (triggered on deployment failure)
# Manual rollback to previous deployment
vercel rollback [deployment-url] --token=$VERCEL_TOKEN

# Rollback validation
npm run health:check
```

## 📊 Monitoring and Observability

### Health Monitoring
```bash
# Check application health
npm run health:check
curl https://work.randyellis.design/api/health

# Monitor performance
npm run monitor:performance
```

### Key Metrics Tracked
- **Performance**: LCP, FID, CLS, TTFB
- **Availability**: Uptime, response times
- **Errors**: Error rates, exception tracking
- **Business**: User engagement, conversions
- **Security**: Vulnerabilities, failed attempts

### Monitoring Dashboards
1. **Infrastructure Overview** (`/infrastructure/monitoring/dashboard-config.json`)
   - Uptime status
   - Response times
   - Error rates
   - Core Web Vitals

2. **Performance Deep Dive**
   - Page load breakdown
   - Performance budgets
   - Lighthouse scores
   - Resource optimization

3. **Security Dashboard**
   - Security incidents
   - Vulnerability tracking
   - SSL certificate status
   - Security headers compliance

4. **Business Metrics**
   - User engagement
   - Conversion tracking
   - Traffic analytics
   - Device/browser breakdown

### Alerting Configuration
- **Critical (P1)**: Site down, high error rate
- **Warning (P3)**: Slow response time, poor Core Web Vitals
- **Anomaly Detection**: Traffic patterns, performance changes

## 🔒 Security and Compliance

### Security Audit
```bash
# Run comprehensive security audit
npm run security:audit

# Check for dependency vulnerabilities
npm run security:deps

# Fix known vulnerabilities
npm run security:fix
```

### Security Features Implemented
- **Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Zod schema validation
- **Environment Security**: Encrypted secrets management
- **SSL/TLS**: Automatic certificate management

### Compliance Standards
- **GDPR**: Privacy policy, cookie consent, data rights
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization
- **SEO**: Meta tags, structured data, sitemap

## 💾 Backup and Disaster Recovery

### Automated Backups
```bash
# Create comprehensive backup
npm run backup:create

# Backup includes:
# - Source code archive
# - Configuration files
# - Environment variables (encrypted)
# - Public assets
# - Analytics configuration
```

### Disaster Recovery Plan
- **RTO (Recovery Time Objective)**: 15 minutes
- **RPO (Recovery Point Objective)**: 24 hours

### Recovery Procedures
1. **Repository Recovery**: Clone from GitHub
2. **Environment Setup**: Restore encrypted environment variables
3. **Deployment**: Deploy to Vercel production
4. **Validation**: Health checks and functionality tests
5. **DNS**: Verify domain configuration

## 🔧 Infrastructure as Code

### Terraform Configuration
```bash
# Plan infrastructure changes
npm run infra:plan

# Apply infrastructure changes
npm run infra:apply

# Destroy infrastructure (use with caution)
npm run infra:destroy
```

### Managed Resources
- Vercel project configuration
- DataDog dashboards and monitors
- GitHub repository settings
- SSL certificates
- DNS configurations

## 📈 Performance Optimization

### Current Optimizations
- **Image Optimization**: WebP/AVIF formats, responsive images
- **Code Splitting**: Dynamic imports, lazy loading
- **Caching**: CDN caching, browser caching
- **Compression**: Brotli/Gzip compression
- **Critical CSS**: Above-fold CSS inlining

### Performance Monitoring
```bash
# Initialize performance monitoring
npm run monitor:performance

# Analyze bundle size
npm run build:analyze
```

### Optimization Scripts
```bash
# Optimize images
npm run optimize:images

# Optimize videos
npm run optimize:videos
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
- **Triggers**: Push to main/develop, Pull Requests
- **Stages**: Lint → Test → Security → Build → Deploy → Validate
- **Features**: Parallel execution, caching, notifications

### Environment Strategy
- **Production**: `main` branch → `work.randyellis.design`
- **Preview**: Feature branches → Vercel preview URLs
- **Development**: Local development with hot reload

### Quality Gates
- All tests must pass
- Security audit must pass
- Build must succeed
- Performance budgets must be met

## 🚨 Incident Response

### Incident Classification
- **P1**: Site down, critical functionality broken
- **P2**: Performance degradation, minor functionality issues
- **P3**: Non-critical issues, optimization opportunities

### Response Procedures
1. **Detection**: Automated monitoring alerts
2. **Assessment**: Determine severity and impact
3. **Response**: Immediate mitigation steps
4. **Communication**: Stakeholder notifications
5. **Resolution**: Fix implementation and validation
6. **Post-mortem**: Root cause analysis and prevention

### Emergency Contacts
- **Primary**: Randy Ellis (hello@randyellis.design)
- **Infrastructure**: Vercel Support, GitHub Support
- **Monitoring**: DataDog Support (if applicable)

## 🔐 Environment Management

### Environment Variables
```bash
# Development setup
cp .env.example .env.local
# Fill in required values

# Production (managed via Vercel Dashboard)
# - LOOPS_API_KEY
# - RESEND_API_KEY
# - NEXT_PUBLIC_GA_MEASUREMENT_ID
# - etc.
```

### Secret Management
- **Development**: `.env.local` (not committed)
- **Production**: Vercel environment variables
- **CI/CD**: GitHub Secrets
- **Backup**: Encrypted backup files

## 📋 Operational Runbooks

### Daily Operations
- Monitor dashboard for anomalies
- Review error logs and alerts
- Check performance metrics
- Validate backup completion

### Weekly Operations
- Security vulnerability scan
- Performance optimization review
- Backup validation and cleanup
- Dependency updates review

### Monthly Operations
- Comprehensive security audit
- Performance budget review
- Infrastructure cost optimization
- Disaster recovery test

## 🛠️ Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run tests
npm run test:watch

# Lint and format
npm run lint

# Security check
npm run security:audit
```

### Feature Development
1. Create feature branch from `main`
2. Develop with automated testing
3. Submit PR with preview deployment
4. Code review and testing
5. Merge to `main` for production deployment

### Hotfix Process
1. Create hotfix branch from `main`
2. Implement minimal fix
3. Fast-track review and deployment
4. Monitor for issues post-deployment

## 📞 Support and Maintenance

### Monitoring Dashboards
- **Primary**: Internal monitoring dashboard
- **Secondary**: Vercel Analytics dashboard
- **Backup**: Google Analytics

### Log Access
- **Application Logs**: Vercel Functions logs
- **Error Tracking**: Console errors + Sentry (if configured)
- **Performance**: RUM data + Lighthouse CI

### Maintenance Windows
- **Preferred**: Sunday 2-4 AM EST (low traffic)
- **Emergency**: Anytime with proper communication
- **Notification**: Advance notice for planned maintenance

---

## Quick Reference Commands

```bash
# Essential operations
npm run dev                    # Start development
npm run build                  # Build for production
npm run deploy:automated       # Full automated deployment
npm run health:check          # Check application health
npm run security:audit        # Security scan
npm run backup:create         # Create backup
npm run monitor:performance   # Performance monitoring

# Infrastructure management
npm run infra:plan            # Plan infrastructure changes
npm run infra:apply           # Apply infrastructure changes

# Emergency procedures
vercel rollback [url]         # Emergency rollback
npm run health:check          # Validate recovery
```

For questions or issues, contact: hello@randyellis.design