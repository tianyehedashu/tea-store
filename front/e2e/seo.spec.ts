import { expect, test } from "@playwright/test"

test.describe("SEO routes", () => {
  test("sitemap.xml is available", async ({ request }) => {
    const response = await request.get("/sitemap.xml")
    expect(response.ok()).toBeTruthy()
    const body = await response.text()
    expect(body).toContain("<urlset")
    expect(body).toContain("/store")
  })

  test("robots.txt is available", async ({ request }) => {
    const response = await request.get("/robots.txt")
    expect(response.ok()).toBeTruthy()
    const body = await response.text()
    expect(body).toContain("Sitemap:")
    expect(body).toContain("Disallow: /checkout")
  })
})
