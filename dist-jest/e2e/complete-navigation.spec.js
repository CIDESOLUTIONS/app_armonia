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
 * Pruebas E2E para Navegación Completa del Sistema Armonía
 *
 * Estas pruebas verifican el flujo completo desde landing page:
 * - Landing page inicial
 * - Selector de portales (Administrador, Residente, Recepción)
 * - Proceso de login para cada tipo de usuario
 * - Navegación completa del dashboard con menú lateral colapsable
 * - Verificación de todas las funcionalidades del menú lateral
 */
import { test, expect } from '@playwright/test';
// Datos de usuarios de prueba para cada portal
const testUsers = {
    admin: {
        email: 'admin.completo@test.com',
        password: 'AdminComplete123!',
        name: 'Administrador Completo',
        role: 'ADMIN'
    },
    resident: {
        email: 'residente.completo@test.com',
        password: 'ResidentComplete123!',
        name: 'Juan Pérez Residente',
        role: 'RESIDENT',
        unit: 'Apto 301'
    },
    reception: {
        email: 'recepcion.completa@test.com',
        password: 'ReceptionComplete123!',
        name: 'María García Recepcionista',
        role: 'RECEPTION'
    }
};
// Elementos del menú lateral por tipo de usuario
const menuItems = {
    admin: [
        { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { name: 'Inventario', href: '/inventory', icon: 'inventory' },
        { name: 'Finanzas', href: '/finances', icon: 'finances' },
        { name: 'Asambleas', href: '/assemblies', icon: 'assemblies' },
        { name: 'PQR', href: '/pqr', icon: 'pqr' },
        { name: 'Seguridad', href: '/security', icon: 'security' },
        { name: 'Reservas', href: '/reservations', icon: 'reservations' },
        { name: 'Comunicaciones', href: '/communications', icon: 'communications' },
        { name: 'Servicios', href: '/services', icon: 'services' },
        { name: 'Cámaras', href: '/cameras', icon: 'cameras' },
        { name: 'Visitantes', href: '/visitors', icon: 'visitors' },
        { name: 'Reportes', href: '/reports', icon: 'reports' },
        { name: 'Configuración', href: '/settings', icon: 'settings' }
    ],
    resident: [
        { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { name: 'Mi Cuenta', href: '/account', icon: 'account' },
        { name: 'Pagos', href: '/payments', icon: 'payments' },
        { name: 'PQR', href: '/pqr', icon: 'pqr' },
        { name: 'Reservas', href: '/reservations', icon: 'reservations' },
        { name: 'Comunicaciones', href: '/communications', icon: 'communications' },
        { name: 'Documentos', href: '/documents', icon: 'documents' },
        { name: 'Votaciones', href: '/voting', icon: 'voting' },
        { name: 'Visitantes', href: '/visitors', icon: 'visitors' }
    ],
    reception: [
        { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { name: 'Visitantes', href: '/visitors', icon: 'visitors' },
        { name: 'Paquetes', href: '/packages', icon: 'packages' },
        { name: 'Incidentes', href: '/incidents', icon: 'incidents' },
        { name: 'Directorio', href: '/directory', icon: 'directory' },
        { name: 'Comunicaciones', href: '/communications', icon: 'communications' },
        { name: 'Cámaras', href: '/cameras', icon: 'cameras' },
        { name: 'Reportes', href: '/reports', icon: 'reports' }
    ]
};
test.describe('Navegación Completa - Landing a Dashboard', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test.setTimeout(120000); // 2 minutos para pruebas completas
        yield page.goto('/');
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo: Landing → Portal Administrador → Dashboard completo', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Verificar landing page
        yield test.step('Verificar elementos de la landing page', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar elementos principales de la landing
            yield expect(page.locator('h1, .hero-title')).toBeVisible();
            yield expect(page.locator('text=/Armonía/i')).toBeVisible();
            // Verificar secciones principales
            yield expect(page.locator('text=/gestión/i, text=/conjuntos/i, text=/residencial/i')).toBeVisible();
            // Verificar botones de acción
            const ctaButtons = page.locator('button:has-text("Comenzar"), a:has-text("Iniciar"), button:has-text("Probar")');
            yield expect(ctaButtons.first()).toBeVisible();
        }));
        // PASO 2: Navegar al selector de portales
        yield test.step('Navegar al selector de portales', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar botón de acceso/login
            const accessButton = page.locator('button:has-text("Acceder"), a:has-text("Login"), button:has-text("Ingresar"), a:has-text("Portal")').first();
            yield expect(accessButton).toBeVisible({ timeout: 10000 });
            yield accessButton.click();
            yield page.waitForLoadState('networkidle');
            // Verificar que llegamos al selector de portales
            yield expect(page).toHaveURL(/.*portal-selector|portales|access/);
            yield expect(page.locator('text=/selecciona.*portal/i, text=/tipo.*usuario/i')).toBeVisible();
        }));
        // PASO 3: Seleccionar portal de Administrador
        yield test.step('Seleccionar portal de Administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar y hacer clic en el portal de administrador
            const adminPortal = page.locator('button:has-text("Administrador"), .admin-portal, [data-portal="admin"]').first();
            yield expect(adminPortal).toBeVisible({ timeout: 10000 });
            yield adminPortal.click();
            yield page.waitForLoadState('networkidle');
            // Verificar que llegamos al login de administrador
            yield expect(page).toHaveURL(/.*login.*admin|admin.*login/);
            yield expect(page.locator('text=/administrador/i')).toBeVisible();
        }));
        // PASO 4: Login como Administrador
        yield test.step('Login como Administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            // Llenar formulario de login
            yield page.fill('input[name="email"], input[type="email"]', testUsers.admin.email);
            yield page.fill('input[name="password"], input[type="password"]', testUsers.admin.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Ingresar")').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            // Verificar acceso exitoso al dashboard
            yield expect(page).toHaveURL(/.*dashboard|admin/);
            yield expect(page.locator(`text="${testUsers.admin.name}", text=/bienvenido/i`)).toBeVisible({ timeout: 15000 });
        }));
        // PASO 5: Verificar estructura del dashboard
        yield test.step('Verificar estructura del dashboard de administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar header principal
            yield expect(page.locator('header, .header, nav')).toBeVisible();
            // Verificar menú lateral
            const sidebar = page.locator('.sidebar, #sidebar, nav[role="navigation"]').first();
            yield expect(sidebar).toBeVisible();
            // Verificar que el menú es colapsable
            const toggleButton = page.locator('button[aria-label*="toggle"], .menu-toggle, .sidebar-toggle').first();
            if (yield toggleButton.isVisible()) {
                yield toggleButton.click();
                yield page.waitForTimeout(500);
                yield toggleButton.click(); // Volver a expandir
            }
            // Verificar área de contenido principal
            yield expect(page.locator('main, .main-content, .dashboard-content')).toBeVisible();
        }));
        // PASO 6: Navegar por todas las opciones del menú lateral
        yield test.step('Navegar por todas las opciones del menú lateral', () => __awaiter(void 0, void 0, void 0, function* () {
            for (const menuItem of menuItems.admin) {
                // Buscar el elemento del menú
                const menuLink = page.locator(`a:has-text("${menuItem.name}"), [href*="${menuItem.href}"], .menu-item:has-text("${menuItem.name}")`).first();
                if (yield menuLink.isVisible()) {
                    yield menuLink.click();
                    yield page.waitForLoadState('networkidle');
                    // Verificar que navegamos a la página correcta
                    yield expect(page).toHaveURL(new RegExp(menuItem.href.replace('/', '\\/') + '|' + menuItem.name.toLowerCase()));
                    // Verificar contenido específico de la página
                    yield expect(page.locator(`h1:has-text("${menuItem.name}"), .page-title:has-text("${menuItem.name}"), h2:has-text("${menuItem.name}")`)).toBeVisible({ timeout: 10000 });
                    // Esperar un momento entre navegaciones
                    yield page.waitForTimeout(1000);
                }
            }
        }));
        // PASO 7: Verificar funcionalidades específicas por módulo
        yield test.step('Verificar funcionalidades específicas de módulos clave', () => __awaiter(void 0, void 0, void 0, function* () {
            // Dashboard principal
            yield page.locator('a:has-text("Dashboard")').first().click();
            yield expect(page.locator('text=/estadísticas/i, .stats, .metrics')).toBeVisible();
            // Inventario
            yield page.locator('a:has-text("Inventario")').first().click();
            yield expect(page.locator('text=/residentes/i, text=/propiedades/i')).toBeVisible();
            // Finanzas
            yield page.locator('a:has-text("Finanzas")').first().click();
            yield expect(page.locator('text=/facturación/i, text=/pagos/i, text=/ingresos/i')).toBeVisible();
            // Asambleas
            const assemblyLink = page.locator('a:has-text("Asambleas")').first();
            if (yield assemblyLink.isVisible()) {
                yield assemblyLink.click();
                yield expect(page.locator('text=/votación/i, text=/asamblea/i')).toBeVisible();
            }
            // PQR
            yield page.locator('a:has-text("PQR")').first().click();
            yield expect(page.locator('text=/peticiones/i, text=/quejas/i, text=/reclamos/i')).toBeVisible();
            // Seguridad
            const securityLink = page.locator('a:has-text("Seguridad")').first();
            if (yield securityLink.isVisible()) {
                yield securityLink.click();
                yield expect(page.locator('text=/acceso/i, text=/control/i, text=/visitantes/i')).toBeVisible();
            }
        }));
        // PASO 8: Verificar responsive y funcionalidades del menú
        yield test.step('Verificar funcionalidades responsivas del menú', () => __awaiter(void 0, void 0, void 0, function* () {
            // Probar colapsar/expandir menú
            const menuToggle = page.locator('.menu-toggle, .sidebar-toggle, button[aria-label*="menu"]').first();
            if (yield menuToggle.isVisible()) {
                // Colapsar
                yield menuToggle.click();
                yield page.waitForTimeout(500);
                // Verificar que el menú se colapsó
                const collapsedSidebar = page.locator('.sidebar-collapsed, .sidebar.collapsed, nav.collapsed').first();
                if (yield collapsedSidebar.isVisible()) {
                    // Expandir nuevamente
                    yield menuToggle.click();
                    yield page.waitForTimeout(500);
                }
            }
            // Verificar tooltips en menú colapsado (si existen)
            const tooltipTrigger = page.locator('.menu-item[title], .nav-item[data-tooltip]').first();
            if (yield tooltipTrigger.isVisible()) {
                yield tooltipTrigger.hover();
                yield expect(page.locator('.tooltip, [role="tooltip"]')).toBeVisible();
            }
        }));
    }));
    test('Flujo completo: Landing → Portal Residente → Dashboard residente', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Navegar desde landing al portal residente
        yield test.step('Navegar al portal de residente', () => __awaiter(void 0, void 0, void 0, function* () {
            const accessButton = page.locator('button:has-text("Acceder"), a:has-text("Portal")').first();
            yield accessButton.click();
            yield page.waitForLoadState('networkidle');
            // Seleccionar portal residente
            const residentPortal = page.locator('button:has-text("Residente"), .resident-portal, [data-portal="resident"]').first();
            yield expect(residentPortal).toBeVisible();
            yield residentPortal.click();
            yield page.waitForLoadState('networkidle');
        }));
        // PASO 2: Login como residente
        yield test.step('Login como residente', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.fill('input[name="email"]', testUsers.resident.email);
            yield page.fill('input[name="password"]', testUsers.resident.password);
            const loginButton = page.locator('button[type="submit"]').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|resident/);
            yield expect(page.locator(`text="${testUsers.resident.name}", text=/residente/i`)).toBeVisible();
        }));
        // PASO 3: Navegar por el menú de residente
        yield test.step('Navegar por opciones del menú de residente', () => __awaiter(void 0, void 0, void 0, function* () {
            for (const menuItem of menuItems.resident) {
                const menuLink = page.locator(`a:has-text("${menuItem.name}")`).first();
                if (yield menuLink.isVisible()) {
                    yield menuLink.click();
                    yield page.waitForLoadState('networkidle');
                    // Verificar navegación exitosa
                    yield expect(page.locator(`h1:has-text("${menuItem.name}"), .page-title`)).toBeVisible({ timeout: 10000 });
                    yield page.waitForTimeout(800);
                }
            }
        }));
        // PASO 4: Verificar funcionalidades específicas de residente
        yield test.step('Verificar funcionalidades específicas de residente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mi cuenta
            yield page.locator('a:has-text("Mi Cuenta")').first().click();
            yield expect(page.locator('text=/información personal/i, text=/datos/i')).toBeVisible();
            // Pagos
            yield page.locator('a:has-text("Pagos")').first().click();
            yield expect(page.locator('text=/estado de cuenta/i, text=/facturas/i')).toBeVisible();
            // Reservas
            yield page.locator('a:has-text("Reservas")').first().click();
            yield expect(page.locator('text=/áreas comunes/i, text=/salón/i, text=/gimnasio/i')).toBeVisible();
        }));
    }));
    test('Flujo completo: Landing → Portal Recepción → Dashboard recepción', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Navegar al portal de recepción
        yield test.step('Navegar al portal de recepción', () => __awaiter(void 0, void 0, void 0, function* () {
            const accessButton = page.locator('button:has-text("Acceder"), a:has-text("Portal")').first();
            yield accessButton.click();
            yield page.waitForLoadState('networkidle');
            // Seleccionar portal recepción
            const receptionPortal = page.locator('button:has-text("Recepción"), .reception-portal, [data-portal="reception"]').first();
            yield expect(receptionPortal).toBeVisible();
            yield receptionPortal.click();
            yield page.waitForLoadState('networkidle');
        }));
        // PASO 2: Login como recepcionista
        yield test.step('Login como recepcionista', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.fill('input[name="email"]', testUsers.reception.email);
            yield page.fill('input[name="password"]', testUsers.reception.password);
            const loginButton = page.locator('button[type="submit"]').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|reception/);
            yield expect(page.locator(`text="${testUsers.reception.name}", text=/recepción/i`)).toBeVisible();
        }));
        // PASO 3: Navegar por el menú de recepción
        yield test.step('Navegar por opciones del menú de recepción', () => __awaiter(void 0, void 0, void 0, function* () {
            for (const menuItem of menuItems.reception) {
                const menuLink = page.locator(`a:has-text("${menuItem.name}")`).first();
                if (yield menuLink.isVisible()) {
                    yield menuLink.click();
                    yield page.waitForLoadState('networkidle');
                    yield expect(page.locator(`h1:has-text("${menuItem.name}"), .page-title`)).toBeVisible({ timeout: 10000 });
                    yield page.waitForTimeout(800);
                }
            }
        }));
        // PASO 4: Verificar funcionalidades específicas de recepción
        yield test.step('Verificar funcionalidades específicas de recepción', () => __awaiter(void 0, void 0, void 0, function* () {
            // Visitantes
            yield page.locator('a:has-text("Visitantes")').first().click();
            yield expect(page.locator('text=/registro de visitas/i, text=/autorización/i')).toBeVisible();
            // Paquetes
            yield page.locator('a:has-text("Paquetes")').first().click();
            yield expect(page.locator('text=/correspondencia/i, text=/entrega/i')).toBeVisible();
            // Incidentes
            yield page.locator('a:has-text("Incidentes")').first().click();
            yield expect(page.locator('text=/reportar/i, text=/novedad/i')).toBeVisible();
        }));
    }));
    test('Verificar accesibilidad y UX del menú lateral', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/portal-selector');
        yield page.locator('button:has-text("Administrador")').first().click();
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').first().click();
        yield page.waitForLoadState('networkidle');
        // PASO 1: Verificar accesibilidad del menú
        yield test.step('Verificar accesibilidad del menú lateral', () => __awaiter(void 0, void 0, void 0, function* () {
            // Verificar que el menú tiene atributos de accesibilidad
            const sidebar = page.locator('nav[role="navigation"], .sidebar').first();
            yield expect(sidebar).toBeVisible();
            // Verificar navegación por teclado
            yield page.keyboard.press('Tab');
            yield page.keyboard.press('Tab');
            // Verificar que los elementos del menú son focuseables
            const firstMenuItem = page.locator('.menu-item a, nav a').first();
            yield firstMenuItem.focus();
            yield expect(firstMenuItem).toBeFocused();
        }));
        // PASO 2: Verificar estados del menú
        yield test.step('Verificar estados activo/inactivo del menú', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a diferentes secciones y verificar estado activo
            yield page.locator('a:has-text("Inventario")').first().click();
            yield expect(page.locator('a:has-text("Inventario").active, .menu-item.active:has-text("Inventario")')).toBeVisible();
            yield page.locator('a:has-text("Finanzas")').first().click();
            yield expect(page.locator('a:has-text("Finanzas").active, .menu-item.active:has-text("Finanzas")')).toBeVisible();
        }));
        // PASO 3: Verificar responsive del menú
        yield test.step('Verificar comportamiento responsive', () => __awaiter(void 0, void 0, void 0, function* () {
            // Simular pantalla móvil
            yield page.setViewportSize({ width: 768, height: 1024 });
            yield page.waitForTimeout(500);
            // Verificar que el menú se adapta o se oculta en móvil
            const mobileMenu = page.locator('.mobile-menu, .sidebar-mobile').first();
            const menuToggle = page.locator('.menu-toggle, .hamburger').first();
            if (yield menuToggle.isVisible()) {
                yield menuToggle.click();
                yield page.waitForTimeout(500);
            }
            // Restaurar tamaño desktop
            yield page.setViewportSize({ width: 1920, height: 1080 });
            yield page.waitForTimeout(500);
        }));
    }));
    test('Verificar logout y cambio de portales', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login inicial como administrador
        yield page.goto('/portal-selector');
        yield page.locator('button:has-text("Administrador")').first().click();
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').first().click();
        yield page.waitForLoadState('networkidle');
        // PASO 1: Verificar función de logout
        yield test.step('Verificar logout desde dashboard', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar botón de logout
            const logoutButton = page.locator('button:has-text("Salir"), button:has-text("Logout"), .logout-btn').first();
            yield expect(logoutButton).toBeVisible();
            yield logoutButton.click();
            // Verificar que regresamos a la página de login o landing
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*login|portal|landing|\//);
        }));
        // PASO 2: Verificar cambio de portal
        yield test.step('Cambiar a portal residente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Si estamos en login, ir al selector de portales
            if (page.url().includes('login')) {
                yield page.goto('/portal-selector');
            }
            // Seleccionar portal residente
            yield page.locator('button:has-text("Residente")').first().click();
            yield page.fill('input[name="email"]', testUsers.resident.email);
            yield page.fill('input[name="password"]', testUsers.resident.password);
            yield page.locator('button[type="submit"]').first().click();
            yield page.waitForLoadState('networkidle');
            // Verificar que estamos en dashboard residente
            yield expect(page).toHaveURL(/.*dashboard|resident/);
            yield expect(page.locator('text=/residente/i')).toBeVisible();
        }));
    }));
});
