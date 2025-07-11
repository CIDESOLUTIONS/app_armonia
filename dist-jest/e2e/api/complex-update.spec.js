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
test.describe('Complex Update API Integration', () => {
    let complexId;
    let token;
    test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
        // 1. Register a new complex to get a complexId and token
        const registerResponse = yield request.post('/api/auth/register', {
            data: {
                name: 'Playwright Test Complex',
                address: '123 Test Address',
                adminEmail: `test-admin-${Date.now()}@example.com`,
                adminPassword: 'testpassword123',
            },
        });
        expect(registerResponse.ok()).toBeTruthy();
        const registerBody = yield registerResponse.json();
        complexId = registerBody.complex.id;
        token = registerBody.token;
        expect(complexId).toBeDefined();
        expect(token).toBeDefined();
    }));
    test('should update complex name and address successfully', (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
        const newName = 'Updated Playwright Complex';
        const newAddress = '456 New Test Address';
        const response = yield request.post('/api/complex/update', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {
                name: newName,
                address: newAddress,
            },
        });
        expect(response.ok()).toBeTruthy();
        const responseBody = yield response.json();
        expect(responseBody.message).toBe('Conjunto actualizado con éxito');
        expect(responseBody.complex.name).toBe(newName);
        expect(responseBody.complex.address).toBe(newAddress);
        expect(responseBody.complex.id).toBe(complexId);
    }));
    test('should return 401 if no token is provided', (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
        const response = yield request.post('/api/complex/update', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                name: 'Some Name',
            },
        });
        expect(response.status()).toBe(401);
        const responseBody = yield response.json();
        expect(responseBody.message).toBe('No token provided');
    }));
    test('should return 401 if token is invalid', (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
        const invalidToken = 'invalid.jwt.token'; // A truly invalid token
        const response = yield request.post('/api/complex/update', {
            headers: {
                'Authorization': `Bearer ${invalidToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                name: 'Some Name',
            },
        });
        expect(response.status()).toBe(401);
        const responseBody = yield response.json();
        expect(responseBody.message).toBe('Token inválido');
    }));
    test('should return 400 if no fields are provided for update', (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
        const response = yield request.post('/api/complex/update', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {},
        });
        expect(response.status()).toBe(400);
        const responseBody = yield response.json();
        expect(responseBody.message).toBe('Se requiere al menos un campo para actualizar');
    }));
    // TODO: Add afterAll to clean up the created complex from the database
});
