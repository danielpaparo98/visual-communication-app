/**
 * Client-side Vue Devtools hook stub.
 *
 * Prevents "__vrv_devtools instance is null" errors in SPA mode by ensuring
 * window.__VUE_DEVTOOLS_GLOBAL_HOOK__ is always a valid object before Vue accesses it.
 */
export default defineNuxtPlugin({
  name: 'devtools-stub',
  order: -999, // Run before any other plugin
  enforce: 'pre',
  setup() {
    if (import.meta.server) return

    const target = typeof window !== 'undefined' ? window : (globalThis as any)
    if (!target.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = {
        emit: () => {},
        on: () => {},
        once: () => {},
        off: () => {},
        apps: [],
        Vue: undefined,
      }
    }
  },
})
