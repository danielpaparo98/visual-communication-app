import { defineStore } from 'pinia'
import type { ChartData, ChartSlot, ChartSlotIcon, ChartSlotStyle } from '~/types/chart'
import type { ChartSnapshot } from '~/stores/history'
import { useHistoryStore } from '~/stores/history'
import { getPreset, getDefaultPreset } from '~/utils/layoutPresets'
import { getTheme, getDefaultTheme } from '~/utils/colorThemes'
import type { ColorTheme } from '~/utils/colorThemes'
import { HEADING_FONTS, BODY_FONTS, findFontById } from '~/utils/fontPresets'
import type { FontPreset } from '~/utils/fontPresets'

/**
 * Create empty slots for a given count.
 * Defaults to the default preset's total slot count (20).
 */
function createEmptySlots(count: number = getDefaultPreset().totalSlots): ChartSlot[] {
  return Array.from({ length: count }, (): ChartSlot => ({ icon: null, label: '' }))
}

/**
 * Build a snapshot of the current chart state for the history store.
 */
function captureSnapshot(slots: ChartSlot[], title: string): ChartSnapshot {
  return {
    // Deep-clone each slot so nested icon/style objects don't share refs
    // with the live store state (prevents retroactive snapshot corruption).
    slots: slots.map((s) => ({
      ...s,
      icon: s.icon ? { ...s.icon } : null,
      ...(s.style ? { style: { ...s.style } } : {}),
    })),
    title,
    timestamp: Date.now(),
  }
}

/**
 * Pinia store managing the 20-slot chart grid state.
 *
 * All actions are **pure** — no localStorage or side-effects.
 * Persistence will be handled by a separate layer.
 */
