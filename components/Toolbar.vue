<template>
  <aside class="toolbar" :class="{ 'is-collapsed': isCollapsed }">
    <button
      class="toolbar-toggle"
      @click="toggleCollapse"
      :aria-label="isCollapsed ? 'Expand toolbar' : 'Collapse toolbar'"
      :title="isCollapsed ? 'Expand toolbar' : 'Collapse toolbar'"
    >
      <svg v-if="isCollapsed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>

    <div v-show="!isCollapsed" class="toolbar-content">
      <!-- Layout Section -->
      <section class="toolbar-section">
        <h3 class="section-title">Layout</h3>
        <div class="layout-presets">
          <button
            v-for="(preset, key) in LAYOUT_PRESETS"
            :key="key"
            class="preset-button"
            :class="{ 'active': canvasSettings.layout === key }"
            @click="handleLayoutChange(key as LayoutPreset)"
            :aria-label="`Select ${preset.name} layout`"
          >
            <div class="preset-grid" :class="`preset-${key}`"></div>
            <span class="preset-name">{{ preset.name }}</span>
          </button>
        </div>
      </section>

      <!-- Cards Section -->
      <section class="toolbar-section">
        <h3 class="section-title">Cards</h3>
        <div class="card-controls">
          <AppButton
            variant="primary"
            size="sm"
            @click="handleAddCard"
            :disabled="!canAddCard"
            class="w-full"
          >
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </template>
            Add Card
          </AppButton>
          
          <div class="control-row">
            <AppButton
              variant="outline"
              size="sm"
              @click="handleDuplicateSelected"
              :disabled="!selectedCardId"
              class="flex-1"
            >
              <template #icon-left>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </template>
              Duplicate
            </AppButton>
            
            <AppButton
              variant="danger"
              size="sm"
              @click="handleRemoveSelected"
              :disabled="!selectedCardId"
              class="flex-1"
            >
              <template #icon-left>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </template>
              Remove
            </AppButton>
          </div>
        </div>
      </section>

      <!-- Spacing Section -->
      <section class="toolbar-section">
        <h3 class="section-title">Spacing</h3>
        <div class="spacing-controls">
          <div class="control-group">
            <label class="control-label">Card Gap: {{ canvasSettings.cardGap }}mm</label>
            <input
              type="range"
              :value="canvasSettings.cardGap"
              min="2"
              max="15"
              step="1"
              @input="handleCardGapChange"
              class="control-slider"
              :disabled="isPreviewMode"
            />
          </div>
          
          <div class="control-group">
            <label class="control-label">Margins: {{ canvasSettings.marginTop }}mm</label>
            <input
              type="range"
              :value="canvasSettings.marginTop"
              min="5"
              max="30"
              step="1"
              @input="handleMarginChange"
              class="control-slider"
              :disabled="isPreviewMode"
            />
          </div>
        </div>
      </section>

      <!-- Style Section -->
      <section class="toolbar-section">
        <h3 class="section-title">Style</h3>
        <div class="style-controls">
          <div class="control-group">
            <label class="control-label">Font Family</label>
            <select
              :value="styleSettings.fontFamily"
              @change="handleFontFamilyChange"
              class="control-select"
              :disabled="isPreviewMode"
            >
              <option v-for="(font, key) in FONT_FAMILIES" :key="key" :value="key">
                {{ font.name }}
              </option>
            </select>
          </div>
          
          <div class="control-group">
            <label class="control-label">Theme</label>
            <div class="theme-buttons">
              <button
                v-for="(theme, key) in THEMES"
                :key="key"
                class="theme-button"
                :class="{ 'active': styleSettings.theme === key }"
                @click="handleThemeChange(key as ColorTheme)"
                :style="{ backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }"
                :aria-label="`Select ${theme.name} theme`"
                :title="theme.name"
              >
                <span class="theme-dot" :style="{ backgroundColor: theme.colors.primary }"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Zoom Section -->
      <section class="toolbar-section">
        <h3 class="section-title">Zoom</h3>
        <div class="zoom-controls">
          <div class="zoom-buttons">
            <button
              class="zoom-button"
              @click="handleZoomOut"
              :disabled="zoom <= 0.5"
              :aria-label="`Zoom out, current ${Math.round(zoom * 100)}%`"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            
            <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
            
            <button
              class="zoom-button"
              @click="handleZoomIn"
              :disabled="zoom >= 1.5"
              :aria-label="`Zoom in, current ${Math.round(zoom * 100)}%`"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <button
            class="zoom-reset"
            @click="handleResetZoom"
            :disabled="zoom === 1.0"
          >
            Reset
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { CanvasSettings, StyleSettings, LayoutPreset, ColorTheme } from '~/types'
import { LAYOUT_PRESETS, FONT_FAMILIES, THEMES, ZOOM_LEVELS } from '~/types'

