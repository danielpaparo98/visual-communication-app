<template>
  <div
    ref="canvasWrapperRef"
    class="canvas-wrapper w-full rounded-2xl bg-slate-50/70 p-3 sm:p-4 md:p-6 flex justify-center overflow-auto scroll-smooth"
    :style="{ cursor, touchAction: touchActionStyle }"
  >
    <!--
      A4 landscape canvas page.
      Uses CSS aspect-ratio to maintain exact 1.414:1 (297mm × 210mm) proportion.
      The zoom transform is applied here — CSS scale is smooth and causes no layout reflow.
    -->
    <div
      ref="canvasPageRef"
      class="canvas-page w-full rounded-xl shadow-lg flex flex-col"
      :class="previewMode ? 'max-w-[960px]' : 'max-w-[780px]'"
      :style="pageStyle"
    >
      <!-- ── Title (editable in edit mode) ── -->
      <template v-if="!previewMode">
        <input
          v-if="editingTitle"
          v-model="titleInputValue"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          @keyup.escape="cancelTitleEdit"
          @click.stop
          type="text"
          maxlength="60"
          class="canvas-title w-full text-center font-heading font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 bg-transparent border-b-2 border-primary-400 outline-none px-2 py-0"
          aria-label="Chart title"
        />
        <button
          v-else
          @click.stop="startEditingTitle"
          class="canvas-title w-full text-center font-heading font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 truncate px-1 hover:text-primary-600 transition-colors cursor-text"
          :aria-label="`Edit chart title: ${title}`"
        >
          {{ title }}
        </button>
      </template>
      <h1
        v-else
        class="canvas-title text-center font-heading font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 truncate px-1"
      >
        {{ title }}
      </h1>

      <!-- ── Print-only footer (hidden on screen, visible in @media print) ── -->
      <div class="print-footer">TheTalkingChart.com</div>

      <!-- ── Loading skeleton (dynamic count from preset) ── -->
      <template v-if="loading">
        <div
          class="flex-1 grid auto-rows-fr canvas-grid"
          :style="{
            gridTemplateColumns: `repeat(${preset.columns}, 1fr)`,
            gap: `${props.cardGap ?? 5}mm`,
          }"
        >
          <div
            v-for="i in preset.totalSlots"
            :key="`skel-${i}`"
            class="border-2 border-dashed border-slate-200 rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-2 animate-pulse"
            aria-hidden="true"
          >
            <div class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-slate-100" />
            <div class="w-10 sm:w-12 h-2 sm:h-2.5 md:h-3 rounded bg-slate-100" />
          </div>
        </div>
      </template>

      <!-- ── Cards grid (dynamic columns from preset) ── -->
      <template v-else>
        <Transition name="mode-switch" mode="out-in">
          <div
            :key="previewMode ? 'preview' : 'edit'"
            class="flex-1 grid auto-rows-fr canvas-grid"
            :style="{
              gridTemplateColumns: `repeat(${preset.columns}, 1fr)`,
              gap: `${props.cardGap ?? 5}mm`,
            }"
          >
            <div
              v-for="(slot, i) in displaySlots"
              :key="i"
              :data-card-index="i"
              :draggable="!previewMode"
              :class="cardClasses(slot, i)"
              :style="cardStyle(slot, i)"
              :role="previewMode ? undefined : 'button'"
              :tabindex="previewMode ? undefined : 0"
              :aria-label="previewMode ? undefined : getCardAriaLabel(slot, i)"
              @click="onCardClick(i)"
              @keyup.enter="onCardClick(i)"
              @keyup.space.prevent="onCardClick(i)"
              @dragstart="onCardDragStart(i, $event)"
              @dragover="onCardDragOver(i, $event)"
              @drop="onCardDrop(i, $event)"
              @dragend="onDragEnd()"
            >
              <!-- ── Preview mode ── -->
              <template v-if="previewMode">
                <template v-if="slot.icon">
                  <img
                    :src="slotIconSrc(slot.icon.filename)"
                    :alt="slot.icon.alt"
                    class="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 object-contain pointer-events-none drop-shadow-sm"
                    loading="lazy"
                  />
                  <span class="text-[9px] sm:text-[11px] md:text-xs font-semibold text-center truncate max-w-full leading-tight px-0.5">
                    {{ slot.label || slot.icon.alt }}
                  </span>
                </template>
                <!-- Empty slot — blank white cell in preview -->
              </template>

              <!-- ── Edit mode ── -->
              <template v-else>
                <template v-if="!slot.icon">
                  <div class="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-slate-50 flex items-center justify-center ring-1 ring-slate-200">
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                    </svg>
                  </div>
                  <span class="text-[9px] sm:text-[11px] md:text-xs font-medium truncate max-w-full leading-tight text-muted">
                    Add icon
                  </span>
                </template>
                <template v-else>
                  <img
                    :src="slotIconSrc(slot.icon.filename)"
                    :alt="slot.icon.alt"
                    class="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 object-contain pointer-events-none drop-shadow-sm"
                    loading="lazy"
                  />
                  <!-- Inline label editor (active card only) -->
                  <input
                    v-if="editingLabelIndex === i"
                    :data-label-input="i"
                    :value="labelInputValue"
                    @input="labelInputValue = ($event.target as HTMLInputElement).value"
                    @blur="saveLabelEdit(i)"
                    @keyup.enter="saveLabelEdit(i)"
                    @keyup.escape="cancelLabelEdit()"
                    @click.stop
                    type="text"
                    maxlength="30"
                    class="w-full text-[9px] sm:text-[11px] md:text-xs font-semibold text-center bg-white border border-primary-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary-400"
                    :placeholder="slot.icon.alt"
                    :aria-label="`Label for slot ${i + 1}`"
                  />
                  <button
                    v-else
                    @click.stop="startEditingLabel(i, slot.label || '')"
                    class="text-[9px] sm:text-[11px] md:text-xs font-semibold text-center truncate max-w-full leading-tight px-0.5 hover:text-primary-600 transition-colors min-h-[24px]"
                    :title="`Edit label: ${slot.label || slot.icon.alt}`"
                    :aria-label="`Edit label for slot ${i + 1}`"
                  >
                    {{ slot.label || slot.icon.alt }}
                  </button>
                </template>

                <!-- ── Style paintbrush button (visible only on selected card) ── -->
                <button
                  v-if="!previewMode && props.activeIndex === i"
                  class="card-style-btn absolute top-1 right-1 z-20 min-h-[44px] min-w-[44px] h-11 w-11 flex items-center justify-center rounded-lg bg-white/90 shadow-sm border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all duration-150 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  :class="{ '!opacity-100': styleCardIndex === i || (isTouchDevice && props.activeIndex === i) }"
                  :title="hasCustomStyle(slot) ? 'Edit card style' : 'Customise card style'"
                  :aria-label="`Style settings for slot ${i + 1}`"
                  @click.stop="openStylePicker(i)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 0 0-3-3Z" />
                    <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
                    <path d="M14.5 11.5 18 15" />
                  </svg>
                </button>
              </template>

              <!-- ── Custom style indicator dot (top-left corner) ── -->
              <div
                v-if="hasCustomStyle(slot)"
                class="card-style-indicator absolute top-0.5 left-0.5 z-10 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/60 shadow-sm"
                :style="{ backgroundColor: slot.style?.backgroundColor || 'transparent' }"
                title="This card has custom colours"
                aria-hidden="true"
              />

              <!-- ── Multi-select checkmark badge (top-right corner) ── -->
              <div
                v-if="!previewMode && isMultiSelected(i)"
                class="multi-check-badge absolute -top-1.5 -right-1.5 z-30 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white"
                aria-hidden="true"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </div>

    <!-- ── Card style picker popover ── -->
    <CardStylePicker
      :show="styleCardIndex !== null && !previewMode"
      :background="styleCardIndex !== null ? displaySlots[styleCardIndex]?.style?.backgroundColor : undefined"
      :border-color="styleCardIndex !== null ? displaySlots[styleCardIndex]?.style?.borderColor : undefined"
      :trigger-selector="styleCardSelector"
      @update:background="onUpdateBackgroundColor"
      @update:border-color="onUpdateBorderColor"
      @clear="onClearCardStyle"
      @close="closeStylePicker"
    />
  </div>
