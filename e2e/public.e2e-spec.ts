import { test, expect, Page } from "@playwright/test";

test.describe("Public Portal E2E Tests", () => {

  // CP-100 - Registro de nuevo conjunto
  test("CP-100: should allow new complex registration", async ({ page }) => {
    await page.goto("/es/register-complex");
    const newComplexEmail = `new.complex.${Date.now()}@test.com`;
    
    // Usar selectores basados en RegisterComplexForm.tsx (react-hook-form)
    await page.fill('input[name="complexName"]', "New Public Complex E2E");
    await page.fill('input[name="address"]', "Calle Publica 123 #45-67");
    await page.fill('input[name="adminName"]', "New Public Admin E2E");
    await page.fill('input[name="email"]', newComplexEmail);
    await page.fill('input[name="password"]', "password123");
    
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard correcto
    await page.waitForURL(/.*\/es\/complex-admin/);
    await expect(page).toHaveURL(/.*\/es\/complex-admin/);
  });

  // CP-101 - Solicitud de demo
  test("CP-101: should allow demo request", async ({ page }) => {
    await page.goto("/es"); // Public landing page
    await page.waitForLoadState('networkidle');
    
    // Assuming the demo request form is part of the landing page
    await page.fill('input[name="name"]', "Demo User E2E");
    await page.fill('input[name="email"]', `demo.e2e.${Date.now()}@test.com`);
    await page.fill('textarea[name="message"]', "I want a demo for my complex.");
    
    await page.click('button:has-text("Enviar Mensaje")');
    
    // Verify confirmation message
    await expect(page.locator("text=Formulario enviado")).toBeVisible();
    await expect(page.locator("text=Gracias por contactarnos. Te responderemos pronto.")).toBeVisible();
  });
});