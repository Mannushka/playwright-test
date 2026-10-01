import { UserDataFile, TestUser } from "../../types/user.types";
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "../../pages/LoginPage";

const users: UserDataFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/users.json"), "utf-8"),
);

test.describe("go to saucedemo page, check login functionality", () => {
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
    loginPage = new LoginPage(page);
    const validUser: TestUser = users.validUsers[0];
    await loginPage.login(validUser.username, validUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should not log in an invalid user", async ({ page }) => {
    for (const invalidUser of users.invalidUsers) {
      loginPage = new LoginPage(page);
      await loginPage.login(invalidUser.username, invalidUser.password);
      await expect(page.getByText(invalidUser.expectedError!)).toBeVisible();
    }
  });
});
