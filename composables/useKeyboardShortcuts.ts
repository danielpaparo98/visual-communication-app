/**
 * Centralised keyboard-shortcut router for the chart editor page.
 *
 * Registers a single `keydown` listener on `window` and dispatches to the
 * callbacks supplied by the calling component. Designed to be the **single
 * source of truth** for editor shortcuts so individual components (e.g.
 * `ChartHeader`) don't each attach their own listeners.
 *
 * The composable only routes events — the page wires the real handlers, so
 * it stays decoupled from stores and component state.
 *
 * ## Guard behaviour
 *
 * - **Form-field guard**: every shortcut is ignored while focus is inside a
 *   text-editing element (`<input>`, `<textarea>`, `<select>`, or anything
 *   `contenteditable`) **except Escape**, which always fires so overlays can
 *   be dismissed from any context.
 * - **Enable gate**: when `options.isEnabled()` returns `false` the listener
 *   does nothing for *any* key (including Escape). Use this to hand keyboard
 *   control over to a modal overlay while it is open.
 * - Browser defaults are prevented for shortcuts that would otherwise trigger
 *   a native action (`Ctrl+S`, `Ctrl+P`, arrows, `Delete`/`Backspace`).
 *
 * ## Lifecycle
 *
 * Registers on mount, removes on unmount. SSR-safe (no `window` access until
 * mounted). Must be called synchronously during `setup`.
 */

/** Direction passed to {@link KeyboardShortcutHandlers.onNavigate}. */
export type NavigationDirection = 'up' | 'down' | 'left' | 'right'

/**
 * Optional handlers for each supported shortcut. Every handler defaults to a
 * no-op so callers only wire the shortcuts they care about.
 */
export interface KeyboardShortcutHandlers {
  /** Ctrl+Z — undo the last change. */
  onUndo?: () => void
  /** Ctrl+Shift+Z or Ctrl+Y — redo the last undone change. */
  onRedo?: () => void
  /** Ctrl+S — manually save the chart. */
  onSave?: () => void
  /** Ctrl+E — open the export dialog. */
  onExport?: () => void
  /** Ctrl+P — print the chart. */
  onPrint?: () => void
  /** Escape — deselect / close the active panel. */
  onEscape?: () => void
  /** Delete or Backspace — clear the active slot's icon. */
  onDeleteActiveSlot?: () => void
  /** Arrow keys — move the active selection to an adjacent slot. */
  onNavigate?: (direction: NavigationDirection) => void
  /** `?` — show the keyboard-shortcuts cheat sheet. */
  onShowShortcuts?: () => void
}

export interface KeyboardShortcutOptions {
  /**
   * When this returns `false` the listener ignores **all** keys (including
   * Escape). Defaults to always-enabled. Use it to disable editor shortcuts
   * while a modal overlay is open.
   */
  isEnabled?: () => boolean
}

/** Reused no-op so optional handlers never throw when omitted. */
const noop = (): void => {}

/**
 * True when keyboard focus is inside a text-editing element.
 *
 * Used to suppress editor shortcuts while the user is typing into the icon
 * search box, the title field, etc. (Escape is exempt — see the routing
 * logic).
 */
function isTypingInField(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return el.isContentEditable
}

/**
 * Wire up the chart editor's keyboard shortcuts.
 *
 * @example
 * ```ts
 * useKeyboardShortcuts(
 *   { onUndo: () => historyStore.undo(), onSave: saveNow, onEscape: closePanes },
 *   { isEnabled: () => !modalOpen.value },
 * )
 * ```
 */
export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers,
  options: KeyboardShortcutOptions = {},
): void {
  const isEnabled = options.isEnabled ?? (() => true)

  // Resolve handlers once, defaulting missing ones to a no-op.
  const onUndo = handlers.onUndo ?? noop
  const onRedo = handlers.onRedo ?? noop
  const onSave = handlers.onSave ?? noop
  const onExport = handlers.onExport ?? noop
  const onPrint = handlers.onPrint ?? noop
  const onEscape = handlers.onEscape ?? noop
  const onDeleteActiveSlot = handlers.onDeleteActiveSlot ?? noop
  const onNavigate = handlers.onNavigate ?? noop
  const onShowShortcuts = handlers.onShowShortcuts ?? noop

  function onKeydown(event: KeyboardEvent): void {
    // Let modal overlays own the keyboard while they are open.
    if (!isEnabled()) return

    // Escape is always honoured (even inside form fields).
    if (event.key === 'Escape') {
      onEscape()
      return
    }

    // Every other shortcut is suppressed while the user is typing.
    if (isTypingInField(event.target)) return

    const isCtrl = event.ctrlKey || event.metaKey

    // ── Modifier combos (Ctrl/Cmd + key) ──
    if (isCtrl) {
      const key = event.key.toLowerCase()
      switch (key) {
        case 'z':
          event.preventDefault()
          if (event.shiftKey) onRedo()
          else onUndo()
          return
        case 'y':
          event.preventDefault()
          onRedo()
          return
        case 's':
          event.preventDefault()
          onSave()
          return
        case 'e':
          event.preventDefault()
          onExport()
          return
        case 'p':
          event.preventDefault()
          onPrint()
          return
        default:
          // Other Ctrl/Cmd combos (copy, paste, …) are left to the browser.
          return
      }
    }

    // ── Non-modifier keys ──
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        event.preventDefault()
        onDeleteActiveSlot()
        return
      case 'ArrowUp':
        event.preventDefault()
        onNavigate('up')
        return
      case 'ArrowDown':
        event.preventDefault()
        onNavigate('down')
        return
      case 'ArrowLeft':
        event.preventDefault()
        onNavigate('left')
        return
      case 'ArrowRight':
        event.preventDefault()
        onNavigate('right')
        return
      case '?':
        event.preventDefault()
        onShowShortcuts()
        return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}
