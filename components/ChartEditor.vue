<template>
  <div class="chart-editor">
    <!-- Header -->
    <EditorHeader
      :title="chartStore.title"
      :is-preview-mode="chartStore.isPreviewMode"
      :is-dirty="chartStore.isDirty"
      :is-exporting="isExporting"
      :can-undo="chartStore.canUndo"
      :can-redo="chartStore.canRedo"
      @update:title="handleTitleUpdate"
      @toggle-preview="handleTogglePreview"
      @export="handleExport"
      @undo="handleUndo"
      @redo="handleRedo"
    />

    <!-- Notifications -->
    <Notifications
      :notifications="notifications"
      @dismiss="dismissNotification"
    />

    <!-- Export Feedback -->
    <div v-if="exportError" class="export-error" role="alert" aria-live="assertive">
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ exportError }}</span>
      <button @click="exportError = null" class="error-dismiss" :aria-label="'Dismiss error'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Main Layout -->
    <div class="editor-layout">
      <!-- Toolbar -->
      <EditorToolbar
        :canvas-settings="chartStore.canvasSettings"
        :style-settings="chartStore.styleSettings"
        :zoom="chartStore.zoom"
        :is-preview-mode="chartStore.isPreviewMode"
        :selected-card-id="chartStore.selectedCardId"
        :can-add-card="chartStore.canAddCard"
        @update:canvas-settings="handleCanvasSettingsUpdate"
        @update:style-settings="handleStyleSettingsUpdate"
        @update:zoom="handleZoomUpdate"
        @add-card="handleAddCard"
        @remove-selected="handleRemoveSelected"
        @duplicate-selected="handleDuplicateSelected"
      />

      <!-- Canvas Container -->
      <div class="canvas-container">
        <EditorCanvas
          ref="editorCanvasRef"
          :cards="chartStore.cards"
          :canvas-settings="chartStore.canvasSettings"
          :style-settings="chartStore.styleSettings"
          :zoom="chartStore.zoom"
          :is-preview-mode="chartStore.isPreviewMode"
          :selected-card-id="chartStore.selectedCardId"
          :title="chartStore.title"
          :custom-icons="chartStore.customIcons"
          @select-card="handleSelectCard"
          @update-card="handleUpdateCard"
          @delete-card="handleDeleteCard"
          @duplicate-card="handleDuplicateCard"
          @reorder-cards="handleReorderCards"
          @add-card="handleAddCard"
        />
      </div>
    </div>

    <!-- Icon Picker Modal -->
    <IconPicker
      v-model="showIconPicker"
      :card-id="activeCardId"
      :current-icon-id="currentIconId"
      @select="handleIconSelect"
    />

    <!-- Image Uploader Modal -->
    <ImageUploader
      v-model="showImageUploader"
      :card-id="activeCardId"
      :max-size="MAX_CUSTOM_ICON_SIZE"
      :allowed-types="ALLOWED_IMAGE_TYPES"
      :compress="true"
      @upload="handleImageUpload"
    />

    <!-- Export Modal -->
    <ExportModal
      v-model="showExportModal"
      :filename="chartStore.exportFilename"
      :exporting="isExporting"
      @export="handleExportWithFormat"
    />

    <!-- Onboarding Tour -->
    <OnboardingTour
      v-model="isOpenTour"
      :steps="tourSteps"
      :current-step="currentTourStep"
      @complete="handleOnboardingComplete"
      @next="handleTourNext"
      @prev="handleTourPrev"
    />

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay" role="status" :aria-label="'Loading editor'">
      <LoadingSpinner size="lg" />
      <span class="loading-text">Loading editor...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, TextFormatting, CustomIcon, Notification } from '~/types'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { usePdfExport } from '~/composables/usePdfExport'
import EditorCanvas from '~/components/EditorCanvas.vue'
import {
  MAX_CUSTOM_ICON_SIZE,
  ALLOWED_IMAGE_TYPES,
  STORAGE_KEYS,
} from '~/types'

const chartStore = useChartStore()
const iconsStore = useIconsStore()
const { exportToPdf } = usePdfExport()

// State
const showIconPicker = ref(false)
const showImageUploader = ref(false)
const showExportModal = ref(false)
const activeCardId = ref('')
const editorCanvasRef = ref<InstanceType<typeof EditorCanvas>>()
const exportError = ref<string | null>(null)
const isExporting = ref(false)
const isLoading = ref(false)
const notifications = ref<Notification[]>([])
const showOnboardingTour = ref(false)

