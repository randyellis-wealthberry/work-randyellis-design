# Project Architecture Overview

This document provides a high-level overview of the Randy Ellis Portfolio architecture, built with Next.js 15, React 19, and modern web technologies.

---

## Technology Stack

### Core Framework

- **Next.js 15.4.4** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS v4** - Utility-first CSS framework

### Animation & UI

- **Motion/Framer Motion** - Animation library
- **Motion-Primitives** - Pre-built animated components
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

### Content & Data

- **MDX** - Markdown with React components for blog posts
- **Sugar-high** - Syntax highlighting for code blocks
- **Structured data** - JSON-LD for SEO

### Performance & Monitoring

- **Vercel Analytics** - Performance monitoring
- **Google Analytics** - User analytics (optional)
- **Web Vitals** - Core Web Vitals tracking
- **Custom performance monitoring** - Built-in performance tracking

---

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups and pages
│   ├── api/               # API routes
│   ├── blog/              # MDX blog posts
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # UI components
│   ├── analytics/        # Analytics components
│   ├── performance/      # Performance monitoring
│   └── seo/             # SEO components
├── lib/                  # Utility functions and data
│   ├── data/            # Project data and types
│   ├── hooks/           # Custom React hooks
│   ├── monitoring/      # Performance monitoring
│   └── utils/           # Utility functions
├── public/              # Static assets
├── docs/                # Documentation (this directory)
└── __tests__/           # Test files
```

---

## Key Architectural Decisions

### 1. Modular Data Architecture

- **Lazy loading**: Project data loaded on demand
- **Type safety**: TypeScript interfaces for all data
- **Separation**: Static data vs. dynamic project data

### 2. Performance-First Design

- **Image optimization**: Next.js Image component with optimization
- **Code splitting**: Dynamic imports for large components
- **Caching**: Strategic caching for API routes and static data

### 3. System-Only Theming

- **Media queries**: CSS `@media (prefers-color-scheme)` for theming
- **No manual controls**: Automatically follows system preference
- **Performance**: More efficient than class-based theming

### 4. Comprehensive Testing

- **Jest + Testing Library**: Component and integration testing
- **Accessibility testing**: jest-axe for a11y validation
- **Performance testing**: Custom performance monitoring tests

### 5. Progressive Enhancement

- **Core functionality**: Works without JavaScript
- **Enhanced UX**: Animations and interactions with JavaScript
- **Accessibility**: WCAG 2.1 AA compliance target

---

## Data Flow

### Project Data

```
lib/data/projects.ts → Component → Rendered Page
                   ↓
               Lazy Loading → Performance Optimization
```

### Analytics Flow

```
User Interaction → Analytics Tracking → Vercel Analytics
                                    → Google Analytics (if configured)
```

### Newsletter Flow

```
Form Submission → API Route → Email Storage → External Service (Loops)
               → GDPR Compliance → Confirmation Email
```

---

## Security Considerations

### Content Security Policy (CSP)

- Strict CSP headers via middleware
- Allowed sources for images, scripts, and styles
- Nonce-based script execution

### Rate Limiting

- API route rate limiting (5 requests/minute)
- Newsletter subscription protection
- DDoS prevention

### Data Privacy

- GDPR-compliant newsletter signup
- Cookie consent management
- Minimal data collection

---

## Performance Strategy

### Core Web Vitals Optimization

- **LCP**: Image optimization, critical resource preloading
- **FID**: Code splitting, minimal JavaScript
- **CLS**: Proper sizing, loading states
- **FCP**: Critical CSS, font optimization

### Bundle Optimization

- Tree shaking for unused code
- Dynamic imports for large dependencies
- Optimized production builds

---

## Development Workflow

### Local Development

```bash
npm run dev      # Start development server
npm run test     # Run test suite
npm run lint     # Code quality checks
npm run build    # Production build
```

### Performance Monitoring

```bash
npm run optimize:images   # Optimize image assets
npm run optimize:videos   # Optimize video assets
npm run monitor:performance # Performance analysis
```

### Deployment

- **Vercel**: Primary hosting platform
- **GitHub Actions**: CI/CD pipeline
- **Automated**: Zero-downtime deployments

---

## Key Features

### 🎨 User Experience

- Responsive design (mobile-first)
- Smooth animations and transitions
- System theme preference support
- Accessibility-focused design

### 🚀 Performance

- 90+ Lighthouse scores across all metrics
- Optimized images and assets
- Efficient bundle sizes
- Core Web Vitals compliance

### 📧 Newsletter System

- GDPR-compliant subscription flow
- Automated email campaigns
- Analytics and tracking
- Unsubscribe management

### 📊 Analytics & Monitoring

- Performance monitoring
- User behavior tracking
- Error tracking and reporting
- Core Web Vitals monitoring

---

_For detailed implementation guides, see the specific documentation in each section._
