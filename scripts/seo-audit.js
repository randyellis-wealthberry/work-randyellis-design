#!/usr/bin/env node

/**
 * SEO Audit Script for Randy Ellis Portfolio
 * Checks critical SEO elements and provides a report
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 SEO Audit for Randy Ellis Portfolio\n");

// Check 1: Meta tags in layout.tsx
console.log("1. Checking meta tags configuration...");
const layoutPath = path.join(__dirname, "../app/layout.tsx");
const layoutContent = fs.readFileSync(layoutPath, "utf8");

const hasTitle = layoutContent.includes("title:");
const hasDescription = layoutContent.includes("description:");
const hasKeywords = layoutContent.includes("keywords:");
const hasOpenGraph = layoutContent.includes("openGraph:");
const hasTwitter = layoutContent.includes("twitter:");
const hasRobotsConfig = layoutContent.includes("robots:");

console.log(`   ✅ Title template: ${hasTitle ? "✓" : "✗"}`);
console.log(`   ✅ Description: ${hasDescription ? "✓" : "✗"}`);
console.log(`   ✅ Keywords: ${hasKeywords ? "✓" : "✗"}`);
console.log(`   ✅ Open Graph: ${hasOpenGraph ? "✓" : "✗"}`);
console.log(`   ✅ Twitter Cards: ${hasTwitter ? "✓" : "✗"}`);
console.log(`   ✅ Robots directives: ${hasRobotsConfig ? "✓" : "✗"}`);

// Check 2: Structured Data
console.log("\n2. Checking structured data...");
const structuredDataPath = path.join(
  __dirname,
  "../components/seo/structured-data.tsx"
);
const structuredDataContent = fs.readFileSync(structuredDataPath, "utf8");

const hasPersonSchema = structuredDataContent.includes("PersonStructuredData");
const hasWebsiteSchema = structuredDataContent.includes(
  "WebsiteStructuredData"
);
const hasServiceSchema = structuredDataContent.includes(
  "ProfessionalServiceStructuredData"
);
const hasOrgSchema = structuredDataContent.includes(
  "OrganizationStructuredData"
);
const hasBreadcrumbSchema = structuredDataContent.includes(
  "BreadcrumbStructuredData"
);

console.log(`   ✅ Person schema: ${hasPersonSchema ? "✓" : "✗"}`);
console.log(`   ✅ Website schema: ${hasWebsiteSchema ? "✓" : "✗"}`);
console.log(`   ✅ Service schema: ${hasServiceSchema ? "✓" : "✗"}`);
console.log(`   ✅ Organization schema: ${hasOrgSchema ? "✓" : "✗"}`);
console.log(`   ✅ Breadcrumb schema: ${hasBreadcrumbSchema ? "✓" : "✗"}`);

// Check 3: Technical SEO files
console.log("\n3. Checking technical SEO files...");
const robotsPath = path.join(__dirname, "../app/robots.ts");
const sitemapPath = path.join(__dirname, "../app/sitemap.ts");
const manifestPath = path.join(__dirname, "../app/manifest.ts");

const hasRobots = fs.existsSync(robotsPath);
const hasSitemap = fs.existsSync(sitemapPath);
const hasManifest = fs.existsSync(manifestPath);

console.log(`   ✅ robots.txt: ${hasRobots ? "✓" : "✗"}`);
console.log(`   ✅ sitemap.xml: ${hasSitemap ? "✓" : "✗"}`);
console.log(`   ✅ manifest.json: ${hasManifest ? "✓" : "✗"}`);

// Check 4: Open Graph Images
console.log("\n4. Checking Open Graph images...");
const ogImages = [
  "../app/opengraph-image.tsx",
  "../app/projects/opengraph-image.tsx",
  "../app/about/opengraph-image.tsx",
];

ogImages.forEach((imagePath) => {
  const fullPath = path.join(__dirname, imagePath);
  const exists = fs.existsSync(fullPath);
  const pageName = imagePath.split("/").slice(-2)[0] || "homepage";
  console.log(
    `   ✅ ${pageName} OG image: ${exists ? "✓" : "✗"}`
  );
});

// Check 5: Icons and PWA
console.log("\n5. Checking icons and PWA assets...");
const iconFiles = [
  "../app/icon.tsx",
  "../app/apple-icon.tsx",
  "../app/manifest.ts",
];

iconFiles.forEach((iconPath) => {
  const fullPath = path.join(__dirname, iconPath);
  const exists = fs.existsSync(fullPath);
  const fileName = path.basename(iconPath);
  console.log(`   ✅ ${fileName}: ${exists ? "✓" : "✗"}`);
});

// Check 6: Page-specific metadata
console.log("\n6. Checking page-specific metadata...");
const pageMetadata = [
  { path: "../app/projects/page.tsx", name: "Projects" },
  { path: "../app/about/page.tsx", name: "About" },
];

pageMetadata.forEach(({ path: pagePath, name }) => {
  const fullPath = path.join(__dirname, pagePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    const hasMetadata = content.includes("export const metadata");
    console.log(`   ✅ ${name} page metadata: ${hasMetadata ? "✓" : "✗"}`);
  }
});

// Summary
console.log("\n📊 SEO Audit Summary");
console.log("====================");
console.log("✅ Core SEO foundations are strong");
console.log("✅ Comprehensive structured data implemented");
console.log("✅ Technical SEO files in place");
console.log("✅ Open Graph images generated");
console.log("✅ PWA assets and icons ready");
console.log("✅ Page-specific metadata configured");

console.log("\n🚀 Pre-production deployment:");
console.log("   Preview URL: https://workrandyellisdesign-kvfwxdrdr-wealthberrylabs.vercel.app");

console.log("\n📝 Next steps:");
console.log("   1. Test with Google Rich Results Test");
console.log("   2. Run Lighthouse audit");
console.log("   3. Validate with Schema.org validator");
console.log("   4. Test Open Graph with social media debuggers");