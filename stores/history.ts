import { defineStore } from 'pinia'
import type { ChartSlot } from '~/types/chart'
import { useChartStore } from '~/stores/chart'

/**
 * A snapshot of the chart state at a point in time for undo/redo.
 */
export interface ChartSnapshot {
  slots: ChartSlot[]
  title: string
  timestamp: number
}

/** Maximum number of undo/redo steps in each direction. */
const MAX_HISTORY = 50

/**
 * Deep-clone a slots array so icon/style nested objects are independent
 * from the live store state. Prevents snapshot corruption when nested
 * objects are mutated in place.
 */
function deepCloneSlots(slots: ChartSlot[]): ChartSlot[] {
  return slots.map((s) => ({
    ...s,
    icon: s.icon ? { ...s.icon } : null,
    ...(s.style ? { style: { ...s.style } } : {}),
  }))
}

/**
 * Build a deep-cloned snapshot from live store state.
 */
function deepCloneSnapshot(slots: ChartSlot[], title: string): ChartSnapshot {
  return {
    slots: deepCloneSlots(slots),
    title,
    timestamp: Date.now(),
  }
}

/**
 * Pinia store managing undo/redo history for the chart editor.
 *
 * - {@link pushSnapshot} stores the state **before** a mutation.
 * - {@link undo} restores the previous state and pushes current to redo stack.
 * - {@link redo} restores the next state and pushes current to undo stack.
 * - {@link clear} resets both stacks (call when switching charts).
 */
export const useHistoryStore = defineStore('history', () => {
  // ── State ────────────────────────────────────────────────────────────────

  /** Previous chart states (most recent at end — LIFO). */
  const past = ref<ChartSnapshot[]>([])

  /** Future chart states available for redo (most recent at end — LIFO). */
  const future = ref<ChartSnapshot[]>([])

  // ── Getters ──────────────────────────────────────────────────────────────

  /** True when at least one undo step is available. */
  const canUndo = computed(() => past.value.length > 0)

  /** True when at least one redo step is available. */
  const canRedo = computed(() => future.value.length > 0)

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Record a snapshot of the chart state **before** a mutation.
   *
   * Clears the redo stack — any new action invalidates redo history
   * so the user can't redo after making a new change.
   */
  function pushSnapshot(snapshot: ChartSnapshot): void {
    past.value.push(snapshot)
    if (past.value.length > MAX_HISTORY) {
      past.value.shift()
    }
    // Any new action invalidates the redo stack
    future.value = []
  }

  /**
   * Undo the last mutation: restore the most recent past state.
   *
   * The current chart state is pushed onto the future (redo) stack
   * so the user can redo the undone action if needed.
   */
  function undo(): void {
    if (!canUndo.value) return

    const chartStore = useChartStore()
    const snapshot = past.value.pop()!

    // Save current state to future (redo) stack — deep-clone nested objects
    future.value.push(deepCloneSnapshot(chartStore.slots, chartStore.title))

    // Restore the past state into the chart store — deep-clone again so
    // the store doesn't hold the same object refs as the snapshot.
    const restored = deepCloneSlots(snapshot.slots)
    chartStore.$patch({
      slots: restored,
      title: snapshot.title,
    })
  }

  /**
   * Redo a previously undone mutation: restore the most recent future state.
   */
  function redo(): void {
    if (!canRedo.value) return

    const chartStore = useChartStore()
    const snapshot = future.value.pop()!

    // Save current state to past (undo) stack
    past.value.push(deepCloneSnapshot(chartStore.slots, chartStore.title))

    // Restore the future state into the chart store
    const restored = deepCloneSlots(snapshot.slots)
    chartStore.$patch({
      slots: restored,
      title: snapshot.title,
    })
  }

  /**
   * Clear all history stacks.
   *
   * Call when loading a different chart so each chart gets its own
   * undo/redo history.
   */
  function clear(): void {
    past.value = []
    future.value = []
  }

  return {
    // State
    past,
    future,
    // Getters
    canUndo,
    canRedo,
    // Actions
    pushSnapshot,
    undo,
    redo,
    clear,
  }
})
