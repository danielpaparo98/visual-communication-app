import { defineStore } from 'pinia'
import type {
  Card,
  ChartSaveData,
  ChartSaveDataV2,
  ChartSaveDataV3,
  CanvasSettings,
  StyleSettings,
  ExportSettings,
  LayoutPreset,
  ColorTheme,
  HistoryState,
  CustomIcon,
  TextFormatting,
  ValidationResult,
  ValidationError,
} from '~/types'
import {
  STORAGE_KEYS,
  CARD_COUNT,
  MAX_HEADING_LENGTH,
  MAX_SUBTITLE_LENGTH,
  MAX_CARDS,
  DEFAULT_CANVAS_SETTINGS,
  DEFAULT_STYLE_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  DEFAULT_TEXT_FORMATTING,
  LAYOUT_PRESETS,
  THEMES,
  ZOOM_LEVELS,
} from '~/types'
import { useIconsStore } from './icons'
import { useHistory } from '~/composables/useHistory'

export const useChartStore = defineStore('chart', () => {
  // ===== STATE =====
  
  // Core state
  const id = ref('')
  const title = ref('My Communication Chart')
  const cards = ref<Card[]>([])
  const isDirty = ref(false)
  
  // Settings
  const canvasSettings = ref<CanvasSettings>({ ...DEFAULT_CANVAS_SETTINGS })
  const styleSettings = ref<StyleSettings>({ ...DEFAULT_STYLE_SETTINGS })
  const exportSettings = ref<ExportSettings>({ ...DEFAULT_EXPORT_SETTINGS })
  
  // Custom icons
  const customIcons = ref<CustomIcon[]>([])
  
  // Editor state
  const selectedCardId = ref<string | null>(null)
  const isPreviewMode = ref(false)
  const zoom = ref(1.0)
  const isExporting = ref(false)
  
  // Validation
  const errors = ref<ValidationError[]>([])
  const warnings = ref<ValidationError[]>([])
  
  // History management
  const history = useHistory(MAX_CARDS)
  
  // ===== GETTERS =====
  
  // Existing getters (preserved)
  const hasCards = computed(() => cards.value.length > 0)
  const cardCount = computed(() => cards.value.length)
  
  // New getters
  const selectedCard = computed(() =>
    cards.value.find(c => c.id === selectedCardId.value) || null
  )
  
  const canAddCard = computed(() => cards.value.length < MAX_CARDS)
  
  // History getters
  const canUndo = computed(() => history.canUndo())
  const canRedo = computed(() => history.canRedo())
  const historySize = computed(() => history.getHistorySize())
  
  // Validation getters
  const isValid = computed(() => errors.value.length === 0)
  const hasErrors = computed(() => errors.value.length > 0)
  const hasWarnings = computed(() => warnings.value.length > 0)
  
  // Export getters
  const exportFilename = computed(() => {
    const sanitized = title.value.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    return sanitized || exportSettings.value.filename
  })
  
  const canvasAspectRatio = computed(() => {
    return 297 / 210 // A4 landscape aspect ratio
  })
  
  const effectiveCardCount = computed(() => {
    const { columns, rows } = canvasSettings.value
    return Math.min(cards.value.length, columns * rows)
  })
  
  // ===== ACTIONS =====
  
  // Existing actions (preserved)
  function initializeChart() {
    const iconsStore = useIconsStore()
    
    // Try to load from localStorage
    const saved = loadFromStorage()
    if (saved) {
      title.value = saved.title
      cards.value = saved.cards
      
      // Load new settings if available (v2 or v3)
      if ('version' in saved && (saved.version === 2 || saved.version === 3)) {
        if (saved.canvasSettings) {
          canvasSettings.value = { ...DEFAULT_CANVAS_SETTINGS, ...saved.canvasSettings }
        }
        if (saved.styleSettings) {
          styleSettings.value = { ...DEFAULT_STYLE_SETTINGS, ...saved.styleSettings }
        }
        if (saved.exportSettings) {
          exportSettings.value = { ...DEFAULT_EXPORT_SETTINGS, ...saved.exportSettings }
        }
        if (saved.customIcons) {
          customIcons.value = saved.customIcons
        }
        if (saved.id) {
          id.value = saved.id
        }
      }
      
      return
    }
    
    // Create new chart with random icons
    title.value = 'My Communication Chart'
    cards.value = Array.from({ length: CARD_COUNT }, (_, i) => createEmptyCard(i))
    
    // Assign random icons
    const randomIcons = iconsStore.getRandomIcons(CARD_COUNT)
    cards.value.forEach((card, i) => {
      if (randomIcons[i]) {
        card.iconId = randomIcons[i].id
      }
    })
    
    saveToStorage()
  }
  
  function createEmptyCard(index: number): Card {
    return {
      id: `card-${Date.now()}-${index}`,
      iconId: null,
      customIconId: null,
      heading: '',
      subtitle: '',
      textFormatting: { ...DEFAULT_TEXT_FORMATTING },
    }
  }
  
  function updateCardIcon(cardId: string, iconId: string | null) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.iconId = iconId
      card.customIconId = null
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateCardCustomIcon(cardId: string, customIconId: string | null) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.customIconId = customIconId
      card.iconId = null
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateCardTextFormatting(cardId: string, formatting: Partial<TextFormatting>) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.textFormatting = { ...card.textFormatting, ...formatting }
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateCardHeading(cardId: string, heading: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.heading = heading.slice(0, MAX_HEADING_LENGTH)
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateCardSubtitle(cardId: string, subtitle: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.subtitle = subtitle.slice(0, MAX_SUBTITLE_LENGTH)
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateTitle(newTitle: string) {
    title.value = newTitle
    isDirty.value = true
    saveToStorage()
  }
  
  function clearChart() {
    const iconsStore = useIconsStore()
    
    title.value = 'My Communication Chart'
    cards.value = Array.from({ length: CARD_COUNT }, (_, i) => createEmptyCard(i))
    
    // Assign new random icons
    const randomIcons = iconsStore.getRandomIcons(CARD_COUNT)
    cards.value.forEach((card, i) => {
      if (randomIcons[i]) {
        card.iconId = randomIcons[i].id
      }
    })
    
    isDirty.value = false
    saveToStorage()
  }
  
  // ===== NEW ACTIONS FOR WYSIWYG EDITOR =====
  
  // Card management
  function addCard() {
    if (!canAddCard.value) return
    
    const newCard = createEmptyCard(cards.value.length)
    cards.value.push(newCard)
    isDirty.value = true
    saveToStorage()
  }
  
  function removeCard(cardId: string) {
    const index = cards.value.findIndex(c => c.id === cardId)
    if (index !== -1) {
      cards.value.splice(index, 1)
      if (selectedCardId.value === cardId) {
        selectedCardId.value = null
      }
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function duplicateCard(cardId: string) {
    if (!canAddCard.value) return
    
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        iconId: card.iconId,
        customIconId: card.customIconId,
        heading: card.heading,
        subtitle: card.subtitle,
        textFormatting: { ...card.textFormatting },
      }
      
      // Insert after the original card
      const index = cards.value.findIndex(c => c.id === cardId)
      cards.value.splice(index + 1, 0, newCard)
      
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function reorderCards(newOrder: Card[]) {
    cards.value = newOrder
    isDirty.value = true
    saveToStorage()
  }
  
  // Selection
  function selectCard(cardId: string | null) {
    selectedCardId.value = cardId
  }
  
  function deselectAll() {
    selectedCardId.value = null
  }
  
  // Canvas settings
  function updateCanvasSettings(settings: Partial<CanvasSettings>) {
    canvasSettings.value = { ...canvasSettings.value, ...settings }
    isDirty.value = true
    saveToStorage()
  }
  
  function setLayoutPreset(preset: LayoutPreset) {
    const presetConfig = LAYOUT_PRESETS[preset]
    if (presetConfig) {
      canvasSettings.value = {
        ...canvasSettings.value,
        layout: preset,
        columns: presetConfig.columns,
        rows: presetConfig.rows,
      }
      isDirty.value = true
      saveToStorage()
    }
  }
  
  // Style settings
  function updateStyleSettings(settings: Partial<StyleSettings>) {
    styleSettings.value = { ...styleSettings.value, ...settings }
    isDirty.value = true
    saveToStorage()
  }
  
  function setTheme(theme: ColorTheme) {
    const themeConfig = THEMES[theme]
    if (themeConfig) {
      styleSettings.value = {
        ...styleSettings.value,
        theme,
        backgroundColor: themeConfig.colors.background,
      }
      isDirty.value = true
      saveToStorage()
    }
  }
  
  // Export settings
  function updateExportSettings(settings: Partial<ExportSettings>) {
    exportSettings.value = { ...exportSettings.value, ...settings }
    saveToStorage()
  }
  
  // Zoom
  function setZoom(level: number) {
    zoom.value = Math.max(0.5, Math.min(1.5, level))
  }
  
  function zoomIn() {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom.value)
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      zoom.value = ZOOM_LEVELS[currentIndex + 1]
    }
  }
  
  function zoomOut() {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom.value)
    if (currentIndex > 0) {
      zoom.value = ZOOM_LEVELS[currentIndex - 1]
    }
  }
  
  function resetZoom() {
    zoom.value = 1.0
  }
  
  // Preview mode
  function togglePreviewMode() {
    isPreviewMode.value = !isPreviewMode.value
    if (isPreviewMode.value) {
      deselectAll()
    }
  }
  
  function setPreviewMode(enabled: boolean) {
    isPreviewMode.value = enabled
    if (enabled) {
      deselectAll()
    }
  }
  
  // Export
  async function exportToPDF() {
    isExporting.value = true
    try {
      // Export logic will be handled by ExportControls component
      return true
    } finally {
      isExporting.value = false
    }
  }
  
  // History operations
  function undo() {
    const state = history.undo()
    if (state) {
      cards.value = state.cards
      canvasSettings.value = state.canvasSettings
      styleSettings.value = state.styleSettings
      isDirty.value = true
    }
  }
  
  function redo() {
    const state = history.redo()
    if (state) {
      cards.value = state.cards
      canvasSettings.value = state.canvasSettings
      styleSettings.value = state.styleSettings
      isDirty.value = true
    }
  }
  
  function clearHistory() {
    history.clear()
  }
  
  function saveHistoryState(description: string) {
    history.push({
      cards: JSON.parse(JSON.stringify(cards.value)),
      canvasSettings: { ...canvasSettings.value },
      styleSettings: { ...styleSettings.value },
      timestamp: Date.now(),
      description,
    })
  }
  
  // Custom icons management
  function addCustomIcon(icon: CustomIcon) {
    customIcons.value.push(icon)
    saveCustomIcons()
  }
  
  function removeCustomIcon(iconId: string) {
    const index = customIcons.value.findIndex(i => i.id === iconId)
    if (index !== -1) {
      customIcons.value.splice(index, 1)
      saveCustomIcons()
    }
  }
  
  function saveCustomIcons() {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_ICONS, JSON.stringify(customIcons.value))
    } catch (error) {
      console.error('Failed to save custom icons:', error)
    }
  }
  
  function loadCustomIcons() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ICONS)
      if (stored) {
        customIcons.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load custom icons:', error)
    }
  }
  
  // Validation
  function validate(): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []
    
    // Validate cards
    cards.value.forEach((card, index) => {
      if (!card.heading && !card.subtitle) {
        errors.push({
          id: `card-${index}`,
          type: 'card',
          message: `Card ${index + 1} has no heading or subtitle`,
          cardId: card.id,
        })
      }
      
      if (!card.iconId && !card.customIconId) {
        warnings.push({
          id: `card-icon-${index}`,
          type: 'card',
          message: `Card ${index + 1} has no icon`,
          cardId: card.id,
        })
      }
    })
    
    // Validate canvas settings
    if (canvasSettings.value.columns < 1 || canvasSettings.value.columns > 10) {
      errors.push({
        id: 'canvas-columns',
        type: 'canvas',
        message: 'Columns must be between 1 and 10',
      })
    }
    
    if (canvasSettings.value.rows < 1 || canvasSettings.value.rows > 20) {
      errors.push({
        id: 'canvas-rows',
        type: 'canvas',
        message: 'Rows must be between 1 and 20',
      })
    }
    
    // Update refs with new arrays
    errors.splice(0, errors.length, ...errors)
    warnings.splice(0, warnings.length, ...warnings)
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }
  
  function clearErrors() {
    errors.value = []
    warnings.value = []
  }
  
  // Storage
  function saveToStorage() {
    const data: ChartSaveDataV3 = {
      version: 3,
      id: id.value || `chart-${Date.now()}`,
      title: title.value,
      cards: cards.value,
      canvasSettings: canvasSettings.value,
      styleSettings: styleSettings.value,
      exportSettings: exportSettings.value,
      customIcons: customIcons.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    localStorage.setItem(STORAGE_KEYS.CHART, JSON.stringify(data))
  }
  
  function loadFromStorage(): ChartSaveDataV3 | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHART)
      if (stored) {
        const data = JSON.parse(stored)
        
        // Handle version migration
        if (!data.version || data.version === 1) {
          return migrateV1ToV3(data)
        }
        
        if (data.version === 2) {
          return migrateV2ToV3(data)
        }
        
        return data
      }
    } catch (error) {
      console.error('Failed to load chart from storage:', error)
    }
    return null
  }
  
  function migrateV1ToV3(data: any): ChartSaveDataV3 {
    return {
      version: 3,
      id: `chart-${Date.now()}`,
      title: data.title,
      cards: data.cards.map((card: any) => ({
        ...card,
        customIconId: null,
        textFormatting: { ...DEFAULT_TEXT_FORMATTING },
      })),
      canvasSettings: { ...DEFAULT_CANVAS_SETTINGS },
      styleSettings: { ...DEFAULT_STYLE_SETTINGS },
      exportSettings: { ...DEFAULT_EXPORT_SETTINGS },
      customIcons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  
  function migrateV2ToV3(data: ChartSaveDataV2): ChartSaveDataV3 {
    return {
      version: 3,
      id: `chart-${Date.now()}`,
      title: data.title,
      cards: data.cards.map((card: any) => ({
        ...card,
        customIconId: null,
        textFormatting: { ...DEFAULT_TEXT_FORMATTING },
      })),
      canvasSettings: data.canvasSettings || { ...DEFAULT_CANVAS_SETTINGS },
      styleSettings: data.styleSettings || { ...DEFAULT_STYLE_SETTINGS },
      exportSettings: data.exportSettings || { ...DEFAULT_EXPORT_SETTINGS },
      customIcons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  
  function exportData(): ChartSaveDataV3 {
    return {
      version: 3,
      id: id.value || `chart-${Date.now()}`,
      title: title.value,
      cards: cards.value,
      canvasSettings: canvasSettings.value,
      styleSettings: styleSettings.value,
      exportSettings: exportSettings.value,
      customIcons: customIcons.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  
  function importData(data: ChartSaveDataV3) {
    id.value = data.id
    title.value = data.title
    cards.value = data.cards
    canvasSettings.value = data.canvasSettings
    styleSettings.value = data.styleSettings
    exportSettings.value = data.exportSettings
    customIcons.value = data.customIcons || []
    isDirty.value = true
    saveToStorage()
  }
  
  return {
    // State
    id,
    title,
    cards,
    isDirty,
    canvasSettings,
    styleSettings,
    exportSettings,
    customIcons,
    selectedCardId,
    isPreviewMode,
    zoom,
    isExporting,
    errors,
    warnings,
    
    // Getters
    hasCards,
    cardCount,
    selectedCard,
    canAddCard,
    canvasAspectRatio,
    effectiveCardCount,
    canUndo,
    canRedo,
    historySize,
    isValid,
    hasErrors,
    hasWarnings,
    exportFilename,
    
    // Actions
    initializeChart,
    updateCardIcon,
    updateCardCustomIcon,
    updateCardTextFormatting,
    updateCardHeading,
    updateCardSubtitle,
    updateTitle,
    clearChart,
    addCard,
    removeCard,
    duplicateCard,
    reorderCards,
    selectCard,
    deselectAll,
    updateCanvasSettings,
    setLayoutPreset,
    updateStyleSettings,
    setTheme,
    updateExportSettings,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    togglePreviewMode,
    setPreviewMode,
    exportToPDF,
    saveToStorage,
    loadFromStorage,
    undo,
    redo,
    clearHistory,
    saveHistoryState,
    addCustomIcon,
    removeCustomIcon,
    loadCustomIcons,
    validate,
    clearErrors,
    exportData,
    importData,
  }
})
