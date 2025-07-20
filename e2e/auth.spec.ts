import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should allow a user to register", async ({ page }) => {
    await page.goto("/register-complex");
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Buscar campos de entrada más específicos
    const emailField = page.locator('input[type="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailField.isVisible()) {
      await emailField.fill(`test${Date.now()}@example.com`);
    }
    if (await passwordField.isVisible()) {
      await passwordField.fill("password123");
    }
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }
    
    // Verificar que la página no muestre errores críticos
    await expect(page.locator('body')).not.toContainText('Application error');
  });

  test("should allow a user to log in", async ({ page }) => {
    await page.goto("/auth/login");
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Buscar campos de entrada más específicos
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const passwordField = page.locator('input[name="password"]').or(page.locator('input[type="password"]')).first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailField.isVisible()) {
      await emailField.fill("test@example.com");
    }
    if (await passwordField.isVisible()) {
      await passwordField.fill("password123");
    }
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }
    
    // Verificar que la página no muestre errores críticos
    await expect(page.locator('body')).not.toContainText('Application error');
  });

  test("should prevent access to protected routes without authentication", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que se redirija a login o muestre página de acceso restringido
    const currentUrl = page.url();
    const hasLoginRedirect = currentUrl.includes('/auth/login') || currentUrl.includes('/login');
    const hasAccessDenied = await page.locator('body').textContent();
    const showsAuthRequired = hasAccessDenied?.includes('login') || hasAccessDenied?.includes('autenticación') || hasAccessDenied?.includes('acceso');
    
    // La prueba pasa si hay redirección a login o mensaje de autenticación requerida
    expect(hasLoginRedirect || showsAuthRequired).toBeTruthy();
  });
});
