import { expect, type Page } from "@playwright/test"

/** Country prefix used by Next.js middleware (must exist in Medusa regions). */
export const countryCode = process.env.E2E_COUNTRY_CODE ?? "us"

export const e2eCustomerEmail =
  process.env.E2E_CUSTOMER_EMAIL ?? `e2e-${Date.now()}@zentee.test`

export const e2eCustomerPassword =
  process.env.E2E_CUSTOMER_PASSWORD ?? "E2eTestPass123!"

export function localePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/") {
    return `/${countryCode}`
  }
  return `/${countryCode}${normalized}`
}

export function uniqueTestEmail(): string {
  return `e2e-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}@zentee.test`
}

export async function addFirstProductToCart(page: Page) {
  await page.goto(localePath("/store"))
  await page.getByTestId("product-wrapper").first().click()
  await expect(page.getByTestId("product-title")).toBeVisible()

  const optionButton = page.getByTestId("option-button").first()
  if (await optionButton.isVisible().catch(() => false)) {
    await optionButton.click()
  }

  const addButton = page.getByTestId("add-product-button")
  await expect(addButton).toBeEnabled({ timeout: 15_000 })
  await addButton.click()
}

export async function registerCustomer(
  page: Page,
  options?: { email?: string; password?: string }
) {
  const email = options?.email ?? uniqueTestEmail()
  const password = options?.password ?? e2eCustomerPassword

  await page.goto(localePath("/account"))
  await page.getByTestId("register-button").click()
  await expect(page.getByTestId("register-page")).toBeVisible()

  await page.getByTestId("first-name-input").fill("E2E")
  await page.getByTestId("last-name-input").fill("Tester")
  await page.getByTestId("email-input").fill(email)
  await page.getByTestId("password-input").fill(password)
  await page.getByTestId("register-button").click()

  await expect(page.getByTestId("overview-page-wrapper")).toBeVisible({
    timeout: 25_000,
  })

  return { email, password }
}

export async function loginCustomer(
  page: Page,
  email: string,
  password: string
) {
  await page.goto(localePath("/account"))
  await page.getByTestId("email-input").fill(email)
  await page.getByTestId("password-input").fill(password)
  await page.getByTestId("sign-in-button").click()
  await expect(page.getByTestId("overview-page-wrapper")).toBeVisible({
    timeout: 25_000,
  })
}

export async function fillCheckoutAddress(page: Page, email: string) {
  await page.getByTestId("shipping-first-name-input").fill("E2E")
  await page.getByTestId("shipping-last-name-input").fill("Tester")
  await page.getByTestId("shipping-address-input").fill("123 Tea Lane")
  await page.getByTestId("shipping-postal-code-input").fill("10001")
  await page.getByTestId("shipping-city-input").fill("New York")
  await page.getByTestId("shipping-province-input").fill("NY")
  await page.getByTestId("shipping-country-select").selectOption("us")
  await page.getByTestId("shipping-email-input").fill(email)
  await page.getByTestId("shipping-phone-input").fill("5550100199")
}

export async function completeCheckoutThroughOrder(page: Page, email: string) {
  await page.getByTestId("checkout-button").click()
  await expect(page).toHaveURL(/\/checkout/)

  await fillCheckoutAddress(page, email)
  await page.getByTestId("submit-address-button").click()

  await expect(
    page.getByRole("heading", { name: "Delivery", level: 2 })
  ).toBeVisible({ timeout: 20_000 })

  await page.getByTestId("delivery-option-radio").first().click()
  await page.getByTestId("submit-delivery-option-button").click()

  await expect(
    page.getByRole("heading", { name: "Payment", level: 2 })
  ).toBeVisible({ timeout: 20_000 })

  const manualOption = page.getByTestId("payment-option-pp_system_default")
  if (await manualOption.isVisible().catch(() => false)) {
    await manualOption.click()
  }

  await page.getByTestId("submit-payment-button").click()

  await expect(
    page.getByRole("heading", { name: /Review & place order/i, level: 2 })
  ).toBeVisible({ timeout: 20_000 })

  await page.getByTestId("submit-order-button").click()

  await expect(
    page.getByRole("heading", { name: "Thank you!", level: 1 })
  ).toBeVisible({ timeout: 45_000 })
}
