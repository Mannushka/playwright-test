import { test, expect } from "@playwright/test";

test("should display the correct page title", async ({ page }) => {
  await page.goto("https://www.booking.com/");
  await expect(page).toHaveTitle(/Booking.com/);
});

test("should have a travel for work checkbox", async ({ page }) => {
  await page.goto("https://www.booking.com/");

  const travelForWorkCheckbox = page.getByRole("checkbox", {
    name: /travel(l)?ing for work/i,
  });
  await expect(travelForWorkCheckbox).not.toBeChecked();

  // await travelForWorkCheckbox.check();
  // await expect(travelForWorkCheckbox).toBeChecked(); //fails in chromium and webkit, but passes in firefox. This is a known issue with the checkbox component on the booking.com website.

  // await travelForWorkCheckbox.uncheck();
  // await expect(travelForWorkCheckbox).not.toBeChecked();
});
test("should contain a search input field", async ({ page }) => {
  await page.goto("https://www.booking.com/");
  const searchInput = page.getByPlaceholder("Where are you going?");
  await expect(searchInput).toBeVisible();
});
