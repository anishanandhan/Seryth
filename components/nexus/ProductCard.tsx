'use client'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice: number
  rating: string
  reviews: string
  badge: string
  desc: string
  img: string
}

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
  onAddToCart: (product: Product) => void
  isAdded: boolean
}

export function ProductCard({ product, onQuickView, onAddToCart, isAdded }: ProductCardProps) {
  return (
    <article
      className={`product-card ${product.id === 5 ? 'featured' : ''}`}
      onClick={() => onQuickView(product)}
      role="group"
      aria-label={`${product.name} - $${product.price}`}
    >
      {product.badge && (
        <div
          className={`product-badge ${
            product.badge === 'New' ? 'new' : product.badge.startsWith('–') ? 'sale' : ''
          }`}
          aria-label={product.badge}
        >
          {product.badge}
        </div>
      )}
      <div className="product-image-wrap">
        <img
          src={product.img}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-overlay">
          <button
            className="btn-quick-view"
            onClick={(e) => {
              e.stopPropagation()
              onQuickView(product)
            }}
            aria-label={`Quick view ${product.name}`}
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-rating" role="group" aria-label={`Rating: ${product.rating}`}>
          <span className="stars" aria-hidden="true">{product.rating}</span>
          <span className="review-count">({product.reviews} reviews)</span>
        </div>
        <div className="product-footer">
          <div className="product-price">
            <span className="price-current" aria-label={`Current price: $${product.price}`}>
              ${product.price}
            </span>
            <span className="price-old" aria-label={`Original price: $${product.oldPrice}`}>
              ${product.oldPrice}
            </span>
          </div>
          <button
            className={`btn-add-cart ${isAdded ? 'added' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(product)
            }}
            aria-label={isAdded ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>{' '}
                Added!
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