</template>

<script setup lang="ts">
import { iconUrl } from '~/utils/iconLoader'
import { getPreset } from '~/utils/layoutPresets'
import type { ChartSlot } from '~/types/chart'
import type { ColorTheme } from '~/utils/colorThemes'
import type { ChartSlotStyle } from '~/types/chart'
import { useCanvasPan } from '~/composables/useCanvasPan'
import { useTouchGestures } from '~/composables/useTouchGestures'
import { useDragAndDrop } from '~/composables/useDragAndDrop'
import CardStylePicker from '~/components/CardStylePicker.vue'

const props = defineProps<{
  slots: ChartSlot[]
  title: string
  layoutPreset: string
  theme?: ColorTheme
  activeIndex?: number | null
  /**
   * Indices of slots included in the current multi-selection (batch mode).
   * Distinct from `activeIndex` (single-select) — in practice the page
   * clears `activeIndex` before entering multi-select so the two never
   * highlight the same card at once.
   */
  selectedSlots?: number[]
  loading?: boolean
  zoom?: number
  previewMode?: boolean
  headingFontFamily?: string
  bodyFontFamily?: string
  margin?: number
  cardGap?: number
}>()

const emit = defineEmits<{
  select: [index: number]
  'update:zoom': [value: number]
  'update:title': [value: string]
  'set-card-style': [index: number, style: ChartSlotStyle]
  'clear-card-style': [index: number]
  /** Emitted when the user reorders slots by dragging one onto another. */
  reorder: [from: number, to: number]
  /** Emitted when an icon dragged from IconPicker is dropped onto a slot. */
  'assign-icon-drop': [index: number, icon: { id: string; filename: string; alt: string; category: string }]
  /** Emitted when the user edits a card label inline. */
  'update-label': [index: number, label: string]
}>()

