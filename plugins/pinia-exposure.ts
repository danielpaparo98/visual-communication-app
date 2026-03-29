/**
 * Plugin to expose Pinia instance to window for testing purposes
 * This is only enabled in development mode for Playwright tests
 */
export default defineNuxtPlugin(() => {
  if (import.meta.dev) {
    // Expose Pinia instance to window for testing
    // @ts-ignore - Exposing for testing purposes only
    window.__pinia = useNuxtApp().$pinia
  }
})
