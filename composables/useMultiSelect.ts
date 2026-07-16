/**
 * Composable managing multi-select state for batch icon assignment.
 *
 * Maintains a list of selected slot indices plus a mode flag. When
 * multi-select mode is active, clicking cards toggles their membership in
 * the selection (instead of performing a single selection), and picking an
 * icon assigns it to every selected slot at once.
 *
 * State is **component-scoped** — each `useMultiSelect()` call creates its
 * own reactive instances — which suits the chart editor page where the
 * selection is transient UI state that should reset on navigation.
 */
export function useMultiSelect() {
  /** Indices of the slots currently included in the multi-selection. */
  const selectedSlots = ref<number[]>([])

  /** Whether multi-select mode is active. */
  const multiSelectMode = ref(false)

  /**
   * Add a slot to the selection if absent, or remove it if already present.
   * Insertion order is preserved so the array reflects click order.
   * Negative indices are ignored.
   */
  function toggleSlot(index: number): void {
    if (index < 0) return
    const pos = selectedSlots.value.indexOf(index)
    if (pos === -1) {
      selectedSlots.value = [...selectedSlots.value, index]
    } else {
      selectedSlots.value = selectedSlots.value.filter((i) => i !== index)
    }
  }

  /**
   * Replace the selection with every slot index from `0` to `maxSlots - 1`.
   * A non-positive `maxSlots` clears the selection. Mode is left unchanged.
   */
  function selectAll(maxSlots: number): void {
    if (maxSlots <= 0) {
      selectedSlots.value = []
      return
    }
    selectedSlots.value = Array.from({ length: maxSlots }, (_, i) => i)
  }

  /** Remove every slot from the selection. Multi-select mode stays on. */
  function clearSelection(): void {
    selectedSlots.value = []
  }

  /** Turn multi-select mode on. The existing selection is preserved. */
  function enterMultiSelect(): void {
    multiSelectMode.value = true
  }

  /**
   * Turn multi-select mode off **and** discard the current selection.
   *
   * Call this from the page-level "Done" button or an Escape handler so no
   * stale highlights remain once the user leaves multi-select.
   */
  function exitMultiSelect(): void {
    multiSelectMode.value = false
    selectedSlots.value = []
  }

  return {
    selectedSlots,
    multiSelectMode,
    toggleSlot,
    selectAll,
    clearSelection,
    enterMultiSelect,
    exitMultiSelect,
  }
}
