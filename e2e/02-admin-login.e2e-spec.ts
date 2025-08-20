import { test, expect, Page } from '@playwright/test';

// Helper function for reliable login
async function loginAsAdmin(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
  
  // On portal selector page
  await expect(page).toHaveURL(/.*\/auth\/portal-selector/);
  await page.getByRole('button', { name: /Administrador/i }).click();

  // On login page
  await expect(page).toHaveURL(/.*\/auth\/login\?portal=admin/);
  await page.fill('input[name="email"]', process.env.E2E_ADMIN_EMAIL || 'admin@armonia.com');
  await page.fill('input[name="password"]', process.env.E2E_ADMIN_PASSWORD || 'password123');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
}

test.describe('Admin Portal Login Flow', () => {
  test('should allow an administrator to log in and reach the dashboard', async ({ page }) => {
    await loginAsAdmin(page);

    // Verify landing on the admin dashboard
    await expect(page).toHaveURL(/.*\/complex-admin\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
