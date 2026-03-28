import type { ChartSaveDataV3 } from '~/types'

/**
 * Debounced Save Composable
 * Debounces localStorage saves with configurable delay and auto-save indicator
 */
export function useDebouncedSave(delay: number = 1000) {
  const isSaving = ref(false)
  const lastSaved = ref<Date | null>(null)
  const saveTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const saveCount = ref(0)

  /**
   * Debounce a save operation
   */
  function debounceSave(saveFn: () => void): void {
    if (saveTimer.value) {
      clearTimeout(saveTimer.value)
    }

    saveTimer.value = setTimeout(() => {
      isSaving.value = true
      saveFn()
      lastSaved.value = new Date()
      saveCount.value++
      isSaving.value = false
    }, delay)
  }

  /**
   * Cancel pending save
   */
  function cancelPendingSave(): void {
    if (saveTimer.value) {
      clearTimeout(saveTimer.value)
      saveTimer.value = null
    }
  }

  /**
   * Force immediate save
   */
  function forceSave(saveFn: () => void): void {
    cancelPendingSave()
    isSaving.value = true
    saveFn()
    lastSaved.value = new Date()
    saveCount.value++
    isSaving.value = false
  }

  /**
   * Get formatted last saved time
   */
  function getLastSavedText(): string {
    if (!lastSaved.value) {
      return 'Not saved yet'
    }

    const now = new Date()
    const diffMs = now.getTime() - lastSaved.value.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) {
      return 'Just now'
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    } else {
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else {
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      }
    }
  }

  /**
   * Check if save is needed
   */
  function needsSave(data: ChartSaveDataV3, lastSavedData: ChartSaveDataV3 | null): boolean {
    if (!lastSavedData) {
      return true
    }

    return JSON.stringify(data) !== JSON.stringify(lastSavedData)
  }

  /**
   * Reset save state
   */
  function reset(): void {
    cancelPendingSave()
    isSaving.value = false
    lastSaved.value = null
    saveCount.value = 0
  }

  return {
    isSaving,
    lastSaved,
    saveCount,
    debounceSave,
    cancelPendingSave,
    forceSave,
    getLastSavedText,
    needsSave,
    reset,
  }
}
