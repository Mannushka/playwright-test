import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { UserDataFile } from "../../types/user.types";

const users: UserDataFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/users.json"), "utf-8"),
);

test("", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const glitchUser = users.problemUsers.find(
    (user) => user.username === "performance_glitch_user",
  );
  await page.getByPlaceholder(/Username/).fill(glitchUser.username);
  await page.getByPlaceholder(/Password/).fill(glitchUser.password);
  await page.getByRole("button", { name: /Login/ }).click();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.getByText(/Products/)).toBeVisible({ timeout: 10000 });
});
