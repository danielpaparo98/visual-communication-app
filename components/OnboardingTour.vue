<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div
        v-if="isTourActive"
        class="fixed inset-0"
        style="z-index: 60"
      >
        <!--
          Full-screen click catcher: transparent but absorbs pointer events so
          the user can't interact with the app mid-tour. The dimming itself
          comes from the spotlight's giant box-shadow below (so the highlighted
          element stays bright through the "hole").
        -->
        <div class="tour-overlay" @click="scheduleUpdate" />

        <!-- Spotlight: transparent box over the target; its huge box-shadow
             paints the semi-opaque backdrop everywhere except the hole. -->
        <div class="tour-spotlight" :style="spotlightStyle" aria-hidden="true" />

        <!-- Tooltip card -->
        <div
          ref="tooltipRef"
          tabindex="-1"
          role="dialog"
          aria-modal="false"
          class="tour-tooltip w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none"
          :style="tooltipStyle"
          :aria-label="`Onboarding tour, step ${currentStep + 1} of ${steps.length}: ${current.title}`"
        >
          <Transition name="tour-step" mode="out-in">
            <div :key="currentStep" class="p-5">
              <!-- Header: step badge + close -->
              <div class="mb-3 flex items-center justify-between">
                <span
                  class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-primary-600"
                >
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[11px] font-extrabold text-primary-700"
                  >
                    {{ currentStep + 1 }}
                  </span>
                  Step {{ currentStep + 1 }} of {{ steps.length }}
                </span>
                <button
                  type="button"
                  class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-primary-400"
                  aria-label="Skip tour"
                  @click="handleSkip"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <!-- Title + body -->
              <h3 class="font-heading text-lg font-extrabold leading-tight text-slate-800">
                {{ current.title }}
              </h3>
              <p class="mt-1.5 text-sm leading-relaxed text-slate-600">
                {{ current.body }}
              </p>

              <!-- Step dots (clickable to jump) -->
              <div class="mt-4 flex items-center justify-center gap-1.5">
                <button
                  v-for="(s, i) in steps"
                  :key="i"
                  type="button"
                  :class="[
                    'h-1.5 rounded-full transition-all duration-200',
                    i === currentStep
                      ? 'w-6 bg-primary-500'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400',
                  ]"
                  :aria-label="`Go to step ${i + 1}`"
                  :aria-current="i === currentStep ? 'step' : undefined"
                  @click="goToStep(i)"
                />
              </div>

              <!-- "Don't show again" — only on the final step -->
              <label
                v-if="isLast"
                class="mt-4 flex cursor-pointer select-none items-center gap-2 text-xs text-slate-500"
              >
                <input
                  v-model="dontShowAgain"
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 accent-primary-500"
                />
                Don't show this tour again
              </label>

              <!-- Footer: back / skip + next -->
              <div class="mt-5 flex items-center justify-between gap-2">
                <button
                  v-if="isFirst"
                  type="button"
                  class="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-md px-1 py-0.5"
                  @click="handleSkip"
                >
                  Skip
                </button>
                <button
                  v-else
                  type="button"
                  class="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  @click="prevStep"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <button
                  type="button"
                  class="btn-primary !px-5 !py-2 !text-sm focus-visible:ring-2 focus-visible:ring-primary-400"
                  @click="handleNext"
                >
                  <span>{{ isLast ? 'Get started' : 'Next' }}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Progressive onboarding tour overlay.
 *
 * Renders a 4-step guided tour that dims the page and "spotlights" key
 * regions of the chart editor. The spotlight is a transparent box positioned
 * exactly over the target element with an enormous `box-shadow` that paints
 * the semi-opaque backdrop everywhere except the hole — a simple, robust
 * technique that needs no SVG clipping.
 *
 * Target elements are located via CSS selectors (see {@link steps}); the page
 * tags the relevant regions with `data-tour-target="…"` attributes, and the
 * first canvas card already exposes `[data-card-index="0"]`.
 *
 * Positioning is viewport-relative (`position: fixed`) using
 * `getBoundingClientRect()`, recalculated on step change, window resize, and
 * scroll (rAF-throttled) so the spotlight tracks the target as the page moves.
 */
const {
  isTourActive,
  currentStep,
  nextStep,
  prevStep,
  goToStep,
  endTour,
  dismissTour,
  markComplete,
  resetOnboarding,
} = useOnboarding()

