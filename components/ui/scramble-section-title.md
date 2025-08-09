# ScrambleSectionTitle Component

A React component that provides an animated text scrambling effect for section titles and headings. The component automatically handles text normalization to prevent TypeScript errors when using complex JSX expressions.

## Features

- ✨ **Text Scrambling Animation**: Smooth text scramble effect on hover
- 🔄 **Robust Input Handling**: Automatically converts ReactNode children to strings
- 🛡️ **TypeScript Safe**: Prevents string array vs string type errors
- ♿ **Accessible**: Maintains semantic heading structure
- 🎨 **Customizable**: Supports custom styles and heading levels

## Basic Usage

```tsx
import { ScrambleSectionTitle } from '@/components/ui/scramble-section-title';

// Simple static text
<ScrambleSectionTitle>
  My Section Title
</ScrambleSectionTitle>

// With custom styling and heading level
<ScrambleSectionTitle
  className="text-2xl font-bold"
  as="h1"
>
  Main Page Title
</ScrambleSectionTitle>
```

## Conditional Content (Recommended Patterns)

### ✅ Template Literals (Recommended)

```tsx
// BEST PRACTICE: Use template literals for conditional content
const isActive = true;
const feature = "AI-Powered";

<ScrambleSectionTitle>
  {`${isActive ? "🧠 " : ""}${feature} Dashboard`}
</ScrambleSectionTitle>;
// Result: "🧠 AI-Powered Dashboard"
```

### ✅ Complex Conditionals

```tsx
// Multiple conditions with template literals
const personalityMode = true;
const isPremium = false;

<ScrambleSectionTitle className="text-lg font-medium">
  {`${personalityMode ? "🧠 AI-Powered " : ""}${isPremium ? "Premium " : ""}Features`}
</ScrambleSectionTitle>;
// Result: "🧠 AI-Powered Features"
```

## Anti-Patterns to Avoid

### ❌ Adjacent JSX Expressions (Creates TypeScript Errors)

```tsx
// DON'T DO THIS - Creates string arrays
<ScrambleSectionTitle>
  {condition ? "🧠 AI-Powered" : ""} Performance Metrics
</ScrambleSectionTitle>
// This creates children: ["🧠 AI-Powered", " Performance Metrics"]
// which violates the string type expectation
```

### ❌ Multiple JSX Fragments

```tsx
// DON'T DO THIS - Also creates arrays
<ScrambleSectionTitle>
  {showPrefix && "Prefix "}
  Main Content
  {showSuffix && " Suffix"}
</ScrambleSectionTitle>
```

## Component Props

| Prop        | Type                                           | Default | Description                                                                |
| ----------- | ---------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `children`  | `ReactNode`                                    | -       | Content to display. Automatically converted to string for scramble effect. |
| `className` | `string`                                       | -       | Additional CSS classes to apply.                                           |
| `as`        | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"`  | HTML heading element to render.                                            |
| `speed`     | `number`                                       | -       | Animation speed (passed to underlying TextScramble component).             |

## Real-World Examples

### Echo Project Pattern

```tsx
// From the Echo project showcase
const personalityMode = true;

<ScrambleSectionTitle className="text-lg font-medium">
  {`${personalityMode ? "🧠 AI-Powered " : ""}Performance Metrics`}
</ScrambleSectionTitle>;
```

### Dashboard Title with Status

```tsx
const isOnline = true;
const userRole = "admin";

<ScrambleSectionTitle as="h1" className="text-3xl">
  {`${isOnline ? "🟢 " : "🔴 "}${userRole === "admin" ? "Admin " : ""}Dashboard`}
</ScrambleSectionTitle>;
// Result: "🟢 Admin Dashboard"
```

### Feature Section Headings

```tsx
const features = ["AI", "Premium", "Advanced"];
const isEnabled = (feature: string) => true; // Your logic here

{
  features.map((feature) => (
    <ScrambleSectionTitle key={feature}>
      {`${isEnabled(feature) ? "✅ " : "❌ "}${feature} Features`}
    </ScrambleSectionTitle>
  ));
}
```

## Robustness Features

The enhanced component automatically handles edge cases that previously caused TypeScript errors:

### Automatic String Conversion

```tsx
// These all work seamlessly:
<ScrambleSectionTitle>{42}</ScrambleSectionTitle>                    // Numbers
<ScrambleSectionTitle>{true}</ScrambleSectionTitle>                  // Booleans
<ScrambleSectionTitle>{null}</ScrambleSectionTitle>                  // Null values
<ScrambleSectionTitle>{['Part1', ' Part2']}</ScrambleSectionTitle>   // String arrays
```

### Legacy Pattern Support

The component now gracefully handles the problematic JSX patterns that used to cause TypeScript errors:

```tsx
// This now works (but template literals are still preferred):
const condition = true;
<ScrambleSectionTitle>
  {condition ? "Prefix " : ""}Main Text
</ScrambleSectionTitle>;
// Automatically converted from ["Prefix ", "Main Text"] to "Prefix Main Text"
```

## Testing

The component includes comprehensive test coverage:

```bash
# Run all ScrambleSectionTitle tests
npm test -- --testNamePattern="ScrambleSectionTitle"

# Test files:
# - components/ui/__tests__/scramble-section-title.test.tsx (basic functionality)
# - components/ui/__tests__/scramble-section-title-usage.test.tsx (usage patterns)
# - components/ui/__tests__/scramble-section-title-robustness.test.tsx (edge cases)
```

## Migration Guide

If you're upgrading from a version that had TypeScript errors:

1. **No changes needed** for existing template literal usage
2. **Automatic fix** for problematic JSX expression patterns
3. **Enhanced type safety** with ReactNode support
4. **Backwards compatible** with all existing prop interfaces

## Performance Notes

- ✅ Efficient string concatenation for arrays
- ✅ Minimal re-renders with proper memoization
- ✅ Lightweight runtime overhead
- ✅ Tree-shakable with ES modules

## Accessibility

- Maintains semantic heading structure (`h1` through `h6`)
- Preserves screen reader compatibility
- Supports keyboard navigation via underlying TextScramble component
- ARIA-compliant with proper heading roles
