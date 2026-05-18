import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center mx-auto"
      data-testid="login-page"
    >
      <h1 className="font-display text-2xl font-bold text-sage-900 mb-2">
        Welcome back
      </h1>
      <p className="text-center text-sage-600 mb-8 leading-relaxed">
        Sign in to access order history, saved addresses, and faster checkout.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-6 !bg-brand-500 hover:!bg-brand-600"
        >
          Sign in
        </SubmitButton>
      </form>
      <p className="text-center text-sm text-sage-600 mt-6">
        Not a member?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-brand-600 font-medium hover:underline"
          data-testid="register-button"
        >
          Create an account
        </button>
      </p>
    </div>
  )
}

export default Login
