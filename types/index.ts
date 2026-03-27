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

// Chart state
export interface ChartState {
  title: string
  cards: Card[]
}
