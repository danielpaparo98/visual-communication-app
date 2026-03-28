<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    title="Export Chart"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
    size="md"
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
          <option value="standard">Standard</option>
          <option value="high">High</option>
          <option value="ultra">Ultra</option>
        </select>
        <p class="quality-hint">
          {{ getQualityDescription() }}
        </p>
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
            <p><strong>Quality:</strong> {{ selectedQuality }}</p>
            <p><strong>Filename:</strong> {{ getFilenameWithExtension() }}</p>
          </div>
        </div>
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
import AppModal from '~/components/AppModal.vue'
import AppButton from '~/components/AppButton.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import type { ExportFormat, ExportQuality } from '~/types'

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
}>()

const selectedFormat = ref<ExportFormat>(props.defaultFormat)
const selectedQuality = ref<ExportQuality>(props.defaultQuality)
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
  isExporting.value = true
  const fullFilename = getFilenameWithExtension()
  emit('export', selectedFormat.value, selectedQuality.value, fullFilename)
  
  // Reset exporting state after a delay
  setTimeout(() => {
    isExporting.value = false
    handleClose()
  }, 500)
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
