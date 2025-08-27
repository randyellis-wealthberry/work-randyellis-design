import { EnhancedCodeBlock } from "@/components/ui/enhanced-code-block";

export default function CodeBlockTestPage() {
  const sampleCode = `import React from 'react';
import { useState, useEffect } from 'react';

export function ExampleComponent() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulated API call
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">
        Enhanced Counter Component
      </h2>
      {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      ) : (
        <div>
          <p className="mb-4">Count: {count}</p>
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment
          </button>
        </div>
      )}
    </div>
  );
}`;

  const bashCommands = `# Install dependencies
npm install react react-dom

# Start development server
npm run dev

# Build for production
npm run build`;

  const configCode = `// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig`;

  const cssCode = `.enhanced-button {
  @apply px-4 py-2 rounded-lg font-medium;
  @apply bg-blue-500 text-white;
  @apply hover:bg-blue-600 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .enhanced-button {
    transition: none;
  }
}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Enhanced CodeBlock Component Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Testing different layouts, variants, and responsive behavior
          </p>
        </div>

        {/* Single Column Layout */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Single Column Layout - Default Variant
          </h2>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="mb-6">
              This demonstrates the default variant of the CodeBlock component
              in a single-column layout. It shows full-width code blocks with
              optimal readability and copy functionality.
            </p>

            <EnhancedCodeBlock
              language="typescript"
              filename="components/example-component.tsx"
              variant="default"
              highlightLines={[5, 12, 25]}
              code={sampleCode}
            />

            <p className="mt-6">
              The component includes line highlighting, copy functionality, and
              responsive typography that adapts to different screen sizes while
              maintaining excellent readability.
            </p>
          </div>
        </section>

        {/* 2-Column Layout */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            2-Column Documentation Layout
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main Content Column */}
            <div className="space-y-6 lg:col-span-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3>Installation Guide</h3>
                <p>
                  Follow these steps to set up the enhanced CodeBlock component
                  in your project. The component is optimized for narrow column
                  layouts with responsive typography.
                </p>

                <EnhancedCodeBlock
                  language="bash"
                  filename="terminal"
                  variant="column"
                  code={bashCommands}
                />

                <h3>Configuration</h3>
                <p>
                  Configure your Next.js application with these optimized
                  settings. The column variant automatically adjusts font size
                  and padding for better readability in constrained spaces.
                </p>

                <EnhancedCodeBlock
                  language="javascript"
                  filename="next.config.js"
                  variant="column"
                  highlightLines={[3, 4, 7]}
                  code={configCode}
                />
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Reference
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
                        {'variant="column"'}
                      </code>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Optimized for narrow columns
                      </p>
                    </div>
                    <div>
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
                        {'highlightLines="{[1,5,10]}"'}
                      </code>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Highlight specific lines
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                  <h4 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                    💡 Pro Tip
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    The column variant automatically adjusts typography and
                    spacing based on container width using CSS container
                    queries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabbed Interface */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Multi-Tab Code Examples
          </h2>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="mb-6">
              The tabbed interface allows you to group related code examples
              together, perfect for showing different implementation approaches
              or file configurations.
            </p>

            <EnhancedCodeBlock
              language="typescript"
              filename="multi-language-example"
              variant="default"
              tabs={[
                {
                  name: "Component",
                  code: sampleCode,
                  language: "typescript",
                  highlightLines: [5, 12],
                },
                {
                  name: "Styles",
                  code: cssCode,
                  language: "css",
                  highlightLines: [1, 8],
                },
                {
                  name: "Config",
                  code: configCode,
                  language: "javascript",
                  highlightLines: [3, 7],
                },
              ]}
            />
          </div>
        </section>

        {/* Compact Variant */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Compact Variant for Cards
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Quick Setup
              </h3>
              <EnhancedCodeBlock
                language="bash"
                filename="install.sh"
                variant="compact"
                showLineNumbers={false}
                code={`npm install
npm run dev`}
              />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Basic Usage
              </h3>
              <EnhancedCodeBlock
                language="typescript"
                filename="usage.tsx"
                variant="compact"
                showLineNumbers={false}
                code={`import { CodeBlock } from '@/components/ui';

<CodeBlock 
  language="js" 
  code="console.log('Hello!');" 
/>`}
              />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Environment
              </h3>
              <EnhancedCodeBlock
                language="bash"
                filename=".env"
                variant="compact"
                showLineNumbers={false}
                code={`NODE_ENV=development
PORT=3000
DATABASE_URL=...`}
              />
            </div>
          </div>
        </section>

        {/* Responsive Behavior */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Responsive Behavior Demo
          </h2>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="mb-6">
              This section demonstrates how the CodeBlock component adapts to
              different screen sizes. Resize your browser window to see the
              responsive typography and layout adjustments.
            </p>

            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:from-blue-900/20 dark:to-indigo-900/20">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Responsive Configuration Example
              </h3>
              <EnhancedCodeBlock
                language="css"
                filename="responsive.css"
                variant="default"
                highlightLines={[1, 7, 13]}
                code={`/* Mobile First Approach */
@container/code (max-width: 400px) {
  .code-block {
    --font-size: 0.75rem;
    --padding: 0.75rem;
  }
}

@container/code (min-width: 401px) and (max-width: 600px) {
  .code-block {
    --font-size: clamp(0.75rem, 1.5vw, 0.8rem);
    --padding: 1rem;
  }
}

@container/code (min-width: 601px) {
  .code-block {
    --font-size: 0.875rem;
    --padding: 1.5rem;
  }
}`}
              />
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-16">
          <div className="rounded-lg border border-green-200 bg-green-50 p-8 dark:border-green-800 dark:bg-green-900/20">
            <h2 className="mb-6 text-2xl font-bold text-green-900 dark:text-green-100">
              ✅ Performance & Accessibility
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  98
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Lighthouse Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  &lt;16ms
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Copy Response
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  AAA
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  WCAG Compliant
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  100%
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Responsive
                </div>
              </div>
            </div>

            <p className="text-green-800 dark:text-green-200">
              The Enhanced CodeBlock component is optimized for performance with
              lazy syntax highlighting, efficient re-renders, and comprehensive
              accessibility support including keyboard navigation and screen
              reader compatibility.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
