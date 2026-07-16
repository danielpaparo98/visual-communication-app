<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="panel-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        @click="close"
        @keydown.escape="close"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition name="panel-slide">
      <div
        v-if="modelValue"
        ref="panelRef"
        class="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Customization panel"
        @keydown.escape="close"
      >
        <!-- ── Header ── -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <h2 class="font-heading font-bold text-lg text-slate-800">Customize</h2>
          <button
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label="Close customization panel"
            @click="close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- ── Scrollable content ── -->
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <!-- ── THEME section ── -->
          <div class="border-b border-slate-100 pb-5">
            <button
              class="flex items-center justify-between w-full text-left group"
              @click="sections.theme = !sections.theme"
              :aria-expanded="sections.theme"
              aria-controls="section-theme"
            >
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Theme</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': sections.theme }"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <Transition name="section-fade">
              <div v-if="sections.theme" id="section-theme" class="mt-4">
                <div class="flex flex-wrap gap-2.5">
                  <button
                    v-for="t in COLOR_THEMES"
                    :key="t.id"
                    :title="t.name"
                    @click="chartStore.setTheme(t.id)"
                    :class="[
                      'w-8 h-8 rounded-full transition-all duration-150 border-2 shrink-0',
                      chartStore.themeId === t.id
                        ? 'border-slate-700 ring-2 ring-offset-2 ring-slate-400 scale-110'
                        : 'border-slate-200 hover:scale-110 hover:border-slate-400',
                    ]"
                    :style="{ backgroundColor: t.primary }"
                    :aria-label="`${t.name} theme`"
                    :aria-pressed="chartStore.themeId === t.id"
                  />
                </div>
                <p class="mt-3 text-xs text-slate-400">
                  Active: <span class="font-medium text-slate-600">{{ activeThemeName }}</span>
                </p>
              </div>
            </Transition>
          </div>

          <!-- ── FONTS section ── -->
          <div class="border-b border-slate-100 pb-5">
            <button
              class="flex items-center justify-between w-full text-left group"
              @click="sections.fonts = !sections.fonts"
              :aria-expanded="sections.fonts"
              aria-controls="section-fonts"
            >
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Fonts</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': sections.fonts }"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <Transition name="section-fade">
              <div v-if="sections.fonts" id="section-fonts" class="mt-4 space-y-4">
                <!-- Heading font -->
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700" for="panel-heading-font">Heading</label>
                  <select
                    id="panel-heading-font"
                    :value="chartStore.headingFontId"
                    @change="chartStore.setHeadingFont(($event.target as HTMLSelectElement).value)"
                    class="w-full text-sm font-semibold rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-slate-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-400"
                    :style="{ fontFamily: chartStore.activeHeadingFont.cssFamily }"
                  >
                    <option
                      v-for="f in HEADING_FONTS"
                      :key="f.id"
                      :value="f.id"
                      :style="{ fontFamily: f.cssFamily }"
                    >
                      {{ f.name }}
                    </option>
                  </select>
                </div>
                <!-- Body / label font -->
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700" for="panel-body-font">Labels</label>
                  <select
                    id="panel-body-font"
                    :value="chartStore.bodyFontId"
                    @change="chartStore.setBodyFont(($event.target as HTMLSelectElement).value)"
                    class="w-full text-sm font-medium rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-slate-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-400"
                    :style="{ fontFamily: chartStore.activeBodyFont.cssFamily }"
                  >
                    <option
                      v-for="f in BODY_FONTS"
                      :key="f.id"
                      :value="f.id"
                      :style="{ fontFamily: f.cssFamily }"
                    >
                      {{ f.name }}
                    </option>
                  </select>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ── SPACING section ── -->
          <div class="border-b border-slate-100 pb-5">
            <button
              class="flex items-center justify-between w-full text-left group"
              @click="sections.spacing = !sections.spacing"
              :aria-expanded="sections.spacing"
              aria-controls="section-spacing"
            >
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Spacing</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': sections.spacing }"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <Transition name="section-fade">
              <div v-if="sections.spacing" id="section-spacing" class="mt-4 space-y-5">
                <!-- Page Margin -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-700" for="panel-margin">Margin</label>
                    <span class="text-xs font-medium text-slate-500 tabular-nums">{{ chartStore.margin }} mm</span>
                  </div>
                  <input
                    id="panel-margin"
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    :value="chartStore.margin"
                    @input="chartStore.setMargin(parseInt(($event.target as HTMLInputElement).value))"
                    class="w-full h-2 accent-primary-500 cursor-pointer rounded-full appearance-none bg-slate-100"
                    aria-label="Page margin in millimetres"
                  />
                </div>
                <!-- Card Gap -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-slate-700" for="panel-gap">Gap</label>
                    <span class="text-xs font-medium text-slate-500 tabular-nums">{{ chartStore.cardGap }} mm</span>
                  </div>
                  <input
                    id="panel-gap"
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    :value="chartStore.cardGap"
                    @input="chartStore.setCardGap(parseInt(($event.target as HTMLInputElement).value))"
                    class="w-full h-2 accent-primary-500 cursor-pointer rounded-full appearance-none bg-slate-100"
                    aria-label="Card gap in millimetres"
                  />
                </div>
              </div>
            </Transition>
          </div>

          <!-- ── CARD STYLE section (only when a card is selected) ── -->
          <div v-if="selectedCardIndex !== null" class="border-b border-slate-100 pb-5">
            <button
              class="flex items-center justify-between w-full text-left group"
              @click="sections.cardStyle = !sections.cardStyle"
              :aria-expanded="sections.cardStyle"
              aria-controls="section-card-style"
            >
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Card Style</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': sections.cardStyle }"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <Transition name="section-fade">
              <div v-if="sections.cardStyle" id="section-card-style" class="mt-4 space-y-4">
                <!-- Background swatches -->
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700">Background</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="swatch in BACKGROUND_SWATCHES"
                      :key="swatch.value"
                      :title="swatch.name"
                      :aria-label="`Background: ${swatch.name}`"
                      class="w-7 h-7 rounded-full border-2 transition-all duration-100 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
                      :class="selectedBackground === swatch.value ? 'border-slate-700 ring-2 ring-slate-400 ring-offset-1' : 'border-slate-200'"
                      :style="{ backgroundColor: swatch.value }"
                      @click="setBackgroundColor(swatch.value)"
                    />
                  </div>
                </div>
                <!-- Border swatches -->
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700">Border</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="swatch in BORDER_SWATCHES"
                      :key="swatch.value"
                      :title="swatch.name"
                      :aria-label="`Border: ${swatch.name}`"
                      class="w-7 h-7 rounded-full border-2 transition-all duration-100 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
                      :class="selectedBorder === swatch.value ? 'border-slate-700 ring-2 ring-slate-400 ring-offset-1' : 'border-slate-200'"
                      :style="{ backgroundColor: swatch.value }"
                      @click="setBorderColor(swatch.value)"
                    />
                  </div>
                </div>
                <!-- Clear button -->
                <div class="flex items-center justify-between pt-1">
                  <span class="text-xs text-slate-400 font-medium">
                    {{ hasCardStyleOverrides ? 'Custom style applied' : 'Using theme defaults' }}
                  </span>
                  <button
                    v-if="hasCardStyleOverrides"
                    class="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition-colors"
                    @click="clearCardStyle"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Null state when no card selected -->
          <div
            v-if="selectedCardIndex === null"
            class="pb-2"
          >
            <div class="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0 text-slate-400">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <p class="text-xs text-slate-500">
                Select a card on the canvas to customise its style individually.
              </p>
            </div>
          </div>
        </div>

        <!-- ── Footer ── -->
        <div class="px-5 py-4 border-t border-slate-200 shrink-0">
          <button
            class="w-full text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg transition-colors border border-slate-200 hover:border-red-200"
            @click="resetDefaults"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { COLOR_THEMES, getDefaultTheme } from '~/utils/colorThemes'
