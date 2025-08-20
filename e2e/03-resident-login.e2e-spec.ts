import { test, expect, Page } from '@playwright/test';

// Helper function for reliable login
async function loginAsResident(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
  
  // On portal selector page
  await expect(page).toHaveURL(/.*\/auth\/portal-selector/);
  await page.getByRole('button', { name: /Residente/i }).click();

  // On login page
  await expect(page).toHaveURL(/.*\/auth\/login\?portal=resident/);
  await page.fill('input[name="email"]', process.env.E2E_RESIDENT_EMAIL || 'resident@armonia.com');
  await page.fill('input[name="password"]', process.env.E2E_RESIDENT_PASSWORD || 'password123');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
}

test.describe('Resident Portal Login Flow', () => {
  test('should allow a resident to log in and reach the dashboard', async ({ page }) => {
    await loginAsResident(page);

    // Verify landing on the resident dashboard
    await expect(page).toHaveURL(/.*\/resident\/dashboard/);
    await expect(page.locator('h1')).toContainText('Bienvenido');
  });
});