export const useChartStore = defineStore('chart', () => {
  // ── State ────────────────────────────────────────────────────────────────

  /** The chart title displayed at the top of the print / editor. */
  const title = ref<string>('My Communication Chart')

  /** The grid of chart slots. Array length grows to match the active preset. */
  const slots = ref<ChartSlot[]>(createEmptySlots())

  /** Active layout preset id (e.g. '4x5', '2x5'). Persisted per-chart. */
  const layoutPreset = ref<string>(getDefaultPreset().id)

  /** Active theme id ('default', 'ocean', etc.). Persisted per-chart. */
  const themeId = ref<string>(getDefaultTheme().id)

  /**
   * Per-token overrides applied on top of the base theme.
   * Allows users to customise individual colours without defining a full theme.
   */
  const themeOverrides = ref<Partial<Pick<ColorTheme, 'primary' | 'background' | 'surface' | 'border' | 'borderLight' | 'text' | 'textMuted' | 'headerBg'>>>({})

  /** Active heading font preset id — persisted per-chart. */
  const headingFontId = ref<string>('outfit')

  /** Active body / label font preset id — persisted per-chart. */
  const bodyFontId = ref<string>('inter')

  /** Page margin in mm — padding around the canvas content. */
  const margin = ref<number>(15)

  /** Gap between cards in mm — applied as CSS grid gap. */
  const cardGap = ref<number>(5)

  // ── Getters ──────────────────────────────────────────────────────────────

  /** Resolved preset object for the active layout. */
  const preset = computed(() => getPreset(layoutPreset.value))

  /** Number of slots that have an icon assigned (across entire slots array). */
  const filledSlotCount = computed(() => slots.value.filter((s) => s.icon !== null).length)

  /** True when no slots have icons. */
  const isEmpty = computed(() => filledSlotCount.value === 0)

  /**
   * Resolved theme with overrides applied.
   *
   * Starts from the base theme identified by `themeId`, then merges any
   * per-token overrides on top so individual colours can be customised
   * without defining a full theme.
   */
  const activeTheme = computed<ColorTheme>(() => {
    const base = getTheme(themeId.value)
    const overrides = themeOverrides.value
    return {
      ...base,
      ...(overrides.primary != null ? { primary: overrides.primary } : {}),
      ...(overrides.background != null ? { background: overrides.background } : {}),
      ...(overrides.surface != null ? { surface: overrides.surface } : {}),
      ...(overrides.border != null ? { border: overrides.border } : {}),
      ...(overrides.borderLight != null ? { borderLight: overrides.borderLight } : {}),
      ...(overrides.text != null ? { text: overrides.text } : {}),
      ...(overrides.textMuted != null ? { textMuted: overrides.textMuted } : {}),
      ...(overrides.headerBg != null ? { headerBg: overrides.headerBg } : {}),
    }
  })

  /** Resolved FontPreset for the active heading font. */
  const activeHeadingFont = computed<FontPreset>(() => findFontById(headingFontId.value, HEADING_FONTS))

  /** Resolved FontPreset for the active body / label font. */
  const activeBodyFont = computed<FontPreset>(() => findFontById(bodyFontId.value, BODY_FONTS))

  /** Snapshot of current state in `ChartData` shape, useful for persistence. */
  const asChartData = computed<ChartData>(() => ({
    title: title.value,
    slots: slots.value,
    layoutPreset: layoutPreset.value,
    themeId: themeId.value,
    headingFontId: headingFontId.value,
    bodyFontId: bodyFontId.value,
    margin: margin.value,
    cardGap: cardGap.value,
  }))

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Assign an icon to a specific grid slot.
   * No-op if `slotIndex` is out of bounds.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function assignIcon(slotIndex: number, icon: ChartSlotIcon) {
    if (slotIndex < 0 || slotIndex >= slots.value.length) return
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    slots.value[slotIndex] = { ...slots.value[slotIndex], icon }
  }

  /**
   * Remove the icon from a specific grid slot (the label is preserved).
   * No-op if `slotIndex` is out of bounds or the slot has no icon.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function clearIcon(slotIndex: number) {
    if (slotIndex < 0 || slotIndex >= slots.value.length) return
    if (slots.value[slotIndex].icon === null) return
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    slots.value[slotIndex] = { ...slots.value[slotIndex], icon: null }
  }

  /**
   * Update the label text for a grid slot.
   * No-op if `slotIndex` is out of bounds.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function updateLabel(slotIndex: number, label: string) {
    if (slotIndex < 0 || slotIndex >= slots.value.length) return
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    slots.value[slotIndex] = { ...slots.value[slotIndex], label }
  }

  /**
   * Replace the chart title.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function setTitle(newTitle: string) {
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    title.value = newTitle
  }

  /**
   * Switch to a different layout preset.
   *
   * - Grows the slots array if the new preset requires more slots.
   * - Never shrinks the array — hidden slots are preserved so users can
   *   switch back without losing data.
   */
  function setLayoutPreset(id: string) {
    const newPreset = getPreset(id)
    const currentLen = slots.value.length

    // Grow the slots array if the new preset needs more slots
    if (newPreset.totalSlots > currentLen) {
      const padding: ChartSlot[] = Array.from(
        { length: newPreset.totalSlots - currentLen },
        (): ChartSlot => ({ icon: null, label: '' }),
      )
      slots.value = [...slots.value, ...padding]
    }

    layoutPreset.value = id
  }

  /**
   * Switch to a different colour theme by id.
   * Clears any previous per-token overrides so the theme is applied cleanly.
   */
  function setTheme(id: string) {
    themeId.value = id
    themeOverrides.value = {}
  }

  /**
   * Override a single colour token on the active theme.
   * Pass `null` or `undefined` to clear a previous override for that key.
   */
  function setThemeOverride(
    key: keyof Pick<ColorTheme, 'primary' | 'background' | 'surface' | 'border' | 'borderLight' | 'text' | 'textMuted' | 'headerBg'>,
    value: string | null | undefined,
  ) {
    if (value == null) {
      const rest = { ...themeOverrides.value }
      delete rest[key]
      themeOverrides.value = rest
    } else {
      themeOverrides.value = { ...themeOverrides.value, [key]: value }
    }
  }

  /**
   * Switch to a different heading font by preset id.
   */
  function setHeadingFont(id: string) {
    headingFontId.value = id
  }

  /**
   * Switch to a different body / label font by preset id.
   */
  function setBodyFont(id: string) {
    bodyFontId.value = id
  }

  /** Set the page margin in mm. */
  function setMargin(mm: number) {
    margin.value = mm
  }

  /** Set the gap between cards in mm. */
  function setCardGap(mm: number) {
    cardGap.value = mm
  }

  /**
   * Move a slot from one grid position to another (insert-move semantics).
   *
   * The slot at `from` is removed and reinserted at `to`, shifting the
   * intervening slots by one — this is the natural "drag to reorder" behaviour
   * rather than a two-item swap. Out-of-bounds or identical indices are a
   * no-op.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function reorderSlots(from: number, to: number) {
    if (from === to) return
    if (from < 0 || from >= slots.value.length) return
    if (to < 0 || to >= slots.value.length) return
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    const next = [...slots.value]
    const [moved] = next.splice(from, 1)
    if (moved !== undefined) {
      next.splice(to, 0, moved)
      slots.value = next
    }
  }

  /**
   * Apply per-card style overrides for a specific slot.
   * No-op if `slotIndex` is out of bounds.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function setCardStyle(slotIndex: number, style: ChartSlotStyle) {
    if (slotIndex < 0 || slotIndex >= slots.value.length) return
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    slots.value[slotIndex] = { ...slots.value[slotIndex], style: { ...style } }
  }

  /**
   * Remove per-card style overrides for a specific slot, reverting to theme defaults.
   * No-op if `slotIndex` is out of bounds.
   *
   * Records a snapshot **before** the mutation so the change is undoable.
   */
  function clearCardStyle(slotIndex: number) {
    if (slotIndex < 0 || slotIndex >= slots.value.length) return
    const historyStore = useHistoryStore()
    historyStore.pushSnapshot(captureSnapshot(slots.value, title.value))
    const { style: _removed, ...rest } = slots.value[slotIndex]
    slots.value[slotIndex] = rest
  }

  /** Reset the chart to its default empty state. Clears undo history. */
  function reset() {
    const historyStore = useHistoryStore()
    historyStore.clear()
    title.value = 'My Communication Chart'
    const defaultPreset = getDefaultPreset()
    layoutPreset.value = defaultPreset.id
    slots.value = createEmptySlots(defaultPreset.totalSlots)
    headingFontId.value = 'outfit'
    bodyFontId.value = 'inter'
    margin.value = 15
    cardGap.value = 5
  }

  /** Hydrate store state from a `ChartData` object. Clears undo history. */
  function loadFromData(data: ChartData) {
    const historyStore = useHistoryStore()
    historyStore.clear()
    if (data.title) title.value = data.title

    // Restore layout preset (fall back to default for charts saved before Phase 3)
    const presetId = data.layoutPreset || getDefaultPreset().id
    const presetInfo = getPreset(presetId)
    layoutPreset.value = presetId

    // Restore theme id (fall back to default for charts saved before Phase 4)
    themeId.value = data.themeId || getDefaultTheme().id
    themeOverrides.value = {}

    // Restore font choices (fall back to defaults for charts saved before Phase 4)
    headingFontId.value = data.headingFontId || 'outfit'
    bodyFontId.value = data.bodyFontId || 'inter'

    // Restore margin and cardGap (fall back to defaults for charts saved before Phase 4)
    margin.value = data.margin ?? 15
    cardGap.value = data.cardGap ?? 5

    if (data.slots) {
      // Ensure the slots array is at least as long as the preset requires
      if (data.slots.length < presetInfo.totalSlots) {
        const padding: ChartSlot[] = Array.from(
          { length: presetInfo.totalSlots - data.slots.length },
          (): ChartSlot => ({ icon: null, label: '' }),
        )
        slots.value = [...data.slots, ...padding]
      } else {
        slots.value = data.slots
      }
    } else {
      slots.value = createEmptySlots(presetInfo.totalSlots)
    }
  }

  return {
    // State
    title,
    slots,
    layoutPreset,
    themeId,
    themeOverrides,
    headingFontId,
    bodyFontId,
    margin,
    cardGap,
    // Getters
    preset,
    filledSlotCount,
    isEmpty,
    activeTheme,
    activeHeadingFont,
    activeBodyFont,
    asChartData,
    // Actions
    assignIcon,
    clearIcon,
    updateLabel,
    setTitle,
    setLayoutPreset,
    setTheme,
    setThemeOverride,
    setHeadingFont,
    setBodyFont,
    setMargin,
    setCardGap,
    setCardStyle,
    clearCardStyle,
    reorderSlots,
    reset,
    loadFromData,
  }
})
