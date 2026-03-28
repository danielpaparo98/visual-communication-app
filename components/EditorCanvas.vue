<template>
  <div
    ref="canvasRef"
    class="editor-canvas"
    :class="canvasClasses"
    :style="canvasStyle"
    role="region"
    :aria-label="'Chart editor canvas'"
    tabindex="0"
    @keydown="handleCanvasKeydown"
  >
    <!-- Chart Title -->
    <div
      class="canvas-title"
      :style="{ fontFamily: styleSettings.fontFamily }"
      role="heading"
      :aria-level="1"
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
      :aria-label="'Draggable cards grid'"
    >
      <template #item="{ element: card }">
        <div
          class="canvas-card-wrapper"
          :class="{ 'selected': card.id === selectedCardId && !isPreviewMode }"
          @click="handleCardClick(card.id)"
          role="listitem"
        >
          <EditorCard
            :card="card"
            :is-selected="card.id === selectedCardId"
            :is-preview-mode="isPreviewMode"
            :style-settings="styleSettings"
            :custom-icons="customIcons"
            @update="handleCardUpdate"
            @delete="handleCardDelete"
            @duplicate="handleCardDuplicate"
            @icon-click="handleIconClick"
          />
        </div>
      </template>
    </draggable>

    <!-- Empty State (when no cards) -->
    <EmptyState
      v-if="localCards.length === 0 && !isPreviewMode"
      title="No cards yet"
      description="Add your first card to get started"
      action-label="Add Card"
      @action="handleAddCard"
    />

    <!-- Watermark (only in preview/export) -->
    <div
      v-if="isPreviewMode && watermark.enabled"
      class="canvas-watermark"
      role="contentinfo"
      :style="watermarkStyles"
    >
      {{ watermark.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import type { Card, CanvasSettings, StyleSettings, CustomIcon } from '~/types'
import EditorCard from '~/components/EditorCard.vue'
import EmptyState from '~/components/EmptyState.vue'
import { useExportStore } from '~/stores/export'

interface Props {
  cards: Card[]
  canvasSettings: CanvasSettings
  styleSettings: StyleSettings
  zoom: number
  isPreviewMode: boolean
  selectedCardId: string | null
  title: string
  customIcons?: CustomIcon[]
}

const props = withDefaults(defineProps<Props>(), {
  customIcons: () => [],
})

const emit = defineEmits<{
  'select-card': [cardId: string]
  'update-card': [cardId: string, updates: Partial<Card>]
  'delete-card': [cardId: string]
  'duplicate-card': [cardId: string]
  'reorder-cards': [cards: Card[]]
  'add-card': []
  'icon-click': [cardId: string]
}>()

const exportStore = useExportStore()
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

const watermark = computed(() => exportStore.watermark)

const watermarkStyles = computed(() => {
  const pos = watermark.value.position
  const baseStyle = {
    fontFamily: watermark.value.fontFamily,
    fontSize: `${watermark.value.fontSize}px`,
    fontWeight: watermark.value.fontWeight,
    color: watermark.value.color,
    opacity: watermark.value.opacity,
    margin: `${watermark.value.margin}px`,
  }

  const positionStyles: Record<string, Record<string, string>> = {
    'top-left': { top: '6mm', left: '6mm', right: 'auto', bottom: 'auto', transform: 'none' },
    'top-center': { top: '6mm', left: '50%', right: 'auto', bottom: 'auto', transform: 'translateX(-50%)' },
    'top-right': { top: '6mm', left: 'auto', right: '6mm', bottom: 'auto', transform: 'none' },
    'bottom-left': { top: 'auto', left: '6mm', right: 'auto', bottom: '6mm', transform: 'none' },
    'bottom-center': { top: 'auto', left: '50%', right: 'auto', bottom: '6mm', transform: 'translateX(-50%)' },
    'bottom-right': { top: 'auto', left: 'auto', right: '6mm', bottom: '6mm', transform: 'none' },
    'center': { top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' },
  }

  const rotation = watermark.value.rotation !== 0
    ? ` rotate(${watermark.value.rotation}deg)`
    : ''

  return {
    ...baseStyle,
    ...positionStyles[pos],
    transform: `${positionStyles[pos].transform}${rotation}`,
  }
})

// Methods
function handleCardClick(cardId: string) {
  if (!props.isPreviewMode) {
    emit('select-card', cardId)
  }
}

function handleCardUpdate(cardId: string, updates: Partial<Card>) {
  emit('update-card', cardId, updates)
}

function handleCardDelete(cardId: string) {
  emit('delete-card', cardId)
}

function handleCardDuplicate(cardId: string) {
  emit('duplicate-card', cardId)
}

function handleAddCard() {
  emit('add-card')
}

function handleIconClick(cardId: string) {
  emit('icon-click', cardId)
}

function handleDragEnd() {
  // Reorder is handled by v-model
}

function handleCanvasKeydown(event: KeyboardEvent) {
  // Keyboard shortcuts for canvas navigation
  const cards = props.cards
  const currentIndex = cards.findIndex(c => c.id === props.selectedCardId)
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (currentIndex < cards.length - 1) {
        emit('select-card', cards[currentIndex + 1].id)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (currentIndex > 0) {
        emit('select-card', cards[currentIndex - 1].id)
      }
      break
    case 'ArrowRight':
      event.preventDefault()
      if (currentIndex < cards.length - 1) {
        emit('select-card', cards[currentIndex + 1].id)
      }
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (currentIndex > 0) {
        emit('select-card', cards[currentIndex - 1].id)
      }
      break
    case 'Escape':
      // Deselect card
      emit('select-card', '')
      break
    case 'Delete':
    case 'Backspace':
      // Delete selected card
      if (props.selectedCardId && currentIndex >= 0) {
        event.preventDefault()
        emit('delete-card', props.selectedCardId)
      }
      break
    case 'Insert':
      event.preventDefault()
      emit('add-card')
      break
  }
}

// Expose canvas ref for PDF export
defineExpose({
  canvasRef,
})
</script>

<style scoped>
.editor-canvas {
  width: 1123px;  /* 297mm at 96 DPI */
  height: 794px; /* 210mm at 96 DPI */
  background: #ffffff;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  outline: none;
}

.editor-canvas:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.canvas-title {
  text-align: center;
  font-size: 26pt;
  font-weight: 700;
  margin-bottom: 12mm;
  color: #0f172a;
  line-height: 1.3;
  padding: 0 20mm;
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
  pointer-events: none;
}

/* Print styles */
@media print {
  .editor-canvas {
    box-shadow: none;
  }
  
  .canvas-card-wrapper.selected {
    outline: none;
    background-color: transparent;
  }
  
  .canvas-watermark {
    display: block;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .canvas-card-wrapper,
  .card-dragging {
    transition: none;
    transform: none;
  }
}
</style>
