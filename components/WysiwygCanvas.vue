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
  background: #ffffff;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.canvas-title {
  text-align: center;
  font-size: 26pt;
  font-weight: 700;
  margin-bottom: 12mm;
  color: #0f172a;
  line-height: 1.3;
}

.canvas-grid {
  display: grid;
  width: 100%;
  height: calc(100% - 45mm);
}

.canvas-card-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
  padding: 2px;
}

.canvas-card-wrapper:hover:not(.preview-mode) {
  background-color: rgba(15, 23, 42, 0.03);
}

.canvas-card-wrapper.selected {
  outline: 2px solid #3b82f6;
  outline-offset: 3px;
  background-color: rgba(59, 130, 246, 0.04);
}

/* Drag and drop styles */
.card-ghost {
  opacity: 0.4;
  background: #f1f5f9;
}

.card-dragging {
  opacity: 1;
  transform: scale(1.02);
  box-shadow: 0 20px 40px -4px rgba(0, 0, 0, 0.15);
}

.canvas-watermark {
  position: absolute;
  bottom: 6mm;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 9pt;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* Print styles */
@media print {
  .wysiwyg-canvas {
    box-shadow: none;
  }
  
  .canvas-card-wrapper.selected {
    outline: none;
    background-color: transparent;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .canvas-card-wrapper {
    transition: none;
  }
  
  .card-dragging {
    transform: none;
  }
}
</style>
