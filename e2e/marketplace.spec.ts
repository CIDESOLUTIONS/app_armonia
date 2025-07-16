import { test, expect } from "@playwright/test";

const testUsers = {
  resident: {
    email: "residente.test@email.com",
    password: "Resident123!",
  },
  admin: {
    email: "admin.financiero@test.com", // Usar un admin existente para moderación
    password: "FinAdmin123!",
  },
};

const testListing = {
  title: "Bicicleta de Montaña Usada",
  description: "Bicicleta en buen estado, poco uso. Ideal para senderos.",
  price: "800000",
  category: "TECHNOLOGY", // Usar una categoría válida de MarketplaceCategory
};

const reportReason = "Contenido inapropiado o spam.";

test.describe("Marketplace Comunitario", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Debe permitir a un residente publicar un anuncio", async ({ page }) => {
    // Login como residente
    await test.step("Login como residente", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.resident.email);
      await page.fill('input[name="password"]', testUsers.resident.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|resident/);
    });

    // Navegar al Marketplace
    await test.step("Navegar al Marketplace", async () => {
      await page.locator('a:has-text("Marketplace")').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*marketplace/);
    });

    // Publicar un nuevo anuncio
    await test.step("Publicar un nuevo anuncio", async () => {
      await page.locator('button:has-text("Publicar Anuncio")').click();
      await expect(page).toHaveURL(/.*marketplace\/create/);

      await page.fill('input[name="title"]', testListing.title);
      await page.fill('textarea[name="description"]', testListing.description);
      await page.fill('input[name="price"]', testListing.price);

      // Seleccionar categoría
      await page.locator('div[role="combobox"]').click(); // Click en el SelectTrigger
      await page
        .locator(`div[role="option"]:has-text("${testListing.category}")`)
        .click();

      await page.locator('button[type="submit"]').click();

      await expect(
        page.locator("text=Anuncio publicado exitosamente."),
      ).toBeVisible();
      await expect(page).toHaveURL(/.*marketplace/);
      await expect(page.locator(`text="${testListing.title}"`)).toBeVisible();
    });
  });

  test("Debe permitir a un residente buscar y filtrar anuncios", async ({
    page,
  }) => {
    // Login como residente
    await test.step("Login como residente", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.resident.email);
      await page.fill('input[name="password"]', testUsers.resident.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|resident/);
    });

    // Navegar al Marketplace
    await test.step("Navegar al Marketplace", async () => {
      await page.locator('a:has-text("Marketplace")').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*marketplace/);
    });

    // Realizar búsqueda
    await test.step("Realizar búsqueda por palabra clave", async () => {
      await page.fill('input[placeholder="Buscar anuncios..."]', "Bicicleta");
      await page.waitForTimeout(2000); // Esperar a que se aplique el filtro
      await expect(page.locator(`text="${testListing.title}"`)).toBeVisible();
      await expect(
        page.locator("text=No se encontraron anuncios."),
      ).not.toBeVisible();
    });

    // Realizar filtro por categoría
    await test.step("Realizar filtro por categoría", async () => {
      await page.locator('input[placeholder="Buscar anuncios..."]').fill(""); // Limpiar búsqueda
      await page.locator('div[role="combobox"]').click(); // Click en el SelectTrigger
      await page
        .locator(`div[role="option"]:has-text("${testListing.category}")`)
        .click();
      await page.waitForTimeout(2000); // Esperar a que se aplique el filtro
      await expect(page.locator(`text="${testListing.title}"`)).toBeVisible();
      await expect(
        page.locator("text=No se encontraron anuncios."),
      ).not.toBeVisible();
    });
  });

  test("Debe permitir a un residente reportar un anuncio y al administrador moderarlo", async ({
    page,
  }) => {
    // Login como residente
    await test.step("Login como residente", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.resident.email);
      await page.fill('input[name="password"]', testUsers.resident.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|resident/);
    });

    // Navegar al Marketplace
    await test.step("Navegar al Marketplace", async () => {
      await page.locator('a:has-text("Marketplace")').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*marketplace/);
    });

    // Reportar un anuncio (asume que hay al menos un anuncio visible)
    await test.step("Reportar un anuncio", async () => {
      await page
        .locator('button[aria-label="Reportar Anuncio"]')
        .first()
        .click();
      await page
        .locator('textarea[placeholder="Razón del reporte..."]')
        .fill(reportReason);
      await page.locator('button:has-text("Reportar")').click();
      await expect(page.locator("text=Anuncio Reportado")).toBeVisible();
    });

    // Logout del residente
    await test.step("Logout del residente", async () => {
      await page.locator('button:has-text("Salir")').click();
      await page.waitForLoadState("networkidle");
    });

    // Login como administrador
    await test.step("Login como administrador", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.admin.email);
      await page.fill('input[name="password"]', testUsers.admin.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|admin/);
    });

    // Navegar a la moderación del Marketplace
    await test.step("Navegar a la moderación del Marketplace", async () => {
      await page.locator('a:has-text("Marketplace")').click(); // Asume que el admin tiene acceso al marketplace
      await page.locator('a:has-text("Moderación")').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*marketplace\/moderation/);
    });

    // Verificar y resolver el reporte
    await test.step("Verificar y resolver el reporte", async () => {
      await expect(page.locator(`text="${testListing.title}"`)).toBeVisible();
      await expect(page.locator(`text="${reportReason}"`)).toBeVisible();

      await page.locator('button:has-text("Rechazar")').first().click(); // O Aprobar
      await expect(
        page.locator("text=Reporte rechazado correctamente."),
      ).toBeVisible();
      await expect(
        page.locator(`text="${testListing.title}"`),
      ).not.toBeVisible(); // El anuncio reportado ya no debería estar en la lista
    });
  });
});
