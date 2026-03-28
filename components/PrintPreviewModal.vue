<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    title="Print Preview"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
    size="lg"
  >
    <div class="print-preview-modal">
      <!-- Preview Controls -->
      <div class="preview-controls">
        <div class="zoom-controls">
          <button
            @click="zoomOut"
            class="zoom-btn"
            :disabled="zoom <= 0.25"
            aria-label="Zoom out"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
          <button
            @click="zoomIn"
            class="zoom-btn"
            :disabled="zoom >= 2"
            aria-label="Zoom in"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>

        <div class="page-info" v-if="totalPages > 1">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="prevPage"
            class="page-btn"
            :disabled="currentPage === 1"
            aria-label="Previous page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button
            @click="nextPage"
            class="page-btn"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Canvas -->
      <div class="preview-canvas-container" ref="previewContainer">
        <div
          class="preview-page"
          :style="previewPageStyles"
        >
          <!-- Page boundary indicator -->
          <div class="page-boundary" :style="pageBoundaryStyles">
            <!-- Content preview -->
            <div class="preview-content" :style="previewContentStyles">
              <!-- Watermark preview -->
              <div
                v-if="watermark.enabled"
                class="preview-watermark"
                :style="watermarkPreviewStyles"
              >
                {{ watermark.text }}
              </div>

              <!-- Chart content will be rendered here -->
              <slot name="content"></slot>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Summary -->
      <div class="settings-summary">
        <div class="summary-item">
          <span class="summary-label">Paper Size:</span>
          <span class="summary-value">{{ PAPER_SIZES[settings.paperSize].name }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Orientation:</span>
          <span class="summary-value capitalize">{{ settings.orientation }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Margins:</span>
          <span class="summary-value">{{ settings.margins.top }}mm / {{ settings.margins.right }}mm / {{ settings.margins.bottom }}mm / {{ settings.margins.left }}mm</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Color Mode:</span>
          <span class="summary-value capitalize">{{ settings.colorMode }}</span>
        </div>
        <div class="summary-item" v-if="watermark.enabled">
          <span class="summary-label">Watermark:</span>
          <span class="summary-value">{{ watermark.text }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="preview-actions">
        <AppButton
          variant="secondary"
          @click="handleEditSettings"
          aria-label="Edit export settings"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </template>
          Edit Settings
        </AppButton>
        <AppButton
          variant="primary"
          @click="handlePrint"
          aria-label="Print chart"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </template>
          Print
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppButton from '~/components/AppButton.vue'
import { useExportStore } from '~/stores/export'
import { PAPER_SIZES } from '~/types'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'print': []
  'edit-settings': []
}>()

const exportStore = useExportStore()
const settings = computed(() => exportStore.settings)
const watermark = computed(() => exportStore.watermark)

const isOpen = computed(() => props.modelValue)
const zoom = ref(0.75)
const currentPage = ref(1)
const totalPages = ref(1)
const previewContainer = ref<HTMLElement>()

// Computed styles
const previewPageStyles = computed(() => {
  const paper = PAPER_SIZES[settings.value.paperSize]
  const isPortrait = settings.value.orientation === 'portrait'
  
  return {
    width: `${isPortrait ? paper.height : paper.width}mm`,
    height: `${isPortrait ? paper.width : paper.height}mm`,
    transform: `scale(${zoom.value})`,
    transformOrigin: 'top center',
  }
})

const pageBoundaryStyles = computed(() => {
  const { top, right, bottom, left } = settings.value.margins
  
  return {
    padding: `${top}mm ${right}mm ${bottom}mm ${left}mm`,
    border: '1px dashed #d1d5db',
    height: '100%',
    boxSizing: 'border-box' as const,
  }
})

const previewContentStyles = computed(() => {
  return {
    width: '100%',
    height: '100%',
    background: '#ffffff',
    position: 'relative' as const,
  }
})

const watermarkPreviewStyles = computed(() => {
  const pos = watermark.value.position
  const baseStyle = {
    fontFamily: watermark.value.fontFamily,
    fontSize: `${watermark.value.fontSize}px`,
    fontWeight: watermark.value.fontWeight,
    color: watermark.value.color,
    opacity: watermark.value.opacity,
    margin: `${watermark.value.margin}px`,
  }

  const positionStyles: Record<string, Record<string, string>> = {
    'top-left': { top: '0', left: '0' },
    'top-center': { top: '0', left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: '0', right: '0' },
    'bottom-left': { bottom: '0', left: '0' },
    'bottom-center': { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: '0', right: '0' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  }

  const rotation = watermark.value.rotation !== 0
    ? ` rotate(${watermark.value.rotation}deg)`
    : ''

  return {
    ...baseStyle,
    ...positionStyles[pos],
    position: 'absolute' as const,
    transform: `${positionStyles[pos].transform || ''}${rotation}`,
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
  }
})

// Methods
function zoomIn() {
  if (zoom.value < 2) {
    zoom.value = Math.min(2, zoom.value + 0.25)
  }
}

function zoomOut() {
  if (zoom.value > 0.25) {
    zoom.value = Math.max(0.25, zoom.value - 0.25)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function handlePrint() {
  emit('print')
}

function handleEditSettings() {
  emit('edit-settings')
}

function handleClose() {
  emit('update:modelValue', false)
}

// Reset zoom when opening
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    zoom.value = 0.75
    currentPage.value = 1
  }
})
</script>

<style scoped>
.print-preview-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.zoom-level {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 50px;
  text-align: center;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.preview-canvas-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: auto;
  min-height: 400px;
  max-height: 500px;
}

.preview-page {
  background: white;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.page-boundary {
  display: flex;
  flex-direction: column;
}

.preview-content {
  position: relative;
  overflow: hidden;
}

.preview-watermark {
  position: absolute;
  z-index: 1000;
  user-select: none;
}

.settings-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  font-size: 0.875rem;
  color: #374151;
}

.capitalize {
  text-transform: capitalize;
}

.preview-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .zoom-btn,
  .page-btn,
  .preview-page {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .preview-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .zoom-controls,
  .page-info {
    justify-content: center;
  }

  .settings-summary {
    grid-template-columns: 1fr;
  }

  .preview-actions {
    flex-direction: column;
  }
}
</style>
