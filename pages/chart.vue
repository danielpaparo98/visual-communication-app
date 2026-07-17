<template>
  <!-- Sticky header bar -->
  <div class="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <ChartHeader
        v-model:zoom="zoom"
        :fit-zoom="fitZoom"
        v-model:preview-mode="previewMode"
        @toggle-customize="showCustomizationPanel = !showCustomizationPanel"
        @export="showExportDialog = true"
        @show-preview="showPrintPreview = true"
        @show-shortcuts="showShortcuts = true"
      @start-tour="onboarding.startTour()"
      @new-chart="onNewChart"
    />
  </div>
  </div>

  <!-- Main editor content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

    <!-- Corruption warning banner -->
    <div
      v-if="corrupted"
      class="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 no-print"
      role="alert"
    >
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="flex-1">
        <p class="font-semibold">Your previous chart data was corrupted</p>
        <p class="mt-1 text-amber-700">We recovered a backup, but you may have lost recent changes.</p>
      </div>
      <button
        @click="dismissCorruptionWarning"
        class="shrink-0 rounded-lg px-3 py-1.5 font-medium text-amber-700 hover:bg-amber-100 transition-colors"
        aria-label="Dismiss corruption warning"
      >
        Dismiss
      </button>
    </div>

    <!-- Save error banner -->
    <div
      v-if="saveStatus.state === 'error'"
      class="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 no-print"
      role="alert"
    >
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="flex-1">{{ saveStatus.message }}</p>
      <button
        @click="saveNow(chartStore, chartManager)"
        class="shrink-0 rounded-lg px-3 py-1.5 font-medium text-red-700 hover:bg-red-100 transition-colors"
        aria-label="Retry saving"
      >
        Retry
      </button>
    </div>

    <!-- Icon loading error state -->
    <div
      v-if="!loading && iconError"
      class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center no-print"
      role="alert"
    >
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-lg font-semibold text-red-800">Failed to load icons</p>
      <p class="mt-2 text-red-600">{{ iconError }}</p>
      <button
        @click="retryLoadIcons"
        class="btn-primary mt-4 !inline-flex"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry
      </button>
    </div>

    <!-- Main editor — shown when icons loaded and no error (hidden in print) -->
    <div
      v-else-if="!loading && !iconError"
      class="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 no-print"
    >
      <!-- Chart canvas — first on mobile, right/center on desktop -->
      <div
        ref="canvasContainerRef"
        data-tour-target="canvas"
        :class="[
          'order-1 flex items-start justify-center',
          previewMode ? 'lg:col-span-5' : 'lg:order-2 lg:col-span-3',
        ]"
      >
        <ChartCanvas
          ref="canvasComponentRef"
          :slots="chartStore.slots"
          :title="chartStore.title"
          :layout-preset="chartStore.layoutPreset"
          :theme="chartStore.activeTheme"
          :active-index="activeSlotIndex"
          :selected-slots="selectedSlots"
          :loading="loading"
          v-model:zoom="zoom"
          :preview-mode="previewMode"
          :heading-font-family="chartStore.activeHeadingFont.cssFamily"
          :body-font-family="chartStore.activeBodyFont.cssFamily"
          :margin="chartStore.margin"
          :card-gap="chartStore.cardGap"
          @select="onSlotSelect"
          @set-card-style="onSetCardStyle"
          @clear-card-style="onClearCardStyle"
          @reorder="onReorder"
          @assign-icon-drop="onIconDrop"
          @update-label="onLabelUpdate"
          @update:title="onCanvasTitleUpdate"
        />
      </div>

      <!-- Icon picker — second on mobile, left on desktop (hidden in preview) -->
      <div v-if="!previewMode" data-tour-target="icon-picker" class="order-2 lg:order-1 lg:col-span-2">
        <div class="lg:sticky lg:top-32">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-heading font-bold text-lg text-slate-800">Icon library</h2>
            <button
              type="button"
              @click="toggleMultiSelectMode"
              :class="[
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
                multiSelectMode
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800',
              ]"
              :aria-pressed="multiSelectMode"
              :title="multiSelectMode ? 'Exit multi-select mode' : 'Enter multi-select mode'"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span class="hidden sm:inline">Multi-select</span>
            </button>
          </div>

          <!-- Multi-select toolbar -->
          <div
            v-if="multiSelectMode"
            class="mb-3 rounded-xl border border-blue-200 bg-blue-50/70 p-2.5 text-sm"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 font-semibold text-blue-800">
                <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs text-white">
                  {{ selectedSlots.length }}
                </span>
                <template v-if="selectedSlots.length === 0">No cards selected</template>
                <template v-else>Assigning to {{ selectedSlots.length }} slot{{ selectedSlots.length === 1 ? '' : 's' }}</template>
              </span>
              <div class="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  @click="selectAll(chartStore.preset.totalSlots)"
                  class="rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  Select all
                </button>
                <button
                  v-if="selectedSlots.length > 0"
                  type="button"
                  @click="clearSelection"
                  class="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Clear
                </button>
                <button
                  type="button"
                  @click="exitMultiSelect"
                  class="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
            <p v-if="selectedSlots.length === 0" class="mt-1.5 text-xs text-blue-600/80">
              Click one or more cards on the chart, then pick an icon to fill them all at once. Press Esc to exit.
            </p>
          </div>

          <!-- Single-select status -->
          <div v-else class="mb-3 flex items-center justify-end">
            <span v-if="activeSlotIndex !== null" class="text-xs sm:text-sm font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              Slot {{ activeSlotIndex + 1 }} selected
            </span>
            <span v-else class="text-xs sm:text-sm text-slate-400">
              Select a card to start
            </span>
          </div>

          <IconPicker
            :categories="categories"
            :selected-icon="selectedIconId"
            @select="onIconSelect"
          />
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-else-if="loading"
      class="flex flex-col items-center justify-center py-24 sm:py-32"
    >
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" role="status" aria-label="Loading icons"></div>
      <p class="text-slate-500 text-lg">Loading icons…</p>
    </div>
  </div>

  <!-- Print preview modal — full-screen A4 preview before printing -->
  <PrintPreviewModal v-model="showPrintPreview" />

  <!-- Export dialog — format / quality selection + batch export -->
  <ExportDialog
    v-model="showExportDialog"
    :exporting="exportDialogExporting"
    :result="exportDialogResult"
    :batch-progress="exportDialogBatchProgress"
    :chart-count="chartManager.chartCount"
    @export="handleExport"
    @dismiss-result="exportDialogResult = null"
  />

  <!-- Customization panel (slide-over drawer) -->
  <CustomizationPanel
    v-model="showCustomizationPanel"
    :selected-card-index="activeSlotIndex"
  />

  <!-- Floating quick-actions toolbar (anchored to the selected card) -->
  <FloatingToolbar
    :show="activeSlotIndex !== null && !previewMode"
    :trigger-selector="toolbarTriggerSelector"
    :can-undo="historyStore.canUndo"
    :can-redo="historyStore.canRedo"
    :can-clear="toolbarCanClear"
    :can-paste="hasClipboard"
    @undo="onToolbarUndo"
    @redo="onToolbarRedo"
    @clear="onToolbarClear"
    @copy="onToolbarCopy"
    @paste="onToolbarPaste"
  />

  <!-- Keyboard shortcuts cheat sheet -->
  <ShortcutsCheatSheet v-model="showShortcuts" />

  <!-- Progressive onboarding tour overlay -->
  <OnboardingTour />
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { useChartManagerStore } from '~/stores/chartManager'
import { useHistoryStore } from '~/stores/history'
import { useIconPreferencesStore } from '~/stores/iconPreferences'
import { useNotificationsStore } from '~/stores/notifications'
import { useSlotClipboard } from '~/composables/useSlotClipboard'
import { loadIconCategories } from '~/utils/iconLoader'
import { exportToPng } from '~/utils/exportPng'
import { exportToPdf } from '~/utils/exportPdf'
import { exportFilename } from '~/utils/exportFilename'
import type { IconCategory } from '~/types/icons'
import type { ChartSlotStyle } from '~/types/chart'
import type { BatchProgress, ExportConfig, ExportResult } from '~/types/export'
import type ChartCanvas from '~/components/ChartCanvas.vue'
import { useGoogleFonts } from '~/composables/useGoogleFonts'

