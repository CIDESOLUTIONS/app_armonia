import { test, expect } from "@playwright/test";

const testUsers = {
  admin: {
    email: "admin.financiero@test.com", // Usar un admin existente
    password: "FinAdmin123!",
  },
  resident: {
    email: "residente.test@email.com",
    password: "Resident123!",
  },
};

const testAssembly = {
  title: "Asamblea General Ordinaria Julio 2025",
  description: "Discusión y aprobación del presupuesto anual.",
  location: "Salón Comunal",
  type: "ORDINARY",
  agenda:
    "1. Verificación de Quórum\n2. Lectura y Aprobación de Acta Anterior\n3. Presentación y Aprobación de Presupuesto 2025\n4. Elección de Consejo de Administración\n5. Varios",
};

test.describe("Módulo de Democracia Digital (Asambleas)", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // Aumentar timeout para WebSockets
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Debe permitir al administrador crear y gestionar una asamblea", async ({
    page,
  }) => {
    // Login como administrador
    await test.step("Login como administrador", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.admin.email);
      await page.fill('input[name="password"]', testUsers.admin.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|admin/);
    });

    // Navegar a Asambleas
    await test.step("Navegar a Asambleas", async () => {
      await page.locator('a:has-text("Asambleas")').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*assemblies/);
    });

    // Crear nueva asamblea
    let assemblyId: string;
    await test.step("Crear nueva asamblea", async () => {
      await page.locator('button:has-text("Crear Asamblea")').click();
      await expect(page).toHaveURL(/.*assemblies\/create/);

      await page.fill('input[name="title"]', testAssembly.title);
      await page.fill('textarea[name="description"]', testAssembly.description);
      await page.fill('input[name="location"]', testAssembly.location);
      await page.fill('input[name="scheduledDate"]', "2025-07-20T10:00"); // Fecha y hora futura
      await page.selectOption('select[name="type"]', testAssembly.type);
      await page.fill('textarea[name="agenda"]', testAssembly.agenda);

      await page.locator('button[type="submit"]').click();
      await expect(
        page.locator("text=Asamblea creada exitosamente."),
      ).toBeVisible();
      await page.waitForURL(/.*assemblies\/\d+\/view/); // Esperar a la página de detalles
      assemblyId = page.url().split("/").pop().split("/view")[0];
    });

    // Verificar detalles de la asamblea
    await test.step("Verificar detalles de la asamblea", async () => {
      await expect(
        page.locator(`h1:has-text("${testAssembly.title}")`),
      ).toBeVisible();
      await expect(page.locator(`text=${testAssembly.location}`)).toBeVisible();
    });

    // Simular registro de asistencia y votación
    await test.step("Simular registro de asistencia y votación", async () => {
      // Asume que el admin puede cambiar el estado de la asamblea a 'IN_PROGRESS'
      // Esto requeriría un botón o acción en la UI que no está en el placeholder
      // Por ahora, simularemos la interacción directa con los botones

      // Registrar asistencia
      await page.locator('button:has-text("Registrar mi Asistencia")').click();
      await expect(
        page.locator("text=Tu asistencia ha sido registrada."),
      ).toBeVisible();

      // Iniciar votación
      await page.locator('button:has-text("Iniciar Nueva Votación")').click();
      await expect(
        page.locator("text=Se ha iniciado una nueva votación."),
      ).toBeVisible();
      await expect(
        page.locator('h3:has-text("¿Aprueba el presupuesto 2025?")'),
      ).toBeVisible();

      // Votar
      await page.locator('button:has-text("Sí")').click();
      await expect(
        page.locator("text=Tu voto ha sido registrado."),
      ).toBeVisible();

      // Ver resultados (si el botón está disponible)
      const viewResultsButton = page.locator(
        'button:has-text("Ver Resultados")',
      );
      if (await viewResultsButton.isVisible()) {
        await viewResultsButton.click();
        await expect(page.locator('h4:has-text("Resultados:")')).toBeVisible();
      }

      // Generar acta (asume que el admin puede cambiar el estado a 'COMPLETED')
      const generateMinutesButton = page.locator(
        'button:has-text("Generar Borrador de Acta")',
      );
      if (await generateMinutesButton.isVisible()) {
        await generateMinutesButton.click();
        await expect(
          page.locator("text=El borrador del acta ha sido generado."),
        ).toBeVisible();
      }
    });
  });

  test("Debe permitir a un residente participar en una asamblea", async ({
    page,
  }) => {
    // Precondición: Una asamblea debe estar creada y en progreso
    // Esto se puede hacer a través de la API o un test.beforeAll

    // Login como residente
    await test.step("Login como residente", async () => {
      await page.goto("/login");
      await page.fill('input[name="email"]', testUsers.resident.email);
      await page.fill('input[name="password"]', testUsers.resident.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*dashboard|resident/);
    });

    // Navegar a Asambleas
    await test.step("Navegar a Asambleas", async () => {
      await page.locator('a:has-text("Asambleas")').click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*assemblies/);
    });

    // Acceder a una asamblea activa (asume que hay una visible)
    await test.step("Acceder a una asamblea activa", async () => {
      await page.locator('a:has-text("Ver Detalles")').first().click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/.*assemblies\/\d+\/view/);
    });

    // Registrar asistencia
    await test.step("Registrar asistencia", async () => {
      await page.locator('button:has-text("Registrar mi Asistencia")').click();
      await expect(
        page.locator("text=Tu asistencia ha sido registrada."),
      ).toBeVisible();
    });

    // Participar en votación (asume que hay una votación activa)
    await test.step("Participar en votación", async () => {
      await expect(
        page.locator('h3:has-text("¿Aprueba el presupuesto 2025?")'),
      ).toBeVisible();
      await page.locator('button:has-text("Sí")').click();
      await expect(
        page.locator("text=Tu voto ha sido registrado."),
      ).toBeVisible();
    });
  });
});
