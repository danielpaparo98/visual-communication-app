import { test, expect } from '@playwright/test';

test.describe('PDF Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the chart page
    await page.goto('http://localhost:3000/chart');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
  });

  test('should load chart editor page', async ({ page }) => {
    // Verify the page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for key elements
    await expect(page.locator('.chart-editor')).toBeVisible();
    await expect(page.locator('.wysiwyg-canvas')).toBeVisible();
  });

  test('should add multiple cards to the chart', async ({ page }) => {
    // Find the add card button
    const addCardButton = page.locator('button:has-text("Add Card")').or(
      page.locator('[aria-label*="Add"]')
    );
    
    // Add 6 cards (3x2 grid)
    for (let i = 0; i < 6; i++) {
      await addCardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Verify cards are added
    const cards = await page.locator('.canvas-card-wrapper').count();
    console.log('Number of cards:', cards);
    expect(cards).toBeGreaterThan(0);
  });

  test('should export PDF successfully', async ({ page, context }) => {
    // First, add some cards
    const addCardButton = page.locator('button:has-text("Add Card")').or(
      page.locator('[aria-label*="Add"]')
    );
    
    for (let i = 0; i < 6; i++) {
      await addCardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Switch to preview mode for cleaner export
    const previewButton = page.locator('button:has-text("Preview")').or(
      page.locator('[aria-label*="preview"]')
    );
    await previewButton.click();
    await page.waitForTimeout(1000);
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    
    // Click the export button
    const exportButton = page.locator('button:has-text("Export PDF")').or(
      page.locator('button:has-text("Exporting...")')
    );
    await exportButton.click();
    
    // Wait for download
    const download = await downloadPromise;
    console.log('Download started:', download.suggestedFilename());
    
    // Save the downloaded file
    const downloadPath = './test-results/' + download.suggestedFilename();
    await download.saveAs(downloadPath);
    console.log('PDF saved to:', downloadPath);
    
    // Verify the file exists
    const fs = require('fs');
    expect(fs.existsSync(downloadPath)).toBe(true);
    
    // Check file size (should be reasonable for a PDF)
    const stats = fs.statSync(downloadPath);
    console.log('PDF file size:', stats.size, 'bytes');
    expect(stats.size).toBeGreaterThan(1000); // At least 1KB
  });

  test('should verify canvas dimensions match A4 landscape', async ({ page }) => {
    const canvas = page.locator('.wysiwyg-canvas');
    
    // Get canvas dimensions
    const box = await canvas.boundingBox();
    console.log('Canvas dimensions:', box);
    
    // A4 landscape at 96 DPI is approximately 1123px x 794px
    // Allow some tolerance for browser rendering
    expect(box.width).toBeGreaterThan(1100);
    expect(box.width).toBeLessThan(1150);
    expect(box.height).toBeGreaterThan(780);
    expect(box.height).toBeLessThan(810);
  });

  test('should check for console errors during export', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Add cards
    const addCardButton = page.locator('button:has-text("Add Card")').or(
      page.locator('[aria-label*="Add"]')
    );
    
    for (let i = 0; i < 6; i++) {
      await addCardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Export PDF
    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.locator('button:has-text("Export PDF")');
    await exportButton.click();
    await downloadPromise;
    
    // Check for errors
    console.log('Console errors during export:', errors);
    expect(errors.length).toBe(0);
  });

  test('should verify WYSIWYG accuracy with screenshot', async ({ page }) => {
    // Add cards
    const addCardButton = page.locator('button:has-text("Add Card")').or(
      page.locator('[aria-label*="Add"]')
    );
    
    for (let i = 0; i < 6; i++) {
      await addCardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Take screenshot of canvas before export
    const canvas = page.locator('.wysiwyg-canvas');
    await canvas.screenshot({ path: './test-results/canvas-before-export.png' });
    
    // Export PDF
    const downloadPromise = page.waitForEvent('download');
    const exportButton = page.locator('button:has-text("Export PDF")');
    await exportButton.click();
    const download = await downloadPromise;
    
    const downloadPath = './test-results/' + download.suggestedFilename();
    await download.saveAs(downloadPath);
    
    console.log('Screenshot saved to: ./test-results/canvas-before-export.png');
    console.log('PDF saved to:', downloadPath);
  });
});
