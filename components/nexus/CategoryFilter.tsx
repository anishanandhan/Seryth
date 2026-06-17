'use client'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', label: 'All Products', icon: '' },
    { id: 'audio', label: 'Audio', icon: '🎧' },
    { id: 'wearables', label: 'Wearables', icon: '⌚' },
    { id: 'computing', label: 'Computing', icon: '💻' },
    { id: 'accessories', label: 'Accessories', icon: '⌨️' },
  ]

  return (
    <section className="categories" aria-label="Product categories">
      <div className="container">
        <div className="category-pills" role="group">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`pill ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
              aria-pressed={activeCategory === category.id}
            >
              {category.icon && `${category.icon} `}
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
