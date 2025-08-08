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

test.describe("Armonía Application E2E Tests", () => {
  // Use beforeEach to ensure login for tests that require it
  test.beforeEach(async ({ page }) => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL || `admin.e2e.${Date.now()}@test.com`;
    const adminPassword = process.env.E2E_ADMIN_PASSWORD || "password123";

    // Login as admin for most tests
    await login(page, adminEmail, adminPassword, 'admin');
  });

  // CP-100 - Registro de nuevo conjunto
  test("CP-100: should allow new complex registration and show success message", async ({ page }) => {
    const newComplexEmail = `new.complex.${Date.now()}@test.com`;
    await page.goto("/es/register-complex");
    
    // Usar selectores basados en RegisterComplexForm.tsx (react-hook-form)
    await page.fill('input[name="complexName"]', "New Complex E2E");
    await page.fill('input[name="adminName"]', "New Admin E2E");
    await page.fill('input[name="email"]', newComplexEmail);
    await page.fill('input[name="phone"]', "1234567890"); // Added phone field
    
    await page.click('button[type="submit"]');
    
    // Verify success toast message (functional discrepancy with spec: no direct redirection)
    await expect(page.locator("text=¡Registro Exitoso!")).toBeVisible();
    await expect(page.locator("text=Hemos recibido tu solicitud.")).toBeVisible();
  });

  // CP-101 - Solicitud de demo
  test("CP-101: should allow demo request", async ({ page }) => {
    await page.goto("/es"); // Portal público
    
    // Buscar formulario de demo en la landing page
    await page.fill('input[name="name"]', "Demo User E2E");
    await page.fill('input[name="email"]', `demo.e2e.${Date.now()}@test.com`);
    await page.fill('textarea[name="message"]', "I want a demo for my complex.");
    
    // Buscar botón de envío (puede estar internacionalizado)
    await page.click('button:has-text("Enviar"), button:has-text("Send"), button[type="submit"]');
    
    // Verificar confirmación
    await expect(page.locator("text=enviado, text=sent, text=success")).toBeVisible();
  });

  // CP-200 - Login administrador
  test("CP-200: should allow admin login", async ({ page }) => {
    // El beforeEach ya maneja el login, solo verificar URL
    await expect(page).toHaveURL(/.*\/es\/complex-admin/);
  });

  // CP-201 - Gestión de inmuebles (CRUD)
  test("CP-201: should manage properties (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/properties");
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Add property
    await page.click('button:has-text("Añadir Inmueble")'); // Corrected selector
    
    // Llenar formulario (ajustar según componente real)
    await page.fill('input[name="unitNumber"]', "Apt 101");
    await page.fill('input[name="type"]', "Apartamento");
    await page.fill('input[name="status"]', "Disponible"); // Assuming text input for status
    
    // Guardar
    await page.click('button:has-text("Guardar")'); // Corrected selector
    
    // Verificar mensaje de éxito
    await expect(page.locator("text=Inmueble creado con éxito")).toBeVisible();

    // Edit property - buscar primer botón de editar
    // Assuming edit button is part of a row, need to be more specific
    // For now, using a generic text selector, will refine if needed
    await page.click('button:has-text("Editar")').first();
    await page.fill('input[name="status"]', "Ocupado"); // Assuming text input for status
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Inmueble actualizado con éxito")).toBeVisible();

    // Delete property - buscar primer botón de eliminar
    await page.click('button:has-text("Eliminar")').first();
    // Assuming a confirmation dialog appears, need to click confirm button
    await page.click('button:has-text("Confirmar")'); // Assuming a confirm button
    await expect(page.locator("text=Inmueble eliminado con éxito")).toBeVisible();
  });

  // CP-202 - Registro de residentes y propietarios (CRUD)
  test("CP-202: should manage residents (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/residents");
    await page.waitForLoadState('networkidle');
    
    // Add resident
    await page.click('button:has-text("Añadir Residente")');
    await page.fill('input[name="name"]', "Resident E2E");
    await page.fill('input[name="email"]', `resident.e2e.${Date.now()}@test.com`);
    await page.fill('input[name="phone"]', "9876543210");
    await page.fill('input[name="propertyId"]', "1");
    await page.locator('input[name="isOwner"]').check(); // Check as owner
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Residente creado con éxito")).toBeVisible();

    // Edit resident
    await page.click('button:has-text("Editar")').first();
    await page.fill('input[name="phone"]', "0987654321");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Residente actualizado con éxito")).toBeVisible();

    // Delete resident
    await page.click('button:has-text("Eliminar")').first();
    await page.click('button:has-text("Confirmar")');
    await expect(page.locator("text=Residente eliminado con éxito")).toBeVisible();
  });

  // CP-203 - Registro Biométrico de residentes
  test("CP-203: should manage resident biometric data", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/residents");
    await page.waitForLoadState('networkidle');
    
    // Add resident with biometric ID
    await page.click('button:has-text("Añadir Residente")');
    await page.fill('input[name="name"]', "Biometric Resident");
    await page.fill('input[name="email"]', `biometric.e2e.${Date.now()}@test.com`);
    await page.fill('input[name="phone"]', "1122334455");
    await page.fill('input[name="propertyId"]', "1");
    await page.fill('input[name="biometricId"]', "BIO12345");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Residente creado con éxito")).toBeVisible();

    // Edit biometric ID
    await page.click('button:has-text("Editar")').first();
    await page.fill('input[name="biometricId"]', "BIO67890");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Residente actualizado con éxito")).toBeVisible();
  });

  // CP-204 - Registro de vehículos y parqueaderos (CRUD)
  test("CP-204: should manage vehicles (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/vehicles");
    await page.waitForLoadState('networkidle');
    
    // Add vehicle
    await page.click('button:has-text("Añadir Vehículo")');
    await page.fill('input[name="licensePlate"]', "ABC-123");
    await page.fill('input[name="brand"]', "Toyota");
    await page.fill('input[name="model"]', "Corolla");
    await page.fill('input[name="residentId"]', "1");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Vehículo creado con éxito")).toBeVisible();

    // Edit vehicle
    await page.click('button:has-text("Editar")').first();
    await page.fill('input[name="brand"]', "Honda");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Vehículo actualizado con éxito")).toBeVisible();

    // Delete vehicle
    await page.click('button:has-text("Eliminar")').first();
    await page.click('button:has-text("Confirmar")');
    await expect(page.locator("text=Vehículo eliminado con éxito")).toBeVisible();
  });

  // CP-205 - Registro de mascotas (CRUD)
  test("CP-205: should manage pets (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/pets");
    await page.waitForLoadState('networkidle');
    
    // Add pet
    await page.click('button:has-text("Añadir Mascota")');
    await page.fill('input[name="name"]', "Buddy");
    await page.fill('input[name="type"]', "Perro"); // Assuming text input for type
    await page.fill('input[name="breed"]', "Golden Retriever");
    await page.fill('input[name="residentId"]', "1");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Mascota creada con éxito")).toBeVisible();

    // Edit pet
    await page.click('button:has-text("Editar")').first();
    await page.fill('input[name="breed"]', "Labrador");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Mascota actualizada con éxito")).toBeVisible();

    // Delete pet
    await page.click('button:has-text("Eliminar")').first();
    await page.click('button:has-text("Confirmar")');
    await expect(page.locator("text=Mascota eliminada con éxito")).toBeVisible();
  });

  // CP-206 - Gestión de amenidades (CRUD)
  test("CP-206: should manage amenities (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/amenities");
    await page.waitForLoadState('networkidle');
    
    // Add amenity
    await page.click('button:has-text("Añadir Amenidad")');
    await page.fill('input[name="name"]', "Piscina E2E");
    await page.fill('input[name="description"]', "Piscina olímpica para pruebas E2E");
    await page.fill('input[name="location"]', "Área Social");
    await page.fill('input[name="capacity"]', "50");
    await page.locator('input[name="requiresApproval"]').check();
    await page.locator('input[name="hasFee"]').check();
    await page.fill('input[name="feeAmount"]', "10.50");
    await page.locator('input[name="isActive"]').check();
    await page.click('button:has-text("Añadir Amenidad")'); // Submit button in modal
    await expect(page.locator("text=Amenidad creada correctamente.")).toBeVisible();

    // Edit amenity
    await page.locator('button[title="Editar"]').first().click(); // Assuming title attribute for edit button
    await page.fill('input[name="capacity"]', "60");
    await page.locator('input[name="requiresApproval"]').uncheck();
    await page.click('button:has-text("Guardar Cambios")'); // Submit button in modal
    await expect(page.locator("text=Amenidad actualizada correctamente.")).toBeVisible();

    // Delete amenity
    await page.locator('button[title="Eliminar"]').first().click(); // Assuming title attribute for delete button
    await page.click('button:has-text("Eliminar")'); // Confirm delete button in dialog
    await expect(page.locator("text=Amenidad eliminada correctamente.")).toBeVisible();
  });

  // CP-207 - Creación y publicación de anuncios
  test("CP-207: should create and publish announcements", async ({ page }) => {
    await page.goto("/es/complex-admin/communications/announcements");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Crear Anuncio")');
    await page.fill('input[name="title"]', "Anuncio de Prueba E2E");
    await page.fill('textarea[name="content"]', "Este es un anuncio de prueba para E2E.");
    // Set publishedAt to current date/time
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    await page.fill('input[name="publishedAt"]', `${year}-${month}-${day}T${hours}:${minutes}`);
    
    // Check isActive checkbox
    await page.locator('input[name="isActive"]').check();

    // Select target roles (example: ADMIN and RESIDENT)
    await page.locator('label:has-text("ADMIN")').click();
    await page.locator('label:has-text("RESIDENT")').click();

    await page.click('button:has-text("Crear Anuncio")'); // Submit button in modal
    await expect(page.locator("text=Anuncio creado correctamente.")).toBeVisible();

    // Edit announcement
    await page.locator('button[title="Editar"]').first().click();
    await page.fill('input[name="title"]', "Anuncio Editado E2E");
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator("text=Anuncio actualizado correctamente.")).toBeVisible();

    // Delete announcement
    await page.locator('button[title="Eliminar"]').first().click();
    await page.click('button:has-text("Eliminar")');
    await expect(page.locator("text=Anuncio eliminado correctamente.")).toBeVisible();
  });

  // CP-208 - Envío de notificaciones push/email
  test("CP-208: should send notifications", async ({ page }) => {
    await page.goto("/es/complex-admin/communications/notifications");
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="title"]', "Notificación de Prueba E2E");
    await page.fill('textarea[name="message"]', "Este es un mensaje de notificación de prueba.");
    
    // Select recipient type (e.g., All Residents)
    await page.locator('div[role="combobox"]').click(); // Click on the SelectTrigger
    await page.locator('div[role="option"]:has-text("Todos los Residentes")').click(); // Select the option

    await page.click('button:has-text("Enviar Notificación")');
    await expect(page.locator("text=Notificación enviada correctamente.")).toBeVisible();

    // Optional: Test marking all as read
    await page.click('button:has-text("Marcar todas como leídas")');
    await expect(page.locator("text=Todas las notificaciones marcadas como leídas.")).toBeVisible();
  });

  // CP-209 - Envío y seguimiento de PQR
  test("CP-209: should manage PQRs (CRUD, comments, assign)", async ({ page }) => {
    await page.goto("/es/complex-admin/pqr");
    await page.waitForLoadState('networkidle');
    
    // Create PQR
    await page.click('button:has-text("Crear Nueva PQR")');
    await page.fill('#subject', "PQR de Prueba E2E");
    await page.fill('#description', "Descripción de la PQR de prueba.");
    await page.fill('#category', "General");
    await page.locator('div[role="combobox"]').click(); // Click on the SelectTrigger for Priority
    await page.locator('div[role="option"]:has-text("Media")').click(); // Select Medium Priority
    await page.click('button:has-text("Crear PQR")');
    await expect(page.locator("text=PQR creada correctamente.")).toBeVisible();

    // View and add comment
    await page.locator('button:has(svg[data-lucide="eye"])').first().click();
    await page.fill('textarea[placeholder="Añadir un comentario..."]', "Este es un comentario de prueba.");
    await page.click('button:has-text("Añadir Comentario")');
    await expect(page.locator("text=Comentario añadido correctamente.")).toBeVisible();
    await page.click('button:has-text("Cerrar")'); // Close view dialog

    // Assign PQR
    await page.locator('button:has(svg[data-lucide="user"])').first().click();
    await page.fill('#assignedToUser', "1"); // Assuming user ID 1 exists
    await page.click('button:has-text("Asignar")');
    await expect(page.locator("text=PQR asignada correctamente.")).toBeVisible();

    // Edit PQR
    await page.locator('button:has(svg[data-lucide="edit"])').first().click();
    await page.fill('#editSubject', "PQR Editada E2E");
    await page.locator('#editStatus').locator('div[role="combobox"]').click(); // Click on the SelectTrigger for Status
    await page.locator('div[role="option"]:has-text("En Progreso")').click(); // Select In Progress Status
    await page.click('button:has-text("Guardar Cambios")');
    await expect(page.locator("text=PQR actualizada correctamente.")).toBeVisible();

    // Delete PQR
    await page.locator('button:has(svg[data-lucide="trash-2"])').first().click();
    await page.click('button:has-text("Eliminar")'); // Confirm delete
    await expect(page.locator("text=PQR eliminada correctamente.")).toBeVisible();
  });

  // CP-210 - Generación de cuotas administrativas
  test("CP-210: should generate ordinary fees", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/fees");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Generar Cuotas del Período")');
    await expect(page.locator("text=Cuotas generadas para el próximo período.")).toBeVisible();
  });

  // CP-211 - Registro de pagos manuales
  test("CP-211: should register manual payments", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/payments");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Registrar Pago Manual")');
    await page.fill('input[name="feeId"]', "1");
    await page.fill('input[name="userId"]', "1");
    await page.fill('input[name="amount"]', "100");
    // Set paymentDate to current date
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    await page.fill('input[name="paymentDate"]', `${year}-${month}-${day}`);
    await page.fill('input[name="paymentMethod"]', "Efectivo");
    await page.click('button:has-text("Registrar Pago")');
    await expect(page.locator("text=Pago manual registrado con éxito")).toBeVisible();
  });

  // CP-213 - Generación de paz y salvo
  test("CP-213: should generate peace and safe report", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/reports");
    await page.waitForLoadState('networkidle');
    
    // Select report type "Paz y Salvos"
    await page.locator('div[role="combobox"]').click(); // Click on the SelectTrigger
    await page.locator('div[role="option"]:has-text("Paz y Salvos")').click(); // Select the option

    await page.fill('input[id="startDate"]', "2025-01-01");
    await page.fill('input[id="endDate"]', "2025-12-31");
    await page.click('button:has-text("Generar y Descargar Reporte")');
    await expect(page.locator("text=Reporte generado y descargado correctamente.")).toBeVisible();
  });

  // CP-214 - Conciliación Bancaria Automática
  test("CP-214: should perform bank reconciliation", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/bank-reconciliation");
    await page.waitForLoadState('networkidle');
    
    // Create a dummy file for upload
    const filePath = './e2e/test-data/bank_statement.xlsx'; // Assuming a dummy file exists here
    await page.setInputFiles('input[id="bankStatementFile"]', filePath);

    await page.click('button:has-text("Conciliar Extracto")');
    await expect(page.locator("text=Conciliación bancaria completada.")).toBeVisible();
  });
});

// Tests adicionales para otros portales
test.describe("Portal de Residentes", () => {
  test.beforeEach(async ({ page }) => {
    const residentEmail = process.env.E2E_RESIDENT_EMAIL || `resident.e2e.${Date.now()}@test.com`;
    const residentPassword = process.env.E2E_RESIDENT_PASSWORD || "password123";
    await login(page, residentEmail, residentPassword, 'resident');
  });

  test("CP-300: should access resident dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/es\/resident/);
    await expect(page.locator("h1, h2")).toContainText(["Dashboard", "Residente", "Bienvenido"]);
  });
});

test.describe("Portal de Recepción", () => {
  test.beforeEach(async ({ page }) => {
    const receptionEmail = process.env.E2E_RECEPTION_EMAIL || `reception.e2e.${Date.now()}@test.com`;
    const receptionPassword = process.env.E2E_RECEPTION_PASSWORD || "password123";
    await login(page, receptionEmail, receptionPassword, 'reception');
  });

  test("CP-400: should access reception dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/es\/reception/);
    await expect(page.locator("h1, h2")).toContainText(["Dashboard", "Recepción", "Bienvenido"]);
  });
});

