import { test, expect, Page } from "@playwright/test";

// Helper function for reliable login
async function login(page: Page, email: string, password: string, portal: 'admin' | 'resident' | 'reception') {
  await page.goto(`/login?portal=${portal}`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Iniciar Sesión")');
  // Wait for navigation to complete and check for a common element on the dashboard
  if (portal === 'admin') {
    await expect(page).toHaveURL(/.*admin\/app-admin\/dashboard/); // Adjust to actual admin dashboard URL
  } else if (portal === 'resident') {
    await expect(page).toHaveURL(/.*resident\/resident-dashboard/); // Adjust to actual resident dashboard URL
  } else if (portal === 'reception') {
    await expect(page).toHaveURL(/.*reception-portal\/reception-dashboard/); // Adjust to actual security dashboard URL
  }
}

test.describe("Armonía Application E2E Tests", () => {
  // Use beforeEach to ensure login for tests that require it
  test.beforeEach(async ({ page }) => {
    // This assumes that the globalSetup has already created the admin user
    // and set the environment variables E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.
    // If not, these tests will fail.
    const adminEmail = process.env.E2E_ADMIN_EMAIL || `admin.e2e.${Date.now()}@test.com`;
    const adminPassword = process.env.E2E_ADMIN_PASSWORD || "password123";

    // Attempt to login as admin. If already logged in or registration is needed,
    // the globalSetup should handle the registration.
    await login(page, adminEmail, adminPassword, 'admin');
  });

  // CP-100 - Registro de nuevo conjunto (This test should now be simplified or moved to globalSetup)
  // For now, I'll keep it as is, but it might be redundant if globalSetup handles registration.
  test("CP-100: should allow new complex registration", async ({ page }) => {
    const newComplexEmail = `new.complex.${Date.now()}@test.com`;
    await page.goto("/register-complex");
    await page.fill('input[name="complexName"]', "New Complex E2E");
    await page.fill('input[name="adminName"]', "New Admin E2E");
    await page.fill('input[name="email"]', newComplexEmail);
    await page.fill('input[name="phone"]', "1234567890");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=¡Registro Exitoso!")).toBeVisible();
  });

  // CP-101 - Solicitud de demo
  test("CP-101: should allow demo request", async ({ page }) => {
    await page.goto("/"); // Assuming demo request is on the landing page
    await page.fill('input[name="name"]', "Demo User E2E");
    await page.fill('input[name="email"]', `demo.e2e.${Date.now()}@test.com`);
    await page.fill(
      'textarea[name="message"]',
      "I want a demo for my complex.",
    );
    await page.click('button:has-text("Enviar Mensaje")');
    await expect(page.locator("text=Formulario enviado")).toBeVisible();
  });

  // CP-200 - Login administrador (This test can be simplified as beforeEach handles login)
  test("CP-200: should allow admin login", async ({ page }) => {
    // The beforeEach hook already handles the admin login.
    // This test now just verifies the URL after login.
    await expect(page).toHaveURL(/.*admin\/app-admin\/dashboard/); // Adjust to actual admin dashboard URL
  });

  // CP-201 - Gestión de inmuebles (Crear, Editar, Eliminar)
  test("CP-201: should manage properties (CRUD)", async ({ page }) => {
    await page.goto("/admin/inventory/properties"); // Adjust to actual properties management URL
    // Add property
    await page.click('button:has-text("Añadir Inmueble")');
    await page.fill('input[name="unitNumber"]', "Apt 101");
    await page.fill('input[name="type"]', "Apartamento");
    await page.fill('input[name="status"]', "Disponible");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Inmueble creado con éxito")).toBeVisible();

    // Edit property
    await page.click('button:has-text("Editar")'); // Assuming an edit button exists
    await page.fill('input[name="status"]', "Ocupado");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Inmueble actualizado con éxito"),
    ).toBeVisible();

    // Delete property
    await page.click('button:has-text("Eliminar")'); // Assuming a delete button exists
    await page.click('button:has-text("Confirmar Eliminación")'); // Confirm deletion
    await expect(
      page.locator("text=Inmueble eliminado con éxito"),
    ).toBeVisible();
  });

  // CP-202 - Registro de residentes y propietarios (Crear, Editar, Eliminar)
  test("CP-202: should manage residents (CRUD)", async ({ page }) => {
    await page.goto("/admin/inventory/residents"); // Adjust to actual residents management URL
    // Add resident
    await page.click('button:has-text("Añadir Residente")');
    await page.fill('input[name="name"]', "Resident E2E");
    await page.fill(
      'input[name="email"]',
      `resident.e2e.${Date.now()}@test.com`,
    );
    await page.fill('input[name="phone"]', "9876543210");
    await page.fill('input[name="propertyId"]', "1"); // Assuming property 1 exists
    await page.click('input[name="isOwner"]'); // Check as owner
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Residente creado con éxito")).toBeVisible();

    // Edit resident
    await page.click('button:has-text("Editar")');
    await page.fill('input[name="phone"]', "0987654321");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Residente actualizado con éxito"),
    ).toBeVisible();

    // Delete resident
    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Residente eliminado con éxito"),
    ).toBeVisible();
  });

  // CP-203 - Registro Biométrico (Cara) de residentes y propietarios
  test("CP-203: should manage resident biometric data", async ({ page }) => {
    await page.goto("/admin/inventory/residents"); // Adjust to actual residents management URL
    // Add resident with biometric ID
    await page.click('button:has-text("Añadir Residente")');
    await page.fill('input[name="name"]', "Biometric Resident");
    await page.fill(
      'input[name="email"]',
      `biometric.e2e.${Date.now()}@test.com`,
    );
    await page.fill('input[name="phone"]', "1122334455");
    await page.fill('input[name="propertyId"]', "1"); // Assuming property 1 exists
    await page.fill('input[name="biometricId"]', "BIO12345"); // Fill biometric ID
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Residente creado con éxito")).toBeVisible();

    // Edit resident to update biometric ID
    await page.click('button:has-text("Editar")');
    await page.fill('input[name="biometricId"]', "BIO67890");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Residente actualizado con éxito"),
    ).toBeVisible();
  });

  // CP-204 - Registro de vehículos y parqueaderos (Crear, Editar, Eliminar)
  test("CP-204: should manage vehicles (CRUD)", async ({ page }) => {
    await page.goto("/admin/inventory/vehicles"); // Adjust to actual vehicles management URL
    // Add vehicle
    await page.click('button:has-text("Añadir Vehículo")');
    await page.fill('input[name="licensePlate"]', "ABC-123");
    await page.fill('input[name="brand"]', "Toyota");
    await page.fill('input[name="model"]', "Corolla");
    await page.fill('input[name="year"]', "2020");
    await page.fill('input[name="color"]', "Rojo");
    await page.fill('input[name="type"]', "Automóvil");
    await page.fill('input[name="parkingSpot"]', "P1");
    await page.fill('input[name="propertyId"]', "1"); // Assuming property 1 exists
    await page.fill('input[name="residentId"]', "1"); // Assuming resident 1 exists
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Vehículo creado con éxito")).toBeVisible();

    // Edit vehicle
    await page.click('button:has-text("Editar")');
    await page.fill('input[name="color"]', "Azul");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Vehículo actualizado con éxito"),
    ).toBeVisible();

    // Delete vehicle
    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Vehículo eliminado con éxito"),
    ).toBeVisible();
  });

  // CP-205 - Registro de mascotas (Crear, Editar, Eliminar)
  test("CP-205: should manage pets (CRUD)", async ({ page }) => {
    await page.goto("/admin/inventory/pets"); // Adjust to actual pets management URL
    // Add pet
    await page.click('button:has-text("Añadir Mascota")');
    await page.fill('input[name="name"]', "Buddy");
    await page.fill('input[name="type"]', "Perro");
    await page.fill('input[name="breed"]', "Golden Retriever");
    await page.fill('input[name="propertyId"]', "1"); // Assuming property 1 exists
    await page.fill('input[name="residentId"]', "1"); // Assuming resident 1 exists
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Mascota creada con éxito")).toBeVisible();

    // Edit pet
    await page.click('button:has-text("Editar")');
    await page.fill('input[name="breed"]', "Labrador");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Mascota actualizada con éxito"),
    ).toBeVisible();

    // Delete pet
    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Mascota eliminada con éxito"),
    ).toBeVisible();
  });

  // CP-206 - Gestión de amenidades (Crear, Editar, Eliminar)
  test("CP-206: should manage amenities (CRUD)", async ({ page }) => {
    await page.goto("/admin/inventory/amenities"); // Adjust to actual amenities management URL
    // Add amenity
    await page.click('button:has-text("Añadir Amenidad")');
    await page.fill('input[name="name"]', "Piscina");
    await page.fill('input[name="description"]', "Piscina olímpica");
    await page.selectOption('select[name="type"]', "POOL");
    await page.fill('input[name="capacity"]', "50");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator("text=Amenidad creada con éxito")).toBeVisible();

    // Edit amenity
    await page.click('button:has-text("Editar")');
    await page.fill('input[name="capacity"]', "60");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Amenidad actualizada con éxito"),
    ).toBeVisible();

    // Delete amenity
    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Amenidad eliminada con éxito"),
    ).toBeVisible();
  });

  // CP-207 - Creación y publicación de anuncios
  test("CP-207: should create and publish announcements", async ({ page }) => {
    await page.goto("/admin/communications/announcements"); // Adjust to actual announcements URL
    await page.click('button:has-text("Crear Anuncio")');
    await page.fill('input[name="title"]', "Anuncio de Prueba E2E");
    await page.fill(
      'textarea[name="content"]',
      "Este es un anuncio de prueba para E2E.",
    );
    await page.click('button:has-text("Publicar Anuncio")');
    await expect(
      page.locator("text=Anuncio publicado correctamente."),
    ).toBeVisible();
  });

  // CP-208 - Envío de notificaciones push/email
  test("CP-208: should send notifications", async ({ page }) => {
    await page.goto("/admin/communications/notifications"); // Adjust to actual notifications URL
    await page.fill('input[name="title"]', "Notificación de Prueba E2E");
    await page.fill(
      'textarea[name="message"]',
      "Este es un mensaje de notificación de prueba.",
    );
    await page.click('button:has-text("Enviar Notificación")');
    await expect(
      page.locator("text=Notificación enviada correctamente."),
    ).toBeVisible();
  });

  // CP-209 - Envío y seguimiento de PQR
  test("CP-209: should manage PQRs (CRUD, comments, assign)", async ({
    page,
  }) => {
    await page.goto("/admin/pqr"); // Adjust to actual PQR URL
    await page.click('button:has-text("Crear Nueva PQR")');
    await page.fill('input[name="subject"]', "PQR de Prueba E2E");
    await page.fill(
      'textarea[name="description"]',
      "Descripción de la PQR de prueba.",
    );
    await page.fill('input[name="category"]', "General");
    await page.selectOption('select[name="priority"]', "MEDIUM");
    await page.click('button:has-text("Crear PQR")');
    await expect(page.locator("text=PQR creada correctamente.")).toBeVisible();

    await page.click('button:has-text("Ver")');
    await page.fill(
      'textarea[placeholder="Añadir un comentario..."]',
      "Este es un comentario de prueba.",
    );
    await page.click('button:has-text("Añadir Comentario")');
    await expect(
      page.locator("text=Comentario añadido correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Asignar")');
    await page.fill('input[name="assignedToUser"]', "1");
    await page.click('button:has-text("Asignar")');
    await expect(
      page.locator("text=PQR asignada correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Editar")');
    await page.selectOption('select[name="status"]', "IN_PROGRESS");
    await page.click('button:has-text("Guardar Cambios")');
    await expect(
      page.locator("text=PQR actualizada correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=PQR eliminada correctamente."),
    ).toBeVisible();
  });

  // CP-210 - Generación de cuotas administrativas (por coeficiente)
  test("CP-210: should generate ordinary fees", async ({ page }) => {
    await page.goto("/admin/finances/fees");
    await page.click('button:has-text("Generar Cuotas del Período")');
    await expect(
      page.locator("text=Cuotas generadas para el próximo período."),
    ).toBeVisible();
  });

  // CP-211 - Registro de pagos manuales
  test("CP-211: should register manual payments", async ({ page }) => {
    await page.goto("/admin/finances/payments");
    await page.click('button:has-text("Registrar Pago Manual")');
    await page.fill('input[name="feeId"]', "1");
    await page.fill('input[name="userId"]', "1");
    await page.fill('input[name="amount"]', "100");
    await page.fill('input[name="paymentDate"]', "2025-07-26");
    await page.selectOption('select[name="paymentMethod"]', "Cash");
    await page.click('button:has-text("Registrar Pago")');
    await expect(
      page.locator("text=Pago manual registrado exitosamente."),
    ).toBeVisible();
  });

  // CP-213 - Generación de paz y salvo
  test("CP-213: should generate peace and safe report", async ({ page }) => {
    await page.goto("/admin/finances/reports");
    await page.selectOption('select[name="reportType"]', "PEACE_AND_SAFE");
    await page.fill('input[name="startDate"]', "2025-01-01");
    await page.fill('input[name="endDate"]', "2025-12-31");
    await page.click('button:has-text("Generar y Descargar Reporte")');
    await expect(
      page.locator("text=Reporte generado y descargado correctamente."),
    ).toBeVisible();
  });

  // CP-214 - Conciliación Bancaria Automática
  test("CP-214: should perform bank reconciliation", async ({ page }) => {
    await page.goto("/admin/finances/bank-reconciliation");
    await page.setInputFiles(
      'input[type="file"]',
      "path/to/your/bank_statement.xlsx",
    );
    await page.click('button:has-text("Conciliar Extracto")');
    await expect(
      page.locator("text=Conciliación bancaria completada."),
    ).toBeVisible();
  });

  // CP-215 - Gestión de reservas de amenidades (Crear, Aprobar, Rechazar, Eliminar)
  test("CP-215: should manage amenity reservations (CRUD, approve/reject)", async ({
    page,
  }) => {
    await page.goto("/admin/reservations");
    await page.click('button:has-text("Crear Nueva Reserva")');
    await page.selectOption('select[name="commonAreaId"]', "1");
    await page.selectOption('select[name="userId"]', "1");
    await page.fill('input[name="title"]', "Reserva de Piscina E2E");
    await page.fill('input[name="startDateTime"]', "2025-08-01T10:00");
    await page.fill('input[name="endDateTime"]', "2025-08-01T12:00");
    await page.click('button:has-text("Crear Reserva")');
    await expect(
      page.locator("text=Reserva creada correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Aprobar")');
    await expect(
      page.locator("text=Reserva aprobada correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Rechazar")');
    await expect(
      page.locator("text=Reserva rechazada correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Reserva eliminada correctamente."),
    ).toBeVisible();
  });

  // CP-216 - Gestión de proyectos/obras (Crear, Actualizar, Eliminar)
  test("CP-216: should manage projects (CRUD)", async ({ page }) => {
    await page.goto("/admin/projects/list");
    await page.click('button:has-text("Crear Nuevo Proyecto")');
    await page.fill('input[name="title"]', "Proyecto E2E");
    await page.fill(
      'textarea[name="description"]',
      "Descripción del proyecto E2E.",
    );
    await page.fill('input[name="startDate"]', "2025-01-01");
    await page.fill('input[name="endDate"]', "2025-12-31");
    await page.selectOption('select[name="status"]', "PLANNED");
    await page.fill('input[name="budget"]', "10000");
    await page.fill('input[name="collectedFunds"]', "0");
    await page.click('button:has-text("Crear Proyecto")');
    await expect(
      page.locator("text=Proyecto creado correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Editar")');
    await page.fill('input[name="collectedFunds"]', "5000");
    await page.click('button:has-text("Guardar Cambios")');
    await expect(
      page.locator("text=Proyecto actualizado correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Proyecto eliminado con éxito"),
    ).toBeVisible();
  });

  // CP-217 - Registro y roles de personal operativo (Crear, Actualizar, Eliminar)
  test("CP-217: should manage staff users (CRUD)", async ({ page }) => {
    await page.goto("/admin/user-management/staff");
    await page.click('button:has-text("Añadir Personal")');
    await page.fill('input[name="name"]', "Staff E2E");
    await page.fill('input[name="email"]', `staff.e2e.${Date.now()}@test.com`);
    await page.fill('input[name="password"]', "password123");
    await page.selectOption('select[name="role"]', "RECEPTION");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Usuario creado correctamente"),
    ).toBeVisible();

    await page.click('button:has-text("Editar")');
    await page.selectOption('select[name="role"]', "SECURITY");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Usuario actualizado correctamente"),
    ).toBeVisible();

    await page.click('button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar Eliminación")');
    await expect(
      page.locator("text=Usuario eliminado correctamente."),
    ).toBeVisible();
  });

  // CP-300 - Login residente
  test("CP-300: should allow resident login and redirect to resident dashboard", async ({
    page,
  }) => {
    const residentEmail = `resident.login.${Date.now()}@test.com`;
    await page.goto("/register-complex");
    await page.fill('input[name="complexName"]', "Resident Test Complex");
    await page.fill('input[name="adminName"]', "Resident Admin");
    await page.fill('input[name="email"]', residentEmail);
    await page.fill('input[name="phone"]', "1234567890");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=¡Registro Exitoso!")).toBeVisible();

    await login(page, residentEmail, "password123", 'resident');
    await expect(page).toHaveURL(/.*resident\/resident-dashboard/);
  });

  // CP-301 - Visualización de comunicados
  test("CP-301: should view announcements", async ({ page }) => {
    await page.goto("/resident/communications/resident-announcements");
    await expect(page.locator("text=Anuncio de Prueba E2E")).toBeVisible();
  });

  // CP-302 - Realizar pago en línea
  test("CP-302: should initiate online payment", async ({ page }) => {
    await page.goto("/resident/financial/fees");
    await page.click('button:has-text("Pagar")');
    await expect(
      page.locator("text=Pago iniciado correctamente"),
    ).toBeVisible();
  });

  // CP-303 - Reserva de amenidad
  test("CP-303: should create amenity reservation", async ({ page }) => {
    await page.goto("/resident/resident-reservations");
    await page.click('button:has-text("Crear Nueva Reserva")');
    await page.selectOption('select[name="commonAreaId"]', "1");
    await page.selectOption('select[name="userId"]', "1");
    await page.fill('input[name="title"]', "Reserva de Cancha E2E");
    await page.fill('input[name="startDateTime"]', "2025-08-02T10:00");
    await page.fill('input[name="endDateTime"]', "2025-08-02T12:00");
    await page.click('button:has-text("Crear Reserva")');
    await expect(
      page.locator("text=Reserva creada correctamente."),
    ).toBeVisible();
  });

  // CP-304 - Preregistro de visitante y generación de QR
  test("CP-304: should pre-register visitor and generate QR", async ({
    page,
  }) => {
    await page.goto("/resident/security/pre-register-visitor");
    await page.fill('input[name="name"]', "Visitor E2E");
    await page.selectOption('select[name="documentType"]', "CC");
    await page.fill('input[name="documentNumber"]', "123456789");
    await page.fill('textarea[name="purpose"]', "Visita familiar");
    await page.fill('input[name="expectedDate"]', "2025-08-03");
    await page.fill('input[name="expectedTime"]', "15:00");
    await page.click('button:has-text("Generar QR")');
    await expect(
      page.locator("text=Visitante preregistrado y QR generado."),
    ).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible();
  });

  // CP-305 - Botón de pánico (registro y notificación)
  test("CP-305: should trigger panic alert", async ({ page }) => {
    await page.goto("/resident/security/panic-button");
    await page.click('button:has-text("PÁNICO")');
    await expect(
      page.locator("text=Se ha enviado una alerta de pánico a seguridad."),
    ).toBeVisible();
  });

  // CP-306 - Gestión de presupuesto familiar
  test("CP-306: should manage family budget", async ({ page }) => {
    await page.goto("/resident/financial/family-budget");
    await page.click('button:has-text("Añadir Entrada")');
    await page.fill('input[name="description"]', "Salario");
    await page.fill('input[name="amount"]', "2000");
    await page.selectOption('select[name="type"]', "INCOME");
    await page.fill('input[name="category"]', "Trabajo");
    await page.fill('input[name="date"]', "2025-07-25");
    await page.click('button:has-text("Añadir Entrada")');
    await expect(
      page.locator("text=Entrada de presupuesto creada correctamente."),
    ).toBeVisible();

    await page.click('button:has-text("Añadir Entrada")');
    await page.fill('input[name="description"]', "Alquiler");
    await page.fill('input[name="amount"]', "800");
    await page.selectOption('select[name="type"]', "EXPENSE");
    await page.fill('input[name="category"]', "Vivienda");
    await page.fill('input[name="date"]', "2025-07-25");
    await page.click('button:has-text("Añadir Entrada")');
    await expect(
      page.locator("text=Entrada de presupuesto creada correctamente."),
    ).toBeVisible();

    await expect(
      page
        .locator("text=Ingresos Totales")
        .locator("..")
        .locator("text=$2000.00"),
    ).toBeVisible();
    await expect(
      page.locator("text=Gastos Totales").locator("..").locator("text=$800.00"),
    ).toBeVisible();
    await expect(
      page.locator("text=Saldo Actual").locator("..").locator("text=$1200.00"),
    ).toBeVisible();

    await page.locator('button:has-text("Eliminar")').first().click();
    await expect(
      page.locator("text=Entrada eliminada correctamente."),
    ).toBeVisible();
  });

  // CP-307 - Publicación de anuncio en marketplace
  test("CP-307: should publish marketplace listing", async ({ page }) => {
    await page.goto("/resident/marketplace/create");
    await page.fill('input[name="title"]', "Vendo Bicicleta E2E");
    await page.fill(
      'textarea[name="description"]',
      "Bicicleta de montaña en excelente estado.",
    );
    await page.fill('input[name="price"]', "300");
    await page.selectOption('select[name="category"]', "Vehículos");
    await page.click('button:has-text("Publicar Anuncio")');
    await expect(
      page.locator("text=Anuncio publicado correctamente."),
    ).toBeVisible();
  });

  // CP-308 - Envío de mensaje interno (marketplace)
  test("CP-308: should send internal message in marketplace", async ({
    page,
  }) => {
    await page.goto("/resident/marketplace/chat/1");
    await page.fill(
      'input[placeholder="Escribe tu mensaje..."]',
      "Hola, estoy interesado en tu anuncio.",
    );
    await page.click('button:has-text("Enviar")');
    await expect(
      page
        .locator("text=No se pudo enviar el mensaje")
        .or(page.locator("text=Error")),
    ).not.toBeVisible();
  });

  // CP-309 - Reporte de contenido (moderación)
  test("CP-309: should report marketplace listing", async ({ page }) => {
    await page.goto("/resident/marketplace/1");
    await page.click('button:has-text("Reportar Anuncio")');
    await expect(page.locator("text=Anuncio Reportado")).toBeVisible();
  });

  // CP-400 - Login personal de seguridad
  test("CP-400: should allow security staff login and redirect", async ({
    page,
  }) => {
    const securityEmail = `security.login.${Date.now()}@test.com`;
    await page.goto("/admin/user-management/staff");
    await page.click('button:has-text("Añadir Personal")');
    await page.fill('input[name="name"]', "Security Staff");
    await page.fill('input[name="email"]', securityEmail);
    await page.fill('input[name="password"]', "password123");
    await page.selectOption('select[name="role"]', "RECEPTION");
    await page.click('button:has-text("Guardar")');
    await expect(
      page.locator("text=Usuario creado correctamente"),
    ).toBeVisible();

    await login(page, securityEmail, "password123", 'reception');
    await expect(page).toHaveURL(/.*reception-portal\/reception-dashboard/);
  });

  // CP-401 - Registro entrada de visitante con QR
  test("CP-401: should register visitor via QR scan", async ({ page }) => {
    await page.goto("/reception/security/scan-qr");
    await page.fill(
      'input[placeholder="Simular escaneo de QR"]',
      "dummy-qr-code-123",
    );
    await page.click('button:has-text("Escanear QR")');
    await expect(
      page.locator("text=Visitante registrado exitosamente."),
    ).toBeVisible();
  });

  // CP-402 - Registro manual de visitantes
  test("CP-402: should manually register visitor", async ({ page }) => {
    await page.goto("/reception/security/manual-register");
    await page.fill('input[name="name"]', "Manual Visitor");
    await page.selectOption('select[name="documentType"]', "CC");
    await page.fill('input[name="documentNumber"]', "987654321");
    await page.fill('textarea[name="purpose"]', "Entrega de paquete");
    await page.fill('input[name="expectedDate"]', "2025-07-26");
    await page.fill('input[name="expectedTime"]', "10:00");
    await page.click('button:has-text("Registrar Visitante")');
    await expect(
      page.locator("text=Visitante registrado exitosamente."),
    ).toBeVisible();
  });

  // CP-403 - Registro y notificación de paquetería
  test("CP-403: should register and notify package", async ({ page }) => {
    await page.goto("/reception/packages");
    await page.click('button:has-text("Registrar Nuevo Paquete")');
    await page.selectOption('select[name="type"]', "package");
    await page.fill('input[name="destination"]', "Apt 101");
    await page.fill('input[name="residentName"]', "Resident Name");
    await page.fill('input[name="trackingNumber"]', "TRACK123");
    await page.fill('input[name="courier"]', "DHL");
    await page.click('button:has-text("Registrar Paquete")');
    await expect(
      page.locator("text=Paquete registrado exitosamente."),
    ).toBeVisible();
  });

  // CP-404 - Bitácora de novedades
  test("CP-404: should register incident", async ({ page }) => {
    await page.goto("/reception/incidents");
    await page.click('button:has-text("Registrar Nuevo Incidente")');
    await page.fill('input[name="title"]', "Incidente de Prueba E2E");
    await page.selectOption('select[name="category"]', "security");
    await page.selectOption('select[name="priority"]', "high");
    await page.fill('input[name="location"]', "Entrada Principal");
    await page.fill('input[name="reportedBy"]', "Security Guard");
    await page.fill(
      'textarea[name="description"]',
      "Se observó actividad sospechosa.",
    );
    await page.click('button:has-text("Registrar Incidente")');
    await expect(
      page.locator("text=Incidente registrado exitosamente."),
    ).toBeVisible();
  });

  // CP-405 - Activación y respuesta al botón de pánico
  test("CP-405: should respond to panic alert", async ({ page }) => {
    await page.goto("/reception/panic-alerts");
    await page.click('button:has-text("Resolver")');
    await expect(page.locator("text=Alerta de pánico resuelta.")).toBeVisible();
  });

  // CP-500 - Login empresa administradora
  test("CP-500: should allow app admin login and redirect", async ({
    page,
  }) => {
    const appAdminEmail = `app.admin.login.${Date.now()}@test.com`;
    await page.goto("/login?portal=admin");
    await page.fill('input[name="email"]', appAdminEmail);
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page).toHaveURL(/.*admin\/app-admin-portal\/portfolio/);
  });

  // CP-501 - Visualización de múltiples conjuntos
  test("CP-501: should view multi-complex dashboard", async ({ page }) => {
    await page.goto("/admin/app-admin-portal/portfolio");
    await expect(
      page.locator("text=Dashboard Armonía Portafolio"),
    ).toBeVisible();
    await expect(page.locator("text=Total Conjuntos")).toBeVisible();
    await expect(page.locator("text=Total Residentes")).toBeVisible();
    await expect(
      page.locator("text=Ingresos Totales Portafolio"),
    ).toBeVisible();
  });

  // CP-503 - Informes financieros consolidados
  test("CP-503: should generate consolidated financial report", async ({
    page,
  }) => {
    await page.goto("/admin/app-admin-portal/portfolio/reports");
    await page.selectOption('select[name="reportType"]', "BALANCE");
    await page.fill('input[name="startDate"]', "2025-01-01");
    await page.fill('input[name="endDate"]', "2025-12-31");
    await page.click('button:has-text("Generar y Descargar Reporte")');
    await expect(
      page.locator("text=Reporte generado y descargado correctamente."),
    ).toBeVisible();
  });

  // CP-504 - Personalización de marca
  test("CP-504: should update branding settings", async ({ page }) => {
    await page.goto("/admin/app-admin-portal/settings/branding");
    await page.selectOption('select[id="complexSelect"]', "1");
    await page.fill(
      'input[name="logoUrl"]',
      "https://example.com/new_logo.png",
    );
    await page.fill('input[name="primaryColor"]', "#FF0000");
    await page.fill('input[name="secondaryColor"]', "#00FF00");
    await page.click('button:has-text("Guardar Cambios")');
    await expect(
      page.locator("text=Configuración de marca actualizada correctamente."),
    ).toBeVisible();
  });
});
