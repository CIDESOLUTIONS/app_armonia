/**
 * Pruebas E2E mejoradas para el sistema PQR
 *
 * Estas pruebas verifican los flujos completos de usuario en el sistema PQR,
 * desde la creación hasta la resolución de solicitudes, incluyendo todos
 * los roles y escenarios principales.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { test, expect } from '@playwright/test';
// Datos de prueba
const testUsers = {
    resident: {
        email: 'residente@example.com',
        password: 'password123',
        name: 'Juan Pérez'
    },
    admin: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin Principal'
    },
    staff: {
        email: 'tecnico@example.com',
        password: 'tecnico123',
        name: 'Técnico Mantenimiento'
    }
};
// Datos para PQR de prueba
const testPQRs = {
    maintenance: {
        title: 'Fuga de agua en baño comunal',
        description: 'Hay una fuga de agua importante en el baño del primer piso que requiere atención urgente.',
        type: 'COMPLAINT',
        location: 'Baño primer piso',
        category: 'MAINTENANCE',
        subcategory: 'Plomería',
        priority: 'HIGH'
    },
    security: {
        title: 'Cámara de seguridad no funciona',
        description: 'La cámara de seguridad del parqueadero no está funcionando desde ayer.',
        type: 'COMPLAINT',
        location: 'Parqueadero nivel 1',
        category: 'SECURITY',
        subcategory: 'Videovigilancia',
        priority: 'MEDIUM'
    }
};
// Clase auxiliar para Page Objects
class PQRPage {
    constructor(page) {
        this.page = page;
    }
    // Navegación
    gotoLoginPage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('/login');
        });
    }
    gotoDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('/dashboard');
        });
    }
    gotoPQRList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('/dashboard/pqr');
        });
    }
    gotoPQRCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('/dashboard/pqr/create');
        });
    }
    gotoPQRDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(`/dashboard/pqr/${id}`);
        });
    }
    gotoMetricsDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('/dashboard/pqr/metrics');
        });
    }
    // Acciones de autenticación
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoLoginPage();
            yield this.page.fill('input[name="email"]', email);
            yield this.page.fill('input[name="password"]', password);
            yield this.page.click('button[type="submit"]');
            // Esperar a que se complete el login
            yield this.page.waitForNavigation();
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.click('button[aria-label="Abrir menú de usuario"]');
            yield this.page.click('button:has-text("Cerrar Sesión")');
            // Esperar a que se complete el logout
            yield this.page.waitForNavigation();
        });
    }
    // Acciones de PQR
    createPQR(pqrData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRCreate();
            // Llenar formulario
            yield this.page.selectOption('select[name="type"]', pqrData.type);
            yield this.page.fill('input[name="title"]', pqrData.title);
            yield this.page.fill('textarea[name="description"]', pqrData.description);
            yield this.page.fill('input[name="location"]', pqrData.location);
            // Opcional: Subir archivo adjunto si está disponible
            const fileUploadHandle = this.page.locator('input[type="file"]');
            if (yield fileUploadHandle.isVisible()) {
                // await fileUploadHandle.setInputFiles('path/to/test/image.jpg');
            }
            // Enviar formulario
            yield this.page.click('button[type="submit"]');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
            // Obtener número de ticket del mensaje de confirmación
            const alertText = yield this.page.locator('div.alert-success').textContent();
            const ticketNumberMatch = alertText === null || alertText === void 0 ? void 0 : alertText.match(/PQR-\d+-\d+/);
            return ticketNumberMatch ? ticketNumberMatch[0] : '';
        });
    }
    categorizePQR(id, category, priority, subcategory) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRDetail(id);
            yield this.page.click('button:has-text("Categorizar")');
            yield this.page.selectOption('select[name="category"]', category);
            yield this.page.selectOption('select[name="priority"]', priority);
            if (subcategory) {
                yield this.page.fill('input[name="subcategory"]', subcategory);
            }
            yield this.page.click('button:has-text("Guardar")');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
        });
    }
    assignPQR(id, assignType, assignId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRDetail(id);
            yield this.page.click('button:has-text("Asignar")');
            yield this.page.selectOption('select[name="assignType"]', assignType);
            if (assignType === 'user') {
                yield this.page.selectOption('select[name="assignUserId"]', assignId);
            }
            else {
                yield this.page.selectOption('select[name="assignTeamId"]', assignId);
            }
            yield this.page.click('button:has-text("Guardar")');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
        });
    }
    changeStatus(id, status, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRDetail(id);
            yield this.page.click('button:has-text("Cambiar Estado")');
            yield this.page.selectOption('select[name="status"]', status);
            yield this.page.fill('textarea[name="comment"]', comment);
            yield this.page.click('button:has-text("Guardar")');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
        });
    }
    ratePQR(id, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRDetail(id);
            yield this.page.click('button:has-text("Calificar")');
            yield this.page.click(`div.rating span:nth-child(${rating})`);
            yield this.page.fill('textarea[name="comment"]', comment);
            yield this.page.click('button:has-text("Enviar")');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
        });
    }
    reopenPQR(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRDetail(id);
            yield this.page.click('button:has-text("Reabrir")');
            yield this.page.fill('textarea[name="reopenReason"]', reason);
            yield this.page.click('button:has-text("Confirmar")');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
        });
    }
    closePQR(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRDetail(id);
            yield this.page.click('button:has-text("Cerrar Solicitud")');
            yield this.page.click('button:has-text("Confirmar")');
            // Esperar confirmación
            yield this.page.waitForSelector('div.alert-success');
        });
    }
    // Verificaciones
    verifyPQRExists(ticketNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRList();
            yield this.page.fill('input[placeholder="Buscar"]', ticketNumber);
            yield this.page.click('button:has-text("Buscar")');
            yield expect(this.page.locator(`tr:has-text("${ticketNumber}")`)).toBeVisible();
        });
    }
    verifyPQRStatus(ticketNumber, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoPQRList();
            yield this.page.fill('input[placeholder="Buscar"]', ticketNumber);
            yield this.page.click('button:has-text("Buscar")');
            yield expect(this.page.locator(`tr:has-text("${ticketNumber}")`)).toContainText(status);
        });
    }
    verifyMetricsDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gotoMetricsDashboard();
            // Verificar componentes del dashboard
            yield expect(this.page.locator('div.card:has-text("Resumen")')).toBeVisible();
            yield expect(this.page.locator('div.chart-container')).toHaveCount(4);
            yield expect(this.page.locator('table:has-text("Cumplimiento de SLA")')).toBeVisible();
        });
    }
}
test.describe('Sistema PQR - Flujos E2E', () => {
    let pqrPage;
    let ticketNumber;
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        pqrPage = new PQRPage(page);
    }));
    test('Flujo completo: Creación, asignación y resolución de PQR', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        pqrPage = new PQRPage(page);
        // 1. Login como residente
        yield pqrPage.login(testUsers.resident.email, testUsers.resident.password);
        // Verificar que estamos en el dashboard de residente
        yield expect(page.locator('h1:has-text("Dashboard de Residente")')).toBeVisible();
        // 2. Crear nuevo PQR
        ticketNumber = yield pqrPage.createPQR(testPQRs.maintenance);
        // Verificar que el PQR aparece en la lista
        yield pqrPage.verifyPQRExists(ticketNumber);
        // 3. Cerrar sesión como residente
        yield pqrPage.logout();
        // 4. Login como administrador
        yield pqrPage.login(testUsers.admin.email, testUsers.admin.password);
        // Verificar que estamos en el dashboard de administrador
        yield expect(page.locator('h1:has-text("Dashboard de Administración")')).toBeVisible();
        // 5. Buscar el PQR creado
        yield pqrPage.gotoPQRList();
        yield page.fill('input[placeholder="Buscar"]', ticketNumber);
        yield page.click('button:has-text("Buscar")');
        // Verificar que se encuentra el PQR
        yield expect(page.locator(`tr:has-text("${ticketNumber}")`)).toBeVisible();
        // 6. Categorizar el PQR
        yield pqrPage.categorizePQR(ticketNumber, testPQRs.maintenance.category, testPQRs.maintenance.priority, testPQRs.maintenance.subcategory);
        // 7. Asignar a técnico
        yield pqrPage.assignPQR(ticketNumber, 'user', '10'); // ID del técnico
        // Verificar estado asignado
        yield pqrPage.verifyPQRStatus(ticketNumber, 'ASSIGNED');
        // 8. Cerrar sesión como administrador
        yield pqrPage.logout();
        // 9. Login como técnico
        yield pqrPage.login(testUsers.staff.email, testUsers.staff.password);
        // 10. Cambiar estado a "En Progreso"
        yield pqrPage.changeStatus(ticketNumber, 'IN_PROGRESS', 'Se ha enviado un técnico para revisar la fuga');
        // Verificar estado en progreso
        yield pqrPage.verifyPQRStatus(ticketNumber, 'IN_PROGRESS');
        // 11. Resolver el PQR
        yield pqrPage.changeStatus(ticketNumber, 'RESOLVED', 'Se ha reparado la fuga de agua y verificado su correcto funcionamiento');
        // Verificar estado resuelto
        yield pqrPage.verifyPQRStatus(ticketNumber, 'RESOLVED');
        // 12. Cerrar sesión como técnico
        yield pqrPage.logout();
        // 13. Login nuevamente como residente para verificar
        yield pqrPage.login(testUsers.resident.email, testUsers.resident.password);
        // Verificar estado resuelto
        yield pqrPage.verifyPQRStatus(ticketNumber, 'RESOLVED');
        // 14. Calificar la resolución
        yield pqrPage.ratePQR(ticketNumber, 5, 'Excelente servicio, rápido y efectivo');
        // 15. Cerrar el PQR
        yield pqrPage.closePQR(ticketNumber);
        // Verificar estado cerrado
        yield pqrPage.verifyPQRStatus(ticketNumber, 'CLOSED');
    }));
    test('Flujo de reapertura: Resolución, reapertura y resolución final', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        pqrPage = new PQRPage(page);
        // 1. Login como residente
        yield pqrPage.login(testUsers.resident.email, testUsers.resident.password);
        // 2. Crear nuevo PQR
        ticketNumber = yield pqrPage.createPQR(testPQRs.security);
        // 3. Cerrar sesión como residente
        yield pqrPage.logout();
        // 4. Login como administrador
        yield pqrPage.login(testUsers.admin.email, testUsers.admin.password);
        // 5. Categorizar y asignar el PQR
        yield pqrPage.categorizePQR(ticketNumber, testPQRs.security.category, testPQRs.security.priority, testPQRs.security.subcategory);
        yield pqrPage.assignPQR(ticketNumber, 'team', '3'); // ID del equipo de seguridad
        // 6. Cambiar estado a "En Progreso"
        yield pqrPage.changeStatus(ticketNumber, 'IN_PROGRESS', 'Se ha enviado un técnico para revisar la cámara');
        // 7. Resolver el PQR (primera resolución)
        yield pqrPage.changeStatus(ticketNumber, 'RESOLVED', 'Se ha reiniciado la cámara y está funcionando correctamente');
        // 8. Cerrar sesión como administrador
        yield pqrPage.logout();
        // 9. Login como residente
        yield pqrPage.login(testUsers.resident.email, testUsers.resident.password);
        // 10. Reabrir el PQR
        yield pqrPage.reopenPQR(ticketNumber, 'La cámara volvió a fallar después de unas horas');
        // Verificar estado reabierto
        yield pqrPage.verifyPQRStatus(ticketNumber, 'REOPENED');
        // 11. Cerrar sesión como residente
        yield pqrPage.logout();
        // 12. Login como administrador
        yield pqrPage.login(testUsers.admin.email, testUsers.admin.password);
        // 13. Aumentar prioridad y reasignar
        yield pqrPage.categorizePQR(ticketNumber, testPQRs.security.category, 'HIGH', // Aumentar prioridad
        testPQRs.security.subcategory);
        yield pqrPage.assignPQR(ticketNumber, 'user', '12'); // ID del especialista
        // 14. Cambiar estado a "En Progreso"
        yield pqrPage.changeStatus(ticketNumber, 'IN_PROGRESS', 'Se ha enviado un especialista para revisar el problema a fondo');
        // 15. Resolver el PQR (resolución final)
        yield pqrPage.changeStatus(ticketNumber, 'RESOLVED', 'Se ha reemplazado la cámara defectuosa por una nueva y se ha verificado su funcionamiento');
        // 16. Cerrar sesión como administrador
        yield pqrPage.logout();
        // 17. Login como residente
        yield pqrPage.login(testUsers.resident.email, testUsers.resident.password);
        // 18. Calificar y cerrar
        yield pqrPage.ratePQR(ticketNumber, 5, 'Excelente solución definitiva');
        yield pqrPage.closePQR(ticketNumber);
        // Verificar estado cerrado
        yield pqrPage.verifyPQRStatus(ticketNumber, 'CLOSED');
    }));
    test('Dashboard de métricas PQR', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        pqrPage = new PQRPage(page);
        // 1. Login como administrador
        yield pqrPage.login(testUsers.admin.email, testUsers.admin.password);
        // 2. Verificar dashboard de métricas
        yield pqrPage.verifyMetricsDashboard();
        // 3. Aplicar filtros
        yield page.click('button:has-text("Filtros")');
        // Filtrar por fecha (último mes)
        yield page.click('text=Último mes');
        // Filtrar por categoría
        yield page.selectOption('select[name="category"]', 'MAINTENANCE');
        // Aplicar filtros
        yield page.click('button:has-text("Aplicar")');
        // Verificar que se actualizan los datos
        yield expect(page.locator('div.loading-indicator')).not.toBeVisible();
        // 4. Exportar reporte
        yield page.click('button:has-text("Exportar")');
        yield page.click('a:has-text("Exportar a Excel")');
        // Verificar descarga (esto puede variar según la implementación)
        // await expect(page.locator('div.alert-success')).toContainText('Reporte exportado correctamente');
    }));
    test('Flujo de notificaciones y recordatorios', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        pqrPage = new PQRPage(page);
        // 1. Login como administrador
        yield pqrPage.login(testUsers.admin.email, testUsers.admin.password);
        // 2. Ir a la sección de notificaciones
        yield page.click('a:has-text("Notificaciones")');
        // Verificar que hay notificaciones
        yield expect(page.locator('div.notification-list')).toBeVisible();
        // 3. Verificar recordatorios de vencimiento
        yield page.click('a:has-text("Recordatorios")');
        // Verificar que hay recordatorios
        yield expect(page.locator('div.reminder-list')).toBeVisible();
        // 4. Configurar notificaciones automáticas
        yield page.click('a:has-text("Configuración")');
        yield page.click('button:has-text("Notificaciones")');
        // Activar todas las notificaciones
        yield page.check('input[name="autoNotifyEnabled"]');
        yield page.check('input[name="emailNotificationsEnabled"]');
        yield page.check('input[name="pushNotificationsEnabled"]');
        yield page.check('input[name="smsNotificationsEnabled"]');
        // Guardar configuración
        yield page.click('button:has-text("Guardar")');
        // Verificar confirmación
        yield expect(page.locator('div.alert-success')).toBeVisible();
    }));
    test('Prueba de responsividad en dispositivos móviles', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Esta prueba se ejecutará en los proyectos móviles definidos en la configuración
        pqrPage = new PQRPage(page);
        // 1. Login como residente
        yield pqrPage.login(testUsers.resident.email, testUsers.resident.password);
        // 2. Verificar que el menú móvil está presente
        yield expect(page.locator('button.mobile-menu-button')).toBeVisible();
        // 3. Abrir menú móvil
        yield page.click('button.mobile-menu-button');
        // 4. Navegar a PQR
        yield page.click('a:has-text("PQR")');
        // 5. Verificar que la lista de PQR se muestra correctamente
        yield expect(page.locator('div.pqr-list')).toBeVisible();
        // 6. Crear nuevo PQR desde móvil
        yield page.click('button:has-text("Nueva Solicitud")');
        // Verificar que el formulario se adapta correctamente
        yield expect(page.locator('form.pqr-form')).toBeVisible();
        // 7. Llenar formulario
        yield page.selectOption('select[name="type"]', testPQRs.maintenance.type);
        yield page.fill('input[name="title"]', testPQRs.maintenance.title);
        yield page.fill('textarea[name="description"]', testPQRs.maintenance.description);
        // 8. Enviar formulario
        yield page.click('button[type="submit"]');
        // Verificar confirmación
        yield expect(page.locator('div.alert-success')).toBeVisible();
    }));
});
