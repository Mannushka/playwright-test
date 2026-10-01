import { UserDataFile, TestUser } from "../../types/user.types";
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "../../pages/LoginPage";

const users: UserDataFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/users.json"), "utf-8"),
);

test.describe("go to saucedemo.com", () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test("should load login page with title and form controls", async ({
    page,
  }) => {
    await expect(page).toHaveTitle(/Swag Labs/);

    await expect(page.getByPlaceholder(/Username/)).toBeVisible();
    await expect(page.getByPlaceholder(/Password/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Login/ })).toBeVisible();
  });

  test("should display error message for empty username and password", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(
      page.getByText(/Epic sadface: Username is required/),
    ).toBeVisible();
  });

  test("should log in a valid user with correct credentials", async ({
    page,
  }) => {
    await page.getByPlaceholder(/Username/).fill(users.validUsers[0].username);
    await page.getByPlaceholder(/Password/).fill(users.validUsers[0].password);
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should not log in an invalid user", async ({ page }) => {
    for (const invalidUser of users.invalidUsers) {
      await page.getByPlaceholder(/Username/).fill(invalidUser.username);
      await page.getByPlaceholder(/Password/).fill(invalidUser.password);
      await page.getByRole("button", { name: /Login/ }).click();
      await expect(page.getByText(invalidUser.expectedError!)).toBeVisible();
    }
  });
});