const chartStore = useChartStore()
const chartManager = useChartManagerStore()
const prefsStore = useIconPreferencesStore()
const historyStore = useHistoryStore()
const notifications = useNotificationsStore()
const onboarding = useOnboarding()

// ── Customization panel state ──────────────────────────────────────────────

const showCustomizationPanel = ref(false)

// ── Print preview modal state ──────────────────────────────────────────────

/** Controls visibility of the full-screen print preview modal. */
const showPrintPreview = ref(false)
const {
  loading,
  loadError,
  corrupted,
  saveStatus,
  dismissCorruptionWarning,
  startAutoSave,
  stopAutoSave,
  markDirty,
  saveNow,
} = useChartStatus()

// ── Export dialog state ─────────────────────────────────────────────────────

/** Controls visibility of the export dialog. */
const showExportDialog = ref(false)
/** True while an export is in flight — drives the dialog progress bar. */
const exportDialogExporting = ref(false)
/** Outcome of the last export attempt, surfaced inside the dialog. */
const exportDialogResult = ref<ExportResult | null>(null)
/** Current chart index while exporting multiple charts, otherwise `null`. */
const exportDialogBatchProgress = ref<BatchProgress | null>(null)

const categories = ref<IconCategory[]>([])
const iconError = ref<string | null>(null)

