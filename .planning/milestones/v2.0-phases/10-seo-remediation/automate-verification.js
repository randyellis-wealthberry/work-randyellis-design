#!/usr/bin/env node
/**
 * Phase 10 Plan 10-10 Browser Automation
 * Automates Rich Results Test and Service Worker checks (rows 9-12)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '10-verification-screenshots');
const TIMEOUT = 60000; // 60s for Rich Results Test processing

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1024 },
  });
  const page = await context.newPage();

  const results = {
    row9: { status: 'pending', errors: [], warnings: [], detections: [] },
    row10: { status: 'pending', errors: [], warnings: [], detections: [] },
    row11: { status: 'pending', errors: [], warnings: [], detections: [] },
    row12: { status: 'pending', hasRegistration: null }
  };

  console.log('Starting browser automation for Phase 10 verification...\n');

  try {
    // Row 9: Rich Results Test - Home
    console.log('Row 9: Testing https://work.randyellis.design/ ...');
    await testRichResults(
      page,
      'https://work.randyellis.design/',
      path.join(SCREENSHOTS_DIR, 'rrt-home.png'),
      results.row9
    );

    // Row 10: Rich Results Test - GrowIt
    console.log('\nRow 10: Testing https://work.randyellis.design/projects/growit ...');
    await testRichResults(
      page,
      'https://work.randyellis.design/projects/growit',
      path.join(SCREENSHOTS_DIR, 'rrt-growit.png'),
      results.row10
    );

    // Row 11: Rich Results Test - Blog
    console.log('\nRow 11: Testing https://work.randyellis.design/blog/profits-not-pixels ...');
    await testRichResults(
      page,
      'https://work.randyellis.design/blog/profits-not-pixels',
      path.join(SCREENSHOTS_DIR, 'rrt-blog.png'),
      results.row11
    );

    // Row 12: Service Worker Check
    console.log('\nRow 12: Checking Service Worker registration...');
    await checkServiceWorker(page, path.join(SCREENSHOTS_DIR, 'sw-registrations.png'), results.row12);

  } catch (error) {
    console.error('Automation error:', error);
    results.automationError = error.message;
  } finally {
    await browser.close();
  }

  // Write results to JSON for parsing
  const resultsPath = path.join(SCREENSHOTS_DIR, 'automation-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log('\n=== AUTOMATION COMPLETE ===');
  console.log(`Results saved to: ${resultsPath}`);
  console.log('\nSummary:');
  console.log(`Row 9 (Home):    ${results.row9.status} - ${results.row9.errors.length} errors, ${results.row9.warnings.length} warnings`);
  console.log(`Row 10 (GrowIt): ${results.row10.status} - ${results.row10.errors.length} errors, ${results.row10.warnings.length} warnings`);
  console.log(`Row 11 (Blog):   ${results.row11.status} - ${results.row11.errors.length} errors, ${results.row11.warnings.length} warnings`);
  console.log(`Row 12 (SW):     ${results.row12.status} - ${results.row12.hasRegistration ? 'SW FOUND (FAIL)' : 'No SW (PASS)'}`);

  // Exit with error code if any test failed
  const hasErrors = results.row9.errors.length > 0 ||
                    results.row10.errors.length > 0 ||
                    results.row11.errors.length > 0 ||
                    results.row12.hasRegistration === true;

  if (hasErrors) {
    console.error('\n❌ VERIFICATION FAILED - Errors found (D-23 blocking)');
    process.exit(1);
  } else {
    console.log('\n✅ ALL CHECKS PASSED');
    process.exit(0);
  }
}

async function testRichResults(page, url, screenshotPath, result) {
  const rrtUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`;

  try {
    await page.goto(rrtUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });

    // Wait for results to load (Rich Results Test shows a progress indicator)
    // Look for either error state, success state, or results panel
    await page.waitForSelector('[role="main"], .error-message, [data-testid="results"]', {
      timeout: TIMEOUT,
      state: 'visible'
    }).catch(() => {
      console.log('  Waiting for results to render...');
    });

    // Give extra time for results to fully render
    await page.waitForTimeout(5000);

    // Check for consent dialog and accept if present
    const consentButton = page.locator('button:has-text("Accept all"), button:has-text("I agree")').first();
    if (await consentButton.isVisible().catch(() => false)) {
      console.log('  Accepting consent dialog...');
      await consentButton.click();
      await page.waitForTimeout(2000);
    }

    // Capture screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  Screenshot saved: ${path.basename(screenshotPath)}`);

    // Try to extract results from the page
    const pageText = await page.textContent('body');

    // Look for error indicators
    const hasError = pageText.toLowerCase().includes('error') &&
                    (pageText.toLowerCase().includes('invalid') ||
                     pageText.toLowerCase().includes('required property'));

    // Look for detection indicators
    const hasPerson = pageText.includes('Person') || pageText.includes('"@type":"Person"');
    const hasWebSite = pageText.includes('WebSite') || pageText.includes('"@type":"WebSite"');
    const hasCreativeWork = pageText.includes('CreativeWork') || pageText.includes('"@type":"CreativeWork"');
    const hasArticle = pageText.includes('Article') || pageText.includes('"@type":"Article"');
    const hasBreadcrumb = pageText.includes('Breadcrumb') || pageText.includes('BreadcrumbList');

    // Record detections
    if (hasPerson) result.detections.push('Person');
    if (hasWebSite) result.detections.push('WebSite');
    if (hasCreativeWork) result.detections.push('CreativeWork');
    if (hasArticle) result.detections.push('Article');
    if (hasBreadcrumb) result.detections.push('BreadcrumbList');

    // Check for warnings (expected for teamSize/role and SearchAction)
    const hasWarnings = pageText.toLowerCase().includes('warning');
    if (hasWarnings) {
      result.warnings.push('Warnings present (expected for teamSize/role/SearchAction)');
    }

    result.status = hasError ? 'fail' : 'pass';
    if (hasError) {
      result.errors.push('Rich Results Test reported errors in page content');
    }

    console.log(`  Detections: ${result.detections.join(', ') || 'none found in text'}`);
    console.log(`  Status: ${result.status}`);

  } catch (error) {
    result.status = 'error';
    result.errors.push(`Automation failed: ${error.message}`);
    console.error(`  Error: ${error.message}`);
  }
}

async function checkServiceWorker(page, screenshotPath, result) {
  try {
    // Navigate to the production site
    await page.goto('https://work.randyellis.design/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for page to fully load and SW to register/unregister
    await page.waitForTimeout(3000);

    // Check for service worker registrations via JavaScript
    const swRegistrations = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistrations().then(registrations => {
        return registrations.map(reg => ({
          scope: reg.scope,
          active: reg.active?.scriptURL || null,
          waiting: reg.waiting?.scriptURL || null,
          installing: reg.installing?.scriptURL || null
        }));
      });
    });

    console.log(`  Found ${swRegistrations.length} service worker registration(s)`);

    if (swRegistrations.length > 0) {
      console.log('  Registrations:', JSON.stringify(swRegistrations, null, 2));
    }

    // Take screenshot of DevTools-like view
    // Since we can't actually open DevTools in headless, just screenshot the page
    // with console info about SW state
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  Screenshot saved: ${path.basename(screenshotPath)}`);

    result.hasRegistration = swRegistrations.length > 0;
    result.registrations = swRegistrations;
    result.status = swRegistrations.length === 0 ? 'pass' : 'fail';

    console.log(`  Status: ${result.status} (${swRegistrations.length} registrations)`);

  } catch (error) {
    result.status = 'error';
    result.errors = [`Automation failed: ${error.message}`];
    console.error(`  Error: ${error.message}`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
