import type { Fragrance } from '@/types'
import { floralFragrances } from './fragrances/floral'
import { woodyFragrances } from './fragrances/woody'
import { freshFragrances } from './fragrances/fresh'
import { spicyFragrances } from './fragrances/spicy'
import { muskFragrances } from './fragrances/musk'
import { citrusFragrances } from './fragrances/citrus'
import { balancedFragrances } from './fragrances/balanced'

/**
 * AURA Fragrance Database — 50 fragrances with 6D olfactory vectors.
 * Each vector: [floral, woody, fresh, spicy, musk, citrus]
 * Values normalized 0–1. Each fragrance has a distinct position in 6D space.
 */
export const fragrances: Fragrance[] = [
  ...floralFragrances,
  ...woodyFragrances,
  ...freshFragrances,
  ...spicyFragrances,
  ...muskFragrances,
  ...citrusFragrances,
  ...balancedFragrances,
]
