import { defineStore } from 'pinia'

// ── Types ──────────────────────────────────────────────────────────────────

/** Severity level for a toast. Drives colour, icon, and default duration. */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/** A single queued toast notification rendered by {@link ToastContainer}. */
export interface ToastNotification {
  /** Stable unique id used as the Vue list key and dismiss target. */
  id: string
  /** Severity — drives colour, icon, and the default auto-dismiss window. */
  type: ToastType
  /** Human-readable message shown in the toast body. */
  message: string
  /**
   * Auto-dismiss timeout in milliseconds. `0` means the toast is persistent
   * and must be dismissed manually via {@link dismiss}.
   */
  duration: number
}

// ── Constants ──────────────────────────────────────────────────────────────

/**
 * Default auto-dismiss window per severity.
 *
 * Errors stay the longest because they usually demand user attention /
 * corrective action; successes are the most transient. Persistent toasts
 * (`0`) bypass this map entirely.
 */
const DEFAULT_DURATION: Readonly<Record<ToastType, number>> = {
  success: 3_000,
  error: 5_000,
  info: 4_000,
  warning: 4_000,
}

/** Hard cap so a runaway caller can't bury the UI under hundreds of toasts. */
const MAX_TOASTS = 6

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Monotonic counter + timestamp + random suffix.
 *
 * `crypto.randomUUID` is avoided so this works in any (even non-secure)
 * context and stays short. The counter guarantees uniqueness within a single
 * session even if two toasts are pushed in the same millisecond.
 */
let idCounter = 0
function generateId(): string {
  idCounter += 1
  return `toast-${Date.now().toString(36)}-${idCounter}`
}

// ── Store ──────────────────────────────────────────────────────────────────

/**
 * Pinia store backing the global toast notification system.
 *
 * The store owns the queue; the {@link ToastContainer} component renders it.
 * Each non-persistent toast schedules its own removal via `setTimeout`, and
 * the timer handle is tracked so a manual {@link dismiss} can cancel it
 * cleanly (preventing a double-remove).
 *
 * Timers live in a module-scoped `Map` rather than reactive state so they
 * never trigger re-renders and never leak into devtools / serialization.
 */
export const useNotificationsStore = defineStore('notifications', () => {
  // ── State ──────────────────────────────────────────────────────────────

  /** Ordered queue of currently-visible toasts (oldest first). */
  const toasts = ref<ToastNotification[]>([])

  /**
   * Pending auto-dismiss timers keyed by toast id.
   * Module-scoped so the handles stay out of reactive state.
   */
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  // ── Actions ────────────────────────────────────────────────────────────

  /**
   * Remove a toast by id and cancel any pending auto-dismiss timer.
   *
   * Safe to call with an unknown id (no-op), which lets the timer callback
   * and manual close button share this path without a double-remove guard.
   */
  function dismiss(id: string): void {
    const timer = timers.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      timers.delete(id)
    }
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  /**
   * Push a new toast onto the queue.
   *
   * Resolves `duration === undefined` to the severity default; `0` keeps the
   * toast on screen until manually dismissed. When the queue exceeds
   * {@link MAX_TOASTS} the oldest entry is evicted (FIFO) so the viewport
   * is never buried.
   *
   * @returns the id of the created toast (useful for programmatic dismiss).
   */
  function push(type: ToastType, message: string, duration?: number): string {
    const resolvedDuration = duration ?? DEFAULT_DURATION[type]
    const toast: ToastNotification = {
      id: generateId(),
      type,
      message,
      duration: resolvedDuration,
    }
    toasts.value.push(toast)

    // Evict the oldest entry if we've blown past the cap. Eviction goes
    // through `dismiss` so its timer is cancelled too.
    if (toasts.value.length > MAX_TOASTS) {
      const oldest = toasts.value[0]
      if (oldest) dismiss(oldest.id)
    }

    // Schedule auto-removal only for non-persistent toasts.
    if (resolvedDuration > 0) {
      const timer = setTimeout(() => {
        timers.delete(toast.id)
        dismiss(toast.id)
      }, resolvedDuration)
      timers.set(toast.id, timer)
    }

    return toast.id
  }

  /** Shorthand: green success toast (3s default). */
  function success(message: string, duration?: number): string {
    return push('success', message, duration)
  }

  /** Shorthand: red error toast (5s default). */
  function error(message: string, duration?: number): string {
    return push('error', message, duration)
  }

  /** Shorthand: blue info toast (4s default). */
  function info(message: string, duration?: number): string {
    return push('info', message, duration)
  }

  /** Shorthand: amber warning toast (4s default). */
  function warning(message: string, duration?: number): string {
    return push('warning', message, duration)
  }

  /** Remove every toast and cancel every pending timer. */
  function clear(): void {
    for (const timer of timers.values()) clearTimeout(timer)
    timers.clear()
    toasts.value.splice(0, toasts.value.length)
  }

  return {
    // State
    toasts,
    // Actions
    push,
    success,
    error,
    info,
    warning,
    dismiss,
    clear,
  }
})
