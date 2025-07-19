import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should allow a user to register", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    // Expect a success message or redirection to login/dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should allow a user to log in", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@example.com"); // Use a pre-registered user or register first
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    // Expect redirection to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should prevent access to protected routes without authentication", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Expect redirection to login page
    await expect(page).toHaveURL(/.*login/);
  });
});
