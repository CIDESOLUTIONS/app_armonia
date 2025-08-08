import { test, expect, Page } from "@playwright/test";

// Helper function for reliable login
async function login(page: Page, email: string, password: string, portal: 'admin' | 'resident' | 'reception') {
  await page.goto(`/es/login?portal=${portal}`);
  
  // Usar selectores basados en el código real del formulario de login (react-hook-form)
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete and check for correct portal URLs
  if (portal === 'admin') {
    await expect(page).toHaveURL(/.*\/es\/complex-admin/);
  } else if (portal === 'resident') {
    await expect(page).toHaveURL(/.*\/es\/resident/);
  } else if (portal === 'reception') {
    await expect(page).toHaveURL(/.*\/es\/reception/);
  }
}

test.describe("Reception Portal E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    const receptionEmail = process.env.E2E_RECEPTION_EMAIL || `reception.e2e.${Date.now()}@test.com`;
    const receptionPassword = process.env.E2E_RECEPTION_PASSWORD || "password123";
    await login(page, receptionEmail, receptionPassword, 'reception');
  });

  // CP-400 - Login personal de seguridad
  test("CP-400: should allow reception login", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/es\/reception/);
    await expect(page.locator("h1, h2")).toContainText(["Dashboard", "Recepción", "Bienvenido"]);
  });

  // CP-401 - Registro entrada de visitante con QR
  test("CP-401: should register visitor entry with QR", async ({ page }) => {
    await page.goto("/es/reception/visitors");
    await page.waitForLoadState('networkidle');
    
    // Simulate QR code input (e.g., a pre-registered visitor's QR data)
    await page.fill('input[placeholder="Escanear o introducir código QR"]', "dummy_qr_data_for_preregistered_visitor");
    await page.click('button:has-text("Escanear QR")');
    
    // Verify success message and scan result display
    await expect(page.locator("text=QR Code escaneado con éxito.")).toBeVisible();
    await expect(page.locator("text=Resultado del Escaneo:")).toBeVisible();
  });

  // CP-402 - Registro manual de visitantes
  test("CP-402: should register visitor manually", async ({ page }) => {
    await page.goto("/es/reception/visitors");
    await page.waitForLoadState('networkidle');
    await page.locator('button:has-text("Registrar Nuevo Visitante")').click();
    
    await page.fill('input[name="name"]', "Manual Visitor E2E");
    await page.locator('div[role="combobox"]').first().click(); // Click on documentType select
    await page.locator('div[role="option"]:has-text("Cédula de Ciudadanía")').click(); // Select CC
    await page.fill('input[name="documentNumber"]', "987654321");
    await page.fill('input[name="unitId"]', "101");
    
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    await page.fill('input[name="entryTime"]', `${year}-${month}-${day}T${hours}:${minutes}`);
    
    await page.click('button:has-text("Registrar Ingreso")');
    await expect(page.locator("text=Visitante registrado exitosamente.")).toBeVisible();
  });

  // CP-403 - Registro y notificación de paquetería
  test("CP-403: should register package and notify resident", async ({ page }) => {
    await page.goto("/es/reception/visitors"); // Packages are on the same page as visitors
    await page.waitForLoadState('networkidle');
    
    await page.locator('button:has-text("Registrar Paquete")').click(); // Click the button in the package section
    await page.fill('input[name="trackingNumber"]', "PKG-E2E-123");
    await page.fill('input[name="recipientUnit"]', "Apto 101");
    await page.fill('input[name="sender"]', "Amazon E2E");
    await page.fill('input[name="description"]', "Paquete de prueba para E2E.");
    
    await page.click('button:has-text("Registrar Paquete")'); // Submit button for package form
    await expect(page.locator("text=Paquete registrado exitosamente.")).toBeVisible();
  });

  // CP-404 - Bitácora de novedades
  test("CP-404: should log new incident", async ({ page }) => {
    await page.goto("/es/reception/incidents");
    await page.waitForLoadState('networkidle');
    
    await page.locator('button:has-text("Registrar Nuevo Incidente")').click();
    await page.fill('input[name="title"]', "Incidente de Prueba E2E");
    
    await page.locator('div[role="combobox"]').first().click(); // Click on category select
    await page.locator('div[role="option"]:has-text("Seguridad")').click(); // Select Seguridad

    await page.locator('div[role="combobox"]').nth(1).click(); // Click on priority select
    await page.locator('div[role="option"]:has-text("Media")').click(); // Select Media

    await page.fill('input[name="location"]', "Entrada Principal");
    await page.fill('input[name="reportedBy"]', "Guardia E2E");
    await page.fill('textarea[name="description"]', "Descripción del incidente de prueba E2E.");
    
    await page.click('button:has-text("Registrar Incidente")');
    await expect(page.locator("text=Incidente registrado exitosamente.")).toBeVisible();
  });

  // CP-405 - Activación y respuesta al botón de pánico
  test("CP-405: should receive and respond to panic alert", async ({ page }) => {
    await page.goto("/es/reception/panic-alerts");
    await page.waitForLoadState('networkidle');
    
    // Precondition: A panic alert must exist in the system for this test to pass.
    // In a real E2E setup, you would trigger this via an API call or a resident test.
    // For now, we assume an alert is visible.
    await expect(page.locator("text=Alertas de Pánico Activas")).toBeVisible();
    
    // Click the 'Resolver' button for the first alert
    await page.locator('button:has-text("Resolver")').first().click();
    await expect(page.locator("text=Alerta resuelta correctamente.")).toBeVisible();
  });
});