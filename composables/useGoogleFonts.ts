import type { FontPreset } from '~/utils/fontPresets'

/**
 * Module-level set of font IDs that have already been loaded into the
 * document.  Persists across component mounts / unmounts so fonts are
 * never reloaded.
 */
const _loadedFontIds = new Set<string>()

/**
 * Dynamically load Google Fonts by injecting `<link rel="stylesheet">` tags
 * into the document `<head>`.
 *
 * Accepts a reactive array of `FontPreset` objects (e.g. from a computed).
 * Only fonts that have **not** yet been loaded (tracked by the module-level
 * dedup set) will trigger new link tags.  Switching away from a font and
 * back will not reload it — the existing link tag remains in the DOM.
 *
 * @param fonts — a `Ref` (or `ComputedRef`) array of `FontPreset` to load.
 * @returns `{ fontsLoaded }` — `true` once the composable has processed the
 *          font list (fonts are requested, but may still be downloading).
 *
 * @example
 * ```ts
 * const { fontsLoaded } = useGoogleFonts(
 *   computed(() => [chartStore.activeHeadingFont, chartStore.activeBodyFont])
 * )
 * ```
 */
export function useGoogleFonts(fonts: Ref<FontPreset[]>) {
  const fontsLoaded = ref(false)

  /**
   * Compute `<link>` tag descriptors for fonts that need loading.
   * Skips fonts that:
   *  - Have no `googleFontName` (system fonts like Arial)
   *  - Have already been loaded (in the dedup set)
   */
  const links = computed(() => {
    return fonts.value
      .filter((f) => f.googleFontName && !_loadedFontIds.has(f.id))
      .map((f) => {
        _loadedFontIds.add(f.id)
        const weights = f.weights.join(';')
        return {
          rel: 'stylesheet' as const,
          href: `https://fonts.googleapis.com/css2?family=${f.googleFontName}:wght@${weights}&display=swap`,
        }
      })
  })

  // Inject link tags into the document <head> via Nuxt's useHead.
  // Reactively updates when `fonts` changes.
  useHead({ link: links })

  // Once we've processed at least the initial font list, mark as loaded.
  watchEffect(() => {
    if (fonts.value.length > 0) {
      fontsLoaded.value = true
    }
  })

  return { fontsLoaded }
}
