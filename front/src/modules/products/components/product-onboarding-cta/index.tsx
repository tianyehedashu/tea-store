import { Button, Container, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

async function ProductOnboardingCta() {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  if (!isOnboarding) {
    return null
  }

  return (
    <Container className="h-full w-full max-w-4xl rounded-lg border border-[#eadbc4] bg-white p-8">
      <div className="flex flex-col gap-y-4 text-center">
        <Text className="text-sage-900 text-xl font-semibold">
          Your demo product was successfully created.
        </Text>
        <Text className="text-sage-600 text-sm">
          You can now continue setting up your store in the admin.
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="brand-cta w-full">
            Continue setup in admin
          </Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