// ── Zoom state ──────────────────────────────────────────────────────────

/**
 * Reference to the container holding ChartCanvas, used for Fit calculation.
 */
const canvasContainerRef = ref<HTMLElement | null>(null)

/**
 * Reference to the ChartCanvas component instance, used to read the
 * natural canvas-page width for Fit zoom calculation.
 */
const canvasComponentRef = ref<InstanceType<typeof ChartCanvas> | null>(null)

/** Current zoom level (0.25–1.5). Initialised to Fit on mount. */
const zoom = ref(1.0)

/**
 * The zoom level that makes the canvas fill the available container width,
 * capped at 1.0 (never zooms beyond natural size).
 */
const fitZoom = computed(() => {
  const container = canvasContainerRef.value
  const canvas = canvasComponentRef.value
  if (!container || !canvas?.canvasPageRef) return 1.0
  const naturalWidth = canvas.canvasPageRef.offsetWidth
  if (naturalWidth <= 0) return 1.0
  return Math.min(1.0, container.offsetWidth / naturalWidth)
})

/** Recalculate the current zoom to Fit (e.g. after resize). */
function applyFitZoom() {
  zoom.value = fitZoom.value
}

// ── Export (PDF / PNG, single + batch) ──────────────────────────────────────

/** Small promise-based delay used to let the DOM / fonts settle before capture. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Export whichever chart is currently loaded in the chart store, in the
 * chosen format and quality.
 *
 * Switches to preview mode at natural size (zoom 1) so the capture is a
 * faithful 1:1 render of the A4 page with no editing chrome, then restores
 * the user's view state afterwards.
 *
 * Both formats now use html2canvas for capture (the PNG is downloaded
 * directly; the PDF is assembled via jsPDF from the captured image).
 *
 * @returns The download filename for display in the export dialog.
 */
async function exportActiveChart(config: ExportConfig, title: string): Promise<string> {
  const pageEl = canvasComponentRef.value?.canvasPageRef
  if (!pageEl) {
    throw new Error('The chart is not ready yet — please try again in a moment.')
  }

  const prevZoom = zoom.value
  const prevPreview = previewMode.value

  try {
    // Switch to preview mode to hide editing chrome
    previewMode.value = true
    await nextTick()

    // Let the preview-mode watcher's applyFitZoom settle, then re-assert
    // full-size zoom so we capture at 1:1, not the fit-shrunk version.
    await delay(120)
    zoom.value = 1
    await delay(200)

    if (config.format === 'png') {
      await exportToPng(pageEl, title, config.quality)
    } else {
      await exportToPdf(pageEl, title, config.quality)
    }
  } finally {
    zoom.value = prevZoom
    previewMode.value = prevPreview
  }

  return exportFilename(title, config.format)
}

