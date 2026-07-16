import { defineStore } from 'pinia'
import type { ChartData, ChartSummary } from '~/types/chart'
import { useChartStore } from '~/stores/chart'
import { useHistoryStore } from '~/stores/history'
import { STORAGE_KEYS } from '~/utils/config'
import {
  saveChartData,
  loadChartData,
  deleteChartData,
} from '~/utils/persistence'

// ── Constants ────────────────────────────────────────────────────────────

const MAX_CHARTS = STORAGE_KEYS.MAX_CHARTS

// ── Helpers ──────────────────────────────────────────────────────────────

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

/** Load & parse a value from localStorage (for manager metadata only). */
function loadPersisted<T>(key: string): T | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** Serialise & store a value to localStorage (for manager metadata only). */
function persistMeta(key: string, value: unknown): void {
  if (!import.meta.client) return
  localStorage.setItem(key, JSON.stringify(value))
}

// ── Store ────────────────────────────────────────────────────────────────

/**
 * Multi-chart manager store.
 *
 * Tracks all saved chart summaries in memory, persists them to localStorage,
 * and coordinates loading/saving individual chart data into the single-chart
 * `useChartStore`.
 */
export const useChartManagerStore = defineStore('chartManager', () => {
  // ── State ──────────────────────────────────────────────────────────────

  /** Sorted list of chart summaries. */
  const charts = ref<ChartSummary[]>(loadPersisted<ChartSummary[]>(STORAGE_KEYS.CHART_MANAGER) ?? [])

  /** The currently active (open) chart id, persisted across sessions. */
  const activeChartId = ref<string | null>(loadPersisted<string>(STORAGE_KEYS.CHART_ACTIVE) ?? null)

  // ── Getters ────────────────────────────────────────────────────────────

  /** Charts sorted by most-recently-updated first. */
  const chartList = computed(() =>
    [...charts.value].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
  )

  /**
   * The full `ChartData` for the active chart.
   * Reads from the in-memory `useChartStore` so it stays reactive.
   */
  const activeChart = computed<ChartData | null>(() => {
    if (!activeChartId.value) return null
    return useChartStore().asChartData
  })

  /** Total number of saved charts. */
  const chartCount = computed(() => charts.value.length)

  /** Whether the user can create additional charts (max 20). */
  const canCreateMore = computed(() => charts.value.length < MAX_CHARTS)

  // ── Actions ────────────────────────────────────────────────────────────

  /**
   * Create a new blank chart, persist it, and set it as active.
   * Returns the new chart id.
   */
  function createChart(title?: string): string {
    const id = generateId()
    const now = new Date().toISOString()
    const chartTitle = title?.trim() || 'My Communication Chart'

    const summary: ChartSummary = {
      id,
      title: chartTitle,
      slotCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    const emptyData: ChartData = {
      title: chartTitle,
      slots: Array.from({ length: 20 }, () => ({ icon: null, label: '' })),
      layoutPreset: '4x5',
    }

    saveChartData(id, emptyData)
    charts.value.push(summary)
    persistMeta(STORAGE_KEYS.CHART_MANAGER, charts.value)

    // Load into the chart store and set as active
    const chartStore = useChartStore()
    chartStore.loadFromData(emptyData)
    activeChartId.value = id
    persistMeta(STORAGE_KEYS.CHART_ACTIVE, id)

    return id
  }

  /**
   * Remove a chart by id.  If the deleted chart was active, falls back
   * to the first remaining chart (or null).
   */
  function deleteChart(id: string): void {
    const idx = charts.value.findIndex((c) => c.id === id)
    if (idx === -1) return

    charts.value.splice(idx, 1)
    deleteChartData(id)
    persistMeta(STORAGE_KEYS.CHART_MANAGER, charts.value)

    if (activeChartId.value === id) {
      activeChartId.value = charts.value.length > 0 ? charts.value[0].id : null
      persistMeta(STORAGE_KEYS.CHART_ACTIVE, activeChartId.value)
    }
  }

  /** Update a chart's title. */
  function renameChart(id: string, title: string): void {
    const chart = charts.value.find((c) => c.id === id)
    if (!chart) return

    chart.title = title.trim() || 'My Communication Chart'
    chart.updatedAt = new Date().toISOString()
    persistMeta(STORAGE_KEYS.CHART_MANAGER, charts.value)

    // Also persist the updated title into the chart data
    const data = loadChartData(id)
    if (data) {
      data.title = chart.title
      saveChartData(id, data)
    }
  }

  /**
   * Deep-copy an existing chart.
   * Returns the new chart id, or `null` if the source doesn't exist.
   */
  function duplicateChart(id: string): string | null {
    const original = charts.value.find((c) => c.id === id)
    if (!original) return null

    const data = loadChartData(id)
    if (!data) return null

    const newId = generateId()
    const now = new Date().toISOString()
    const newTitle = `${original.title} (Copy)`

    const summary: ChartSummary = {
      id: newId,
      title: newTitle,
      slotCount: original.slotCount,
      createdAt: now,
      updatedAt: now,
    }

    saveChartData(newId, { ...data, title: newTitle })
    charts.value.push(summary)
    persistMeta(STORAGE_KEYS.CHART_MANAGER, charts.value)

    return newId
  }

  /**
   * Switch the active chart, loading its data into `useChartStore`.
   * Does nothing if the chart doesn't exist.
   */
  function setActiveChart(id: string): void {
    if (!charts.value.some((c) => c.id === id)) return

    // If switching to a different chart, clear the undo/redo history
    if (activeChartId.value !== id) {
      useHistoryStore().clear()
    }

    const data = loadChartData(id)
    if (data) {
      useChartStore().loadFromData(data)
    }

    activeChartId.value = id
    persistMeta(STORAGE_KEYS.CHART_ACTIVE, id)
  }

  /**
   * Persist the current `useChartStore` state back to the active chart.
   * Updates the summary (title, slot-count, timestamps).
   */
  function saveCurrentChart(): void {
    const id = activeChartId.value
    if (!id) return

    const chartStore = useChartStore()
    const data = chartStore.asChartData

    saveChartData(id, data)

    const summary = charts.value.find((c) => c.id === id)
    if (summary) {
      summary.title = data.title
      summary.slotCount = chartStore.filledSlotCount
      summary.updatedAt = new Date().toISOString()
      persistMeta(STORAGE_KEYS.CHART_MANAGER, charts.value)
    }
  }

  return {
    // State
    charts,
    activeChartId,
    // Getters
    chartList,
    activeChart,
    chartCount,
    canCreateMore,
    // Actions
    createChart,
    deleteChart,
    renameChart,
    duplicateChart,
    setActiveChart,
    saveCurrentChart,
  }
})
