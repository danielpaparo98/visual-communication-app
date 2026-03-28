<template>
  <div class="text-formatting-toolbar" :style="positionStyle">
    <div class="toolbar-group">
      <!-- Bold Toggle -->
      <button
        class="format-button"
        :class="{ 'active': formatting.bold }"
        @click="handleBold"
        :aria-label="'Bold' + (formatting.bold ? ' (enabled)' : ' (disabled)')"
        :aria-pressed="formatting.bold"
        title="Bold (Ctrl+B)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4v1a1 1 0 001-1h-3a1 1 0 00-1 1v-2a1 1 0 001 1h3a1 1 0 001 1v2a1 1 0 001-1h-3a1 1 0 00-1-1z" />
        </svg>
      </button>

      <!-- Italic Toggle -->
      <button
        class="format-button"
        :class="{ 'active': formatting.italic }"
        @click="handleItalic"
        :aria-label="'Italic' + (formatting.italic ? ' (enabled)' : ' (disabled)')"
        :aria-pressed="formatting.italic"
        title="Italic (Ctrl+I)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4h-9a2 2 0 00-2 2v14a2 2 0 002 2h5a2 2 0 002-2V6a2 2 0 00-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4h-9a2 2 0 00-2 2v14a2 2 0 002 2h5a2 2 0 002-2V6a2 2 0 00-2-2z" />
        </svg>
      </button>

      <!-- Underline Toggle -->
      <button
        class="format-button"
        :class="{ 'active': formatting.underline }"
        @click="handleUnderline"
        :aria-label="'Underline' + (formatting.underline ? ' (enabled)' : ' (disabled)')"
        :aria-pressed="formatting.underline"
        title="Underline (Ctrl+U)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3v12" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 20h12" />
        </svg>
      </button>
    </div>

    <div class="toolbar-group">
      <!-- Text Color -->
      <div class="color-picker-wrapper">
        <button
          class="color-button"
          @click="toggleColorPicker"
          :aria-label="'Text color: ' + formatting.color"
          :style="{ backgroundColor: formatting.color }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m0 0l-3-3m3 3l3-3" />
          </svg>
        </button>
        <input
          v-if="showColorPicker"
          ref="colorInput"
          type="color"
          class="color-input"
          :value="formatting.color"
          @input="handleColorChange"
          @blur="showColorPicker = false"
          :aria-label="'Choose text color'"
        />
      </div>

      <!-- Background Color -->
      <div class="color-picker-wrapper">
        <button
          class="color-button"
          @click="toggleBgColorPicker"
          :aria-label="'Background color: ' + (formatting.backgroundColor || 'none')"
          :style="{ backgroundColor: formatting.backgroundColor || '#ffffff' }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2" />
          </svg>
        </button>
        <input
          v-if="showBgColorPicker"
          ref="bgColorInput"
          type="color"
          class="color-input"
          :value="formatting.backgroundColor || '#ffffff'"
          @input="handleBgColorChange"
          @blur="showBgColorPicker = false"
          :aria-label="'Choose background color'"
        />
      </div>
    </div>

    <div class="toolbar-group">
      <!-- Font Size -->
      <div class="font-size-wrapper">
        <button
          class="font-size-button"
          @click="decreaseFontSize"
          :disabled="formatting.fontSize <= 8"
          :aria-label="'Decrease font size'"
          title="Decrease font size"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14" />
          </svg>
        </button>
        <span class="font-size-value">{{ formatting.fontSize }}px</span>
        <button
          class="font-size-button"
          @click="increaseFontSize"
          :disabled="formatting.fontSize >= 24"
          :aria-label="'Increase font size'"
          title="Increase font size"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12h-14" />
          </svg>
        </button>
      </div>
    </div>

    <div class="toolbar-group">
      <!-- Alignment -->
      <button
        class="format-button"
        :class="{ 'active': formatting.alignment === 'left' }"
        @click="setAlignment('left')"
        :aria-label="'Align left'"
        :aria-pressed="formatting.alignment === 'left'"
        title="Align left (Ctrl+L)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 10H7a2 2 0 01-2-2v10a2 2 0 012 2h10a2 2 0 002-2V10a2 2 0 01-2-2z" />
        </svg>
      </button>

      <button
        class="format-button"
        :class="{ 'active': formatting.alignment === 'center' }"
        @click="setAlignment('center')"
        :aria-label="'Align center'"
        :aria-pressed="formatting.alignment === 'center'"
        title="Align center (Ctrl+E)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16v12H4z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8" />
        </svg>
      </button>

      <button
        class="format-button"
        :class="{ 'active': formatting.alignment === 'right' }"
        @click="setAlignment('right')"
        :aria-label="'Align right'"
        :aria-pressed="formatting.alignment === 'right'"
        title="Align right (Ctrl+R)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H7a2 2 0 01-2-2v10a2 2 0 012 2h14a2 2 0 002-2V10a2 2 0 01-2-2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TextFormatting } from '~/types'

