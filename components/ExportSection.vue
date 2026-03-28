<template>
  <div class="export-section p-4">
    <h3 class="text-sm font-medium text-gray-900 mb-3">Export Settings</h3>
    
    <!-- Format Selection -->
    <div class="export-group mb-6">
      <label class="block text-xs font-medium text-gray-600 mb-2">Format</label>
      <div class="format-grid grid grid-cols-3 gap-2">
        <button
          v-for="format in formats"
          :key="format.id"
          @click="handleFormatChange(format.id)"
          class="format-button flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all"
          :class="[
            isActiveFormat(format.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
          :aria-pressed="isActiveFormat(format.id)"
          :aria-label="`Export as ${format.name}`"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-xs font-medium text-gray-700">{{ format.name }}</span>
        </button>
      </div>
    </div>

    <!-- Quality Selection -->
    <div class="export-group mb-6">
      <label class="block text-xs font-medium text-gray-600 mb-2">Quality</label>
      <div class="quality-options flex flex-col gap-1">
        <button
          v-for="quality in qualities"
          :key="quality.id"
          @click="handleQualityChange(quality.id)"
          class="quality-option flex items-center justify-between px-3 py-2 rounded-lg transition-all"
          :class="[
            isActiveQuality(quality.id)
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-50 text-gray-700'
          ]"
          :aria-pressed="isActiveQuality(quality.id)"
        >
          <span class="text-sm">{{ quality.name }}</span>
          <span class="text-xs text-gray-500">{{ quality.description }}</span>
        </button>
      </div>
    </div>

    <!-- Paper Size (PDF only) -->
    <div v-if="exportStore.settings.format === 'pdf'" class="export-group mb-6">
      <label for="paper-size" class="block text-xs font-medium text-gray-600 mb-2">
        Paper Size
      </label>
      <select
        id="paper-size"
        v-model="exportStore.settings.paperSize"
        @change="handlePaperSizeChange"
        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Paper size"
      >
        <option v-for="size in paperSizes" :key="size.id" :value="size.id">
          {{ size.name }}
        </option>
      </select>
    </div>

    <!-- Orientation (PDF only) -->
    <div v-if="exportStore.settings.format === 'pdf'" class="export-group mb-6">
      <label class="block text-xs font-medium text-gray-600 mb-2">Orientation</label>
      <div class="orientation-options flex gap-2">
        <button
          @click="handleOrientationChange('landscape')"
          class="orientation-option flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all"
          :class="[
            exportStore.settings.orientation === 'landscape'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
          aria-pressed="exportStore.settings.orientation === 'landscape'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="text-sm font-medium">Landscape</span>
        </button>
        <button
          @click="handleOrientationChange('portrait')"
          class="orientation-option flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all"
          :class="[
            exportStore.settings.orientation === 'portrait'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
          aria-pressed="exportStore.settings.orientation === 'portrait'"
        >
          <svg class="w-5 h-5 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="text-sm font-medium">Portrait</span>
        </button>
      </div>
    </div>

    <!-- Watermark -->
    <div class="export-group mb-6">
      <div class="flex items-center justify-between mb-2">
        <label class="text-xs font-medium text-gray-600">Watermark</label>
        <button
          @click="toggleWatermark"
          class="toggle-switch relative w-12 h-6 rounded-full transition-colors"
          :class="exportStore.watermark.enabled ? 'bg-blue-600' : 'bg-gray-300'"
          :aria-pressed="exportStore.watermark.enabled"
          role="switch"
          aria-label="Toggle watermark"
        >
          <span 
            class="toggle-slider absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
            :class="{ 'translate-x-6': exportStore.watermark.enabled }"
          />
        </button>
      </div>
      
      <input
        v-if="exportStore.watermark.enabled"
        v-model="exportStore.watermark.text"
        type="text"
        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Watermark text"
        aria-label="Watermark text"
        @input="handleWatermarkTextChange"
      />
    </div>

    <!-- Quick Export Buttons -->
    <div class="quick-export">
      <h4 class="text-xs font-medium text-gray-600 mb-2">Quick Export</h4>
      <div class="export-buttons flex flex-col gap-2">
        <button
          @click="handleQuickExport('pdf')"
          class="export-button flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          aria-label="Export to PDF"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export to PDF</span>
        </button>

        <button
          @click="handleQuickExport('png')"
          class="export-button flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          aria-label="Export to PNG"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Export to PNG</span>
        </button>

        <button
          @click="handleQuickExport('jpg')"
          class="export-button flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          aria-label="Export to JPG"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Export to JPG</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExportStore } from '~/stores/export'

const exportStore = useExportStore()

// Formats
const formats = [
  { id: 'pdf', name: 'PDF' },
  { id: 'png', name: 'PNG' },
  { id: 'jpg', name: 'JPG' },
]

// Qualities
const qualities = [
  { id: 'draft', name: 'Draft', description: 'Smallest file size' },
  { id: 'standard', name: 'Standard', description: 'Good quality' },
  { id: 'high', name: 'High', description: 'Best quality' },
  { id: 'ultra', name: 'Ultra', description: 'Maximum quality' },
]

// Paper sizes
const paperSizes = [
  { id: 'a4', name: 'A4 (210 × 297 mm)' },
  { id: 'letter', name: 'Letter (8.5 × 11 in)' },
  { id: 'legal', name: 'Legal (8.5 × 14 in)' },
  { id: 'a3', name: 'A3 (297 × 420 mm)' },
]

// Check if format is active
function isActiveFormat(formatId: string): boolean {
  return exportStore.settings.format === formatId
}

// Check if quality is active
function isActiveQuality(qualityId: string): boolean {
  return exportStore.settings.quality === qualityId
}

// Event handlers
function handleFormatChange(formatId: string) {
  exportStore.updateSettings({ format: formatId as any })
}

function handleQualityChange(qualityId: string) {
  exportStore.updateSettings({ quality: qualityId as any })
}

function handlePaperSizeChange() {
  exportStore.saveSettings()
}

function handleOrientationChange(orientation: 'landscape' | 'portrait') {
  exportStore.updateSettings({ orientation })
}

function toggleWatermark() {
  exportStore.updateWatermark({ enabled: !exportStore.watermark.enabled })
}

function handleWatermarkTextChange() {
  exportStore.saveWatermark()
}

function handleQuickExport(format: string) {
  // Trigger export with current settings
  const event = new CustomEvent('export-chart', { 
    detail: { format } 
  })
  window.dispatchEvent(event)
}
</script>

<style scoped>
.toggle-switch:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.format-button:focus-visible,
.orientation-option:focus-visible,
.quality-option:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