/** Template ref on the canvas-page element — exposed for parent Fit calculations. */
const canvasPageRef = ref<HTMLElement | null>(null)

/** Template ref on the canvas-wrapper — used by the pan composable for events. */
const canvasWrapperRef = ref<HTMLElement | null>(null)

/**
 * Writable zoom ref that syncs to the parent via `v-model:zoom`.
 * Reads from the prop and emits changes back to the parent.
 */
const localZoom = computed({
  get: () => props.zoom ?? 1.0,
  set: (val) => emit('update:zoom', val),
})

/** Pan & zoom behaviour for the canvas wrapper. */
const { isPanning, cursor } = useCanvasPan(canvasWrapperRef, localZoom)

// ── Touch interaction enhancements ────────────────────────────────────────
// Pinch-to-zoom lets tablet users zoom the A4 page with two fingers. Long-
// press is exposed by the composable for future context-menu use but isn't
// wired to cards yet.
const { isTouchDevice, setupPinchZoom } = useTouchGestures()

/**
 * `touch-action` for the canvas wrapper.
 * - `pan-x pan-y` by default → native one-finger scroll/pan still works AND
 *   the browser yields two-finger pinch gestures to our JS handler (because
 *   `pinch-zoom` is excluded from the list, our non-passive `touchmove` can
 *   `preventDefault()` and drive the zoom).
 * - `none` while actively mouse-panning (grab-scroll at zoom > 100 %) so the
 *   gesture never fights native scrolling.
 */
const touchActionStyle = computed(() => (isPanning.value ? 'none' : 'pan-x pan-y'))

/**
 * Pinch-to-zoom on the canvas wrapper. Converts the change in finger span
 * (pixels) into a zoom step clamped to the same 0.25–1.5 range used by the
 * Ctrl+Wheel zoom in {@link useCanvasPan}. Sensitivity (~0.005/px) lets a
 * single comfortable pinch sweep most of the range.
 */
watchEffect((onCleanup) => {
  const el = canvasWrapperRef.value
  if (!el) return
  const cleanup = setupPinchZoom(el, (delta) => {
    const next = Math.max(0.25, Math.min(1.5, localZoom.value + delta * 0.005))
    localZoom.value = next
  })
  onCleanup(cleanup)
})

/**
 * Resolve the rendered card element for a given slot index.
 *
 * Used by the parent (e.g. the floating toolbar) to read a card's on-screen
 * position. Returns `null` if the canvas isn't mounted yet or the index has
 * no corresponding card in the DOM.
 */
function getCardElement(index: number): HTMLElement | null {
  if (canvasPageRef.value === null) return null
  return canvasPageRef.value.querySelector<HTMLElement>(`[data-card-index="${index}"]`)
}

defineExpose({ canvasPageRef, getCardElement })

/**
 * Resolve the image source for a slot's icon.
 *
 * Built-in icons reference a filename served from the icon library (resolved
 * via `iconUrl`). Custom user-uploaded icons store a base64 data URL directly
 * in `filename`, which must be used verbatim as the `<img src>`.
 */