/**
 * Export every chart in the manager store sequentially.
 *
 * The active chart is saved first (so any pending edits aren't lost), then
 * each chart is made active in turn. The originally-active chart is
 * restored at the end.
 *
 * @returns The number of charts successfully exported.
 */
async function exportAllCharts(config: ExportConfig): Promise<{ count: number }> {
  const originalId = chartManager.activeChartId
  // Persist the current chart before switching away.
  chartManager.saveCurrentChart()

  const list = chartManager.chartList
  let count = 0

  try {
    for (let i = 0; i < list.length; i++) {
      const chart = list[i]
      if (!chart) continue
      exportDialogBatchProgress.value = { current: i + 1, total: list.length }
      chartManager.setActiveChart(chart.id)
      // Allow the canvas render to update to the new chart data before capture.
      await nextTick()
      await delay(200)
      await exportActiveChart(config, chartStore.title)
      count++
    }
  } finally {
    // Restore the chart the user was originally editing.
    if (originalId) {
      chartManager.setActiveChart(originalId)
    }
  }

  return { count }
}

/**
 * Handle an export request emitted by the dialog.
 *
 * Single export → export the active chart directly.
 * Batch export → iterate every chart in the manager.
 * The outcome (success / error) is pushed back into the dialog via
 * {@link exportDialogResult}.
 */
async function handleExport(config: ExportConfig): Promise<void> {
  if (exportDialogExporting.value) return

  exportDialogResult.value = null
  exportDialogBatchProgress.value = null
  exportDialogExporting.value = true

  try {
    if (config.batch && chartManager.chartCount > 1) {
      const { count } = await exportAllCharts(config)
      exportDialogResult.value = { ok: true, filename: `${count} charts`, count }
    } else {
      const filename = await exportActiveChart(config, chartStore.title)
      exportDialogResult.value = { ok: true, filename, count: 1 }
    }
  } catch (e) {
    exportDialogResult.value = {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : 'Something went wrong while exporting. Please try again.',
    }
  } finally {
    exportDialogExporting.value = false
    exportDialogBatchProgress.value = null
  }
}

// ── Preview mode ─────────────────────────────────────────────────────────

/**
 * Reactive preview-mode flag, synced with the URL query parameter `?mode=`.
 * When `true` the canvas hides editing chrome and the icon picker is removed.
 */
const previewMode = ref(false)

const route = useRoute()
const router = useRouter()

// Read initial mode from the URL query on mount
if (import.meta.client && route.query.mode === 'preview') {
  previewMode.value = true
}

// Keep the URL in sync with the current mode
watch(previewMode, (newVal) => {
  router.replace({ query: { ...route.query, mode: newVal ? 'preview' : 'edit' } })
})

// Auto-apply Fit zoom when entering preview mode
watch(previewMode, async (isPreview) => {
  if (isPreview) {
    await nextTick()
    applyFitZoom()
  }
})

// ── Dynamic Google Font loading ───────────────────────────────────────────

/**
 * Dynamically load the active heading + body fonts from Google Fonts.
 * Reactively tracks font changes via the store's computed presets.
 */
const { fontsLoaded } = useGoogleFonts(
  computed(() => [chartStore.activeHeadingFont, chartStore.activeBodyFont]),
)

async function retryLoadIcons() {
  iconError.value = null
  categories.value = []
  try {
    categories.value = await loadIconCategories()
  } catch (e) {
    iconError.value =
      e instanceof Error ? e.message : 'An unexpected error occurred. Please check your connection and try again.'
  }
}

// ── Initialisation ──────────────────────────────────────────────────────

