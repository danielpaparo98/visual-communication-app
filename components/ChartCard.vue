<template>
  <div class="chart-card group relative bg-white rounded-xl border border-neutral-200 p-3 sm:p-4 transition-all duration-200 hover:border-neutral-400 hover:shadow-md print:border-neutral-400 cursor-default">
    <!-- Icon Area -->
    <button
      class="icon-button relative w-full aspect-square mb-3 rounded-lg bg-neutral-50 overflow-hidden transition-all duration-200 hover:bg-neutral-100 print:pointer-events-none cursor-pointer"
      @click="openIconPicker"
    >
      <img
        v-if="iconSrc"
        :src="iconSrc"
        :alt="icon?.alt || 'Card icon'"
        class="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-200 group-hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-neutral-300">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      
      <!-- Change Icon Overlay -->
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 opacity-0 group-hover:opacity-100 transition-all duration-200 print:hidden">
        <svg class="w-8 h-8 text-white mb-1 transform scale-75 group-hover:scale-100 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-white text-sm font-medium">Change Icon</span>
      </div>
    </button>
    
    <!-- Heading Input -->
    <input
      :value="card.heading"
      type="text"
      :maxlength="maxHeading"
      :placeholder="'Heading'"
      class="w-full text-center text-sm sm:text-base font-semibold text-neutral-900 bg-transparent border-0 border-b-2 border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-none focus:ring-0 py-1 px-2 print:border-transparent transition-colors duration-200 cursor-text"
      @change="updateHeading(($event.target as HTMLInputElement).value)"
    />
    
    <!-- Subtitle Input -->
    <input
      :value="card.subtitle"
      type="text"
      :maxlength="maxSubtitle"
      :placeholder="'Subtitle'"
      class="w-full text-center text-xs sm:text-sm text-neutral-600 bg-transparent border-0 border-b-2 border-transparent hover:border-neutral-200 focus:border-neutral-900 focus:outline-none focus:ring-0 py-1 px-2 print:border-transparent transition-colors duration-200 cursor-text"
      @change="updateSubtitle(($event.target as HTMLInputElement).value)"
    />
    
    <!-- Character Count (visible on hover) -->
    <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 print:hidden">
      {{ card.heading.length }}/{{ maxHeading }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/types'
import { MAX_HEADING_LENGTH, MAX_SUBTITLE_LENGTH } from '~/types'

interface Props {
  card: Card
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:icon': [cardId: string, iconId: string]
  'update:heading': [cardId: string, heading: string]
  'update:subtitle': [cardId: string, subtitle: string]
  'open-picker': [cardId: string]
}>()

const iconsStore = useIconsStore()

const maxHeading = MAX_HEADING_LENGTH
const maxSubtitle = MAX_SUBTITLE_LENGTH

const icon = computed(() => {
  if (!props.card.iconId) return null
  return iconsStore.getIconById(props.card.iconId)
})

const iconSrc = computed(() => {
  if (!icon.value) return null
  return `/icons/${icon.value.filename}`
})

function openIconPicker() {
  emit('open-picker', props.card.id)
}

function updateHeading(value: string) {
  emit('update:heading', props.card.id, value)
}

function updateSubtitle(value: string) {
  emit('update:subtitle', props.card.id, value)
}
</script>