function slotIconSrc(filename: string): string {
  return filename.startsWith('data:') ? filename : iconUrl(filename)
}

/** Resolved preset object derived from the layoutPreset prop. */
const preset = computed(() => getPreset(props.layoutPreset))

/**
 * Slice/fill the slots array to match the preset's total slot count.
 *
 * - If the store has more slots than the preset allows, show only the
 *   first N (slot data is preserved in the store).
 * - If the store has fewer slots (edge case on first load), pad with
 *   empty slots so the grid renders correctly.
 */
const displaySlots = computed<ChartSlot[]>(() => {
  const total = preset.value.totalSlots
  if (props.slots.length >= total) {
    return props.slots.slice(0, total)
  }
  // Pad with empty slots if the store hasn't grown to match yet
  const padding: ChartSlot[] = Array.from(
    { length: total - props.slots.length },
    (): ChartSlot => ({ icon: null, label: '' }),
  )
  return [...props.slots, ...padding]
})

// ── Drag-and-drop reordering ─────────────────────────────────────────────
// The composable owns transient drag state (dragged / drop-target indices);
// the actual array move is delegated back to the parent via the `reorder`
// emit so the store controls history snapshot capture.

const {
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
} = useDragAndDrop(displaySlots, (from, to) => emit('reorder', from, to))

/**
 * Begin dragging a card. Suppressed in preview mode (cards are not
 * reorderable when the user is only viewing the printed result).
 */
function onCardDragStart(index: number, e: DragEvent) {
  if (props.previewMode) return
  onDragStart(index, e)
}

/**
 * Allow drops and update the drop-target highlight.
 *
 * External icon drags from {@link IconPicker} advertise a `text/icon-id`
 * data type; we still `preventDefault()` so the card accepts the icon drop,
 * but we don't drive the reorder highlight for those drags.
 */
function onCardDragOver(index: number, e: DragEvent) {
  if (props.previewMode) return
  const types = Array.from(e.dataTransfer?.types ?? [])
  if (types.includes('text/icon-id')) {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    return
  }
  onDragOver(index, e)
}

/**
 * Resolve a drop: either assign a dragged icon to the slot, or perform a
 * slot reorder. Only active in edit mode.
 */
function onCardDrop(index: number, e: DragEvent) {
  if (props.previewMode) return
  // Icon drop — assign the picked icon to this slot.
  const iconDataJson = e.dataTransfer?.getData('text/icon-data')
  if (iconDataJson) {
    e.preventDefault()
    try {
      const icon = JSON.parse(iconDataJson) as {
        id: string
        filename: string
        alt: string
        category: string
      }
      emit('assign-icon-drop', index, icon)
    } catch {
      // Ignore a malformed payload — treat as a non-drop.
    }
    onDragEnd()
    return
  }
  // Slot reorder drop.
  onDrop(index, e)
}

/**
 * Resolved theme object — falls back to a safe default when no theme is provided.
 */
const resolvedTheme = computed<ColorTheme>(() => {
  return props.theme ?? {
    id: 'fallback',
    name: 'Fallback',
    primary: '#3b82f6',
    background: '#ffffff',
    surface: '#ffffff',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b',
    headerBg: '#f8fafc',
  }
})

/**
 * Composite style for the canvas-page element.
 * Sets theme CSS custom properties plus the zoom transform.
 */
const pageStyle = computed(() => ({
  '--theme-bg': resolvedTheme.value.background,
  '--theme-surface': resolvedTheme.value.surface,
  '--theme-border': resolvedTheme.value.border,
  '--theme-border-light': resolvedTheme.value.borderLight,
  '--theme-text': resolvedTheme.value.text,
  '--theme-text-muted': resolvedTheme.value.textMuted,
  '--theme-primary': resolvedTheme.value.primary,
  '--canvas-heading-font': props.headingFontFamily ?? "'Outfit', sans-serif",
  '--canvas-body-font': props.bodyFontFamily ?? "'Inter', sans-serif",
  '--canvas-card-gap': `${props.cardGap ?? 5}mm`,
  'aspect-ratio': '1.414',
  padding: `${props.margin ?? 15}mm`,
  transform: `scale(${props.zoom ?? 1.0})`,
  transformOrigin: 'top center',
}))

