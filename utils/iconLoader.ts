import { BASE_URL } from './config'
import type { ManifestIcon, IconCategory } from '~/types/icons'

// Cache for loaded data
let cachedCategories: IconCategory[] | null = null
let loadPromise: Promise<IconCategory[]> | null = null

// Human-readable category labels
const CATEGORY_LABELS: Record<string, string> = {
  alphabet: 'Alphabet',
  disability: 'Disability',
  family: 'Family',
  'feminine-hygiene': 'Feminine Hygiene',
  health: 'Health',
  'human-body': 'Human Body',
  hygiene: 'Hygiene',
  nursing: 'Nursing',
  'nursing-home': 'Nursing Home',
}

/**
 * Fetch the icon manifest and group icons by category.
 * Results are cached after first load.  Automatically retries once on failure.
 */
export async function loadIconCategories(): Promise<IconCategory[]> {
  if (cachedCategories) return cachedCategories
  if (loadPromise) return loadPromise

  const doFetch = (attempt: number): Promise<ManifestIcon[]> =>
    fetch(`${BASE_URL}/icons-manifest.json`).then((res) => {
      if (!res.ok)
        throw new Error(
          `Unable to load the icon library (server returned ${res.status}). Please try again.`,
        )
      return res.json() as Promise<ManifestIcon[]>
    })

  loadPromise = doFetch(1).catch((err: unknown) => {
    // One automatic retry after a short delay for transient failures
    return new Promise<ManifestIcon[]>((resolve, reject) => {
      setTimeout(() => {
        doFetch(2).then(resolve).catch(reject)
      }, 800)
    })
  })
    .then((icons) => {
      const grouped: Record<string, ManifestIcon[]> = {}
      for (const icon of icons) {
        const cat = icon.category
        if (!grouped[cat]) grouped[cat] = []
        grouped[cat].push(icon)
      }

      // Order: disability → family → ... → alphabet, then any remaining
      const categoryOrder = [
        'disability',
        'family',
        'feminine-hygiene',
        'health',
        'human-body',
        'hygiene',
        'nursing',
        'nursing-home',
        'alphabet',
      ]

      const categories: IconCategory[] = []
      for (const id of categoryOrder) {
        if (grouped[id]) {
          categories.push({
            id,
            label: CATEGORY_LABELS[id] || id,
            icons: grouped[id],
          })
          delete grouped[id]
        }
      }
      // Add any remaining (uncategorized) categories
      for (const [id, icons] of Object.entries(grouped)) {
        categories.push({
          id,
          label: CATEGORY_LABELS[id] || id,
          icons,
        })
      }

      cachedCategories = categories
      return categories
    })
    .finally(() => {
      loadPromise = null
    })

  return loadPromise
}

/**
 * Search icons across all categories.
 */
export async function searchIcons(query: string): Promise<ManifestIcon[]> {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const categories = await loadIconCategories()
  const results: ManifestIcon[] = []
  for (const cat of categories) {
    for (const icon of cat.icons) {
      if (
        icon.alt.toLowerCase().includes(q) ||
        icon.keywords.some((k) => k.toLowerCase().includes(q))
      ) {
        results.push(icon)
      }
    }
  }
  return results
}

/**
 * Get the full URL for an icon file.
 */
export function iconUrl(filename: string): string {
  return `${BASE_URL}/icons/${filename}`
}
