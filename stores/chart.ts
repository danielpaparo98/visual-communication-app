import { defineStore } from 'pinia'
import type {
  Card,
  ChartSaveData,
  ChartSaveDataV2,
  CanvasSettings,
  StyleSettings,
  ExportSettings,
  LayoutPreset,
  ColorTheme
} from '~/types'
import {
  STORAGE_KEYS,
  CARD_COUNT,
  MAX_HEADING_LENGTH,
  MAX_SUBTITLE_LENGTH,
  DEFAULT_CANVAS_SETTINGS,
  DEFAULT_STYLE_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  LAYOUT_PRESETS,
  THEMES,
  ZOOM_LEVELS
} from '~/types'
import { useIconsStore } from './icons'

export const useChartStore = defineStore('chart', () => {
  // ===== STATE =====
  
  // Existing state (preserved)
  const title = ref('My Communication Chart')
  const cards = ref<Card[]>([])
  const isDirty = ref(false)
  
  // New state for WYSIWYG editor
  const canvasSettings = ref<CanvasSettings>({ ...DEFAULT_CANVAS_SETTINGS })
  const styleSettings = ref<StyleSettings>({ ...DEFAULT_STYLE_SETTINGS })
  const exportSettings = ref<ExportSettings>({ ...DEFAULT_EXPORT_SETTINGS })
  
  // Editor state
  const selectedCardId = ref<string | null>(null)
  const isPreviewMode = ref(false)
  const zoom = ref(1.0)
  const isExporting = ref(false)
  
  // ===== GETTERS =====
  
  // Existing getters (preserved)
  const hasCards = computed(() => cards.value.length > 0)
  const cardCount = computed(() => cards.value.length)
  
  // New getters
  const selectedCard = computed(() =>
    cards.value.find(c => c.id === selectedCardId.value) || null
  )
  
  const canAddCard = computed(() => cards.value.length < 50) // Max 50 cards
  
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
      
      // Load new settings if available (v2)
      if ('version' in saved && saved.version === 2) {
        const v2Data = saved as ChartSaveDataV2
        if (v2Data.canvasSettings) {
          canvasSettings.value = { ...DEFAULT_CANVAS_SETTINGS, ...v2Data.canvasSettings }
        }
        if (v2Data.styleSettings) {
          styleSettings.value = { ...DEFAULT_STYLE_SETTINGS, ...v2Data.styleSettings }
        }
        if (v2Data.exportSettings) {
          exportSettings.value = { ...DEFAULT_EXPORT_SETTINGS, ...v2Data.exportSettings }
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
      heading: '',
      subtitle: '',
    }
  }
  
  function updateCardIcon(cardId: string, iconId: string | null) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.iconId = iconId
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
        heading: card.heading,
        subtitle: card.subtitle,
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
  
  // Storage
  function saveToStorage() {
    const data: ChartSaveDataV2 = {
      version: 2,
      title: title.value,
      cards: cards.value,
      canvasSettings: canvasSettings.value,
      styleSettings: styleSettings.value,
      exportSettings: exportSettings.value,
    }
    localStorage.setItem(STORAGE_KEYS.CHART, JSON.stringify(data))
  }
  
  function loadFromStorage(): ChartSaveDataV2 | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHART)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load chart from storage:', error)
    }
    return null
  }
  
  return {
    // State
    title,
    cards,
    isDirty,
    canvasSettings,
    styleSettings,
    exportSettings,
    selectedCardId,
    isPreviewMode,
    zoom,
    isExporting,
    
    // Getters
    hasCards,
    cardCount,
    selectedCard,
    canAddCard,
    canvasAspectRatio,
    effectiveCardCount,
    
    // Actions
    initializeChart,
    updateCardIcon,
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
  }
})
