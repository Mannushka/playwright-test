import { test, expect } from "@playwright/test";
import { UserDataFile } from "../../types/user.types";
import * as fs from "fs";
import * as path from "path";

const users: UserDataFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/users.json"), "utf-8"),
);

test("should display the item with lowest price when sorted by price from low to high", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder(/Username/).fill(users.validUsers[0].username);
  await page.getByPlaceholder(/Password/).fill(users.validUsers[0].password);
  await page.getByRole("button", { name: /Login/ }).click();
  await expect(page).toHaveURL(/.*inventory.html/);

  const sortDropdown = page.locator(".product_sort_container");
  await sortDropdown.selectOption("lohi");
  await expect(page.locator(".inventory_item_price").first()).toHaveText(
    "$7.99",
  );
});
