/**
 * Color theme system for the chart canvas.
 *
 * Each theme defines a complete set of visual tokens used to style
 * the canvas page, cards, borders, and text. Themes can be switched
 * at runtime and optionally overridden on a per-token basis.
 */

export interface ColorTheme {
  /** Unique identifier (e.g. 'default', 'ocean'). */
  id: string
  /** Human-readable name shown in the theme selector. */
  name: string
  /** Primary accent — used for selected card rings, active buttons, links. */
  primary: string
  /** Canvas page background (behind cards). */
  background: string
  /** Card surface colour (filled and empty cards). */
  surface: string
  /** Standard card border colour. */
  border: string
  /** Lighter border colour for empty / dashed cards. */
  borderLight: string
  /** Primary text colour (title, card labels). */
  text: string
  /** Muted / hint text colour (placeholders, secondary info). */
  textMuted: string
  /** Header background tint. */
  headerBg: string
}

/** Ordered list of all available themes. First entry is the default. */
export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'default',
    name: 'Default Blue',
    primary: '#3b82f6',
    background: '#ffffff',
    surface: '#ffffff',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b',
    headerBg: '#f8fafc',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    primary: '#000000',
    background: '#ffffff',
    surface: '#ffffff',
    border: '#000000',
    borderLight: '#64748b',
    text: '#000000',
    textMuted: '#475569',
    headerBg: '#f1f5f9',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    primary: '#818cf8',
    background: '#fef9f0',
    surface: '#ffffff',
    border: '#fde68a',
    borderLight: '#fef3c7',
    text: '#57534e',
    textMuted: '#78716c',
    headerBg: '#fffbeb',
  },
  {
    id: 'nature',
    name: 'Nature',
    primary: '#22c55e',
    background: '#f0fdf4',
    surface: '#ffffff',
    border: '#bbf7d0',
    borderLight: '#dcfce7',
    text: '#166534',
    textMuted: '#15803d',
    headerBg: '#ecfdf5',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#64748b',
    background: '#ffffff',
    surface: '#ffffff',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    headerBg: '#f8fafc',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#0ea5e9',
    background: '#f0f9ff',
    surface: '#ffffff',
    border: '#bae6fd',
    borderLight: '#e0f2fe',
    text: '#0c4a6e',
    textMuted: '#0369a1',
    headerBg: '#f0f9ff',
  },
]

/**
 * Look up a theme by its id.
 * Falls back to the default theme if `id` is unknown.
 */
export function getTheme(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0]
}

/** Convenience accessor for the default (first) theme. */
export function getDefaultTheme(): ColorTheme {
  return COLOR_THEMES[0]
}
