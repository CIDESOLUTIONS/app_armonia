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

test.describe("Extended Coverage E2E Tests", () => {
  const adminEmail =
    process.env.E2E_ADMIN_EMAIL || `admin.e2e.${Date.now()}@test.com`;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD || "password123";
  const residentEmail =
    process.env.E2E_RESIDENT_EMAIL || `resident.e2e.${Date.now()}@test.com`;
  const residentPassword = process.env.E2E_RESIDENT_PASSWORD || "password123";

  // CP-212: Gestión del presupuesto anual
  test("CP-212: should manage annual budget", async ({ page }) => {
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/finances/budget");
    await page.waitForLoadState("networkidle");

    // Create a new budget
    await page.click('button:has-text("Crear Presupuesto")');
    await page.fill('input[name="year"]', new Date().getFullYear().toString());
    await page.fill('input[name="totalAmount"]', "500000");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Presupuesto creado con éxito"),
    ).toBeVisible();

    // Add a budget item
    await page.click('button:has-text("Añadir Partida")');
    await page.fill('input[name="name"]', "Mantenimiento Piscina");
    await page.fill('input[name="amount"]', "25000");
    await page.click('button:has-text("Añadir")');
    await expect(page.locator("text=Partida añadida")).toBeVisible();

    // Verify budget tracking
    await expect(page.locator(".budget-progress-bar")).toBeVisible();
  });

  // CP-218: Creación y análisis de encuestas
  test("CP-218: should create and analyze surveys", async ({ page }) => {
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/communications/surveys");
    await page.waitForLoadState("networkidle");

    // Create a new survey
    await page.click('button:has-text("Crear Encuesta")');
    await page.fill('input[name="title"]', "Encuesta de Satisfacción E2E");
    await page.fill(
      'textarea[name="description"]',
      "Opine sobre nuestros servicios.",
    );
    await page.fill('input[name="endDate"]', "2025-12-31");
    // Add a question
    await page.click('button:has-text("Añadir Pregunta")');
    await page.fill(
      'input[name="questions.0.text"]',
      "¿Qué tan satisfecho está con la limpieza?",
    );
    await page.click('button:has-text("Guardar Encuesta")');
    await expect(page.locator("text=Encuesta creada con éxito")).toBeVisible();

    // (A resident would need to answer the survey here)

    // Check for results (assuming some data exists or is mocked)
    await page.click("text=Encuesta de Satisfacción E2E");
    await expect(page.locator("h2:has-text('Resultados')")).toBeVisible();
    await expect(page.locator(".chart-container")).toBeVisible();
  });

  // CP-219: Gestión de repositorio de documentos
  test("CP-219: should manage document repository", async ({ page }) => {
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/communications/documents");
    await page.waitForLoadState("networkidle");

    // Upload a document
    await page.click('button:has-text("Subir Documento")');
    await page.fill('input[name="title"]', "Reglamento Interno E2E");
    await page.setInputFiles('input[type="file"]', {
      name: "reglamento.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from(
        "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000059 00000 n\n0000000112 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n162\n%%EOF",
      ),
    });
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Documento subido con éxito")).toBeVisible();

    // Verify document is in the list
    await expect(page.locator("text=Reglamento Interno E2E")).toBeVisible();
  });

  // CP-220 & CP-309 cross-test: Marketplace Moderation
  test("CP-220: should moderate reported marketplace ads", async ({ page }) => {
    // 1. Resident creates and reports an ad
    await login(page, residentEmail, residentPassword, "resident");
    await page.goto("/es/resident/marketplace/create");
    const adTitle = `Artículo para Moderar E2E ${Date.now()}`;
    await page.fill('input[name="title"]', adTitle);
    await page.fill(
      'textarea[name="description"]',
      "Contenido para ser revisado por admin.",
    );
    await page.fill('input[name="price"]', "99");
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[role="option"]').first().click();
    await page.click('button:has-text("Publicar Anuncio")');
    await page.goto("/es/resident/marketplace");
    await page.locator(`text=${adTitle}`).first().click();
    page.on("dialog", (dialog) => dialog.accept());
    await page.locator('button:has-text("Reportar Anuncio")').click();
    await expect(page.locator("text=Anuncio Reportado")).toBeVisible();

    // 2. Admin logs in and sees the reported ad
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/marketplace/moderation");
    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${adTitle}`)).toBeVisible();

    // 3. Admin takes action (e.g., remove ad)
    await page
      .locator(`tr:has-text("${adTitle}") button:has-text("Eliminar")`)
      .click();
    page.on("dialog", (dialog) => dialog.accept());
    await expect(page.locator("text=Anuncio eliminado")).toBeVisible();
    await expect(page.locator(`text=${adTitle}`)).not.toBeVisible();
  });

  // CP-310: Resident creates and tracks PQR
  test("CP-310: should allow resident to create and track PQR", async ({
    page,
  }) => {
    // 1. Resident creates a PQR
    await login(page, residentEmail, residentPassword, "resident");
    await page.goto("/es/resident/pqr/create");
    const pqrSubject = `Mi PQR E2E ${Date.now()}`;
    await page.fill('input[name="subject"]', pqrSubject);
    await page.fill(
      'textarea[name="description"]',
      "Esta es una PQR de prueba desde el portal de residente.",
    );
    await page.locator('div[role="combobox"]').first().click(); // Category
    await page.locator('div[role="option"]').first().click();
    await page.click('button:has-text("Enviar PQR")');
    await expect(page.locator("text=PQR enviada con éxito")).toBeVisible();

    // 2. Admin logs in and updates the PQR status
    await login(page, adminEmail, adminPassword, "admin");
    await page.goto("/es/complex-admin/pqr");
    await page
      .locator(`tr:has-text("${pqrSubject}") button:has-text("Ver")`)
      .click();
    await page.selectOption('select[name="status"]', { label: "En Progreso" });
    await page.click('button:has-text("Actualizar Estado")');
    await expect(page.locator("text=Estado actualizado")).toBeVisible();

    // 3. Resident logs back in and sees the updated status
    await login(page, residentEmail, residentPassword, "resident");
    await page.goto("/es/resident/pqr");
    await expect(
      page.locator(`tr:has-text("${pqrSubject}") td:has-text("En Progreso")`),
    ).toBeVisible();
  });
});
