<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    title="Export Chart"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
    size="lg"
  >
    <div class="export-modal">
      <!-- Format Selection -->
      <div class="export-section">
        <label class="export-label" for="format-select">
          Export Format
        </label>
        <select
          id="format-select"
          v-model="selectedFormat"
          class="export-select"
          :aria-label="'Select export format'"
        >
          <option value="pdf">PDF Document (.pdf)</option>
          <option value="png">PNG Image (.png)</option>
          <option value="jpg">JPEG Image (.jpg)</option>
          <option value="svg">SVG Image (.svg)</option>
        </select>
      </div>

      <!-- Quality Selection (for PDF/JPG/PNG) -->
      <div v-if="showQualityOptions" class="export-section">
        <label class="export-label" for="quality-select">
          Quality
        </label>
        <select
          id="quality-select"
          v-model="selectedQuality"
          class="export-select"
          :aria-label="'Select export quality'"
        >
          <option value="draft">Draft</option>
          <option value="standard">Standard</option>
          <option value="high">High</option>
          <option value="ultra">Ultra</option>
        </select>
        <p class="quality-hint">
          {{ getQualityDescription() }}
        </p>
      </div>

      <!-- Paper Size (for PDF) -->
      <div v-if="selectedFormat === 'pdf'" class="export-section">
        <label class="export-label" for="paper-size-select">
          Paper Size
        </label>
        <select
          id="paper-size-select"
          v-model="selectedPaperSize"
          class="export-select"
          :aria-label="'Select paper size'"
        >
          <option value="a4">A4 (210 × 297 mm)</option>
          <option value="letter">Letter (216 × 279 mm)</option>
          <option value="legal">Legal (216 × 356 mm)</option>
          <option value="a3">A3 (297 × 420 mm)</option>
          <option value="a5">A5 (148 × 210 mm)</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <!-- Orientation (for PDF) -->
      <div v-if="selectedFormat === 'pdf'" class="export-section">
        <label class="export-label">Orientation</label>
        <div class="orientation-toggle">
          <button
            @click="selectedOrientation = 'portrait'"
            :class="{ active: selectedOrientation === 'portrait' }"
            class="orientation-btn"
            aria-label="Portrait orientation"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Portrait
          </button>
          <button
            @click="selectedOrientation = 'landscape'"
            :class="{ active: selectedOrientation === 'landscape' }"
            class="orientation-btn"
            aria-label="Landscape orientation"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Landscape
          </button>
        </div>
      </div>

      <!-- Margins (for PDF) -->
      <div v-if="selectedFormat === 'pdf'" class="export-section">
        <label class="export-label">Margins (mm)</label>
        <div class="margins-inputs">
          <div class="margin-input-group">
            <label for="margin-top" class="margin-label">Top</label>
            <input
              id="margin-top"
              v-model.number="selectedMargins.top"
              type="number"
              min="0"
              max="50"
              class="margin-input"
              :aria-label="'Top margin in millimeters'"
            />
          </div>
          <div class="margin-input-group">
            <label for="margin-right" class="margin-label">Right</label>
            <input
              id="margin-right"
              v-model.number="selectedMargins.right"
              type="number"
              min="0"
              max="50"
              class="margin-input"
              :aria-label="'Right margin in millimeters'"
            />
          </div>
          <div class="margin-input-group">
            <label for="margin-bottom" class="margin-label">Bottom</label>
            <input
              id="margin-bottom"
              v-model.number="selectedMargins.bottom"
              type="number"
              min="0"
              max="50"
              class="margin-input"
              :aria-label="'Bottom margin in millimeters'"
            />
          </div>
          <div class="margin-input-group">
            <label for="margin-left" class="margin-label">Left</label>
            <input
              id="margin-left"
              v-model.number="selectedMargins.left"
              type="number"
              min="0"
              max="50"
              class="margin-input"
              :aria-label="'Left margin in millimeters'"
            />
          </div>
        </div>
      </div>

      <!-- Scale (for PDF) -->
      <div v-if="selectedFormat === 'pdf'" class="export-section">
        <label class="export-label" for="scale-slider">
          Scale: {{ selectedScale }}x
        </label>
        <input
          id="scale-slider"
          v-model.number="selectedScale"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          class="scale-slider"
          :aria-label="'Export scale'"
        />
      </div>

      <!-- Color Mode (for PDF) -->
      <div v-if="selectedFormat === 'pdf'" class="export-section">
        <label class="export-label" for="color-mode-select">
          Color Mode
        </label>
        <select
          id="color-mode-select"
          v-model="selectedColorMode"
          class="export-select"
          :aria-label="'Select color mode'"
        >
          <option value="color">Color</option>
          <option value="grayscale">Grayscale</option>
          <option value="black-white">Black & White</option>
        </select>
      </div>

      <!-- Filename Input -->
      <div class="export-section">
        <label class="export-label" for="filename-input">
          Filename
        </label>
        <input
          id="filename-input"
          v-model="filename"
          type="text"
          class="filename-input"
          placeholder="my-communication-chart"
          :aria-label="'Enter filename for export'"
        />
        <p class="filename-hint">
          {{ getFilenameWithExtension() }}
        </p>
      </div>

      <!-- Preview -->
      <div v-if="showPreview" class="export-section">
        <h3 class="preview-title">Preview</h3>
        <div class="preview-container">
          <div class="preview-info">
            <p><strong>Format:</strong> {{ selectedFormat.toUpperCase() }}</p>
            <p v-if="selectedFormat === 'pdf'"><strong>Paper:</strong> {{ PAPER_SIZES[selectedPaperSize].name }}</p>
            <p v-if="selectedFormat === 'pdf'"><strong>Orientation:</strong> {{ selectedOrientation }}</p>
            <p><strong>Quality:</strong> {{ selectedQuality }}</p>
            <p><strong>Filename:</strong> {{ getFilenameWithExtension() }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <AppButton
          variant="secondary"
          @click="handlePrintPreview"
          size="sm"
          aria-label="Open print preview"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </template>
          Print Preview
        </AppButton>
        <AppButton
          variant="secondary"
          @click="handleWatermarkConfig"
          size="sm"
          aria-label="Configure watermark"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </template>
          Watermark
        </AppButton>
        <AppButton
          variant="secondary"
          @click="handleExportHistory"
          size="sm"
          aria-label="View export history"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
          History
        </AppButton>
        <AppButton
          variant="secondary"
          @click="handleSaveTemplate"
          size="sm"
          aria-label="Save as template"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </template>
          Save Template
        </AppButton>
      </div>

      <!-- Export Button -->
      <div class="export-actions">
        <AppButton
          variant="secondary"
          @click="handleClose"
          :aria-label="'Cancel export'"
        >
          Cancel
        </AppButton>
        <AppButton
          variant="primary"
          @click="handleExport"
          :disabled="isExporting"
          :aria-label="isExporting ? 'Exporting...' : 'Export chart'"
        >
          <template #icon-left>
            <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <LoadingSpinner v-else size="sm" />
          </template>
          {{ isExporting ? 'Exporting...' : 'Export' }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppButton from '~/components/AppButton.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { useExportStore } from '~/stores/export'
import type { ExportFormat, ExportQuality, PaperSize } from '~/types'
import { PAPER_SIZES } from '~/types'

interface Props {
  modelValue: boolean
  defaultFormat?: ExportFormat
  defaultQuality?: ExportQuality
  defaultFilename?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultFormat: 'pdf',
  defaultQuality: 'standard',
  defaultFilename: 'my-communication-chart',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'export': [format: ExportFormat, quality: ExportQuality, filename: string]
  'print-preview': []
  'watermark-config': []
  'export-history': []
  'save-template': []
}>()

const exportStore = useExportStore()

const isOpen = computed(() => props.modelValue)
const selectedFormat = ref<ExportFormat>(props.defaultFormat)
const selectedQuality = ref<ExportQuality>(props.defaultQuality)
const selectedPaperSize = ref<PaperSize>(exportStore.settings.paperSize)
const selectedOrientation = ref<'portrait' | 'landscape'>(exportStore.settings.orientation)
const selectedMargins = ref({ ...exportStore.settings.margins })
const selectedScale = ref(exportStore.settings.scale)
const selectedColorMode = ref(exportStore.settings.colorMode)
const filename = ref(props.defaultFilename)
const isExporting = ref(false)

const showQualityOptions = computed(() => ['pdf', 'jpg', 'png'].includes(selectedFormat.value))
const showPreview = computed(() => selectedFormat.value !== 'svg')

function getFilenameWithExtension(): string {
  const ext = selectedFormat.value === 'jpg' ? 'jpg' : selectedFormat.value
  return filename.value ? `${filename.value}.${ext}` : `my-communication-chart.${ext}`
}

function getQualityDescription(): string {
  switch (selectedQuality.value) {
    case 'draft':
      return 'Fastest export, lowest quality'
    case 'standard':
      return 'Good quality, smaller file size'
    case 'high':
      return 'Better quality, larger file size'
    case 'ultra':
      return 'Best quality, largest file size'
    default:
      return ''
  }
}

function handleExport() {
  // Update export store with current settings
  exportStore.updateSettings({
    format: selectedFormat.value,
    quality: selectedQuality.value,
    paperSize: selectedPaperSize.value,
    orientation: selectedOrientation.value,
    margins: selectedMargins.value,
    scale: selectedScale.value,
    colorMode: selectedColorMode.value,
  })
  
  isExporting.value = true
  const fullFilename = getFilenameWithExtension()
  emit('export', selectedFormat.value, selectedQuality.value, fullFilename)
  
  // Reset exporting state after a delay
  setTimeout(() => {
    isExporting.value = false
    handleClose()
  }, 500)
}

function handlePrintPreview() {
  emit('print-preview')
}

function handleWatermarkConfig() {
  emit('watermark-config')
}

function handleExportHistory() {
  emit('export-history')
}

function handleSaveTemplate() {
  emit('save-template')
}

function handleClose() {
  if (!isExporting.value) {
    emit('update:modelValue', false)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Reset to defaults when opening
    selectedFormat.value = props.defaultFormat
    selectedQuality.value = props.defaultQuality
    filename.value = props.defaultFilename
    selectedPaperSize.value = exportStore.settings.paperSize
    selectedOrientation.value = exportStore.settings.orientation
    selectedMargins.value = { ...exportStore.settings.margins }
    selectedScale.value = exportStore.settings.scale
    selectedColorMode.value = exportStore.settings.colorMode
  }
})
</script>

<style scoped>
.export-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.export-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.export-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.export-select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-select:hover {
  border-color: #cbd5e1;
}

.export-select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.filename-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s ease;
}

.filename-input:hover {
  border-color: #cbd5e1;
}

.filename-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.filename-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.quality-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.preview-container {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
}

.orientation-toggle {
  display: flex;
  gap: 0.5rem;
}

.orientation-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.orientation-btn:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.orientation-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.orientation-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.margins-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.margin-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.margin-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.margin-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s ease;
}

.margin-input:hover {
  border-color: #cbd5e1;
}

.margin-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

.scale-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  appearance: none;
  background: #e5e7eb;
  cursor: pointer;
}

.scale-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.scale-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.scale-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.export-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .export-select,
  .filename-input {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .export-modal {
    gap: 1rem;
  }

  .export-actions {
    flex-direction: column;
  }
}
</style>
