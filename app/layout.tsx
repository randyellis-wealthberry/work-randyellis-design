import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Footer } from "./footer";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import {
  PersonStructuredData,
  WebsiteStructuredData,
  ProfessionalServiceStructuredData,
} from "@/components/seo/structured-data";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://work.randyellis.design/"),
  alternates: {
    canonical: "/",
  },
  title: {
    default:
      "Randy Ellis - AI Product Design Engineer | Generative AI & Design Leadership",
    template: "%s | Randy Ellis",
  },
  description:
    "Randy Ellis is a leading AI Product Design Engineer specializing in generative AI, design systems, and product leadership. Head of Product at Wealthberry Labs with 2.5M+ users impacted.",
  keywords: [
    "Randy Ellis",
    "AI Product Design Engineer",
    "Generative AI Designer",
    "Product Design Leadership",
    "AI Design Systems",
    "Head of Product",
    "Wealthberry Labs",
    "Design Engineering",
    "AI UX Research",
    "Product Design Chicago",
  ],
  authors: [{ name: "Randy Ellis", url: "https://work.randyellis.design" }],
  creator: "Randy Ellis",
  publisher: "Randy Ellis",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://work.randyellis.design/",
    title: "Randy Ellis - AI Product Design Engineer",
    description:
      "Leading AI Product Design Engineer specializing in generative AI, design systems, and product leadership. 2.5M+ users impacted.",
    siteName: "Randy Ellis Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Randy Ellis - AI Product Design Engineer",
    description:
      "Leading AI Product Design Engineer specializing in generative AI, design systems, and product leadership.",
    creator: "@randyellis",
  },
};

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PersonStructuredData />
        <WebsiteStructuredData />
        <ProfessionalServiceStructuredData />
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
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-md flex-1 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
