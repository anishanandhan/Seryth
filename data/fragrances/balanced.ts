import type { Fragrance } from '@/types'

// ═══ BALANCED / HYBRID ═══
export const balancedFragrances: Fragrance[] = [
  {
    id: 'golden-ratio',
    name: 'Golden Ratio',
    archetype: 'Harmonious & Universal',
    description: 'Mathematically balanced across all dimensions. The Fibonacci sequence as a fragrance.',
    notes: { top: ['Bergamot', 'Ginger'], heart: ['Rose', 'Vetiver'], base: ['Musk', 'Amber', 'Cedar'] },
    vector: [0.55, 0.55, 0.55, 0.55, 0.55, 0.55],
    mood: 'Balanced', season: 'Year-round', intensity: 'Moderate', gender: 'Unisex',
  },
  {
    id: 'tokyo-rain',
    name: 'Tokyo Rain',
    archetype: 'Urban & Poetic',
    description: 'Neon reflections on wet concrete. Cherry blossom and yuzu meet smoky incense.',
    notes: { top: ['Yuzu', 'Cherry Blossom'], heart: ['Incense', 'Green Tea'], base: ['Musk', 'Concrete Accord'] },
    vector: [0.40, 0.20, 0.45, 0.30, 0.35, 0.50],
    mood: 'Contemplative', season: 'Spring', intensity: 'Moderate', gender: 'Unisex',
  },
  {
    id: 'desert-rose',
    name: 'Desert Rose',
    archetype: 'Fierce & Beautiful',
    description: 'A rose that blooms in the Sahara. Delicate petals backed by scorching sands and dark resin.',
    notes: { top: ['Rose Oxide', 'Pink Pepper'], heart: ['Damask Rose', 'Saffron'], base: ['Oud', 'Sand Accord', 'Amber'] },
    vector: [0.60, 0.45, 0.08, 0.55, 0.40, 0.05],
    mood: 'Fierce', season: 'Year-round', intensity: 'Bold', gender: 'Unisex',
  },
  {
    id: 'silk-route',
    name: 'Silk Route',
    archetype: 'Exotic & Layered',
    description: 'A fragrance that crosses continents. Turkish rose, Indian sandalwood, Japanese incense, Italian citrus.',
    notes: { top: ['Bergamot', 'Pink Pepper'], heart: ['Turkish Rose', 'Japanese Incense'], base: ['Indian Sandalwood', 'Musk'] },
    vector: [0.45, 0.50, 0.20, 0.55, 0.45, 0.30],
    mood: 'Worldly', season: 'Autumn', intensity: 'Bold', gender: 'Unisex',
  },
  {
    id: 'neon-musk',
    name: 'Neon Musk',
    archetype: 'Modern & Synthetic',
    description: 'The first fragrance designed for the digital age. Clean synthetics, bright citrus, warm skin.',
    notes: { top: ['Lime', 'Aldehyde'], heart: ['Synthetic Musk', 'Violet Leaf'], base: ['White Amber', 'Cashmeran'] },
    vector: [0.15, 0.10, 0.40, 0.10, 0.65, 0.55],
    mood: 'Contemporary', season: 'Year-round', intensity: 'Moderate', gender: 'Unisex',
  },
  {
    id: 'autumn-equinox',
    name: 'Autumn Equinox',
    archetype: 'Transitional & Rich',
    description: 'The exact moment summer becomes autumn. Ripe fig, dry leaves, and the first fire of the season.',
    notes: { top: ['Fig', 'Bergamot'], heart: ['Dry Leaves', 'Cinnamon'], base: ['Firewood', 'Amber', 'Musk'] },
    vector: [0.20, 0.55, 0.15, 0.50, 0.40, 0.25],
    mood: 'Nostalgic', season: 'Autumn', intensity: 'Moderate', gender: 'Unisex',
  },
]
