<template>
  <Teleport to="body">
    <Transition name="detail-fade" appear>
      <div
        v-if="open && icon"
        class="fixed inset-0 z-50"
        role="presentation"
        @click="close"
      >
        <div
          ref="popoverRef"
          class="absolute w-64 rounded-2xl bg-white shadow-xl border border-slate-200 p-4"
          :style="popoverStyle"
          role="dialog"
          aria-modal="false"
          :aria-label="`Details for ${icon.alt}`"
          @click.stop
          @keydown.escape.stop="close"
        >
          <!-- Close affordance -->
          <button
            type="button"
            class="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
            aria-label="Close details"
            @click="close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>

          <!-- Large preview + title -->
          <div class="flex flex-col items-center text-center pt-1">
            <div class="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-3">
              <img
                :src="icon.src"
                :alt="icon.alt"
                class="w-full h-full object-contain"
              />
            </div>
            <h3 class="font-heading font-bold text-base text-slate-800 mb-0.5 break-words leading-tight">
              {{ icon.alt }}
            </h3>
            <p class="text-xs text-slate-500">{{ categoryLabel }}</p>
          </div>

          <!-- Keywords (chips, capped) -->
          <div
            v-if="icon.keywords.length"
            class="mt-3 flex flex-wrap gap-1 justify-center"
          >
            <span
              v-for="kw in displayedKeywords"
              :key="kw"
              class="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
            >
              {{ kw }}
            </span>
            <span
              v-if="extraKeywordCount > 0"
              class="text-[10px] px-1.5 py-0.5 rounded-full text-slate-400"
            >
              +{{ extraKeywordCount }}
            </span>
          </div>

          <!-- Actions -->
          <div class="mt-4 space-y-2">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-sm font-semibold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
              @click="emit('assign')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
              Assign to Slot
            </button>
            <div class="grid grid-cols-2 gap-2">
              <!-- Favourite toggle (built-in icons only) -->
              <button
                v-if="!icon.isCustom"
                type="button"
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
                :class="isFavorite
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                :aria-pressed="isFavorite"
                @click="emit('toggle-favorite')"
              >
                <span class="text-sm leading-none">{{ isFavorite ? '★' : '☆' }}</span>
                {{ isFavorite ? 'Favorited' : 'Favorite' }}
              </button>
              <!-- View Similar (full-width for custom icons) -->
              <button
                type="button"
                class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
                :class="icon.isCustom ? 'col-span-2' : ''"
                @click="emit('view-similar')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/>
                </svg>
                View Similar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Floating popover with extended information about a single icon.
 *
 * Anchored near its trigger element using a `DOMRect` captured at open time
 * — this avoids any `useElementBounding` polling and gives correct placement
 * on first paint. Click-outside (via the transparent full-viewport backdrop)
 * and Escape both close it. All actions (`assign`, `toggle-favorite`,
 * `view-similar`) are owned by the parent IconPicker so it can coordinate
 * tab switching and slot assignment.
 */

/**
 * Minimal icon shape this component renders. Mirrors the fields of the
 * picker's internal `PickableIcon` without coupling the two modules.
 */
interface DetailIcon {
  /** Stable icon id. */
  id: string
  /** Resolved image source (URL for built-in, data URL for custom). */
  src: string
  /** Display name / alt text. */
  alt: string
  /** Search keywords (may be empty for custom icons). */
  keywords: string[]
  /** True for user-uploaded icons (hides the Favourite toggle). */
  isCustom: boolean
}

const props = defineProps<{
  open: boolean
  icon: DetailIcon | null
  /** Display label of the icon's category (e.g. "Family"). */
  categoryLabel: string
  /** Whether the icon is currently in the user's favourites. */
  isFavorite: boolean
  /** Anchor rectangle of the trigger element, captured at open time. */
  anchorRect: DOMRect | null
}>()

const emit = defineEmits<{
  close: []
  assign: []
  'toggle-favorite': []
  'view-similar': []
}>()

// ── Layout constants ───────────────────────────────────────────────────────

/** Popover width in px — matches Tailwind's `w-64`. */
const POPOVER_WIDTH = 256
/** Worst-case popover height used for viewport edge clamping. */
const POPOVER_MAX_HEIGHT = 360
/** Padding kept between the popover and the viewport edge. */
const VIEWPORT_PADDING = 12
/** Gap between the anchor's edge and the popover. */
const ANCHOR_GAP = 8
/** Max keyword chips rendered before collapsing into "+N". */
const MAX_KEYWORDS = 4

// ── Computed view state ────────────────────────────────────────────────────

const displayedKeywords = computed(() =>
  props.icon ? props.icon.keywords.slice(0, MAX_KEYWORDS) : [],
)

const extraKeywordCount = computed(() =>
  props.icon ? Math.max(0, props.icon.keywords.length - MAX_KEYWORDS) : 0,
)

/**
 * Compute absolute pixel coordinates for the popover based on the anchor
 * rect. Defaults to below-left of the anchor; flips above when there isn't
 * enough room below; always clamps horizontally inside the viewport.
 *
 * Returns an empty style object on the server so no invalid inline style is
 * sent over the wire — the popover is only ever opened via a client-side
 * click. Every branch mutates and returns the same `Record<string, string>`
 * so the computed's inferred type stays uniform.
 */
const popoverStyle = computed<Record<string, string>>(() => {
  const result: Record<string, string> = {}
  if (!import.meta.client) return result
  const rect = props.anchorRect
  if (!rect) {
    result.visibility = 'hidden'
    return result
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Default position: below the anchor, left-aligned with it.
  let left = rect.left
  let top = rect.bottom + ANCHOR_GAP

  // Horizontal: clamp to the right edge, then never past the left edge.
  if (left + POPOVER_WIDTH > viewportWidth - VIEWPORT_PADDING) {
    left = viewportWidth - POPOVER_WIDTH - VIEWPORT_PADDING
  }
  if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING

  // Vertical: flip to above when below would overflow.
  const wouldOverflowBelow =
    top + POPOVER_MAX_HEIGHT > viewportHeight - VIEWPORT_PADDING
  const roomAbove =
    rect.top - POPOVER_MAX_HEIGHT - ANCHOR_GAP > VIEWPORT_PADDING
  if (wouldOverflowBelow && roomAbove) {
    top = rect.top - POPOVER_MAX_HEIGHT - ANCHOR_GAP
  } else if (wouldOverflowBelow) {
    // No room either way — clamp to the viewport bottom.
    top = Math.max(
      VIEWPORT_PADDING,
      viewportHeight - POPOVER_MAX_HEIGHT - VIEWPORT_PADDING,
    )
  }

  result.left = `${Math.round(left)}px`
  result.top = `${Math.round(top)}px`
  return result
})

// ── Close handling ─────────────────────────────────────────────────────────

function close() {
  emit('close')
}

/**
 * Global Escape listener. Always registered for the component lifetime so
 * the popover can be dismissed even when focus is still on the trigger
 * inside the picker (a popover, not a modal — focus isn't moved in).
 */
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<style scoped>
/* Popover fade + slight lift on enter; reverse on leave. */
.detail-fade-enter-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}
.detail-fade-leave-active {
  transition: opacity 0.14s ease-in, transform 0.14s ease-in;
}
.detail-fade-enter-from {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}
.detail-fade-leave-to {
  opacity: 0;
  transform: translateY(2px) scale(0.98);
}
</style>
