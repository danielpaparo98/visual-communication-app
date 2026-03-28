<template>
  <div class="watermark-config">
    <!-- Toggle -->
    <div class="toggle-row">
      <label for="watermark-enabled" class="config-label">
        Enable Watermark
      </label>
      <input
        id="watermark-enabled"
        type="checkbox"
        v-model="watermark.enabled"
        class="toggle-checkbox"
        aria-label="Toggle watermark"
      />
    </div>

    <!-- Text -->
    <div class="input-row">
      <label for="watermark-text" class="config-label">
        Text
      </label>
      <input
        id="watermark-text"
        type="text"
        v-model="watermark.text"
        class="config-input"
        placeholder="Enter watermark text"
        :aria-label="'Watermark text'"
      />
    </div>

    <!-- Position -->
    <div class="position-selector">
      <label class="config-label">Position</label>
      <div class="position-grid" role="radiogroup" aria-label="Watermark position">
        <button
          v-for="pos in positions"
          :key="pos.value"
          @click="watermark.position = pos.value"
          :class="{ active: watermark.position === pos.value }"
          :aria-label="pos.label"
          :aria-pressed="watermark.position === pos.value"
          class="position-btn"
        >
          {{ pos.label }}
        </button>
      </div>
    </div>

    <!-- Font settings -->
    <div class="font-settings">
      <h4 class="section-title">Font Settings</h4>
      <div class="input-row">
        <label for="font-family" class="config-label">
          Font Family
        </label>
        <select
          id="font-family"
          v-model="watermark.fontFamily"
          class="config-select"
          aria-label="Select font family"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
        </select>
      </div>

      <div class="input-row">
        <label for="font-size" class="config-label">
          Font Size
        </label>
        <div class="slider-row">
          <input
            id="font-size"
            type="range"
            v-model.number="watermark.fontSize"
            min="8"
            max="48"
            class="config-slider"
            aria-label="Font size"
          />
          <span class="slider-value">{{ watermark.fontSize }}px</span>
        </div>
      </div>

      <div class="input-row">
        <label for="font-weight" class="config-label">
          Font Weight
        </label>
        <select
          id="font-weight"
          v-model="watermark.fontWeight"
          class="config-select"
          aria-label="Select font weight"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="light">Light</option>
        </select>
      </div>
    </div>

    <!-- Color and opacity -->
    <div class="color-settings">
      <h4 class="section-title">Color & Opacity</h4>
      <div class="input-row">
        <label for="watermark-color" class="config-label">
          Color
        </label>
        <div class="color-picker-row">
          <input
            id="watermark-color"
            type="color"
            v-model="watermark.color"
            class="config-color"
            aria-label="Watermark color"
          />
          <span class="color-value">{{ watermark.color }}</span>
        </div>
      </div>

      <div class="input-row">
        <label for="watermark-opacity" class="config-label">
          Opacity
        </label>
        <div class="slider-row">
          <input
            id="watermark-opacity"
            type="range"
            v-model.number="watermark.opacity"
            min="0.1"
            max="1"
            step="0.1"
            class="config-slider"
            aria-label="Watermark opacity"
          />
          <span class="slider-value">{{ Math.round(watermark.opacity * 100) }}%</span>
        </div>
      </div>
    </div>

    <!-- Rotation and margin -->
    <div class="transform-settings">
      <h4 class="section-title">Transform</h4>
      <div class="input-row">
        <label for="watermark-rotation" class="config-label">
          Rotation
        </label>
        <div class="slider-row">
          <input
            id="watermark-rotation"
            type="range"
            v-model.number="watermark.rotation"
            min="-45"
            max="45"
            class="config-slider"
            aria-label="Watermark rotation"
          />
          <span class="slider-value">{{ watermark.rotation }}°</span>
        </div>
      </div>

      <div class="input-row">
        <label for="watermark-margin" class="config-label">
          Margin
        </label>
        <div class="slider-row">
          <input
            id="watermark-margin"
            type="range"
            v-model.number="watermark.margin"
            min="0"
            max="50"
            class="config-slider"
            aria-label="Watermark margin"
          />
          <span class="slider-value">{{ watermark.margin }}mm</span>
        </div>
      </div>
    </div>

    <!-- Live Preview -->
    <div class="watermark-preview">
      <h4 class="section-title">Live Preview</h4>
      <div class="preview-container">
        <div
          class="preview-canvas"
          :style="previewContainerStyles"
        >
          <span
            class="preview-text"
            :style="previewStyles"
          >
            {{ watermark.text || 'Watermark Text' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExportStore } from '~/stores/export'
import type { WatermarkPosition } from '~/types'

const exportStore = useExportStore()
const watermark = computed(() => exportStore.watermark)

const positions: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: '↖' },
  { value: 'top-center', label: '↑' },
  { value: 'top-right', label: '↗' },
  { value: 'bottom-left', label: '↙' },
  { value: 'bottom-center', label: '↓' },
  { value: 'bottom-right', label: '↘' },
  { value: 'center', label: '⊙' },
]

