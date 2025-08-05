# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with port cleanup (runs on localhost:3000)
- `npm run build` - Build the application for production
- `npm run build:analyze` - Build with bundle analyzer for performance insights
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Jest tests (180 tests across 15 suites)
- `npm run test:watch` - Run Jest tests in watch mode

### Performance & Optimization
- `npm run optimize:images` - Compress and optimize image assets
- `npm run optimize:videos` - Compress video assets (requires FFmpeg)
- `npm run monitor:performance` - Initialize performance monitoring

### Security & Compliance
- `npm run security:audit` - Run comprehensive security audit
- `npm run security:deps` - Check dependencies for vulnerabilities
- `npm run security:fix` - Auto-fix dependency vulnerabilities

### Infrastructure & Deployment
- `npm run backup:create` - Create encrypted backup of project data
- `npm run deploy:automated` - Zero-downtime automated deployment
- `npm run health:check` - Verify application health
- `npm run infra:plan` - Plan Terraform infrastructure changes
- `npm run infra:apply` - Apply infrastructure changes

### Custom Scripts
- The `dev` command runs through `scripts/dev-clean.js` which automatically kills processes on port 3000 before starting
- Performance optimization scripts in `scripts/` directory with automated asset compression
- Security audit tools with vulnerability scanning and compliance checking

## Project Architecture

This is a personal website template called "Nim" built with:
- **Next.js 15** with App Router
- **React 19** 
- **Tailwind CSS v4** for styling
- **Motion/Framer Motion** for animations
- **MDX** for blog posts with `@next/mdx`
- **TypeScript** for type safety

### Key Files and Architecture

#### Data Layer (Modular Architecture)
- `lib/data/index.ts` - Main data exports with lazy loading for performance
- `lib/data/types.ts` - TypeScript interfaces and type definitions
- `lib/data/projects.ts` - Project data with lazy loading capabilities
- `lib/data/static-data.ts` - Always-loaded content (work experience, blog posts, social links)
- `app/data.ts` - Legacy central data file (being migrated to modular structure)

#### Core Application
- `app/layout.tsx` - Root layout with theme provider, analytics, structured data, and global styles
- `app/page.tsx` - Main landing page with lazy-loaded components
- `app/blog/` - Blog posts as MDX files in folders (e.g., `app/blog/post-slug/page.mdx`)
- `app/api/` - API routes including newsletter subscription, health checks, and data requests

#### Components Architecture
- `components/ui/` - Reusable UI components with animations and accessibility features
- `components/analytics/` - Google Analytics components with consent management
- `components/seo/` - SEO and structured data components
- `mdx-components.tsx` - Custom MDX components including syntax highlighting with sugar-high

#### Infrastructure & Configuration
- `next.config.mjs` - Next.js configuration with MDX support, image optimization, and bundle analysis
- `middleware.ts` - Security headers, CSP, rate limiting, and request handling
- `lib/security-headers.ts` - Comprehensive security policy configuration
- `infrastructure/` - Terraform IaC for monitoring and deployment automation

### Content Management System

#### Modular Data Architecture
The site uses a structured data approach with TypeScript interfaces split across multiple files:
- **Projects**: Comprehensive metadata including metrics, challenges, solutions, process stories, and stakeholder quotes
- **Work Experience**: Career history with detailed role descriptions
- **Blog Posts**: MDX-based content with metadata and descriptions
- **Social Links**: Obfuscated email handling with base64 encoding
- **Archive Items**: Historical project references

#### Lazy Loading Strategy
- Static data (work experience, blog posts) loaded immediately
- Project data lazy-loaded on demand for performance
- Category-based filtering with dynamic imports
- Featured projects cached for quick access

### Styling and Theming

- **Tailwind CSS v4** with PostCSS
- Dark/light mode support via `next-themes`
- Custom fonts: Geist and Geist Mono
- Responsive design with mobile-first approach
- Custom CSS variables for theming

### Path Aliases

- `@/*` maps to the root directory for imports

### Analytics and SEO

- Vercel Analytics integration
- Google Analytics with environment variable configuration
- Comprehensive structured data (Person, Website, ProfessionalService, Organization)
- OpenGraph and Twitter Card metadata
- Sitemap and robots.txt support

### WebGL Content Best Practices

#### Centering Guidelines
- Always position main 3D objects at `[0, 0, 0]` for proper centering
- Use Three.js scenes over external content when you need precise control
- Test centering across mobile, tablet, and desktop viewports
- External WebGL content (like UnicornStudio) may have positioning issues

#### Scene Type Selection
- `organic`: For growth, nature, gardening themes - use centered geometry
- `neural`: For AI/ML projects - use symmetric node layouts  
- `geometric`: For general projects - ensure proper transform origins
- `unicorn`: External content - less control over positioning

