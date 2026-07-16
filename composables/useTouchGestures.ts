import { ref, onMounted } from 'vue'

/**
 * Composable that enhances touch interactions for tablet (iPad) usage.
 *
 * Provides three things:
 *
 * 1. **`isTouchDevice`** — a reactive flag that becomes `true` after mount when
 *    the current client advertises touch support. Use it to conditionally
 *    render touch-only affordances (e.g. revealing hover-gated buttons).
 *
 * 2. **`setupPinchZoom`** — binds two-finger pinch listeners to an element and
 *    invokes `onZoom(delta)` where `delta` is the change (in pixels) of the
 *    distance between the two touches since the previous move. The caller
 *    decides sensitivity and clamping.
 *
 * 3. **`setupLongPress`** — fires `onLongPress(x, y)` (viewport coordinates)
 *    after the user holds a single finger still for `duration` ms. Cancels if
 *    the finger moves beyond a small threshold (so scrolls/taps don't trigger).
 *
 * Each setup function returns a **cleanup function** that removes its
 * listeners. Wire it up the same way {@link useCanvasPan} does — inside a
 * `watchEffect(onCleanup)` so binding tracks the element ref and tears down on
 * unmount.
 *
 * @see ~/composables/useCanvasPan.ts for the established binding pattern.
 */
export function useTouchGestures() {
  /** `true` once we detect touch capability on the client (SSR-safe). */
  const isTouchDevice = ref(false)

  onMounted(() => {
    isTouchDevice.value =
      'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  /**
   * Measure the Euclidean distance between two touch points.
   * Hoisted out of the handlers so both start/move share one definition.
   */
  function touchDistance(t1: Touch, t2: Touch): number {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
  }

  /**
   * Attach two-finger pinch-to-zoom to `element`.
   *
   * @param element The scroll/zoom container (e.g. the canvas wrapper).
   * @param onZoom  Receives the incremental pixel delta of the finger span.
   *                Positive = fingers spreading (zoom in), negative = pinching
   *                together (zoom out).
   * @returns A cleanup function that detaches all listeners.
   */
  function setupPinchZoom(element: HTMLElement, onZoom: (delta: number) => void) {
    /** Distance between the two touches at the previous move event. */
    let lastDistance = 0
    /** Whether a two-finger gesture is currently in progress. */
    let active = false

    function onTouchStart(e: TouchEvent) {
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      if (e.touches.length === 2 && t0 && t1) {
        active = true
        lastDistance = touchDistance(t0, t1)
      } else {
        active = false
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!active || e.touches.length !== 2) return
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      if (!t0 || !t1) return
      // Non-passive listener: we own the gesture so the browser doesn't
      // also try to scroll/zoom underneath us.
      if (e.cancelable) e.preventDefault()

      const current = touchDistance(t0, t1)
      const delta = current - lastDistance
      lastDistance = current
      if (delta !== 0) onZoom(delta)
    }

    function onTouchEnd(e: TouchEvent) {
      // Stay active across 3→2 finger transitions; reset only below 2.
      if (e.touches.length < 2) active = false
    }

    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd, { passive: true })
    element.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
      element.removeEventListener('touchcancel', onTouchEnd)
    }
  }

  /**
   * Attach long-press detection to `element`.
   *
   * Fires `onLongPress(x, y)` with viewport coordinates of the initial touch
   * after the finger stays (roughly) still for `duration` ms. The gesture is
   * cancelled if the finger moves more than a small threshold (treated as a
   * drag/scroll) or is lifted early.
   *
   * Intended for future context-menu invocation on cards; not wired up yet.
   *
   * @param element     The element to watch (e.g. a card).
   * @param onLongPress Callback receiving viewport `(x, y)` of the hold point.
   * @param duration    Hold time in ms before firing (default 500).
   * @returns A cleanup function that detaches all listeners and clears timers.
   */
  function setupLongPress(
    element: HTMLElement,
    onLongPress: (x: number, y: number) => void,
    duration = 500,
  ) {
    let timer: ReturnType<typeof setTimeout> | null = null
    let startX = 0
    let startY = 0
    /** Cancel the hold if the finger drifts more than this many pixels. */
    const MOVE_THRESHOLD = 10

    function clearTimer() {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }

    function onTouchStart(e: TouchEvent) {
      // Only a single, deliberate finger counts as a long-press candidate.
      if (e.touches.length !== 1) {
        clearTimer()
        return
      }
      const touch = e.touches[0]
      if (!touch) {
        clearTimer()
        return
      }
      startX = touch.clientX
      startY = touch.clientY
      clearTimer()
      timer = setTimeout(() => {
        onLongPress(startX, startY)
      }, duration)
    }

    function onTouchMove(e: TouchEvent) {
      if (timer === null) return
      const touch = e.touches[0]
      if (!touch) return
      if (
        Math.hypot(touch.clientX - startX, touch.clientY - startY) >
        MOVE_THRESHOLD
      ) {
        clearTimer()
      }
    }

    function onTouchEnd() {
      clearTimer()
    }

    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: true })
    element.addEventListener('touchend', onTouchEnd, { passive: true })
    element.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      clearTimer()
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
      element.removeEventListener('touchcancel', onTouchEnd)
    }
  }

  return { isTouchDevice, setupPinchZoom, setupLongPress }
}
