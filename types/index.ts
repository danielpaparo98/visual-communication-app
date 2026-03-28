// Icon categories
export type IconCategory = 'alphabet' | 'disability' | 'family' | 'feminine-hygiene' | 'health' | 'custom'

// Icon interface
export interface Icon {
  id: string
  filename: string
  category: IconCategory
  alt: string
  keywords: string[]
  svg?: string // Inline SVG for faster loading
}

// Custom icon interface
export interface CustomIcon {
  id: string
  filename: string
  originalFilename: string
  dataUrl: string
  thumbnailUrl: string
  size: number
  createdAt: Date
}

// Card interface
export interface Card {
  id: string
  iconId: string | null
  customIconId: string | null
  heading: string
  subtitle: string
  textFormatting: TextFormatting
  position?: { x: number; y: number }
  zIndex?: number
}

// Text formatting interface
export interface TextFormatting {
  bold: boolean
  italic: boolean
  underline: boolean
  color: string
  backgroundColor?: string
  fontSize: number
  alignment: 'left' | 'center' | 'right'
  lineHeight: number
}

// Chart state for localStorage (v1 - backward compatible)
export interface ChartSaveData {
  title: string
  cards: Card[]
}

// Chart state for localStorage (v3 - current)
export interface ChartSaveDataV3 {
  version: 3
  id: string
  title: string
  cards: Card[]
  canvasSettings: CanvasSettings
  styleSettings: StyleSettings
  exportSettings: ExportSettings
  customIcons: CustomIcon[]
  createdAt: Date
  updatedAt: Date
}

// History state for undo/redo
export interface HistoryState {
  cards: Card[]
  canvasSettings: CanvasSettings
  styleSettings: StyleSettings
  timestamp: number
  description: string
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
  HISTORY: 'talking-chart-history',
  UI: 'talking-chart-ui',
  CUSTOM_ICONS: 'talking-chart-custom-icons',
  ONBOARDING: 'talking-chart-onboarding',
} as const

// Constants
export const CARD_COUNT = 20
export const MAX_HEADING_LENGTH = 12
export const MAX_SUBTITLE_LENGTH = 19
export const MAX_CARDS = 50
export const MAX_HISTORY_SIZE = 50
export const MAX_CUSTOM_ICON_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

// ===== NEW TYPES FOR WYSIWYG EDITOR =====

// Layout presets
export type LayoutPreset = '2x10' | '4x5' | '5x4' | '3x7' | 'custom'

// Font families
export type FontFamily = 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Poppins'

// Color themes
export type ColorTheme = 'neutral' | 'colorful' | 'high-contrast' | 'pastel' | 'dark'

// Background types
export type BackgroundType = 'solid' | 'gradient' | 'image'

// Export format
export type ExportFormat = 'pdf' | 'png' | 'jpg' | 'svg'

// Export quality
export type ExportQuality = 'draft' | 'standard' | 'high' | 'ultra'

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
  format: ExportFormat
}

// Export options
export interface ExportOptions {
  format: ExportFormat
  quality?: ExportQuality
  scale?: number
  transparent?: boolean
}

// Extended chart save data (v2 - backward compatible)
export interface ChartSaveDataV2 extends ChartSaveData {
  version: 2
  canvasSettings?: CanvasSettings
  styleSettings?: StyleSettings
  exportSettings?: ExportSettings
}

// Default text formatting
export const DEFAULT_TEXT_FORMATTING: TextFormatting = {
  bold: false,
  italic: false,
  underline: false,
  color: '#000000',
  fontSize: 12,
  alignment: 'center',
  lineHeight: 1.2,
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
  format: 'pdf',
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

// ===== UI TYPES =====

// Toolbar section type
export type ToolbarSection = 'layout' | 'cards' | 'style' | 'format'

// Notification type
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  handler: () => void
}

// Toast type
export interface Toast {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration?: number
}

// Tour step type
export interface TourStep {
  id: string
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: TourStepAction
}

export interface TourStepAction {
  label: string
  handler: () => void
}

// Validation types
export interface ValidationError {
  id: string
  type: 'card' | 'canvas' | 'export'
  message: string
  cardId?: string
}

