import type { ComputedRef } from 'vue'
import type { ChartSlot } from '~/types/chart'

/**
 * Composable managing a single-slot clipboard for copy/paste between chart
 * slots.
 *
 * Holds at most one {@link ChartSlot} at a time. Both {@link copySlot} and
 * {@link pasteSlot} work on **deep clones** so the clipboard is fully
 * insulated from later mutations to the source slot (and its nested
 * `icon` / `style` objects), and callers can mutate a pasted slot freely
 * without corrupting the stored clipboard.
 *
 * State is **component-scoped** — each `useSlotClipboard()` call creates its
 * own reactive instance — matching the pattern used by {@link useMultiSelect}
 * for transient editor UI state.
 */
export function useSlotClipboard() {
  /** The slot currently held on the clipboard, or `null` when empty. */
  const clipboard = ref<ChartSlot | null>(null)

  /**
   * Produce a detached deep copy of a slot so no inner object reference is
   * shared with the original (or the clipboard).
   */
  function cloneSlot(slot: ChartSlot): ChartSlot {
    return {
      icon: slot.icon ? { ...slot.icon } : null,
      label: slot.label,
      ...(slot.style ? { style: { ...slot.style } } : {}),
    }
  }

  /**
   * Copy a slot onto the clipboard.
   *
   * Stores a deep clone so subsequent edits to the source slot (or its
   * icon/style) never leak into the clipboard.
   */
  function copySlot(slot: ChartSlot): void {
    clipboard.value = cloneSlot(slot)
  }

  /**
   * Return a fresh deep copy of the clipboard contents, or `null` when the
   * clipboard is empty.
   *
   * A copy (never the stored reference) is returned so the caller can apply
   * it to a slot and mutate it without affecting future pastes.
   */
  function pasteSlot(): ChartSlot | null {
    if (clipboard.value === null) return null
    return cloneSlot(clipboard.value)
  }

  /** True when the clipboard holds slot data ready to paste. */
  const hasClipboard: ComputedRef<boolean> = computed(() => clipboard.value !== null)

  return { clipboard, copySlot, pasteSlot, hasClipboard }
}