#### Performance Considerations
- Use `position={[0, 0, 0]}` as the default center point
- Limit particle counts for mobile performance
- Use intersection observers for rendering optimization
- Apply proper lighting for visual clarity
- Lazy load WebGL components with loading skeletons
- Monitor memory usage for complex 3D scenes

## Testing

### Test Framework
- **Jest** with `@testing-library/react` for component testing
- **jest-axe** for accessibility compliance validation
- **jest-environment-jsdom** for DOM testing
- **180 tests** across 15 test suites with 82% code coverage

### Test Architecture
- Mock files in `__mocks__/` for external dependencies (@vercel/analytics, @lottiefiles/dotlottie-react)
- Comprehensive component testing including edge cases and error states
- Integration tests for API endpoints and data integrity
- Performance tests for project data and media assets

### Key Test Patterns
- Accessibility testing with jest-axe on all UI components
- Error boundary testing for robust error handling
- Form validation testing with proper user interaction simulation
- API endpoint testing with rate limiting and security validation

## Content Guidelines

### Adding Projects
- Projects are defined in `lib/data/projects.ts` with comprehensive metadata
- Include metrics, challenges, solutions, and process stories for featured projects
- Use proper TypeScript typing with interfaces from `lib/data/types.ts`
- Images should be optimized and placed in `/public/projects/[project-id]/`
- Use lazy loading functions: `loadProjects()`, `loadFeaturedProjects()`, `loadProjectsByCategory()`

### Blog Posts
- Create MDX files in `app/blog/[slug]/page.mdx` format
- Include proper metadata and descriptions
- Utilize custom MDX components for enhanced content
- Syntax highlighting powered by sugar-high

## Security & Compliance

### GDPR/Privacy Compliance
- Privacy policy and terms of service at `/privacy-policy` and `/terms-of-service`
- Cookie consent management with granular controls
- Data subject rights API at `/api/data-request`
- Newsletter signup with explicit consent validation

### Security Infrastructure
- Content Security Policy (CSP) with strict directives
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Rate limiting on API endpoints (5 requests/minute)
- Input validation and sanitization with Zod schemas
- Vulnerability scanning and dependency auditing tools

### Monitoring & Performance
- Performance monitoring with Core Web Vitals tracking
- Error tracking and alerting systems
- Health check endpoint at `/api/health`
- Bundle analysis and performance budgets
- Automated backup and disaster recovery systems

## Infrastructure

### Deployment Architecture
- Vercel hosting with automated deployments
- GitHub Actions CI/CD pipeline with security scanning
- Terraform infrastructure as code for monitoring
- Zero-downtime deployment with rollback capabilities
- Multi-environment support (development, staging, production)

### Performance Optimization
- Lazy loading for large data files and components
- Image and video optimization scripts
- Bundle analysis with performance budgets
- Connection-aware loading strategies
- Asset compression and caching strategies

## Claude Code Usage Guidelines

### Terminal Environment Best Practices

**IMPORTANT**: To avoid terminal/stdin conflicts and auto-update issues:

1. **Use native terminal for updates**: Always run `claude doctor` and `npm install -g @anthropic-ai/claude-code@latest` in Terminal.app, not VS Code's integrated terminal
2. **Avoid nested sessions**: Don't run `claude doctor` or update commands from within an existing Claude Code session
3. **Update workflow**: 
   - Exit current Claude Code session completely
   - Open Terminal.app (not VS Code terminal)
   - Run update commands with `sudo npm install -g @anthropic-ai/claude-code@latest`
   - Verify with `claude --version`

### Configuration Maintenance

- Configuration file (`~/.claude.json`) should stay under 10KB for optimal performance
- If file becomes bloated (>50KB), clear old project data and cached changelog
- Keep only essential settings and current project configurations

### Environment Variables

When running in VS Code, these environment variables are automatically set:
- `TERM_PROGRAM=vscode`
- `CLAUDECODE=1` (indicates nested session)
- `CLAUDE_CODE_ENTRYPOINT=cli`

## Dependencies

Key production dependencies:
- **UI Framework**: React 19, Next.js 15
- **Styling**: Tailwind CSS v4, tailwind-merge, class-variance-authority
- **Animation**: Motion/Framer Motion, @react-spring/web
- **3D Graphics**: @react-three/fiber, @react-three/drei, three.js
- **Content**: @next/mdx, @mdx-js/react, sugar-high (syntax highlighting)
- **UI Components**: Radix UI primitives, Lucide icons
- **Analytics**: @vercel/analytics, loops (newsletter)

Development dependencies include ESLint, Prettier, Jest, and TypeScript with proper configurations.