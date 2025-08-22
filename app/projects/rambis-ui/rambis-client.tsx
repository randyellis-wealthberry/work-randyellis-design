"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  Github,
  Package,
  Zap,
  Code2,
  Palette,
  Shield,
  Users,
  BookOpen,
  Target,
  Layers,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data/projects";

// Get the Rambis UI project data
const rambisProject = PROJECTS.find((p) => p.id === "rambis-ui")!;

export default function RambisClientPage() {
  return (
    <main className="relative mx-auto max-w-4xl space-y-12 py-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900 md:text-5xl dark:text-zinc-100">
            Rambis UI: A Modern Design System
          </h1>
          <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            {rambisProject.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
              {rambisProject.timeline}
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Design System Lead
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              Open Source
            </span>
          </div>
        </div>
      </div>

      {/* Project Links */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={rambisProject.githubLink || "#"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Github className="h-4 w-4" />
          View on GitHub
        </Link>
        <Link
          href={rambisProject.link || "#"}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-6 py-3 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <ExternalLink className="h-4 w-4" />
          Live Documentation
        </Link>
      </div>

      {/* Challenge Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            The Challenge
          </h2>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            While Chakra UI provided an excellent foundation, our development
            team encountered several limitations that impacted our workflow and
            end-user experience:
          </p>
          <ul className="ml-6 space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Bundle Size Concerns:</strong> The original library
              included many unused utilities, increasing our application bundle
              size
            </li>
            <li>
              <strong>Theming Complexity:</strong> Deep theme customization
              required extensive configuration and wasn&apos;t
              developer-friendly
            </li>
            <li>
              <strong>Performance Bottlenecks:</strong> Some components had
              unnecessary re-renders and could be optimized
            </li>
            <li>
              <strong>Accessibility Gaps:</strong> While good, we needed to
              exceed WCAG AA standards for our applications
            </li>
            <li>
              <strong>Documentation Inconsistencies:</strong> Complex components
              lacked comprehensive examples and implementation patterns
            </li>
          </ul>
        </div>
      </section>

      {/* Approach Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Technical Approach
          </h2>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            Rather than building from scratch, I strategically forked Chakra UI
            to preserve its excellent component architecture while addressing
            our specific needs:
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code2 className="h-5 w-5 text-emerald-600" />
                  Code Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p>• Modular component exports for tree-shaking</p>
                <p>• TypeScript-first development with strict typing</p>
                <p>• Composition-based component patterns</p>
                <p>• Zero-runtime CSS-in-JS with Emotion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Design System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p>• Semantic color tokens and design variables</p>
                <p>• Consistent spacing and typography scales</p>
                <p>• Dark mode support with automatic switching</p>
                <p>• Component variants and size systems</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Improvements Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Key Improvements
          </h2>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Bundle Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-700 dark:text-zinc-300">
              <p className="mb-3">
                Reduced bundle size by 40% through strategic refactoring:
              </p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Eliminated unused utility functions and dependencies</li>
                <li>• Implemented proper tree-shaking for component exports</li>
                <li>• Optimized emotion configuration for production builds</li>
                <li>• Added bundle analysis tools for continuous monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Enhanced Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-700 dark:text-zinc-300">
              <p className="mb-3">
                Implemented comprehensive accessibility improvements:
              </p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>
                  • ARIA patterns for complex components (Dropdown, Modal, Tabs)
                </li>
                <li>
                  • Keyboard navigation support across all interactive elements
                </li>
                <li>• Focus management and visual focus indicators</li>
                <li>• Screen reader testing and optimization</li>
                <li>• Color contrast verification tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-600" />
                Developer Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-700 dark:text-zinc-300">
              <p className="mb-3">Streamlined the development workflow:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Simplified theming API with design token system</li>
                <li>• Comprehensive TypeScript definitions for all props</li>
                <li>
                  • Interactive Storybook documentation with live examples
                </li>
                <li>• Automated testing suite with React Testing Library</li>
                <li>
                  • CLI tools for component generation and theme customization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Technical Architecture
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  Core Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {rambisProject.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  Build Pipeline
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Multi-format builds using Rollup for ESM/CJS compatibility,
                  with Webpack for documentation site. GitHub Actions automate
                  testing, builds, and npm publishing on release tags.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  Testing Strategy
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Comprehensive test suite including unit tests with Jest,
                  component testing with React Testing Library, visual
                  regression testing with Storybook, and accessibility testing
                  with axe-core.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Results Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Results & Impact
          </h2>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            The Rambis UI design system has become a cornerstone of our
            development workflow, enabling our team to build consistent,
            accessible interfaces more efficiently:
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-emerald-600">40%</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Bundle Size Reduction
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Production Components
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  WCAG AA Compliance
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Details */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Implementation Highlights
          </h2>
        </div>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                Theme System Redesign
              </h3>
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                Created a simplified theming API that allows developers to
                customize the entire design system through a single
                configuration object:
              </p>
              <div className="rounded-lg bg-zinc-100 p-4 font-mono text-sm dark:bg-zinc-800">
                <div className="text-zinc-700 dark:text-zinc-300">
                  {`const theme = {
  colors: { primary: { 500: '#3B82F6' } },
  fonts: { body: 'Inter, sans-serif' },
  spacing: { base: '1rem' }
}`}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                Component Composition
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Maintained Chakra UI&apos;s excellent composition patterns while
                adding new compound components for common use cases. This
                reduces boilerplate code while maintaining flexibility for
                custom implementations.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                Performance Optimizations
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Implemented React.memo for expensive components, optimized
                emotion&apos;s CSS generation, and added lazy loading for
                non-critical components. These improvements resulted in
                measurably faster render times.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation */}
      <section className="border-t border-zinc-200 pt-8 dark:border-zinc-700">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            ← Back to Projects
          </Link>

          <Link
            href={rambisProject.githubLink || "#"}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 text-white transition-colors hover:from-emerald-700 hover:to-blue-700"
          >
            View Source Code
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
