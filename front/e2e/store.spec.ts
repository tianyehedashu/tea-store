import { expect, test } from "@playwright/test"

import { localePath } from "./helpers"

test.describe("Store", () => {
  test("store page lists teas", async ({ page }) => {
    await page.goto(localePath("/store"))
    await expect(page.getByTestId("store-page-title")).toBeVisible()
    await expect(page.getByTestId("products-list")).toBeVisible()
    await expect(page.getByTestId("product-wrapper").first()).toBeVisible()
  })

  test("tea type filter updates URL", async ({ page }) => {
    await page.goto(localePath("/store"))

    const greenTea = page.getByRole("button", { name: "Green Tea" })
    if (await greenTea.isVisible()) {
      await greenTea.click()
    } else {
      await page.getByRole("button", { name: /^filters/i }).click()
      await page.getByRole("button", { name: "Green Tea" }).click()
      await page.getByRole("button", { name: /show results/i }).click()
    }

    await expect(page).toHaveURL(/tea_type=green/)
  })

  test("mobile filter drawer opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(localePath("/store"))

    await page.getByRole("button", { name: /^filters/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByText("Filters & sort")).toBeVisible()
  })
})
