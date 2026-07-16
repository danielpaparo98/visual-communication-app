<template>
  <Teleport to="body">
    <!-- ── Backdrop (click to close) ── -->
    <Transition name="exd-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm no-print"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <!-- ── Modal ── -->
    <Transition name="exd-modal">
      <div
        v-if="modelValue"
        ref="dialogRef"
        class="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 no-print"
        role="dialog"
        aria-modal="true"
        aria-label="Export chart"
        tabindex="-1"
        @keydown.escape="close"
      >
        <div
          class="exd-card pointer-events-auto relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          @click.stop
        >
          <!-- ── Header ── -->
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 sm:px-5 py-3 shrink-0">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </span>
              <div class="min-w-0">
                <h2 class="font-heading font-bold text-base sm:text-lg text-slate-800 leading-tight truncate">
                  Export chart
                </h2>
                <p class="text-[11px] sm:text-xs text-slate-400 leading-tight truncate">
                  Choose a format and quality for your communication board.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Close export dialog"
              @click="close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <!-- ── Body ── -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
            <!-- ── Result state ── -->
            <div v-if="result && !exporting" class="space-y-4" aria-live="polite">
              <!-- Success -->
              <div
                v-if="result.ok"
                class="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-7 text-center"
              >
                <span class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </span>
                <div>
                  <p class="font-heading font-bold text-base text-emerald-800">
                    Exported successfully!
                  </p>
                  <p class="mt-1 text-xs text-emerald-700 break-all">
                    {{ result.count > 1 ? `${result.count} charts saved` : `Saved as ${result.filename}` }}
                  </p>
                </div>
              </div>
              <!-- Error -->
              <div
                v-else
                class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4"
                role="alert"
              >
                <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="flex-1 text-sm text-red-700">{{ result.error }}</p>
              </div>
            </div>

            <!-- ── Config state ── -->
            <template v-else>
              <!-- Format selection -->
              <div class="space-y-2">
                <span class="block text-xs font-semibold uppercase tracking-wider text-slate-400">Format</span>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="opt in FORMAT_OPTIONS"
                    :key="opt.id"
                    type="button"
                    :aria-pressed="format === opt.id"
                    :class="[
                      'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 text-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
                      format === opt.id
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                    ]"
                    @click="selectFormat(opt.id)"
                  >
                    <!-- PDF (printer) icon -->
                    <svg
                      v-if="opt.id === 'pdf'"
                      :class="['shrink-0', format === 'pdf' ? 'text-primary-600' : 'text-slate-400']"
                      width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    >
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                      <path d="M6 9V3h12v6"/>
                      <rect x="6" y="14" width="12" height="8" rx="1"/>
                    </svg>
                    <!-- PNG (image) icon -->
                    <svg
                      v-else
                      :class="['shrink-0', format === 'png' ? 'text-primary-600' : 'text-slate-400']"
                      width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span :class="['text-sm font-semibold', format === opt.id ? 'text-primary-700' : 'text-slate-700']">
                      {{ opt.label }}
                    </span>
                    <span class="text-[11px] font-normal text-slate-400 leading-tight">{{ opt.hint }}</span>
                  </button>
                </div>
                <p v-if="format === 'pdf'" class="text-[11px] text-slate-400 leading-snug">
                  Opens your browser's print dialog — choose “Save as PDF” for a vector file. Quality only affects PNG exports.
                </p>
              </div>

              <!-- Quality presets -->
              <div class="space-y-2">
                <span class="block text-xs font-semibold uppercase tracking-wider text-slate-400">Quality</span>
                <div
                  class="grid gap-1.5"
                  role="radiogroup"
                  aria-label="Export quality"
                >
                  <button
                    v-for="preset in QUALITY_PRESETS"
                    :key="preset.id"
                    type="button"
                    role="radio"
                    :aria-checked="quality === preset.id"
                    :class="[
                      'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
                      quality === preset.id
                        ? 'border-primary-400 bg-primary-50/60'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                    ]"
                    @click="selectQuality(preset.id)"
                  >
                    <!-- Radio dot -->
                    <span
                      :class="[
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        quality === preset.id ? 'border-primary-500' : 'border-slate-300',
                      ]"
                    >
                      <span
                        v-if="quality === preset.id"
                        class="h-2 w-2 rounded-full bg-primary-500"
                      />
                    </span>
                    <span class="flex-1 min-w-0">
                      <span class="flex items-baseline gap-2">
                        <span :class="['text-sm font-semibold', quality === preset.id ? 'text-primary-700' : 'text-slate-700']">
                          {{ preset.label }}
                        </span>
                        <span class="text-[11px] font-medium text-slate-400">{{ preset.dpi }}</span>
                      </span>
                      <span class="block text-[11px] text-slate-400 leading-tight">{{ preset.description }}</span>
                    </span>
                    <span class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 tabular-nums">
                      {{ preset.sizeEstimate }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Batch option -->
              <div
                v-if="showBatchOption"
                :class="[
                  'flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                  batch ? 'border-primary-300 bg-primary-50/50' : 'border-slate-200 bg-white',
                ]"
              >
                <label class="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary-500"
                    :checked="batch"
                    :disabled="exporting"
                    @change="batch = ($event.target as HTMLInputElement).checked"
                  />
                  <span class="min-w-0">
                    <span class="block text-sm font-medium text-slate-700">Export all charts ({{ chartCount }})</span>
                    <span class="block text-[11px] text-slate-400 leading-tight">
                      {{ format === 'pdf'
                        ? 'Prints each chart one at a time — save each as it opens.'
                        : 'Saves every chart as a separate image file.' }}
                    </span>
                  </span>
                </label>
              </div>

              <!-- Filename preview -->
              <div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span class="block text-[11px] font-medium text-slate-400 mb-0.5">File name</span>
                <div class="flex items-center gap-1.5 min-w-0">
                  <svg class="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <code class="text-xs font-medium text-slate-600 truncate">{{ filenamePreview }}</code>
                </div>
              </div>

              <!-- Progress (while exporting) -->
              <div v-if="exporting" class="space-y-2" aria-live="polite">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-600">
                    {{ progressLabel }}
                  </span>
                  <span class="font-semibold text-primary-600 tabular-nums">{{ Math.round(progressValue) }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    class="h-full rounded-full bg-primary-500 transition-[width] duration-300 ease-out"
                    :style="{ width: `${progressValue}%` }"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- ── Footer ── -->
          <div class="flex items-center justify-end gap-2.5 border-t border-slate-200 px-4 sm:px-5 py-3 shrink-0">
            <template v-if="result && !exporting">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-primary-400"
                @click="exportAgain"
              >
                Export again
              </button>
              <button
                type="button"
                class="btn-primary inline-flex items-center justify-center gap-2 !px-5 !py-2 !text-sm"
                @click="close"
              >
                Done
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                :disabled="exporting"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-primary-400 disabled:opacity-60 disabled:cursor-not-allowed"
                @click="close"
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="exporting"
                class="btn-primary inline-flex items-center justify-center gap-2 !px-5 !py-2 !text-sm disabled:opacity-70 disabled:cursor-wait"
                @click="triggerExport"
              >
                <svg v-if="exporting" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>{{ exporting ? 'Exporting…' : (batch ? `Export ${chartCount} charts` : 'Export') }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { useExportPreferencesStore } from '~/stores/exportPreferences'
import { exportFilename, type ExportQuality } from '~/utils/exportFilename'
import type {
  BatchProgress,
  ExportConfig,
  ExportFormat,
  ExportResult,
} from '~/types/export'

// ── Static option data ──────────────────────────────────────────────────────

interface FormatOption {
  id: ExportFormat
  label: string
  hint: string
}

const FORMAT_OPTIONS: FormatOption[] = [
  { id: 'pdf', label: 'PDF (Print)', hint: 'Vector · best quality' },
  { id: 'png', label: 'PNG (Image)', hint: 'Raster · shareable' },
]

interface QualityPreset {
  id: ExportQuality
  label: string
  dpi: string
  description: string
  sizeEstimate: string
}

/** Quality presets surfaced in the dialog. DPI / size figures are estimates. */
const QUALITY_PRESETS: QualityPreset[] = [
  { id: 'draft', label: 'Draft', dpi: '72 DPI', description: 'Smallest file, quick to share', sizeEstimate: '~200 KB' },
  { id: 'normal', label: 'Normal', dpi: '150 DPI', description: 'Good for screen viewing', sizeEstimate: '~500 KB' },
  { id: 'high', label: 'High', dpi: '300 DPI', description: 'Print-ready quality', sizeEstimate: '~2 MB' },
]

// ── Props / emits ───────────────────────────────────────────────────────────

const props = defineProps<{
  modelValue: boolean
  /** True while an export is in flight (drives the progress bar + disabled state). */
  exporting: boolean
  /** Outcome of the last export attempt, or `null` while idle / in-progress. */
  result: ExportResult | null
  /** Current chart index while exporting multiple charts, otherwise `null`. */
  batchProgress: BatchProgress | null
  /** Number of saved charts — gates the "Export all" option. */
  chartCount: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  /** Fired when the user clicks Export — the page owns the actual capture. */
  export: [config: ExportConfig]
  /** Fired when the user clears a result to start over. */
  'dismiss-result': []
}>()

// ── Stores ────────────────────────────────────────────────────────────────

const chartStore = useChartStore()
const prefsStore = useExportPreferencesStore()

// ── Local selection state (synced with the preferences store) ──────────────

const format = ref<ExportFormat>(prefsStore.lastFormat)
const quality = ref<ExportQuality>(prefsStore.lastQuality)
const batch = ref(false)

// ── Derived state ──────────────────────────────────────────────────────────

/** Whether to show the "Export all charts" option. */
const showBatchOption = computed(() => props.chartCount > 1)

/** Live filename preview for the current title + format. */
const filenamePreview = computed(() =>
  exportFilename(chartStore.title || 'My Communication Chart', format.value),
)

/** Human-readable label shown next to the progress bar. */
const progressLabel = computed(() => {
  if (props.batchProgress) {
    return `Exporting chart ${props.batchProgress.current} of ${props.batchProgress.total}…`
  }
  return format.value === 'pdf' ? 'Opening print dialog…' : 'Generating image…'
})

// ── Selection handlers ─────────────────────────────────────────────────────

function selectFormat(value: ExportFormat): void {
  format.value = value
  prefsStore.setFormat(value)
}

function selectQuality(value: ExportQuality): void {
  quality.value = value
  prefsStore.setQuality(value)
}

// ── Actions ────────────────────────────────────────────────────────────────

function close(): void {
  emit('update:modelValue', false)
}

function triggerExport(): void {
  if (props.exporting) return
  emit('export', {
    format: format.value,
    quality: quality.value,
    batch: batch.value && showBatchOption.value,
  })
}

function exportAgain(): void {
  emit('dismiss-result')
}

// ── Progress animation ─────────────────────────────────────────────────────

/**
 * Smooth, believable progress value (0–100). html2canvas exposes no real
 * progress callback, so we ease toward a target derived from the batch
 * position (or ~92 % for a single export) and snap to 100 on completion.
 */
const progressValue = ref(0)
let progressTimer: ReturnType<typeof setInterval> | null = null

function targetPercent(): number {
  if (props.batchProgress) {
    // Base = completed charts, plus a fraction of the current chart.
    const completed = (props.batchProgress.current - 1) / props.batchProgress.total
    const within = 0.5 / props.batchProgress.total
    return Math.min(92, Math.round((completed + within) * 100))
  }
  return 92
}

function startProgressAnimation(): void {
  stopProgressAnimation()
  progressValue.value = props.batchProgress ? targetPercent() : 0
  progressTimer = setInterval(() => {
    const target = targetPercent()
    const gap = target - progressValue.value
    if (gap > 0.5) {
      // Ease ~18 % of the remaining gap each tick — never overshoots target.
      progressValue.value = Math.min(target, progressValue.value + Math.max(1, gap * 0.18))
    }
  }, 120)
}

function stopProgressAnimation(): void {
  if (progressTimer !== null) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

watch(
  () => props.exporting,
  (isExporting) => {
    if (isExporting) {
      startProgressAnimation()
    } else {
      stopProgressAnimation()
      // Snap to full so the bar completes before the result card appears.
      progressValue.value = 100
    }
  },
)

// Keep the animated bar in step with batch position.
watch(
  () => props.batchProgress,
  () => {
    if (props.exporting) startProgressAnimation()
  },
)

// ── Lifecycle ──────────────────────────────────────────────────────────────

const dialogRef = ref<HTMLElement | null>(null)

/** When opening, re-sync selections from the persisted preferences + reset batch. */
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      format.value = prefsStore.lastFormat
      quality.value = prefsStore.lastQuality
      batch.value = false
      progressValue.value = 0
      if (import.meta.client) {
        document.body.style.overflow = 'hidden'
        nextTick(() => dialogRef.value?.focus())
      }
    } else if (import.meta.client) {
      document.body.style.overflow = ''
      stopProgressAnimation()
    }
  },
)

/** Close on Escape — registered at document level. */
function onKeydown(event: KeyboardEvent): void {
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
  stopProgressAnimation()
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ── Backdrop fade ── */
.exd-backdrop-enter-active,
.exd-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.exd-backdrop-enter-from,
.exd-backdrop-leave-to {
  opacity: 0;
}

/* ── Modal fade + scale-in ── */
.exd-modal-enter-active,
.exd-modal-leave-active {
  transition: opacity 0.25s ease;
}
.exd-modal-enter-active .exd-card,
.exd-modal-leave-active .exd-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.exd-modal-enter-from,
.exd-modal-leave-to {
  opacity: 0;
}
.exd-modal-enter-from .exd-card,
.exd-modal-leave-to .exd-card {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

/* Respect reduced-motion preferences. */
@media (prefers-reduced-motion: reduce) {
  .exd-backdrop-enter-active,
  .exd-backdrop-leave-active,
  .exd-modal-enter-active,
  .exd-modal-leave-active,
  .exd-modal-enter-active .exd-card,
  .exd-modal-leave-active .exd-card {
    transition: opacity 0.01ms ease;
  }
  .exd-modal-enter-from .exd-card,
  .exd-modal-leave-to .exd-card {
    transform: none;
  }
}
</style>
