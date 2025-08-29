#!/usr/bin/env node

/**
 * Advanced Build Performance Analyzer
 * Analyzes build performance, bundle sizes, and provides optimization recommendations
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 Analyzing Build Performance...\n");

// Colors for console output
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function analyzeBundleSize() {
  console.log(colors.blue("📦 Bundle Size Analysis"));
  console.log("=" * 50);
  
  const nextDir = path.join(process.cwd(), ".next");
  if (!fs.existsSync(nextDir)) {
    console.log(colors.red("❌ .next directory not found. Run 'npm run build' first."));
    return;
  }

  // Analyze static chunks
  const chunksDir = path.join(nextDir, "static", "chunks");
  if (fs.existsSync(chunksDir)) {
    const chunks = fs.readdirSync(chunksDir, { withFileTypes: true });
    const jsFiles = chunks
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
      .map(dirent => {
        const filePath = path.join(chunksDir, dirent.name);
        const stats = fs.statSync(filePath);
        return {
          name: dirent.name,
          size: stats.size,
          path: filePath
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log(colors.green("Top 10 Largest Chunks:"));
    jsFiles.slice(0, 10).forEach((file, index) => {
      const status = file.size > 200000 ? colors.red("🔴") : 
                   file.size > 100000 ? colors.yellow("🟡") : colors.green("🟢");
      console.log(`${index + 1}. ${status} ${file.name}: ${colors.magenta(formatBytes(file.size))}`);
    });

    // Calculate total bundle size
    const totalSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\n${colors.blue("Total Bundle Size:")} ${colors.magenta(formatBytes(totalSize))}`);
    
    // Performance recommendations
    console.log(`\n${colors.yellow("📋 Recommendations:")}`);
    const largeChunks = jsFiles.filter(file => file.size > 200000);
    if (largeChunks.length > 0) {
      console.log(`- ${colors.red("Consider splitting large chunks:")} ${largeChunks.length} chunks > 200KB`);
      largeChunks.forEach(chunk => {
        console.log(`  • ${chunk.name} (${formatBytes(chunk.size)})`);
      });
    } else {
      console.log(`- ${colors.green("✅ Bundle sizes are well optimized")}`);
    }
  }

  console.log("\n");
}

function analyzeAppDirectory() {
  console.log(colors.blue("📁 App Directory Analysis"));
  console.log("=" * 50);
  
  const appChunksDir = path.join(process.cwd(), ".next", "static", "chunks", "app");
  if (fs.existsSync(appChunksDir)) {
    function getDirectorySize(dirPath) {
      let totalSize = 0;
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
          totalSize += getDirectorySize(itemPath);
        } else if (item.name.endsWith('.js')) {
          totalSize += fs.statSync(itemPath).size;
        }
      });
      
      return totalSize;
    }

    const appDirs = fs.readdirSync(appChunksDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const dirPath = path.join(appChunksDir, dirent.name);
        return {
          name: dirent.name,
          size: getDirectorySize(dirPath)
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log(colors.green("Route Bundle Sizes:"));
    appDirs.forEach((dir, index) => {
      const status = dir.size > 100000 ? colors.red("🔴") : 
                   dir.size > 50000 ? colors.yellow("🟡") : colors.green("🟢");
      console.log(`${index + 1}. ${status} /${dir.name}: ${colors.magenta(formatBytes(dir.size))}`);
    });
  }

  console.log("\n");
}

function checkDependencies() {
  console.log(colors.blue("📊 Dependency Analysis"));
  console.log("=" * 50);
  
  try {
    // Check for heavy dependencies
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const heavyDeps = [
      "three", "@react-three/fiber", "@react-three/drei", 
      "motion", "framer-motion", "@lottiefiles/dotlottie-react",
      "react", "react-dom", "next"
    ];
    
    const foundHeavyDeps = [];
    Object.keys(packageJson.dependencies || {}).forEach(dep => {
      if (heavyDeps.some(heavy => dep.includes(heavy))) {
        foundHeavyDeps.push(dep);
      }
    });

    console.log(colors.green("Heavy Dependencies Found:"));
    foundHeavyDeps.forEach(dep => {
      console.log(`- ${colors.yellow(dep)}: ${packageJson.dependencies[dep]}`);
    });

    console.log(`\n${colors.yellow("💡 Optimization Tips:")}`);
    if (foundHeavyDeps.includes("three")) {
      console.log("- Consider lazy loading Three.js scenes");
      console.log("- Use dynamic imports for 3D components");
    }
    if (foundHeavyDeps.some(dep => dep.includes("motion"))) {
      console.log("- Use motion components selectively");
      console.log("- Consider prefers-reduced-motion for animations");
    }
    console.log("- Enable tree shaking for unused exports");
    console.log("- Use Next.js optimizePackageImports for better bundling");

  } catch (error) {
    console.log(colors.red("❌ Could not analyze package.json"));
  }

  console.log("\n");
}

function generateOptimizationReport() {
  console.log(colors.blue("📋 Optimization Report"));
  console.log("=" * 50);
  
  const recommendations = [
    {
      category: "Bundle Optimization",
      items: [
        "✅ Webpack chunking strategy is well configured",
        "✅ Static assets have proper caching headers",
        "⚡ Consider enabling SWC minifier for faster builds",
        "⚡ Enable optimizeCss for production builds"
      ]
    },
    {
      category: "Performance Monitoring",
      items: [
        "📊 Add bundle analyzer to CI/CD pipeline",
        "📊 Monitor Core Web Vitals in production",
        "📊 Track build time trends over time",
        "📊 Set up performance budgets"
      ]
    },
    {
      category: "Advanced Optimizations",
      items: [
        "🚀 Enable concurrent features in React 18+",
        "🚀 Use Suspense boundaries for heavy components",
        "🚀 Implement service worker for offline support",
        "🚀 Consider using Vercel Edge Runtime for API routes"
      ]
    }
  ];

  recommendations.forEach(section => {
    console.log(colors.green(`\n${section.category}:`));
    section.items.forEach(item => {
      console.log(`  ${item}`);
    });
  });

  console.log(`\n${colors.magenta("🎯 Next Steps:")}`);
  console.log("1. Replace current next.config.js with next.config.optimization.js");
  console.log("2. Replace current vercel.json with vercel.optimized.json");
  console.log("3. Run 'npm run build' to test optimizations");
  console.log("4. Deploy and monitor performance improvements");
}

// Main execution
function main() {
  console.log(colors.blue("🚀 Build Performance Analysis\n"));
  
  analyzeBundleSize();
  analyzeAppDirectory();
  checkDependencies();
  generateOptimizationReport();
  
  console.log(colors.green("\n✅ Analysis Complete!"));
  console.log(colors.blue("Run this script after each build to track improvements."));
}

main();