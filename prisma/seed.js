"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var complex, hashedPassword, users, _i, users_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Iniciando seed de la base de datos...");
                    // Limpiar datos existentes si es necesario
                    console.log("Eliminando datos existentes...");
                    return [4 /*yield*/, prisma.$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["DELETE FROM \"armonia\".\"User\" WHERE 1=1;"], ["DELETE FROM \"armonia\".\"User\" WHERE 1=1;"])))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.$executeRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["DELETE FROM \"armonia\".\"ResidentialComplex\" WHERE 1=1;"], ["DELETE FROM \"armonia\".\"ResidentialComplex\" WHERE 1=1;"])))];
                case 2:
                    _a.sent();
                    // Crear un conjunto residencial de ejemplo
                    console.log("Creando conjunto residencial de prueba...");
                    return [4 /*yield*/, prisma.residentialComplex.create({
                            data: {
                                name: "Conjunto Residencial Armonía",
                                schemaName: "tenant_cj0001",
                                totalUnits: 50,
                                adminEmail: "admin@armonia.com",
                                adminName: "Administrador Principal",
                                adminPhone: "+57 3001234567",
                                address: "Calle 123 # 45-67",
                                city: "Bogotá",
                                state: "Cundinamarca",
                                country: "Colombia",
                                propertyTypes: [
                                    "APARTMENT",
                                    "HOUSE",
                                    "OFFICE",
                                    "COMMERCIAL",
                                    "PARKING",
                                    "STORAGE",
                                ],
                            },
                        })];
                case 3:
                    complex = _a.sent();
                    console.log("Conjunto creado: ".concat(complex.name, " (").concat(complex.schemaName, ")"));
                    // Crear usuarios de prueba
                    console.log("Creando usuarios de prueba...");
                    return [4 /*yield*/, bcrypt.hash("admin123", 10)];
                case 4:
                    hashedPassword = _a.sent();
                    users = [
                        {
                            email: "admin@armonia.com",
                            name: "Administrador Principal",
                            password: hashedPassword,
                            role: "ADMIN",
                            complexId: complex.id,
                        },
                        {
                            email: "resident@example.com",
                            name: "Residente Ejemplo",
                            password: hashedPassword,
                            role: "RESIDENT",
                            complexId: complex.id,
                        },
                        {
                            email: "staff@example.com",
                            name: "Personal de Recepción",
                            password: hashedPassword,
                            role: "STAFF",
                            complexId: complex.id,
                        },
                    ];
                    _i = 0, users_1 = users;
                    _a.label = 5;
                case 5:
                    if (!(_i < users_1.length)) return [3 /*break*/, 8];
                    user = users_1[_i];
                    return [4 /*yield*/, prisma.user.create({ data: user })];
                case 6:
                    _a.sent();
                    console.log("Usuario creado: ".concat(user.email, " (").concat(user.role, ")"));
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    // Crear esquema para el tenant
                    console.log("Creando esquema '".concat(complex.schemaName, "'..."));
                    return [4 /*yield*/, prisma.$executeRawUnsafe("CREATE SCHEMA IF NOT EXISTS \"".concat(complex.schemaName, "\""))];
                case 9:
                    _a.sent();
                    // Opciones adicionales que se pueden agregar al script:
                    // 1. Crear tablas en el esquema del tenant
                    // 2. Poblar con datos de ejemplo adicionales
                    console.log("✅ Seed completado exitosamente");
                    return [2 /*return*/];
            }
        });
    });
}
// Ejecutar el seed
seed()
    .catch(function (e) {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Cerrar la conexión de Prisma al finalizar
            return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                // Cerrar la conexión de Prisma al finalizar
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var templateObject_1, templateObject_2;
