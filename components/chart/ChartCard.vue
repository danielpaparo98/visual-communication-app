<template>
  <div class="chart-card group relative bg-white rounded-2xl border-2 border-gray-200 p-3 transition-all hover:border-primary-300 hover:shadow-lg print:border-gray-300">
    <!-- Icon Area -->
    <button
      class="relative w-full aspect-square mb-2 rounded-xl bg-gray-50 overflow-hidden hover:bg-gray-100 transition-colors print:pointer-events-none"
      @click="openIconPicker"
    >
      <img
        v-if="iconSrc"
        :src="iconSrc"
        :alt="icon?.alt || 'Card icon'"
        class="w-full h-full object-contain p-2"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      
      <!-- Change Icon Overlay -->
      <div class="absolute inset-0 flex items-center justify-center bg-primary-500/80 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
        <span class="text-white text-sm font-medium">Change Icon</span>
      </div>
    </button>
    
    <!-- Heading Input -->
    <input
      :value="card.heading"
      type="text"
      :maxlength="maxHeading"
      :placeholder="'Heading'"
      class="w-full text-center text-sm font-semibold text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-0 p-1 print:border-transparent"
      @change="updateHeading(($event.target as HTMLInputElement).value)"
    />
    
    <!-- Subtitle Input -->
    <input
      :value="card.subtitle"
      type="text"
      :maxlength="maxSubtitle"
      :placeholder="'Subtitle'"
      class="w-full text-center text-xs text-gray-500 bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-primary-400 focus:outline-none focus:ring-0 p-1 print:border-transparent"
      @change="updateSubtitle(($event.target as HTMLInputElement).value)"
    />
    
    <!-- Character Count (visible on hover) -->
    <div class="absolute top-2 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
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

<style scoped>
.chart-card {
  break-inside: avoid;
}

@media print {
  .chart-card {
    box-shadow: none;
  }
}
</style>
