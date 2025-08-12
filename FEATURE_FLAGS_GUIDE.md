# Feature Flags Implementation Guide

This guide shows how to use feature flags in your portfolio project.

## 🎯 Quick Start

### 1. Basic Usage

```tsx
import { useFeatureFlag } from '@/hooks/use-feature-flag';

function MyComponent() {
  const showNewFeature = useFeatureFlag('experimentalAnimations');
  
  return showNewFeature ? <NewAnimation /> : <StandardAnimation />;
}
```

### 2. Multiple Flags

```tsx
import { useFeatureFlags } from '@/hooks/use-feature-flag';

function Dashboard() {
  const flags = useFeatureFlags();
  
  return (
    <div>
      {flags.newsletterEnabled && <Newsletter />}
      {flags.betaFeatures && <BetaSection />}
      {flags.analyticsEnhanced && <Analytics />}
    </div>
  );
}
```

## 🚀 Deployment Examples

### Preview with Experimental Features

```bash
./scripts/deploy-with-flags.sh preview \
  experimentalAnimations=true \
  betaFeatures=true
```

### Production with Newsletter Disabled

```bash
./scripts/deploy-with-flags.sh production \
  newsletterEnabled=false \
  performanceMode=true
```

### Testing Maintenance Mode

```bash
./scripts/deploy-with-flags.sh preview \
  maintenanceMode=true
```

## 📋 Available Flags

| Flag | Purpose | Default | Use Case |
|------|---------|---------|----------|
| `experimentalAnimations` | Test new animations | `false` | A/B testing |
| `maintenanceMode` | Show maintenance page | `false` | Site updates |
| `newProjectShowcase` | New project layout | `false` | Gradual rollout |
| `newsletterEnabled` | Newsletter signup | `true` | Feature control |
| `analyticsEnhanced` | Detailed tracking | `false` | Privacy compliance |
| `betaFeatures` | Beta functionality | `false` | User testing |
| `performanceMode` | Optimizations | `true` | Performance tuning |

## 🧪 Testing Scenarios

### Development Testing

Set environment variables in `.env.local`:

```bash
NEXT_PUBLIC_EXPERIMENTAL_ANIMATIONS=true
NEXT_PUBLIC_BETA_FEATURES=true
NEXT_PUBLIC_NEW_PROJECT_SHOWCASE=true
```

### Preview Deployments

Use the deployment script to test combinations:

```bash
# Test newsletter disabled
./scripts/deploy-with-flags.sh preview newsletterEnabled=false

# Test experimental features
./scripts/deploy-with-flags.sh preview experimentalAnimations=true betaFeatures=true

# Test performance mode
./scripts/deploy-with-flags.sh preview performanceMode=true analyticsEnhanced=false
```

### Production Rollouts

Gradual feature rollout strategy:

1. **Week 1**: Deploy to preview with new features
2. **Week 2**: Deploy to production with flags disabled
3. **Week 3**: Enable flags for percentage of users (using Vercel env vars)
4. **Week 4**: Full rollout or rollback based on metrics

## 🔧 Environment Variables

### Vercel Dashboard

Set these in your Vercel project settings:

- **Development**: All experimental flags enabled
- **Preview**: Test-specific flag combinations
- **Production**: Conservative defaults

### Local Development

Create `.env.local`:

```bash
# Enable experimental features for development
NEXT_PUBLIC_EXPERIMENTAL_ANIMATIONS=true
NEXT_PUBLIC_BETA_FEATURES=true
NEXT_PUBLIC_NEW_PROJECT_SHOWCASE=true
NEXT_PUBLIC_ANALYTICS_ENHANCED=true

# Keep core features enabled
NEXT_PUBLIC_NEWSLETTER_ENABLED=true
NEXT_PUBLIC_PERFORMANCE_MODE=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

## 📊 Monitoring

Track flag usage in your analytics:

```tsx
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { trackEvent } from '@/lib/analytics';

function TrackedComponent() {
  const flagValue = useFeatureFlag('experimentalAnimations');
  
  useEffect(() => {
    trackEvent('feature_flag_exposed', {
      flag: 'experimentalAnimations',
      value: flagValue,
      timestamp: Date.now()
    });
  }, [flagValue]);
  
  return <div>...</div>;
}
```

## 🏗 Real Implementation Examples

### Newsletter Component

```tsx
// components/ui/newsletter-signup.tsx
export function NewsletterSignup() {
  const isEnabled = useFeatureFlag('newsletterEnabled');
  
  if (!isEnabled) return null;
  
  return <Newsletter />;
}
```

### Project Showcase

```tsx
// components/projects.tsx
export function ProjectShowcase() {
  const useNewLayout = useFeatureFlag('newProjectShowcase');
  const enhancedAnalytics = useFeatureFlag('analyticsEnhanced');
  
  useEffect(() => {
    if (enhancedAnalytics) {
      trackEvent('projects_viewed', {
        layout: useNewLayout ? 'modern' : 'classic'
      });
    }
  }, [useNewLayout, enhancedAnalytics]);
  
  return useNewLayout ? <ModernGrid /> : <ClassicList />;
}
```

### Maintenance Mode

```tsx
// app/layout.tsx
import { FLAGS } from '@/lib/feature-flags';

export default function RootLayout({ children }) {
  if (FLAGS.maintenanceMode) {
    return (
      <html>
        <body>
          <MaintenancePage />
        </body>
      </html>
    );
  }
  
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## 🎯 Best Practices

1. **Start Small**: Begin with 1-2 flags, expand gradually
2. **Clear Naming**: Use descriptive flag names
3. **Default Safe**: Default to safe values in production
4. **Clean Up**: Remove flags after features stabilize
5. **Document**: Keep this guide updated with active flags
6. **Test Combinations**: Test flag interactions before production
7. **Monitor**: Track flag exposure and performance impact

## 🔄 Migration Path

### Phase 1: Setup (✅ Complete)
- Feature flag system implemented
- Integration with components
- Deployment scripts created

### Phase 2: Gradual Adoption
- Add flags to more components
- Test different flag combinations
- Monitor performance impact

### Phase 3: Advanced Usage
- Integrate with A/B testing
- Add user-specific flags
- Automate flag lifecycle

### Phase 4: Optimization
- Remove unnecessary flags
- Optimize performance
- Document learnings

## 🚨 Emergency Procedures

### Kill Switch (Maintenance Mode)

```bash
# Immediate maintenance mode
vercel env add NEXT_PUBLIC_MAINTENANCE_MODE true production
```

### Disable Problematic Feature

```bash
# Disable experimental animations
vercel env rm NEXT_PUBLIC_EXPERIMENTAL_ANIMATIONS production
```

### Rollback to Safe Defaults

```bash
# Reset all flags to safe defaults
vercel env add NEXT_PUBLIC_NEWSLETTER_ENABLED true production
vercel env add NEXT_PUBLIC_PERFORMANCE_MODE true production
vercel env rm NEXT_PUBLIC_EXPERIMENTAL_ANIMATIONS production
vercel env rm NEXT_PUBLIC_BETA_FEATURES production
```

This implementation gives you full control over your portfolio features while maintaining simplicity and performance.