import { JWTPayload } from 'jose';

/**
 * Mock de la biblioteca jose para pruebas.
 * Implementa las funciones básicas necesarias para las pruebas.
 */

interface MockJWTPayload extends JWTPayload {
  sub: string;
  email: string;
  role: string;
  schemaName: string;
}

// Mock de jwtVerify
export const jwtVerify = async (token: string, secret: Uint8Array): Promise<{ payload: MockJWTPayload }> => {
  // Simulación simple para pruebas
  if (!token || token === 'invalid_token') {
    throw new Error('Invalid token');
  }
  
  // Devuelve un payload simulado
  return {
    payload: {
      sub: 'user_123',
      email: 'test@example.com',
      role: 'RESIDENT',
      schemaName: 'test_schema',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }
  };
};

// Mock de SignJWT
export class SignJWT {
  private payload: JWTPayload;

  constructor(payload: JWTPayload) {
    this.payload = payload;
  }
  
  setProtectedHeader(): this {
    return this;
  }
  
  setIssuedAt(): this {
    return this;
  }
  
  setExpirationTime(time: string | number): this {
    return this;
  }
  
  async sign(secret: Uint8Array): Promise<string> {
    return 'mock_jwt_token_for_testing';
  }
}
