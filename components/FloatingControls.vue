<template>
  <div 
    class="floating-controls fixed flex flex-col gap-3 z-30 transition-all duration-300"
    :class="[
      position === 'left' ? 'left-4' : 'right-4',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      isDesktop ? 'top-1/2 -translate-y-1/2' : 'bottom-24'
    ]"
    role="toolbar"
    aria-label="Quick actions"
  >
    <!-- Add Card FAB -->
    <button
      @click="handleAddCard"
      :disabled="!canAddCard"
      class="fab w-14 h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      :aria-label="canAddCard ? 'Add new card' : 'Maximum cards reached'"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Desktop: Additional Controls -->
    <div v-if="isDesktop" class="controls flex flex-col gap-2">
      <!-- Toggle Side Panel -->
      <button
        @click="handleTogglePanel"
        class="control-button w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md flex items-center justify-center transition-colors"
        :aria-label="isPanelOpen ? 'Close side panel' : 'Open side panel'"
        :aria-pressed="isPanelOpen"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Toggle Preview Mode -->
      <button
        @click="handleTogglePreview"
        class="control-button w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md flex items-center justify-center transition-colors"
        :class="{ 'bg-blue-50 border-blue-300': isPreviewMode }"
        :aria-label="isPreviewMode ? 'Exit preview mode' : 'Enter preview mode'"
        :aria-pressed="isPreviewMode"
      >
        <svg class="w-5 h-5" :class="isPreviewMode ? 'text-blue-600' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      <!-- Zoom Controls -->
      <div class="zoom-controls flex flex-col gap-1 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <button
          @click="handleZoomIn"
          class="zoom-button w-10 h-9 hover:bg-gray-50 flex items-center justify-center transition-colors"
          aria-label="Zoom in"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          @click="handleZoomOut"
          class="zoom-button w-10 h-9 hover:bg-gray-50 flex items-center justify-center transition-colors border-t border-gray-200"
          aria-label="Zoom out"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button
          @click="handleZoomReset"
          class="zoom-button w-10 h-9 hover:bg-gray-50 flex items-center justify-center transition-colors border-t border-gray-200 text-xs font-medium text-gray-600"
          aria-label="Reset zoom"
        >
          1:1
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { useEditorLayoutStore } from '~/stores/editorLayout'

const chartStore = useChartStore()
const editorLayout = useEditorLayoutStore()

// Computed
const visible = computed(() => editorLayout.state.floatingControlsVisible)
const position = computed(() => 'left' as const) // Can be made configurable
const isDesktop = computed(() => {
  if (import.meta.client) {
    return window.innerWidth >= 1024
  }
  return true
})
const isPanelOpen = computed(() => editorLayout.state.sidePanelOpen)
const isPreviewMode = computed(() => chartStore.isPreviewMode)
const canAddCard = computed(() => chartStore.canAddCard)

// Event handlers
function handleAddCard() {
  chartStore.addCard()
}

function handleTogglePanel() {
  editorLayout.toggleSidePanel()
}

function handleTogglePreview() {
  chartStore.togglePreviewMode()
}

function handleZoomIn() {
  chartStore.zoomIn()
}

function handleZoomOut() {
  chartStore.zoomOut()
}

function handleZoomReset() {
  chartStore.resetZoom()
}
</script>

<style scoped>
.fab:focus-visible,
.control-button:focus-visible,
.zoom-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.fab:active {
  transform: scale(0.95);
}

.zoom-button {
  transition: background-color 0.15s ease;
}
</style>
