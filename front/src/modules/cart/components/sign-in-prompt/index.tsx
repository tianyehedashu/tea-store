import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col small:flex-row small:items-center small:justify-between gap-4 rounded-xl bg-sage-50 border border-sage-200 p-5">
      <div>
        <h2 className="text-lg font-semibold text-sage-900">
          Already have an account?
        </h2>
        <p className="text-sm text-sage-600 mt-1">
          Sign in for faster checkout and order history.
        </p>
      </div>
      <LocalizedClientLink
        href="/account"
        className="brand-outline text-sm shrink-0 justify-center"
        data-testid="sign-in-button"
      >
        Sign in
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
