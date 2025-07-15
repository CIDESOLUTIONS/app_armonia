import { test, expect } from "@playwright/test";

const testUsers = {
  admin: {
    email: "admin.app@test.com", // Asume un usuario admin global
    password: "Admin123!",
  },
};

test.describe("Portal Empresarial", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Debe mostrar el dashboard del portafolio para un administrador global", async ({ page }) => {
    // Login como administrador global
    await test.step("Login como administrador global", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.admin.email);
      await page.fill('input[name="password"]', testUsers.admin.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|admin/);
    });

    // Navegar al Portal Empresarial
    await test.step("Navegar al Portal Empresarial", async () => {
      // Asume que hay un enlace en el sidebar o un acceso directo
      const portfolioLink = page.locator('a:has-text("Portafolio")').first();
      await expect(portfolioLink).toBeVisible({ timeout: 10000 });
      await portfolioLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*portfolio/);
    });

    // Verificar que se muestran las métricas del portafolio
    await test.step("Verificar métricas del portafolio", async () => {
      await expect(page.locator('h2:has-text("Dashboard Armonía Portafolio")')).toBeVisible();
      await expect(page.locator('text=Ingresos Totales Portafolio')).toBeVisible();
      await expect(page.locator('text=Total Conjuntos')).toBeVisible();
      await expect(page.locator('text=Total Residentes')).toBeVisible();
      await expect(page.locator('text=Cuotas Pendientes Portafolio')).toBeVisible();
    });

    // Verificar que se muestran las métricas por conjunto (al menos una)
    await test.step("Verificar métricas por conjunto", async () => {
      await expect(page.locator('h3:has-text("Métricas por Conjunto")')).toBeVisible();
      // Asume que al menos un conjunto se muestra
      await expect(page.locator('.Métricas por Conjunto card').first()).toBeVisible();
    });
  });
});
