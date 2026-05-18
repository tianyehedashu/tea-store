import EmptyState from "@modules/common/components/empty-state"

const EmptyCartMessage = () => {
  return (
    <div data-testid="empty-cart-message" className="py-12">
      <EmptyState
        title="Your cart is empty"
        description="Discover loose-leaf teas with origin stories and brewing guides for every cup."
        actionLabel="Browse teas"
        actionHref="/store"
        secondaryLabel="Brewing guides"
        secondaryHref="/guides"
      />
    </div>
  )
}

export default EmptyCartMessage
