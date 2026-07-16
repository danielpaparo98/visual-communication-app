import type { SaveStatus } from '~/types/chart'
import { getStorageUsage } from '~/utils/persistence'
import { useChartStore } from '~/stores/chart'
import { useChartManagerStore } from '~/stores/chartManager'

/**
 * Singleton status refs for UI concerns that are separate from the pure
 * chart state managed by the Pinia store.
 *
 * Kept as module-level refs (same pattern as the original useChart) so that
 * all consumers share the same reactive instances without requiring a Nuxt
 * plugin or context.
 *
 * Covers: chart-data load status, corruption warnings, save-status toast,
 * storage-quota warnings, auto-save debounce, and dirty-state tracking.
 */

const loading = ref(false)
const loadError = ref<string | null>(null)
const corrupted = ref(false)

const saveStatus = ref<SaveStatus>({ state: 'saved', message: null })

/**
 * `true` when the user has made unsaved changes since the last successful
 * save.  Set immediately on user actions via {@link markDirty}, cleared
 * after the auto-save debounce completes successfully.
 */
const isDirty = ref(false)

// ── Storage quota warnings ───────────────────────────────────────────────

/**
 * Whether the user should see a quota warning banner.
 * Set to `true` when storage usage exceeds the safe threshold (80 %).
 */
const quotaExceeded = ref(false)

/** Human-readable description of current storage usage. */
const quotaMessage = ref<string | null>(null)

/** Last-known storage usage snapshot (refreshed on explicit call). */
const storageUsage = ref<{ used: number; quota: number | null; percent: number }>({
  used: 0,
  quota: null,
  percent: 0,
})

// ── Auto-save internals ──────────────────────────────────────────────────

/** Handle returned by `watch()` — used to tear down the watcher on unmount. */
let _autoSaveWatcher: (() => void) | null = null

/** Pending debounce timer for the auto-save. */
let _debounceTimer: ReturnType<typeof setTimeout> | null = null

/**
 * `beforeunload` handler added to `window` when auto-save is active.
 * Stored as a stable reference so it can be removed later.
 */
function handleBeforeUnload(event: BeforeUnloadEvent): void {
  if (isDirty.value) {
    event.preventDefault()
    // Modern browsers ignore the string message but still show the dialog.
    event.returnValue = ''
  }
}

