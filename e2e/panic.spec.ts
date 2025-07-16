import { test, expect } from "@playwright/test";

const testUsers = {
  resident: {
    email: "residente.test@email.com",
    password: "Resident123!",
  },
  reception: {
    email: "reception.test@email.com", // Asume un usuario de recepción
    password: "Reception123!",
  },
};

test.describe("Botón de Pánico", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000); // Aumentar timeout para WebSockets
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Debe permitir a un residente activar una alerta de pánico y al personal de seguridad recibirla y resolverla", async ({
    browser,
  }) => {
    const residentPage = await browser.newPage();
    const receptionPage = await browser.newPage();

    // PASO 1: Login como residente
    await test.step("Login como residente", async () => {
      await residentPage.goto("/login");
      await residentPage.fill('input[name="email"]', testUsers.resident.email);
      await residentPage.fill(
        'input[name="password"]',
        testUsers.resident.password,
      );
      await residentPage.locator('button[type="submit"]').click();
      await residentPage.waitForLoadState("networkidle");
      await expect(residentPage).toHaveURL(/.*dashboard|resident/);
    });

    // PASO 2: Login como personal de seguridad/recepción
    await test.step("Login como personal de seguridad/recepción", async () => {
      await receptionPage.goto("/login");
      await receptionPage.fill(
        'input[name="email"]',
        testUsers.reception.email,
      );
      await receptionPage.fill(
        'input[name="password"]',
        testUsers.reception.password,
      );
      await receptionPage.locator('button[type="submit"]').click();
      await receptionPage.waitForLoadState("networkidle");
      await expect(receptionPage).toHaveURL(/.*dashboard|reception/);
    });

    // PASO 3: Navegar a la página de alertas de pánico en el portal de seguridad
    await test.step("Navegar a la página de alertas de pánico", async () => {
      await receptionPage.locator('a:has-text("Alertas de Pánico")').click(); // Asume un enlace en el sidebar
      await receptionPage.waitForLoadState("networkidle");
      await expect(receptionPage).toHaveURL(/.*panic-alerts/);
    });

    // PASO 4: Residente activa el botón de pánico
    await test.step("Residente activa el botón de pánico", async () => {
      await residentPage.locator('button:has-text("Pánico")').click();
      await expect(
        residentPage.locator("text=Alerta de pánico enviada a seguridad."),
      ).toBeVisible();
    });

    // PASO 5: Personal de seguridad recibe la alerta en tiempo real
    await test.step("Personal de seguridad recibe la alerta", async () => {
      await receptionPage.waitForSelector("text=Alerta de Pánico Activa", {
        timeout: 15000,
      }); // Esperar a que aparezca la alerta
      await expect(
        receptionPage.locator("text=Alerta de Pánico Activa"),
      ).toBeVisible();
      await expect(
        receptionPage.locator("text=Ubicación del residente"),
      ).toBeVisible(); // Verificar detalles
    });

    // PASO 6: Personal de seguridad resuelve la alerta
    await test.step("Personal de seguridad resuelve la alerta", async () => {
      await receptionPage
        .locator('button:has-text("Resolver")')
        .first()
        .click();
      await expect(
        receptionPage.locator("text=Alerta resuelta correctamente."),
      ).toBeVisible();
      await expect(
        receptionPage.locator("text=No hay alertas de pánico activas."),
      ).toBeVisible();
    });
  });
});
