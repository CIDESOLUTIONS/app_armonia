import { test, expect, Page } from "@playwright/test";

// Helper function for reliable login
async function login(page: Page, email: string, password: string) {
  // 1. Go to homepage
  await page.goto("/es");

  // 2. Click the main login button in the header
  await page.locator('header >> a:has-text("Login")').click();

  // 3. Assert we are on the portal selector page
  await expect(page).toHaveURL(/.*\/portal-selector/);

  // 4. Click the card corresponding to the portfolio portal
  await page
    .locator('button:has-text("Acceder como Gestor de Portafolio")')
    .click();

  // 5. Assert we are on the final login page
  await expect(page).toHaveURL(new RegExp(`.*\/login\?portal=portfolio`));

  // 6. Fill form and submit
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // 7. Wait for navigation to complete and check for correct portal URL
  await expect(page).toHaveURL(/.*\/portfolio/);
}

test.describe("Portfolio Portal E2E Tests (CP-5xx)", () => {
  const portfolioAdminEmail =
    process.env.E2E_PORTFOLIO_EMAIL || `portfolio.e2e.${Date.now()}@test.com`;
  const portfolioAdminPassword =
    process.env.E2E_PORTFOLIO_PASSWORD || "password123";

  test.beforeEach(async ({ page }) => {
    await login(page, portfolioAdminEmail, portfolioAdminPassword);
  });

  // CP-500 - Login empresa administradora
  test("CP-500: should allow portfolio admin login", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Dashboard Consolidado");
  });

  // CP-501 - Visualización de múltiples conjuntos
  test("CP-501: should display KPIs for multiple complexes", async ({
    page,
  }) => {
    // Check for consolidated KPIs
    await expect(page.locator("text=Cartera Total")).toBeVisible();
    await expect(page.locator("text=PQR Abiertos")).toBeVisible();
    // Check for a list/table of complexes
    await expect(page.locator(".complex-list-item").first()).toBeVisible();
  });

  // CP-502 - Navegación entre conjuntos sin relogin
  test("CP-502: should switch between complexes without re-login", async ({
    page,
  }) => {
    const firstComplexName = await page
      .locator(".complex-list-item a")
      .first()
      .textContent();
    await page.locator(".complex-list-item a").first().click();
    // Should navigate to the specific complex admin dashboard
    await expect(page).toHaveURL(/.*\/es\/complex-admin/);
    await expect(page.locator("h1")).toContainText(firstComplexName || "");

    // Go back and switch to another complex
    await page.goBack();
    await expect(page).toHaveURL(/.*\/es\/portfolio/);
    const secondComplexName = await page
      .locator(".complex-list-item a")
      .nth(1)
      .textContent();
    await page.locator(".complex-list-item a").nth(1).click();
    await expect(page).toHaveURL(/.*\/es\/complex-admin/);
    await expect(page.locator("h1")).toContainText(secondComplexName || "");
  });

  // CP-503 - Informes financieros consolidados
  test("CP-503: should generate consolidated financial reports", async ({
    page,
  }) => {
    await page.goto("/es/portfolio/reports");
    await page.selectOption('select[name="reportType"]', "GLOBAL_DEBT_STATUS");
    await page.click('button:has-text("Generar Reporte Consolidado")');
    await expect(
      page.locator("text=Reporte consolidado generado"),
    ).toBeVisible();
    // (Add assertion to check for download if applicable)
  });

  // CP-504 - Personalización de marca
  test("CP-504: should display custom branding", async ({ page }) => {
    // Assuming the brand logo is in the header with a specific data-testid
    await expect(
      page.locator("[data-testid=portfolio-brand-logo]"),
    ).toBeVisible();
  });
});