/** A single tour step: a CSS selector for the highlight target + copy. */
interface TourStep {
  selector: string
  title: string
  body: string
}

/** Ordered tour steps. Indices line up with `currentStep` from the composable. */
const steps: TourStep[] = [
  {
    selector: '[data-tour-target="canvas"]',
    title: 'Welcome to The Talking Chart!',
    body: 'This is your canvas — a printable A4 communication board. Your icon cards will live here.',
  },
  {
    selector: '[data-card-index="0"]',
    title: 'Tap a card to select it',
    body: 'Click any card on the canvas to select it (it glows blue), then pick an icon to fill it in.',
  },
  {
    selector: '[data-tour-target="icon-picker"]',
    title: 'Browse the icon library',
    body: 'Search hundreds of icons here, or upload your own SVGs. Star your favourites for quick access later.',
  },
  {
    selector: '[data-tour-target="header"]',
    title: 'Customise, preview & export',
    body: 'Up here you can switch layouts, tweak themes and fonts, preview your chart, and export to PDF or PNG. Enjoy!',
  },
]

// The `?? steps[0]!` fallback guarantees a defined step even though
// `noUncheckedIndexedAccess` types indexed access as possibly undefined.
const current = computed<TourStep>(() => steps[currentStep.value] ?? steps[0]!)
const isFirst = computed(() => currentStep.value === 0)
const isLast = computed(() => currentStep.value === steps.length - 1)

/** "Don't show again" preference on the final step (defaults to opted-out). */
const dontShowAgain = ref(true)

// ── Spotlight + tooltip geometry ──────────────────────────────────────────

/** Padding (px) added around the target element inside the spotlight hole. */
const SPOTLIGHT_PAD = 8
/** Gap (px) between the spotlight hole edge and the tooltip card. */
const GAP = 18

/** Live spotlight rectangle (viewport-relative, for `position: fixed`). */
const spotlight = reactive({ top: 0, left: 0, width: 0, height: 0 })
/** Live tooltip position (viewport-relative, for `position: fixed`). */
const tooltipPos = reactive({ top: 0, left: 0 })

/** Ref to the tooltip card so we can measure its rendered size. */
const tooltipRef = ref<HTMLElement | null>(null)

/**
 * Resolve the current step's target element from the DOM.
 * Returns `null` if the selector matches nothing (e.g. the region is hidden).
 */
function getTargetEl(): HTMLElement | null {
  if (!import.meta.client) return null
  return document.querySelector<HTMLElement>(current.value.selector)
}

/**
 * Recompute the spotlight rectangle and tooltip position for the current step.
 *
 * When the target is missing the spotlight expands to fill the viewport (so
 * the page is still dimmed) and the tooltip is centred.
 */
function updatePositions(): void {
  if (!import.meta.client) return

  const el = getTargetEl()
  const tip = tooltipRef.value
  const vw = window.innerWidth
  const vh = window.innerHeight
  const tipW = tip?.offsetWidth ?? 340
  const tipH = tip?.offsetHeight ?? 200

  if (!el) {
    // No target — dim everything and centre the tooltip.
    spotlight.top = 0
    spotlight.left = 0
    spotlight.width = vw
    spotlight.height = vh
    tooltipPos.top = Math.max(16, (vh - tipH) / 2)
    tooltipPos.left = Math.max(16, (vw - tipW) / 2)
    return
  }

  const r = el.getBoundingClientRect()

  spotlight.top = r.top - SPOTLIGHT_PAD
  spotlight.left = r.left - SPOTLIGHT_PAD
  spotlight.width = r.width + SPOTLIGHT_PAD * 2
  spotlight.height = r.height + SPOTLIGHT_PAD * 2

  // Prefer the side with more room; fall back to whichever has more space.
  const spaceBelow = vh - (r.bottom + SPOTLIGHT_PAD)
  const spaceAbove = r.top - SPOTLIGHT_PAD
  const placeBelow = spaceBelow >= tipH + GAP + 16 || spaceBelow >= spaceAbove

  tooltipPos.top = placeBelow
    ? r.bottom + SPOTLIGHT_PAD + GAP
    : Math.max(16, r.top - SPOTLIGHT_PAD - GAP - tipH)

  // Centre the tooltip on the target, clamped to the viewport with a margin.
  const centerX = r.left + r.width / 2
  const margin = 16
  let left = centerX - tipW / 2
  left = Math.max(margin, Math.min(left, vw - tipW - margin))
  tooltipPos.left = left
}

