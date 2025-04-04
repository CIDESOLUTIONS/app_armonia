const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Ruta al directorio raíz de Next.js
  dir: './',
});

// Configuración personalizada para Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Gestión de aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/node_modules/@prisma/client',
  },
  transform: {
    // Transformación de TypeScript
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  // Ignorar los módulos que no necesitan ser transformados
  transformIgnorePatterns: [
    '/node_modules/(?!(@prisma|next))',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  testMatch: [
    '<rootDir>/jest/**/*.test.js',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'
  ],
};

// Exportar la configuración
module.exports = createJestConfig(customJestConfig);
