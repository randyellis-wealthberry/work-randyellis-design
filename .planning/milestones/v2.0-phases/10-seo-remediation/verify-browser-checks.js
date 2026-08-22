const { chromium } = require('playwright');
const path = require('path');

const screenshotsDir = path.join(__dirname, '.planning/phases/10-seo-remediation/10-verification-screenshots');

async function checkServiceWorker(page) {
  console.log('\n=== Checking Service Worker Registrations ===');
  
  try {
    await page.goto('https://work.randyellis.design/', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const registrations = await page.evaluate(async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length;
    });
    
    const screenshotPath = path.join(screenshotsDir, 'sw-registrations.png');
    await page.screenshot({ path: screenshotPath, fullPage: false, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log(`✓ Service worker check complete: ${registrations} registrations`);
    console.log(`✓ Screenshot saved: ${screenshotPath}`);
    
    return { success: true, registrationsCount: registrations };
  } catch (error) {
    console.error('✗ Service worker check failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function attemptRichResultsTest(page, url, screenshotName, attemptNum = 1) {
  console.log(`\n=== Attempting Rich Results Test for ${url} (attempt ${attemptNum}) ===`);
  
  try {
    await page.goto('https://search.google.com/test/rich-results', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(2000);
    
    // Check for bot detection or consent wall
    const pageText = await page.textContent('body');
    if (pageText.toLowerCase().includes('captcha') || pageText.toLowerCase().includes('unusual traffic')) {
      console.log('✗ Bot detection detected - RRT automation blocked');
      return { success: false, blocked: true, reason: 'Bot detection / CAPTCHA' };
    }
    
    // Try to find and handle consent
    try {
      const rejectBtn = page.locator('button:has-text("Reject all"), button:has-text("No thanks")').first();
      if (await rejectBtn.isVisible({ timeout: 2000 })) {
        await rejectBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      // No consent dialog or already handled
    }
    
    // Try to find URL input
    const input = page.locator('input[type="url"], input[type="text"], textarea').first();
    if (!await input.isVisible({ timeout: 3000 })) {
      console.log('✗ Could not find URL input - page structure may have changed');
      return { success: false, blocked: true, reason: 'Page structure changed or access denied' };
    }
    
    await input.fill(url);
    await page.waitForTimeout(500);
    
    // Find and click test button
    const testBtn = page.locator('button:has-text("Test"), button:has-text("Analyze"), button[type="submit"]').first();
    if (!await testBtn.isVisible({ timeout: 2000 })) {
      console.log('✗ Could not find test button');
      return { success: false, blocked: true, reason: 'Test button not found' };
    }
    
    await testBtn.click();
    console.log('Waiting for results (max 30s)...');
    await page.waitForTimeout(30000);
    
    // Take screenshot
    const screenshotPath = path.join(screenshotsDir, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✓ Screenshot saved: ${screenshotPath}`);
    
    return { success: true, screenshotPath };
  } catch (error) {
    console.error(`✗ RRT attempt failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    
    // Always try service worker check
    const swResult = await checkServiceWorker(page);
    
    // Attempt first RRT test to see if it's blocked
    const rrtTest = await attemptRichResultsTest(page, 'https://work.randyellis.design/', 'rrt-home.png', 1);
    
    await browser.close();
    
    const results = {
      sw: swResult,
      rrt: rrtTest
    };
    
    console.log('\n=== Final Results ===');
    console.log(JSON.stringify(results, null, 2));
    
    // Exit with code based on what succeeded
    if (swResult.success && rrtTest.success) {
      process.exit(0); // All succeeded
    } else if (swResult.success && rrtTest.blocked) {
      process.exit(2); // SW ok, RRT blocked (expected)
    } else {
      process.exit(1); // Something failed unexpectedly
    }
  } catch (error) {
    console.error('Fatal error:', error);
    if (browser) await browser.close();
    process.exit(1);
  }
}

main();
