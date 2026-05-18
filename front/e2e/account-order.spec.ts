import { expect, test } from "@playwright/test"

import {
  addFirstProductToCart,
  completeCheckoutThroughOrder,
  localePath,
  registerCustomer,
} from "./helpers"

test.describe("Account orders", () => {
  test.setTimeout(120_000)

  test("register, place order, and view order details", async ({ page }) => {
    const { email } = await registerCustomer(page)

    await addFirstProductToCart(page)
    await page.getByTestId("nav-cart-link").first().click()
    await expect(page.getByTestId("cart-item").first()).toBeVisible({
      timeout: 20_000,
    })

    await completeCheckoutThroughOrder(page, email)

    await page.goto(localePath("/account/orders"))
    await expect(page.getByTestId("orders-page-wrapper")).toBeVisible()
    await expect(page.getByTestId("order-card").first()).toBeVisible({
      timeout: 15_000,
    })

    await page.getByTestId("order-details-link").first().click()
    await expect(page).toHaveURL(/\/account\/orders\/details\//)
    await expect(
      page.getByRole("heading", { name: "Order details", level: 1 })
    ).toBeVisible()
    await expect(page.getByTestId("order-details-container")).toBeVisible()
    await expect(page.getByTestId("products-table")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Delivery", level: 2 })
    ).toBeVisible()
  })
})
