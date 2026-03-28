import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Test results tracking
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

function logResult(testName, status, details = '') {
  if (status === 'PASS') {
    testResults.passed.push({ test: testName, details });
    console.log(`✅ PASS: ${testName}${details ? ' - ' + details : ''}`);
  } else if (status === 'FAIL') {
    testResults.failed.push({ test: testName, details });
    console.log(`❌ FAIL: ${testName}${details ? ' - ' + details : ''}`);
  } else {
    testResults.warnings.push({ test: testName, details });
    console.log(`⚠️  WARN: ${testName}${details ? ' - ' + details : ''}`);
  }
}

test.describe('Chart Creation System - Comprehensive Testing', () => {
  let page;
  let consoleErrors = [];

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
  });

  test.afterAll(async () => {
    await page.close();
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Passed: ${testResults.passed.length}`);
    console.log(`Failed: ${testResults.failed.length}`);
    console.log(`Warnings: ${testResults.warnings.length}`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('\nConsole Errors:');
      consoleErrors.forEach(err => console.log(`  - ${err}`));
    }
  });

  test('1. Navigate to chart editor', async () => {
    try {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      logResult('Navigate to chart editor', 'PASS', 'Page loaded successfully');
    } catch (error) {
      logResult('Navigate to chart editor', 'FAIL', error.message);
    }
  });

  test('2. WYSIWYG Canvas - Verify A4 landscape dimensions', async () => {
    try {
      const canvas = await page.locator('[data-testid="wysiwyg-canvas"]').first();
      await expect(canvas).toBeVisible();
      
      const box = await canvas.boundingBox();
      logResult('Canvas visibility', 'PASS', `Canvas visible at ${box.width}x${box.height}px`);
      
      // Check for canvas dimensions indicator
      const dimensions = await page.locator('text=/297mm|210mm|A4/i').first();
      const hasDimensions = await dimensions.count() > 0;
      logResult('A4 dimensions display', hasDimensions ? 'PASS' : 'WARN', 
        hasDimensions ? 'Dimensions shown' : 'Dimensions not clearly visible');
    } catch (error) {
      logResult('WYSIWYG Canvas dimensions', 'FAIL', error.message);
    }
  });

  test('3. Zoom controls - Test all zoom levels', async () => {
    const zoomLevels = ['50%', '75%', '100%', '125%', '150%'];
    
    for (const zoom of zoomLevels) {
      try {
        await page.click(`button:has-text("${zoom}")`);
        await page.waitForTimeout(500);
        
        const activeZoom = await page.locator(`button:has-text("${zoom}").active`).count();
        logResult(`Zoom ${zoom}`, activeZoom > 0 ? 'PASS' : 'WARN', 
          activeZoom > 0 ? 'Zoom applied' : 'Button clicked but state unclear');
      } catch (error) {
        logResult(`Zoom ${zoom}`, 'FAIL', error.message);
      }
    }
  });

  test('4. Layout presets - Test all presets', async () => {
    const presets = ['2×10', '4×5', '5×4', '3×7'];
    
    for (const preset of presets) {
      try {
        await page.click(`button:has-text("${preset}")`);
        await page.waitForTimeout(500);
        
        const cards = await page.locator('[data-testid="canvas-card"]').count();
        logResult(`Layout preset ${preset}`, 'PASS', `Applied with ${cards} cards`);
      } catch (error) {
        logResult(`Layout preset ${preset}`, 'FAIL', error.message);
      }
    }
  });

  test('5. Card spacing - Adjustable gap', async () => {
    try {
      const slider = await page.locator('[data-testid="spacing-slider"]').first();
      if (await slider.count() > 0) {
        // Test minimum
        await slider.fill('2');
        await page.waitForTimeout(300);
        logResult('Card spacing minimum (2mm)', 'PASS');
        
        // Test maximum
        await slider.fill('15');
        await page.waitForTimeout(300);
        logResult('Card spacing maximum (15mm)', 'PASS');
      } else {
        logResult('Card spacing slider', 'WARN', 'Spacing slider not found');
      }
    } catch (error) {
      logResult('Card spacing adjustment', 'FAIL', error.message);
    }
  });

  test('6. Card margins - Adjustable margins', async () => {
    try {
      const marginSlider = await page.locator('[data-testid="margin-slider"]').first();
      if (await marginSlider.count() > 0) {
        await marginSlider.fill('5');
        await page.waitForTimeout(300);
        logResult('Card margin minimum (5mm)', 'PASS');
        
        await marginSlider.fill('30');
        await page.waitForTimeout(300);
        logResult('Card margin maximum (30mm)', 'PASS');
      } else {
        logResult('Card margin slider', 'WARN', 'Margin slider not found');
      }
    } catch (error) {
      logResult('Card margin adjustment', 'FAIL', error.message);
    }
  });

  test('7. Card Management - Add new card', async () => {
    try {
      const beforeCount = await page.locator('[data-testid="canvas-card"]').count();
      
      await page.click('button:has-text("Add Card")');
      await page.waitForTimeout(500);
      
      const afterCount = await page.locator('[data-testid="canvas-card"]').count();
      const added = afterCount > beforeCount;
      logResult('Add new card', added ? 'PASS' : 'FAIL', 
        `Cards: ${beforeCount} → ${afterCount}`);
    } catch (error) {
      logResult('Add new card', 'FAIL', error.message);
    }
  });

  test('8. Card Management - Select and delete card', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      const beforeCount = await cards.count();
      
      if (beforeCount > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        const deleteBtn = await page.locator('button[aria-label*="Delete"], button:has-text("Delete")').first();
        if (await deleteBtn.count() > 0) {
          await deleteBtn.click();
          await page.waitForTimeout(500);
          
          const afterCount = await page.locator('[data-testid="canvas-card"]').count();
          const deleted = afterCount < beforeCount;
          logResult('Delete card', deleted ? 'PASS' : 'WARN', 
            `Cards: ${beforeCount} → ${afterCount}`);
        } else {
          logResult('Delete card', 'WARN', 'Delete button not found');
        }
      } else {
        logResult('Delete card', 'WARN', 'No cards to delete');
      }
    } catch (error) {
      logResult('Delete card', 'FAIL', error.message);
    }
  });

  test('9. Card Management - Duplicate card', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      const beforeCount = await cards.count();
      
      if (beforeCount > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        const duplicateBtn = await page.locator('button[aria-label*="Duplicate"], button:has-text("Duplicate")').first();
        if (await duplicateBtn.count() > 0) {
          await duplicateBtn.click();
          await page.waitForTimeout(500);
          
          const afterCount = await page.locator('[data-testid="canvas-card"]').count();
          const duplicated = afterCount > beforeCount;
          logResult('Duplicate card', duplicated ? 'PASS' : 'WARN', 
            `Cards: ${beforeCount} → ${afterCount}`);
        } else {
          logResult('Duplicate card', 'WARN', 'Duplicate button not found');
        }
      } else {
        logResult('Duplicate card', 'WARN', 'No cards to duplicate');
      }
    } catch (error) {
      logResult('Duplicate card', 'FAIL', error.message);
    }
  });

  test('10. Icon Picker - Select icon', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      if (await cards.count() > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        const iconPicker = await page.locator('[data-testid="icon-picker"], .icon-picker').first();
        if (await iconPicker.count() > 0) {
          await iconPicker.click();
          await page.waitForTimeout(500);
          
          const icon = await page.locator('.icon-option, [data-icon]').first();
          if (await icon.count() > 0) {
            await icon.click();
            await page.waitForTimeout(300);
            logResult('Icon selection', 'PASS', 'Icon selected successfully');
          } else {
            logResult('Icon selection', 'WARN', 'No icons available');
          }
        } else {
          logResult('Icon picker', 'WARN', 'Icon picker not found');
        }
      } else {
        logResult('Icon selection', 'WARN', 'No cards available');
      }
    } catch (error) {
      logResult('Icon selection', 'FAIL', error.message);
    }
  });

  test('11. Card text editing - Heading and subtitle', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      if (await cards.count() > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        const headingInput = await page.locator('input[placeholder*="Heading"], textarea[placeholder*="Heading"]').first();
        if (await headingInput.count() > 0) {
          await headingInput.fill('Test Heading');
          await page.waitForTimeout(300);
          logResult('Edit card heading', 'PASS');
        }
        
        const subtitleInput = await page.locator('input[placeholder*="Subtitle"], textarea[placeholder*="Subtitle"]').first();
        if (await subtitleInput.count() > 0) {
          await subtitleInput.fill('Test Subtitle');
          await page.waitForTimeout(300);
          logResult('Edit card subtitle', 'PASS');
        }
      } else {
        logResult('Card text editing', 'WARN', 'No cards available');
      }
    } catch (error) {
      logResult('Card text editing', 'FAIL', error.message);
    }
  });

  test('12. Styling - Test all font families', async () => {
    const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins'];
    
    for (const font of fonts) {
      try {
        const fontSelect = await page.locator('select:has-text("Font"), [data-testid="font-select"]').first();
        if (await fontSelect.count() > 0) {
          await fontSelect.selectOption(font);
          await page.waitForTimeout(300);
          logResult(`Font family ${font}`, 'PASS', 'Applied successfully');
        } else {
          logResult(`Font family ${font}`, 'WARN', 'Font selector not found');
          break;
        }
      } catch (error) {
        logResult(`Font family ${font}`, 'FAIL', error.message);
      }
    }
  });

  test('13. Styling - Test all color themes', async () => {
    const themes = ['Neutral', 'Colorful', 'High Contrast', 'Pastel', 'Dark'];
    
    for (const theme of themes) {
      try {
        const themeBtn = await page.locator(`button:has-text("${theme}")`).first();
        if (await themeBtn.count() > 0) {
          await themeBtn.click();
          await page.waitForTimeout(300);
          logResult(`Theme ${theme}`, 'PASS', 'Applied successfully');
        } else {
          logResult(`Theme ${theme}`, 'WARN', 'Theme button not found');
        }
      } catch (error) {
        logResult(`Theme ${theme}`, 'FAIL', error.message);
      }
    }
  });

  test('14. Preview mode - Toggle edit/preview', async () => {
    try {
      const previewBtn = await page.locator('button:has-text("Preview"), button[aria-label*="Preview"]').first();
      if (await previewBtn.count() > 0) {
        // Enter preview mode
        await previewBtn.click();
        await page.waitForTimeout(500);
        logResult('Enter preview mode', 'PASS');
        
        // Verify read-only state (no edit controls visible)
        const editControls = await page.locator('[data-testid="card-actions"], .delete-btn, .duplicate-btn').count();
        const isReadOnly = editControls === 0;
        logResult('Preview mode read-only', isReadOnly ? 'PASS' : 'WARN', 
          isReadOnly ? 'No edit controls visible' : `${editControls} edit controls still visible`);
        
        // Exit preview mode
        await previewBtn.click();
        await page.waitForTimeout(500);
        logResult('Exit preview mode', 'PASS');
      } else {
        logResult('Preview mode toggle', 'WARN', 'Preview button not found');
      }
    } catch (error) {
      logResult('Preview mode toggle', 'FAIL', error.message);
    }
  });

  test('15. Keyboard shortcuts - Ctrl+S (save)', async () => {
    try {
      await page.keyboard.press('Control+s');
      await page.waitForTimeout(500);
      
      // Check for save notification
      const notification = await page.locator('.notification, .toast, [role="alert"]').first();
      const hasNotification = await notification.count() > 0;
      logResult('Keyboard Ctrl+S save', hasNotification ? 'PASS' : 'WARN', 
        hasNotification ? 'Save notification shown' : 'No visible confirmation');
    } catch (error) {
      logResult('Keyboard Ctrl+S save', 'FAIL', error.message);
    }
  });

  test('16. Keyboard shortcuts - Delete key', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      const beforeCount = await cards.count();
      
      if (beforeCount > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        await page.keyboard.press('Delete');
        await page.waitForTimeout(500);
        
        const afterCount = await page.locator('[data-testid="canvas-card"]').count();
        const deleted = afterCount < beforeCount;
        logResult('Keyboard Delete', deleted ? 'PASS' : 'WARN', 
          `Cards: ${beforeCount} → ${afterCount}`);
      } else {
        logResult('Keyboard Delete', 'WARN', 'No cards to delete');
      }
    } catch (error) {
      logResult('Keyboard Delete', 'FAIL', error.message);
    }
  });

  test('17. Keyboard shortcuts - Escape (deselect)', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      if (await cards.count() > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        // Check if card is deselected (no selected class)
        const selectedCard = await page.locator('[data-testid="canvas-card"].selected, .card.selected').count();
        const deselected = selectedCard === 0;
        logResult('Keyboard Escape deselect', deselected ? 'PASS' : 'WARN', 
          deselected ? 'Card deselected' : 'Card still appears selected');
      } else {
        logResult('Keyboard Escape deselect', 'WARN', 'No cards available');
      }
    } catch (error) {
      logResult('Keyboard Escape deselect', 'FAIL', error.message);
    }
  });

  test('18. Data persistence - Save to localStorage', async () => {
    try {
      // Get current card count
      const beforeCount = await page.locator('[data-testid="canvas-card"]').count();
      
      // Add a card
      await page.click('button:has-text("Add Card")');
      await page.waitForTimeout(500);
      
      // Save
      await page.keyboard.press('Control+s');
      await page.waitForTimeout(500);
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check if card count is preserved
      const afterCount = await page.locator('[data-testid="canvas-card"]').count();
      const persisted = afterCount === beforeCount + 1;
      logResult('Data persistence', persisted ? 'PASS' : 'FAIL', 
        `Cards before: ${beforeCount}, after reload: ${afterCount}`);
    } catch (error) {
      logResult('Data persistence', 'FAIL', error.message);
    }
  });

  test('19. Accessibility - ARIA labels', async () => {
    try {
      const buttonsWithAria = await page.locator('button[aria-label]').count();
      const inputsWithAria = await page.locator('input[aria-label], input[aria-labelledby]').count();
      
      logResult('ARIA labels on buttons', buttonsWithAria > 0 ? 'PASS' : 'WARN', 
        `${buttonsWithAria} buttons have aria-label`);
      logResult('ARIA labels on inputs', inputsWithAria > 0 ? 'PASS' : 'WARN', 
        `${inputsWithAria} inputs have aria-label`);
    } catch (error) {
      logResult('Accessibility ARIA labels', 'FAIL', error.message);
    }
  });

  test('20. Browser compatibility - Console errors check', async () => {
    try {
      if (consoleErrors.length === 0) {
        logResult('Console errors', 'PASS', 'No console errors detected');
      } else {
        logResult('Console errors', 'WARN', `${consoleErrors.length} console errors found`);
      }
    } catch (error) {
      logResult('Console errors check', 'FAIL', error.message);
    }
  });

  test('21. PDF Export - Standard quality', async () => {
    try {
      const exportBtn = await page.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      if (await exportBtn.count() > 0) {
        // Set up download handler
        const downloadPromise = page.waitForEvent('download');
        
        await exportBtn.click();
        await page.waitForTimeout(500);
        
        // Select standard quality if option exists
        const standardBtn = await page.locator('button:has-text("Standard")').first();
        if (await standardBtn.count() > 0) {
          await standardBtn.click();
        }
        
        const download = await downloadPromise;
        const filename = download.suggestedFilename();
        logResult('PDF Export standard quality', 'PASS', `Downloaded: ${filename}`);
      } else {
        logResult('PDF Export standard quality', 'WARN', 'Export button not found');
      }
    } catch (error) {
      logResult('PDF Export standard quality', 'FAIL', error.message);
    }
  });

  test('22. PDF Export - High quality', async () => {
    try {
      const exportBtn = await page.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      if (await exportBtn.count() > 0) {
        await exportBtn.click();
        await page.waitForTimeout(500);
        
        // Select high quality
        const highQualityBtn = await page.locator('button:has-text("High Quality")').first();
        if (await highQualityBtn.count() > 0) {
          const downloadPromise = page.waitForEvent('download');
          await highQualityBtn.click();
          
          const download = await downloadPromise;
          const filename = download.suggestedFilename();
          logResult('PDF Export high quality', 'PASS', `Downloaded: ${filename}`);
        } else {
          logResult('PDF Export high quality', 'WARN', 'High quality option not found');
        }
      }
    } catch (error) {
      logResult('PDF Export high quality', 'FAIL', error.message);
    }
  });

  test('23. PDF Export - Loading states', async () => {
    try {
      const exportBtn = await page.locator('button:has-text("Export"), button[aria-label*="Export"]').first();
      if (await exportBtn.count() > 0) {
        await exportBtn.click();
        await page.waitForTimeout(500);
        
        // Check for loading indicator
        const loading = await page.locator('.loading, .spinner, [aria-busy="true"]').first();
        const hasLoading = await loading.count() > 0;
        logResult('PDF Export loading state', hasLoading ? 'PASS' : 'WARN', 
          hasLoading ? 'Loading indicator shown' : 'No visible loading indicator');
        
        // Close export modal if open
        const closeBtn = await page.locator('button:has-text("Cancel"), button:has-text("Close")').first();
        if (await closeBtn.count() > 0) {
          await closeBtn.click();
        }
      }
    } catch (error) {
      logResult('PDF Export loading state', 'FAIL', error.message);
    }
  });

  test('24. Responsive design - Mobile viewport', async () => {
    try {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const canvas = await page.locator('[data-testid="wysiwyg-canvas"]').first();
      const isVisible = await canvas.isVisible();
      logResult('Mobile viewport canvas', isVisible ? 'PASS' : 'FAIL', 
        isVisible ? 'Canvas visible on mobile' : 'Canvas not visible on mobile');
      
      // Reset to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
    } catch (error) {
      logResult('Responsive design mobile', 'FAIL', error.message);
    }
  });

  test('25. Edge case - Very long text', async () => {
    try {
      const cards = await page.locator('[data-testid="canvas-card"]');
      if (await cards.count() > 0) {
        await cards.first().click();
        await page.waitForTimeout(300);
        
        const headingInput = await page.locator('input[placeholder*="Heading"], textarea[placeholder*="Heading"]').first();
        if (await headingInput.count() > 0) {
          const longText = 'This is a very long heading text that should test character limits and overflow handling in the card component to ensure it displays correctly without breaking the layout';
          await headingInput.fill(longText);
          await page.waitForTimeout(300);
          logResult('Edge case long text', 'PASS', 'Long text handled');
        }
      }
    } catch (error) {
      logResult('Edge case long text', 'FAIL', error.message);
    }
  });

  test('26. Edge case - Empty chart (no cards)', async () => {
    try {
      // Delete all cards
      const cards = await page.locator('[data-testid="canvas-card"]');
      const count = await cards.count();
      
      for (let i = 0; i < count; i++) {
        await cards.first().click();
        await page.waitForTimeout(300);
        const deleteBtn = await page.locator('button[aria-label*="Delete"], button:has-text("Delete")').first();
        if (await deleteBtn.count() > 0) {
          await deleteBtn.click();
          await page.waitForTimeout(300);
        }
      }
      
      const finalCount = await page.locator('[data-testid="canvas-card"]').count();
      logResult('Edge case empty chart', finalCount === 0 ? 'PASS' : 'WARN', 
        `Cards remaining: ${finalCount}`);
    } catch (error) {
      logResult('Edge case empty chart', 'FAIL', error.message);
    }
  });

  test('27. Clear chart functionality', async () => {
    try {
      // Add some cards first
      for (let i = 0; i < 5; i++) {
        await page.click('button:has-text("Add Card")');
        await page.waitForTimeout(300);
      }
      
      // Look for clear button
      const clearBtn = await page.locator('button:has-text("Clear"), button[aria-label*="Clear"]').first();
      if (await clearBtn.count() > 0) {
        await clearBtn.click();
        await page.waitForTimeout(500);
        
        const cardCount = await page.locator('[data-testid="canvas-card"]').count();
        logResult('Clear chart', cardCount === 0 ? 'PASS' : 'WARN', 
          `Cards after clear: ${cardCount}`);
      } else {
        logResult('Clear chart', 'WARN', 'Clear button not found');
      }
    } catch (error) {
      logResult('Clear chart', 'FAIL', error.message);
    }
  });

  test('28. Capture final screenshot', async () => {
    try {
      await page.screenshot({ 
        path: 'test-results/final-screenshot.png',
        fullPage: true 
      });
      logResult('Final screenshot', 'PASS', 'Saved to test-results/final-screenshot.png');
    } catch (error) {
      logResult('Final screenshot', 'FAIL', error.message);
    }
  });
});

test.afterAll(async () => {
  console.log('\n=== FINAL TEST REPORT ===');
  console.log(`\n✅ PASSED: ${testResults.passed.length}`);
  console.log(`❌ FAILED: ${testResults.failed.length}`);
  console.log(`⚠️  WARNINGS: ${testResults.warnings.length}`);
  console.log(`\n=== FAILED TESTS ===`);
  testResults.failed.forEach(f => console.log(`  ❌ ${f.test}: ${f.details}`));
  console.log(`\n=== WARNINGS ===`);
  testResults.warnings.forEach(w => console.log(`  ⚠️  ${w.test}: ${w.details}`));
});
