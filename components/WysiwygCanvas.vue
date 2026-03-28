<template>
  <div
    ref="canvasRef"
    class="wysiwyg-canvas"
    :class="canvasClasses"
    :style="canvasStyle"
  >
    <!-- Chart Title -->
    <div
      class="canvas-title"
      :style="{ fontFamily: styleSettings.fontFamily }"
    >
      {{ title }}
    </div>

    <!-- Cards Grid -->
    <draggable
      v-model="localCards"
      :disabled="isPreviewMode"
      item-key="id"
      class="canvas-grid"
      :style="gridStyle"
      ghost-class="card-ghost"
      drag-class="card-dragging"
      @end="handleDragEnd"
    >
      <template #item="{ element: card }">
        <div
          class="canvas-card-wrapper"
          :class="{ 'selected': card.id === selectedCardId && !isPreviewMode }"
          @click="handleCardClick(card.id)"
        >
          <CanvasCard
            :card="card"
            :is-selected="card.id === selectedCardId"
            :is-preview-mode="isPreviewMode"
            :style-settings="styleSettings"
          />
        </div>
      </template>
    </draggable>

    <!-- Watermark (only in preview/export) -->
    <div v-if="isPreviewMode" class="canvas-watermark">
      Created with The Talking Chart
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
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

const canvasRef = ref<HTMLElement>()

// Computed
const canvasClasses = computed(() => ({
  'preview-mode': props.isPreviewMode,
}))

const canvasStyle = computed(() => ({
  transform: `scale(${props.zoom})`,
  transformOrigin: 'top left',
  fontFamily: props.styleSettings.fontFamily,
  backgroundColor: props.styleSettings.backgroundColor,
}))

const gridStyle = computed(() => {
  const { columns, cardGap, marginTop, marginBottom, marginLeft, marginRight } = props.canvasSettings
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${cardGap}mm`,
    padding: `${marginTop}mm ${marginRight}mm ${marginBottom}mm ${marginLeft}mm`,
  }
})

const localCards = computed({
  get: () => {
    const { columns, rows } = props.canvasSettings
    const maxCards = columns * rows
    return props.cards.slice(0, maxCards)
  },
  set: (value) => {
    emit('reorder-cards', value)
  },
})

// Methods
function handleCardClick(cardId: string) {
  if (!props.isPreviewMode) {
    emit('select-card', cardId)
  }
}

function handleDragEnd() {
  // Reorder is handled by v-model
}

// Expose canvas ref for PDF export
defineExpose({
  canvasRef,
})
</script>

<style scoped>
.wysiwyg-canvas {
  width: 1123px;  /* 297mm at 96 DPI */
  height: 794px; /* 210mm at 96 DPI */
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.canvas-title {
  text-align: center;
  font-size: 24pt;
  font-weight: 700;
  margin-bottom: 10mm;
  color: #111827;
}

.canvas-grid {
  display: grid;
  width: 100%;
  height: calc(100% - 40mm);
}

.canvas-card-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.canvas-card-wrapper:hover:not(.preview-mode) {
  background-color: rgba(0, 0, 0, 0.02);
}

.canvas-card-wrapper.selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Drag and drop styles */
.card-ghost {
  opacity: 0.5;
  background: #e5e7eb;
}

.card-dragging {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.canvas-watermark {
  position: absolute;
  bottom: 5mm;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 8pt;
  color: #9ca3af;
}

/* Print styles */
@media print {
  .wysiwyg-canvas {
    box-shadow: none;
  }
  
  .canvas-card-wrapper.selected {
    outline: none;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .canvas-card-wrapper {
    transition: none;
  }
}
</style>