/** Smoothly bring the current target into view before measuring it. */
function scrollToTarget(): void {
  const el = getTargetEl()
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }
}

// ── rAF-throttled refresh (resize + scroll) ───────────────────────────────

let rafId: number | null = null

/** Coalesce multiple layout-triggering events into one position update. */
function scheduleUpdate(): void {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updatePositions()
  })
}

function onResize(): void {
  scheduleUpdate()
}

/**
 * Capture-phase scroll listener so we also catch scrolls inside nested
 * containers (e.g. the canvas's own overflow-auto wrapper).
 */
function onScroll(): void {
  scheduleUpdate()
}

// ── Step navigation wired to the composable ───────────────────────────────

/** Next / Finish handler — persists the "seen" flag according to the checkbox. */
function handleNext(): void {
  if (isLast.value) {
    if (dontShowAgain.value) markComplete()
    else resetOnboarding()
    endTour()
  } else {
    nextStep()
  }
}

/**
 * Skip / Escape handler.
 *
 * Marks the tour as seen so it won't auto-offer again next visit — skipping
 * is a strong signal the user doesn't want to be nagged. They can still
 * relaunch it manually from the header.
 */
function handleSkip(): void {
  markComplete()
  dismissTour()
}

// ── Keyboard support ──────────────────────────────────────────────────────

function onKeydown(event: KeyboardEvent): void {
  if (!isTourActive.value) return
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      handleSkip()
      break
    case 'ArrowRight':
    case 'Enter':
      event.preventDefault()
      handleNext()
      break
    case 'ArrowLeft':
      event.preventDefault()
      prevStep()
      break
  }
}

// ── Reactivity: (re)measure when the tour opens or the step changes ───────

/**
 * Refresh geometry after a step change / tour start.
 *
 * Scrolls the target in, then re-measures on two ticks (immediate + after the
 * ~smooth-scroll settles) to stay aligned.
 */
async function refreshForStep(): Promise<void> {
  await nextTick()
  scrollToTarget()
  updatePositions()
  // Re-measure once the smooth-scroll animation has had time to settle.
  window.setTimeout(updatePositions, 350)
  // Return keyboard focus to the tooltip so screen-reader users land on it.
  nextTick(() => tooltipRef.value?.focus())
}

watch(isTourActive, async (active) => {
  if (active) {
    dontShowAgain.value = true
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    await refreshForStep()
  } else {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions)
  }
})

watch(currentStep, async () => {
  if (!isTourActive.value) return
  await refreshForStep()
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions)
  if (rafId !== null) cancelAnimationFrame(rafId)
})

// ── Inline styles ─────────────────────────────────────────────────────────

const spotlightStyle = computed(() => ({
  top: `${spotlight.top}px`,
  left: `${spotlight.left}px`,
  width: `${spotlight.width}px`,
  height: `${spotlight.height}px`,
}))

const tooltipStyle = computed(() => ({
  top: `${tooltipPos.top}px`,
  left: `${tooltipPos.left}px`,
}))
</script>

<style scoped>
/*
 * Spotlight hole — transparent box with a vast box-shadow that paints the
 * backdrop. The first shadow layer is a thin bright ring hugging the hole
 * edge (painted on top); the second is the huge dim spread.
 */
.tour-spotlight {
  position: fixed;
  z-index: 50;
  border-radius: 14px;
  pointer-events: none;
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.9),
    0 0 0 9999px oklch(0.18 0.05 250 / 0.62);
  transition:
    top 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    left 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Full-screen transparent click catcher. */
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: auto;
}

/* Tooltip card. */
.tour-tooltip {
  position: fixed;
  z-index: 60;
  transition:
    top 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    left 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Whole-tour fade in/out. */
.tour-fade-enter-active,
.tour-fade-leave-active {
  transition: opacity 0.25s ease;
}
.tour-fade-enter-from,
.tour-fade-leave-to {
  opacity: 0;
}

/* Per-step content swap (fade-through). */
.tour-step-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tour-step-leave-active {
  transition: opacity 0.15s ease;
}
.tour-step-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.tour-step-leave-to {
  opacity: 0;
}
</style>
