# Enterprise Portfolio Setup Guide

This guide walks you through setting up the enterprise-grade infrastructure for your portfolio website.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment configuration
cp .env.example .env.local
# Edit .env.local with your values

# 3. Set up database and run migrations
npm run db:migrate

# 4. Verify everything is working
npm run enterprise:setup

# 5. Start development server
npm run dev
```

## 📋 Prerequisites

### Required Services

1. **PostgreSQL Database** (v13+)
   - Local development: Use Docker or native installation
   - Production: Use managed service (AWS RDS, Google Cloud SQL, or Supabase)

2. **Upstash Redis** (for distributed rate limiting)
   - Sign up at [upstash.com](https://upstash.com)
   - Create a Redis database
   - Get REST URL and token

3. **Loops.so Account** (for newsletter management)
   - Sign up at [loops.so](https://loops.so)
   - Get API key from settings

### Optional but Recommended

- **Sentry Account** (error tracking)
- **Vercel Account** (hosting and analytics)
- **Google Analytics** (web analytics)

## 🔧 Environment Configuration

### Database Setup

```bash
# PostgreSQL connection (required)
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=portfolio
DATABASE_USER=your-username
DATABASE_PASSWORD=your-password

# Connection pooling
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20

# Enable auto-migration (development only)
AUTO_MIGRATE=true
AUTO_CONNECT_DB=true
```

### Rate Limiting & Caching

```bash
# Upstash Redis for distributed rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Rate limiting configuration
RATE_LIMIT_NEWSLETTER_MAX=5
RATE_LIMIT_API_MAX=100
```

### Newsletter Integration

```bash
# Loops.so for newsletter management
LOOPS_API_KEY=your-loops-api-key

# Unsubscribe token security
UNSUBSCRIBE_TOKEN_SECRET=generate-a-strong-random-string
```

### Monitoring & Error Tracking

```bash
# Sentry for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project
ERROR_WEBHOOK_URL=https://your-webhook.com/errors

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
ANALYTICS_ENDPOINT=https://your-analytics.com/api
```

## 🗄️ Database Setup

### Local Development

1. **Install PostgreSQL**

   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # Windows
   # Download from postgresql.org
   ```

2. **Create Database**

   ```sql
   createdb portfolio
   ```

3. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

### Production Setup

1. **Managed Database Service**
   - **AWS RDS**: Create PostgreSQL instance
   - **Google Cloud SQL**: Create PostgreSQL instance
   - **Supabase**: Create new project (includes PostgreSQL)
   - **Railway/PlanetScale**: PostgreSQL-compatible services

2. **Connection Configuration**

   ```bash
   DATABASE_HOST=your-production-host
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=true
   ```

3. **Security Considerations**
   - Use strong passwords
   - Enable SSL/TLS encryption
   - Configure connection pooling
   - Set up read replicas for scaling

## 🚦 Rate Limiting Setup

### Upstash Redis Configuration