onMounted(async () => {
  // Ensure we have an active chart — redirect to gallery if not
  if (!chartManager.activeChartId) {
    await navigateTo('/')
    return
  }

  // Load active chart data into the chart store
  chartManager.setActiveChart(chartManager.activeChartId)

  // Start auto-save **after** the initial data load so the watcher
  // doesn't trigger an unnecessary save for the just-loaded state.
  startAutoSave(chartStore, chartManager)

  // Load icon categories
  try {
    categories.value = await loadIconCategories()
  } catch (e) {
    iconError.value =
      e instanceof Error ? e.message : 'An unexpected error occurred while loading icons.'
  }

  // Initialise zoom to Fit after mount so DOM measurements are available
  await nextTick()
  applyFitZoom()

  // First-visit onboarding tour — auto-offer once, after the layout settles,
  // so the spotlight targets are present and measured correctly.
  if (!onboarding.hasSeenOnboarding.value) {
    window.setTimeout(() => onboarding.startTour(), 450)
  }
})

onUnmounted(() => {
  stopAutoSave()
})

// ── Slot selection & icon assignment ────────────────────────────────────

// Multi-select state for batch icon assignment (component-scoped UI state).
const {
  selectedSlots,
  multiSelectMode,
  toggleSlot,
  selectAll,
  clearSelection,
  enterMultiSelect,
  exitMultiSelect,
} = useMultiSelect()

const activeSlotIndex = ref<number | null>(null)
const selectedIconId = ref<string | null>(null)

// ── Slot clipboard (copy/paste) & floating toolbar ────────────────────────

const { copySlot, pasteSlot, hasClipboard } = useSlotClipboard()

/**
 * CSS selector resolving the currently-selected card element, used by the
 * floating toolbar to anchor itself. `undefined` when nothing is selected so
 * the toolbar parks off-screen.
 */
const toolbarTriggerSelector = computed<string | undefined>(() =>
  activeSlotIndex.value !== null ? `[data-card-index="${activeSlotIndex.value}"]` : undefined,
)

/** Whether the active slot has an icon the Clear button can remove. */
const toolbarCanClear = computed(() => {
  if (activeSlotIndex.value === null) return false
  return chartStore.slots[activeSlotIndex.value]?.icon != null
})

function onSlotSelect(index: number) {
  // In multi-select mode, clicking a card toggles its membership in the
  // batch selection instead of performing a single selection.
  if (multiSelectMode.value) {
    toggleSlot(index)
    return
  }
  markDirty()
  if (activeSlotIndex.value === index) {
    activeSlotIndex.value = null
    selectedIconId.value = null
  } else {
    activeSlotIndex.value = index
    // Pre-select the icon already in this slot
    const slot = chartStore.slots[index]
    selectedIconId.value = slot?.icon?.id ?? null
  }
}

function onIconSelect(icon: { id: string; filename: string; alt: string; category: string }) {
  // Multi-select: assign the chosen icon to EVERY selected slot at once.
  // We deliberately stay in multi-select mode afterwards so the user can
  // keep batch-filling other slots without re-entering the mode.
  if (multiSelectMode.value && selectedSlots.value.length > 0) {
    markDirty()
    prefsStore.trackRecent(icon.id)
    for (const slotIndex of selectedSlots.value) {
      chartStore.assignIcon(slotIndex, icon)
    }
    selectedIconId.value = icon.id
    return
  }

  markDirty()
  if (activeSlotIndex.value !== null) {
    // Track this icon as recently used before assigning it to the slot.
    prefsStore.trackRecent(icon.id)
    chartStore.assignIcon(activeSlotIndex.value, icon)
    selectedIconId.value = icon.id
  }
}

/** Toggle multi-select mode on/off from the toolbar button. */
function toggleMultiSelectMode() {
  if (multiSelectMode.value) {
    exitMultiSelect()
  } else {
    // Drop any single selection so the two modes never highlight a card at once.
    activeSlotIndex.value = null
    selectedIconId.value = null
    enterMultiSelect()
  }
}

function onLabelUpdate(index: number, label: string) {
  markDirty()
  chartStore.updateLabel(index, label)
}

