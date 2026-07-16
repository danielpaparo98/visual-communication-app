/**
 * Shared application configuration.
 *
 * `BASE_URL` matches the `baseURL` in `nuxt.config.ts` so assets resolve
 * correctly on GitHub Pages.  Import this constant everywhere you need to
 * build a URL for a static asset (icons, favicon, etc.).
 */
export const BASE_URL = '/visual-communication-app'

/**
 * Storage key constants for localStorage persistence.
 *
 * All chart-data keys follow the pattern: `ttc-chart-{id}`
 * Backup keys follow: `ttc-chart-{id}-backup-{0,1,2}`
 *
 * The chart manager metadata (summary list + active id) use their own keys.
 */
export const STORAGE_KEYS = {
  /** Key for the serialised chart summary list. */
  CHART_MANAGER: 'ttc-chart-manager',
  /** Key for the active chart id (restored on next visit). */
  CHART_ACTIVE: 'ttc-chart-active',
  /** Prefix for per-chart data keys.  Chart id is appended. */
  CHART_DATA_PREFIX: 'ttc-chart-',
  /** Number of rotating backup snapshots kept per chart. */
  BACKUP_COUNT: 3,
  /** Hard limit on how many charts a user can create. */
  MAX_CHARTS: 20,
} as const
