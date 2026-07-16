/**
 * Layout preset definitions for dynamic chart grid sizing.
 *
 * Each preset defines a columns × rows grid. Switching presets changes
 * the visible slot count without destroying slot data — hidden slots
 * are preserved so users can switch back without losing work.
 */

export interface LayoutPreset {
  /** Unique identifier (e.g. '4x5', '2x5'). */
  id: string
  /** Human-readable short name. */
  name: string
  /** Short description including dimensions. */
  description: string
  /** Number of grid columns. */
  columns: number
  /** Number of grid rows. */
  rows: number
  /** Total available slots (columns × rows). */
  totalSlots: number
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  { id: '4x5', name: 'Standard', description: '4 × 5 grid (20 slots)', columns: 4, rows: 5, totalSlots: 20 },
  { id: '2x5', name: 'Wide', description: '2 × 5 grid (10 slots) — larger cards', columns: 2, rows: 5, totalSlots: 10 },
  { id: '4x3', name: 'Compact', description: '4 × 3 grid (12 slots)', columns: 4, rows: 3, totalSlots: 12 },
  { id: '3x4', name: 'Balanced', description: '3 × 4 grid (12 slots)', columns: 3, rows: 4, totalSlots: 12 },
  { id: '5x4', name: 'Dense', description: '5 × 4 grid (20 slots) — smaller cards', columns: 5, rows: 4, totalSlots: 20 },
  { id: '6x6', name: 'Full', description: '6 × 6 grid (36 slots) — maximum', columns: 6, rows: 6, totalSlots: 36 },
]

/**
 * Look up a layout preset by its id.
 * Throws if the id is unknown — treat as a development-time assertion.
 */
export function getPreset(id: string): LayoutPreset {
  const preset = LAYOUT_PRESETS.find((p) => p.id === id)
  if (!preset) {
    throw new Error(`Unknown layout preset "${id}". Available: ${LAYOUT_PRESETS.map((p) => p.id).join(', ')}`)
  }
  return preset
}

/** Return the default preset used for new charts. */
export function getDefaultPreset(): LayoutPreset {
  return LAYOUT_PRESETS[0] // '4x5'
}
