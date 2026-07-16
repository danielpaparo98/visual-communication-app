import { ref, type Ref } from 'vue'
import type { ChartSlot } from '~/types/chart'

/**
 * Composable implementing native HTML5 drag-and-drop reordering for chart
 * slots.
 *
 * It tracks two pieces of transient UI state — the index of the slot currently
 * being dragged, and the index of the slot the pointer is hovering over (the
 * drop target). The actual array mutation is delegated to the `onReorder`
 * callback so the caller controls persistence / history.
 *
 * State is **component-scoped** — each `useDragAndDrop()` call creates its own
 * reactive instances, which suits the chart canvas where drag state is
 * transient and should reset on navigation.
 *
 * The composable is intentionally unaware of icon drag-and-drop from the
 * {@link IconPicker}; callers can detect external drags (e.g. via
 * `dataTransfer.types`) in their own handlers and only delegate to
 * {@link onDrop} for slot reordering.
 *
 * @param slots    Ref to the slots array being reordered. Used for bounds
 *                 validation; the array itself is never mutated here.
 * @param onReorder Invoked with `(from, to)` when the user drops a slot onto
 *                  a different position. The caller performs the array move
 *                  (and any history snapshot capture).
 */
export function useDragAndDrop(
  slots: Ref<ChartSlot[]>,
  onReorder: (from: number, to: number) => void,
) {
  /** Index of the slot currently being dragged, or `null` when idle. */
  const draggedIndex = ref<number | null>(null)

  /** Index of the slot currently acting as the drop target, or `null`. */
  const dragOverIndex = ref<number | null>(null)

  /**
   * Begin dragging the slot at `index`.
   *
   * Setting `dataTransfer` data is required by some browsers for the drag to
   * actually initiate, so we write the index as plain text even though we
   * also track it in {@link draggedIndex}.
   */
  function onDragStart(index: number, e: DragEvent) {
    if (!e.dataTransfer) return
    draggedIndex.value = index
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  /**
   * Track the slot under the pointer and mark it as a valid drop target.
   *
   * `preventDefault()` MUST be called here for the browser to permit a
   * subsequent `drop` event — without it the drop is silently cancelled.
   * The hover index is only updated when the pointer is over a *different*
   * slot than the one being dragged (dropping back onto yourself is a no-op).
   */
  function onDragOver(index: number, e: DragEvent) {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    if (draggedIndex.value !== null && draggedIndex.value !== index) {
      dragOverIndex.value = index
    } else {
      dragOverIndex.value = null
    }
  }

  /**
   * Complete a reorder: fire `onReorder` (unless the drop is a no-op) and
   * reset all drag state.
   *
   * Out-of-bounds indices are ignored as a defensive guard.
   */
  function onDrop(index: number, e: DragEvent) {
    e.preventDefault()
    const from = draggedIndex.value
    const len = slots.value.length
    if (
      from === null ||
      from === index ||
      from < 0 ||
      from >= len ||
      index < 0 ||
      index >= len
    ) {
      onDragEnd()
      return
    }
    onReorder(from, index)
    onDragEnd()
  }

  /**
   * Reset drag state. Bound to the `dragend` event (which fires whether the
   * drag was dropped or cancelled) so the UI never gets stuck mid-drag.
   */
  function onDragEnd() {
    draggedIndex.value = null
    dragOverIndex.value = null
  }

  return {
    draggedIndex,
    dragOverIndex,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
  }
}
