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
 * Pruebas E2E para el módulo de Asambleas
 *
 * Estas pruebas verifican el flujo completo de gestión de asambleas:
 * creación, configuración, votación en tiempo real y consulta de resultados.
 */
import { test, expect } from '@playwright/test';
// Datos de prueba
const testUsers = {
    admin: {
        email: 'admin.asambleas@test.com',
        password: 'AssemblyAdmin123!',
        name: 'Admin Asambleas'
    },
    resident1: {
        email: 'residente1.asamblea@test.com',
        password: 'Resident1123!',
        name: 'María Resident Test',
        unitNumber: 'Apto 201'
    },
    resident2: {
        email: 'residente2.asamblea@test.com',
        password: 'Resident2123!',
        name: 'Carlos Resident Test',
        unitNumber: 'Apto 301'
    },
    resident3: {
        email: 'residente3.asamblea@test.com',
        password: 'Resident3123!',
        name: 'Ana Resident Test',
        unitNumber: 'Apto 401'
    }
};
const testAssembly = {
    title: 'Asamblea Ordinaria - Marzo 2025',
    description: 'Asamblea ordinaria para aprobación de presupuesto y elección de consejo de administración',
    date: '2025-03-15',
    time: '14:00',
    location: 'Salón Social - Conjunto Los Robles',
    quorum: '50', // 50% mínimo
    type: 'ORDINARY'
};
const testProposals = [
    {
        title: 'Aprobación Presupuesto 2025',
        description: 'Aprobar el presupuesto anual para el año 2025 con un incremento del 8%',
        type: 'BUDGET_APPROVAL',
        options: ['A favor', 'En contra', 'Abstención']
    },
    {
        title: 'Renovación Piscina',
        description: 'Autorizar la inversión de $50,000,000 para renovación completa de la piscina',
        type: 'INVESTMENT',
        options: ['Aprobar', 'Rechazar', 'Posponer']
    },
    {
        title: 'Elección Consejo Administración',
        description: 'Elegir 3 miembros del consejo de administración para período 2025-2027',
        type: 'ELECTION',
        options: ['Candidato A - María García', 'Candidato B - Juan López', 'Candidato C - Ana Martínez']
    }
];
test.describe('Asambleas - Gestión y Votación', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test.setTimeout(90000); // Timeout extendido para procesos de votación
        yield page.goto('/');
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo: Crear asamblea, votar y consultar resultados', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        // PASO 1: Admin crea la asamblea
        yield test.step('Admin crea nueva asamblea', () => __awaiter(void 0, void 0, void 0, function* () {
            const adminPage = yield browser.newPage();
            // Login como administrador
            yield adminPage.goto('/login');
            yield adminPage.fill('input[name="email"]', testUsers.admin.email);
            yield adminPage.fill('input[name="password"]', testUsers.admin.password);
            yield adminPage.locator('button[type="submit"]').click();
            yield adminPage.waitForLoadState('networkidle');
            // Navegar al módulo de asambleas
            const assemblyLink = adminPage.locator('a:has-text("Asambleas"), a:has-text("Assemblies"), [href*="assembl"]').first();
            yield expect(assemblyLink).toBeVisible({ timeout: 10000 });
            yield assemblyLink.click();
            yield adminPage.waitForLoadState('networkidle');
            // Crear nueva asamblea
            const createButton = adminPage.locator('button:has-text("Crear"), button:has-text("Nueva"), button:has-text("Programar")').first();
            yield expect(createButton).toBeVisible();
            yield createButton.click();
            // Llenar formulario de asamblea
            yield adminPage.fill('input[name="title"], #assembly-title', testAssembly.title);
            yield adminPage.fill('textarea[name="description"], #assembly-description', testAssembly.description);
            yield adminPage.fill('input[name="date"], input[type="date"], #assembly-date', testAssembly.date);
            yield adminPage.fill('input[name="time"], input[type="time"], #assembly-time', testAssembly.time);
            yield adminPage.fill('input[name="location"], #assembly-location', testAssembly.location);
            yield adminPage.fill('input[name="quorum"], #assembly-quorum', testAssembly.quorum);
            // Seleccionar tipo si existe
            const typeSelect = adminPage.locator('select[name="type"], #assembly-type').first();
            if (yield typeSelect.isVisible()) {
                yield typeSelect.selectOption(testAssembly.type);
            }
            // Guardar asamblea
            const saveButton = adminPage.locator('button[type="submit"], button:has-text("Crear"), button:has-text("Guardar")').first();
            yield saveButton.click();
            yield expect(adminPage.locator('text=/creada/i, text=/programada/i, text=/éxito/i')).toBeVisible({ timeout: 15000 });
            yield adminPage.close();
        }));
        // PASO 2: Admin configura propuestas/votaciones
        yield test.step('Configurar propuestas para votación', () => __awaiter(void 0, void 0, void 0, function* () {
            const adminPage = yield browser.newPage();
            yield adminPage.goto('/login');
            yield adminPage.fill('input[name="email"]', testUsers.admin.email);
            yield adminPage.fill('input[name="password"]', testUsers.admin.password);
            yield adminPage.locator('button[type="submit"]').click();
            yield adminPage.waitForLoadState('networkidle');
            // Navegar a asambleas y seleccionar la creada
            yield adminPage.locator('a:has-text("Asambleas")').first().click();
            yield adminPage.waitForLoadState('networkidle');
            // Buscar y hacer clic en la asamblea creada
            yield adminPage.locator(`text="${testAssembly.title}"`).click();
            yield adminPage.waitForLoadState('networkidle');
            // Agregar propuestas
            for (const proposal of testProposals) {
                const addProposalButton = adminPage.locator('button:has-text("Agregar"), button:has-text("Nueva Propuesta")').first();
                if (yield addProposalButton.isVisible()) {
                    yield addProposalButton.click();
                    yield adminPage.fill('input[name="proposalTitle"], #proposal-title', proposal.title);
                    yield adminPage.fill('textarea[name="proposalDescription"], #proposal-description', proposal.description);
                    // Agregar opciones de votación
                    for (let i = 0; i < proposal.options.length; i++) {
                        const optionInput = adminPage.locator(`input[name="option${i}"], #option-${i}`).first();
                        if (yield optionInput.isVisible()) {
                            yield optionInput.fill(proposal.options[i]);
                        }
                    }
                    const saveProposalButton = adminPage.locator('button:has-text("Guardar Propuesta"), button[type="submit"]').first();
                    yield saveProposalButton.click();
                    yield adminPage.waitForTimeout(2000);
                }
            }
            yield adminPage.close();
        }));
        // PASO 3: Iniciar la asamblea
        yield test.step('Iniciar asamblea en vivo', () => __awaiter(void 0, void 0, void 0, function* () {
            const adminPage = yield browser.newPage();
            yield adminPage.goto('/login');
            yield adminPage.fill('input[name="email"]', testUsers.admin.email);
            yield adminPage.fill('input[name="password"]', testUsers.admin.password);
            yield adminPage.locator('button[type="submit"]').click();
            yield adminPage.waitForLoadState('networkidle');
            yield adminPage.locator('a:has-text("Asambleas")').first().click();
            yield adminPage.locator(`text="${testAssembly.title}"`).click();
            // Iniciar asamblea
            const startButton = adminPage.locator('button:has-text("Iniciar"), button:has-text("Comenzar")').first();
            if (yield startButton.isVisible()) {
                yield startButton.click();
                yield expect(adminPage.locator('text=/iniciada/i, text=/activa/i, text=/vivo/i')).toBeVisible();
            }
            yield adminPage.close();
        }));
        // PASO 4: Residentes se conectan y registran asistencia
        yield test.step('Residentes registran asistencia', () => __awaiter(void 0, void 0, void 0, function* () {
            const residents = [testUsers.resident1, testUsers.resident2, testUsers.resident3];
            const residentPages = [];
            for (const resident of residents) {
                const residentPage = yield browser.newPage();
                residentPages.push(residentPage);
                // Login del residente
                yield residentPage.goto('/login');
                yield residentPage.fill('input[name="email"]', resident.email);
                yield residentPage.fill('input[name="password"]', resident.password);
                yield residentPage.locator('button[type="submit"]').click();
                yield residentPage.waitForLoadState('networkidle');
                // Navegar a asamblea activa
                const assemblyLink = residentPage.locator('a:has-text("Asamblea"), [href*="assembly"]').first();
                if (yield assemblyLink.isVisible()) {
                    yield assemblyLink.click();
                }
                else {
                    yield residentPage.goto('/assembly/live');
                }
                // Registrar asistencia
                const attendButton = residentPage.locator('button:has-text("Confirmar Asistencia"), button:has-text("Presente")').first();
                if (yield attendButton.isVisible()) {
                    yield attendButton.click();
                    yield expect(residentPage.locator('text=/asistencia.*registrada/i, text=/presente/i')).toBeVisible();
                }
            }
            // Verificar que se alcanzó el quórum
            const adminPage = yield browser.newPage();
            yield adminPage.goto('/login');
            yield adminPage.fill('input[name="email"]', testUsers.admin.email);
            yield adminPage.fill('input[name="password"]', testUsers.admin.password);
            yield adminPage.locator('button[type="submit"]').click();
            yield adminPage.waitForLoadState('networkidle');
            yield adminPage.goto('/assembly/live');
            yield expect(adminPage.locator('text=/quórum/i, text=/alcanzado/i')).toBeVisible({ timeout: 10000 });
            // Cerrar páginas de residentes temporalmente
            for (const page of residentPages) {
                yield page.close();
            }
            yield adminPage.close();
        }));
        // PASO 5: Votación en tiempo real
        yield test.step('Proceso de votación en tiempo real', () => __awaiter(void 0, void 0, void 0, function* () {
            const residents = [testUsers.resident1, testUsers.resident2, testUsers.resident3];
            // Admin abre votación para primera propuesta
            const adminPage = yield browser.newPage();
            yield adminPage.goto('/login');
            yield adminPage.fill('input[name="email"]', testUsers.admin.email);
            yield adminPage.fill('input[name="password"]', testUsers.admin.password);
            yield adminPage.locator('button[type="submit"]').click();
            yield adminPage.waitForLoadState('networkidle');
            yield adminPage.goto('/assembly/live');
            // Abrir votación para primera propuesta
            const openVotingButton = adminPage.locator('button:has-text("Abrir Votación"), button:has-text("Iniciar Voto")').first();
            if (yield openVotingButton.isVisible()) {
                yield openVotingButton.click();
                yield expect(adminPage.locator('text=/votación.*abierta/i, text=/pueden.*votar/i')).toBeVisible();
            }
            // Residentes votan
            const residentPages = [];
            const votes = ['A favor', 'A favor', 'En contra']; // Votos de cada residente
            for (let i = 0; i < residents.length; i++) {
                const residentPage = yield browser.newPage();
                residentPages.push(residentPage);
                yield residentPage.goto('/login');
                yield residentPage.fill('input[name="email"]', residents[i].email);
                yield residentPage.fill('input[name="password"]', residents[i].password);
                yield residentPage.locator('button[type="submit"]').click();
                yield residentPage.waitForLoadState('networkidle');
                yield residentPage.goto('/assembly/live');
                // Emitir voto
                const voteOption = residentPage.locator(`button:has-text("${votes[i]}"), input[value="${votes[i]}"]`).first();
                if (yield voteOption.isVisible()) {
                    yield voteOption.click();
                    const confirmVoteButton = residentPage.locator('button:has-text("Confirmar Voto"), button[type="submit"]').first();
                    if (yield confirmVoteButton.isVisible()) {
                        yield confirmVoteButton.click();
                    }
                    yield expect(residentPage.locator('text=/voto.*registrado/i, text=/gracias/i')).toBeVisible();
                }
            }
            // Admin cierra votación
            const closeVotingButton = adminPage.locator('button:has-text("Cerrar Votación"), button:has-text("Finalizar")').first();
            if (yield closeVotingButton.isVisible()) {
                yield closeVotingButton.click();
                yield expect(adminPage.locator('text=/votación.*cerrada/i, text=/resultados/i')).toBeVisible();
            }
            // Cerrar páginas
            for (const page of residentPages) {
                yield page.close();
            }
            yield adminPage.close();
        }));
        // PASO 6: Consultar resultados
        yield test.step('Consultar resultados de votación', () => __awaiter(void 0, void 0, void 0, function* () {
            const adminPage = yield browser.newPage();
            yield adminPage.goto('/login');
            yield adminPage.fill('input[name="email"]', testUsers.admin.email);
            yield adminPage.fill('input[name="password"]', testUsers.admin.password);
            yield adminPage.locator('button[type="submit"]').click();
            yield adminPage.waitForLoadState('networkidle');
            yield adminPage.goto('/assembly/live');
            // Verificar resultados mostrados
            yield expect(adminPage.locator('text="A favor": 2, text="En contra": 1')).toBeVisible();
            yield expect(adminPage.locator('text=/aprobada/i, text=/ganadora/i')).toBeVisible();
            // Generar acta final
            const generateActaButton = adminPage.locator('button:has-text("Generar Acta"), button:has-text("Finalizar")').first();
            if (yield generateActaButton.isVisible()) {
                yield generateActaButton.click();
                yield expect(adminPage.locator('text=/acta.*generada/i, text=/asamblea.*finalizada/i')).toBeVisible();
            }
            yield adminPage.close();
        }));
        // PASO 7: Verificar acceso a resultados desde cualquier usuario
        yield test.step('Verificar acceso a resultados históricos', () => __awaiter(void 0, void 0, void 0, function* () {
            const residentPage = yield browser.newPage();
            yield residentPage.goto('/login');
            yield residentPage.fill('input[name="email"]', testUsers.resident1.email);
            yield residentPage.fill('input[name="password"]', testUsers.resident1.password);
            yield residentPage.locator('button[type="submit"]').click();
            yield residentPage.waitForLoadState('networkidle');
            // Navegar a histórico de asambleas
            const historyLink = residentPage.locator('a:has-text("Asambleas"), a:has-text("Histórico")').first();
            if (yield historyLink.isVisible()) {
                yield historyLink.click();
                // Verificar que aparece la asamblea finalizada
                yield expect(residentPage.locator(`text="${testAssembly.title}"`)).toBeVisible();
                yield expect(residentPage.locator('text=/finalizada/i, text=/completada/i')).toBeVisible();
                // Ver detalles de resultados
                yield residentPage.locator(`text="${testAssembly.title}"`).click();
                yield expect(residentPage.locator('text=/resultados/i, text=/acta/i')).toBeVisible();
            }
            yield residentPage.close();
        }));
    }));
    test('Validación de quórum insuficiente', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como admin
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Intentar iniciar asamblea sin suficientes asistentes
        yield page.goto('/assembly/live');
        const startVotingButton = page.locator('button:has-text("Iniciar Votación")').first();
        if (yield startVotingButton.isVisible()) {
            yield startVotingButton.click();
            // Verificar mensaje de quórum insuficiente
            yield expect(page.locator('text=/quórum.*insuficiente/i, text=/no.*alcanzado/i')).toBeVisible();
        }
    }));
    test('Prevención de voto múltiple', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        // Este test verifica que un residente no pueda votar múltiples veces
        const residentPage = yield browser.newPage();
        yield residentPage.goto('/login');
        yield residentPage.fill('input[name="email"]', testUsers.resident1.email);
        yield residentPage.fill('input[name="password"]', testUsers.resident1.password);
        yield residentPage.locator('button[type="submit"]').click();
        yield residentPage.waitForLoadState('networkidle');
        yield residentPage.goto('/assembly/live');
        // Intentar votar por segunda vez
        const voteButton = residentPage.locator('button:has-text("A favor")').first();
        if (yield voteButton.isVisible()) {
            yield voteButton.click();
            // Verificar que no se puede votar nuevamente
            yield expect(residentPage.locator('text=/ya.*votó/i, text=/voto.*registrado/i')).toBeVisible();
            yield expect(voteButton).toBeDisabled();
        }
        yield residentPage.close();
    }));
});