import { HEADING_FONTS, BODY_FONTS } from '~/utils/fontPresets'

interface ColorSwatch {
  name: string
  value: string
}

const BACKGROUND_SWATCHES: ColorSwatch[] = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: 'oklch(0.95 0.03 245)' },
  { name: 'Green', value: 'oklch(0.95 0.05 150)' },
  { name: 'Yellow', value: 'oklch(0.95 0.06 95)' },
  { name: 'Red', value: 'oklch(0.95 0.04 25)' },
  { name: 'Purple', value: 'oklch(0.95 0.04 290)' },
]

const BORDER_SWATCHES: ColorSwatch[] = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: 'oklch(0.60 0.16 245)' },
  { name: 'Green', value: 'oklch(0.55 0.15 150)' },
  { name: 'Yellow', value: 'oklch(0.80 0.14 95)' },
  { name: 'Red', value: 'oklch(0.60 0.18 25)' },
  { name: 'Purple', value: 'oklch(0.60 0.14 290)' },
]

const props = defineProps<{
  modelValue: boolean
  selectedCardIndex: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const chartStore = useChartStore()
const panelRef = ref<HTMLElement | null>(null)

// ── Section collapse state (local only, not persisted) ──

const sections = reactive({
  theme: true,
  fonts: true,
  spacing: true,
  cardStyle: true,
})

// ── Close handler ──

function close() {
  emit('update:modelValue', false)
}

// ── Active theme name ──

const activeThemeName = computed(() => {
  const theme = COLOR_THEMES.find((t) => t.id === chartStore.themeId)
  return theme?.name ?? 'Default Blue'
})

// ── Card style helpers ──

const selectedSlotStyle = computed(() => {
  if (props.selectedCardIndex === null) return null
  const slot = chartStore.slots[props.selectedCardIndex]
  return slot?.style ?? null
})

const selectedBackground = computed(() => selectedSlotStyle.value?.backgroundColor)
const selectedBorder = computed(() => selectedSlotStyle.value?.borderColor)

const hasCardStyleOverrides = computed(() => {
  return !!selectedBackground.value || !!selectedBorder.value
})

function setBackgroundColor(value: string) {
  if (props.selectedCardIndex === null) return
  // Toggle: clicking the already-selected color deselects it
  if (selectedBackground.value === value) {
    if (selectedBorder.value) {
      chartStore.setCardStyle(props.selectedCardIndex, { borderColor: selectedBorder.value })
    } else {
      chartStore.clearCardStyle(props.selectedCardIndex)
    }
  } else {
    chartStore.setCardStyle(props.selectedCardIndex, {
      backgroundColor: value,
      borderColor: selectedBorder.value,
    })
  }
}

function setBorderColor(value: string) {
  if (props.selectedCardIndex === null) return
  if (selectedBorder.value === value) {
    if (selectedBackground.value) {
      chartStore.setCardStyle(props.selectedCardIndex, { backgroundColor: selectedBackground.value })
    } else {
      chartStore.clearCardStyle(props.selectedCardIndex)
    }
  } else {
    chartStore.setCardStyle(props.selectedCardIndex, {
      backgroundColor: selectedBackground.value,
      borderColor: value,
    })
  }
}

function clearCardStyle() {
  if (props.selectedCardIndex === null) return
  chartStore.clearCardStyle(props.selectedCardIndex)
}

// ── Reset to defaults ──

function resetDefaults() {
  // Reset theme to default
  chartStore.setTheme(getDefaultTheme().id)
  // Reset fonts to defaults
  chartStore.setHeadingFont('outfit')
  chartStore.setBodyFont('inter')
  // Reset spacing
  chartStore.setMargin(15)
  chartStore.setCardGap(5)
  // Clear all per-card style overrides (only if there are any)
  for (let i = 0; i < chartStore.slots.length; i++) {
    if (chartStore.slots[i]?.style) {
      chartStore.clearCardStyle(i)
    }
  }
}

// ── Keyboard: close on Escape ──

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* ── Backdrop fade ── */
.panel-backdrop-enter-active,
.panel-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.panel-backdrop-enter-from,
.panel-backdrop-leave-to {
  opacity: 0;
}

/* ── Panel slide from right ── */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.3s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}

/* ── Section expand/collapse ── */
.section-fade-enter-active,
.section-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.section-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.section-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
