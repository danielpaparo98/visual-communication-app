<template>
  <div class="style-section p-4">
    <h3 class="text-sm font-medium text-gray-900 mb-3">Style Settings</h3>
    
    <!-- Color Theme -->
    <div class="style-group mb-6">
      <label class="block text-xs font-medium text-gray-600 mb-2">Color Theme</label>
      <div class="theme-grid grid grid-cols-2 gap-2">
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="handleThemeChange(theme.id)"
          class="theme-button flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all"
          :class="[
            isActiveTheme(theme.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
          :aria-pressed="isActiveTheme(theme.id)"
          :aria-label="`Select ${theme.name} theme`"
        >
          <div 
            class="theme-preview w-6 h-6 rounded-full"
            :style="{ backgroundColor: theme.colors.primary }"
          />
          <span class="text-xs font-medium text-gray-700">{{ theme.name }}</span>
        </button>
      </div>
    </div>

    <!-- Font Family -->
    <div class="style-group mb-6">
      <label for="font-family" class="block text-xs font-medium text-gray-600 mb-2">
        Font Family
      </label>
      <select
        id="font-family"
        v-model="localFontFamily"
        @change="handleFontFamilyChange"
        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Font family"
      >
        <option v-for="font in fontFamilies" :key="font.value" :value="font.value">
          {{ font.name }}
        </option>
      </select>
    </div>

    <!-- Font Size -->
    <div class="style-group mb-6">
      <label for="font-size" class="block text-xs font-medium text-gray-600 mb-2">
        Base Font Size: {{ localFontSize }}px
      </label>
      <input
        id="font-size"
        v-model.number="localFontSize"
        type="range"
        min="10"
        max="24"
        step="1"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        aria-label="Font size"
        @input="handleFontSizeChange"
      />
    </div>

    <!-- Background Color -->
    <div class="style-group mb-6">
      <label for="bg-color" class="block text-xs font-medium text-gray-600 mb-2">
        Background Color
      </label>
      <div class="flex items-center gap-2">
        <input
          id="bg-color"
          v-model="localBackgroundColor"
          type="color"
          class="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          aria-label="Background color picker"
          @input="handleBackgroundColorChange"
        />
        <input
          v-model="localBackgroundColor"
          type="text"
          class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Background color hex value"
          @change="handleBackgroundColorChange"
        />
      </div>
    </div>

    <!-- Card Style -->
    <div class="style-group">
      <label class="block text-xs font-medium text-gray-600 mb-2">Card Style</label>
      
      <div class="space-y-3">
        <!-- Card Border -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700">Show Card Borders</span>
          <button
            @click="toggleCardBorders"
            class="toggle-switch relative w-12 h-6 rounded-full transition-colors"
            :class="showCardBorders ? 'bg-blue-600' : 'bg-gray-300'"
            :aria-pressed="showCardBorders"
            role="switch"
            aria-label="Toggle card borders"
          >
            <span 
              class="toggle-slider absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
              :class="{ 'translate-x-6': showCardBorders }"
            />
          </button>
        </div>

        <!-- Card Shadow -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700">Card Shadow</span>
          <button
            @click="toggleCardShadow"
            class="toggle-switch relative w-12 h-6 rounded-full transition-colors"
            :class="showCardShadow ? 'bg-blue-600' : 'bg-gray-300'"
            :aria-pressed="showCardShadow"
            role="switch"
            aria-label="Toggle card shadow"
          >
            <span 
              class="toggle-slider absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
              :class="{ 'translate-x-6': showCardShadow }"
            />
          </button>
        </div>

        <!-- Rounded Corners -->
        <div>
          <label for="border-radius" class="block text-xs font-medium text-gray-600 mb-2">
            Border Radius: {{ localBorderRadius }}px
          </label>
          <input
            id="border-radius"
            v-model.number="localBorderRadius"
            type="range"
            min="0"
            max="16"
            step="1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Border radius"
            @input="handleBorderRadiusChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { THEMES } from '~/types'

const chartStore = useChartStore()

// Themes
const themes = Object.entries(THEMES).map(([id, theme]) => ({
  id,
  name: theme.name,
  colors: theme.colors,
}))

// Font families
const fontFamilies = [
  { value: 'Inter', name: 'Inter' },
  { value: 'Arial', name: 'Arial' },
  { value: 'Georgia', name: 'Georgia' },
  { value: 'Times New Roman', name: 'Times New Roman' },
  { value: 'Courier New', name: 'Courier New' },
  { value: 'Verdana', name: 'Verdana' },
]

// Local state
const localFontFamily = ref(chartStore.styleSettings.fontFamily)
const localFontSize = ref(chartStore.styleSettings.fontSize)
const localBackgroundColor = ref(chartStore.styleSettings.backgroundColor)
const localBorderRadius = ref(chartStore.styleSettings.borderRadius)

// Computed
const showCardBorders = computed(() => chartStore.styleSettings.showCardBorders)
const showCardShadow = computed(() => chartStore.styleSettings.showCardShadow)

// Watch for changes in store
watch(() => chartStore.styleSettings, (settings) => {
  localFontFamily.value = settings.fontFamily
  localFontSize.value = settings.fontSize
  localBackgroundColor.value = settings.backgroundColor
  localBorderRadius.value = settings.borderRadius
}, { deep: true })

// Check if theme is active
function isActiveTheme(themeId: string): boolean {
  return chartStore.styleSettings.theme === themeId
}

// Event handlers
function handleThemeChange(themeId: string) {
  chartStore.setTheme(themeId as any)
}

function handleFontFamilyChange() {
  chartStore.updateStyleSettings({ fontFamily: localFontFamily.value })
}

function handleFontSizeChange() {
  chartStore.updateStyleSettings({ fontSize: localFontSize.value })
}

function handleBackgroundColorChange() {
  chartStore.updateStyleSettings({ backgroundColor: localBackgroundColor.value })
}

function handleBorderRadiusChange() {
  chartStore.updateStyleSettings({ borderRadius: localBorderRadius.value })
}

function toggleCardBorders() {
  chartStore.updateStyleSettings({ showCardBorders: !showCardBorders.value })
}

function toggleCardShadow() {
  chartStore.updateStyleSettings({ showCardShadow: !showCardShadow.value })
}
</script>

<style scoped>
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

.toggle-switch:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.theme-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
