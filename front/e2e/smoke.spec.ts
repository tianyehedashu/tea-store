import { expect, test } from "@playwright/test"

import { countryCode, localePath } from "./helpers"

test.describe("Smoke", () => {
  test("home redirects to country storefront", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(new RegExp(`/${countryCode}(/|$)`))
  })

  test("navigation links are visible", async ({ page }) => {
    await page.goto(localePath("/store"))
    await expect(page.getByTestId("nav-store-link").first()).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Brewing Guides" })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Origins" })).toBeVisible()
  })

  test("backend health is reachable", async ({ request }) => {
    const backendUrl = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
    const response = await request.get(`${backendUrl}/health`)
    expect(response.ok()).toBeTruthy()
  })
})
