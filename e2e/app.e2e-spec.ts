import { test, expect } from '@playwright/test';

test('should return "Hello World!" from / ', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain('Hello World!');
});

test('should allow user registration', async ({ request }) => {
  const response = await request.post('/auth/register', {
    data: {
      email: 'e2e_test@example.com',
      password: 'password123',
      name: 'E2E Test User',
      role: 'RESIDENT',
      complexId: 1,
      schemaName: 'tenant_cj0001',
    },
  });
  expect(response.ok()).toBeTruthy();
  const jsonResponse = await response.json();
  expect(jsonResponse).toHaveProperty('id');
  expect(jsonResponse.email).toBe('e2e_test@example.com');
});

test('should allow user login and return JWT', async ({ request }) => {
  // First, ensure the user exists (register if not)
  await request.post('/auth/register', {
    data: {
      email: 'e2e_login@example.com',
      password: 'password123',
      name: 'E2E Login User',
      role: 'RESIDENT',
      complexId: 1,
      schemaName: 'tenant_cj0001',
    },
  });

  const response = await request.post('/auth/login', {
    data: {
      email: 'e2e_login@example.com',
      password: 'password123',
      schemaName: 'tenant_cj0001',
    },
  });
  expect(response.ok()).toBeTruthy();
  const jsonResponse = await response.json();
  expect(jsonResponse).toHaveProperty('access_token');
});

test('should access protected profile route with JWT', async ({ request }) => {
  // Register and login to get a token
  await request.post('/auth/register', {
    data: {
      email: 'e2e_profile@example.com',
      password: 'password123',
      name: 'E2E Profile User',
      role: 'RESIDENT',
      complexId: 1,
      schemaName: 'tenant_cj0001',
    },
  });

  const loginResponse = await request.post('/auth/login', {
    data: {
      email: 'e2e_profile@example.com',
      password: 'password123',
      schemaName: 'tenant_cj0001',
    },
  });
  const { access_token } = await loginResponse.json();

  const profileResponse = await request.post('/user/profile', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  expect(profileResponse.ok()).toBeTruthy();
  const jsonResponse = await profileResponse.json();
  expect(jsonResponse.email).toBe('e2e_profile@example.com');
});