function onCanvasTitleUpdate(title: string) {
  markDirty()
  chartStore.setTitle(title)
}

/** Create a fresh chart and switch to it. */
function onNewChart() {
  const notifications = useNotificationsStore()
  chartManager.createChart()
  notifications.success('New chart created!')
}

function onSetCardStyle(index: number, style: ChartSlotStyle) {
  markDirty()
  chartStore.setCardStyle(index, style)
}

function onClearCardStyle(index: number) {
  markDirty()
  chartStore.clearCardStyle(index)
}

/**
 * Remap a slot index through an insert-move (`from` → `to`) so selection
 * state keeps pointing at the same card after a reorder.
 *
 * - The moved slot itself lands at `to`.
 * - Slots strictly between `from` and `to` shift by one to fill the gap.
 */
function remapIndexAfterMove(j: number, from: number, to: number): number {
  if (j === from) return to
  if (from < to) {
    // Moved down: items in (from, to] shift left to fill the vacated slot.
    if (j > from && j <= to) return j - 1
  } else {
    // Moved up: items in [to, from) shift right to make room.
    if (j >= to && j < from) return j + 1
  }
  return j
}

/** Handle slot reordering from drag-and-drop, keeping selection in sync. */
function onReorder(from: number, to: number) {
  markDirty()
  chartStore.reorderSlots(from, to)
  // Keep the active selection and multi-selection following their cards.
  if (activeSlotIndex.value !== null) {
    activeSlotIndex.value = remapIndexAfterMove(activeSlotIndex.value, from, to)
  }
  if (selectedSlots.value.length > 0) {
    selectedSlots.value = selectedSlots.value.map((j) => remapIndexAfterMove(j, from, to))
  }
}

/**
 * Handle an icon dragged from {@link IconPicker} and dropped onto a slot.
 * Mirrors {@link onIconSelect} but targets the explicit drop index rather
 * than the active/multi selection.
 */
function onIconDrop(
  index: number,
  icon: { id: string; filename: string; alt: string; category: string },
) {
  markDirty()
  prefsStore.trackRecent(icon.id)
  chartStore.assignIcon(index, icon)
  // Focus the dropped card so the picker highlight and label editor follow.
  activeSlotIndex.value = index
  selectedIconId.value = icon.id
}

// ── Floating toolbar actions ──────────────────────────────────────────────

/** Undo the last change and surface a toast. */
function onToolbarUndo(): void {
  historyStore.undo()
  // The undone slot may now hold a different icon — keep the picker in sync.
  syncSelectedIcon()
  notifications.info('Undone')
}

/** Redo the last undone change and surface a toast. */
function onToolbarRedo(): void {
  historyStore.redo()
  syncSelectedIcon()
  notifications.info('Redone')
}

/** Remove the icon from the active slot (undoable) and notify. */
function onToolbarClear(): void {
  if (activeSlotIndex.value === null) return
  const slot = chartStore.slots[activeSlotIndex.value]
  if (!slot?.icon) return
  const idx = activeSlotIndex.value
  markDirty()
  chartStore.clearIcon(idx)
  selectedIconId.value = null
  notifications.success(`Cleared slot ${idx + 1}`)
}

/** Copy the active slot's full data onto the clipboard. */
function onToolbarCopy(): void {
  if (activeSlotIndex.value === null) return
  const slot = chartStore.slots[activeSlotIndex.value]
  if (!slot) return
  copySlot(slot)
  notifications.success('Slot copied')
}

/**
 * Paste the clipboard's slot data onto the active slot.
 *
 * Applies the copied icon, label, and (if present) card style via the existing
 * store actions. Each is recorded as its own undo step, so a paste may take a
 * few undo presses to fully revert — acceptable for a quick-action toolbar.
 */
function onToolbarPaste(): void {
  if (activeSlotIndex.value === null) return
  const data = pasteSlot()
  if (!data) {
    notifications.warning('Nothing to paste')
    return
  }
  const idx = activeSlotIndex.value
  markDirty()
  if (data.icon) {
    chartStore.assignIcon(idx, data.icon)
    selectedIconId.value = data.icon.id
  }
  chartStore.updateLabel(idx, data.label)
  if (data.style) {
    chartStore.setCardStyle(idx, data.style)
  }
  notifications.success(`Pasted to slot ${idx + 1}`)
}

