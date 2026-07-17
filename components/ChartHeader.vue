<template>
  <div
    data-tour-target="header"
    class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 no-print"
  >

    <div class="flex-1 min-w-0 px-0 sm:px-4 order-1">
      <input
        v-if="isEditing"
        v-model="titleInput"
        ref="titleInputRef"
        @blur="saveTitle"
        @keyup.enter="saveTitle"
        @keyup.escape="cancelEdit"
        class="w-full sm:max-w-sm mx-auto block text-center font-heading font-extrabold text-lg sm:text-xl text-slate-800 bg-white border-b-2 border-primary-400 outline-none px-2 py-1"
        aria-label="Chart title"
      />
      <button
        v-else
        @click="startEditing"
        class="group w-full sm:max-w-sm mx-auto inline-flex items-center justify-center gap-1.5 font-heading font-extrabold text-lg sm:text-xl text-slate-800 hover:text-primary-600 transition-colors cursor-text truncate max-w-full"
        aria-label="Edit chart title"
      >
        <span class="truncate">{{ chartStore.title }}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-primary-400 shrink-0">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
      </button>
    </div>

    <!-- ── Edit / Preview mode toggle ── -->
    <div class="flex items-center gap-1 order-2">
      <div class="flex items-center gap-0.5 border border-slate-200 rounded-lg overflow-hidden">
        <button
          :class="[
            'px-2 py-1.5 text-[11px] font-medium transition-all duration-150 flex items-center gap-1',
            !previewMode
              ? 'bg-primary-100 text-primary-700 shadow-sm'
              : 'bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50',
          ]"
          :aria-pressed="!previewMode"
          aria-label="Edit mode"
          @click="emit('update:previewMode', false)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          Edit
        </button>
        <button
          :class="[
            'px-2 py-1.5 text-[11px] font-medium transition-all duration-150 flex items-center gap-1',
            previewMode
              ? 'bg-primary-100 text-primary-700 shadow-sm'
              : 'bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50',
          ]"
          :aria-pressed="previewMode"
          aria-label="Preview mode"
          @click="emit('update:previewMode', true)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>
      </div>
    </div>

    <!-- ── More dropdown (Layout, Zoom, Customize, Tour, Help) ── -->
    <div class="flex items-center order-3 relative" ref="moreMenuRef">
      <button
        @click="showMoreMenu = !showMoreMenu"
        class="inline-flex items-center justify-center px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-150 text-xs font-medium gap-1"
        aria-label="More options"
        aria-haspopup="true"
        :aria-expanded="showMoreMenu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
        <span class="hidden sm:inline text-[11px]">More</span>
      </button>

      <Transition name="more-fade">
        <div
          v-if="showMoreMenu"
          class="absolute top-full right-0 mt-1 z-50 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2"
          role="menu"
          @click.outside="showMoreMenu = false"
          @keyup.escape="showMoreMenu = false"
        >
          <!-- Layout preset -->
          <div class="px-3 py-2 border-b border-slate-100">
            <label class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Layout</label>
            <select
              :value="chartStore.layoutPreset"
              @change="chartStore.setLayoutPreset(($event.target as HTMLSelectElement).value)"
              class="mt-1 w-full appearance-none bg-white border border-slate-200 rounded-md px-2.5 py-1.5 pr-6 text-xs font-medium text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] bg-[length:10px]"
              aria-label="Layout preset"
            >
              <option v-for="p in LAYOUT_PRESETS" :key="p.id" :value="p.id">
                {{ p.name }} ({{ p.totalSlots }})
              </option>
            </select>
          </div>

          <!-- Zoom controls -->
          <div class="px-3 py-2 border-b border-slate-100">
            <label class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Zoom</label>
            <div class="mt-1 flex items-center gap-1">
              <button @click="emit('update:zoom', fitZoom)" class="px-1.5 py-0.5 rounded text-[10px] font-medium border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700" title="Fit">Fit</button>
              <button v-for="val in ZOOM_PRESETS" :key="val" @click="emit('update:zoom', val)" :class="['px-1.5 py-0.5 rounded text-[10px] font-medium border', isZoomActive(val) ? 'bg-primary-100 text-primary-700 border-primary-300' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700']">{{ Math.round(val * 100) }}%</button>
              <div class="flex items-center gap-1 ml-auto">
                <input type="range" min="0.25" max="1.5" step="0.05" :value="zoom" @input="emit('update:zoom', parseFloat(($event.target as HTMLInputElement).value))" class="w-16 h-1.5 accent-primary-500" aria-label="Zoom level" />
                <span class="text-[10px] font-medium text-slate-500 w-7 text-right tabular-nums">{{ Math.round(zoom * 100) }}%</span>
              </div>
            </div>
          </div>

          <!-- Customize + Tour + Help -->
          <div class="px-3 py-2 flex items-center gap-2">
            <button @click="emit('toggleCustomize'); showMoreMenu = false" class="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 border border-slate-200 hover:border-primary-200 transition-all duration-150">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Customize
            </button>
            <button @click="emit('start-tour'); showMoreMenu = false" class="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 border border-slate-200 hover:border-primary-200 transition-all duration-150">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Tour
            </button>
            <button @click="emit('show-shortcuts'); showMoreMenu = false" class="flex-1 inline-flex items-center justify-center px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 border border-slate-200 hover:border-primary-200 transition-all duration-150">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- ── Undo / Redo + Save status + Preview + Export ── -->
    <div class="flex items-center gap-1.5 order-4">
      <!-- Undo / Redo -->
      <div class="flex items-center gap-0.5 mr-1 border-r border-slate-200 pr-2">
        <button
          :disabled="!historyStore.canUndo"
          :class="['p-1.5 rounded-lg transition-colors', historyStore.canUndo ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-800' : 'text-slate-300 cursor-not-allowed']"
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
          @click="historyStore.undo()"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button
          :disabled="!historyStore.canRedo"
          :class="['p-1.5 rounded-lg transition-colors', historyStore.canRedo ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-800' : 'text-slate-300 cursor-not-allowed']"
          aria-label="Redo"
          title="Redo (Ctrl+Shift+Z)"
          @click="historyStore.redo()"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
        </button>
      </div>

      <!-- Save status -->
      <div class="relative h-5 flex items-center mr-1">
        <Transition name="save-status" mode="out-in">
          <span v-if="saveStatus.state === 'saving'" key="saving" class="text-[11px] text-slate-400 font-medium" aria-live="polite"><span class="inline-flex items-center gap-1">Saving<span class="animate-pulse">…</span></span></span>
          <span v-else-if="saveStatus.state === 'error'" key="error" class="text-[11px] text-red-500 font-medium" aria-live="polite">Save failed</span>
          <span v-else-if="isDirty" key="unsaved" class="text-[11px] text-amber-500 font-medium" aria-live="polite">Unsaved</span>
          <span v-else key="saved" class="text-[11px] text-emerald-500 font-medium" aria-live="polite">Saved</span>
        </Transition>
      </div>

      <!-- Preview button -->
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 transition-all duration-150"
        aria-label="Print preview"
        title="Preview"
        @click="emit('show-preview')"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>

      <!-- Export button -->
      <button
        type="button"
        class="btn-primary !px-3.5 !py-2 !text-xs flex items-center gap-1.5 justify-center"
        aria-label="Export (Ctrl+E)"
        title="Export (Ctrl+E)"
        @click="emit('export')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span class="hidden sm:inline">Export</span>
      </button>
    </div>

  </div>

  <!-- ── Truncation warning — appears briefly when switching to a smaller layout ── -->
  <Transition name="toast-fade">
    <div
      v-if="showTruncationWarning"
      class="mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 no-print"
      role="status"
      aria-live="polite"
    >
      <svg class="h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Some slots are hidden with this layout. Switch back to see them — no data is lost.</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { useHistoryStore } from '~/stores/history'
