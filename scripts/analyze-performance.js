#!/usr/bin/env node

/**
 * Performance Analysis Script
 * Analyzes bundle sizes, identifies optimization opportunities,
 * and generates performance reports for the portfolio website.
 */

const fs = require('fs').promises;
const path = require('path');

const BUILD_DIR = path.join(process.cwd(), '.next', 'static', 'chunks');
const ANALYSIS_OUTPUT = path.join(process.cwd(), 'performance-analysis.json');

// Configuration
const HEAVY_LIBRARIES = [
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  'framer-motion',
  'motion'
];

const BUNDLE_LIMITS = {
  maxMainBundleSize: 120, // KB
  maxChunkSize: 200, // KB  
  maxTotalJSSize: 800, // KB
  maxThreeJSChunkSize: 150, // KB
};

async function analyzeBundleSizes() {
  console.log('🔍 Analyzing bundle sizes...\n');
  
  try {
    const files = await fs.readdir(BUILD_DIR);
    const bundles = [];
    let totalSize = 0;

    for (const file of files) {
      if (file.endsWith('.js') && !file.includes('app/')) {
        const filePath = path.join(BUILD_DIR, file);
        const stats = await fs.stat(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        bundles.push({
          fileName: file,
          size: sizeKB,
          filePath
        });
        
        totalSize += sizeKB;
      }
    }

    // Sort by size descending
    bundles.sort((a, b) => b.size - a.size);

    return {
      bundles,
      totalSize,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error analyzing bundles:', error.message);
    return null;
  }
}

async function identifyOptimizationOpportunities(analysis) {
  console.log('🎯 Identifying optimization opportunities...\n');
  
  const opportunities = [];
  
  // Large bundles that could be split
  const largeChunks = analysis.bundles.filter(b => b.size > BUNDLE_LIMITS.maxChunkSize);
  if (largeChunks.length > 0) {
    opportunities.push({
      type: 'code-splitting',
      priority: 'High',
      description: 'Large chunks should be split with dynamic imports',
      affectedFiles: largeChunks.map(c => c.fileName),
      estimatedSavings: `${Math.round(largeChunks.reduce((sum, c) => sum + c.size, 0) * 0.6)}KB`,
      implementation: 'Use React.lazy() and dynamic imports for heavy components'
    });
  }

  // Bundle size exceeds total limit
  if (analysis.totalSize > BUNDLE_LIMITS.maxTotalJSSize) {
    opportunities.push({
      type: 'bundle-optimization',
      priority: 'High', 
      description: 'Total bundle size exceeds performance budget',
      currentSize: `${analysis.totalSize}KB`,
      targetSize: `${BUNDLE_LIMITS.maxTotalJSSize}KB`,
      estimatedSavings: `${analysis.totalSize - BUNDLE_LIMITS.maxTotalJSSize}KB`,
      implementation: 'Implement lazy loading for 3D components and tree shaking'
    });
  }

  // Three.js optimization
  const potentialThreeJSChunk = analysis.bundles.find(b => b.size > 300);
  if (potentialThreeJSChunk) {
    opportunities.push({
      type: 'threejs-optimization',
      priority: 'High',
      description: 'Three.js and related libraries should be dynamically imported',
      affectedFiles: [potentialThreeJSChunk.fileName],
      currentSize: `${potentialThreeJSChunk.size}KB`,
      targetSize: `${BUNDLE_LIMITS.maxThreeJSChunkSize}KB`,
      estimatedSavings: `${potentialThreeJSChunk.size - BUNDLE_LIMITS.maxThreeJSChunkSize}KB`,
      implementation: 'Move Three.js to separate chunk with intersection observer loading'
    });
  }

  // Too many small chunks
  const smallChunks = analysis.bundles.filter(b => b.size < 10);
  if (smallChunks.length > analysis.bundles.length * 0.3) {
    opportunities.push({
      type: 'chunk-merging',
      priority: 'Medium',
      description: 'Too many small chunks indicate over-splitting',
      affectedFiles: smallChunks.map(c => c.fileName),
      count: smallChunks.length,
      implementation: 'Configure webpack to merge related small chunks'
    });
  }

  return opportunities;
}

async function generatePerformanceReport(analysis, opportunities) {
  console.log('📊 Generating performance report...\n');
  
  const report = {
    timestamp: analysis.timestamp,
    summary: {
      totalBundles: analysis.bundles.length,
      totalSizeKB: analysis.totalSize,
      largestChunkKB: analysis.bundles[0]?.size || 0,
      averageChunkKB: Math.round(analysis.totalSize / analysis.bundles.length),
      exceedsTargets: analysis.totalSize > BUNDLE_LIMITS.maxTotalJSSize
    },
    
    topChunks: analysis.bundles.slice(0, 10).map(bundle => ({
      fileName: bundle.fileName,
      sizeKB: bundle.size,
      percentage: Math.round((bundle.size / analysis.totalSize) * 100)
    })),
    
    optimizationOpportunities: opportunities,
    
    performanceTargets: {
      current: {
        bundleSize: analysis.totalSize,
        largestChunk: analysis.bundles[0]?.size || 0,
        estimatedLCP: Math.round(analysis.totalSize * 1.8), // Rough estimate
        estimatedTTI: Math.round(analysis.totalSize * 2.3)  // Rough estimate
      },
      targets: {
        bundleSize: BUNDLE_LIMITS.maxTotalJSSize,
        largestChunk: BUNDLE_LIMITS.maxChunkSize,
        estimatedLCP: 2500,
        estimatedTTI: 3800
      }
    },
    
    recommendations: [
      'Implement dynamic imports for Three.js components',
      'Add intersection observer for WebGL component loading', 
      'Use tree shaking for selective library imports',
      'Configure bundle splitting for optimal chunk sizes',
      'Add connection-aware loading for mobile optimization'
    ]
  };

  return report;
}

function printReport(report) {
  console.log('📈 PERFORMANCE ANALYSIS REPORT');
  console.log('='.repeat(50));
  console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}\n`);
  
  console.log('📦 BUNDLE SUMMARY');
  console.log(`Total bundles: ${report.summary.totalBundles}`);
  console.log(`Total size: ${report.summary.totalSizeKB}KB`);
  console.log(`Largest chunk: ${report.summary.largestChunkKB}KB`);
  console.log(`Average chunk: ${report.summary.averageChunkKB}KB`);
  console.log(`Exceeds targets: ${report.summary.exceedsTargets ? '❌ Yes' : '✅ No'}\n`);
  
  console.log('🏆 TOP 5 LARGEST CHUNKS');
  report.topChunks.slice(0, 5).forEach((chunk, i) => {
    console.log(`${i + 1}. ${chunk.fileName}`);
    console.log(`   Size: ${chunk.sizeKB}KB (${chunk.percentage}% of total)`);
  });
  console.log();
  
  console.log('🎯 OPTIMIZATION OPPORTUNITIES');
  report.optimizationOpportunities.forEach((opp, i) => {
    console.log(`${i + 1}. ${opp.description}`);
    console.log(`   Priority: ${opp.priority}`);
    console.log(`   Type: ${opp.type}`);
    if (opp.estimatedSavings) {
      console.log(`   Potential savings: ${opp.estimatedSavings}`);
    }
    console.log(`   Implementation: ${opp.implementation}`);
    console.log();
  });
  
  console.log('🎯 PERFORMANCE TARGETS');
  console.log(`Bundle size: ${report.performanceTargets.current.bundleSize}KB → ${report.performanceTargets.targets.bundleSize}KB`);
  console.log(`Largest chunk: ${report.performanceTargets.current.largestChunk}KB → ${report.performanceTargets.targets.largestChunk}KB`);
  console.log(`Est. LCP: ${report.performanceTargets.current.estimatedLCP}ms → ${report.performanceTargets.targets.estimatedLCP}ms`);
  console.log(`Est. TTI: ${report.performanceTargets.current.estimatedTTI}ms → ${report.performanceTargets.targets.estimatedTTI}ms\n`);
  
  console.log('💡 RECOMMENDATIONS');
  report.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });
  console.log();
}

async function main() {
  console.log('🚀 Starting performance analysis...\n');
  
  // Check if build exists
  try {
    await fs.access(BUILD_DIR);
  } catch (error) {
    console.error('❌ Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  // Analyze bundles
  const analysis = await analyzeBundleSizes();
  if (!analysis) {
    console.error('❌ Failed to analyze bundles');
    process.exit(1);
  }
  
  // Identify opportunities
  const opportunities = await identifyOptimizationOpportunities(analysis);
  
  // Generate report
  const report = await generatePerformanceReport(analysis, opportunities);
  
  // Print report
  printReport(report);
  
  // Save report
  try {
    await fs.writeFile(ANALYSIS_OUTPUT, JSON.stringify(report, null, 2));
    console.log(`💾 Full report saved to: ${ANALYSIS_OUTPUT}`);
  } catch (error) {
    console.error('⚠️  Could not save report file:', error.message);
  }
  
  // Exit with error code if performance targets not met
  if (report.summary.exceedsTargets) {
    console.log('\n❌ Performance targets not met. Optimization required.');
    process.exit(1);
  } else {
    console.log('\n✅ Performance targets met!');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = {
  analyzeBundleSizes,
  identifyOptimizationOpportunities,
  generatePerformanceReport
};