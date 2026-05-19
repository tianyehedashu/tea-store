import { expect, test } from "@playwright/test"

import { addFirstProductToCart, localePath } from "./helpers"

test.describe("Product and cart", () => {
  test("shows Amazon-style listing fields on product detail", async ({
    page,
  }) => {
    await page.goto(localePath("/store"))
    await page.getByTestId("product-wrapper").first().click()
    await expect(page.getByTestId("product-title")).toBeVisible()
    await expect(page.getByTestId("product-bullet-points")).toBeVisible()
    await expect(page.getByTestId("product-specifications")).toBeVisible()
    await expect(page.getByTestId("product-breadcrumb")).toBeVisible()
    await expect(page.getByTestId("product-quantity-select")).toBeVisible()
  })

  test("opens product detail and adds to cart", async ({ page }) => {
    await addFirstProductToCart(page)

    await page.getByTestId("nav-cart-link").first().click()
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.getByTestId("cart-item").first()).toBeVisible({
      timeout: 20_000,
    })
  })
})