// ── Keyboard shortcuts ──────────────────────────────────────────────────────

/** Controls visibility of the keyboard shortcuts cheat sheet. */
const showShortcuts = ref(false)

/** Sync the icon-picker highlight to whatever slot is currently active. */
function syncSelectedIcon(): void {
  const slot =
    activeSlotIndex.value !== null ? chartStore.slots[activeSlotIndex.value] : null
  selectedIconId.value = slot?.icon?.id ?? null
}

/**
 * Escape handler, checked in priority order: close the customization drawer,
 * exit multi-select mode, then finally deselect the active slot.
 */
function handleEscape(): void {
  if (showCustomizationPanel.value) {
    showCustomizationPanel.value = false
    return
  }
  if (multiSelectMode.value) {
    exitMultiSelect()
    return
  }
  if (activeSlotIndex.value !== null) {
    activeSlotIndex.value = null
    selectedIconId.value = null
  }
}

/** Remove the icon from the active slot (undoable). No-op if none selected. */
function clearActiveSlotIcon(): void {
  if (activeSlotIndex.value === null) return
  const slot = chartStore.slots[activeSlotIndex.value]
  if (!slot?.icon) return
  markDirty()
  chartStore.clearIcon(activeSlotIndex.value)
  selectedIconId.value = null
}

/**
 * Move the active selection to the grid-adjacent slot in the given direction.
 *
 * Row-aware: horizontal movement stops at row edges (no wrapping) and
 * vertical movement stops at the grid bounds. If nothing is selected the
 * first slot is selected.
 */
function navigateSlot(direction: 'up' | 'down' | 'left' | 'right'): void {
  const { columns, totalSlots } = chartStore.preset

  if (activeSlotIndex.value === null) {
    activeSlotIndex.value = 0
    syncSelectedIcon()
    return
  }

  const i = activeSlotIndex.value
  const col = i % columns
  let next = i

  if (direction === 'right' && col < columns - 1) next = i + 1
  else if (direction === 'left' && col > 0) next = i - 1
  else if (direction === 'down' && i + columns < totalSlots) next = i + columns
  else if (direction === 'up' && i - columns >= 0) next = i - columns

  if (next !== i) {
    activeSlotIndex.value = next
    syncSelectedIcon()
  }
}

/**
 * Centralised keyboard-shortcut router for the chart editor.
 *
 * All editor shortcuts live here (undo/redo, save, export, print, delete,
 * arrow navigation, escape, and the `?` cheat-sheet toggle). While a modal
 * overlay is open the router is disabled so the overlay can manage its own
 * keyboard interaction.
 */
useKeyboardShortcuts(
  {
    onUndo: () => historyStore.undo(),
    onRedo: () => historyStore.redo(),
    onSave: () => saveNow(chartStore, chartManager),
    onExport: () => {
      if (!exportDialogExporting.value) showExportDialog.value = true
    },
    onPrint: () => {
      if (import.meta.client) window.print()
    },
    onEscape: handleEscape,
    onDeleteActiveSlot: clearActiveSlotIcon,
    onNavigate: navigateSlot,
    onShowShortcuts: () => {
      showShortcuts.value = true
    },
  },
  {
    // Disable editor shortcuts while a modal overlay — or the onboarding tour
    // — is open, so each overlay owns its keyboard interaction (Escape, etc.).
    isEnabled: () =>
      !showShortcuts.value &&
      !showPrintPreview.value &&
      !showExportDialog.value &&
      !showCustomizationPanel.value &&
      !onboarding.isTourActive.value,
  },
)

// ── Title ───────────────────────────────────────────────────────────────

useHead({
  title: 'Create Your Chart',
  meta: [
    {
      name: 'description',
      content: 'Build your PECs communication chart by selecting icons and adding labels.',
    },
  ],
})
</script>
