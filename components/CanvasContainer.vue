<template>
  <div class="canvas-container" :class="{ 'preview-mode': isPreviewMode }">
    <div class="canvas-wrapper">
      <WysiwygCanvas
        ref="canvasRef"
        :cards="cards"
        :canvas-settings="canvasSettings"
        :style-settings="styleSettings"
        :zoom="zoom"
        :is-preview-mode="isPreviewMode"
        :selected-card-id="selectedCardId"
        :title="title"
        @select-card="handleSelectCard"
        @update-card="handleUpdateCard"
        @delete-card="handleDeleteCard"
        @duplicate-card="handleDuplicateCard"
        @reorder-cards="handleReorderCards"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, CanvasSettings, StyleSettings } from '~/types'

interface Props {
  cards: Card[]
  canvasSettings: CanvasSettings
  styleSettings: StyleSettings
  zoom: number
  isPreviewMode: boolean
  selectedCardId: string | null
  title: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select-card': [cardId: string]
  'update-card': [cardId: string, updates: Partial<Card>]
  'delete-card': [cardId: string]
  'duplicate-card': [cardId: string]
  'reorder-cards': [cards: Card[]]
}>()

const canvasRef = ref<InstanceType<typeof WysiwygCanvas>>()

// Methods
function handleSelectCard(cardId: string) {
  emit('select-card', cardId)
}

function handleUpdateCard(cardId: string, updates: Partial<Card>) {
  emit('update-card', cardId, updates)
}

function handleDeleteCard(cardId: string) {
  emit('delete-card', cardId)
}

function handleDuplicateCard(cardId: string) {
  emit('duplicate-card', cardId)
}

function handleReorderCards(cards: Card[]) {
  emit('reorder-cards', cards)
}

// Expose canvas ref for PDF export
defineExpose({
  canvasRef,
})
</script>

<style scoped>
.canvas-container {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: #f9fafb;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  min-width: fit-content;
}

/* Preview mode - centered without scroll */
.canvas-container.preview-mode {
  align-items: center;
  background: #e5e7eb;
}

/* Print styles */
@media print {
  .canvas-container {
    padding: 0;
    background: white;
    overflow: visible;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .canvas-container {
    scroll-behavior: auto;
  }
}
</style>
