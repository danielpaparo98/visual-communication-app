<template>
  <Teleport to="body">
    <div
      v-show="toasts.length > 0"
      class="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col items-stretch gap-2 pointer-events-none sm:max-w-sm no-print"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <TransitionGroup name="toast-slide" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-card pointer-events-auto relative overflow-hidden rounded-r-xl rounded-l-md border border-slate-200 border-l-4 bg-white shadow-lg shadow-slate-900/5 pl-4 pr-9 py-3"
          :class="borderClass(toast.type)"
          :role="roleFor(toast.type)"
        >
          <!-- Body: icon + message -->
          <div class="flex items-start gap-2.5">
            <component :is="iconComponent(toast.type)" class="mt-0.5 h-5 w-5 shrink-0" :class="iconClass(toast.type)" aria-hidden="true" />
            <p class="text-sm leading-snug text-slate-700 break-words">{{ toast.message }}</p>
          </div>

          <!-- Close affordance -->
          <button
            type="button"
            class="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
            aria-label="Dismiss notification"
            @click="dismiss(toast.id)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <!-- Progress bar (only for auto-dismissing toasts) -->
          <div
            v-if="toast.duration > 0"
            class="toast-progress absolute bottom-0 left-0 h-0.5"
            :class="progressClass(toast.type)"
            :style="{ '--toast-duration': `${toast.duration}ms` }"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Global toast notification stack.
 *
 * Reads from the `notifications` Pinia store and renders a fixed,
 * top-anchored stack of toasts. Persistent toasts (`duration === 0`) render
 * without a progress bar and require manual dismissal.
 *
 * Accessibility:
 *  - The container is an `aria-live="polite"` region so screen readers
 *    announce new toasts without interrupting the user.
 *  - Error / warning toasts use `role="alert"` (assertive) since they
 *    usually carry time-sensitive context; success / info use
 *    `role="status"` (polite).
 *
 * Teleported to `<body>` so the stack floats above modals, dialogs, and
 * print sheets regardless of where in the tree it's mounted.
 */
import { useNotificationsStore, type ToastType } from '~/stores/notifications'
import { storeToRefs } from 'pinia'

const notifications = useNotificationsStore()
const { toasts } = storeToRefs(notifications)
const { dismiss } = notifications

// ── Per-type styling ────────────────────────────────────────────────────────

/** Left-border colour per severity. */
function borderClass(type: ToastType): string {
  switch (type) {
    case 'success': return 'border-l-emerald-500'
    case 'error':   return 'border-l-red-500'
    case 'info':    return 'border-l-blue-500'
    case 'warning': return 'border-l-amber-500'
  }
}

/** Icon tint per severity. */
function iconClass(type: ToastType): string {
  switch (type) {
    case 'success': return 'text-emerald-500'
    case 'error':   return 'text-red-500'
    case 'info':    return 'text-blue-500'
    case 'warning': return 'text-amber-500'
  }
}

/** Progress-bar fill colour per severity. */
function progressClass(type: ToastType): string {
  switch (type) {
    case 'success': return 'bg-emerald-500'
    case 'error':   return 'bg-red-500'
    case 'info':    return 'bg-blue-500'
    case 'warning': return 'bg-amber-500'
  }
}

/**
 * Live-region role per severity.
 *
 * `alert` is implicitly assertive — reserved for errors/warnings where the
 * message may be time-critical. Everything else stays polite via `status`.
 */
function roleFor(type: ToastType): 'alert' | 'status' {
  return type === 'error' || type === 'warning' ? 'alert' : 'status'
}

// ── Inline icons (kept local so the component is self-contained) ────────────

/**
 * Minimal per-type SVG glyphs, exposed as functional components so they can
 * be passed straight to `<component :is>`. A plain function returning a VNode
 * is a valid Vue 3 functional component definition.
 */
import { h, type FunctionalComponent } from 'vue'

const SVG_ATTRS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
}

const SuccessIcon: FunctionalComponent = () =>
  h('svg', SVG_ATTRS, [
    h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
    h('path', { d: 'm9 11 3 3L22 4' }),
  ])

const ErrorIcon: FunctionalComponent = () =>
  h('svg', SVG_ATTRS, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('path', { d: 'm15 9-6 6' }),
    h('path', { d: 'm9 9 6 6' }),
  ])

const InfoIcon: FunctionalComponent = () =>
  h('svg', SVG_ATTRS, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('path', { d: 'M12 16v-4' }),
    h('path', { d: 'M12 8h.01' }),
  ])

const WarningIcon: FunctionalComponent = () =>
  h('svg', SVG_ATTRS, [
    h('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }),
    h('path', { d: 'M12 9v4' }),
    h('path', { d: 'M12 17h.01' }),
  ])

/** Resolve the icon component for a given severity. */
function iconComponent(type: ToastType): FunctionalComponent {
  switch (type) {
    case 'success': return SuccessIcon
    case 'error':   return ErrorIcon
    case 'info':    return InfoIcon
    case 'warning': return WarningIcon
  }
}
</script>

<style scoped>
/* Slide-in from the right on enter; fade + slight slide on leave.
   `toast-slide-move` animates the remaining cards into place when one is
   dismissed, so the stack reflows smoothly instead of jumping. */
.toast-slide-enter-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.28s ease;
}
.toast-slide-leave-active {
  transition: transform 0.24s ease-in, opacity 0.24s ease;
  /* Take the leaving card out of flow so siblings slide up cleanly. */
  position: absolute;
  right: 0;
  left: 0;
}
.toast-slide-move {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-slide-enter-from {
  transform: translateX(110%);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateX(110%);
  opacity: 0;
}

/* Progress bar: shrinks from full to empty over the toast's lifetime.
   Driven by a CSS custom property so each toast duration is honoured. */
.toast-progress {
  width: 100%;
  animation: toast-shrink var(--toast-duration, 0ms) linear forwards;
}
@keyframes toast-shrink {
  from { width: 100%; }
  to   { width: 0%; }
}

@media (prefers-reduced-motion: reduce) {
  /* Honour the OS-level motion preference: instant transitions, no shrink. */
  .toast-slide-enter-active,
  .toast-slide-leave-active,
  .toast-slide-move {
    transition: none;
  }
  .toast-progress {
    animation: none;
  }
}
</style>
