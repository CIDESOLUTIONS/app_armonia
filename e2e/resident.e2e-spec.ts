import { test, expect, Page } from "@playwright/test";

// Helper function for reliable login
async function login(
  page: Page,
  email: string,
  password: string,
  portal: "admin" | "resident" | "reception",
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
  } else if (portal === "reception") {
    await page.locator('button:has-text("Acceder como Recepción")').click();
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
  } else if (portal === "reception") {
    await expect(page).toHaveURL(/.*\/reception/);
  }
}

test.describe("Resident Portal E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    const residentEmail =
      process.env.E2E_RESIDENT_EMAIL || `resident.e2e.${Date.now()}@test.com`;
    const residentPassword = process.env.E2E_RESIDENT_PASSWORD || "password123";
    await login(page, residentEmail, residentPassword, "resident");
  });

  // CP-300 - Login residente
  test("CP-300: should allow resident login", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/es\/resident/);
    await expect(page.locator("h1, h2")).toContainText([
      "Dashboard",
      "Residente",
      "Bienvenido",
    ]);
  });

  // CP-301 - Visualización de comunicados
  test("CP-301: should display announcements", async ({ page }) => {
    await page.goto("/es/resident/communications/resident-announcements");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Mis Comunicados");
    // Assuming there's at least one announcement visible in the table body
    await expect(page.locator("table > tbody > tr").first()).toBeVisible();
  });

  // CP-302 - Realizar pago en línea
  test("CP-302: should simulate online payment and verify status", async ({
    page,
  }) => {
    await page.goto("/es/resident/my-finances/fees");
    await page.waitForLoadState("networkidle");

    // Assume there's a pending fee to pay
    const feeToPay = page.locator('tr:has-text("Pendiente")').first();
    await feeToPay.locator('button:has-text("Pagar")').click();

    // In the payment modal/page
    await expect(page.locator("h2:has-text('Confirmar Pago')")).toBeVisible();
    await page.click('button:has-text("Confirmar y Pagar")'); // This would trigger the mock payment gateway

    // Check for success message and updated status
    await expect(
      page.locator("text=Pago procesado exitosamente"),
    ).toBeVisible();
    await expect(feeToPay.locator("text=Pagada")).toBeVisible();
  });

  // CP-303 - Reserva de amenidad
  test("CP-303: should allow amenity reservation", async ({ page }) => {
    await page.goto("/es/resident/my-reservations");
    await page.waitForLoadState("networkidle");
    await page.locator('button:has-text("Crear Nueva Reserva")').click();

    // Select common area (assuming there's at least one available)
    await page.locator('div[role="combobox"]').first().click(); // Click on the SelectTrigger for commonAreaId
    await page.locator('div[role="option"]').first().click(); // Select the first available option

    await page.fill('input[name="title"]', "Reserva de Piscina E2E");
    await page.fill(
      'textarea[name="description"]',
      "Reserva para pruebas E2E.",
    );

    // Set start and end date/time
    const now = new Date();
    const startDateTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endDateTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    const formatDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    await page.fill(
      'input[name="startDateTime"]',
      formatDateTime(startDateTime),
    );
    await page.fill('input[name="endDateTime"]', formatDateTime(endDateTime));
    await page.fill('input[name="attendees"]', "2");

    await page.click('button:has-text("Crear Reserva")');
    await expect(page.locator("text=Reserva creada con éxito")).toBeVisible();
  });

  // CP-304 - Preregistro de visitante y generación de QR
  test("CP-304: should allow visitor pre-registration and QR generation", async ({
    page,
  }) => {
    await page.goto("/es/resident/visitors/pre-register");
    await page.waitForLoadState("networkidle");

    await page.fill('input[name="name"]', "Visitante E2E");
    await page.fill('input[name="documentType"]', "CC");
    await page.fill('input[name="documentNumber"]', "123456789");

    // Set dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    await page.fill('input[name="expectedDate"]', formatDate(tomorrow));
    await page.fill('input[name="validFrom"]', formatDate(tomorrow));
    await page.fill('input[name="validUntil"]', formatDate(dayAfterTomorrow));

    await page.fill('input[name="purpose"]', "Visita de prueba E2E");

    await page.click('button:has-text("Pre-registrar Visitante")');
    await expect(
      page.locator(
        "text=Visitante pre-registrado correctamente. Código QR generado.",
      ),
    ).toBeVisible();
    await expect(
      page.locator('img[alt="Código QR del visitante"]'),
    ).toBeVisible();
  });

  // CP-305 - Botón de pánico (registro y notificación)
  test("CP-305: should trigger panic button and register alert", async ({
    page,
  }) => {
    await page.goto("/es/resident/dashboard"); // Assuming panic button is on dashboard
    // Click the panic button
    await page.locator('button:has-text("Botón de Pánico")').click();
    // Confirm the alert dialog
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        "¿Estás seguro de que quieres activar la alerta de pánico?",
      );
      await dialog.accept();
    });
    // Verify success toast message
    await expect(page.locator("text=Alerta de Pánico Activada")).toBeVisible();
    await expect(
      page.locator("text=El personal de seguridad ha sido notificado."),
    ).toBeVisible();
  });

  // CP-306 - Gestión de presupuesto familiar
  test("CP-306: should manage family budget", async ({ page }) => {
    await page.goto("/es/resident/financial/family-budget");
    await page.waitForLoadState("networkidle");

    // Add Income
    await page.locator('button:has-text("Añadir Entrada")').click();
    await page.fill('input[name="description"]', "Salario");
    await page.fill('input[name="amount"]', "1000");
    await page.locator('div[role="combobox"]').first().click(); // Click on the SelectTrigger for Type
    await page.locator('div[role="option"]:has-text("Ingreso")').click(); // Select Income
    await page.fill('input[name="category"]', "Trabajo");
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    await page.fill('input[name="date"]', `${year}-${month}-${day}`);
    await page.click('button:has-text("Añadir Entrada")');
    await expect(
      page.locator("text=Entrada de presupuesto creada correctamente."),
    ).toBeVisible();

    // Add Expense
    await page.locator('button:has-text("Añadir Entrada")').click();
    await page.fill('input[name="description"]', "Alquiler");
    await page.fill('input[name="amount"]', "500");
    await page.locator('div[role="combobox"]').first().click(); // Click on the SelectTrigger for Type
    await page.locator('div[role="option"]:has-text("Gasto")').click(); // Select Expense
    await page.fill('input[name="category"]', "Vivienda");
    await page.fill('input[name="date"]', `${year}-${month}-${day}`);
    await page.click('button:has-text("Añadir Entrada")');
    await expect(
      page.locator("text=Entrada de presupuesto creada correctamente."),
    ).toBeVisible();

    // Verify budget report
    await page.click('button:has-text("Ver Reporte")');
    await expect(
      page.locator("h2:has-text('Reporte de Presupuesto')"),
    ).toBeVisible();
  });

  // CP-307 - Publicación de anuncio en marketplace
  test("CP-307: should allow marketplace ad posting", async ({ page }) => {
    await page.goto("/es/resident/marketplace/create");
    await page.waitForLoadState("networkidle");

    await page.fill('input[name="title"]', "Artículo en Venta E2E");
    await page.fill(
      'textarea[name="description"]',
      "Vendo artículo en buen estado para pruebas E2E.",
    );
    await page.fill('input[name="price"]', "50");

    // Select category (assuming categories are loaded)
    await page.locator('div[role="combobox"]').first().click(); // Click on the SelectTrigger for category
    await page.locator('div[role="option"]').first().click(); // Select the first available category

    // Simulate image upload (create a dummy file)
    await page.setInputFiles('input[type="file"]', {
      name: "test-image.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "base64",
      ),
    });

    await page.click('button:has-text("Publicar Anuncio")');
    await expect(
      page.locator("text=Anuncio publicado correctamente."),
    ).toBeVisible();
  });

  // CP-308 - Envío de mensaje interno (marketplace)
  test("CP-308: should allow internal message in marketplace", async ({
    page,
  }) => {
    // First, create an ad to message
    await page.goto("/es/resident/marketplace/create");
    await page.fill('input[name="title"]', "Artículo para Mensaje E2E");
    await page.fill(
      'textarea[name="description"]',
      "Descripción para mensaje.",
    );
    await page.fill('input[name="price"]', "10");
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[role="option"]').first().click();
    await page.click('button:has-text("Publicar Anuncio")');
    await expect(
      page.locator("text=Anuncio publicado correctamente."),
    ).toBeVisible();

    // Now, go to the marketplace and message the ad
    await page.goto("/es/resident/marketplace");
    await page.locator("text=Artículo para Mensaje E2E").first().click();
    await page.locator('button:has-text("Contactar Vendedor")').click();

    // Verify redirection to chat page
    await expect(page).toHaveURL(/.*\/es\/resident\/marketplace\/chat\/.+/);

    // Interact with the chat form
    await page.fill(
      'input[placeholder="Escribe tu mensaje..."]',
      "Hola, estoy interesado en tu artículo.",
    );
    await page.locator('button:has(svg[data-lucide="send"])').click();
    await expect(page.locator("text=Mensaje enviado")).toBeVisible();
  });

  // CP-309 - Reporte de contenido (moderación)
  test("CP-309: should allow content reporting", async ({ page }) => {
    // First, create an ad to report
    await page.goto("/es/resident/marketplace/create");
    await page.fill('input[name="title"]', "Artículo para Reportar E2E");
    await page.fill(
      'textarea[name="description"]',
      "Descripción para reporte.",
    );
    await page.fill('input[name="price"]', "20");
    await page.locator('div[role="combobox"]').first().click();
    await page.locator('div[role="option"]').first().click();
    await page.click('button:has-text("Publicar Anuncio")');
    await expect(
      page.locator("text=Anuncio publicado correctamente."),
    ).toBeVisible();

    // Now, go to the marketplace and report the ad
    await page.goto("/es/resident/marketplace");
    await page.locator("text=Artículo para Reportar E2E").first().click();

    await page.locator('button:has-text("Reportar Anuncio")').click();
    // Confirm the alert dialog
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        "¿Estás seguro de que quieres activar la alerta de pánico?",
      );
      await dialog.accept();
    });
    await expect(page.locator("text=Anuncio Reportado")).toBeVisible();
    await expect(
      page.locator("text=Gracias por tu reporte. Lo revisaremos pronto."),
    ).toBeVisible();
  });
});
