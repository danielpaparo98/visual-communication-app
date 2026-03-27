import type { Icon, IconCategory, CategoryInfo } from '~/types'

// Category configuration
export const CATEGORIES: CategoryInfo[] = [
  { id: 'alphabet', label: 'Alphabet & Numbers', icon: '🔤', color: 'blue' },
  { id: 'disability', label: 'Disability & Accessibility', icon: '♿', color: 'purple' },
  { id: 'family', label: 'Family & Relationships', icon: '👨‍👩‍👧‍👦', color: 'green' },
  { id: 'feminine-hygiene', label: 'Personal Care', icon: '🌸', color: 'pink' },
  { id: 'health', label: 'Health & Medical', icon: '🏥', color: 'red' },
]

// Parse filename to extract category and info
export function parseIconFilename(filename: string): { category: IconCategory; name: string } | null {
  // Files are named like: alphabet-001-A.svg, disability-050-lift.svg
  const match = filename.match(/^(alphabet|disability|family|feminine-hygiene|health)-(\d+)-(.+)\.svg$/)
  if (!match) return null
  
  const [, category, , name] = match
  return {
    category: category as IconCategory,
    name: name.trim(),
  }
}

// Generate keywords from name
export function generateKeywords(name: string): string[] {
  return name
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(word => word.length > 1)
}

// Get icon path
export function getIconPath(icon: Icon): string {
  return `/icons/${icon.filename}`
}

// Get category info by id
export function getCategoryInfo(categoryId: IconCategory): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.id === categoryId)
}
