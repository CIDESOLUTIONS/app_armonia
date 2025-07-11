var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/services/__tests__/financialService.test.ts
import { FinancialService } from '../financialService';
import { generatePDF } from '@/lib/pdf/pdfGenerator';
import { sendEmail } from '@/lib/communications/email-service';
// Mock de dependencias
jest.mock('@/lib/pdf/pdfGenerator', () => ({
    generatePDF: jest.fn().mockResolvedValue('/uploads/receipts/test-receipt.pdf')
}));
jest.mock('@/lib/communications/email-service', () => ({
    sendEmail: jest.fn().mockResolvedValue({ success: true })
}));
// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockQueryRawUnsafe = jest.fn();
    // Configurar respuestas para diferentes consultas
    mockQueryRawUnsafe.mockImplementation((query) => {
        if (query.includes('SELECT * FROM "tenant"."Fee"')) {
            return [
                {
                    id: 1,
                    title: 'Cuota Ordinaria Mayo',
                    description: 'Cuota ordinaria mensual',
                    amount: 150000,
                    type: 'ORDINARY',
                    dueDate: new Date('2025-05-31'),
                    status: 'PENDING',
                    propertyId: 101
                }
            ];
        }
        if (query.includes('SELECT COUNT(*)')) {
            return [{ count: '1' }];
        }
        if (query.includes('INSERT INTO "tenant"."Receipt"')) {
            return {
                id: 1,
                receiptNumber: 'R-101-123456789',
                issueDate: new Date(),
                totalAmount: 150000,
                type: 'STANDARD',
                status: 'GENERATED',
                issuedById: 1,
                propertyId: 101
            };
        }
        if (query.includes('SELECT * FROM "tenant"."Property"')) {
            return {
                id: 101,
                unitNumber: 'A-101',
                area: 85,
                coefficient: 0.025
            };
        }
        if (query.includes('SELECT * FROM "armonia"."ResidentialComplex"')) {
            return {
                id: 1,
                name: 'Conjunto Residencial Armonía',
                address: 'Calle Principal #123',
                schema: 'tenant'
            };
        }
        // Mock para getFeeById
        if (query.includes('SELECT * FROM "tenant"."Fee" WHERE "id" =')) {
            return {
                id: 1,
                title: 'Cuota Ordinaria Mayo',
                description: 'Cuota ordinaria mensual',
                amount: 150000,
                type: 'ORDINARY',
                dueDate: new Date('2025-05-31'),
                status: 'PENDING',
                propertyId: 101
            };
        }
        return [];
    });
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            $queryRawUnsafe: mockQueryRawUnsafe
        }))
    };
});
describe('FinancialService', () => {
    let financialService;
    beforeEach(() => {
        jest.clearAllMocks();
        financialService = new FinancialService('tenant');
    });
    describe('getFees', () => {
        it('debe obtener cuotas con filtros', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield financialService.getFees({
                propertyId: 101,
                status: 'PENDING',
                page: 1,
                limit: 10
            });
            expect(result).toHaveProperty('fees');
            expect(result).toHaveProperty('total', 1);
            expect(result.fees).toHaveLength(1);
            expect(result.fees[0].title).toBe('Cuota Ordinaria Mayo');
        }));
    });
    describe('generateReceipt', () => {
        it('debe generar un recibo correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Modificar el mock para asegurar que la propiedad coincida
            jest.spyOn(financialService, 'getFeeById').mockResolvedValue({
                id: 1,
                title: 'Cuota Ordinaria Mayo',
                description: 'Cuota ordinaria mensual',
                amount: 150000,
                type: 'ORDINARY',
                dueDate: new Date('2025-05-31'),
                status: 'PENDING',
                propertyId: 101
            });
            const result = yield financialService.generateReceipt({
                propertyId: 101,
                feeIds: [1],
                type: 'STANDARD',
                issuedById: 1
            });
            expect(result).toHaveProperty('id', 1);
            expect(result).toHaveProperty('receiptNumber', 'R-101-123456789');
            expect(result).toHaveProperty('pdfUrl');
            // Verificar que se llamó a generatePDF
            expect(generatePDF).toHaveBeenCalledWith('receipt-standard', expect.objectContaining({
                receipt: expect.any(Object),
                fees: expect.any(Array),
                property: expect.any(Object)
            }), expect.stringContaining('/public/uploads/receipts/'));
        }));
        it('debe fallar si las cuotas no existen', () => __awaiter(void 0, void 0, void 0, function* () {
            // Modificar mock para simular cuotas inexistentes
            jest.spyOn(financialService, 'getFeeById').mockResolvedValueOnce(null);
            yield expect(financialService.generateReceipt({
                propertyId: 101,
                feeIds: [999],
                type: 'STANDARD',
                issuedById: 1
            })).rejects.toThrow('Una o más cuotas no existen');
        }));
    });
    describe('sendReceiptByEmail', () => {
        it('debe enviar un recibo por correo correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock para obtener un recibo
            jest.spyOn(financialService['prisma'], '$queryRawUnsafe')
                .mockResolvedValueOnce({
                id: 1,
                receiptNumber: 'R-101-123456789',
                pdfUrl: '/uploads/receipts/test-receipt.pdf',
                propertyId: 101
            });
            const result = yield financialService.sendReceiptByEmail(1, 'test@example.com');
            expect(result).toHaveProperty('success', true);
            // Verificar que se llamó a sendEmail con expectativas exactas
            expect(sendEmail).toHaveBeenCalledWith({
                to: 'test@example.com',
                subject: 'Recibo de Pago #R-101-123456789',
                text: 'Adjunto encontrará su recibo de pago #R-101-123456789 para la unidad A-101.',
                attachments: [
                    {
                        filename: 'Recibo_R-101-123456789.pdf',
                        path: '/uploads/receipts/test-receipt.pdf'
                    }
                ]
            });
        }));
        it('debe fallar si el recibo no existe', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock para simular recibo inexistente
            jest.spyOn(financialService['prisma'], '$queryRawUnsafe')
                .mockResolvedValueOnce(null);
            yield expect(financialService.sendReceiptByEmail(999, 'test@example.com')).rejects.toThrow('El recibo con ID 999 no existe');
        }));
        it('debe fallar si el recibo no tiene PDF generado', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock para simular recibo sin PDF
            jest.spyOn(financialService['prisma'], '$queryRawUnsafe')
                .mockResolvedValueOnce({
                id: 1,
                receiptNumber: 'R-101-123456789',
                pdfUrl: null,
                propertyId: 101
            });
            yield expect(financialService.sendReceiptByEmail(1, 'test@example.com')).rejects.toThrow('El recibo con ID 1 no tiene un PDF generado');
        }));
    });
    describe('generateBulkReceipts', () => {
        it('debe generar recibos masivamente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock para simular múltiples cuotas
            jest.spyOn(financialService['prisma'], '$queryRawUnsafe')
                .mockResolvedValueOnce([
                {
                    id: 1,
                    propertyId: 101,
                    amount: 150000,
                    type: 'ORDINARY',
                    status: 'PENDING'
                },
                {
                    id: 2,
                    propertyId: 102,
                    amount: 150000,
                    type: 'ORDINARY',
                    status: 'PENDING'
                }
            ]);
            // Mock para generateReceipt
            jest.spyOn(financialService, 'generateReceipt')
                .mockResolvedValueOnce({
                id: 1,
                receiptNumber: 'R-101-123456789',
                pdfUrl: '/uploads/receipts/test-receipt-1.pdf'
            })
                .mockResolvedValueOnce({
                id: 2,
                receiptNumber: 'R-102-123456790',
                pdfUrl: '/uploads/receipts/test-receipt-2.pdf'
            });
            const result = yield financialService.generateBulkReceipts({
                month: 5,
                year: 2025,
                feeType: 'ORDINARY',
                type: 'STANDARD',
                issuedById: 1
            });
            expect(result).toHaveProperty('generatedReceipts', 2);
            expect(result).toHaveProperty('receipts');
            expect(result.receipts).toHaveLength(2);
        }));
    });
});
