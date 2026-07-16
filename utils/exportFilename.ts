/**
 * Shared export helpers: filename sanitisation + export quality type.
 *
 * These utilities are consumed by both {@link './exportPdf'} and
 * {@link './exportPng'} so that quality levels and filename conventions
 * stay consistent across every export path.
 */

/**
 * Export quality levels. Maps to the pixel-ratio `scale` used by the
 * capture engine (html2canvas):
 *  - `draft`  → scale 1 (fast, smallest file)
 *  - `normal` → scale 2 (good balance, default)
 *  - `high`   → scale 3 (print-ready, largest file)
 */
export type ExportQuality = 'draft' | 'normal' | 'high'

/** Pixel-ratio multiplier for each quality level. */
export const QUALITY_SCALE: Record<ExportQuality, number> = {
  draft: 1,
  normal: 2,
  high: 3,
}

/**
 * Convert a free-form chart title into a filesystem-safe slug.
 *
 * Replaces every run of non-alphanumeric characters with a hyphen and
 * lower-cases the result. Falls back to `'chart'` when the title contains
 * no usable characters (e.g. it was only emoji or punctuation).
 *
 * @example
 * sanitizeFilename('My Communication Chart!') // → 'my-communication-chart'
 * sanitizeFilename('+++')                       // → 'chart'
 */
export function sanitizeFilename(title: string): string {
  const slug = title
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '') // strip leading/trailing hyphens
    .toLowerCase()
  return slug || 'chart'
}

/**
 * Build a download filename from a chart title, appending today's date.
 *
 * @example
 * exportFilename('My Communication Chart', 'png')
 * // → 'my-communication-chart-2026-07-16.png'
 */
export function exportFilename(title: string, extension: string): string {
  const date = new Date().toISOString().split('T')[0]
  return `${sanitizeFilename(title)}-${date}.${extension}`
}
