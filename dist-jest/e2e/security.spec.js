var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Pruebas E2E para el módulo de Seguridad
 *
 * Estas pruebas verifican el flujo completo del sistema de minutas digitales:
 * registro por guardias, consulta por administradores y gestión de incidentes.
 */
import { test, expect } from '@playwright/test';
// Datos de prueba
const testUsers = {
    admin: {
        email: 'admin.seguridad@test.com',
        password: 'SecurityAdmin123!',
        name: 'Admin Seguridad'
    },
    guard1: {
        email: 'guardia1@test.com',
        password: 'Guard123!',
        name: 'Carlos Guardia Día',
        shift: 'DAY'
    },
    guard2: {
        email: 'guardia2@test.com',
        password: 'Guard456!',
        name: 'Ana Guardia Noche',
        shift: 'NIGHT'
    }
};
const testIncidents = [
    {
        type: 'ROUTINE_CHECK',
        title: 'Ronda de Seguridad - Turno Día',
        description: 'Ronda rutinaria completada. Todas las áreas revisadas sin novedad. Puertas y ventanas seguras.',
        location: 'Todo el conjunto',
        severity: 'LOW',
        status: 'RESOLVED',
        time: '08:30'
    },
    {
        type: 'INCIDENT',
        title: 'Vehículo Sospechoso en Parqueadero',
        description: 'Se observó vehículo con placas ABC-123 estacionado en zona de visitantes por más de 4 horas sin autorización.',
        location: 'Parqueadero visitantes',
        severity: 'MEDIUM',
        status: 'PENDING',
        time: '14:15',
        actions: 'Se tomó foto de placas y se reportó a administración'
    },
    {
        type: 'EMERGENCY',
        title: 'Fuga de Gas en Torre B',
        description: 'Residente del apartamento 502 reportó fuerte olor a gas. Se evacuó el piso y se contactó empresa de gas.',
        location: 'Torre B - Piso 5',
        severity: 'HIGH',
        status: 'IN_PROGRESS',
        time: '20:45',
        actions: 'Evacuación inmediata, contacto con bomberos y empresa de gas'
    }
];
const testVisitors = [
    {
        name: 'Juan Pérez Visitante',
        dni: '12345678',
        phone: '3001234567',
        visitingUnit: 'Apto 301',
        purpose: 'Visita familiar',
        entryTime: '16:30',
        vehiclePlate: 'XYZ-789'
    },
    {
        name: 'María Técnico',
        dni: '87654321',
        phone: '3009876543',
        visitingUnit: 'Administración',
        purpose: 'Mantenimiento elevadores',
        entryTime: '09:00',
        company: 'Elevadores Express SAS'
    }
];
test.describe('Seguridad - Minutas Digitales y Control de Acceso', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test.setTimeout(60000);
        yield page.goto('/');
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo: Guardia registra minuta y admin consulta', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Login como guardia de día
        yield test.step('Login como guardia de día', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/login');
            yield page.fill('input[name="email"], input[type="email"]', testUsers.guard1.email);
            yield page.fill('input[name="password"], input[type="password"]', testUsers.guard1.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|guard|security/);
        }));
        // PASO 2: Registrar incidente rutinario
        yield test.step('Registrar ronda de seguridad rutinaria', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar al módulo de seguridad/minutas
            const securityLink = page.locator('a:has-text("Seguridad"), a:has-text("Minutas"), [href*="security"]').first();
            yield expect(securityLink).toBeVisible({ timeout: 10000 });
            yield securityLink.click();
            yield page.waitForLoadState('networkidle');
            // Crear nueva minuta/incidente
            const newIncidentButton = page.locator('button:has-text("Nuevo"), button:has-text("Registrar"), button:has-text("Crear")').first();
            yield expect(newIncidentButton).toBeVisible();
            yield newIncidentButton.click();
            // Llenar formulario de incidente rutinario
            const routineIncident = testIncidents[0];
            const typeSelect = page.locator('select[name="type"], #incident-type').first();
            if (yield typeSelect.isVisible()) {
                yield typeSelect.selectOption(routineIncident.type);
            }
            yield page.fill('input[name="title"], #incident-title', routineIncident.title);
            yield page.fill('textarea[name="description"], #incident-description', routineIncident.description);
            yield page.fill('input[name="location"], #incident-location', routineIncident.location);
            yield page.fill('input[name="time"], input[type="time"], #incident-time', routineIncident.time);
            const severitySelect = page.locator('select[name="severity"], #incident-severity').first();
            if (yield severitySelect.isVisible()) {
                yield severitySelect.selectOption(routineIncident.severity);
            }
            // Guardar incidente
            const saveButton = page.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Registrar")').first();
            yield saveButton.click();
            yield expect(page.locator('text=/registrado/i, text=/guardado/i, text=/éxito/i')).toBeVisible({ timeout: 15000 });
        }));
        // PASO 3: Registrar visitante
        yield test.step('Registrar entrada de visitante', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a control de visitantes
            const visitorsLink = page.locator('a:has-text("Visitantes"), a:has-text("Control"), [href*="visitor"]').first();
            if (yield visitorsLink.isVisible()) {
                yield visitorsLink.click();
            }
            else {
                // Buscar en el módulo de seguridad
                yield page.locator('button:has-text("Visitantes"), .visitor-control').first().click();
            }
            yield page.waitForLoadState('networkidle');
            // Registrar nuevo visitante
            const registerVisitorButton = page.locator('button:has-text("Registrar"), button:has-text("Nuevo")').first();
            yield registerVisitorButton.click();
            // Llenar datos del visitante
            const visitor = testVisitors[0];
            yield page.fill('input[name="visitorName"], #visitor-name', visitor.name);
            yield page.fill('input[name="visitorDni"], #visitor-dni', visitor.dni);
            yield page.fill('input[name="visitorPhone"], #visitor-phone', visitor.phone);
            yield page.fill('input[name="visitingUnit"], #visiting-unit', visitor.visitingUnit);
            yield page.fill('input[name="purpose"], #visit-purpose', visitor.purpose);
            yield page.fill('input[name="vehiclePlate"], #vehicle-plate', visitor.vehiclePlate);
            // Registrar entrada
            const registerEntryButton = page.locator('button[type="submit"], button:has-text("Registrar Entrada")').first();
            yield registerEntryButton.click();
            yield expect(page.locator('text=/visitante.*registrado/i, text=/entrada.*autorizada/i')).toBeVisible();
        }));
        // PASO 4: Registrar incidente de severidad media
        yield test.step('Registrar incidente con vehículo sospechoso', () => __awaiter(void 0, void 0, void 0, function* () {
            // Volver a minutas/incidentes
            yield page.locator('a:has-text("Minutas"), a:has-text("Incidentes")').first().click();
            const newIncidentButton = page.locator('button:has-text("Nuevo"), button:has-text("Registrar")').first();
            yield newIncidentButton.click();
            // Llenar incidente de severidad media
            const mediumIncident = testIncidents[1];
            const typeSelect = page.locator('select[name="type"]').first();
            if (yield typeSelect.isVisible()) {
                yield typeSelect.selectOption(mediumIncident.type);
            }
            yield page.fill('input[name="title"]', mediumIncident.title);
            yield page.fill('textarea[name="description"]', mediumIncident.description);
            yield page.fill('input[name="location"]', mediumIncident.location);
            yield page.fill('input[name="time"]', mediumIncident.time);
            const severitySelect = page.locator('select[name="severity"]').first();
            if (yield severitySelect.isVisible()) {
                yield severitySelect.selectOption(mediumIncident.severity);
            }
            // Agregar acciones tomadas
            const actionsField = page.locator('textarea[name="actions"], #incident-actions').first();
            if (yield actionsField.isVisible()) {
                yield actionsField.fill(mediumIncident.actions);
            }
            // Guardar incidente
            yield page.locator('button[type="submit"]').first().click();
            yield expect(page.locator('text=/registrado/i')).toBeVisible();
        }));
        // PASO 5: Finalizar turno
        yield test.step('Finalizar turno de guardia', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar opción de finalizar turno
            const endShiftButton = page.locator('button:has-text("Finalizar Turno"), button:has-text("Cerrar Turno")').first();
            if (yield endShiftButton.isVisible()) {
                yield endShiftButton.click();
                // Confirmar finalización
                const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Sí")').first();
                if (yield confirmButton.isVisible()) {
                    yield confirmButton.click();
                }
                yield expect(page.locator('text=/turno.*finalizado/i, text=/minuta.*cerrada/i')).toBeVisible();
            }
        }));
        // PASO 6: Logout del guardia y login como admin
        yield test.step('Cambiar a usuario administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            // Logout
            const logoutButton = page.locator('button:has-text("Salir"), a:has-text("Cerrar")').first();
            if (yield logoutButton.isVisible()) {
                yield logoutButton.click();
            }
            else {
                yield page.goto('/logout');
            }
            yield page.waitForLoadState('networkidle');
            // Login como administrador
            yield page.goto('/login');
            yield page.fill('input[name="email"]', testUsers.admin.email);
            yield page.fill('input[name="password"]', testUsers.admin.password);
            yield page.locator('button[type="submit"]').click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|admin/);
        }));
        // PASO 7: Consultar minutas del día
        yield test.step('Admin consulta minutas del día', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar al módulo de seguridad
            const securityLink = page.locator('a:has-text("Seguridad"), a:has-text("Minutas"), [href*="security"]').first();
            yield securityLink.click();
            yield page.waitForLoadState('networkidle');
            // Verificar que aparecen los incidentes registrados
            yield expect(page.locator(`text="${testIncidents[0].title}"`)).toBeVisible();
            yield expect(page.locator(`text="${testIncidents[1].title}"`)).toBeVisible();
            // Verificar información de guardias
            yield expect(page.locator(`text="${testUsers.guard1.name}"`)).toBeVisible();
        }));
        // PASO 8: Ver detalle de incidente
        yield test.step('Ver detalle de incidente específico', () => __awaiter(void 0, void 0, void 0, function* () {
            // Hacer clic en el incidente de vehículo sospechoso
            yield page.locator(`text="${testIncidents[1].title}"`).click();
            // Verificar que se abre el detalle
            yield expect(page.locator(`text="${testIncidents[1].description}"`)).toBeVisible();
            yield expect(page.locator(`text="${testIncidents[1].actions}"`)).toBeVisible();
            yield expect(page.locator('text=/medium/i, text=/medio/i')).toBeVisible();
        }));
        // PASO 9: Generar reporte de seguridad
        yield test.step('Generar reporte de seguridad del día', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar opción de reportes
            const reportsButton = page.locator('button:has-text("Reporte"), button:has-text("Exportar"), a:has-text("Reportes")').first();
            if (yield reportsButton.isVisible()) {
                yield reportsButton.click();
                // Seleccionar período (día actual)
                const todayOption = page.locator('option:has-text("Hoy"), input[value="today"]').first();
                if (yield todayOption.isVisible()) {
                    yield todayOption.click();
                }
                // Generar reporte
                const generateButton = page.locator('button:has-text("Generar"), button:has-text("Crear Reporte")').first();
                if (yield generateButton.isVisible()) {
                    yield generateButton.click();
                    // Verificar que se genera el reporte
                    yield expect(page.locator('text=/reporte.*generado/i, text=/descarga/i')).toBeVisible({ timeout: 15000 });
                }
            }
        }));
    }));
    test('Registro de emergencia por guardia nocturno', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Login como guardia nocturno
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.guard2.email);
        yield page.fill('input[name="password"]', testUsers.guard2.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // PASO 2: Registrar emergencia
        yield page.locator('a:has-text("Seguridad")').first().click();
        yield page.locator('button:has-text("Nuevo")').first().click();
        const emergency = testIncidents[2];
        // Llenar formulario de emergencia
        const typeSelect = page.locator('select[name="type"]').first();
        if (yield typeSelect.isVisible()) {
            yield typeSelect.selectOption(emergency.type);
        }
        yield page.fill('input[name="title"]', emergency.title);
        yield page.fill('textarea[name="description"]', emergency.description);
        yield page.fill('input[name="location"]', emergency.location);
        yield page.fill('input[name="time"]', emergency.time);
        const severitySelect = page.locator('select[name="severity"]').first();
        if (yield severitySelect.isVisible()) {
            yield severitySelect.selectOption(emergency.severity);
        }
        yield page.fill('textarea[name="actions"]', emergency.actions);
        // Marcar como emergencia/prioridad alta
        const emergencyCheckbox = page.locator('input[name="isEmergency"], input[type="checkbox"]').first();
        if (yield emergencyCheckbox.isVisible()) {
            yield emergencyCheckbox.check();
        }
        // Guardar emergencia
        yield page.locator('button[type="submit"]').first().click();
        // Verificar alerta de emergencia
        yield expect(page.locator('text=/emergencia.*registrada/i, text=/alerta.*enviada/i')).toBeVisible();
    }));
    test('Control de salida de visitantes', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como guardia
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.guard1.email);
        yield page.fill('input[name="password"]', testUsers.guard1.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a control de visitantes
        yield page.locator('a:has-text("Visitantes")').first().click();
        // Ver visitantes activos
        const activeVisitorsTab = page.locator('tab:has-text("Activos"), button:has-text("En el conjunto")').first();
        if (yield activeVisitorsTab.isVisible()) {
            yield activeVisitorsTab.click();
        }
        // Registrar salida de visitante
        const visitor = testVisitors[0];
        const exitButton = page.locator(`text="${visitor.name}"~button:has-text("Salida"), .exit-button`).first();
        if (yield exitButton.isVisible()) {
            yield exitButton.click();
            // Confirmar salida
            const confirmExitButton = page.locator('button:has-text("Confirmar Salida")').first();
            if (yield confirmExitButton.isVisible()) {
                yield confirmExitButton.click();
                yield expect(page.locator('text=/salida.*registrada/i')).toBeVisible();
            }
        }
    }));
    test('Búsqueda y filtros en histórico de minutas', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como admin
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a seguridad
        yield page.locator('a:has-text("Seguridad")').first().click();
        // Acceder a histórico
        const historyTab = page.locator('tab:has-text("Histórico"), a:has-text("Ver Todo")').first();
        if (yield historyTab.isVisible()) {
            yield historyTab.click();
        }
        // Aplicar filtro por severidad
        const severityFilter = page.locator('select[name="severity"], #severity-filter').first();
        if (yield severityFilter.isVisible()) {
            yield severityFilter.selectOption('HIGH');
            // Verificar que se filtran los resultados
            yield expect(page.locator('text=/emergency/i, text=/alta/i')).toBeVisible();
        }
        // Búsqueda por texto
        const searchInput = page.locator('input[name="search"], #search-input').first();
        if (yield searchInput.isVisible()) {
            yield searchInput.fill('vehículo');
            // Verificar resultados de búsqueda
            yield expect(page.locator('text="Vehículo Sospechoso"')).toBeVisible();
        }
    }));
});
