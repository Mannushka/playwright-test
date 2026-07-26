import { test, expect } from "@playwright/test";

test("should load login page with title and form controls", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await expect(page).toHaveTitle(/Swag Labs/);

  await expect(page.getByPlaceholder(/Username/)).toBeVisible();
  await expect(page.getByPlaceholder(/Password/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Login/ })).toBeVisible();
});

test("should log in a valid user", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder(/Username/).fill("standard_user");
  await page.getByPlaceholder(/Password/).fill("secret_sauce");
  await page.getByRole("button", { name: /Login/ }).click();
});
