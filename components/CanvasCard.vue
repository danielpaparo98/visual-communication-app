<template>
  <div
    class="canvas-card"
    :class="cardClasses"
    :style="cardStyle"
  >
    <!-- Icon Area -->
    <button
      class="card-icon-button"
      @click.stop="handleIconClick"
      :disabled="isPreviewMode"
      :aria-label="`Change icon for ${card.heading || 'card'}`"
    >
      <img
        v-if="iconSrc"
        :src="iconSrc"
        :alt="icon?.alt || 'Card icon'"
        class="card-icon"
      />
      <div v-else class="card-icon-placeholder">
        <svg class="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      
      <!-- Change Icon Overlay (edit mode only) -->
      <div v-if="!isPreviewMode" class="icon-overlay">
        <svg class="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-white text-sm font-medium">Change Icon</span>
      </div>
    </button>
    
    <!-- Heading Input -->
    <input
      :value="card.heading"
      type="text"
      :maxlength="MAX_HEADING_LENGTH"
      placeholder="Heading"
      class="card-heading"
      :style="headingStyle"
      :disabled="isPreviewMode"
      @change="handleHeadingChange"
      @focus="handleFocus"
    />
    
    <!-- Subtitle Input -->
    <input
      :value="card.subtitle"
      type="text"
      :maxlength="MAX_SUBTITLE_LENGTH"
      placeholder="Subtitle"
      class="card-subtitle"
      :style="subtitleStyle"
      :disabled="isPreviewMode"
      @change="handleSubtitleChange"
      @focus="handleFocus"
    />
    
    <!-- Card Actions (edit mode, selected only) -->
    <CardActions
      v-if="isSelected && !isPreviewMode"
      :card-id="card.id"
      @delete="handleDelete"
      @duplicate="handleDuplicate"
    />
  </div>
</template>

<script setup lang="ts">
import type { Card, StyleSettings } from '~/types'
import { MAX_HEADING_LENGTH, MAX_SUBTITLE_LENGTH, THEMES } from '~/types'

interface Props {
  card: Card
  isSelected: boolean
  isPreviewMode: boolean
  styleSettings: StyleSettings
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select': []
  'update': [updates: Partial<Card>]
  'delete': []
  'duplicate': []
}>()

const iconsStore = useIconsStore()

// Computed
const cardClasses = computed(() => ({
  'is-selected': props.isSelected,
  'is-preview': props.isPreviewMode,
}))

const cardStyle = computed(() => {
  const theme = props.styleSettings.theme
  const colors = THEMES[theme]?.colors
  
  return {
    backgroundColor: colors?.cardBackground || '#ffffff',
    borderColor: colors?.border || '#e5e7eb',
    color: colors?.text || '#111827',
  }
})

const headingStyle = computed(() => ({
  fontSize: `${props.styleSettings.headingFontSize}pt`,
  fontFamily: props.styleSettings.fontFamily,
}))

const subtitleStyle = computed(() => ({
  fontSize: `${props.styleSettings.subtitleFontSize}pt`,
  fontFamily: props.styleSettings.fontFamily,
}))

const icon = computed(() => {
  if (!props.card.iconId) return null
  return iconsStore.getIconById(props.card.iconId)
})

const iconSrc = computed(() => {
  if (!icon.value) return null
  return `/icons/${icon.value.filename}`
})

// Methods
function handleFocus() {
  emit('select')
}

function handleIconClick() {
  emit('select')
  // Icon picker will be opened by parent
}

function handleHeadingChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update', { heading: target.value })
}

function handleSubtitleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update', { subtitle: target.value })
}

function handleDelete() {
  emit('delete')
}

function handleDuplicate() {
  emit('duplicate')
}
</script>

<style scoped>
.canvas-card {
  position: relative;
  background: white;
  border: 2px solid;
  border-radius: 12px;
  padding: 8px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 120px;
}

.canvas-card:hover:not(.is-preview) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.canvas-card.is-selected {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.card-icon-button {
  position: relative;
  width: 100%;
  aspect-square: 1 / 1;
  border-radius: 8px;
  background: #f9fafb;
  overflow: hidden;
  cursor: pointer;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.card-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.card-icon-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.icon-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.card-icon-button:hover .icon-overlay {
  opacity: 1;
}

.card-heading,
.card-subtitle {
  width: 100%;
  text-align: center;
  border: none;
  background: transparent;
  outline: none;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.card-heading {
  font-weight: 600;
}

.card-subtitle {
  font-weight: 400;
}

.card-heading:hover:not(:disabled),
.card-subtitle:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.02);
}

.card-heading:focus:not(:disabled),
.card-subtitle:focus:not(:disabled) {
  background: rgba(59, 130, 246, 0.1);
}

/* Print styles */
@media print {
  .canvas-card {
    box-shadow: none;
  }
  
  .icon-overlay {
    display: none;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .canvas-card,
  .icon-overlay,
  .card-heading,
  .card-subtitle {
    transition: none;
  }
}
</style>
