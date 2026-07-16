<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="popoverRef"
      class="fixed z-[9999]"
      :style="popoverPosition"
      role="dialog"
      aria-label="Card style picker"
    >
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 p-3 w-52">
        <!-- Background swatches -->
        <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Background
        </label>
        <div class="grid grid-cols-6 gap-1.5 mb-3">
          <button
            v-for="swatch in backgroundSwatches"
            :key="swatch.value"
            :title="swatch.name"
            :aria-label="`Background: ${swatch.name}`"
            class="w-6 h-6 rounded-full border-2 transition-all duration-100 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
            :class="isSelectedBackground(swatch.value) ? 'border-slate-700 ring-2 ring-slate-400 ring-offset-1' : 'border-slate-200'"
            :style="{ backgroundColor: swatch.value }"
            @click="selectBackground(swatch.value)"
          />
        </div>

        <!-- Border swatches -->
        <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Border
        </label>
        <div class="grid grid-cols-6 gap-1.5 mb-3">
          <button
            v-for="swatch in borderSwatches"
            :key="swatch.value"
            :title="swatch.name"
            :aria-label="`Border: ${swatch.name}`"
            class="w-6 h-6 rounded-full border-2 transition-all duration-100 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
            :class="isSelectedBorder(swatch.value) ? 'border-slate-700 ring-2 ring-slate-400 ring-offset-1' : 'border-slate-200'"
            :style="{ backgroundColor: swatch.value }"
            @click="selectBorder(swatch.value)"
          />
        </div>

        <!-- Clear button -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
          <span class="text-[10px] text-slate-400 font-medium truncate">
            {{ hasOverrides ? 'Custom' : 'Theme default' }}
          </span>
          <button
            v-if="hasOverrides"
            class="text-[11px] font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
            @click="clearAll"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface ColorSwatch {
  name: string
  value: string
}

const props = defineProps<{
  show: boolean
  background: string | undefined
  borderColor: string | undefined
  /** CSS selector for the trigger element used for positioning. */
  triggerSelector?: string
}>()

const emit = defineEmits<{
  'update:background': [value: string | undefined]
  'update:borderColor': [value: string | undefined]
  clear: []
  close: []
}>()

// ── Color swatches ───────────────────────────────────────────────────────

const backgroundSwatches: ColorSwatch[] = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: 'oklch(0.95 0.03 245)' },
  { name: 'Green', value: 'oklch(0.95 0.05 150)' },
  { name: 'Yellow', value: 'oklch(0.95 0.06 95)' },
  { name: 'Red', value: 'oklch(0.95 0.04 25)' },
  { name: 'Purple', value: 'oklch(0.95 0.04 290)' },
]

const borderSwatches: ColorSwatch[] = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: 'oklch(0.60 0.16 245)' },
  { name: 'Green', value: 'oklch(0.55 0.15 150)' },
  { name: 'Yellow', value: 'oklch(0.80 0.14 95)' },
  { name: 'Red', value: 'oklch(0.60 0.18 25)' },
  { name: 'Purple', value: 'oklch(0.60 0.14 290)' },
]

// ── Selection helpers ────────────────────────────────────────────────────

function isSelectedBackground(value: string): boolean {
  return props.background === value
}

function isSelectedBorder(value: string): boolean {
  return props.borderColor === value
}

const hasOverrides = computed(() => !!props.background || !!props.borderColor)

function selectBackground(value: string) {
  // Toggle: clicking the already-selected color deselects it (revert to theme)
  if (props.background === value) {
    emit('update:background', undefined)
  } else {
    emit('update:background', value)
  }
}

function selectBorder(value: string) {
  if (props.borderColor === value) {
    emit('update:borderColor', undefined)
  } else {
    emit('update:borderColor', value)
  }
}

function clearAll() {
  emit('clear')
  emit('close')
}

// ── Positioning ──────────────────────────────────────────────────────────

const popoverRef = ref<HTMLElement | null>(null)
const popoverPosition = ref<Record<string, string>>({ top: '0px', left: '-9999px' })

function updatePosition() {
  if (!props.triggerSelector) return

  const trigger = document.querySelector(props.triggerSelector) as HTMLElement | null
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const popoverWidth = 208 // 52 * 4 = 208px (w-52)
  const popoverHeight = 240 // approximate

  let top = rect.bottom + 4
  let left = rect.left

  // Avoid overflowing right edge
  if (left + popoverWidth > window.innerWidth - 8) {
    left = window.innerWidth - popoverWidth - 8
  }

  // Avoid overflowing bottom edge — show above if needed
  if (top + popoverHeight > window.innerHeight - 8) {
    top = rect.top - popoverHeight - 4
  }

  // Clamp to positive
  left = Math.max(4, left)
  top = Math.max(4, top)

  popoverPosition.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

// ── Outside click handling ───────────────────────────────────────────────

function handleClickOutside(e: MouseEvent) {
  if (!props.show) return
  if (!popoverRef.value) return
  if (popoverRef.value.contains(e.target as Node)) return

  // Don't close if clicking the trigger button itself
  if (props.triggerSelector) {
    const trigger = document.querySelector(props.triggerSelector) as HTMLElement | null
    if (trigger && trigger.contains(e.target as Node)) return
  }

  emit('close')
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      nextTick(updatePosition)
    }
  },
)

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
