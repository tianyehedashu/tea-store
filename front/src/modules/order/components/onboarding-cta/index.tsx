"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <Container className="h-full w-full max-w-4xl rounded-lg border border-[#eadbc4] bg-white">
      <div className="flex flex-col gap-y-4 p-6 md:items-center text-center">
        <Text className="text-sage-900 text-xl font-semibold">
          Your test order was successfully created.
        </Text>
        <Text className="text-sage-600 text-sm">
          You can now complete setting up your store in the admin.
        </Text>
        <Button
          className="brand-cta w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          Complete setup in admin
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
