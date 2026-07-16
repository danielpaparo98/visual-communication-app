import { ref, computed, watchEffect, nextTick } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable that manages canvas pan behaviour via native `overflow: auto`
 * scrolling, with grab-cursor feedback and Ctrl+Wheel zoom.
 *
 * **How it works**
 * - The `.canvas-wrapper` already has `overflow-auto` so native scrollbars
 *   appear when the scaled A4 page exceeds the viewport.
 * - Cursor changes to `grab` when zoom > 100 % and to `grabbing` while the
 *   user is pressing the mouse button.
 * - Ctrl+Scroll zooms in/out and adjusts the scroll position so the point
 *   under the cursor stays stationary (cursor-centred zoom).
 * - On touch devices the native overscroll behaviour already handles
 *   single-finger drag scrolling — no extra code needed.
 *
 * @param wrapperRef  Template ref on the `.canvas-wrapper` element.
 * @param zoom        Writable ref for the current zoom level (0.25–1.5).
 */
export function useCanvasPan(
  wrapperRef: Ref<HTMLElement | null>,
  zoom: Ref<number>,
) {
  /** `true` while the user is holding the mouse button (dragging). */
  const isPanning = ref(false)

  /**
   * Dynamic cursor for the canvas wrapper:
   * - `grabbing` → actively dragging
   * - `grab`     → zoomed in, ready to drag-scroll
   * - `default`  → no special cursor needed
   */
  const cursor = computed(() => {
    if (isPanning.value) return 'grabbing'
    if (zoom.value > 1.0) return 'grab'
    return 'default'
  })

  // ── Mouse handlers (visual cursor feedback only) ────────────────────

  function onMouseDown() {
    if (zoom.value > 1.0) {
      isPanning.value = true
    }
  }

  function onMouseUp() {
    isPanning.value = false
  }

  function onMouseLeave() {
    isPanning.value = false
  }

  // ── Wheel zoom (Ctrl / Cmd + scroll) ───────────────────────────────

  function onWheel(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()

    const el = wrapperRef.value
    if (!el) return

    const oldScale = zoom.value
    const rect = el.getBoundingClientRect()

    // Cursor position relative to the wrapper's viewport (before scroll)
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top

    // Current scroll position within the wrapper
    const oldScrollLeft = el.scrollLeft
    const oldScrollTop = el.scrollTop

    // Compute new zoom (clamped to 25 % – 150 %)
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.max(0.25, Math.min(1.5, oldScale + delta))
    zoom.value = newScale

    // After Vue flushes the DOM with the new scale, adjust the scroll
    // so the point that was under the cursor stays visually fixed.
    nextTick(() => {
      // Derive the page position (in unscaled coords) under the cursor
      // before the zoom:
      //   pageX = (cursorX + oldScrollLeft) / oldScale
      //
      // After zooming to newScale, we need a new scroll offset that
      // places the same page coordinate under the cursor:
      //   newScrollLeft = pageX * newScale - cursorX
      const newScrollLeft =
        ((cursorX + oldScrollLeft) / oldScale) * newScale - cursorX
      const newScrollTop =
        ((cursorY + oldScrollTop) / oldScale) * newScale - cursorY

      // Temporarily disable smooth-scroll so the programmatic scroll
      // adjustment is instant (no animation glitch).
      el.style.scrollBehavior = 'auto'
      el.scrollLeft = newScrollLeft
      el.scrollTop = newScrollTop
      // Restore the CSS-class-defined scroll-behaviour (scroll-smooth).
      el.style.scrollBehavior = ''
    })
  }

  // ── Lifecycle — bind / unbind events via watchEffect ───────────────

  watchEffect((onCleanup) => {
    const el = wrapperRef.value
    if (!el) return

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('wheel', onWheel, { passive: false })

    onCleanup(() => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('wheel', onWheel)
    })
  })

  return { isPanning, cursor }
}
