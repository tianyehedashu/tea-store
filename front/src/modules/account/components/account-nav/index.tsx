"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const linkClass =
  "flex items-center justify-between py-3 px-4 rounded-lg text-sage-800 hover:bg-sage-50 hover:text-brand-600 transition-colors"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div className="small:py-6">
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-sm font-medium text-brand-600 py-2"
            data-testid="account-main-link"
          >
            <ChevronDown className="transform rotate-90" />
            <span>Account</span>
          </LocalizedClientLink>
        ) : (
          <>
            <p className="text-lg font-semibold text-sage-900 mb-4 px-1">
              Hello {customer?.first_name}
            </p>
            <ul className="space-y-1">
              <li>
                <LocalizedClientLink
                  href="/account/profile"
                  className={linkClass}
                  data-testid="profile-link"
                >
                  <span className="flex items-center gap-x-2">
                    <User size={20} />
                    Profile
                  </span>
                  <ChevronDown className="transform -rotate-90 text-sage-400" />
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/account/addresses"
                  className={linkClass}
                  data-testid="addresses-link"
                >
                  <span className="flex items-center gap-x-2">
                    <MapPin size={20} />
                    Addresses
                  </span>
                  <ChevronDown className="transform -rotate-90 text-sage-400" />
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/account/orders"
                  className={linkClass}
                  data-testid="orders-link"
                >
                  <span className="flex items-center gap-x-2">
                    <Package size={20} />
                    Orders
                  </span>
                  <ChevronDown className="transform -rotate-90 text-sage-400" />
                </LocalizedClientLink>
              </li>
              <li>
                <button
                  type="button"
                  className={clx(linkClass, "w-full")}
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  <span className="flex items-center gap-x-2">
                    <ArrowRightOnRectangle />
                    Log out
                  </span>
                </button>
              </li>
            </ul>
          </>
        )}
      </div>

      <div className="hidden small:block px-4" data-testid="account-nav">
        <p className="text-sm font-semibold uppercase tracking-wider text-sage-500 mb-4">
          Account
        </p>
        <ul className="flex flex-col gap-1">
          <li>
            <AccountNavLink
              href="/account"
              route={route!}
              data-testid="overview-link"
            >
              Overview
            </AccountNavLink>
          </li>
          <li>
            <AccountNavLink
              href="/account/profile"
              route={route!}
              data-testid="profile-link"
            >
              Profile
            </AccountNavLink>
          </li>
          <li>
            <AccountNavLink
              href="/account/addresses"
              route={route!}
              data-testid="addresses-link"
            >
              Addresses
            </AccountNavLink>
          </li>
          <li>
            <AccountNavLink
              href="/account/orders"
              route={route!}
              data-testid="orders-link"
            >
              Orders
            </AccountNavLink>
          </li>
          <li className="pt-2 border-t border-sage-200 mt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-sage-600 hover:text-brand-600 py-2"
              data-testid="logout-button"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "block px-3 py-2 rounded-lg text-sm transition-colors",
        active
          ? "bg-brand-50 text-brand-700 font-medium"
          : "text-sage-700 hover:bg-sage-50 hover:text-brand-600"
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
