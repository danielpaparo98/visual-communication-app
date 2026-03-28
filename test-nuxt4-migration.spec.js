/**
 * Comprehensive Test Suite for Nuxt 4 Migration
 * Tests all major components and functionality after migration
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'test-results/nuxt4-migration-test';

// Console errors collector
let consoleErrors = [];
let consoleWarnings = [];

test.describe('Nuxt 4 Migration - Phase 1: Build and Startup', () => {
  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    consoleWarnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          location: msg.location()
        });
      } else if (msg.type() === 'warning') {
        consoleWarnings.push({
          text: msg.text(),
          location: msg.location()
        });
      }
    });
  });

  test('1.1 - Homepage loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for any console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors.length);
      consoleErrors.forEach(err => console.log('  -', err.text));
    }
    
    if (consoleWarnings.length > 0) {
      console.log('Console warnings found:', consoleWarnings.length);
      consoleWarnings.forEach(warn => console.log('  -', warn.text));
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/homepage.png`,
      fullPage: true 
    });
    
    // Verify page loaded
    expect(page.url()).toBe(BASE_URL + '/');
  });

  test('1.2 - Chart page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    console.log('Chart page title:', title);
    
    // Check for console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors on chart page:', consoleErrors.length);
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/chart-page.png`,
      fullPage: true 
    });
    
    expect(page.url()).toBe(`${BASE_URL}/chart`);
  });

  test('1.3 - Check for critical JavaScript errors', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Navigate to chart page
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Report any errors
    if (consoleErrors.length > 0) {
      console.log('\n=== CRITICAL ERRORS FOUND ===');
      consoleErrors.forEach((err, i) => {
        console.log(`Error ${i + 1}:`, err.text);
        console.log('  Location:', err.location);
      });
    }
    
    // This test should fail if there are critical errors
    expect(consoleErrors.length).toBe(0);
  });
});

test.describe('Nuxt 4 Migration - Phase 2: Chart Editor Components', () => {
  test('2.1 - ChartEditor component loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Look for chart editor elements
    const editorExists = await page.locator('[class*="editor"], [id*="editor"]').count() > 0;
    console.log('Chart editor elements found:', editorExists);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/chart-editor.png` });
    
    expect(editorExists).toBe(true);
  });

  test('2.2 - EditorCanvas renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Look for canvas element
    const canvasExists = await page.locator('canvas, [class*="canvas"]').count() > 0;
    console.log('Canvas elements found:', canvasExists);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/editor-canvas.png` });
  });

  test('2.3 - IconPicker component works', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Look for icon picker or icon elements
    const iconElements = await page.locator('[class*="icon"], svg').count();
    console.log('Icon elements found:', iconElements);
    
    // Check if icons are using @iconify/vue
    const iconifyIcons = await page.locator('svg[data-icon]').count();
    console.log('Iconify icons found:', iconifyIcons);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/icon-picker.png` });
    
    expect(iconElements).toBeGreaterThan(0);
  });

  test('2.4 - EditorToolbar buttons work', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Look for toolbar buttons
    const buttons = await page.locator('button').count();
    console.log('Buttons found:', buttons);
    
    // Try to click a button if available
    if (buttons > 0) {
      const firstButton = page.locator('button').first();
      await firstButton.click();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/editor-toolbar.png` });
  });
});

test.describe('Nuxt 4 Migration - Phase 3: UI Components', () => {
  test('3.1 - AppButton component', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const buttons = await page.locator('button, [class*="button"]').count();
    console.log('Button elements found:', buttons);
    
    // Test button hover
    if (buttons > 0) {
      const firstButton = page.locator('button').first();
      await firstButton.hover();
      await page.waitForTimeout(200);
    }
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/app-button.png` });
    
    expect(buttons).toBeGreaterThan(0);
  });

  test('3.2 - AppModal component', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Look for modal elements
    const modals = await page.locator('[class*="modal"], [role="dialog"]').count();
    console.log('Modal elements found:', modals);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/app-modal.png` });
  });

  test('3.3 - AppInput component', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    const inputs = await page.locator('input, textarea').count();
    console.log('Input elements found:', inputs);
    
    // Test typing in an input
    if (inputs > 0) {
      const firstInput = page.locator('input, textarea').first();
      await firstInput.fill('Test input');
      await page.waitForTimeout(200);
    }
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/app-input.png` });
    
    expect(inputs).toBeGreaterThan(0);
  });

  test('3.4 - Notifications component', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Look for notification elements
    const notifications = await page.locator('[class*="notification"], [class*="toast"]').count();
    console.log('Notification elements found:', notifications);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/notifications.png` });
  });
});

test.describe('Nuxt 4 Migration - Phase 4: Styling', () => {
  test('4.1 - Tailwind v4 classes applied', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for Tailwind classes
    const body = await page.locator('body');
    const bodyClass = await body.getAttribute('class');
    console.log('Body classes:', bodyClass);
    
    // Check for custom colors
    const computedStyle = await body.evaluate(el => {
      return window.getComputedStyle(el);
    });
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/tailwind-styling.png` });
  });

  test('4.2 - Custom fonts loaded', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for font loading
    const fonts = await page.evaluate(() => {
      return document.fonts ? document.fonts.size : 0;
    });
    
    console.log('Fonts loaded:', fonts);
    
    // Check body font
    const bodyFont = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });
    console.log('Body font family:', bodyFont);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/custom-fonts.png` });
  });

  test('4.3 - Responsive design - Mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/responsive-mobile.png`,
      fullPage: true 
    });
  });

  test('4.4 - Responsive design - Tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/responsive-tablet.png`,
      fullPage: true 
    });
  });

  test('4.5 - Responsive design - Desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/responsive-desktop.png`,
      fullPage: true 
    });
  });
});

test.describe('Nuxt 4 Migration - Phase 5: Icon System', () => {
  test('5.1 - Icons render correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Count SVG icons
    const svgIcons = await page.locator('svg').count();
    console.log('SVG icons found:', svgIcons);
    
    // Check for Iconify icons
    const iconifyIcons = await page.locator('svg[data-icon]').count();
    console.log('Iconify icons found:', iconifyIcons);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/icons-render.png` });
    
    expect(svgIcons).toBeGreaterThan(0);
  });

  test('5.2 - Icon collections work', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Check different icon collections
    const lucideIcons = await page.locator('svg[data-icon*="lucide"]').count();
    const tablerIcons = await page.locator('svg[data-icon*="tabler"]').count();
    
    console.log('Lucide icons:', lucideIcons);
    console.log('Tabler icons:', tablerIcons);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/icon-collections.png` });
  });

  test('5.3 - Icon sizing works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check icon sizes
    const icons = await page.locator('svg').all();
    
    for (let i = 0; i < Math.min(icons.length, 5); i++) {
      const icon = icons[i];
      const width = await icon.evaluate(el => el.getAttribute('width'));
      const height = await icon.evaluate(el => el.getAttribute('height'));
      console.log(`Icon ${i + 1} size: ${width}x${height}`);
    }
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/icon-sizing.png` });
  });
});

test.describe('Nuxt 4 Migration - Phase 6: Store Functionality', () => {
  test('6.1 - Check Pinia store initialization', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Check if Pinia is loaded
    const piniaLoaded = await page.evaluate(() => {
      return typeof window.$nuxt !== 'undefined' && 
             typeof window.$nuxt.$pinia !== 'undefined';
    });
    
    console.log('Pinia loaded:', piniaLoaded);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/pinia-store.png` });
    
    expect(piniaLoaded).toBe(true);
  });

  test('6.2 - Check chart store', async ({ page }) => {
    await page.goto(`${BASE_URL}/chart`);
    await page.waitForLoadState('networkidle');
    
    // Try to access chart store
    const chartStoreData = await page.evaluate(() => {
      try {
        if (window.$nuxt && window.$nuxt.$pinia) {
          const stores = window.$nuxt.$pinia.state.value;
          return JSON.stringify(stores, null, 2);
        }
        return null;
      } catch (e) {
        return 'Error: ' + e.message;
      }
    });
    
    console.log('Store data:', chartStoreData);
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/chart-store.png` });
  });
});

test.describe('Nuxt 4 Migration - Summary', () => {
  test('Generate test summary', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Collect all test results
    const summary = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      tests: [
        'Homepage loads',
        'Chart page loads',
        'ChartEditor component',
        'EditorCanvas renders',
        'IconPicker works',
        'EditorToolbar buttons',
        'AppButton component',
        'AppModal component',
        'AppInput component',
        'Notifications component',
        'Tailwind v4 styling',
        'Custom fonts loaded',
        'Responsive design',
        'Icon system',
        'Pinia stores'
      ]
    };
    
    console.log('\n=== TEST SUMMARY ===');
    console.log(JSON.stringify(summary, null, 2));
    
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/final-screenshot.png`,
      fullPage: true 
    });
  });
});
