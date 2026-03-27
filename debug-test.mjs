import { chromium } from 'playwright';

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    console.log(`[Browser ${msg.type()}]:`, msg.text());
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    console.log('[Page Error]:', error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:3000/visual-communication-app/');
    await page.goto('http://localhost:3000/visual-communication-app/', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit for Vue to render
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('Screenshot saved to debug-screenshot.png');
    
    // Get page content
    const content = await page.content();
    console.log('\n--- Page HTML (first 2000 chars) ---');
    console.log(content.substring(0, 2000));
    
    // Check for Vue app
    const appContent = await page.locator('#__nuxt').innerHTML().catch(() => 'No __nuxt element found');
    console.log('\n--- __nuxt content ---');
    console.log(appContent.substring(0, 1000));
    
  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'debug-error.png' });
  } finally {
    await browser.close();
  }
}

debug();
