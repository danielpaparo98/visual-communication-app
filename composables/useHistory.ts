import type { HistoryState } from '~/types'

/**
 * History Manager Composable
 * Implements the Memento pattern for undo/redo functionality
 */
export function useHistory(maxSize: number = 50) {
  const past = ref<HistoryState[]>([])
  const present = ref<HistoryState | null>(null)
  const future = ref<HistoryState[]>([])

  /**
   * Push a new state to the history
   */
  function push(state: HistoryState): void {
    if (present.value) {
      past.value.push(present.value)
    }

    present.value = state
    future.value = []

    // Limit history size
    if (past.value.length > maxSize) {
      past.value.shift()
    }
  }

  /**
   * Undo to the previous state
   */
  function undo(): HistoryState | null {
    if (past.value.length === 0) {
      return null
    }

    const previousState = past.value.pop()!

    if (present.value) {
      future.value.unshift(present.value)
    }

    present.value = previousState

    return present.value
  }

  /**
   * Redo to the next state
   */
  function redo(): HistoryState | null {
    if (future.value.length === 0) {
      return null
    }

    const nextState = future.value.shift()!

    if (present.value) {
      past.value.push(present.value)
    }

    present.value = nextState

    return present.value
  }

  /**
   * Clear all history
   */
  function clear(): void {
    past.value = []
    future.value = []
    present.value = null
  }

  /**
   * Check if undo is available
   */
  function canUndo(): boolean {
    return past.value.length > 0
  }

  /**
   * Check if redo is available
   */
  function canRedo(): boolean {
    return future.value.length > 0
  }

  /**
   * Get the current history size
   */
  function getHistorySize(): number {
    return past.value.length + future.value.length + (present.value ? 1 : 0)
  }

  /**
   * Persist history to localStorage
   */
  function saveToStorage(key: string): void {
    try {
      const data = {
        past: past.value.slice(-10), // Save last 10 states only
        present: present.value,
        future: future.value.slice(0, 5), // Save first 5 future states
      }
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save history to storage:', error)
    }
  }

  /**
   * Load history from localStorage
   */
  function loadFromStorage(key: string): boolean {
    try {
      const data = localStorage.getItem(key)
      if (data) {
        const parsed = JSON.parse(data)
        past.value = parsed.past || []
        present.value = parsed.present || null
        future.value = parsed.future || []
        return true
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error)
    }
    return false
  }

  return {
    past,
    present,
    future,
    push,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    getHistorySize,
    saveToStorage,
    loadFromStorage,
  }
}
