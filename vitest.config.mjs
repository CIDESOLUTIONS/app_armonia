import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    tsconfig: './tsconfig.json',
    include: [
      'armonia-backend/src/app.controller.spec.ts',
      'armonia-backend/src/documents/documents.service.spec.ts',
      'armonia-backend/src/tenant/tenant.service.spec.ts',
      'armonia-backend/src/pqr/pqr.service.spec.ts',
      'armonia-backend/src/packages/packages.service.spec.ts',
      'armonia-backend/src/visitors/visitors.service.spec.ts',
      'armonia-backend/src/projects/projects.service.spec.ts',
      'armonia-backend/src/plans/plans.service.spec.ts',
      'armonia-backend/src/surveys/survey.service.spec.ts',
      'armonia-backend/src/security/security.service.spec.ts',
      'armonia-backend/src/finances/finances.service.spec.ts',
    ],
    mock: {
      imports: {
        '@backend/lib/logging/server-logger': {
          ServerLogger: {
            info: () => {},
            warn: () => {},
            error: () => {},
          },
        },
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@backend': './armonia-backend/src',
    },
  },
});