<template>
  <div class="layout-section p-4">
    <h3 class="text-sm font-medium text-gray-900 mb-3">Layout Presets</h3>
    
    <!-- Preset Grid -->
    <div class="preset-grid grid grid-cols-2 gap-3">
      <button
        v-for="preset in presets"
        :key="preset.id"
        @click="handleSelectPreset(preset.id)"
        class="preset-button flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all"
        :class="[
          isActive(preset.id)
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        ]"
        :aria-pressed="isActive(preset.id)"
        :aria-label="`Select ${preset.name} layout`"
      >
        <!-- Visual Preview -->
        <div 
          class="preset-preview w-12 h-12 bg-gray-200 rounded"
          :style="{ gridTemplateColumns: `repeat(${preset.cols}, 1fr)`, display: 'grid', gap: '2px' }"
        >
          <div 
            v-for="i in preset.cols * preset.rows"
            :key="i"
            class="bg-gray-400 rounded-sm"
            :class="{ 'bg-blue-400': isActive(preset.id) }"
          />
        </div>
        
        <!-- Label -->
        <span class="text-xs font-medium text-gray-700">{{ preset.name }}</span>
      </button>
    </div>

    <!-- Custom Layout -->
    <div class="custom-layout mt-6 pt-6 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Custom Layout</h4>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- Columns -->
        <div>
          <label 
            for="layout-columns" 
            class="block text-xs font-medium text-gray-600 mb-1"
          >
            Columns: {{ customColumns }}
          </label>
          <input
            id="layout-columns"
            v-model.number="customColumns"
            type="range"
            min="1"
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Number of columns"
            @input="handleCustomLayout"
          />
        </div>
        
        <!-- Rows -->
        <div>
          <label 
            for="layout-rows" 
            class="block text-xs font-medium text-gray-600 mb-1"
          >
            Rows: {{ customRows }}
          </label>
          <input
            id="layout-rows"
            v-model.number="customRows"
            type="range"
            min="1"
            max="20"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Number of rows"
            @input="handleCustomLayout"
          />
        </div>
      </div>

      <!-- Card Gap -->
      <div class="mt-4">
        <label 
          for="layout-gap" 
          class="block text-xs font-medium text-gray-600 mb-1"
        >
          Card Gap: {{ customGap }}px
        </label>
        <input
          id="layout-gap"
          v-model.number="customGap"
          type="range"
          min="0"
          max="50"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          aria-label="Card gap spacing"
          @input="handleCustomLayout"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import type { LayoutPreset } from '~/types'

interface Preset {
  id: LayoutPreset
  name: string
  cols: number
  rows: number
}

const chartStore = useChartStore()

// Presets
const presets: Preset[] = [
  { id: '2x10', name: '2×10', cols: 2, rows: 10 },
  { id: '4x5', name: '4×5', cols: 4, rows: 5 },
  { id: '5x4', name: '5×4', cols: 5, rows: 4 },
  { id: '3x7', name: '3×7', cols: 3, rows: 7 },
]

// Custom layout state
const customColumns = ref(chartStore.canvasSettings.columns)
const customRows = ref(chartStore.canvasSettings.rows)
const customGap = ref(chartStore.canvasSettings.cardGap)

// Watch for changes in store
watch(() => chartStore.canvasSettings, (settings) => {
  customColumns.value = settings.columns
  customRows.value = settings.rows
  customGap.value = settings.cardGap
}, { deep: true })

// Check if preset is active
function isActive(presetId: LayoutPreset): boolean {
  return chartStore.canvasSettings.layout === presetId
}

// Handle preset selection
function handleSelectPreset(presetId: LayoutPreset) {
  chartStore.setLayoutPreset(presetId)
}

// Handle custom layout
function handleCustomLayout() {
  chartStore.updateCanvasSettings({
    layout: 'custom',
    columns: customColumns.value,
    rows: customRows.value,
    cardGap: customGap.value,
  })
}
</script>

<style scoped>
.preset-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
