<template>
  <div class="chart-editor">
    <!-- Header -->
    <EditorHeader
      :title="chartStore.title"
      :is-preview-mode="chartStore.isPreviewMode"
      :is-dirty="chartStore.isDirty"
      :is-exporting="isExporting"
      @update:title="handleTitleUpdate"
      @toggle-preview="handleTogglePreview"
      @export="handleExport"
    />

    <!-- Export Feedback -->
    <div v-if="exportError" class="export-error">
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ exportError }}</span>
    </div>

    <ExportControls
      :canvas-ref="canvasRef"
      :filename="chartStore.exportSettings.filename"
      :quality="chartStore.exportSettings.quality"
      :is-exporting="isExporting"
      @exporting="handleExportingChange"
      @success="handleExportSuccess"
      @error="handleExportError"
    />

    <!-- Main Layout -->
    <div class="editor-layout">
      <!-- Toolbar -->
      <Toolbar
        :canvas-settings="chartStore.canvasSettings"
        :style-settings="chartStore.styleSettings"
        :zoom="chartStore.zoom"
        :is-preview-mode="chartStore.isPreviewMode"
        :selected-card-id="chartStore.selectedCardId"
        :can-add-card="chartStore.canAddCard"
        @update:canvas-settings="chartStore.updateCanvasSettings"
        @update:style-settings="chartStore.updateStyleSettings"
        @update:zoom="chartStore.setZoom"
        @add-card="chartStore.addCard"
        @remove-selected="handleRemoveSelected"
        @duplicate-selected="handleDuplicateSelected"
      />

      <!-- Canvas Container -->
      <CanvasContainer
        ref="canvasContainerRef"
        :cards="chartStore.cards"
        :canvas-settings="chartStore.canvasSettings"
        :style-settings="chartStore.styleSettings"
        :zoom="chartStore.zoom"
        :is-preview-mode="chartStore.isPreviewMode"
        :selected-card-id="chartStore.selectedCardId"
        :title="chartStore.title"
        @select-card="handleSelectCard"
        @update-card="handleUpdateCard"
        @delete-card="handleDeleteCard"
        @duplicate-card="handleDuplicateCard"
        @reorder-cards="handleReorderCards"
      />
    </div>

    <!-- Icon Picker Modal -->
    <IconPicker
      v-model="showIconPicker"
      :card-id="activeCardId"
      :current-icon-id="currentIconId"
      @select="handleIconSelect"
    />
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { usePdfExport } from '~/composables/usePdfExport'

const chartStore = useChartStore()
const iconsStore = useIconsStore()
const { exportToPdf } = usePdfExport()

// State
const showIconPicker = ref(false)
const activeCardId = ref('')
const canvasContainerRef = ref<any>()
const exportError = ref<string | null>(null)
const isExporting = ref(false)

// Initialize keyboard shortcuts
useKeyboardShortcuts()

// Computed
const currentIconId = computed(() => {
  const card = chartStore.cards.find(c => c.id === activeCardId.value)
  return card?.iconId || null
})

const canvasRef = computed(() => {
  return canvasContainerRef.value?.$el?.querySelector('.wysiwyg-canvas') as HTMLElement | undefined
})

// Methods
function handleTitleUpdate(title: string) {
  chartStore.updateTitle(title)
}

function handleTogglePreview() {
  chartStore.togglePreviewMode()
}

function handleSelectCard(cardId: string) {
  chartStore.selectCard(cardId)
  
  // Open icon picker if card has no icon
  const card = chartStore.cards.find(c => c.id === cardId)
  if (card && !card.iconId) {
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
}

function handleDeleteCard(cardId: string) {
  chartStore.removeCard(cardId)
}

function handleDuplicateCard(cardId: string) {
  chartStore.duplicateCard(cardId)
}

function handleRemoveSelected() {
  if (chartStore.selectedCardId) {
    chartStore.removeCard(chartStore.selectedCardId)
  }
}

function handleDuplicateSelected() {
  if (chartStore.selectedCardId) {
    chartStore.duplicateCard(chartStore.selectedCardId)
  }
}

function handleReorderCards(cards: Card[]) {
  chartStore.reorderCards(cards)
}

function handleIconSelect({ cardId, iconId }: { cardId: string; iconId: string }) {
  chartStore.updateCardIcon(cardId, iconId)
  showIconPicker.value = false
}

async function handleExport() {
  try {
    exportError.value = null
    isExporting.value = true
    
    // Get canvas element from container
    const canvasElement = canvasContainerRef.value?.$el?.querySelector('.wysiwyg-canvas') as HTMLElement
    if (!canvasElement) {
      throw new Error('Canvas element not found')
    }
    
    // Use the composable for PDF export
    await exportToPdf(
      canvasElement,
      chartStore.exportSettings.filename,
      chartStore.exportSettings.quality
    )
  } catch (error) {
    console.error('Export failed:', error)
    exportError.value = error instanceof Error ? error.message : 'Failed to export PDF'
    // Show error for 5 seconds
    setTimeout(() => {
      exportError.value = null
    }, 5000)
  } finally {
    isExporting.value = false
  }
}

function handleExportingChange(exporting: boolean) {
  isExporting.value = exporting
}

function handleExportSuccess() {
  // Success feedback is handled by ExportControls component
  exportError.value = null
}

function handleExportError(error: Error) {
  exportError.value = error.message
  setTimeout(() => {
    exportError.value = null
  }, 5000)
}
</script>

<style scoped>
.chart-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
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
