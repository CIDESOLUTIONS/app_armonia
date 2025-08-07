import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  // Create admin user and complex
  const adminEmail = `admin.e2e.${Date.now()}@test.com`;
  const adminPassword = 'password123';

  // Register complex and admin
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/es/register-complex`);
  
  // Usar selectores basados en el código real del formulario
  await page.fill('input[name="complexName"]', "Global Setup Complex");
  await page.fill('input[name="address"]', "Calle Global #123");
  await page.fill('input[name="adminName"]', "Global Admin");
  await page.fill('input[name="email"]', adminEmail);
  await page.fill('input[name="password"]', adminPassword);
  
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*login/); // Wait for redirection to login page

  // Store the admin credentials for use in tests
  process.env.E2E_ADMIN_EMAIL = adminEmail;
  process.env.E2E_ADMIN_PASSWORD = adminPassword;

  await browser.close();
}

export default globalSetup;