import { LAYOUT_PRESETS, getPreset } from '~/utils/layoutPresets'

/** Zoom preset values (excluding Fit which is dynamic). */
const ZOOM_PRESETS = [0.5, 0.75, 1.0] as const

const props = defineProps<{
  zoom: number
  fitZoom: number
  previewMode: boolean
}>()

const emit = defineEmits<{
  'update:zoom': [value: number]
  'update:previewMode': [value: boolean]
  'toggleCustomize': []
  /** Fired when the user clicks "Export" — opens the export dialog. */
  export: []
  /** Fired when the user clicks "Preview" — opens the print preview modal. */
  'show-preview': []
  /** Fired when the user clicks the help button — opens the shortcuts cheat sheet. */
  'show-shortcuts': []
  /** Fired when the user clicks "Take the tour" — relaunches the onboarding tour. */
  'start-tour': []
}>()

const chartStore = useChartStore()
const historyStore = useHistoryStore()
const { saveStatus, isDirty } = useChartStatus()

/**
 * Check whether a given zoom value matches the current zoom (within tolerance).
 * Used to highlight the active preset button.
 */
function isZoomActive(val: number): boolean {
  return Math.abs(props.zoom - val) < 0.01
}

const isEditing = ref(false)
const titleInput = ref(chartStore.title)
const titleInputRef = ref<HTMLInputElement | null>(null)

/** Whether the "More" dropdown menu is open. */
const showMoreMenu = ref(false)
const moreMenuRef = ref<HTMLElement | null>(null)

// Close more menu on Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showMoreMenu.value) {
    showMoreMenu.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ── Truncation warning ────────────────────────────────────────────────

const showTruncationWarning = ref(false)
let truncationTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => chartStore.layoutPreset,
  (newId, oldId) => {
    if (oldId && oldId !== newId) {
      const oldPreset = getPreset(oldId)
      const newPreset = getPreset(newId)
      if (newPreset.totalSlots < oldPreset.totalSlots) {
        showTruncationWarning.value = true
        if (truncationTimer) clearTimeout(truncationTimer)
        truncationTimer = setTimeout(() => {
          showTruncationWarning.value = false
        }, 4000)
      } else {
        // Switching to a larger or same-size layout — dismiss warning
        showTruncationWarning.value = false
        if (truncationTimer) clearTimeout(truncationTimer)
      }
    }
  },
)

onUnmounted(() => {
  if (truncationTimer) clearTimeout(truncationTimer)
})

function startEditing() {
  isEditing.value = true
  titleInput.value = chartStore.title
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

function saveTitle() {
  const trimmed = titleInput.value.trim()
  chartStore.setTitle(trimmed || 'My Communication Chart')
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  titleInput.value = chartStore.title
}
</script>
