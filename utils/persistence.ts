import type { ChartData } from '~/types/chart'
import { STORAGE_KEYS } from '~/utils/config'

// ── Key helpers ──────────────────────────────────────────────────────────

/** localStorage key for the primary copy of a chart. */
function primaryKey(id: string): string {
  return `${STORAGE_KEYS.CHART_DATA_PREFIX}${id}`
}

/** localStorage key for the `n`th backup of a chart (0 = newest). */
function backupKey(id: string, index: number): string {
  return `${STORAGE_KEYS.CHART_DATA_PREFIX}${id}-backup-${index}`
}

// ── Internal helpers ─────────────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Read & parse a value from storage.
 * Returns `{ data, raw }` so callers can re-serialise the raw string
 * without double-encoding when rotating backups.
 */
function readFromStorage<T>(key: string): { data: T | null; raw: string | null } {
  if (!isClient()) return { data: null, raw: null }
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return { data: null, raw: null }
    const parsed = JSON.parse(raw) as T
    return { data: parsed, raw }
  } catch {
    return { data: null, raw: null }
  }
}

function writeRawToStorage(key: string, raw: string): void {
  if (!isClient()) return
  localStorage.setItem(key, raw)
}

function removeFromStorage(key: string): void {
  if (!isClient()) return
  localStorage.removeItem(key)
}

// ── Validation ───────────────────────────────────────────────────────────

/**
 * Minimal structural validation for a parsed `ChartData` object.
 *
 * Rules:
 * - Must be a non-null object
 * - Must have a `title` of type `string`
 * - Must have a `slots` array (length is validated only at the store level)
 *
 * This keeps the persistence layer generic — it does not import slot-level
 * types or 20-slot grid invariants.
 */
function isValidChartData(value: unknown): value is ChartData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  if (typeof candidate.title !== 'string') return false
  if (!Array.isArray(candidate.slots)) return false
  return true
}

// ── Backup rotation ──────────────────────────────────────────────────────

/**
 * Rotate the backup slots for a chart **before** writing new primary data.
 *
 * Layout:
 *   backup-2 ← old backup-1 (LRU, dropped from rotation)
 *   backup-1 ← old backup-0
 *   backup-0 ← old primary
 *   primary  ← (caller writes new data via {@link saveChartData})
 *
 * This guarantees that at any point the 3 most recent valid versions
 * are available for recovery.
 */
