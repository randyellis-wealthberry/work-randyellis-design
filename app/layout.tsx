import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Footer } from "./footer";
import { NewsletterSignup } from "@/components/ui/newsletter-signup";
import { RouteContainer } from "@/components/layout/route-container";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema, buildWebSiteSchema } from "@/lib/seo/json-ld";
import { getNonce } from "@/lib/security/nonce";
import ResourceHints from "@/components/cdn/resource-hints";
import { createBaseMetadata } from "@/lib/metadata";
import { MobileMenuProvider } from "@/context/mobile-menu-context";
import { GlobalMobileMenu } from "@/components/ui/global-mobile-menu";
import { PeripheralDot } from "@/components/ui/peripheral-dot";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    // zinc-950, matching the page ground — pure black left a seam between the
    // browser chrome and the page on mobile.
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = createBaseMetadata();

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the CSP nonce for this request
  const nonce = await getNonce();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CSP nonce meta tag for client-side access */}
        {nonce && <meta name="csp-nonce" content={nonce} />}

        {/* CDN Resource Hints for Performance */}
        <ResourceHints />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/icons/icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icons/icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/icons/icon-128x128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href="/icons/icon-144x144.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        {/* Structured Data — server-rendered (D-10); entity story per D-08 */}
        <JsonLd id="person-jsonld" data={buildPersonSchema()} />
        <JsonLd id="website-jsonld" data={buildWebSiteSchema()} />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <MobileMenuProvider>
            {/* Geist is the site's face. This wrapper referenced
                --font-inter-tight, a leftover from the template this project
                started from that was never defined, so every page silently
                rendered in the platform sans stack instead of the font being
                loaded above. */}
            <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-geist),system-ui,sans-serif]">
              {/* Four surfaces already carried `id="main-content"` and nothing
                  on the site linked to it — a target with no link. A keyboard
                  reader had to tab the whole nav on every page. Off-screen
                  until focused, then it lands as a normal primary button at
                  the top-left, using the same 44px target and zinc focus ring
                  as every other control. */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-lg focus:bg-zinc-900 focus:px-6 focus:py-3 focus:text-base focus:font-medium focus:text-white focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none dark:focus:bg-white dark:focus:text-zinc-900 dark:focus:ring-white dark:focus:ring-offset-zinc-950"
              >
                Skip to content
              </a>
              <RouteContainer>
                <Header />
                {children}
                <NewsletterSignup />
                <Footer />
              </RouteContainer>
            </div>
            <GlobalMobileMenu />
            <PeripheralDot />
          </MobileMenuProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