export function useChartStatus() {
  function dismissCorruptionWarning() {
    corrupted.value = false
  }

  /**
   * Check localStorage usage and update the quota-warning state.
   *
   * Call this after any save / delete operation so the banner reflects
   * the current usage.
   */
  function checkStorageQuota(): void {
    if (!import.meta.client) return

    storageUsage.value = getStorageUsage()
    const { used, quota, percent } = storageUsage.value

    // Warn at 80 % usage or when fewer than ~200 KB remain
    const SAFE_THRESHOLD = 80 // percent
    const MIN_REMAINING = 200 * 1024 // 200 KB

    if (percent >= SAFE_THRESHOLD || (quota !== null && quota - used < MIN_REMAINING)) {
      quotaExceeded.value = true
      const usedKb = Math.round(used / 1024)
      const quotaKb = quota !== null ? Math.round(quota / 1024) : '?'
      quotaMessage.value = `Storage nearly full (${usedKb} KB / ${quotaKb} KB). Delete old charts to free up space.`
    } else {
      quotaExceeded.value = false
      quotaMessage.value = null
    }
  }

  function dismissQuotaWarning(): void {
    quotaExceeded.value = false
  }

  // ── Auto-save & dirty-tracking ──────────────────────────────────────────

  /**
   * Start the auto-save debounce watcher and register the `beforeunload`
   * handler.
   *
   * Call once from the chart page `onMounted` **after** the initial chart
   * data has been loaded (e.g. after `setActiveChart`).  The watcher is lazy
   * so the initial load does **not** trigger a save.
   *
   * Behaviour:
   * - Watches `chartStore.asChartData` for any mutation
   * - Debounces 1500 ms after the **last** change
   * - On trigger: sets `saveStatus` to `'saving'`, calls
   *   `managerStore.saveCurrentChart()`, then sets `'saved'` and clears
   *   `isDirty`
   * - On error: sets `'error'` with a message; `isDirty` stays `true` so the
   *   user knows there are unsaved changes
   *
   * @param chartStore   — the single-chart Pinia store instance
   * @param managerStore — the multi-chart manager Pinia store instance
   */
  function startAutoSave(
    chartStore: ReturnType<typeof useChartStore>,
    managerStore: ReturnType<typeof useChartManagerStore>,
  ): void {
    // Tear down any previous watcher / timer first (safety for HMR or
    // re-invocation).
    stopAutoSave()

    _autoSaveWatcher = watch(
      () => chartStore.asChartData,
      () => {
        // Mark dirty the instant a mutation is detected.  The watcher fires
        // asynchronously so the user may see "Unsaved changes" slightly
        // before "Saving…" — this is intentional.
        isDirty.value = true

        if (_debounceTimer) clearTimeout(_debounceTimer)
        _debounceTimer = setTimeout(() => {
          saveStatus.value = { state: 'saving', message: null }

          // Yield to the microtask queue so Vue has a chance to flush the
          // 'saving' state to the DOM before the (synchronous) save begins.
          nextTick(() => {
            try {
              managerStore.saveCurrentChart()
              saveStatus.value = { state: 'saved', message: null }
              isDirty.value = false
            } catch (err: unknown) {
              const message =
                err instanceof Error
                  ? err.message
                  : 'Save failed. Please try again.'
              saveStatus.value = { state: 'error', message }
              // isDirty stays true — the user still has unsaved changes
            }
          })
        }, 1500)
      },
    )

    if (import.meta.client) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }
  }

  /**
   * Immediately persist the current chart state and update the save status.
   *
   * Cancels any pending auto-save debounce so we don't double-save. Used by
   * the manual-save keyboard shortcut (Ctrl+S) — the user explicitly asked
   * to save, so we skip the debounce and write right away.
   *
   * @param chartStore   — the single-chart Pinia store instance
   * @param managerStore — the multi-chart manager Pinia store instance
   */
  function saveNow(
    chartStore: ReturnType<typeof useChartStore>,
    managerStore: ReturnType<typeof useChartManagerStore>,
  ): void {
    // Cancel any pending auto-save so we don't write twice.
    if (_debounceTimer) {
      clearTimeout(_debounceTimer)
      _debounceTimer = null
    }

    saveStatus.value = { state: 'saving', message: null }
    try {
      managerStore.saveCurrentChart()
      saveStatus.value = { state: 'saved', message: null }
      isDirty.value = false
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Save failed. Please try again.'
      saveStatus.value = { state: 'error', message }
      // isDirty stays true — the user still has unsaved changes
    }
  }

  /**
   * Tear down the auto-save watcher, cancel any pending debounce, and
   * remove the `beforeunload` handler.
   *
   * Call from the chart page `onUnmounted`.
   */
  function stopAutoSave(): void {
    if (_autoSaveWatcher) {
      _autoSaveWatcher()
      _autoSaveWatcher = null
    }
    if (_debounceTimer) {
      clearTimeout(_debounceTimer)
      _debounceTimer = null
    }
    if (import.meta.client) {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }

  /**
   * Immediately mark the chart as dirty.
   *
   * Call synchronously from user-action handlers (e.g. `onSlotSelect`,
   * `onIconSelect`, `onLabelUpdate`) so the "Unsaved changes" indicator
   * appears instantly — before the watcher's async callback fires.
   */
  function markDirty(): void {
    isDirty.value = true
  }

  return {
    loading,
    loadError,
    corrupted,
    saveStatus,
    isDirty,
    quotaExceeded,
    quotaMessage,
    storageUsage,
    dismissCorruptionWarning,
    checkStorageQuota,
    dismissQuotaWarning,
    startAutoSave,
    stopAutoSave,
    markDirty,
    saveNow,
  }
}
