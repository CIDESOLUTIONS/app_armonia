import { test, expect } from '@playwright/test';

test.describe('Landing Page and Signup Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main sections and call-to-action buttons', async ({ page }) => {
    // Check for the main title
    await expect(page.locator('h1')).toContainText('Armonía');

    // Check for the subtitle
    await expect(page.locator('p.lead')).toBeVisible();

    // Verify that the main CTA buttons are present
    await expect(page.getByRole('button', { name: /Registrar Conjunto/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible();
  });

  test('should navigate to the signup page when the signup button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Registrar Conjunto/i }).click();

    // Verify that the URL is now the signup page
    await expect(page).toHaveURL('/auth/signup');

    // Verify that a key element of the signup form is visible
    await expect(page.locator('h2')).toContainText('Crea una cuenta para tu conjunto');
  });
});
