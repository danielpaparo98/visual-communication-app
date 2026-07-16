/**
 * Font preset definitions for The Talking Chart.
 *
 * Each preset describes a Google Font (or system font fallback) that can be
 * dynamically loaded and applied to the chart canvas.
 *
 * @module fontPresets
 */

export interface FontPreset {
  id: string
  name: string
  category: 'sans' | 'serif' | 'display' | 'dyslexia'
  googleFontName: string
  weights: number[]
  cssFamily: string
}

/**
 * Fonts suitable for headings (titles, emphasis).
 * Typically heavier weights and more display-oriented.
 */
export const HEADING_FONTS: FontPreset[] = [
  {
    id: 'outfit',
    name: 'Outfit',
    category: 'sans',
    googleFontName: 'Outfit',
    weights: [600, 700, 800, 900],
    cssFamily: "'Outfit', sans-serif",
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'sans',
    googleFontName: 'Inter',
    weights: [600, 700],
    cssFamily: "'Inter', sans-serif",
  },
  {
    id: 'atkinson',
    name: 'Atkinson Hyperlegible',
    category: 'dyslexia',
    googleFontName: 'Atkinson+Hyperlegible',
    weights: [700],
    cssFamily: "'Atkinson Hyperlegible', sans-serif",
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'sans',
    googleFontName: 'Poppins',
    weights: [600, 700],
    cssFamily: "'Poppins', sans-serif",
  },
]

/**
 * Fonts suitable for body / label text.
 * Prioritise readability at smaller sizes and dyslexia-friendly options.
 */
export const BODY_FONTS: FontPreset[] = [
  {
    id: 'inter',
    name: 'Inter',
    category: 'sans',
    googleFontName: 'Inter',
    weights: [400, 500, 600, 700],
    cssFamily: "'Inter', sans-serif",
  },
  {
    id: 'atkinson',
    name: 'Atkinson Hyperlegible',
    category: 'dyslexia',
    googleFontName: 'Atkinson+Hyperlegible',
    weights: [400, 700],
    cssFamily: "'Atkinson Hyperlegible', sans-serif",
  },
  {
    id: 'opensans',
    name: 'Open Sans',
    category: 'sans',
    googleFontName: 'Open+Sans',
    weights: [400, 600, 700],
    cssFamily: "'Open Sans', sans-serif",
  },
  {
    id: 'arial',
    name: 'Arial',
    category: 'sans',
    googleFontName: '',
    weights: [],
    cssFamily: 'Arial, sans-serif',
  },
]

/**
 * Resolve a FontPreset by id from a given preset list.
 * Returns the first preset in the list when `id` is not found (safe fallback).
 */
export function findFontById(id: string, fonts: FontPreset[]): FontPreset {
  return fonts.find((f) => f.id === id) ?? fonts[0]
}