// ── Style picker state ───────────────────────────────────────────────────

/** Index of the card currently being styled, or null when the picker is closed. */
const styleCardIndex = ref<number | null>(null)

/** Whether the canvas title is being edited inline. */
const editingTitle = ref(false)
const titleInputValue = ref('')

function startEditingTitle() {
  if (props.previewMode) return
  editingTitle.value = true
  titleInputValue.value = props.title
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('.canvas-title input, .canvas-title')
    input?.focus()
    input?.select()
  })
}

function saveTitle() {
  const trimmed = titleInputValue.value.trim()
  if (trimmed && trimmed !== props.title) {
    emit('update:title', trimmed)
  }
  editingTitle.value = false
}

function cancelTitleEdit() {
  editingTitle.value = false
}

/** Index of the card whose label is being edited inline, or null. */
const editingLabelIndex = ref<number | null>(null)
const labelInputValue = ref('')

function startEditingLabel(index: number, currentLabel: string) {
  editingLabelIndex.value = index
  labelInputValue.value = currentLabel
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(
      `[data-label-input="${index}"]`,
    )
    input?.focus()
    input?.select()
  })
}

function saveLabelEdit(index: number) {
  const trimmed = labelInputValue.value.trim()
  emit('update-label', index, trimmed)
  editingLabelIndex.value = null
}

function cancelLabelEdit() {
  editingLabelIndex.value = null
}

/**
 * CSS selector for the card that the style picker should anchor to.
 * Uses a data attribute set on each card div.
 */
const styleCardSelector = computed<string | undefined>(() => {
  if (styleCardIndex.value === null) return undefined
  return `[data-card-index="${styleCardIndex.value}"]`
})

function openStylePicker(index: number) {
  if (styleCardIndex.value === index) {
    closeStylePicker()
  } else {
    styleCardIndex.value = index
  }
}

function closeStylePicker() {
  styleCardIndex.value = null
}

function onUpdateBackgroundColor(value: string | undefined) {
  if (styleCardIndex.value === null) return
  const slot = displaySlots.value[styleCardIndex.value]
  const current = slot?.style?.backgroundColor
  if (value === current) return
  emit('set-card-style', styleCardIndex.value, {
    ...(slot?.style || {}),
    backgroundColor: value,
  })
}

function onUpdateBorderColor(value: string | undefined) {
  if (styleCardIndex.value === null) return
  const slot = displaySlots.value[styleCardIndex.value]
  const current = slot?.style?.borderColor
  if (value === current) return
  emit('set-card-style', styleCardIndex.value, {
    ...(slot?.style || {}),
    borderColor: value,
  })
}

function onClearCardStyle() {
  if (styleCardIndex.value === null) return
  emit('clear-card-style', styleCardIndex.value)
}

/**
 * Check whether a slot has any per-card style overrides.
 */
function hasCustomStyle(slot: ChartSlot): boolean {
  return !!slot.style?.backgroundColor || !!slot.style?.borderColor
}

/**
 * Whether slot `i` is part of the current multi-selection.
 * Returns `false` when no `selectedSlots` prop is supplied.
 */
function isMultiSelected(i: number): boolean {
  return props.selectedSlots?.includes(i) ?? false
}

// ── Per-card style computation ───────────────────────────────────────────

/**
 * Per-card inline style for background and border colours.
 *
 * Merges theme defaults with per-card style overrides. Also sets
 * `--card-bg` and `--card-border` CSS custom properties so print
 * styles can use them with `var()` fallbacks.
 */
function cardStyle(slot: ChartSlot, i: number): Record<string, string> {
  const t = resolvedTheme.value

  let bg: string
  let border: string

  if (props.previewMode) {
    // Preview mode: filled cards get a subtle border and white surface
    if (!slot.icon) return { background: 'transparent', border: 'none', '--card-bg': 'transparent', '--card-border': 'transparent' }
    bg = t.surface
    border = t.border
  } else {
    // Edit mode
    const isSelected = props.activeIndex === i
    if (!slot.icon) {
      // Empty card — dashed border, light background
      bg = t.surface
      border = isSelected ? t.primary : t.borderLight
    } else {
      // Filled card
      bg = t.surface
      border = isSelected ? t.primary : t.border
    }
  }

  // ── Apply per-card style overrides on top of theme defaults ──
  if (slot.style?.backgroundColor) {
    bg = slot.style.backgroundColor
  }
  if (slot.style?.borderColor) {
    border = slot.style.borderColor
  }

  return {
    backgroundColor: bg,
    borderColor: border,
    // CSS custom properties for print-style fallback support
    '--card-bg': bg,
    '--card-border': border,
  }
}