interface Props {
  canvasSettings: CanvasSettings
  styleSettings: StyleSettings
  zoom: number
  isPreviewMode: boolean
  selectedCardId: string | null
  canAddCard: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:canvas-settings': [settings: Partial<CanvasSettings>]
  'update:style-settings': [settings: Partial<StyleSettings>]
  'update:zoom': [zoom: number]
  'add-card': []
  'remove-selected': []
  'duplicate-selected': []
}>()

const isCollapsed = ref(false)

// Methods
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function handleLayoutChange(preset: LayoutPreset) {
  const presetConfig = LAYOUT_PRESETS[preset]
  emit('update:canvas-settings', {
    layout: preset,
    columns: presetConfig.columns,
    rows: presetConfig.rows,
  })
}

function handleAddCard() {
  emit('add-card')
}

function handleDuplicateSelected() {
  emit('duplicate-selected')
}

function handleRemoveSelected() {
  emit('remove-selected')
}

function handleCardGapChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:canvas-settings', { cardGap: parseInt(target.value) })
}

function handleMarginChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)
  emit('update:canvas-settings', {
    marginTop: value,
    marginBottom: value,
    marginLeft: value,
    marginRight: value,
  })
}

function handleFontFamilyChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:style-settings', { fontFamily: target.value as FontFamily })
}

function handleThemeChange(theme: ColorTheme) {
  const themeConfig = THEMES[theme]
  emit('update:style-settings', {
    theme,
    backgroundColor: themeConfig.colors.background,
  })
}

function handleZoomIn() {
  const currentIndex = ZOOM_LEVELS.indexOf(props.zoom)
  if (currentIndex < ZOOM_LEVELS.length - 1) {
    emit('update:zoom', ZOOM_LEVELS[currentIndex + 1])
  }
}

function handleZoomOut() {
  const currentIndex = ZOOM_LEVELS.indexOf(props.zoom)
  if (currentIndex > 0) {
    emit('update:zoom', ZOOM_LEVELS[currentIndex - 1])
  }
}

function handleResetZoom() {
  emit('update:zoom', 1.0)
}
</script>

<style scoped>
.toolbar {
  width: 300px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
}

.toolbar.is-collapsed {
  width: 56px;
}

.toolbar-toggle {
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.toolbar-toggle:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e1;
}

.toolbar-content {
  padding: 1.25rem 1rem;
  overflow-y: auto;
  flex: 1;
}

.toolbar-section {
  margin-bottom: 2rem;
}

.toolbar-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 0.875rem;
}

/* Layout presets */
.layout-presets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
}

.preset-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-button:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.preset-button.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.preset-grid {
  display: grid;
  gap: 2px;
}

.preset-2x10 {
  grid-template-columns: repeat(2, 1fr);
}

.preset-4x5 {
  grid-template-columns: repeat(4, 1fr);
}

.preset-5x4 {
  grid-template-columns: repeat(5, 1fr);
}

.preset-3x7 {
  grid-template-columns: repeat(3, 1fr);
}

.preset-grid > div {
  width: 9px;
  height: 9px;
  background: #94a3b8;
  border-radius: 1.5px;
}

.preset-name {
  font-size: 0.75rem;
  color: #334155;
  font-weight: 500;
}

/* Card controls */
.card-controls {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.control-row {
  display: flex;
  gap: 0.625rem;
}

/* Spacing controls */
.spacing-controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.control-label {
  font-size: 0.8125rem;
  color: #334155;
  font-weight: 600;
}

.control-slider {
  width: 100%;
  cursor: pointer;
  height: 6px;
  border-radius: 3px;
  appearance: none;
  background: #e2e8f0;
}

.control-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.control-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.control-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* Style controls */
.style-controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.control-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  color: #334155;
  font-weight: 500;
  transition: all 0.2s ease;
}

.control-select:hover {
  border-color: #cbd5e1;
}

.control-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.theme-buttons {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.theme-button {
  width: 36px;
  height: 36px;
  border: 2px solid;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-button.active {
  box-shadow: 0 0 0 2px #3b82f6;
}

.theme-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

/* Zoom controls */
.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.zoom-buttons {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.zoom-button {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.zoom-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-level {
  flex: 1;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.zoom-reset {
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}

.zoom-reset:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.zoom-reset:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toolbar,
  .toolbar-toggle,
  .preset-button,
  .theme-button,
  .zoom-button,
  .zoom-reset {
    transition: none;
  }
  
  .theme-button:hover,
  .zoom-button:hover,
  .control-slider::-webkit-slider-thumb:hover {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .toolbar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  }
}
</style>
