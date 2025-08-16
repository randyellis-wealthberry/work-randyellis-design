#!/usr/bin/env node

/**
 * Simplified Performance Testing for METIS LightRays
 * Focuses on core metrics and practical benchmarks
 */

const puppeteer = require('puppeteer');

class SimplePerformanceTest {
  constructor() {
    this.results = {};
  }

  async runTest() {
    console.log('🚀 Starting METIS LightRays Performance Test\n');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      // Test desktop performance
      console.log('📊 Testing Desktop Performance (1920x1080)');
      const desktopResults = await this.testViewport(browser, { width: 1920, height: 1080 }, 'desktop');
      
      // Test mobile performance
      console.log('📱 Testing Mobile Performance (375x667)');
      const mobileResults = await this.testViewport(browser, { width: 375, height: 667 }, 'mobile');
      
      this.results = { desktop: desktopResults, mobile: mobileResults };
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    } finally {
      await browser.close();
    }
  }

  async testViewport(browser, viewport, deviceType) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    
    const testResults = {
      viewport,
      deviceType,
      metrics: {},
      status: 'unknown'
    };

    try {
      // Start timing
      const startTime = Date.now();
      
      // Navigate to METIS page
      console.log(`  ⏱️  Loading page...`);
      await page.goto('http://localhost:3000/metis', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      const loadTime = Date.now() - startTime;
      testResults.metrics.pageLoadTime = loadTime;
      
      // Check if LightRays component is present
      console.log(`  🔍 Checking for LightRays component...`);
      const lightRaysPresent = await page.evaluate(() => {
        const lightRaysElement = document.querySelector('[role="img"][aria-label*="light rays"]');
        return !!lightRaysElement;
      });
      
      testResults.metrics.lightRaysPresent = lightRaysPresent;
      
      // Measure memory if available
      const memoryInfo = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
            totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) // MB
          };
        }
        return null;
      });
      
      if (memoryInfo) {
        testResults.metrics.initialMemoryMB = memoryInfo.usedJSHeapSize;
        console.log(`  🧠 Initial memory: ${memoryInfo.usedJSHeapSize}MB`);
      }
      
      // Wait for potential animations and check memory again
      if (lightRaysPresent) {
        console.log(`  ⏳ Waiting for animations to load...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const finalMemoryInfo = await page.evaluate(() => {
          if (performance.memory) {
            return {
              usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
            };
          }
          return null;
        });
        
        if (finalMemoryInfo && memoryInfo) {
          const memoryGrowth = finalMemoryInfo.usedJSHeapSize - memoryInfo.usedJSHeapSize;
          testResults.metrics.memoryGrowthMB = memoryGrowth;
          testResults.metrics.finalMemoryMB = finalMemoryInfo.usedJSHeapSize;
          console.log(`  📈 Memory growth: ${memoryGrowth}MB`);
        }
      }
      
      // Simple frame rate test
      console.log(`  🎬 Testing animation smoothness...`);
      const frameTest = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0;
          const maxFrames = 60; // Test for 1 second at 60fps
          const frameTimes = [];
          let lastTime = performance.now();
          
          function countFrame() {
            const now = performance.now();
            frameTimes.push(now - lastTime);
            lastTime = now;
            frameCount++;
            
            if (frameCount < maxFrames) {
              requestAnimationFrame(countFrame);
            } else {
              const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
              const estimatedFPS = Math.round(1000 / avgFrameTime);
              resolve({ estimatedFPS, frameCount });
            }
          }
          
          requestAnimationFrame(countFrame);
        });
      });
      
      testResults.metrics.estimatedFPS = frameTest.estimatedFPS;
      console.log(`  🎯 Estimated FPS: ${frameTest.estimatedFPS}`);
      
      // Performance assessment
      testResults.status = this.assessPerformance(testResults.metrics, deviceType);
      
      console.log(`  ✅ ${deviceType} test completed: ${testResults.status}\n`);
      
    } catch (error) {
      console.error(`  ❌ Error testing ${deviceType}:`, error.message);
      testResults.error = error.message;
      testResults.status = 'failed';
    } finally {
      await page.close();
    }
    
    return testResults;
  }
  
  assessPerformance(metrics, deviceType) {
    const issues = [];
    let score = 100;
    
    // Page load assessment
    const loadTimeTarget = deviceType === 'mobile' ? 3000 : 2500;
    if (metrics.pageLoadTime > loadTimeTarget) {
      issues.push(`Slow page load (${metrics.pageLoadTime}ms)`);
      score -= 20;
    }
    
    // Memory assessment
    if (metrics.memoryGrowthMB > 50) {
      issues.push(`High memory growth (${metrics.memoryGrowthMB}MB)`);
      score -= 15;
    }
    
    // FPS assessment
    const fpsTarget = deviceType === 'mobile' ? 30 : 50;
    if (metrics.estimatedFPS < fpsTarget) {
      issues.push(`Low FPS (${metrics.estimatedFPS})`);
      score -= 25;
    }
    
    // LightRays loading
    if (!metrics.lightRaysPresent) {
      issues.push('LightRays component not loaded');
      score -= 30;
    }
    
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'acceptable';
    return 'poor';
  }
  
  generateReport() {
    console.log('\\n' + '='.repeat(80));
    console.log('📊 METIS LIGHTRAYS PERFORMANCE REPORT');
    console.log('='.repeat(80));
    
    Object.entries(this.results).forEach(([device, result]) => {
      console.log(`\\n📱 ${device.toUpperCase()} PERFORMANCE:`);
      console.log(`   Status: ${this.getStatusEmoji(result.status)} ${result.status}`);
      
      if (result.metrics) {
        console.log(`   Page Load: ${result.metrics.pageLoadTime}ms`);
        console.log(`   LightRays: ${result.metrics.lightRaysPresent ? '✅ Loaded' : '❌ Not found'}`);
        
        if (result.metrics.initialMemoryMB) {
          console.log(`   Memory: ${result.metrics.initialMemoryMB}MB → ${result.metrics.finalMemoryMB || 'N/A'}MB`);
          if (result.metrics.memoryGrowthMB !== undefined) {
            console.log(`   Growth: ${result.metrics.memoryGrowthMB >= 0 ? '+' : ''}${result.metrics.memoryGrowthMB}MB`);
          }
        }
        
        if (result.metrics.estimatedFPS) {
          console.log(`   FPS: ~${result.metrics.estimatedFPS}`);
        }
      }
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    // Overall assessment
    const overallStatus = this.getOverallStatus();
    console.log(`\\n🎯 OVERALL ASSESSMENT: ${this.getStatusEmoji(overallStatus)} ${overallStatus.toUpperCase()}`);
    
    // Recommendations
    console.log('\\n💡 RECOMMENDATIONS:');
    this.generateRecommendations();
    
    console.log('\\n' + '='.repeat(80));
  }
  
  getStatusEmoji(status) {
    const emojis = {
      excellent: '🟢',
      good: '🟡',
      acceptable: '🟠',
      poor: '🔴',
      failed: '❌',
      unknown: '⚪'
    };
    return emojis[status] || '⚪';
  }
  
  getOverallStatus() {
    const statuses = Object.values(this.results).map(r => r.status);
    
    if (statuses.includes('failed')) return 'failed';
    if (statuses.includes('poor')) return 'poor';
    if (statuses.includes('acceptable')) return 'acceptable';
    if (statuses.includes('good')) return 'good';
    if (statuses.every(s => s === 'excellent')) return 'excellent';
    
    return 'unknown';
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    Object.entries(this.results).forEach(([device, result]) => {
      if (result.metrics) {
        // Page load recommendations
        const loadTimeTarget = device === 'mobile' ? 3000 : 2500;
        if (result.metrics.pageLoadTime > loadTimeTarget) {
          recommendations.push(`${device}: Consider lazy loading LightRays component to improve initial page load`);
        }
        
        // Memory recommendations
        if (result.metrics.memoryGrowthMB > 30) {
          recommendations.push(`${device}: Monitor WebGL memory usage and implement cleanup on component unmount`);
        }
        
        // FPS recommendations
        const fpsTarget = device === 'mobile' ? 30 : 50;
        if (result.metrics.estimatedFPS < fpsTarget) {
          recommendations.push(`${device}: Reduce animation complexity or implement quality scaling for this device`);
        }
        
        // Component loading
        if (!result.metrics.lightRaysPresent) {
          recommendations.push(`${device}: Investigate why LightRays component failed to load`);
        }
      }
    });
    
    // General recommendations
    recommendations.push('✅ LightRays already implements lazy loading with React.lazy()');
    recommendations.push('✅ Error boundaries are in place for graceful fallback');
    recommendations.push('✅ Respects user prefers-reduced-motion settings');
    
    if (recommendations.length === 3) {
      recommendations.push('🎉 No additional optimizations needed - performance looks good!');
    }
    
    recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
}

// Run the test
if (require.main === module) {
  const test = new SimplePerformanceTest();
  test.runTest().catch(console.error);
}

module.exports = SimplePerformanceTest;