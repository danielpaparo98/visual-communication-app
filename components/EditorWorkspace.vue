<template>
  <div class="editor-workspace flex-1 flex overflow-hidden relative">
    <!-- Side Panel (desktop) -->
    <SidePanel
      v-if="shouldShowSidePanel"
      :is-open="editorLayout.state.sidePanelOpen"
      :active-section="editorLayout.state.activeSection"
      @toggle-panel="editorLayout.toggleSidePanel"
      @section-change="editorLayout.setActiveSection"
    />
    
    <!-- Canvas Area -->
    <div class="canvas-area flex-1 overflow-auto bg-gray-100 relative">
      <EditorCanvas
        :cards="chartStore.cards"
        :canvas-settings="chartStore.canvasSettings"
        :style-settings="chartStore.styleSettings"
        :zoom="chartStore.zoom"
        :is-preview-mode="chartStore.isPreviewMode"
        :selected-card-id="chartStore.selectedCardId"
        :title="chartStore.title"
        :custom-icons="chartStore.customIcons"
        @select-card="chartStore.selectCard"
        @update-card="handleUpdateCard"
        @delete-card="chartStore.removeCard"
        @duplicate-card="chartStore.duplicateCard"
        @reorder-cards="chartStore.reorderCards"
        @add-card="chartStore.addCard"
      />
    </div>
    
    <!-- Floating Controls -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import SidePanel from './SidePanel.vue'
import EditorCanvas from './EditorCanvas.vue'
import FloatingControls from './FloatingControls.vue'
import { useEditorLayoutStore } from '~/stores/editorLayout'
import { useChartStore } from '~/stores/chart'

const editorLayout = useEditorLayoutStore()
const chartStore = useChartStore()

// Computed
const shouldShowSidePanel = computed(() => {
  return editorLayout.state.sidePanelOpen && editorLayout.state.viewportSize === 'desktop'
})

// Event handlers
function handleUpdateCard(cardId: string, updates: any) {
  const card = chartStore.cards.find(c => c.id === cardId)
  if (card) {
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
}
</script>

<style scoped>
.canvas-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* Custom scrollbar for canvas area */
.canvas-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.canvas-area::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.canvas-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.canvas-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
