<template>
  <header class="editor-topbar h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
    <!-- Left Section: Back button and title -->
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <button
        @click="handleBack"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        aria-label="Back to home"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <input
          v-model="localTitle"
          @blur="handleTitleBlur"
          @keydown.enter="handleTitleBlur"
          type="text"
          class="title-input text-base font-semibold text-gray-900 bg-transparent border-none outline-none truncate w-full"
          :class="{ 'text-gray-500': !localTitle }"
          :placeholder="placeholderTitle"
          aria-label="Chart title"
        />
        <span v-if="isDirty" class="dirty-indicator text-orange-500 shrink-0" aria-hidden="true">●</span>
      </div>
    </div>

    <!-- Center Section: Undo/Redo (desktop only) -->
    <div class="hidden md:flex items-center gap-1">
      <button
        @click="handleUndo"
        :disabled="!canUndo"
        class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600 hover:text-gray-900"
        :aria-label="`Undo${canUndo ? ' (Ctrl+Z)' : ''}`"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>
      <button
        @click="handleRedo"
        :disabled="!canRedo"
        class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600 hover:text-gray-900"
        :aria-label="`Redo${canRedo ? ' (Ctrl+Y)' : ''}`"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
      </button>
    </div>

    <!-- Right Section: Preview, Export, Settings -->
    <div class="flex items-center gap-2">
      <!-- Preview Toggle -->
      <button
        @click="handleTogglePreview"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
        :class="isPreviewMode ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'"
        aria-label="Toggle preview mode"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span class="hidden sm:inline">{{ isPreviewMode ? 'Edit' : 'Preview' }}</span>
      </button>

      <!-- Export Button -->
      <button
        @click="handleExport"
        :disabled="isExporting"
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-white text-sm font-medium"
        aria-label="Export chart"
      >
        <svg v-if="!isExporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="hidden sm:inline">{{ isExporting ? 'Exporting...' : 'Export' }}</span>
      </button>

      <!-- Settings Button (opens side panel on mobile) -->
      <button
        @click="handleToggleSettings"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 lg:hidden"
        aria-label="Open settings"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { useEditorLayoutStore } from '~/stores/editorLayout'
import { useRouter } from 'vue-router'

const router = useRouter()
const chartStore = useChartStore()
const editorLayout = useEditorLayoutStore()

// Local state for title input
const localTitle = ref(chartStore.title)
const placeholderTitle = ref('Untitled Chart')

// Computed
const isDirty = computed(() => chartStore.isDirty)
const canUndo = computed(() => chartStore.canUndo)
const canRedo = computed(() => chartStore.canRedo)
const isPreviewMode = computed(() => chartStore.isPreviewMode)
const isExporting = computed(() => chartStore.isExporting)

// Watch for title changes in store
watch(() => chartStore.title, (newTitle) => {
  localTitle.value = newTitle
})

// Event handlers
function handleBack() {
  router.push('/')
}

function handleTitleBlur() {
  if (localTitle.value !== chartStore.title) {
    chartStore.updateTitle(localTitle.value)
  }
}

function handleUndo() {
  chartStore.undo()
}

function handleRedo() {
  chartStore.redo()
}

function handleTogglePreview() {
  chartStore.togglePreviewMode()
}

function handleExport() {
  // Export logic will be handled by ExportModal component
  // For now, just emit an event or open the modal
  const event = new CustomEvent('open-export-modal')
  window.dispatchEvent(event)
}

function handleToggleSettings() {
  editorLayout.toggleSidePanel()
}
</script>

<style scoped>
.title-input::placeholder {
  color: #9ca3af;
}

.dirty-indicator {
  font-size: 8px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
