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

// Chart state for localStorage (v1 - backward compatible)
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

// ===== NEW TYPES FOR WYSIWYG EDITOR =====

// Layout presets
export type LayoutPreset = '2x10' | '4x5' | '5x4' | '3x7' | 'custom'

// Font families
export type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Poppins'

// Color themes
export type ColorTheme = 'neutral' | 'colorful' | 'high-contrast' | 'pastel' | 'dark'

// Background types
export type BackgroundType = 'solid' | 'gradient'

// Export quality
export type ExportQuality = 'standard' | 'high'

// Canvas settings
export interface CanvasSettings {
  layout: LayoutPreset
  columns: number
  rows: number
  cardGap: number // in mm
  marginTop: number // in mm
  marginBottom: number // in mm
  marginLeft: number // in mm
  marginRight: number // in mm
}

// Style settings
export interface StyleSettings {
  fontFamily: FontFamily
  headingFontSize: number // in pt
  subtitleFontSize: number // in pt
  theme: ColorTheme
  backgroundType: BackgroundType
  backgroundColor: string
  backgroundGradient: {
    start: string
    end: string
    direction: 'horizontal' | 'vertical' | 'diagonal'
  }
}

// Export settings
export interface ExportSettings {
  quality: ExportQuality
  includeWatermark: boolean
  filename: string
}

// Extended chart save data (v2 - backward compatible)
export interface ChartSaveDataV2 extends ChartSaveData {
  version: 2
  canvasSettings?: CanvasSettings
  styleSettings?: StyleSettings
  exportSettings?: ExportSettings
}

// Theme definitions
export interface ThemeDefinition {
  id: ColorTheme
  name: string
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
    cardBackground: string
    border: string
  }
}

// Layout preset definitions
export interface LayoutPresetDefinition {
  id: LayoutPreset
  name: string
  columns: number
  rows: number
  description: string
}

// Font family definitions
export interface FontFamilyDefinition {
  id: FontFamily
  name: string
  googleFont: string
  weights: number[]
}

// Default canvas settings
export const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  layout: '4x5',
  columns: 4,
  rows: 5,
  cardGap: 5,
  marginTop: 15,
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
}

// Default style settings
export const DEFAULT_STYLE_SETTINGS: StyleSettings = {
  fontFamily: 'Inter',
  headingFontSize: 12,
  subtitleFontSize: 10,
  theme: 'neutral',
  backgroundType: 'solid',
  backgroundColor: '#ffffff',
  backgroundGradient: {
    start: '#ffffff',
    end: '#f0f0f0',
    direction: 'horizontal',
  },
}

// Default export settings
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  quality: 'standard',
  includeWatermark: true,
  filename: 'my-communication-chart',
}

// A4 landscape dimensions (in mm)
export const A4_LANDSCAPE = {
  width: 297,
  height: 210,
}

// Zoom levels
export const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5]

// Layout presets configuration
export const LAYOUT_PRESETS: Record<LayoutPreset, { columns: number; rows: number; name: string; description: string }> = {
  '2x10': { columns: 2, rows: 10, name: '2 Columns', description: '2 columns × 10 rows - Large cards' },
  '4x5': { columns: 4, rows: 5, name: '4 Columns', description: '4 columns × 5 rows - Balanced' },
  '5x4': { columns: 5, rows: 4, name: '5 Columns', description: '5 columns × 4 rows - Compact' },
  '3x7': { columns: 3, rows: 7, name: '3 Columns', description: '3 columns × 7 rows - Medium' },
  'custom': { columns: 4, rows: 5, name: 'Custom', description: 'Custom layout' },
}

// Theme definitions
export const THEMES: Record<ColorTheme, ThemeDefinition> = {
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    colors: {
      primary: '#1f2937',
      secondary: '#4b5563',
      text: '#111827',
      background: '#ffffff',
      cardBackground: '#ffffff',
      border: '#e5e7eb',
    },
  },
  colorful: {
    id: 'colorful',
    name: 'Colorful',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      text: '#111827',
      background: '#f0f9ff',
      cardBackground: '#ffffff',
      border: '#bfdbfe',
    },
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast',
    colors: {
      primary: '#000000',
      secondary: '#000000',
      text: '#000000',
      background: '#ffffff',
      cardBackground: '#ffffff',
      border: '#000000',
    },
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    colors: {
      primary: '#6b7280',
      secondary: '#9ca3af',
      text: '#374151',
      background: '#fef3c7',
      cardBackground: '#ffffff',
      border: '#fde68a',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#f3f4f6',
      secondary: '#d1d5db',
      text: '#f9fafb',
      background: '#1f2937',
      cardBackground: '#374151',
      border: '#4b5563',
    },
  },
}

// Font family definitions
export const FONT_FAMILIES: Record<FontFamily, FontFamilyDefinition> = {
  Inter: { id: 'Inter', name: 'Inter', googleFont: 'Inter', weights: [400, 500, 600, 700] },
  Roboto: { id: 'Roboto', name: 'Roboto', googleFont: 'Roboto', weights: [400, 500, 700] },
  'Open Sans': { id: 'Open Sans', name: 'Open Sans', googleFont: 'Open+Sans', weights: [400, 500, 600, 700] },
  Lato: { id: 'Lato', name: 'Lato', googleFont: 'Lato', weights: [400, 500, 700] },
  Poppins: { id: 'Poppins', name: 'Poppins', googleFont: 'Poppins', weights: [400, 500, 600, 700] },
}
