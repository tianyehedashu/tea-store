import { expect, test } from "@playwright/test"

import { addFirstProductToCart, localePath } from "./helpers"

test.describe("Checkout", () => {
  test("shows address step, progress, and step shell", async ({ page }) => {
    await addFirstProductToCart(page)

    await page.getByTestId("nav-cart-link").first().click()
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.getByTestId("cart-item").first()).toBeVisible({
      timeout: 20_000,
    })

    await page.getByTestId("checkout-button").click()
    await expect(page).toHaveURL(/\/checkout/)
    await expect(
      page.getByRole("heading", { name: "Checkout", level: 1 })
    ).toBeVisible()
    await expect(page.getByLabel("Checkout progress")).toBeVisible()
    await expect(page.getByText("Address", { exact: true })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Shipping address", level: 2 })
    ).toBeVisible()
  })
})
