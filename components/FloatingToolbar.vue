<template>
  <Teleport to="body">
    <Transition name="floating-toolbar">
      <div
        v-if="show"
        ref="toolbarRef"
        class="floating-toolbar fixed z-[9000] flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-sm no-print"
        :style="toolbarStyle"
        role="toolbar"
        aria-label="Quick actions for the selected card"
      >
        <!-- Undo -->
        <button type="button" :class="btnClass" title="Undo last change" aria-label="Undo last change" :disabled="!canUndo" @click.stop="$emit('undo')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 14 4 9 9 4" />
            <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
        </button>

        <!-- Redo -->
        <button type="button" :class="btnClass" title="Redo last change" aria-label="Redo last change" :disabled="!canRedo" @click.stop="$emit('redo')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 14 20 9 15 4" />
            <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
          </svg>
        </button>

        <span class="mx-0.5 h-5 w-px shrink-0 bg-slate-200" aria-hidden="true" />

        <!-- Clear slot -->
        <button type="button" :class="btnClass" title="Clear icon from selected slot" aria-label="Clear icon from selected slot" :disabled="!canClear" @click.stop="$emit('clear')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>

        <span class="mx-0.5 h-5 w-px shrink-0 bg-slate-200" aria-hidden="true" />

        <!-- Copy slot -->
        <button type="button" :class="btnClass" title="Copy selected slot" aria-label="Copy selected slot" @click.stop="$emit('copy')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>

        <!-- Paste slot -->
        <button type="button" :class="btnClass" title="Paste copied slot" aria-label="Paste copied slot" :disabled="!canPaste" @click.stop="$emit('paste')">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * FloatingToolbar — a small quick-actions toolbar that anchors itself to the
 * currently selected chart card.
 *
 * Buttons emit semantic events (`undo`, `redo`, `clear`, `copy`, `paste`);
 * the parent page wires them to the chart/history stores and the toast
 * system. This keeps the toolbar a presentational, store-agnostic component
 * (mirroring the {@link CardStylePicker} pattern).
 *
 * Positioning mirrors {@link CardStylePicker}: the component is teleported to
 * `<body>` and positioned `fixed`, anchored to a trigger element resolved via
 * the {@link triggerSelector} prop. It centres horizontally on the card,
 * floats above it by default, and flips below when the card sits too close to
 * the top edge — always clamped within the viewport. The toolbar follows the
 * card on scroll (captured, so nested scroll containers are covered) and
 * resize, repositioning on a `requestAnimationFrame` throttle.
 */

const props = defineProps<{
  /** Whether the toolbar should be visible. */
  show: boolean
  /**
   * CSS selector resolving the anchor card element (e.g.
   * `[data-card-index="3"]`). When undefined the toolbar hides off-screen.
   */
  triggerSelector?: string
  /** Enables the Undo button. */
  canUndo?: boolean
  /** Enables the Redo button. */
  canRedo?: boolean
  /** Enables the Clear button (the active slot has an icon to remove). */
  canClear?: boolean
  /** Enables the Paste button (the clipboard holds slot data). */
  canPaste?: boolean
}>()

defineEmits<{
  undo: []
  redo: []
  clear: []
  copy: []
  paste: []
}>()

/** Shared classes for every toolbar button — keeps the five actions visually consistent. */
const btnClass =
  'flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 ' +
  'transition-colors duration-150 ' +
  'hover:bg-slate-100 hover:text-slate-900 ' +
  'focus-visible:bg-primary-50 focus-visible:text-primary-700 ' +
  'disabled:pointer-events-none disabled:opacity-40'

/** The rendered toolbar element — used to measure its size for positioning. */
const toolbarRef = ref<HTMLElement | null>(null)

/**
 * Inline position style. While hidden or before the anchor resolves, the
 * toolbar is parked off-screen (`left: -9999px`) so it never flashes at 0,0.
 */
const toolbarStyle = ref<Record<string, string>>({
  top: '0px',
  left: '-9999px',
})

/** Vertical gap between the toolbar and the card edge, in px. */
const ANCHOR_GAP = 10
/** Minimum distance kept from any viewport edge, in px. */
const EDGE_MARGIN = 8

/**
 * Recompute the toolbar position relative to the anchor card.
 *
 * Measures the live toolbar element when available; falls back to sensible
 * estimates on the very first paint (before layout). Centres horizontally on
 * the card, prefers floating above it, and flips below when there isn't room
 * above — always clamped within the viewport.
 */
function updatePosition(): void {
  // Park off-screen when there's nothing to anchor to.
  if (!props.show || !props.triggerSelector) {
    toolbarStyle.value = { top: '0px', left: '-9999px' }
    return
  }

  const trigger = document.querySelector(props.triggerSelector) as HTMLElement | null
  if (!trigger) {
    toolbarStyle.value = { top: '0px', left: '-9999px' }
    return
  }

  const rect = trigger.getBoundingClientRect()

  // Measure the rendered toolbar; fall back to an estimate before first layout.
  const tbW = toolbarRef.value?.offsetWidth ?? 264
  const tbH = toolbarRef.value?.offsetHeight ?? 40

  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  // ── Horizontal: centre on the card, clamped to the viewport ──
  let left = rect.left + rect.width / 2 - tbW / 2
  left = Math.max(EDGE_MARGIN, Math.min(left, viewportW - tbW - EDGE_MARGIN))

  // ── Vertical: prefer above the card; flip below when near the top edge ──
  const spaceAbove = rect.top
  const spaceBelow = viewportH - rect.bottom
  const roomAbove = spaceAbove >= tbH + ANCHOR_GAP
  const roomBelow = spaceBelow >= tbH + ANCHOR_GAP
  let top: number
  if (roomAbove || !roomBelow) {
    // Above — default placement, also used when below doesn't fit either.
    top = rect.top - tbH - ANCHOR_GAP
  } else {
    // Below — card is too close to the top edge.
    top = rect.bottom + ANCHOR_GAP
  }
  // Clamp into the viewport so it never escapes a very short window.
  top = Math.max(EDGE_MARGIN, Math.min(top, viewportH - tbH - EDGE_MARGIN))

  toolbarStyle.value = {
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
  }
}

// ── Reposition throttling ────────────────────────────────────────────────
// Scroll/resize fire many times; coalesce them into a single rAF so we never
// lay out more than once per frame.

let rafId: number | null = null

function scheduleUpdate(): void {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updatePosition()
  })
}

// Reposition whenever visibility or the anchor target changes.
watch(
  () => [props.show, props.triggerSelector] as const,
  () => {
    if (props.show) nextTick(updatePosition)
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('resize', scheduleUpdate)
  // `capture: true` so we also catch scrolls inside nested overflow containers
  // (e.g. the canvas wrapper) that don't bubble to window.
  window.addEventListener('scroll', scheduleUpdate, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate, true)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* ── Fade + lift transition (< 400ms, transform/opacity only) ── */
.floating-toolbar-enter-active,
.floating-toolbar-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.floating-toolbar-enter-from,
.floating-toolbar-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Hidden in print (reinforces the `no-print` utility). */
@media print {
  .floating-toolbar {
    display: none !important;
  }
}
</style>
