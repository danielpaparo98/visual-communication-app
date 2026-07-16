<template>
  <Teleport to="body">
    <!-- ── Backdrop (click to close) ── -->
    <Transition name="cs-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm no-print"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <!-- ── Modal ── -->
    <Transition name="cs-modal">
      <div
        v-if="modelValue"
        ref="dialogRef"
        class="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 no-print"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabindex="-1"
      >
        <!--
          Escape is handled by the document-level `onKeydown` listener below
          (which also stops propagation), so no @keydown.escape is needed here.

          The outer flex container is transparent to pointer events so clicks
          on the surrounding empty space fall through to the backdrop (closing
          the modal). Only the card itself captures clicks.
        -->
        <div
          class="cs-card pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          @click.stop
        >
          <!-- ── Header ── -->
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 shrink-0">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
                </svg>
              </span>
              <div class="min-w-0">
                <h2 class="font-heading font-bold text-lg text-slate-800 leading-tight truncate">
                  Keyboard shortcuts
                </h2>
                <p class="text-xs text-slate-400 leading-tight truncate">
                  Quick reference for the chart editor.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Close keyboard shortcuts"
              @click="close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <!-- ── Shortcut groups ── -->
          <div class="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-5">
            <section v-for="group in groups" :key="group.title">
              <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {{ group.title }}
              </h3>
              <ul class="space-y-1.5">
                <li
                  v-for="item in group.items"
                  :key="item.label"
                  class="flex items-center justify-between gap-3"
                >
                  <span class="text-sm text-slate-600">{{ item.label }}</span>
                  <span class="flex items-center gap-1 shrink-0">
                    <kbd
                      v-for="key in item.keys"
                      :key="key"
                      class="inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-center font-mono text-[11px] font-semibold text-slate-700 shadow-sm"
                    >{{ displayKey(key) }}</kbd>
                  </span>
                </li>
              </ul>
            </section>

            <p class="border-t border-slate-100 pt-3 text-xs text-slate-400">
              On macOS, use <kbd class="inline-flex items-center justify-center rounded border border-slate-300 bg-slate-50 px-1 py-0.5 font-mono text-[10px] font-semibold text-slate-600 shadow-sm">⌘</kbd>
              instead of <kbd class="inline-flex items-center justify-center rounded border border-slate-300 bg-slate-50 px-1 py-0.5 font-mono text-[10px] font-semibold text-slate-600 shadow-sm">Ctrl</kbd>.
            </p>
          </div>

          <!-- ── Footer ── -->
          <div class="flex items-center justify-end gap-2.5 border-t border-slate-200 px-5 py-3 shrink-0">
            <button
              type="button"
              class="btn-primary inline-flex items-center justify-center gap-2 !px-5 !py-2 !text-sm"
              @click="close"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/** One shortcut entry: the human description plus the keys to display. */
interface ShortcutEntry {
  keys: string[]
  label: string
}

/** A labelled group of related shortcuts. */
interface ShortcutGroup {
  title: string
  items: ShortcutEntry[]
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

/** Ref on the dialog container — focused on open for keyboard accessibility. */
const dialogRef = ref<HTMLElement | null>(null)

/**
 * Whether the user is on an Apple platform (so we can swap Ctrl → ⌘ in the
 * rendered key caps). Computed on mount to stay SSR-safe.
 */
const isMac = ref(false)

/** All shortcuts shown in the cheat sheet, grouped by category. */
const groups: ShortcutGroup[] = [
  {
    title: 'Editing',
    items: [
      { keys: ['Ctrl', 'Z'], label: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], label: 'Redo' },
      { keys: ['Del'], label: 'Clear selected icon' },
      { keys: ['Ctrl', 'S'], label: 'Save' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { keys: ['↑', '↓', '←', '→'], label: 'Move between slots' },
      { keys: ['Esc'], label: 'Deselect / close panel' },
    ],
  },
  {
    title: 'Export',
    items: [
      { keys: ['Ctrl', 'P'], label: 'Print' },
      { keys: ['Ctrl', 'E'], label: 'Export' },
    ],
  },
  {
    title: 'Help',
    items: [
      { keys: ['?'], label: 'Show this cheat sheet' },
    ],
  },
]

/**
 * Resolve a raw key token into its display form, swapping the modifier on
 * macOS (Ctrl → ⌘) so the caps match the user's keyboard.
 */
function displayKey(key: string): string {
  if (key === 'Ctrl' && isMac.value) return '⌘'
  if (key === 'Alt' && isMac.value) return '⌥'
  return key
}

/** Close the modal by emitting the v-model update. */
function close(): void {
  emit('update:modelValue', false)
}

/** Lock background scrolling while the modal is open, and manage focus. */
watch(
  () => props.modelValue,
  (open) => {
    if (!import.meta.client) return
    if (open) {
      document.body.style.overflow = 'hidden'
      // Move focus into the dialog so keyboard users are oriented.
      nextTick(() => dialogRef.value?.focus())
    } else {
      document.body.style.overflow = ''
    }
  },
)

/**
 * Close on Escape — registered at document level so it works regardless of
 * focus. Stops propagation so the page-level shortcut router (on `window`)
 * doesn't *also* react to the same Escape now that this modal has closed.
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.modelValue) {
    event.preventDefault()
    event.stopPropagation()
    close()
  }
}

onMounted(() => {
  isMac.value =
    /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (typeof navigator.platform === 'string' && /Mac/.test(navigator.platform))
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ── Backdrop fade ── */
.cs-backdrop-enter-active,
.cs-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.cs-backdrop-enter-from,
.cs-backdrop-leave-to {
  opacity: 0;
}

/* ── Modal fade + scale-in ──
   The outer flex container fades while the inner card scales up from a
   slightly smaller size for a smooth, polished entrance. */
.cs-modal-enter-active,
.cs-modal-leave-active {
  transition: opacity 0.25s ease;
}
.cs-modal-enter-active .cs-card,
.cs-modal-leave-active .cs-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.cs-modal-enter-from,
.cs-modal-leave-to {
  opacity: 0;
}
.cs-modal-enter-from .cs-card,
.cs-modal-leave-to .cs-card {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

/* Respect reduced-motion preferences. */
@media (prefers-reduced-motion: reduce) {
  .cs-backdrop-enter-active,
  .cs-backdrop-leave-active,
  .cs-modal-enter-active,
  .cs-modal-leave-active,
  .cs-modal-enter-active .cs-card,
  .cs-modal-leave-active .cs-card {
    transition: opacity 0.01ms ease;
  }
  .cs-modal-enter-from .cs-card,
  .cs-modal-leave-to .cs-card {
    transform: none;
  }
}
</style>
