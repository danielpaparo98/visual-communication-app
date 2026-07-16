<template>
  <Teleport to="body">
    <!-- ── Backdrop (click to close) ── -->
    <Transition name="ppm-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm no-print"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <!-- ── Modal ── -->
    <Transition name="ppm-modal">
      <div
        v-if="modelValue"
        ref="dialogRef"
        class="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 no-print"
        role="dialog"
        aria-modal="true"
        aria-label="Print preview"
        tabindex="-1"
        @keydown.escape="close"
      >
        <!--
          The outer flex container is transparent to pointer events so that
          clicks on the surrounding empty space fall through to the backdrop
          (closing the modal). Only the card itself captures clicks.
        -->
        <div
          class="ppm-card pointer-events-auto relative flex h-full max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          @click.stop
        >
          <!-- ── Header ── -->
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 sm:px-5 py-3 shrink-0">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <path d="M6 9V3h12v6"/>
                  <rect x="6" y="14" width="12" height="8" rx="1"/>
                </svg>
              </span>
              <div class="min-w-0">
                <h2 class="font-heading font-bold text-base sm:text-lg text-slate-800 leading-tight truncate">
                  Print preview
                </h2>
                <p class="text-[11px] sm:text-xs text-slate-400 leading-tight truncate">
                  This is exactly what will print on an A4 page.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Close print preview"
              @click="close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <!-- ── Scaled A4 preview ── -->
          <div class="flex-1 overflow-auto bg-slate-100 p-3 sm:p-6">
            <ChartCanvas
              :slots="chartStore.slots"
              :title="chartStore.title"
              :layout-preset="chartStore.layoutPreset"
              :theme="chartStore.activeTheme"
              :preview-mode="true"
              :zoom="1"
              :heading-font-family="chartStore.activeHeadingFont.cssFamily"
              :body-font-family="chartStore.activeBodyFont.cssFamily"
              :margin="chartStore.margin"
              :card-gap="chartStore.cardGap"
            />
          </div>

          <!-- ── Footer actions ── -->
          <div class="flex items-center justify-end gap-2.5 border-t border-slate-200 px-4 sm:px-5 py-3 shrink-0">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-primary-400"
              @click="close"
            >
              Close
            </button>
            <button
              type="button"
              class="btn-primary inline-flex items-center justify-center gap-2 !px-5 !py-2 !text-sm"
              @click="handlePrint"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <path d="M6 9V3h12v6"/>
                <rect x="6" y="14" width="12" height="8" rx="1"/>
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const chartStore = useChartStore()

/** Ref on the dialog container — focused on open for keyboard accessibility. */
const dialogRef = ref<HTMLElement | null>(null)

/** Close the modal by emitting the v-model update. */
function close() {
  emit('update:modelValue', false)
}

/**
 * Open the system print dialog.
 *
 * The global print pipeline handles the actual output: the dedicated
 * `ChartPrint` component renders the print-version of the chart, while every
 * element marked `.no-print` (including this entire modal) is hidden during
 * printing. We therefore only need to trigger `window.print()`.
 */
function handlePrint() {
  if (import.meta.client) {
    window.print()
  }
}

/** Lock background scrolling while the modal is open, and manage focus. */
watch(
  () => props.modelValue,
  (open) => {
    if (!import.meta.client) return
    if (open) {
      document.body.style.overflow = 'hidden'
      // Move focus into the dialog so Escape / keyboard users are oriented.
      nextTick(() => dialogRef.value?.focus())
    } else {
      document.body.style.overflow = ''
    }
  },
)

/** Close on Escape — registered at document level so it works regardless of focus. */
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    event.preventDefault()
    close()
  }
}

onMounted(() => {
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
.ppm-backdrop-enter-active,
.ppm-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.ppm-backdrop-enter-from,
.ppm-backdrop-leave-to {
  opacity: 0;
}

/* ── Modal fade + scale-in ──
   The outer flex container fades while the inner card scales up from a
   slightly smaller size for a smooth, polished entrance. */
.ppm-modal-enter-active,
.ppm-modal-leave-active {
  transition: opacity 0.25s ease;
}
.ppm-modal-enter-active .ppm-card,
.ppm-modal-leave-active .ppm-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.ppm-modal-enter-from,
.ppm-modal-leave-to {
  opacity: 0;
}
.ppm-modal-enter-from .ppm-card,
.ppm-modal-leave-to .ppm-card {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

/* Respect reduced-motion preferences. */
@media (prefers-reduced-motion: reduce) {
  .ppm-backdrop-enter-active,
  .ppm-backdrop-leave-active,
  .ppm-modal-enter-active,
  .ppm-modal-leave-active,
  .ppm-modal-enter-active .ppm-card,
  .ppm-modal-leave-active .ppm-card {
    transition: opacity 0.01ms ease;
  }
  .ppm-modal-enter-from .ppm-card,
  .ppm-modal-leave-to .ppm-card {
    transform: none;
  }
}
</style>
