<template>
  <div
    ref="cardRef"
    :class="[
      'card-slot',
      active ? 'card-slot--selected' : '',
      hasIcon ? 'card-slot--filled' : 'card-slot--empty',
    ]"
    @click="handleCardClick"
    role="button"
    :tabindex="0"
    :aria-label="ariaLabel"
    @keyup.enter="handleCardClick"
    @keyup.space.prevent="handleCardClick"
  >
    <!-- Empty state -->
    <template v-if="!hasIcon">
      <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8" stroke-linecap="round"/>
          <path d="M8 12h8" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="text-sm text-slate-400 font-medium">Add icon</span>
      <span class="text-xs text-slate-300">Slot {{ index + 1 }}</span>
    </template>

    <!-- Filled state -->
    <template v-else>
      <img
        :src="iconUrl"
        :alt="slot.icon!.alt"
        class="w-14 h-14 sm:w-16 sm:h-16 object-contain pointer-events-none"
        loading="lazy"
      />

      <!-- Editable label -->
      <div class="w-full text-center mt-1" @click.stop>
        <input
          v-if="isEditing"
          ref="labelInputRef"
          v-model="labelInput"
          @blur="saveLabel"
          @keyup.enter="saveLabel"
          @keyup.escape="cancelEdit"
          class="w-full text-center text-sm font-semibold text-slate-700 bg-white border border-primary-300 rounded-lg px-2 py-1 shadow-sm outline-none focus:ring-2 focus:ring-primary-400"
          :aria-label="`Edit label for ${slot.icon!.alt}`"
        />
        <button
          v-else
          @click.stop="handleLabelClick"
          class="group w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-slate-700 hover:text-primary-600 truncate max-w-full px-2 py-1 rounded-lg transition-colors hover:bg-slate-50"
          :aria-label="`Edit label for ${slot.icon!.alt}`"
        >
          <span class="truncate">{{ displayLabel }}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-primary-400 shrink-0">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { iconUrl } from '~/utils/iconLoader'
import type { ChartSlot } from '~/types/chart'

const props = defineProps<{
  slot: ChartSlot | null
  index: number
  active: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
  'update-label': [value: string]
}>()

const isEditing = ref(false)
const labelInput = ref('')
const cardRef = ref<HTMLDivElement | null>(null)
const labelInputRef = ref<HTMLInputElement | null>(null)

const hasIcon = computed(() => !!props.slot?.icon)
const iconUrl = computed(() => {
  if (!props.slot?.icon) return ''
  return iconUrl(props.slot.icon.filename)
})
const displayLabel = computed(() => props.slot?.label || props.slot?.icon?.alt || '')
const ariaLabel = computed(() => {
  if (!props.slot?.icon) return `Slot ${props.index + 1}, empty. Press to select.`
  return `Slot ${props.index + 1}: ${props.slot.icon.alt}. Label: ${displayLabel.value}.`
})

function handleCardClick() {
  // Clicking the card always selects the slot.
  emit('select', props.index)
}

function handleLabelClick() {
  // If the card isn't already selected, select it first so the icon picker
  // context matches the slot being edited.
  if (!props.active) {
    emit('select', props.index)
  }
  startEditing()
}

function startEditing() {
  if (!props.slot?.icon) return
  isEditing.value = true
  labelInput.value = props.slot.label
  nextTick(() => {
    labelInputRef.value?.focus()
    labelInputRef.value?.select()
  })
}

function saveLabel() {
  emit('update-label', labelInput.value)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  labelInput.value = props.slot?.label || ''
}
</script>
