import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="space-y-8">
      <div className="flex flex-col gap-2 small:flex-row small:justify-between small:items-center">
        <span
          className="text-xl font-semibold text-sage-900"
          data-testid="welcome-message"
          data-value={customer?.first_name}
        >
          Hello {customer?.first_name}
        </span>
        <span className="text-sm text-sage-600">
          Signed in as{" "}
          <span
            className="font-medium text-sage-900"
            data-testid="customer-email"
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 small:gap-8">
        <div className="rounded-xl border border-sage-200 bg-sage-50/50 p-5">
          <h3 className="text-sm font-medium text-sage-600 uppercase tracking-wide">
            Profile
          </h3>
          <div className="mt-2 flex items-end gap-2">
            <span
              className="text-3xl font-bold text-sage-900"
              data-testid="customer-profile-completion"
              data-value={getProfileCompletion(customer)}
            >
              {getProfileCompletion(customer)}%
            </span>
            <span className="text-sm text-sage-600">complete</span>
          </div>
        </div>
        <div className="rounded-xl border border-sage-200 bg-sage-50/50 p-5">
          <h3 className="text-sm font-medium text-sage-600 uppercase tracking-wide">
            Addresses
          </h3>
          <div className="mt-2 flex items-end gap-2">
            <span
              className="text-3xl font-bold text-sage-900"
              data-testid="addresses-count"
              data-value={customer?.addresses?.length || 0}
            >
              {customer?.addresses?.length || 0}
            </span>
            <span className="text-sm text-sage-600">saved</span>
          </div>
        </div>
      </div>

      <div className="border-t border-sage-200 pt-8 space-y-4">
        <h3 className="text-lg font-semibold text-sage-900">Recent orders</h3>
        <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                data-testid="order-wrapper"
                data-value={order.id}
              >
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                >
                  <Container className="bg-sage-50 border border-sage-200 flex justify-between items-center p-4 rounded-xl">
                    <div className="grid grid-cols-3 grid-rows-2 text-sm gap-x-4 flex-1 text-sage-700">
                      <span className="font-semibold text-sage-900">
                        Date placed
                      </span>
                      <span className="font-semibold text-sage-900">
                        Order number
                      </span>
                      <span className="font-semibold text-sage-900">
                        Total amount
                      </span>
                      <span data-testid="order-created-date">
                        {new Date(order.created_at).toDateString()}
                      </span>
                      <span
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </span>
                      <span data-testid="order-amount">
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </span>
                    </div>
                    <span className="sr-only">
                      Go to order #{order.display_id}
                    </span>
                    <ChevronDown className="-rotate-90 text-sage-500" />
                  </Container>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li>
              <p className="text-sage-600" data-testid="no-orders-message">
                No recent orders.{" "}
                <LocalizedClientLink
                  href="/store"
                  className="text-brand-600 hover:underline"
                >
                  Browse teas
                </LocalizedClientLink>
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
