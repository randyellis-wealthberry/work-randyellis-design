# Contributing Guide

Thank you for considering contributing to the Randy Ellis Portfolio project! This guide outlines the process and guidelines for contributing.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git knowledge
- Basic understanding of Next.js and React

### Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Verify tests pass: `npm test`

---

## Development Workflow

### 1. Issue Creation

- Check existing issues before creating new ones
- Use issue templates when available
- Provide clear reproduction steps for bugs
- Include mockups or designs for feature requests

### 2. Branch Strategy

```bash
# Create feature branch from main
git checkout -b feature/your-feature-name

# Create bugfix branch for issues
git checkout -b fix/issue-description
```

### 3. Coding Standards

#### Code Style

- Follow existing TypeScript patterns
- Use Prettier for formatting (auto-formatted on save)
- Follow ESLint rules (run `npm run lint`)
- Write meaningful commit messages

#### Component Guidelines

```typescript
// ✅ Good: Clear props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Hooks: `use-kebab-case.ts`
- Pages: `kebab-case/page.tsx`

### 4. Testing Requirements

#### Test Coverage

All contributions should include appropriate tests:

- **Components**: Unit tests with React Testing Library
- **Utilities**: Jest unit tests
- **Accessibility**: jest-axe tests for UI components
- **Performance**: Performance impact tests when relevant

#### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

#### Test Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});

// Accessibility test
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Button>Test</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Contribution Types

### 🐛 Bug Fixes

1. **Reproduce the issue** locally
2. **Write a failing test** that demonstrates the bug
3. **Fix the issue** with minimal changes
4. **Verify the test passes** and no regressions occur
5. **Update documentation** if necessary

### ✨ New Features

1. **Discuss the feature** in an issue first
2. **Design the API** and get feedback
3. **Implement with tests** and documentation
4. **Consider performance impact**
5. **Update relevant guides**

### 📚 Documentation

1. **Check for accuracy** against current code
2. **Follow existing style** and formatting
3. **Include code examples** when helpful
4. **Test all links** and references

### 🎨 UI/UX Improvements

1. **Consider accessibility** implications
2. **Test across devices** and browsers
3. **Maintain brand consistency**
4. **Include before/after screenshots**

---

## Pull Request Process

### 1. Pre-Submission Checklist

- [ ] Code follows project conventions
- [ ] All tests pass locally
- [ ] No ESLint violations
- [ ] Documentation updated if needed
- [ ] Accessibility tested
- [ ] Performance impact considered

### 2. PR Guidelines

#### Title Format

```
type(scope): brief description

Examples:
feat(newsletter): add GDPR consent validation
fix(performance): resolve memory leak in image carousel
docs(setup): update installation instructions
```

#### Description Template

```markdown
## Changes

Brief description of what changed and why.

## Testing

- [ ] Manual testing completed
- [ ] Unit tests added/updated
- [ ] Accessibility tested
- [ ] Performance tested

## Screenshots/Videos

[Include if UI changes]

## Breaking Changes

[List any breaking changes]

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

### 3. Review Process

1. **Automated checks** must pass (tests, linting, build)
2. **Code review** by project maintainers
3. **Testing** on different devices/browsers if UI changes
4. **Final approval** and merge

---

## Performance Guidelines

### Bundle Size

- Monitor bundle impact with `npm run build:analyze`
- Use dynamic imports for large dependencies
- Avoid importing entire libraries when possible

### Accessibility

- Test with screen readers
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Include proper ARIA attributes

### Core Web Vitals

- Optimize images and media
- Minimize layout shifts
- Reduce JavaScript execution time
- Test on various network conditions

---

## Documentation Standards

### Code Comments

```typescript
/**
 * Calculates the performance score based on Core Web Vitals
 * @param lcp - Largest Contentful Paint in milliseconds
 * @param fid - First Input Delay in milliseconds
 * @param cls - Cumulative Layout Shift score
 * @returns Performance score from 0-100
 */
function calculatePerformanceScore(
  lcp: number,
  fid: number,
  cls: number,
): number {
  // Implementation details...
}
```

### README Updates

- Keep setup instructions current
- Include new environment variables
- Update feature lists
- Maintain link accuracy

---

## Release Process

### Version Numbering

- **Major**: Breaking changes (1.0.0 → 2.0.0)
- **Minor**: New features (1.0.0 → 1.1.0)
- **Patch**: Bug fixes (1.0.0 → 1.0.1)

### Changelog Maintenance

- Update `docs/maintenance/changelog.md`
- Include migration guides for breaking changes
- Credit contributors

---

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Focus on the best solutions for the project

### Communication

- Use clear, concise language
- Provide context for decisions
- Ask questions when unsure
- Share knowledge and resources

---

## Getting Help

### Resources

- [Architecture Overview](../development/architecture.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [Performance Guide](../development/performance-optimization.md)

### Contact

- Create an issue for questions
- Check existing documentation first
- Provide detailed context when asking for help

---

Thank you for contributing to making this project better! 🎉
