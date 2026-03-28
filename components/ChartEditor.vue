<template>
  <div class="chart-editor">
    <!-- Header -->
    <EditorHeader
      :title="chartStore.title"
      :is-preview-mode="chartStore.isPreviewMode"
      :is-dirty="chartStore.isDirty"
      :is-exporting="chartStore.isExporting"
      @update:title="handleTitleUpdate"
      @toggle-preview="handleTogglePreview"
      @export="handleExport"
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

const chartStore = useChartStore()
const iconsStore = useIconsStore()

// State
const showIconPicker = ref(false)
const activeCardId = ref('')
const canvasContainerRef = ref<any>()

// Initialize keyboard shortcuts
useKeyboardShortcuts()

// Computed
const currentIconId = computed(() => {
  const card = chartStore.cards.find(c => c.id === activeCardId.value)
  return card?.iconId || null
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

function handleExport() {
  // Get canvas element from container
  const canvasElement = canvasContainerRef.value?.$el?.querySelector('.wysiwyg-canvas') as HTMLElement
  if (canvasElement) {
    import('html2canvas').then(({ default: html2canvas }) => {
      import('jspdf').then(({ default: jsPDF }) => {
        const scale = chartStore.exportSettings.quality === 'high' ? 3 : 2
        
        html2canvas(canvasElement, {
          scale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
        }).then(canvas => {
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
          })
          
          const imgWidth = 297
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
          pdf.save(`${chartStore.exportSettings.filename}.pdf`)
        })
      })
    })
  }
}
</script>

<style scoped>
.chart-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
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
}
</style>
