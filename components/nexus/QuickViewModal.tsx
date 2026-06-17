'use client'

import { Product } from './ProductCard'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  return (
    <div
      className={`modal-overlay ${product ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-hidden={!product}
      aria-labelledby={product ? 'modal-product-name' : undefined}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close quick view">
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
        {product && (
          <div className="modal-content">
            <div className="modal-inner">
              <img src={product.img} alt={product.name} className="modal-img" />
              <div className="modal-details">
                <div className="modal-category">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <h3 className="modal-name" id="modal-product-name">
                  {product.name}
                </h3>
                <p className="modal-desc">{product.desc}</p>
                <div className="modal-rating" aria-label={`Rating: ${product.rating}`}>
                  <span className="stars" aria-hidden="true">
                    {product.rating}
                  </span>
                  <span className="review-count">({product.reviews} reviews)</span>
                </div>
                <div className="modal-price">
                  <span className="price-current" aria-label={`Price: $${product.price}`}>
                    ${product.price}
                  </span>
                  <span className="price-old" aria-label={`Original price: $${product.oldPrice}`}>
                    ${product.oldPrice}
                  </span>
                </div>
                <button
                  className="modal-btn"
                  onClick={() => onAddToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