/**
 * Build a descriptive aria-label for each card based on its state.
 */
function getCardAriaLabel(slot: ChartSlot, index: number): string {
  const selected = isMultiSelected(index)
  const prefix = selected ? 'Selected. ' : ''
  if (!slot.icon) return `${prefix}Slot ${index + 1}, empty. Press to select.`
  const displayLabel = slot.label || slot.icon.alt
  return `${prefix}Slot ${index + 1}: ${slot.icon.alt}. Label: ${displayLabel}.`
}

/**
 * Compute CSS classes for a card based on its state and current mode.
 */
function cardClasses(slot: ChartSlot, i: number): string {
  const base = 'canvas-card rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 md:p-2.5 relative overflow-visible group'

  if (props.previewMode) {
    if (!slot.icon) {
      return `${base} canvas-card--empty` // Blank cell — no border or background
    }
    return `${base} canvas-card--filled` // Filled card — colour from inline style
  }

  // ── Edit mode ──
  const empty = !slot.icon
  const isMulti = isMultiSelected(i)
  const stateClasses = empty
    ? 'border-2 border-dashed hover:shadow-sm'
    : 'border-2 border-solid hover:shadow-sm'
  // Single-select ring (theme primary) takes precedence; in practice the
  // page clears `activeIndex` before entering multi-select, so the two
  // never coexist on the same card. The `canvas-card--multi` modifier sets
  // a distinct fixed-blue ring colour (see scoped styles).
  const selectionClass = props.activeIndex === i
    ? 'ring-2 ring-offset-1'
    : isMulti
      ? 'ring-2 ring-offset-1 canvas-card--multi'
      : ''

  // ── Drag-and-drop visual feedback ──
  // The dragged card dims to indicate it's "in flight"; the card under the
  // pointer gets a dashed primary outline as the drop target. Both only apply
  // in edit mode (the only mode where dragging is enabled).
  const dragClasses =
    draggedIndex.value === i
      ? 'opacity-50 canvas-card--dragging'
      : dragOverIndex.value === i
        ? 'canvas-card--drag-over'
        : ''

  return `canvas-card ${base} transition-all duration-150 cursor-pointer select-none ${stateClasses} ${selectionClass} ${dragClasses}`
}

/** Handle card click — only emits in edit mode. */
function onCardClick(index: number) {
  if (!props.previewMode) {
    // Close style picker when selecting a different card
    if (styleCardIndex.value !== null && styleCardIndex.value !== index) {
      closeStylePicker()
    }
    emit('select', index)
  }
}
</script>

<style scoped>
/* ── Theme-aware colour overrides ──────────────────────────────────────
   CSS custom properties are set on .canvas-page via the `pageStyle` computed.
   These rules override the (removed) Tailwind colour utility classes so the
   canvas picks up the active theme at runtime.
   ------------------------------------------------------------------- */

