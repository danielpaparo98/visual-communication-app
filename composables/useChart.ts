import type { ChartData, ChartSlot, SaveStatus } from '~/types/chart'

const STORAGE_KEY = 'ttc-chart-data'
const BACKUP_KEY = 'ttc-chart-data-backup'

// Module-level singleton state — avoids useState / Nuxt app context dependency,
// which can cause "__vrv_devtools instance is null" errors in SPA mode.
const title: Ref<string> = ref('My Communication Chart')
const slots: Ref<ChartSlot[]> = ref(
  Array.from({ length: 20 }, (): ChartSlot => ({ icon: null, label: '' }))
)
const loading: Ref<boolean> = ref(true)
const loadError: Ref<string | null> = ref(null)
const corrupted: Ref<boolean> = ref(false)

// Save status — surfaced to UI so users know when their work is persisted.
const saveStatus: Ref<SaveStatus> = ref({ state: 'saved', message: null })

// ── Initialisation ────────────────────────────────────────────────────────

if (import.meta.client) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data: ChartData = JSON.parse(raw)
      if (validateData(data)) {
        if (data.title) title.value = data.title
        if (data.slots?.length === 20) slots.value = data.slots
      } else {
        // Data is corrupted — try loading from backup
        const backupRaw = localStorage.getItem(BACKUP_KEY)
        if (backupRaw) {
          try {
            const backup: ChartData = JSON.parse(backupRaw)
            if (validateData(backup)) {
              if (backup.title) title.value = backup.title
              if (backup.slots?.length === 20) slots.value = backup.slots
              corrupted.value = true // Signal to UI that we recovered from backup
            }
          } catch {
            // Backup also corrupt — will start fresh
          }
        }
      }
    }
  } catch {
    loadError.value = 'Could not load your saved chart. Your browser may have storage restrictions.'
  }
  loading.value = false
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Minimal validation so we don't silently accept garbage JSON. */
function validateData(data: unknown): data is ChartData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  if (typeof d.title !== 'string') return false
  if (!Array.isArray(d.slots)) return false
  return d.slots.every(
    (s: unknown) =>
      s !== null &&
      typeof s === 'object' &&
      (s as Record<string, unknown>).label !== undefined
  )
}

// ── Composable ────────────────────────────────────────────────────────────

export function useChart() {
  function save() {
    try {
      saveStatus.value = { state: 'saving', message: null }
      const data: ChartData = { title: toValue(title), slots: toValue(slots) }
      const serialized = JSON.stringify(data)

      // Write primary + backup
      localStorage.setItem(STORAGE_KEY, serialized)
      localStorage.setItem(BACKUP_KEY, serialized)

      saveStatus.value = { state: 'saved', message: null }
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'QuotaExceededError'
          ? 'Storage is full. Try removing some icons or labels, or export your chart.'
          : 'Could not save changes. Your browser may have storage restrictions.'
      saveStatus.value = { state: 'error', message }
    }
  }

  function reset() {
    title.value = 'My Communication Chart'
    slots.value = Array.from({ length: 20 }, (): ChartSlot => ({ icon: null, label: '' }))
    corrupted.value = false
    loadError.value = null
    save()
  }

  /** Call after the user acknowledges the corruption message. */
  function dismissCorruptionWarning() {
    corrupted.value = false
  }

  return {
    chart: { title, slots, save, reset },
    loading,
    loadError,
    corrupted,
    saveStatus,
    dismissCorruptionWarning,
  }
}
