import { test, expect, Page } from "@playwright/test";

// Helper function for reliable login
async function login(
  page: Page,
  email: string,
  password: string,
  portal: "admin" | "resident",
) {
  // 1. Go to homepage
  await page.goto("/es");

  // 2. Click the main login button in the header
  await page.locator('header >> a:has-text("Login")').click();

  // 3. Assert we are on the portal selector page
  await expect(page).toHaveURL(/.*\/portal-selector/);

  // 4. Click the card corresponding to the correct portal
  if (portal === "admin") {
    await page.locator('button:has-text("Acceder como Administrador")').click();
  } else if (portal === "resident") {
    await page.locator('button:has-text("Acceder como Residente")').click();
  }

  // 5. Assert we are on the final login page
  await expect(page).toHaveURL(new RegExp(`.*\/login\?portal=${portal}`));

  // 6. Fill form and submit
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // 7. Wait for navigation to complete and check for correct portal URLs
  if (portal === "admin") {
    await expect(page).toHaveURL(/.*\/complex-admin/);
  } else if (portal === "resident") {
    await expect(page).toHaveURL(/.*\/resident/);
  }
}

test.describe("Virtual Assembly E2E Tests (CP-601)", () => {
  const adminEmail =
    process.env.E2E_ADMIN_EMAIL || `admin.e2e.${Date.now()}@test.com`;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD || "password123";
  const residentEmail =
    process.env.E2E_RESIDENT_EMAIL || `resident.e2e.${Date.now()}@test.com`;
  const residentPassword = process.env.E2E_RESIDENT_PASSWORD || "password123";

  test("should manage the full lifecycle of a virtual assembly", async ({
    page,
  }) => {
    // 1. Admin creates the assembly
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/assembly");
    await page.click('button:has-text("Crear Asamblea")');
    await page.fill('input[name="title"]', "Asamblea General Ordinaria E2E");
    await page.fill(
      'textarea[name="description"]',
      "Asamblea de prueba para E2E.",
    );
    await page.fill('input[name="date"]', "2025-12-31T19:00");
    await page.click('button:has-text("Crear")');
    await expect(page.locator("text=Asamblea creada con éxito")).toBeVisible();

    // 2. Admin starts the assembly and verifies quorum
    await page.click('button:has-text("Iniciar Asamblea")');
    await expect(page.locator("text=Asamblea en curso")).toBeVisible();
    // (Add logic to check quorum calculation if possible)

    // 3. Admin creates a votation
    await page.click('button:has-text("Nueva Votación")');
    await page.fill('input[name="question"]', "¿Aprueba el presupuesto 2026?");
    await page.selectOption('select[name="type"]', "WEIGHTED"); // Ponderada
    await page.click('button:has-text("Crear Votación")');
    await expect(page.locator("text=Votación creada")).toBeVisible();

    // 4. Resident logs in and votes
    await login(page, residentEmail, residentPassword, "resident");
    await page.goto("/es/resident/assembly");
    await page.click('button:has-text("Votar")');
    await page.click('button:has-text("A favor")');
    await expect(page.locator("text=Voto registrado")).toBeVisible();

    // 5. Admin closes the votation and checks results
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/assembly");
    await page.click('button:has-text("Cerrar Votación")');
    await expect(page.locator("text=Votación cerrada")).toBeVisible();
    await expect(page.locator(".votation-results")).toContainText("Resultados");

    // 6. Admin ends the assembly and generates the minutes (acta)
    await page.click('button:has-text("Finalizar Asamblea")');
    await expect(page.locator("text=Asamblea finalizada")).toBeVisible();
    await page.click('button:has-text("Generar Acta")');
    await expect(page.locator("text=Acta generada")).toBeVisible();
  });
});
