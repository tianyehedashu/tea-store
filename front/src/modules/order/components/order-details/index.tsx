import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="text-sm text-sage-700">
      <Text>
        We have sent the order confirmation details to{" "}
        <span className="font-semibold text-sage-900" data-testid="order-email">
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Order date:{" "}
        <span className="text-sage-900" data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-brand-600 font-medium">
        Order number: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
        {showStatus && (
          <>
            <Text>
              Order status:{" "}
              <span className="text-sage-600" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Payment status:{" "}
              <span
                className="text-sage-600"
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