1. **Create Account**
   - Go to [upstash.com](https://upstash.com)
   - Sign up and verify email

2. **Create Redis Database**
   - Click "Create Database"
   - Choose region closest to your users
   - Select "Redis" type

3. **Get Credentials**
   ```bash
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXX...
   ```

### Alternative: Self-Hosted Redis

```bash
# Local development
brew install redis
redis-server

# Docker
docker run -d -p 6379:6379 redis:alpine
```

## 📊 Monitoring Setup

### Error Tracking (Sentry)

1. **Create Sentry Project**
   - Go to [sentry.io](https://sentry.io)
   - Create new Next.js project
   - Get DSN from project settings

2. **Configuration**
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
   ```

### Performance Monitoring

The system includes built-in performance monitoring:

- API response times
- Database query performance
- Memory usage tracking
- Error rate monitoring
- Rate limiting statistics

## 🔐 Security Configuration

### API Rate Limiting

Different endpoints have different rate limits:

```typescript
// Newsletter endpoints: 5 requests/minute
// General API: 100 requests/minute
// Health checks: 60 requests/minute
// Auth endpoints: 5 requests/15 minutes
```

### Security Headers

Automatically applied via middleware:

- Content Security Policy (CSP)
- HSTS headers
- X-Frame-Options
- X-Content-Type-Options
- Request ID tracking

### Input Validation

All API endpoints use Zod schemas for:

- Type-safe input validation
- SQL injection prevention
- XSS protection
- Email validation

## 📈 Performance Optimization

### Database Optimization

1. **Connection Pooling**

   ```bash
   DATABASE_POOL_MIN=2    # Minimum connections
   DATABASE_POOL_MAX=20   # Maximum connections
   ```

2. **Read Replicas**

   ```bash
   DATABASE_READ_HOST=read-replica-host
   DATABASE_READ_PORT=5432
   ```

3. **Query Monitoring**
   ```bash
   SLOW_QUERY_THRESHOLD=1000  # Log queries > 1s
   ```

### Caching Strategy

- **Redis**: Rate limiting and session data
- **CDN**: Static assets and images
- **API Responses**: 5-minute cache for analytics
- **Database**: Connection pooling and query optimization

## 🚀 Deployment

### Vercel Deployment

1. **Environment Variables**

   ```bash
   # Add all required environment variables in Vercel dashboard
   # Database connection strings
   # API keys
   # Monitoring tokens
   ```

2. **Database Connection**
   - Ensure database allows connections from Vercel IPs
   - Use SSL connections in production
   - Configure connection pooling

3. **Deployment Commands**
   ```bash
   npm run enterprise:deploy
   ```

### Self-Hosted Deployment

1. **Build Application**

   ```bash
   npm run build:production
   ```

2. **Database Migration**

   ```bash
   npm run db:migrate
   ```

3. **Health Check**
   ```bash
   npm run health:check
   ```

## 🔍 Monitoring & Maintenance

### Health Checks

The system provides comprehensive health monitoring:

```bash
# Check overall system health
curl https://your-domain.com/api/health

# Check migration status
npm run db:status

# Validate database consistency
npm run db:validate
```

### Performance Monitoring

Built-in metrics tracking:

- API response times
- Database query performance
- Memory usage
- Error rates
- Rate limiting statistics

### Alerts and Notifications

Configure webhooks for:

- Database connection failures
- High error rates
- Performance degradation
- Security incidents

## 🛠️ Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:migrate            # Run database migrations
npm run db:status             # Check migration status
npm run db:validate           # Validate database consistency

# Testing & Quality
npm test                      # Run test suite
npm run lint                  # Run ESLint
npm run security:audit        # Security audit

# Performance
npm run optimize:images       # Optimize image assets
npm run optimize:videos       # Optimize video assets
npm run performance:monitor   # Performance monitoring

# Enterprise
npm run enterprise:setup      # Complete setup verification
npm run enterprise:monitor    # System monitoring
npm run enterprise:deploy     # Production deployment

# Infrastructure
npm run infra:plan           # Plan infrastructure changes
npm run infra:apply          # Apply infrastructure changes
npm run backup:create        # Create system backup
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```bash
   # Check connection string
   npm run db:status

   # Verify PostgreSQL is running
   pg_isready -h localhost
   ```

2. **Rate Limiting Not Working**

   ```bash
   # Check Redis connection
   curl https://your-redis.upstash.io/ping

   # Falls back to in-memory if Redis unavailable
   ```

3. **Migration Errors**

   ```bash
   # Check current migration status
   npm run db:status

   # Validate migrations
   npm run db:validate
   ```

4. **Performance Issues**

   ```bash
   # Check system health
   curl https://your-domain.com/api/health

   # Monitor performance
   npm run performance:monitor
   ```

### Debug Mode

Enable detailed logging:

```bash
DEBUG_SQL_QUERIES=true
DEBUG_RATE_LIMITING=true
DEBUG_ERROR_TRACKING=true
LOG_LEVEL=debug
```

## 📞 Support

- **Documentation**: Check the `/docs` directory
- **Health Dashboard**: Visit `/api/health` for system status
- **Error Tracking**: Monitor Sentry dashboard
- **Performance**: Check Vercel Analytics dashboard

## 🔄 Scaling Considerations

### Database Scaling

1. **Read Replicas**: Configure read-only replicas for query scaling
2. **Connection Pooling**: Increase pool size for high traffic
3. **Sharding**: Consider sharding for extreme scale

### Redis Scaling

1. **Cluster Mode**: Use Redis cluster for high availability
2. **Regional Distribution**: Deploy Redis in multiple regions
3. **Backup Strategy**: Configure automatic backups

### Application Scaling

1. **Horizontal Scaling**: Deploy multiple instances
2. **CDN**: Use CloudFlare or AWS CloudFront
3. **Load Balancing**: Configure load balancers

This enterprise setup provides a robust, scalable foundation for your portfolio that can handle significant traffic while maintaining performance and reliability.
