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
    
    // Add property - buscar botón de añadir (puede estar internacionalizado)
    await page.click('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Crear")');
    
    // Llenar formulario (ajustar según componente real)
    await page.fill('input[name="unitNumber"]', "Apt 101");
    await page.fill('input[name="type"]', "Apartamento");
    await page.selectOption('select[name="status"]', "AVAILABLE");
    
    // Guardar
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    
    // Verificar mensaje de éxito
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit property - buscar primer botón de editar
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.selectOption('select[name="status"]', "OCCUPIED");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();

    // Delete property - buscar primer botón de eliminar
    await page.click('button:has-text("Eliminar"), button:has-text("Delete")').first();
    await page.click('button:has-text("Confirmar"), button:has-text("Confirm")');
    await expect(page.locator("text=eliminado, text=deleted, text=éxito, text=success")).toBeVisible();
  });

  // CP-202 - Registro de residentes y propietarios (CRUD)
  test("CP-202: should manage residents (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/residents");
    await page.waitForLoadState('networkidle');
    
    // Add resident
    await page.click('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Crear")');
    await page.fill('input[name="name"]', "Resident E2E");
    await page.fill('input[name="email"]', `resident.e2e.${Date.now()}@test.com`);
    await page.fill('input[name="phone"]', "9876543210");
    await page.fill('input[name="propertyId"]', "1");
    await page.check('input[name="isOwner"]'); // Check as owner
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit resident
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.fill('input[name="phone"]', "0987654321");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();

    // Delete resident
    await page.click('button:has-text("Eliminar"), button:has-text("Delete")').first();
    await page.click('button:has-text("Confirmar"), button:has-text("Confirm")');
    await expect(page.locator("text=eliminado, text=deleted, text=éxito, text=success")).toBeVisible();
  });

  // CP-203 - Registro Biométrico de residentes
  test("CP-203: should manage resident biometric data", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/residents");
    await page.waitForLoadState('networkidle');
    
    // Add resident with biometric ID
    await page.click('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Crear")');
    await page.fill('input[name="name"]', "Biometric Resident");
    await page.fill('input[name="email"]', `biometric.e2e.${Date.now()}@test.com`);
    await page.fill('input[name="phone"]', "1122334455");
    await page.fill('input[name="propertyId"]', "1");
    await page.fill('input[name="biometricId"]', "BIO12345");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit biometric ID
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.fill('input[name="biometricId"]', "BIO67890");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();
  });

  // CP-204 - Registro de vehículos y parqueaderos (CRUD)
  test("CP-204: should manage vehicles (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/vehicles");
    await page.waitForLoadState('networkidle');
    
    // Add vehicle
    await page.click('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Crear")');
    await page.fill('input[name="licensePlate"]', "ABC-123");
    await page.fill('input[name="brand"]', "Toyota");
    await page.fill('input[name="model"]', "Corolla");
    await page.fill('input[name="year"]', "2020");
    await page.fill('input[name="color"]', "Rojo");
    await page.selectOption('select[name="type"]', "CAR");
    await page.fill('input[name="parkingSpot"]', "P1");
    await page.fill('input[name="propertyId"]', "1");
    await page.fill('input[name="residentId"]', "1");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit vehicle
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.fill('input[name="color"]', "Azul");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();

    // Delete vehicle
    await page.click('button:has-text("Eliminar"), button:has-text("Delete")').first();
    await page.click('button:has-text("Confirmar"), button:has-text("Confirm")');
    await expect(page.locator("text=eliminado, text=deleted, text=éxito, text=success")).toBeVisible();
  });

  // CP-205 - Registro de mascotas (CRUD)
  test("CP-205: should manage pets (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/pets");
    await page.waitForLoadState('networkidle');
    
    // Add pet
    await page.click('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Crear")');
    await page.fill('input[name="name"]', "Buddy");
    await page.selectOption('select[name="type"]', "DOG");
    await page.fill('input[name="breed"]', "Golden Retriever");
    await page.fill('input[name="propertyId"]', "1");
    await page.fill('input[name="residentId"]', "1");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit pet
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.fill('input[name="breed"]', "Labrador");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();

    // Delete pet
    await page.click('button:has-text("Eliminar"), button:has-text("Delete")').first();
    await page.click('button:has-text("Confirmar"), button:has-text("Confirm")');
    await expect(page.locator("text=eliminado, text=deleted, text=éxito, text=success")).toBeVisible();
  });

  // CP-206 - Gestión de amenidades (CRUD)
  test("CP-206: should manage amenities (CRUD)", async ({ page }) => {
    await page.goto("/es/complex-admin/inventory/amenities");
    await page.waitForLoadState('networkidle');
    
    // Add amenity
    await page.click('button:has-text("Añadir"), button:has-text("Add"), button:has-text("Crear")');
    await page.fill('input[name="name"]', "Piscina");
    await page.fill('textarea[name="description"]', "Piscina olímpica");
    await page.selectOption('select[name="type"]', "POOL");
    await page.fill('input[name="capacity"]', "50");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit amenity
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.fill('input[name="capacity"]', "60");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();

    // Delete amenity
    await page.click('button:has-text("Eliminar"), button:has-text("Delete")').first();
    await page.click('button:has-text("Confirmar"), button:has-text("Confirm")');
    await expect(page.locator("text=eliminado, text=deleted, text=éxito, text=success")).toBeVisible();
  });

  // CP-207 - Creación y publicación de anuncios
  test("CP-207: should create and publish announcements", async ({ page }) => {
    await page.goto("/es/complex-admin/communications/announcements");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Crear"), button:has-text("Add"), button:has-text("Nuevo")');
    await page.fill('input[name="title"]', "Anuncio de Prueba E2E");
    await page.fill('textarea[name="content"]', "Este es un anuncio de prueba para E2E.");
    await page.click('button:has-text("Publicar"), button:has-text("Publish"), button[type="submit"]');
    await expect(page.locator("text=publicado, text=published, text=éxito, text=success")).toBeVisible();
  });

  // CP-208 - Envío de notificaciones push/email
  test("CP-208: should send notifications", async ({ page }) => {
    await page.goto("/es/complex-admin/communications/notifications");
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="title"]', "Notificación de Prueba E2E");
    await page.fill('textarea[name="message"]', "Este es un mensaje de notificación de prueba.");
    await page.click('button:has-text("Enviar"), button:has-text("Send"), button[type="submit"]');
    await expect(page.locator("text=enviada, text=sent, text=éxito, text=success")).toBeVisible();
  });

  // CP-209 - Envío y seguimiento de PQR
  test("CP-209: should manage PQRs (CRUD, comments, assign)", async ({ page }) => {
    await page.goto("/es/complex-admin/pqr");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Crear"), button:has-text("Add"), button:has-text("Nueva")');
    await page.fill('input[name="subject"]', "PQR de Prueba E2E");
    await page.fill('textarea[name="description"]', "Descripción de la PQR de prueba.");
    await page.fill('input[name="category"]', "General");
    await page.selectOption('select[name="priority"]', "MEDIUM");
    await page.click('button:has-text("Crear"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creada, text=created, text=éxito, text=success")).toBeVisible();

    // View and add comment
    await page.click('button:has-text("Ver"), button:has-text("View")').first();
    await page.fill('textarea[placeholder*="comentario"], textarea[name="comment"]', "Este es un comentario de prueba.");
    await page.click('button:has-text("Añadir"), button:has-text("Add")');
    await expect(page.locator("text=añadido, text=added, text=éxito, text=success")).toBeVisible();

    // Assign PQR
    await page.click('button:has-text("Asignar"), button:has-text("Assign")');
    await page.fill('input[name="assignedToUser"]', "1");
    await page.click('button:has-text("Asignar"), button:has-text("Assign"), button[type="submit"]');
    await expect(page.locator("text=asignada, text=assigned, text=éxito, text=success")).toBeVisible();

    // Update status
    await page.click('button:has-text("Editar"), button:has-text("Edit")');
    await page.selectOption('select[name="status"]', "IN_PROGRESS");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizada, text=updated, text=éxito, text=success")).toBeVisible();
  });

  // CP-210 - Generación de cuotas administrativas
  test("CP-210: should generate ordinary fees", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/fees");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Generar"), button:has-text("Generate")');
    await expect(page.locator("text=generadas, text=generated, text=éxito, text=success")).toBeVisible();
  });

  // CP-211 - Registro de pagos manuales
  test("CP-211: should register manual payments", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/payments");
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Registrar"), button:has-text("Register"), button:has-text("Manual")');
    await page.fill('input[name="feeId"]', "1");
    await page.fill('input[name="userId"]', "1");
    await page.fill('input[name="amount"]', "100");
    await page.fill('input[name="paymentDate"]', "2025-07-26");
    await page.selectOption('select[name="paymentMethod"]', "CASH");
    await page.click('button:has-text("Registrar"), button:has-text("Register"), button[type="submit"]');
    await expect(page.locator("text=registrado, text=registered, text=éxito, text=success")).toBeVisible();
  });

  // CP-213 - Generación de paz y salvo
  test("CP-213: should generate peace and safe report", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/reports");
    await page.waitForLoadState('networkidle');
    
    await page.selectOption('select[name="reportType"]', "PEACE_AND_SAFE");
    await page.fill('input[name="startDate"]', "2025-01-01");
    await page.fill('input[name="endDate"]', "2025-12-31");
    await page.click('button:has-text("Generar"), button:has-text("Generate")');
    await expect(page.locator("text=generado, text=generated, text=éxito, text=success")).toBeVisible();
  });

  // CP-214 - Conciliación Bancaria Automática
  test("CP-214: should perform bank reconciliation with file upload", async ({ page }) => {
    await page.goto("/es/complex-admin/finances/bank-reconciliation");
    await page.waitForLoadState('networkidle');

    // Simulate file upload
    const csvContent = `Fecha,Descripcion,Monto\n2025-07-26,Pago Admin 101,150000`;
    await page.setInputFiles('input[type="file"]', {
      name: 'extracto.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csvContent)
    });

    await page.click('button:has-text("Conciliar")');
    await expect(page.locator("text=Archivo procesado y conciliado")).toBeVisible();
    await expect(page.locator('text=Pago Admin 101').first()).toBeVisible();
  });

  // CP-215 - Gestión de reservas de amenidades
  test("CP-215: should manage amenity reservations", async ({ page }) => {
    await page.goto("/es/complex-admin/reservations");
    await page.waitForLoadState('networkidle');

    // Approve a pending reservation (assuming one exists from resident tests)
    await page.click('button:has-text("Aprobar")').first();
    await expect(page.locator("text=aprobada, text=approved, text=éxito, text=success")).toBeVisible();

    // Reject a pending reservation
    await page.click('button:has-text("Rechazar")').first();
    await expect(page.locator("text=rechazada, text=rejected, text=éxito, text=success")).toBeVisible();
  });

  // CP-216 - Gestión de proyectos/obras
  test("CP-216: should manage projects", async ({ page }) => {
    await page.goto("/es/complex-admin/projects");
    await page.waitForLoadState('networkidle');

    // Create a new project
    await page.click('button:has-text("Crear"), button:has-text("Add"), button:has-text("Nuevo")');
    await page.fill('input[name="name"]', "Remodelación de Fachada E2E");
    await page.fill('textarea[name="description"]', "Proyecto de prueba para E2E.");
    await page.fill('input[name="budget"]', "10000");
    await page.click('button:has-text("Crear"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Update project status
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.selectOption('select[name="status"]', "IN_PROGRESS");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();
  });

  // CP-217 - Registro y roles de personal operativo
  test("CP-217: should manage staff", async ({ page }) => {
    await page.goto("/es/complex-admin/staff");
    await page.waitForLoadState('networkidle');

    // Create a new staff member
    await page.click('button:has-text("Crear"), button:has-text("Add"), button:has-text("Nuevo")');
    await page.fill('input[name="name"]', "Personal de Prueba E2E");
    await page.fill('input[name="email"]', `staff.e2e.${Date.now()}@test.com`);
    await page.selectOption('select[name="role"]', "RECEPTION");
    await page.click('button:has-text("Crear"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=creado, text=created, text=éxito, text=success")).toBeVisible();

    // Edit staff member
    await page.click('button:has-text("Editar"), button:has-text("Edit")').first();
    await page.selectOption('select[name="role"]', "SECURITY");
    await page.click('button:has-text("Guardar"), button:has-text("Save"), button[type="submit"]');
    await expect(page.locator("text=actualizado, text=updated, text=éxito, text=success")).toBeVisible();
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