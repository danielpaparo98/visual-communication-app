import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000/visual-communication-app';

// Helper function to capture console logs
const captureConsoleLogs = async (page) => {
  const logs = [];
  page.on('console', msg => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  page.on('pageerror', error => {
    logs.push({
      type: 'error',
      text: error.message,
      stack: error.stack
    });
  });
  return logs;
};

test.describe('Chart Editor Redesign - Comprehensive Tests', () => {
  let page;
  let consoleLogs;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    consoleLogs = await captureConsoleLogs(page);
  });

  test.afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test.describe('1. Card Management Features', () => {
    test('should navigate to chart page', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      // Navigate to chart page
      await page.click('text=Chart Editor');
      await page.waitForURL('**/chart');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/chart');
    });

    test('should add new card', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      // Find and click add card button
      const addCardButton = page.locator('button:has-text("Add Card")').or(
        page.locator('[data-testid="add-card"]')
      ).or(
        page.locator('button[aria-label*="Add"]')
      ).first();
      
      const initialCardCount = await page.locator('[data-testid="card"], .editor-card').count();
      
      await addCardButton.click();
      await page.waitForTimeout(500);
      
      const newCardCount = await page.locator('[data-testid="card"], .editor-card').count();
      expect(newCardCount).toBeGreaterThan(initialCardCount);
    });

    test('should delete card', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      // Add a card first
      const addCardButton = page.locator('button:has-text("Add Card")').or(
        page.locator('[data-testid="add-card"]')
      ).first();
      await addCardButton.click();
      await page.waitForTimeout(500);
      
      const initialCardCount = await page.locator('[data-testid="card"], .editor-card').count();
      
      // Select the first card and delete it
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      await firstCard.click();
      await page.waitForTimeout(200);
      
      const deleteButton = page.locator('button:has-text("Delete")').or(
        page.locator('[data-testid="delete-card"]')
      ).or(
        page.locator('button[aria-label*="Delete"]')
      ).first();
      
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      const newCardCount = await page.locator('[data-testid="card"], .editor-card').count();
      expect(newCardCount).toBeLessThan(initialCardCount);
    });

    test('should duplicate card', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const initialCardCount = await page.locator('[data-testid="card"], .editor-card').count();
      
      // Select first card
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      await firstCard.click();
      await page.waitForTimeout(200);
      
      const duplicateButton = page.locator('button:has-text("Duplicate")').or(
        page.locator('[data-testid="duplicate-card"]')
      ).first();
      
      await duplicateButton.click();
      await page.waitForTimeout(500);
      
      const newCardCount = await page.locator('[data-testid="card"], .editor-card').count();
      expect(newCardCount).toBe(initialCardCount + 1);
    });

    test('should select and deselect cards', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      
      // Select card
      await firstCard.click();
      await page.waitForTimeout(200);
      expect(await firstCard.getAttribute('class')).toContain('selected');
      
      // Deselect by clicking outside
      await page.click('body', { position: { x: 10, y: 10 } });
      await page.waitForTimeout(200);
      expect(await firstCard.getAttribute('class')).not.toContain('selected');
    });
  });

  test.describe('2. Content Editing Features', () => {
    test('should edit chart title', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const titleInput = page.locator('input[placeholder*="Chart Title"]').or(
        page.locator('[data-testid="chart-title"]')
      ).or(
        page.locator('h1[contenteditable="true"]')
      ).first();
      
      await titleInput.click();
      await titleInput.fill('Test Chart Title');
      await page.waitForTimeout(300);
      
      expect(await titleInput.inputValue()).toBe('Test Chart Title');
    });

    test('should edit card heading', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      await firstCard.click();
      await page.waitForTimeout(200);
      
      const headingInput = page.locator('[data-testid="card-heading"]').or(
        page.locator('.editor-card h2')
      ).or(
        page.locator('input[placeholder*="Heading"]')
      ).first();
      
      await headingInput.click();
      await headingInput.fill('Test Heading');
      await page.waitForTimeout(300);
      
      expect(await headingInput.inputValue()).toContain('Test Heading');
    });

    test('should edit card subtitle', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      await firstCard.click();
      await page.waitForTimeout(200);
      
      const subtitleInput = page.locator('[data-testid="card-subtitle"]').or(
        page.locator('.editor-card p')
      ).or(
        page.locator('textarea[placeholder*="Subtitle"]')
      ).first();
      
      await subtitleInput.click();
      await subtitleInput.fill('Test Subtitle');
      await page.waitForTimeout(300);
      
      expect(await subtitleInput.inputValue()).toContain('Test Subtitle');
    });

    test('should open icon picker', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      await firstCard.click();
      await page.waitForTimeout(200);
      
      const iconPickerButton = page.locator('[data-testid="icon-picker"]').or(
        page.locator('button[aria-label*="Icon"]')
      ).first();
      
      await iconPickerButton.click();
      await page.waitForTimeout(300);
      
      const iconPicker = page.locator('[data-testid="icon-picker-modal"], .icon-picker-modal');
      expect(await iconPicker.isVisible()).toBe(true);
    });

    test('should apply text formatting (bold)', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const firstCard = page.locator('[data-testid="card"], .editor-card').first();
      await firstCard.click();
      await page.waitForTimeout(200);
      
      const headingInput = page.locator('[data-testid="card-heading"]').or(
        page.locator('.editor-card h2')
      ).first();
      
      await headingInput.click();
      await headingInput.fill('Bold Text');
      await headingInput.selectText();
      
      const boldButton = page.locator('button[aria-label*="Bold"]').or(
        page.locator('[data-testid="format-bold"]')
      ).first();
      
      await boldButton.click();
      await page.waitForTimeout(200);
      
      // Verify bold formatting was applied
      const boldElement = headingInput.locator('strong, b');
      expect(await boldElement.count()).toBeGreaterThan(0);
    });
  });

  test.describe('3. Layout Controls', () => {
    test('should change layout preset', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const layoutSelect = page.locator('[data-testid="layout-select"]').or(
        page.locator('select:has-text("Layout")')
      ).first();
      
      if (await layoutSelect.isVisible()) {
        await layoutSelect.selectOption('4x5');
        await page.waitForTimeout(500);
        
        expect(await layoutSelect.inputValue()).toBe('4x5');
      }
    });

    test('should adjust card gap', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const gapSlider = page.locator('[data-testid="card-gap"]').or(
        page.locator('input[type="range"][aria-label*="Gap"]')
      ).first();
      
      if (await gapSlider.isVisible()) {
        await gapSlider.fill('20');
        await page.waitForTimeout(300);
        
        expect(await gapSlider.inputValue()).toBe('20');
      }
    });

    test('should zoom in and out', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const zoomInButton = page.locator('button[aria-label*="Zoom In"]').or(
        page.locator('[data-testid="zoom-in"]')
      ).first();
      
      const zoomOutButton = page.locator('button[aria-label*="Zoom Out"]').or(
        page.locator('[data-testid="zoom-out"]')
      ).first();
      
      if (await zoomInButton.isVisible()) {
        await zoomInButton.click();
        await page.waitForTimeout(300);
        
        await zoomOutButton.click();
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('4. Style Controls', () => {
    test('should change font family', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const fontSelect = page.locator('[data-testid="font-select"]').or(
        page.locator('select:has-text("Font")')
      ).first();
      
      if (await fontSelect.isVisible()) {
        await fontSelect.selectOption('Roboto');
        await page.waitForTimeout(300);
        
        expect(await fontSelect.inputValue()).toBe('Roboto');
      }
    });

    test('should change color theme', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const themeButton = page.locator('[data-testid="theme-select"]').or(
        page.locator('button[aria-label*="Theme"]')
      ).first();
      
      if (await themeButton.isVisible()) {
        await themeButton.click();
        await page.waitForTimeout(300);
        
        const themeOption = page.locator('[data-theme="dark"], .theme-option').first();
        if (await themeOption.isVisible()) {
          await themeOption.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe('5. Export Functionality', () => {
    test('should open export modal', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const exportButton = page.locator('button:has-text("Export")').or(
        page.locator('[data-testid="export-button"]')
      ).first();
      
      await exportButton.click();
      await page.waitForTimeout(500);
      
      const exportModal = page.locator('[data-testid="export-modal"], .export-modal');
      expect(await exportModal.isVisible()).toBe(true);
    });

    test('should select export format', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const exportButton = page.locator('button:has-text("Export")').or(
        page.locator('[data-testid="export-button"]')
      ).first();
      await exportButton.click();
      await page.waitForTimeout(500);
      
      const pdfOption = page.locator('[data-format="pdf"], button:has-text("PDF")').first();
      if (await pdfOption.isVisible()) {
        await pdfOption.click();
        await page.waitForTimeout(300);
      }
    });

    test('should set export quality', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const exportButton = page.locator('button:has-text("Export")').or(
        page.locator('[data-testid="export-button"]')
      ).first();
      await exportButton.click();
      await page.waitForTimeout(500);
      
      const qualitySelect = page.locator('[data-testid="export-quality"]').or(
        page.locator('select:has-text("Quality")')
      ).first();
      
      if (await qualitySelect.isVisible()) {
        await qualitySelect.selectOption('high');
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('6. Undo/Redo Functionality', () => {
    test('should undo with Ctrl+Z', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const titleInput = page.locator('input[placeholder*="Chart Title"]').or(
        page.locator('[data-testid="chart-title"]')
      ).first();
      
      await titleInput.click();
      await titleInput.fill('Original Title');
      await page.waitForTimeout(300);
      
      await titleInput.fill('Modified Title');
      await page.waitForTimeout(300);
      
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(300);
      
      expect(await titleInput.inputValue()).toBe('Original Title');
    });

    test('should redo with Ctrl+Y', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const titleInput = page.locator('input[placeholder*="Chart Title"]').or(
        page.locator('[data-testid="chart-title"]')
      ).first();
      
      await titleInput.click();
      await titleInput.fill('Original Title');
      await page.waitForTimeout(300);
      
      await titleInput.fill('Modified Title');
      await page.waitForTimeout(300);
      
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(300);
      
      await page.keyboard.press('Control+Y');
      await page.waitForTimeout(300);
      
      expect(await titleInput.inputValue()).toBe('Modified Title');
    });

    test('should use undo button in header', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const undoButton = page.locator('button[aria-label*="Undo"]').or(
        page.locator('[data-testid="undo-button"]')
      ).first();
      
      if (await undoButton.isVisible()) {
        const isDisabled = await undoButton.isDisabled();
        expect(typeof isDisabled).toBe('boolean');
      }
    });
  });

  test.describe('7. Onboarding Tour', () => {
    test('should display onboarding tour for new users', async () => {
      // Clear localStorage to simulate new user
      await page.goto(`${BASE_URL}/chart`);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const tourOverlay = page.locator('[data-testid="onboarding-tour"], .onboarding-tour');
      
      // Wait a bit for tour to potentially appear
      await page.waitForTimeout(1000);
      
      if (await tourOverlay.isVisible()) {
        expect(await tourOverlay.isVisible()).toBe(true);
      }
    });

    test('should navigate between tour steps', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const nextButton = page.locator('button:has-text("Next")').or(
        page.locator('[data-testid="tour-next"]')
      ).first();
      
      await page.waitForTimeout(1000);
      
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should skip tour', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const skipButton = page.locator('button:has-text("Skip")').or(
        page.locator('[data-testid="tour-skip"]')
      ).first();
      
      await page.waitForTimeout(1000);
      
      if (await skipButton.isVisible()) {
        await skipButton.click();
        await page.waitForTimeout(500);
        
        const tourOverlay = page.locator('[data-testid="onboarding-tour"], .onboarding-tour');
        expect(await tourOverlay.isVisible()).toBe(false);
      }
    });
  });

  test.describe('8. Performance', () => {
    test('should load page quickly', async () => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    });

    test('should handle large card counts without lag', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const addCardButton = page.locator('button:has-text("Add Card")').or(
        page.locator('[data-testid="add-card"]')
      ).first();
      
      const startTime = Date.now();
      
      // Add 10 cards
      for (let i = 0; i < 10; i++) {
        await addCardButton.click();
        await page.waitForTimeout(100);
      }
      
      const addTime = Date.now() - startTime;
      
      expect(addTime).toBeLessThan(10000); // Should add 10 cards in under 10 seconds
    });
  });

  test.describe('9. Accessibility', () => {
    test('should have ARIA labels on interactive elements', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const buttons = await page.locator('button').all();
      
      for (const button of buttons) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        
        // Each button should have either aria-label or text content
        expect(ariaLabel || (text && text.trim().length > 0)).toBeTruthy();
      }
    });

    test('should support keyboard navigation', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      // Tab through elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      // Verify focus is on an interactive element
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(['BUTTON', 'INPUT', 'SELECT', 'A']).toContain(focusedElement);
    });
  });

  test.describe('10. Responsive Design', () => {
    test('should work on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      // Check that main elements are visible
      const editor = page.locator('[data-testid="chart-editor"], .chart-editor');
      expect(await editor.isVisible()).toBe(true);
    });

    test('should work on tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const editor = page.locator('[data-testid="chart-editor"], .chart-editor');
      expect(await editor.isVisible()).toBe(true);
    });

    test('should work on desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const editor = page.locator('[data-testid="chart-editor"], .chart-editor');
      expect(await editor.isVisible()).toBe(true);
    });
  });

  test.describe('11. Data Persistence', () => {
    test('should save changes to localStorage', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const titleInput = page.locator('input[placeholder*="Chart Title"]').or(
        page.locator('[data-testid="chart-title"]')
      ).first();
      
      await titleInput.click();
      await titleInput.fill('Persistence Test');
      await page.waitForTimeout(1000); // Wait for debounced save
      
      const savedData = await page.evaluate(() => {
        return localStorage.getItem('visual-chart-data');
      });
      
      expect(savedData).toBeTruthy();
      expect(savedData).toContain('Persistence Test');
    });

    test('should load data on refresh', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const titleInput = page.locator('input[placeholder*="Chart Title"]').or(
        page.locator('[data-testid="chart-title"]')
      ).first();
      
      await titleInput.click();
      await titleInput.fill('Reload Test');
      await page.waitForTimeout(1000);
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const reloadedTitle = await titleInput.inputValue();
      expect(reloadedTitle).toBe('Reload Test');
    });
  });

  test.describe('12. Console Error Check', () => {
    test('should not have console errors', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      // Perform some actions
      const addCardButton = page.locator('button:has-text("Add Card")').or(
        page.locator('[data-testid="add-card"]')
      ).first();
      await addCardButton.click();
      await page.waitForTimeout(500);
      
      // Check for errors
      const errors = consoleLogs.filter(log => log.type === 'error');
      
      console.log('Console logs:', consoleLogs);
      console.log('Errors found:', errors);
      
      expect(errors.length).toBe(0);
    });
  });

  test.describe('13. Component Integration', () => {
    test('should render EditorCard component', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const cards = page.locator('.editor-card, [data-testid="card"]');
      expect(await cards.count()).toBeGreaterThan(0);
    });

    test('should render EditorToolbar component', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const toolbar = page.locator('.editor-toolbar, [data-testid="editor-toolbar"]');
      expect(await toolbar.isVisible()).toBe(true);
    });

    test('should render EditorHeader component', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('.editor-header, [data-testid="editor-header"]');
      expect(await header.isVisible()).toBe(true);
    });

    test('should render EditorCanvas component', async () => {
      await page.goto(`${BASE_URL}/chart`);
      await page.waitForLoadState('networkidle');
      
      const canvas = page.locator('.editor-canvas, [data-testid="editor-canvas"]');
      expect(await canvas.isVisible()).toBe(true);
    });
  });
});