export function rotateBackups(id: string): void {
  if (!isClient()) return

  const count = STORAGE_KEYS.BACKUP_COUNT // 3

  // 1. Drop the oldest backup from rotation
  removeFromStorage(backupKey(id, count - 1))

  // 2. Shift newer backups down the chain (ascending index = older)
  for (let i = count - 1; i > 0; i--) {
    const { raw } = readFromStorage<unknown>(backupKey(id, i - 1))
    if (raw !== null) {
      writeRawToStorage(backupKey(id, i), raw)
    }
  }

  // 3. Demote current primary to backup-0
  const { raw: primaryRaw } = readFromStorage<unknown>(primaryKey(id))
  if (primaryRaw !== null) {
    writeRawToStorage(backupKey(id, 0), primaryRaw)
  }
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Save chart data with backup rotation.
 *
 * 1. Rotates existing backups (current primary → backup-0, etc.)
 * 2. Writes the new data as the primary entry
 *
 * @throws {Error} A user-friendly message when `QuotaExceededError` is
 *   caught so the UI can display it in a toast or banner.
 */
export function saveChartData(id: string, data: ChartData): void {
  if (!isClient()) return

  rotateBackups(id)

  try {
    writeRawToStorage(primaryKey(id), JSON.stringify(data))
  } catch (err: unknown) {
    if (err instanceof DOMException) {
      // QuotaExceededError — most browsers use name, some use legacy code
      if (err.name === 'QuotaExceededError' || (err as DOMException & { code: number }).code === 22) {
        throw new Error(
          'Not enough storage space. Please delete some old charts to free up room.',
        )
      }
    }
    throw err
  }
}

/**
 * Load chart data with automatic corruption recovery.
 *
 * Recovery chain:
 *   1. Primary key → if valid, return immediately
 *   2. Backup-0    → if valid, restore primary from backup-0, return
 *   3. Backup-1    → if valid, restore primary from backup-1, return
 *   4. Backup-2    → if valid, restore primary from backup-2, return
 *   5. Fallback    → `console.warn` and return `null`
 *
 * Each recovery attempt writes the recovered backup back to the primary key
 * so that the next load is fast even if the original primary was corrupt.
 *
 * @returns The deserialised `ChartData` or `null` when no valid copy exists.
 */
export function loadChartData(id: string): ChartData | null {
  if (!isClient()) return null

  // 1. Try primary
  const { data: primary } = readFromStorage<ChartData>(primaryKey(id))
  if (primary !== null && isValidChartData(primary)) {
    return primary
  }

  // Primary was missing or corrupt → log and attempt chain recovery
  if (primary === null) {
    console.warn(`[Persistence] No primary data found for chart "${id}". Checking backups...`)
  } else {
    console.warn(`[Persistence] Corrupt primary data for chart "${id}". Attempting backup recovery...`)
  }

  // 2–4. Try backups newest-first
  for (let i = 0; i < STORAGE_KEYS.BACKUP_COUNT; i++) {
    const { data: backup } = readFromStorage<ChartData>(backupKey(id, i))
    if (backup !== null && isValidChartData(backup)) {
      console.warn(`[Persistence] Recovered chart "${id}" from backup-${i}. Restoring primary.`)
      // Restore primary so the next load hits the fast path
      try {
        writeRawToStorage(primaryKey(id), JSON.stringify(backup))
      } catch {
        // best-effort — if quota is tight we at least returned valid data
      }
      return backup
    }
  }

  // 5. Nothing worked
  console.warn(
    `[Persistence] No valid data found for chart "${id}" in primary or any backup.`,
  )
  return null
}

/**
 * Delete chart data **and all backups** from localStorage.
 *
 * Should be called when a user deletes a chart from the manager.
 * Does **not** affect the chart-manager metadata (summary list / active id).
 */
export function deleteChartData(id: string): void {
  if (!isClient()) return

  removeFromStorage(primaryKey(id))
  for (let i = 0; i < STORAGE_KEYS.BACKUP_COUNT; i++) {
    removeFromStorage(backupKey(id, i))
  }
}

/**
 * Return every chart id that has data stored in localStorage.
 *
 * Scans all keys; matches those that start with the chart data prefix
 * and do **not** contain `-backup-`.
 */
export function listChartIds(): string[] {
  if (!isClient()) return []

  const ids: string[] = []
  const prefix = STORAGE_KEYS.CHART_DATA_PREFIX

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix) && !key.includes('-backup-')) {
      const id = key.slice(prefix.length)
      if (id) ids.push(id)
    }
  }

  return ids
}

/**
 * Estimate current localStorage usage.
 *
 * Usage is computed by summing the character length of every key + value
 * and multiplying by 2 (JavaScript uses UTF-16, so each char is 2 bytes).
 *
 * Browsers typically allow 5–10 MB of storage per origin. We use a
 * conservative 5 MB as the assumed quota.
 *
 * @returns An object with:
 *   - `used`   — estimated bytes used
 *   - `quota`  — assumed quota in bytes (or `null` if unavailable)
 *   - `percent` — `used / quota * 100`, rounded to 2 decimals
 */
export function getStorageUsage(): { used: number; quota: number | null; percent: number } {
  if (!isClient()) {
    return { used: 0, quota: null, percent: 0 }
  }

  let totalChars = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      totalChars += key.length + (value?.length ?? 0)
    }
  }

  // Each UTF-16 code unit is 2 bytes
  const used = totalChars * 2

  // Conservative default: most browsers allocate 5–10 MB per origin
  const quota = 5 * 1024 * 1024 // 5 MB
  const percent = quota > 0 ? Math.round((used / quota) * 10_000) / 100 : 0

  return { used, quota, percent }
}
