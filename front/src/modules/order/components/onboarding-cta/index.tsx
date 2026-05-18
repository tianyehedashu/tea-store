"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <Container className="max-w-4xl h-full bg-sage-50 border border-sage-200 rounded-2xl w-full">
      <div className="flex flex-col gap-y-4 p-6 md:items-center text-center">
        <Text className="text-sage-900 text-xl font-semibold">
          Your test order was successfully created! 🎉
        </Text>
        <Text className="text-sage-600 text-sm">
          You can now complete setting up your store in the admin.
        </Text>
        <Button
          className="w-fit !bg-brand-500 hover:!bg-brand-600"
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
