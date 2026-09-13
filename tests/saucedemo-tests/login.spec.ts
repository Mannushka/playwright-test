import { UserDataFile, TestUser } from "../../types/user.types";
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const users: UserDataFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/users.json"), "utf-8"),
);

test("should load login page with title and form controls", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await expect(page).toHaveTitle(/Swag Labs/);

  await expect(page.getByPlaceholder(/Username/)).toBeVisible();
  await expect(page.getByPlaceholder(/Password/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Login/ })).toBeVisible();
});

test("should log in a valid user with correct credentials", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder(/Username/).fill(users.validUsers[0].username);
  await page.getByPlaceholder(/Password/).fill(users.validUsers[0].password);
  await page.getByRole("button", { name: /Login/ }).click();
  await expect(page).toHaveURL(/.*inventory.html/);
});

test("should not log in an invalid user", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  for (const invalidUser of users.invalidUsers) {
    await page.getByPlaceholder(/Username/).fill(invalidUser.username);
    await page.getByPlaceholder(/Password/).fill(invalidUser.password);
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(page.getByText(invalidUser.expectedError!)).toBeVisible();
  }
});