// Computed for tour
const isOpenTour = computed({
  get: () => showOnboardingTour.value,
  set: (value) => {
    showOnboardingTour.value = value
    if (!value) {
      currentTourStep.value = 0
    }
  },
})

// Onboarding tour steps
const tourSteps = [
  {
    id: 'welcome',
    target: '.editor-header',
    title: 'Welcome to The Talking Chart!',
    content: 'Create beautiful communication charts for people with disabilities. Let\'s take a quick tour.',
    position: 'bottom' as const,
  },
  {
    id: 'toolbar',
    target: '.editor-toolbar',
    title: 'Toolbar',
    content: 'Use the toolbar on the left to change layouts, add cards, adjust spacing, and customize styles.',
    position: 'right' as const,
  },
  {
    id: 'canvas',
    target: '.editor-canvas',
    title: 'Canvas',
    content: 'Click on any card to customize its icon and text. Drag cards to reorder them.',
    position: 'top' as const,
  },
  {
    id: 'export',
    target: '.preview-toggle, .export-button',
    title: 'Export',
    content: 'Preview your chart and export it as PDF when you\'re ready to share or print.',
    position: 'bottom' as const,
  },
]

const currentTourStep = ref(0)

// Computed
const currentIconId = computed(() => {
  const card = chartStore.cards.find(c => c.id === activeCardId.value)
  return card?.iconId || null
})

const canvasRef = computed(() => {
  return editorCanvasRef.value?.canvasRef as HTMLElement | undefined
})

// Initialize keyboard shortcuts
useKeyboardShortcuts()

// Initialize on mount
onMounted(async () => {
  isLoading.value = true
  try {
    // Initialize chart
    chartStore.initializeChart()
    
    // Load icons
    await iconsStore.loadIcons()
    
    // Check if onboarding should be shown
    const hasSeenOnboarding = localStorage.getItem(STORAGE_KEYS.ONBOARDING)
    if (!hasSeenOnboarding) {
      showOnboardingTour.value = true
    }
  } catch (error) {
    console.error('Failed to initialize editor:', error)
    addNotification('error', 'Initialization Error', 'Failed to load editor. Please refresh the page.')
  } finally {
    isLoading.value = false
  }
})

// Methods
function handleTitleUpdate(title: string) {
  chartStore.updateTitle(title)
}

function handleTogglePreview() {
  chartStore.togglePreviewMode()
}

function handleUndo() {
  chartStore.undo()
}

function handleRedo() {
  chartStore.redo()
}

function handleSelectCard(cardId: string) {
  chartStore.selectCard(cardId)
  
  // Open icon picker if card has no icon
  const card = chartStore.cards.find(c => c.id === cardId)
  if (card && !card.iconId && !card.customIconId) {
    activeCardId.value = cardId
    showIconPicker.value = true
  }
}

function handleUpdateCard(cardId: string, updates: Partial<Card>) {
  if (updates.heading !== undefined) {
    chartStore.updateCardHeading(cardId, updates.heading)
  }
  if (updates.subtitle !== undefined) {
    chartStore.updateCardSubtitle(cardId, updates.subtitle)
  }
  if (updates.iconId !== undefined) {
    chartStore.updateCardIcon(cardId, updates.iconId)
  }
  if (updates.customIconId !== undefined) {
    chartStore.updateCardCustomIcon(cardId, updates.customIconId)
  }
  if (updates.textFormatting !== undefined) {
    chartStore.updateCardTextFormatting(cardId, updates.textFormatting)
  }
}

function handleDeleteCard(cardId: string) {
  chartStore.removeCard(cardId)
  addNotification('info', 'Card Removed', 'The card has been removed from your chart.')
}

function handleDuplicateCard(cardId: string) {
  chartStore.duplicateCard(cardId)
  addNotification('success', 'Card Duplicated', 'The card has been duplicated successfully.')
}

function handleAddCard() {
  if (!chartStore.canAddCard) {
    addNotification('warning', 'Maximum Cards Reached', `You can have a maximum of ${chartStore.cardCount} cards.`)
    return
  }
  
  chartStore.addCard()
  
  // Select new card
  const newCard = chartStore.cards[chartStore.cards.length - 1]
  if (newCard) {
    chartStore.selectCard(newCard.id)
    activeCardId.value = newCard.id
    showIconPicker.value = true
  }
}

function handleRemoveSelected() {
  if (chartStore.selectedCardId) {
    chartStore.removeCard(chartStore.selectedCardId)
    addNotification('info', 'Card Removed', 'The selected card has been removed.')
  }
}

