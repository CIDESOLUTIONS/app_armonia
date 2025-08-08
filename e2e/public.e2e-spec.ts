import { test, expect, Page } from "@playwright/test";

test.describe("Public Portal E2E Tests", () => {
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