import { defineStore } from 'pinia'
import type { ExportQuality } from '~/utils/exportFilename'
import type { ExportFormat } from '~/types/export'

// ── Constants ──────────────────────────────────────────────────────────────

/** localStorage key for the persisted export preferences blob. */
const STORAGE_KEY = 'ttc-export-prefs'

/** Defaults applied when nothing (or something invalid) is persisted. */
const DEFAULT_QUALITY: ExportQuality = 'normal'
const DEFAULT_FORMAT: ExportFormat = 'pdf'

const VALID_QUALITIES: readonly ExportQuality[] = ['draft', 'normal', 'high']
const VALID_FORMATS: readonly ExportFormat[] = ['pdf', 'png']

// ── Helpers ────────────────────────────────────────────────────────────────

interface PersistedPrefs {
  lastQuality: ExportQuality
  lastFormat: ExportFormat
}

function isExportQuality(value: unknown): value is ExportQuality {
  return typeof value === 'string' && (VALID_QUALITIES as readonly string[]).includes(value)
}

function isExportFormat(value: unknown): value is ExportFormat {
  return typeof value === 'string' && (VALID_FORMATS as readonly string[]).includes(value)
}

/**
 * Read & validate persisted preferences, falling back to the defaults for
 * any missing or unrecognised fields. A corrupt blob is silently ignored
 * so a bad localStorage value can never crash the app.
 */
function loadPrefs(): PersistedPrefs {
  const prefs: PersistedPrefs = {
    lastQuality: DEFAULT_QUALITY,
    lastFormat: DEFAULT_FORMAT,
  }
  if (!import.meta.client) return prefs

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return prefs
    const parsed = JSON.parse(raw) as Partial<PersistedPrefs>
    if (isExportQuality(parsed.lastQuality)) prefs.lastQuality = parsed.lastQuality
    if (isExportFormat(parsed.lastFormat)) prefs.lastFormat = parsed.lastFormat
  } catch {
    // Swallow parse errors — preferences are non-critical.
  }

  return prefs
}

function persistPrefs(prefs: PersistedPrefs): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Storage may be unavailable (private mode / quota) — preferences just
    // won't survive a reload, which is an acceptable degradation.
  }
}

// ── Store ──────────────────────────────────────────────────────────────────

/**
 * Pinia store remembering the user's last-used export settings.
 *
 * The dialog initialises its format / quality selectors from these values
 * so repeat exports are a single click. Every change is immediately written
 * to localStorage under {@link STORAGE_KEY}.
 */
export const useExportPreferencesStore = defineStore('exportPreferences', () => {
  // ── State ──────────────────────────────────────────────────────────────

  const initial = loadPrefs()

  /** Last-selected pixel-ratio level, or `'normal'` for first-time users. */
  const lastQuality = ref<ExportQuality>(initial.lastQuality)

  /** Last-selected output format, or `'pdf'` for first-time users. */
  const lastFormat = ref<ExportFormat>(initial.lastFormat)

  // ── Actions ────────────────────────────────────────────────────────────

  /** Persist the current selections back to localStorage. */
  function save(): void {
    persistPrefs({
      lastQuality: lastQuality.value,
      lastFormat: lastFormat.value,
    })
  }

  /** Update the remembered quality level and persist it. */
  function setQuality(quality: ExportQuality): void {
    lastQuality.value = quality
    save()
  }

  /** Update the remembered output format and persist it. */
  function setFormat(format: ExportFormat): void {
    lastFormat.value = format
    save()
  }

  return {
    // State
    lastQuality,
    lastFormat,
    // Actions
    setQuality,
    setFormat,
  }
})