const positionStyles: Record<WatermarkPosition, string> = {
  'top-left': 'top: 0; left: 0; transform-origin: top left;',
  'top-center': 'top: 0; left: 50%; transform: translateX(-50%); transform-origin: top center;',
  'top-right': 'top: 0; right: 0; transform-origin: top right;',
  'bottom-left': 'bottom: 0; left: 0; transform-origin: bottom left;',
  'bottom-center': 'bottom: 0; left: 50%; transform: translateX(-50%); transform-origin: bottom center;',
  'bottom-right': 'bottom: 0; right: 0; transform-origin: bottom right;',
  'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%); transform-origin: center;',
}

const previewStyles = computed(() => {
  const baseStyle = {
    fontFamily: watermark.value.fontFamily,
    fontSize: `${watermark.value.fontSize}px`,
    fontWeight: watermark.value.fontWeight,
    color: watermark.value.color,
    opacity: watermark.value.opacity,
    margin: `${watermark.value.margin}px`,
  }

  const rotationStyle = watermark.value.rotation !== 0
    ? ` rotate(${watermark.value.rotation}deg)`
    : ''

  return {
    ...baseStyle,
    transform: watermark.value.position === 'center'
      ? `translate(-50%, -50%) rotate(${watermark.value.rotation}deg)`
      : `rotate(${watermark.value.rotation}deg)`,
  }
})

const previewContainerStyles = computed(() => {
  return {
    position: 'relative' as const,
    width: '100%',
    height: '120px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden' as const,
  }
})
</script>

<style scoped>
.watermark-config {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.toggle-checkbox {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  appearance: none;
  background: #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.toggle-checkbox::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-checkbox:checked {
  background: #3b82f6;
}

.toggle-checkbox:checked::before {
  transform: translateX(20px);
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.config-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s ease;
}

.config-input:hover {
  border-color: #cbd5e1;
}

.config-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

.config-select {
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

.config-select:hover {
  border-color: #cbd5e1;
}

.config-select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.config-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  appearance: none;
  background: #e5e7eb;
  cursor: pointer;
}

.config-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.config-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.config-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.slider-value {
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 50px;
  text-align: right;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.config-color {
  width: 48px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  background: white;
}

.color-value {
  font-size: 0.875rem;
  color: #6b7280;
  font-family: monospace;
}

.position-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.position-btn {
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.position-btn:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.position-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.position-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.font-settings,
.color-settings,
.transform-settings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.watermark-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-container {
  display: flex;
  justify-content: center;
}

.preview-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.preview-text {
  position: absolute;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toggle-checkbox,
  .toggle-checkbox::before,
  .config-input,
  .config-select,
  .config-slider,
  .position-btn {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .position-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .slider-row,
  .color-picker-row {
    flex-wrap: wrap;
  }
}
</style>
