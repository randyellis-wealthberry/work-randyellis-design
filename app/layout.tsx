import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Footer } from "./footer";
import { NewsletterSignup } from "@/components/ui/newsletter-signup";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import {
  PersonStructuredData,
  WebsiteStructuredData,
  ProfessionalServiceStructuredData,
  FractionalCDOServiceStructuredData,
  OrganizationStructuredData,
  FAQStructuredData,
  LocalBusinessStructuredData,
} from "@/components/seo/structured-data";
import { getNonce } from "@/lib/security/nonce";
import PWAProvider from "@/components/pwa/pwa-provider";
import InstallPrompt from "@/components/pwa/install-prompt";
import PWAStatus, {
  ServiceWorkerUpdatePrompt,
} from "@/components/pwa/pwa-status";
import ServiceWorkerRegister from "./sw-register";
import ResourceHints from "@/components/cdn/resource-hints";
import { createBaseMetadata } from "@/lib/metadata";
import { MobileMenuProvider } from "@/context/mobile-menu-context";
import { GlobalMobileMenu } from "@/components/ui/global-mobile-menu";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Randy Ellis" />
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

        {/* Structured Data */}
        <PersonStructuredData />
        <WebsiteStructuredData />
        <ProfessionalServiceStructuredData />
        <FractionalCDOServiceStructuredData />
        <OrganizationStructuredData />
        <LocalBusinessStructuredData />
        <FAQStructuredData />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
        suppressHydrationWarning={true}
      >
        <PWAProvider>
          <ThemeProvider
            enableSystem={true}
            attribute="class"
            storageKey="theme"
            defaultTheme="system"
          >
            <MobileMenuProvider>
              <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
                <div className="relative mx-auto w-full max-w-screen-md flex-1 px-4 pt-8 sm:px-6 sm:pt-6 lg:px-8">
                  <Header />
                  {children}
                  <NewsletterSignup />
                  <Footer />
                </div>
              </div>
              <GlobalMobileMenu />
            </MobileMenuProvider>

            {/* PWA Components */}
            {process.env.NODE_ENV !== "production" && <PWAStatus />}
            <InstallPrompt />
            <ServiceWorkerUpdatePrompt />
            <ServiceWorkerRegister />
          </ThemeProvider>
        </PWAProvider>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