export interface ValidationWarning {
  id: string
  type: 'card' | 'canvas' | 'export'
  message: string
  cardId?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// Error types
export interface EditorError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

export interface UploadError {
  type: 'size' | 'format' | 'network' | 'unknown'
  message: string
  file?: File
}

// Image data type
export interface ImageData {
  dataUrl: string
  thumbnailUrl: string
  width: number
  height: number
  originalSize: number
  compressedSize: number
  format: string
}

// Compressed image type
export interface CompressedImage {
  dataUrl: string
  blob: Blob
  width: number
  height: number
  originalSize: number
  compressedSize: number
  format: string
}

// Compression options
export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: string
}

// Virtual scroll options
export interface VirtualScrollOptions {
  itemHeight?: number
  buffer?: number
}

// Performance metrics
export interface PerformanceMetrics {
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

// Category info with custom
export const CATEGORIES: CategoryInfo[] = [
  { id: 'alphabet', label: 'Alphabet', icon: '🔤', color: 'bg-blue-500' },
  { id: 'disability', label: 'Disability', icon: '♿', color: 'bg-purple-500' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: 'bg-pink-500' },
  { id: 'feminine-hygiene', label: 'Feminine Hygiene', icon: '🌸', color: 'bg-rose-500' },
  { id: 'health', label: 'Health', icon: '🏥', color: 'bg-green-500' },
  { id: 'custom', label: 'Custom', icon: '📷', color: 'bg-orange-500' },
]

// ===== NEW TYPES FOR CHARTS PAGE REDESIGN =====

// Viewport size type
export type ViewportSize = 'desktop' | 'tablet' | 'mobile'

// Editor Layout Types
export interface EditorLayoutState {
  sidePanelOpen: boolean
  activeSection: EditorSection | null
  floatingControlsVisible: boolean
  bottomSheetOpen: boolean
  bottomSheetExpanded: boolean
  viewportSize: ViewportSize
}

export type EditorSection = 'layout' | 'cards' | 'style' | 'export'

// Extended Export Types
export type PaperSize = 'a4' | 'letter' | 'legal' | 'a3' | 'a5' | 'custom'

export interface ExtendedExportSettings {
  format: ExportFormat
  quality: ExportQuality
  paperSize: PaperSize
  orientation: 'portrait' | 'landscape'
  margins: PrintMargins
  scale: number
  colorMode: 'color' | 'grayscale' | 'black-white'
}

export interface PrintMargins {
  top: number
  right: number
  bottom: number
  left: number
}

// Watermark Types
export interface WatermarkSettings {
  enabled: boolean
  text: string
  position: WatermarkPosition
  fontFamily: string
  fontSize: number
  fontWeight: 'normal' | 'bold' | 'light'
  color: string
  opacity: number
  rotation: number
  margin: number
}

export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center'

// Export History Types
export interface ExportHistoryItem {
  id: string
  timestamp: number
  filename: string
  format: ExportFormat
  quality: ExportQuality
  paperSize: PaperSize
  chartTitle: string
}

// Export Template Types
export interface ExportTemplate {
  id: string
  name: string
  settings: ExtendedExportSettings
  watermark: WatermarkSettings
  createdAt: number
}

// Paper size dimensions (in mm)
export const PAPER_SIZES: Record<PaperSize, { width: number; height: number; name: string }> = {
  a4: { width: 210, height: 297, name: 'A4' },
  letter: { width: 216, height: 279, name: 'Letter' },
  legal: { width: 216, height: 356, name: 'Legal' },
  a3: { width: 297, height: 420, name: 'A3' },
  a5: { width: 148, height: 210, name: 'A5' },
  custom: { width: 210, height: 297, name: 'Custom' },
}

// Default extended export settings
export const DEFAULT_EXTENDED_EXPORT_SETTINGS: ExtendedExportSettings = {
  format: 'pdf',
  quality: 'standard',
  paperSize: 'a4',
  orientation: 'landscape',
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  scale: 1,
  colorMode: 'color',
}

// Default watermark settings
export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  enabled: true,
  text: 'Created with The Talking Chart',
  position: 'bottom-center',
  fontFamily: 'Inter',
  fontSize: 12,
  fontWeight: 'normal',
  color: '#94a3b8',
  opacity: 0.7,
  rotation: 0,
  margin: 10,
}
