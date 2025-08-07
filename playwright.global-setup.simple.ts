import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Configurar variables de entorno para pruebas sin registro
  // Usar credenciales predefinidas que deberían existir en la base de datos
  const adminEmail = 'admin@test.com';
  const adminPassword = 'password123';
  const residentEmail = 'resident@test.com';
  const residentPassword = 'password123';
  const receptionEmail = 'reception@test.com';
  const receptionPassword = 'password123';

  // Store credentials for use in tests
  process.env.E2E_ADMIN_EMAIL = adminEmail;
  process.env.E2E_ADMIN_PASSWORD = adminPassword;
  process.env.E2E_RESIDENT_EMAIL = residentEmail;
  process.env.E2E_RESIDENT_PASSWORD = residentPassword;
  process.env.E2E_RECEPTION_EMAIL = receptionEmail;
  process.env.E2E_RECEPTION_PASSWORD = receptionPassword;

  console.log('Global setup completed with predefined credentials');
}

export default globalSetup;

