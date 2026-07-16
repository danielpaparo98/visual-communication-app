/**
 * Progressive onboarding tour state.
 *
 * Manages a lightweight 4-step product tour that highlights key areas of the
 * chart editor on a user's first visit. State is held in **module-level**
 * refs (singleton) so every consumer — the page, the {@link OnboardingTour}
 * overlay, and the {@link ChartHeader} restart button — shares the same
 * reactive instances without needing a Pinia store or plugin.
 *
 * ## Persistence
 *
 * A single localStorage flag (`ttc-onboarding-complete`) records whether the
 * user has seen the tour. When `false`, the chart page auto-offers the tour on
 * mount. Any dismissal or completion marks it seen so the tour never nags;
 * curious users can always re-launch it from the header.
 *
 * SSR-safe: all `localStorage` access is guarded behind `import.meta.client`.
 */

/** localStorage key recording whether the tour has been completed / dismissed. */
const STORAGE_KEY = 'ttc-onboarding-complete'

/** Total number of steps in the tour (must match {@link OnboardingTour}.steps). */
const TOTAL_STEPS = 4

// ── Singleton state (shared across every useOnboarding() caller) ──────────

/**
 * `true` once the user has completed or dismissed the tour.
 * Loaded from localStorage on first access.
 */
const hasSeenOnboarding = ref(false)

/** Whether the tour overlay is currently visible. */
const isTourActive = ref(false)

/** Zero-based index of the currently displayed step. */
const currentStep = ref(0)

/** Guards against re-reading localStorage on every call. */
let _initialized = false

/**
 * Read the "seen" flag from localStorage into {@link hasSeenOnboarding}.
 * Failures (private mode, disabled storage) silently default to `false`.
 */
function _load(): void {
  if (!import.meta.client) return
  try {
    hasSeenOnboarding.value = localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    hasSeenOnboarding.value = false
  }
}

/**
 * Write the current "seen" flag to localStorage.
 * Failures are swallowed so the tour never throws in restricted environments.
 */
function _persist(): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, hasSeenOnboarding.value ? 'true' : 'false')
  } catch {
    /* storage unavailable — preferences simply won't survive reload */
  }
}

/**
 * Onboarding tour controller.
 *
 * Call from any component to read or drive the tour. The returned refs are
 * the *same* instances on every call, so mutations propagate everywhere.
 *
 * @example
 * ```ts
 * const onboarding = useOnboarding()
 * if (!onboarding.hasSeenOnboarding.value) onboarding.startTour()
 * ```
 */
export function useOnboarding() {
  // Hydrate from storage exactly once, lazily, on the client.
  if (!_initialized && import.meta.client) {
    _initialized = true
    _load()
  }

  /** Open the tour at the first step. */
  function startTour(): void {
    currentStep.value = 0
    isTourActive.value = true
  }

  /** Advance one step; on the final step this is a no-op (use {@link endTour}). */
  function nextStep(): void {
    if (currentStep.value < TOTAL_STEPS - 1) {
      currentStep.value++
    }
  }

  /** Go back one step; on the first step this is a no-op. */
  function prevStep(): void {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  /** Jump directly to a step by index. Out-of-range values are ignored. */
  function goToStep(index: number): void {
    if (index >= 0 && index < TOTAL_STEPS) {
      currentStep.value = index
    }
  }

  /**
   * Close the tour after the final step.
   *
   * Does **not** touch persistence — the caller decides whether to remember
   * the tour via {@link markComplete} / {@link resetOnboarding} (e.g. based
   * on a "Don't show again" checkbox).
   */
  function endTour(): void {
    isTourActive.value = false
    currentStep.value = 0
  }

  /**
   * Close the tour without reaching the end (Skip / Escape).
   *
   * Like {@link endTour} this only closes the UI; callers typically pair it
   * with {@link markComplete} so a skipped tour doesn't reappear next visit.
   */
  function dismissTour(): void {
    isTourActive.value = false
    currentStep.value = 0
  }

  /** Remember that the user has seen the tour (persists to localStorage). */
  function markComplete(): void {
    hasSeenOnboarding.value = true
    _persist()
  }

  /** Forget that the user has seen the tour so it will auto-offer again. */
  function resetOnboarding(): void {
    hasSeenOnboarding.value = false
    _persist()
  }

  return {
    hasSeenOnboarding,
    isTourActive,
    currentStep,
    totalSteps: TOTAL_STEPS,
    startTour,
    nextStep,
    prevStep,
    goToStep,
    endTour,
    dismissTour,
    markComplete,
    resetOnboarding,
  }
}
