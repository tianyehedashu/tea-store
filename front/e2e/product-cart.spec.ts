import { expect, test } from "@playwright/test"

import { addFirstProductToCart, localePath } from "./helpers"

test.describe("Product and cart", () => {
  test("opens product detail and adds to cart", async ({ page }) => {
    await addFirstProductToCart(page)

    await page.getByTestId("nav-cart-link").first().click()
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.getByTestId("cart-item").first()).toBeVisible({
      timeout: 20_000,
    })
  })
})