interface Props {
  modelValue: boolean
  cardId: string
  formatting: TextFormatting
  position: { x: number; y: number }
  availableColors?: string[]
  availableFontSizes?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  availableColors: () => [
    '#000000', '#1f2937', '#dc2626', '#d97706', '#ea580c',
    '#ca8a04', '#16a34a', '#7c3aed', '#2563eb', '#4b5563',
    '#64748b', '#9ca3af', '#d1d5db', '#6b7280', '#f59e0b',
  ],
  availableFontSizes: () => [8, 10, 12, 14, 16, 18, 20, 22, 24],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'apply-formatting': [formatting: Partial<TextFormatting>]
}>()

const showColorPicker = ref(false)
const showBgColorPicker = ref(false)
const colorInput = ref<HTMLInputElement>()
const bgColorInput = ref<HTMLInputElement>()

const positionStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
}))

function handleBold() {
  emit('apply-formatting', { bold: !props.formatting.bold })
}

function handleItalic() {
  emit('apply-formatting', { italic: !props.formatting.italic })
}

function handleUnderline() {
  emit('apply-formatting', { underline: !props.formatting.underline })
}

function toggleColorPicker() {
  showColorPicker.value = !showColorPicker.value
  showBgColorPicker.value = false
  setTimeout(() => {
    colorInput.value?.focus()
  }, 10)
}

function handleColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('apply-formatting', { color: target.value })
}

function toggleBgColorPicker() {
  showBgColorPicker.value = !showBgColorPicker.value
  showColorPicker.value = false
  setTimeout(() => {
    bgColorInput.value?.focus()
  }, 10)
}

function handleBgColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('apply-formatting', { backgroundColor: target.value })
}

function decreaseFontSize() {
  const newSize = Math.max(8, props.formatting.fontSize - 2)
  emit('apply-formatting', { fontSize: newSize })
}

function increaseFontSize() {
  const newSize = Math.min(24, props.formatting.fontSize + 2)
  emit('apply-formatting', { fontSize: newSize })
}

function setAlignment(alignment: 'left' | 'center' | 'right') {
  emit('apply-formatting', { alignment })
}

// Close color pickers when clicking outside
onClickOutside(() => {
  showColorPicker.value = false
  showBgColorPicker.value = false
}, [colorInput, bgColorInput])
</script>

<style scoped>
.text-formatting-toolbar {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  z-index: 9998;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 500px;
}

.toolbar-group {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.format-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.format-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.format-button.active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.format-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.color-picker-wrapper {
  position: relative;
}

.color-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-button:hover {
  border-color: #d1d5db;
}

.color-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.color-input {
  position: absolute;
  top: 2.75rem;
  left: 0;
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0;
  cursor: pointer;
}

.font-size-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.font-size-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.font-size-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.font-size-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.font-size-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.font-size-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 3rem;
  text-align: center;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .format-button,
  .color-button,
  .font-size-button {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .text-formatting-toolbar {
    max-width: calc(100vw - 2rem);
  }

  .toolbar-group {
    flex-wrap: wrap;
  }
}
</style>
