"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center mx-auto"
      data-testid="register-page"
    >
      <h1 className="font-display text-2xl font-bold text-sage-900 mb-2 text-center">
        Join Zentee
      </h1>
      <p className="text-center text-sage-600 mb-6 leading-relaxed">
        Create an account for order history, saved addresses, and a smoother
        checkout.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <p className="text-center text-xs text-sage-600 mt-6 leading-relaxed">
          By creating an account, you agree to Zentee&apos;s{" "}
          <LocalizedClientLink
            href="/privacy"
            className="text-brand-600 hover:underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/terms"
            className="text-brand-600 hover:underline"
          >
            Terms of Service
          </LocalizedClientLink>
          .
        </p>
        <SubmitButton
          className="w-full mt-6 !bg-brand-500 hover:!bg-brand-600"
          data-testid="register-button"
        >
          Create account
        </SubmitButton>
      </form>
      <p className="text-center text-sm text-sage-600 mt-6">
        Already a member?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-brand-600 font-medium hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
