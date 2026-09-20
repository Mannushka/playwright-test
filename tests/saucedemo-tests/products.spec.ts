import { test, expect } from "@playwright/test";
import { UserDataFile } from "../../types/user.types";
import * as fs from "fs";
import * as path from "path";

const users: UserDataFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/users.json"), "utf-8"),
);

test.describe("Products Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    await page.getByPlaceholder(/Username/).fill(users.validUsers[0].username);
    await page.getByPlaceholder(/Password/).fill(users.validUsers[0].password);
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should display the item with lowest price when sorted by price from low to high", async ({
    page,
  }) => {
    const sortDropdown = page.locator(".product_sort_container");
    await sortDropdown.selectOption("lohi");
    await expect(page.locator(".inventory_item_price").first()).toHaveText(
      "$7.99",
    );
  });

  test("should add and remove items to cart and display the correct cart items count", async ({
    page,
  }) => {
    const addToCartButton = page.getByRole("button", { name: /Add to cart/ });

    for (let i = 0; i < 2; i++) await addToCartButton.nth(i).click();

    const cartBadge = page.locator(".shopping_cart_badge");
    await expect(cartBadge).toHaveText("2");

    await page
      .getByRole("button", { name: /Remove/ })
      .first()
      .click();
    await expect(cartBadge).toHaveText("1");
  });
});