/* Page-level background and border */
.canvas-page {
  background-color: var(--theme-bg, #ffffff);
  border: 1px solid var(--theme-border, #e2e8f0);
}

/* Title colour + heading font */
.canvas-title {
  color: var(--theme-text, #1e293b);
  font-family: var(--canvas-heading-font, 'Outfit', sans-serif);
}

/* Card colours — border, background, text inherit from the theme */
/* Body font applied to all card content (labels, icons, hints) */
.canvas-card {
  color: var(--theme-text, #1e293b);
  background-color: var(--theme-surface, #ffffff);
  font-family: var(--canvas-body-font, 'Inter', sans-serif);
}

/* Muted / hint text — e.g. "Add icon" labels, placeholder icons */
.canvas-card .text-muted {
  color: var(--theme-text-muted, #94a3b8);
}

/* Hover: filled cards get a slightly darker border */
.canvas-card.border-solid:hover {
  border-color: var(--theme-text-muted, #94a3b8);
}

/* Hover: empty cards get the primary accent border */
.canvas-card.border-dashed:hover {
  border-color: var(--theme-primary, #3b82f6);
  background-color: color-mix(in srgb, var(--theme-primary, #3b82f6) 8%, transparent);
}

/* Ring colour for selected card (edit mode) */
.canvas-card.ring-2 {
  --tw-ring-color: var(--theme-primary, #3b82f6);
}

/* Multi-select ring colour — a distinct, fixed blue that is independent of
   the active theme, so batch-selected cards are always recognisable. */
.canvas-card.canvas-card--multi {
  --tw-ring-color: oklch(0.55 0.2 262);
}

/* ── Drag-and-drop feedback ──
   The card being dragged shows a "grabbing" cursor while in flight; the
   drop target gets a dashed primary outline + tinted background. Outline is
   used (not border) so it doesn't shift the card's layout or fight the
   existing selection ring. */
.canvas-card--dragging {
  cursor: grabbing;
}

.canvas-card--drag-over {
  outline: 2px dashed var(--theme-primary, #3b82f6);
  outline-offset: 2px;
  background-color: color-mix(in srgb, var(--theme-primary, #3b82f6) 12%, transparent);
}

/* ── Print-only footer (hidden on screen) ── */
.print-footer {
  display: none;
}

/* ── Print styles ─────────────────────────────────────────────────────
   These @media print rules make the canvas render identically in print
   to how it appears on screen in preview mode.
   Physical units (pt) ensure consistent output across printers & drivers.
   Per-card style overrides are respected via --card-bg and --card-border
   CSS custom properties set inline on each card.
   ------------------------------------------------------------------- */
@media print {
  /* Wrapper — strip flex centering, backgrounds, padding, rounded corners */
  .canvas-wrapper {
    display: block !important;
    background: transparent !important;
    border-radius: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    flex: none !important;
  }

  /* Page — strip shadow, border, rounded corners, max-width, zoom transform */
  .canvas-page {
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    max-width: none !important;
    transform: none !important;
    width: 100% !important;
    padding: 0 !important;
  }

  /* Title — larger, print-friendly size with physical units */
  .canvas-title {
    font-size: 22pt !important;
    line-height: 1.2 !important;
    margin-bottom: 12pt !important;
    color: oklch(0.18 0.05 250) !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    padding: 0 !important;
  }

  /* Cards grid — force 8pt gap in print */
  .canvas-page > div:where(.grid) {
    gap: 8pt !important;
  }

  /* Card base — shared by filled and empty */
  .canvas-card {
    border-radius: 6pt !important;
    padding: 6pt !important;
    min-height: 85pt !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    gap: 3pt !important;
    box-shadow: none !important;
    transition: none !important;
    animation: none !important;
  }

  /* Filled cards — respects per-card overrides via CSS custom properties */
  .canvas-card--filled {
    border: 2pt solid var(--card-border, oklch(0.82 0.04 250)) !important;
    background: var(--card-bg, white) !important;
  }

  /* Empty cards — dashed border, respects per-card overrides */
  .canvas-card--empty {
    border: 2pt dashed var(--card-border, oklch(0.82 0.04 250)) !important;
    background: var(--card-bg, oklch(0.99 0.005 250)) !important;
  }

  /* Card images — larger, print-friendly size */
  .canvas-card img {
    width: 44pt !important;
    height: 44pt !important;
    object-fit: contain !important;
    margin-bottom: 3pt !important;
    filter: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Card labels — physical units, crisp B&W text */
  .canvas-card span {
    font-size: 9pt !important;
    line-height: 1.2 !important;
    font-family: var(--canvas-body-font, 'Inter', sans-serif) !important;
    font-weight: 700 !important;
    color: oklch(0.18 0.05 250) !important;
    text-align: center !important;
    word-break: break-word !important;
    max-width: 100% !important;
    white-space: normal !important;
    padding: 0 !important;
  }

  /* Style indicator dot — hidden in print */
  .card-style-indicator {
    display: none !important;
  }

  /* Style paintbrush button — hidden in print */
  .card-style-btn {
    display: none !important;
  }

  /* Multi-select checkmark badge — hidden in print */
  .multi-check-badge {
    display: none !important;
  }

  /* Print footer — fixed bottom-right, only visible in print */
  .print-footer {
    display: block !important;
    position: fixed;
    bottom: 10pt;
    right: 12pt;
    font-family: var(--canvas-heading-font, 'Outfit', sans-serif) !important;
    font-size: 7.5pt !important;
    font-weight: 700 !important;
    color: oklch(0.71 0.05 250) !important;
    z-index: 9999;
  }
}
</style>
