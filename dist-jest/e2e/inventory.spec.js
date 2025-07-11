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
 * Pruebas E2E para el módulo de Inventario
 *
 * Estas pruebas verifican la gestión completa del inventario del conjunto:
 * información del conjunto, gestión de residentes, propiedades y servicios comunes.
 */
import { test, expect } from '@playwright/test';
// Datos de prueba
const testUsers = {
    admin: {
        email: 'admin.inventario@test.com',
        password: 'InventoryAdmin123!',
        name: 'Admin Inventario'
    },
    manager: {
        email: 'gerente@test.com',
        password: 'Manager123!',
        name: 'Gerente Conjunto'
    }
};
// Datos del conjunto residencial
const complexData = {
    name: 'Conjunto Los Robles Actualizado',
    nit: '900123456-1',
    address: 'Calle 123 #45-67, Bogotá, Colombia',
    phone: '(601) 234-5678',
    email: 'info@losrobles.com',
    website: 'www.losrobles.com',
    units: '52',
    towers: '3',
    floors: '6',
    parkingSpots: '45',
    description: 'Conjunto residencial moderno con amplias zonas verdes',
    commonAreas: 'Salón Social, Gimnasio, Piscina, Zona BBQ, Parque Infantil, Cancha de Tenis'
};
// Datos de nuevos residentes
const newResidents = [
    {
        name: 'María García López',
        email: 'maria.garcia@email.com',
        phone: '3001234567',
        dni: '52345678',
        unitNumber: 'Apto 501',
        tower: 'Torre A',
        residentType: 'OWNER',
        emergencyContact: 'Juan García - 3009876543',
        moveInDate: '2025-02-01'
    },
    {
        name: 'Carlos Rodríguez Pérez',
        email: 'carlos.rodriguez@email.com',
        phone: '3007654321',
        dni: '41234567',
        unitNumber: 'Apto 502',
        tower: 'Torre A',
        residentType: 'TENANT',
        emergencyContact: 'Ana Rodríguez - 3001239876',
        moveInDate: '2025-01-15'
    }
];
// Datos de propiedades
const properties = [
    {
        unitNumber: 'Apto 503',
        tower: 'Torre A',
        floor: '5',
        type: 'APARTMENT',
        area: '85',
        bedrooms: '3',
        bathrooms: '2',
        balcony: true,
        parkingSpots: '1',
        status: 'OCCUPIED'
    },
    {
        unitNumber: 'Local 101',
        tower: 'Torre B',
        floor: '1',
        type: 'COMMERCIAL',
        area: '120',
        status: 'AVAILABLE',
        monthlyFee: '850000'
    }
];
// Datos de mascotas
const pets = [
    {
        name: 'Max',
        type: 'DOG',
        breed: 'Golden Retriever',
        age: '3',
        weight: '28',
        color: 'Dorado',
        ownerUnit: 'Apto 501',
        vaccinated: true,
        registrationDate: '2025-01-20'
    },
    {
        name: 'Luna',
        type: 'CAT',
        breed: 'Siamés',
        age: '2',
        weight: '4',
        color: 'Gris y blanco',
        ownerUnit: 'Apto 502',
        vaccinated: true,
        registrationDate: '2025-01-22'
    }
];
// Datos de vehículos
const vehicles = [
    {
        plate: 'ABC-123',
        brand: 'Toyota',
        model: 'Corolla',
        year: '2020',
        color: 'Blanco',
        type: 'SEDAN',
        ownerUnit: 'Apto 501',
        parkingSpot: 'A-15'
    },
    {
        plate: 'XYZ-789',
        brand: 'Honda',
        model: 'CR-V',
        year: '2022',
        color: 'Negro',
        type: 'SUV',
        ownerUnit: 'Apto 502',
        parkingSpot: 'B-22'
    }
];
test.describe('Inventario - Gestión Completa del Conjunto', () => {
    test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test.setTimeout(90000);
        yield page.goto('/');
        yield page.waitForLoadState('networkidle');
    }));
    test('Flujo completo: Actualizar información del conjunto y gestionar inventario', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // PASO 1: Login como administrador
        yield test.step('Login como administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/login');
            yield page.fill('input[name="email"], input[type="email"]', testUsers.admin.email);
            yield page.fill('input[name="password"], input[type="password"]', testUsers.admin.password);
            const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar")').first();
            yield loginButton.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*dashboard|admin/);
        }));
        // PASO 2: Navegar al módulo de inventario
        yield test.step('Navegar al módulo de inventario', () => __awaiter(void 0, void 0, void 0, function* () {
            const inventoryLink = page.locator('a:has-text("Inventario"), a:has-text("Gestión"), [href*="inventory"]').first();
            yield expect(inventoryLink).toBeVisible({ timeout: 10000 });
            yield inventoryLink.click();
            yield page.waitForLoadState('networkidle');
            yield expect(page).toHaveURL(/.*inventory|gestión/);
        }));
        // PASO 3: Actualizar información del conjunto
        yield test.step('Actualizar información del conjunto', () => __awaiter(void 0, void 0, void 0, function* () {
            // Buscar sección de información del conjunto
            const complexInfoTab = page.locator('tab:has-text("Conjunto"), button:has-text("Información"), a:has-text("Datos")').first();
            if (yield complexInfoTab.isVisible()) {
                yield complexInfoTab.click();
            }
            // Buscar botón de editar información
            const editButton = page.locator('button:has-text("Editar"), button:has-text("Modificar"), .edit-complex-info').first();
            yield expect(editButton).toBeVisible({ timeout: 10000 });
            yield editButton.click();
            // Actualizar datos del conjunto
            yield page.fill('input[name="name"], #complex-name', complexData.name);
            yield page.fill('input[name="address"], #complex-address', complexData.address);
            yield page.fill('input[name="phone"], #complex-phone', complexData.phone);
            yield page.fill('input[name="email"], #complex-email', complexData.email);
            yield page.fill('input[name="website"], #complex-website', complexData.website);
            yield page.fill('input[name="units"], #total-units', complexData.units);
            yield page.fill('input[name="towers"], #total-towers', complexData.towers);
            yield page.fill('input[name="parkingSpots"], #parking-spots', complexData.parkingSpots);
            // Descripción y áreas comunes
            const descriptionField = page.locator('textarea[name="description"], #complex-description').first();
            if (yield descriptionField.isVisible()) {
                yield descriptionField.fill(complexData.description);
            }
            const commonAreasField = page.locator('textarea[name="commonAreas"], #common-areas').first();
            if (yield commonAreasField.isVisible()) {
                yield commonAreasField.fill(complexData.commonAreas);
            }
            // Guardar cambios
            const saveButton = page.locator('button[type="submit"], button:has-text("Guardar")').first();
            yield saveButton.click();
            yield expect(page.locator('text=/actualizada/i, text=/guardada/i, text=/éxito/i')).toBeVisible({ timeout: 15000 });
        }));
        // PASO 4: Gestionar residentes
        yield test.step('Agregar nuevos residentes', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a sección de residentes
            const residentsTab = page.locator('tab:has-text("Residentes"), button:has-text("Residentes"), a:has-text("Residentes")').first();
            yield residentsTab.click();
            yield page.waitForLoadState('networkidle');
            // Agregar cada residente
            for (const resident of newResidents) {
                const addResidentButton = page.locator('button:has-text("Agregar"), button:has-text("Nuevo"), button:has-text("Crear")').first();
                yield addResidentButton.click();
                // Llenar formulario de residente
                yield page.fill('input[name="name"], #resident-name', resident.name);
                yield page.fill('input[name="email"], #resident-email', resident.email);
                yield page.fill('input[name="phone"], #resident-phone', resident.phone);
                yield page.fill('input[name="dni"], #resident-dni', resident.dni);
                yield page.fill('input[name="unitNumber"], #unit-number', resident.unitNumber);
                // Seleccionar tipo de residente
                const residentTypeSelect = page.locator('select[name="residentType"], #resident-type').first();
                if (yield residentTypeSelect.isVisible()) {
                    yield residentTypeSelect.selectOption(resident.residentType);
                }
                // Información adicional
                const emergencyContactField = page.locator('input[name="emergencyContact"], #emergency-contact').first();
                if (yield emergencyContactField.isVisible()) {
                    yield emergencyContactField.fill(resident.emergencyContact);
                }
                const moveInDateField = page.locator('input[name="moveInDate"], input[type="date"], #move-in-date').first();
                if (yield moveInDateField.isVisible()) {
                    yield moveInDateField.fill(resident.moveInDate);
                }
                // Guardar residente
                const saveResidentButton = page.locator('button[type="submit"], button:has-text("Guardar")').first();
                yield saveResidentButton.click();
                yield expect(page.locator('text=/residente.*agregado/i, text=/registrado/i')).toBeVisible({ timeout: 10000 });
                // Esperar un momento entre registros
                yield page.waitForTimeout(1000);
            }
        }));
        // PASO 5: Gestionar propiedades
        yield test.step('Agregar y configurar propiedades', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a propiedades
            const propertiesTab = page.locator('tab:has-text("Propiedades"), button:has-text("Unidades"), a:has-text("Propiedades")').first();
            yield propertiesTab.click();
            yield page.waitForLoadState('networkidle');
            // Agregar propiedades
            for (const property of properties) {
                const addPropertyButton = page.locator('button:has-text("Agregar"), button:has-text("Nueva")').first();
                yield addPropertyButton.click();
                // Información básica de la propiedad
                yield page.fill('input[name="unitNumber"], #unit-number', property.unitNumber);
                yield page.fill('input[name="floor"], #floor', property.floor);
                yield page.fill('input[name="area"], #area', property.area);
                // Tipo de propiedad
                const propertyTypeSelect = page.locator('select[name="type"], #property-type').first();
                if (yield propertyTypeSelect.isVisible()) {
                    yield propertyTypeSelect.selectOption(property.type);
                }
                // Detalles específicos
                if (property.type === 'APARTMENT') {
                    const bedroomsField = page.locator('input[name="bedrooms"], #bedrooms').first();
                    if (yield bedroomsField.isVisible()) {
                        yield bedroomsField.fill(property.bedrooms);
                    }
                    const bathroomsField = page.locator('input[name="bathrooms"], #bathrooms').first();
                    if (yield bathroomsField.isVisible()) {
                        yield bathroomsField.fill(property.bathrooms);
                    }
                    // Balcón (checkbox)
                    if (property.balcony) {
                        const balconyCheckbox = page.locator('input[name="balcony"], #has-balcony').first();
                        if (yield balconyCheckbox.isVisible()) {
                            yield balconyCheckbox.check();
                        }
                    }
                }
                // Estado y parqueaderos
                const statusSelect = page.locator('select[name="status"], #property-status').first();
                if (yield statusSelect.isVisible()) {
                    yield statusSelect.selectOption(property.status);
                }
                const parkingSpotsField = page.locator('input[name="parkingSpots"], #parking-spots').first();
                if ((yield parkingSpotsField.isVisible()) && property.parkingSpots) {
                    yield parkingSpotsField.fill(property.parkingSpots);
                }
                // Guardar propiedad
                const savePropertyButton = page.locator('button[type="submit"], button:has-text("Guardar")').first();
                yield savePropertyButton.click();
                yield expect(page.locator('text=/propiedad.*agregada/i, text=/registrada/i')).toBeVisible({ timeout: 10000 });
                yield page.waitForTimeout(1000);
            }
        }));
        // PASO 6: Registrar mascotas
        yield test.step('Registrar mascotas de residentes', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a mascotas
            const petsTab = page.locator('tab:has-text("Mascotas"), button:has-text("Pets"), a:has-text("Mascotas")').first();
            yield petsTab.click();
            yield page.waitForLoadState('networkidle');
            // Registrar cada mascota
            for (const pet of pets) {
                const addPetButton = page.locator('button:has-text("Registrar"), button:has-text("Nueva")').first();
                yield addPetButton.click();
                // Información de la mascota
                yield page.fill('input[name="petName"], #pet-name', pet.name);
                yield page.fill('input[name="breed"], #pet-breed', pet.breed);
                yield page.fill('input[name="age"], #pet-age', pet.age);
                yield page.fill('input[name="weight"], #pet-weight', pet.weight);
                yield page.fill('input[name="color"], #pet-color', pet.color);
                // Tipo de mascota
                const petTypeSelect = page.locator('select[name="petType"], #pet-type').first();
                if (yield petTypeSelect.isVisible()) {
                    yield petTypeSelect.selectOption(pet.type);
                }
                // Unidad del propietario
                const ownerUnitSelect = page.locator('select[name="ownerUnit"], #owner-unit').first();
                if (yield ownerUnitSelect.isVisible()) {
                    yield ownerUnitSelect.selectOption({ label: pet.ownerUnit });
                }
                // Vacunación
                if (pet.vaccinated) {
                    const vaccinatedCheckbox = page.locator('input[name="vaccinated"], #is-vaccinated').first();
                    if (yield vaccinatedCheckbox.isVisible()) {
                        yield vaccinatedCheckbox.check();
                    }
                }
                // Fecha de registro
                const registrationDateField = page.locator('input[name="registrationDate"], input[type="date"], #registration-date').first();
                if (yield registrationDateField.isVisible()) {
                    yield registrationDateField.fill(pet.registrationDate);
                }
                // Guardar mascota
                const savePetButton = page.locator('button[type="submit"], button:has-text("Registrar")').first();
                yield savePetButton.click();
                yield expect(page.locator('text=/mascota.*registrada/i, text=/guardada/i')).toBeVisible({ timeout: 10000 });
                yield page.waitForTimeout(1000);
            }
        }));
        // PASO 7: Registrar vehículos
        yield test.step('Registrar vehículos de residentes', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a vehículos
            const vehiclesTab = page.locator('tab:has-text("Vehículos"), button:has-text("Vehicles"), a:has-text("Vehículos")').first();
            yield vehiclesTab.click();
            yield page.waitForLoadState('networkidle');
            // Registrar cada vehículo
            for (const vehicle of vehicles) {
                const addVehicleButton = page.locator('button:has-text("Registrar"), button:has-text("Nuevo")').first();
                yield addVehicleButton.click();
                // Información del vehículo
                yield page.fill('input[name="plate"], #vehicle-plate', vehicle.plate);
                yield page.fill('input[name="brand"], #vehicle-brand', vehicle.brand);
                yield page.fill('input[name="model"], #vehicle-model', vehicle.model);
                yield page.fill('input[name="year"], #vehicle-year', vehicle.year);
                yield page.fill('input[name="color"], #vehicle-color', vehicle.color);
                // Tipo de vehículo
                const vehicleTypeSelect = page.locator('select[name="vehicleType"], #vehicle-type').first();
                if (yield vehicleTypeSelect.isVisible()) {
                    yield vehicleTypeSelect.selectOption(vehicle.type);
                }
                // Unidad del propietario
                const ownerUnitSelect = page.locator('select[name="ownerUnit"], #owner-unit').first();
                if (yield ownerUnitSelect.isVisible()) {
                    yield ownerUnitSelect.selectOption({ label: vehicle.ownerUnit });
                }
                // Parqueadero asignado
                const parkingSpotField = page.locator('input[name="parkingSpot"], #parking-spot').first();
                if (yield parkingSpotField.isVisible()) {
                    yield parkingSpotField.fill(vehicle.parkingSpot);
                }
                // Guardar vehículo
                const saveVehicleButton = page.locator('button[type="submit"], button:has-text("Registrar")').first();
                yield saveVehicleButton.click();
                yield expect(page.locator('text=/vehículo.*registrado/i, text=/guardado/i')).toBeVisible({ timeout: 10000 });
                yield page.waitForTimeout(1000);
            }
        }));
        // PASO 8: Verificar estadísticas del inventario
        yield test.step('Verificar estadísticas y resumen del inventario', () => __awaiter(void 0, void 0, void 0, function* () {
            // Navegar a resumen/estadísticas
            const summaryTab = page.locator('tab:has-text("Resumen"), button:has-text("Estadísticas"), a:has-text("Dashboard")').first();
            if (yield summaryTab.isVisible()) {
                yield summaryTab.click();
                yield page.waitForLoadState('networkidle');
                // Verificar que aparecen las estadísticas actualizadas
                yield expect(page.locator(`text="${complexData.units}", text="52"`)).toBeVisible();
                yield expect(page.locator('text=/residentes.*registrados/i')).toBeVisible();
                yield expect(page.locator('text=/propiedades.*registradas/i')).toBeVisible();
                yield expect(page.locator('text=/mascotas.*registradas/i')).toBeVisible();
                yield expect(page.locator('text=/vehículos.*registrados/i')).toBeVisible();
            }
        }));
    }));
    test('Buscar y filtrar en el inventario', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a inventario
        yield page.locator('a:has-text("Inventario")').first().click();
        yield page.locator('tab:has-text("Residentes")').first().click();
        // Buscar residente por nombre
        const searchInput = page.locator('input[name="search"], #search-residents').first();
        if (yield searchInput.isVisible()) {
            yield searchInput.fill('María García');
            // Verificar resultados de búsqueda
            yield expect(page.locator('text="María García López"')).toBeVisible();
        }
        // Filtrar por tipo de residente
        const residentTypeFilter = page.locator('select[name="residentType"], #filter-resident-type').first();
        if (yield residentTypeFilter.isVisible()) {
            yield residentTypeFilter.selectOption('OWNER');
            // Verificar filtrado
            yield expect(page.locator('text=/propietario/i, text=/owner/i')).toBeVisible();
        }
        // Filtrar por torre
        const towerFilter = page.locator('select[name="tower"], #filter-tower').first();
        if (yield towerFilter.isVisible()) {
            yield towerFilter.selectOption('Torre A');
            // Verificar filtrado por torre
            yield expect(page.locator('text="Torre A"')).toBeVisible();
        }
    }));
    test('Exportar reportes de inventario', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a inventario
        yield page.locator('a:has-text("Inventario")').first().click();
        // Buscar opción de exportar
        const exportButton = page.locator('button:has-text("Exportar"), button:has-text("Descargar"), .export-button').first();
        if (yield exportButton.isVisible()) {
            yield exportButton.click();
            // Seleccionar tipo de reporte
            const reportTypeSelect = page.locator('select[name="reportType"], #report-type').first();
            if (yield reportTypeSelect.isVisible()) {
                yield reportTypeSelect.selectOption('COMPLETE_INVENTORY');
            }
            // Seleccionar formato
            const formatSelect = page.locator('select[name="format"], #export-format').first();
            if (yield formatSelect.isVisible()) {
                yield formatSelect.selectOption('EXCEL');
            }
            // Generar reporte
            const generateButton = page.locator('button:has-text("Generar"), button:has-text("Crear")').first();
            if (yield generateButton.isVisible()) {
                yield generateButton.click();
                // Verificar que se genera el reporte
                yield expect(page.locator('text=/reporte.*generado/i, text=/descarga/i')).toBeVisible({ timeout: 15000 });
            }
        }
    }));
    test('Gestión de servicios comunes', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // Login como administrador
        yield page.goto('/login');
        yield page.fill('input[name="email"]', testUsers.admin.email);
        yield page.fill('input[name="password"]', testUsers.admin.password);
        yield page.locator('button[type="submit"]').click();
        yield page.waitForLoadState('networkidle');
        // Navegar a servicios comunes
        yield page.locator('a:has-text("Servicios"), a:has-text("Common Services")').first().click();
        yield page.waitForLoadState('networkidle');
        // Configurar nuevo servicio común
        const addServiceButton = page.locator('button:has-text("Agregar"), button:has-text("Nuevo Servicio")').first();
        if (yield addServiceButton.isVisible()) {
            yield addServiceButton.click();
            // Llenar información del servicio
            yield page.fill('input[name="serviceName"], #service-name', 'Servicio de Limpieza Extraordinaria');
            yield page.fill('textarea[name="description"], #service-description', 'Servicio de limpieza profunda de áreas comunes');
            yield page.fill('input[name="cost"], #service-cost', '150000');
            // Tipo de servicio
            const serviceTypeSelect = page.locator('select[name="serviceType"], #service-type').first();
            if (yield serviceTypeSelect.isVisible()) {
                yield serviceTypeSelect.selectOption('MAINTENANCE');
            }
            // Frecuencia
            const frequencySelect = page.locator('select[name="frequency"], #service-frequency').first();
            if (yield frequencySelect.isVisible()) {
                yield frequencySelect.selectOption('MONTHLY');
            }
            // Guardar servicio
            const saveServiceButton = page.locator('button[type="submit"], button:has-text("Guardar")').first();
            yield saveServiceButton.click();
            yield expect(page.locator('text=/servicio.*agregado/i, text=/configurado/i')).toBeVisible({ timeout: 10000 });
        }
    }));
});
