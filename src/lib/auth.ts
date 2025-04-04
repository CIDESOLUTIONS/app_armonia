// src/lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  id: number;
  email: string;
  role: string;
  complexId: number;
  schemaName: string;
  name: string;
}

export function verifyToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      resolve(decoded);
    } catch (error) {
      reject(new Error('Token inválido'));
    }
  });
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}