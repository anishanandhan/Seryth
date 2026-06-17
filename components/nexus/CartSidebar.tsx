'use client'

export interface CartItem {
  id: number
  name: string
  price: number
  qty: number
  img: string
}

interface CartSidebarProps {
  cart: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQty: (id: number, delta: number) => void
  onRemoveItem: (id: number) => void
  onCheckout: () => void
}

export function CartSidebar({
  cart,
  isOpen,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`cart-sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!isOpen}
      >
        <div className="cart-header">
          <h2 id="cart-title">Your Cart</h2>
          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
            title="Close cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="cart-items" role="list">
          {cart.length === 0 ? (
            <div className="cart-empty" role="status">
              <div className="cart-empty-icon" aria-hidden="true">🛒</div>
              <p>Your cart is empty</p>
              <span>Add some amazing products!</span>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id} role="listitem">
                <img
                  src={item.img}
                  alt={item.name}
                  className="cart-item-img"
                  loading="lazy"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price" aria-label={`Price: $${item.price}`}>
                    ${item.price}
                  </div>
                  <div className="cart-item-qty" role="group" aria-label={`Quantity: ${item.qty}`}>
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQty(item.id, -1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-number" aria-live="polite">
                      {item.qty}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQty(item.id, 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                  title={`Remove ${item.name}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total" role="status" aria-live="polite">
              <span>Total</span>
              <span aria-label={`Total: $${cartTotal.toLocaleString()}`}>
                ${cartTotal.toLocaleString()}
              </span>
            </div>
            <button
              className="btn-checkout"
              onClick={onCheckout}
              aria-label="Proceed to checkout"
            >
              Checkout — Pay Now
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
