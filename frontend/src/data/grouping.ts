import { ALGORITHMS, CATEGORIES_ORDER } from './catalog'
import type { Category } from '../types'

export const GROUPED = CATEGORIES_ORDER.map((category) => ({
  category,
  items: ALGORITHMS.filter((a) => a.category === category),
}))

export function groupCounts(): Record<Category, number> {
  const counts = Object.fromEntries(
    CATEGORIES_ORDER.map((c) => [c, 0]),
  ) as Record<Category, number>
  for (const a of ALGORITHMS) if (a.category in counts) counts[a.category] += 1
  return counts
}

export function operationLabels(id: string): { value: string; label: string }[] {
  const alg = ALGORITHMS.find((a) => a.id === id)
  if (!alg) return []
  return alg.operations.map((op) => ({
    value: op,
    label: op
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  }))
}