function handleDuplicateSelected() {
  if (chartStore.selectedCardId) {
    chartStore.duplicateCard(chartStore.selectedCardId)
    addNotification('success', 'Card Duplicated', 'The selected card has been duplicated.')
  }
}

function handleReorderCards(cards: Card[]) {
  chartStore.reorderCards(cards)
}

function handleIconSelect({ cardId, iconId }: { cardId: string; iconId: string }) {
  chartStore.updateCardIcon(cardId, iconId)
  showIconPicker.value = false
  addNotification('success', 'Icon Updated', 'The card icon has been updated successfully.')
}

function handleImageUpload(dataUrl: string, thumbnailUrl: string, width: number, height: number) {
  // Create custom icon
  const customIcon: CustomIcon = {
    id: `custom-${Date.now()}`,
    filename: `custom-${Date.now()}.webp`,
    originalFilename: 'uploaded-image.webp',
    dataUrl,
    thumbnailUrl,
    size: dataUrl.length,
    createdAt: new Date(),
  }
  
  // Add to store
  chartStore.addCustomIcon(customIcon)
  
  // Update card with custom icon
  if (activeCardId.value) {
    chartStore.updateCardCustomIcon(activeCardId.value, customIcon.id)
    addNotification('success', 'Image Uploaded', 'Your custom image has been added to the card.')
  }
  
  showImageUploader.value = false
}

function handleCanvasSettingsUpdate(settings: Partial<typeof chartStore.canvasSettings>) {
  chartStore.updateCanvasSettings(settings)
}

function handleStyleSettingsUpdate(settings: Partial<typeof chartStore.styleSettings>) {
  chartStore.updateStyleSettings(settings)
}

function handleZoomUpdate(zoom: number) {
  chartStore.setZoom(zoom)
}

async function handleExport() {
  showExportModal.value = true
}

async function handleExportWithFormat(format: 'pdf' | 'png' | 'jpg' | 'svg') {
  try {
    exportError.value = null
    isExporting.value = true
    
    // Get canvas element
    const canvasElement = canvasRef.value
    if (!canvasElement) {
      throw new Error('Canvas element not found')
    }
    
    const filename = chartStore.exportFilename
    
    if (format === 'pdf') {
      await exportToPdf(
        canvasElement,
        filename,
        chartStore.exportSettings.quality
      )
    } else {
      // Export as image using html2canvas
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: chartStore.styleSettings.backgroundColor,
      })
      
      const link = document.createElement('a')
      link.download = `${filename}.${format}`
      link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`, 0.95)
      link.click()
    }
    
    showExportModal.value = false
    addNotification('success', 'Export Successful', `Your chart has been exported as ${format.toUpperCase()}.`)
  } catch (error) {
    console.error('Export failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to export'
    exportError.value = errorMessage
    addNotification('error', 'Export Failed', errorMessage)
  } finally {
    isExporting.value = false
  }
}

function addNotification(type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) {
  const id = `notification-${Date.now()}`
  notifications.value.push({ id, type, title, message })
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    dismissNotification(id)
  }, 5000)
}

function dismissNotification(id: string) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

function handleOnboardingComplete() {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'completed')
  showOnboardingTour.value = false
  addNotification('success', 'Welcome!', 'You\'re all set to create your communication chart.')
}

function handleOnboardingSkip() {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'skipped')
  showOnboardingTour.value = false
}

function handleTourNext() {
  if (currentTourStep.value < tourSteps.length - 1) {
    currentTourStep.value++
  }
}

function handleTourPrev() {
  if (currentTourStep.value > 0) {
    currentTourStep.value--
  }
}

// Cleanup
onUnmounted(() => {
  // Final save on unmount
  chartStore.saveToStorage()
})
</script>

<style scoped>
.chart-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
  overflow: hidden;
}

.export-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.875rem;
  animation: slideIn 0.3s ease;
}

.error-dismiss {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.error-dismiss:hover {
  background-color: #fee2e2;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.editor-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.canvas-container {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: #f1f5f9;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 100;
}

.loading-text {
  font-size: 1rem;
  color: #4b5563;
  font-weight: 500;
}

/* Print styles */
@media print {
  .chart-editor {
    height: auto;
    background: white;
  }
  
  .editor-layout {
    overflow: visible;
  }
  
  .export-error {
    display: none;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .export-error {
    animation: none;
  }
}
</style>
