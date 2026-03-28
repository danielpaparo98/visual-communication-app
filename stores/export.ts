import { defineStore } from 'pinia'
import type { 
  ExtendedExportSettings, 
  WatermarkSettings, 
  ExportHistoryItem, 
  ExportTemplate,
  PaperSize,
  ExportQuality,
  ExportFormat 
} from '~/types'

const STORAGE_KEY_SETTINGS = 'export-settings'
const STORAGE_KEY_WATERMARK = 'watermark-settings'
const STORAGE_KEY_HISTORY = 'export-history'
const STORAGE_KEY_TEMPLATES = 'export-templates'

const DEFAULT_EXPORT_SETTINGS: ExtendedExportSettings = {
  format: 'pdf',
  quality: 'standard',
  paperSize: 'a4',
  orientation: 'landscape',
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  scale: 1,
  colorMode: 'color',
}

const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
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

export const useExportStore = defineStore('export', () => {
  // State
  const settings = reactive<ExtendedExportSettings>({ ...DEFAULT_EXPORT_SETTINGS })
  const watermark = reactive<WatermarkSettings>({ ...DEFAULT_WATERMARK_SETTINGS })
  const history = ref<ExportHistoryItem[]>([])
  const templates = ref<ExportTemplate[]>([])
  const isExporting = ref(false)
  const exportProgress = ref(0)

  // Actions
  function updateSettings(newSettings: Partial<ExtendedExportSettings>) {
    Object.assign(settings, newSettings)
    saveSettings()
  }

  function updateWatermark(newWatermark: Partial<WatermarkSettings>) {
    Object.assign(watermark, newWatermark)
    saveWatermark()
  }

  function addToHistory(item: ExportHistoryItem) {
    history.value.unshift(item)
    // Keep only last 50 items
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }
    saveHistory()
  }

  function clearHistory() {
    history.value = []
    saveHistory()
  }

  function saveTemplate(template: Omit<ExportTemplate, 'id' | 'createdAt'>) {
    const newTemplate: ExportTemplate = {
      ...template,
      id: generateId(),
      createdAt: Date.now(),
    }
    templates.value.push(newTemplate)
    saveTemplates()
    return newTemplate
  }

  function deleteTemplate(id: string) {
    templates.value = templates.value.filter(t => t.id !== id)
    saveTemplates()
  }

  function loadTemplate(id: string) {
    const template = templates.value.find(t => t.id === id)
    if (template) {
      Object.assign(settings, template.settings)
      Object.assign(watermark, template.watermark)
      saveSettings()
      saveWatermark()
    }
  }

  function setExporting(value: boolean) {
    isExporting.value = value
  }

  function setExportProgress(value: number) {
    exportProgress.value = value
  }

  function resetSettings() {
    Object.assign(settings, DEFAULT_EXPORT_SETTINGS)
    Object.assign(watermark, DEFAULT_WATERMARK_SETTINGS)
    saveSettings()
    saveWatermark()
  }

  // Persistence
  function saveSettings() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    }
  }

  function saveWatermark() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_WATERMARK, JSON.stringify(watermark))
    }
  }

  function saveHistory() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.value))
    }
  }

  function saveTemplates() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates.value))
    }
  }

  function loadSettings() {
    if (import.meta.client) {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS)
      if (savedSettings) {
        try {
          Object.assign(settings, JSON.parse(savedSettings))
        } catch (e) {
          console.error('Failed to load export settings:', e)
        }
      }

      const savedWatermark = localStorage.getItem(STORAGE_KEY_WATERMARK)
      if (savedWatermark) {
        try {
          Object.assign(watermark, JSON.parse(savedWatermark))
        } catch (e) {
          console.error('Failed to load watermark settings:', e)
        }
      }

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY)
      if (savedHistory) {
        try {
          history.value = JSON.parse(savedHistory)
        } catch (e) {
          console.error('Failed to load export history:', e)
        }
      }

      const savedTemplates = localStorage.getItem(STORAGE_KEY_TEMPLATES)
      if (savedTemplates) {
        try {
          templates.value = JSON.parse(savedTemplates)
        } catch (e) {
          console.error('Failed to load export templates:', e)
        }
      }
    }
  }

  // Initialize
  onMounted(() => {
    loadSettings()
  })

  return {
    settings,
    watermark,
    history,
    templates,
    isExporting,
    exportProgress,
    updateSettings,
    updateWatermark,
    addToHistory,
    clearHistory,
    saveTemplate,
    deleteTemplate,
    loadTemplate,
    setExporting,
    setExportProgress,
    resetSettings,
  }
})

// Helper function
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
