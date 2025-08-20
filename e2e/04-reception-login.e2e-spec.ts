import { test, expect, Page } from '@playwright/test';

// Helper function for reliable login
async function loginAsReception(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
  
  // On portal selector page
  await expect(page).toHaveURL(/.*\/auth\/portal-selector/);
  await page.getByRole('button', { name: /Portería/i }).click();

  // On login page
  await expect(page).toHaveURL(/.*\/auth\/login\?portal=reception/);
  await page.fill('input[name="email"]', process.env.E2E_RECEPTION_EMAIL || 'reception@armonia.com');
  await page.fill('input[name="password"]', process.env.E2E_RECEPTION_PASSWORD || 'password123');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
}

test.describe('Reception Portal Login Flow', () => {
  test('should allow reception staff to log in and reach the dashboard', async ({ page }) => {
    await loginAsReception(page);

    // Verify landing on the reception dashboard
    await expect(page).toHaveURL(/.*\/reception\/dashboard/);
    await expect(page.locator('h1')).toContainText('Bitácora de Novedades');
  });
});
