// Icon categories
export type IconCategory = 'alphabet' | 'disability' | 'family' | 'feminine-hygiene' | 'health'

// Icon interface
export interface Icon {
  id: string
  filename: string
  category: IconCategory
  alt: string
  keywords: string[]
}

// Card interface
export interface Card {
  id: string
  iconId: string | null
  heading: string
  subtitle: string
}

// Chart state for localStorage
export interface ChartSaveData {
  title: string
  cards: Card[]
}

// Category metadata
export interface CategoryInfo {
  id: IconCategory
  label: string
  icon: string // emoji or icon name
  color: string // Tailwind color class
}

// Local storage keys
export const STORAGE_KEYS = {
  CHART: 'talking-chart-data',
} as const

// Constants
export const CARD_COUNT = 20
export const MAX_HEADING_LENGTH = 12
export const MAX_SUBTITLE_LENGTH = 19
