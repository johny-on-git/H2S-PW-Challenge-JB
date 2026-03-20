import { test, expect } from '@playwright/test';

test.describe('CivicSignal E2E Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Citizen can submit a report via 3-tap flow', async ({ page }) => {
    // Step 1: Select Category
    await expect(page.getByText("What's the issue?")).toBeVisible();
    await page.getByText('Safety').click();

    // Step 2: Location Check
    await expect(page.getByText('Location Check')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm Location' }).click();

    // Step 3: Final Details
    await expect(page.getByText('Final Details')).toBeVisible();
    await page.locator('#description').fill('Test report from Playwright E2E');
    await page.getByRole('button', { name: 'Submit Report' }).click();

    // Success
    await expect(page.getByText('Report Submitted!')).toBeVisible();
  });

  test('Dispatcher can view the dashboard', async ({ page }) => {
    // Switch to Dashboard
    await page.getByRole('button', { name: 'Dispatcher Dashboard' }).click();

    // Verify Dashboard Components
    await expect(page.getByText('Dispatcher Command')).toBeVisible();
    await expect(page.getByText('Live Reports: 24')).toBeVisible();
    await expect(page.getByText('Real-time Triage Map')).toBeVisible();
    await expect(page.getByText('🚨 Red Alert')).toBeVisible();
  });

  test('Navigation works between apps', async ({ page }) => {
    await page.getByRole('button', { name: 'Dispatcher Dashboard' }).click();
    await expect(page.getByText('Dispatcher Command')).toBeVisible();

    await page.getByRole('button', { name: 'Citizen App' }).click();
    await expect(page.getByText("What's the issue?")).toBeVisible();
  });
});
