/**
 * Icon library type definitions.
 *
 * Mirrors the structure of `public/icons-manifest.json` so that
 * loaders, pickers, and stores all reference the same shapes.
 */

/** A single entry from the icon manifest. */
export interface ManifestIcon {
  id: string
  filename: string
  category: string
  alt: string
  keywords: string[]
}

/** A grouped collection of icons (one per category). */
export interface IconCategory {
  id: string
  label: string
  icons: ManifestIcon[]
}
