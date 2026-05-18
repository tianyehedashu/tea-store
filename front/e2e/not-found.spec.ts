import { expect, test } from "@playwright/test"

import { localePath } from "./helpers"

test.describe("Not found pages", () => {
  test("store 404 uses brand styling", async ({ page }) => {
    await page.goto(localePath("/this-page-does-not-exist-404"))
    await expect(
      page.getByRole("heading", { name: "Page not found", level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Go to storefront" })
    ).toBeVisible()
  })

  test("account login page renders for guests", async ({ page }) => {
    await page.goto(localePath("/account"))
    await expect(page.getByTestId("login-page")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible()
  })
})
