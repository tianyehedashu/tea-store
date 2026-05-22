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
      className="min-h-screen flex-1 bg-[#fffaf2] small:py-12"
      data-testid="account-page"
    >
      <div className="flex-1 content-container h-full max-w-5xl mx-auto py-8 small:py-12">
        <div className="overflow-hidden rounded-lg border border-[#eadbc4] bg-white shadow-sm">
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr]">
            {customer ? (
              <div className="border-b border-[#eadbc4] bg-[#f5eddf] p-4 small:border-b-0 small:border-r small:p-0">
                <AccountNav customer={customer} />
              </div>
            ) : null}
            <div className="flex-1 p-6 small:p-10">{children}</div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 border-t border-[#eadbc4] bg-[#f5eddf] px-6 py-8 small:flex-row small:items-center small:px-10">
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
