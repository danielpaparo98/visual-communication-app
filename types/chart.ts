/**
 * Chart data model shared across all components.
 *
 * These types are intentionally kept in a single file so that
 * the store, components, and persistence layer all speak the same
 * language without re-definitions or import chains.
 */

/** The icon object assigned to a chart slot. */
export interface ChartSlotIcon {
  id: string
  filename: string
  alt: string
  category: string
}

/** Per-card style overrides applied on top of the active theme. */
export interface ChartSlotStyle {
  /** Overrides the card's background color (theme surface by default). */
  backgroundColor?: string
  /** Overrides the card's border color (theme border by default). */
  borderColor?: string
}

/** A single slot in the 20-card grid. */
export interface ChartSlot {
  icon: ChartSlotIcon | null
  label: string
  /** Optional per-card style overrides. When set, takes precedence over the theme defaults for this card. */
  style?: ChartSlotStyle
}

/** The complete chart state persisted to localStorage. */
export interface ChartData {
  title: string
  slots: ChartSlot[]
  /** Layout preset id ('4x5', '2x5', etc.). Optional for backward-compat with charts saved before Phase 3. */
  layoutPreset?: string
  /** Active theme id. Optional for backward-compat with charts saved before Phase 4. */
  themeId?: string
  /** Heading font preset id ('outfit', 'inter', etc.). Optional for backward-compat with charts saved before Phase 4. */
  headingFontId?: string
  /** Body font preset id ('inter', 'atkinson', etc.). Optional for backward-compat with charts saved before Phase 4. */
  bodyFontId?: string
  /** Page margin in mm. Optional for backward-compat with charts saved before Phase 4. */
  margin?: number
  /** Gap between cards in mm. Optional for backward-compat with charts saved before Phase 4. */
  cardGap?: number
}

/** Summary metadata for a saved chart in the multi-chart gallery. */
export interface ChartSummary {
  id: string
  title: string
  /** Number of slots that have an icon assigned. */
  slotCount: number
  createdAt: string
  updatedAt: string
}

/** Tracks whether the latest save attempt succeeded. */
export interface SaveStatus {
  /** 'saved' — last save succeeded. 'saving' — debounce in-flight. 'error' — last save failed. */
  state: 'saved' | 'saving' | 'error'
  /** Human-readable reason when state === 'error'. */
  message: string | null
}
