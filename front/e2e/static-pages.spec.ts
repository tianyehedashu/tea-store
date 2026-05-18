import { expect, test } from "@playwright/test"

import { localePath } from "./helpers"

test.describe("Static pages", () => {
  test("about page renders brand story", async ({ page }) => {
    await page.goto(localePath("/about"))
    await expect(
      page.getByRole("heading", { name: /Tea as ritual/i })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Shop teas" })).toBeVisible()
  })

  test("help page renders FAQ", async ({ page }) => {
    await page.goto(localePath("/help"))
    await expect(
      page.getByRole("heading", { name: "Help & FAQ" })
    ).toBeVisible()
    await expect(
      page.getByText("How should I store loose-leaf tea?")
    ).toBeVisible()
  })

  test("privacy page renders policy sections", async ({ page }) => {
    await page.goto(localePath("/privacy"))
    await expect(
      page.getByRole("heading", { name: "Privacy Policy", level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Information we collect", level: 2 })
    ).toBeVisible()
  })

  test("terms page renders service sections", async ({ page }) => {
    await page.goto(localePath("/terms"))
    await expect(
      page.getByRole("heading", { name: "Terms of Service", level: 1 })
    ).toBeVisible()
  })

  test("returns page renders refund policy", async ({ page }) => {
    await page.goto(localePath("/returns"))
    await expect(
      page.getByRole("heading", { name: "Returns & Refunds", level: 1 })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Help & FAQ" })).toBeVisible()
  })
})
