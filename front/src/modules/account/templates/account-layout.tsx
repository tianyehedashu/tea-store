import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div
      className="flex-1 small:py-12 bg-cream-50/50 min-h-screen"
      data-testid="account-page"
    >
      <div className="flex-1 content-container h-full max-w-5xl mx-auto py-8 small:py-12">
        <div className="bg-white rounded-2xl border border-sage-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr]">
            {customer ? (
              <div className="border-b small:border-b-0 small:border-r border-sage-200 bg-sage-50/30 p-4 small:p-0">
                <AccountNav customer={customer} />
              </div>
            ) : null}
            <div className="flex-1 p-6 small:p-10">{children}</div>
          </div>
          <div className="flex flex-col small:flex-row items-start small:items-center justify-between border-t border-sage-200 px-6 small:px-10 py-8 gap-4 bg-sage-50/30">
            <div>
              <h3 className="text-lg font-semibold text-sage-900 mb-2">
                Got questions?
              </h3>
              <p className="text-sm text-sage-600">
                Find answers about shipping, returns, and brewing on our help
                page.
              </p>
            </div>
            <UnderlineLink href="/help">Help & FAQ</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
