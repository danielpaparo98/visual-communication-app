<template>
  <section aria-label="Chart grid">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Loading skeleton -->
      <template v-if="loading">
        <div
          v-for="i in 20"
          :key="'skeleton-' + i"
          class="card-slot card-slot--empty min-h-[120px] sm:min-h-[140px] animate-pulse"
          aria-hidden="true"
        >
          <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100" />
          <div class="h-4 w-16 rounded bg-slate-100" />
          <div class="h-3 w-12 rounded bg-slate-50" />
        </div>
      </template>

      <!-- Actual cards -->
      <template v-else>
        <ChartCard
          v-for="(slot, i) in slots"
          :key="i"
          :slot="slot"
          :index="i"
          :active="activeIndex === i"
          @select="emit('select', $event)"
          @update-label="(val: string) => emit('update-label', i, val)"
        />
      </template>
    </div>

    <!-- Empty chart hint -->
    <p
      v-if="!loading && slots.every(s => !s.icon)"
      class="mt-4 sm:mt-5 text-sm text-slate-400 text-center"
    >
      Tap any card, then pick an icon from the panel to get started.
    </p>
    <p
      v-else-if="!loading"
      class="mt-4 sm:mt-5 text-sm text-slate-400 text-center"
    >
      Select a card, then choose an icon from the panel. Tap a label to edit it.
    </p>
  </section>
</template>

<script setup lang="ts">
import type { ChartSlot } from '~/types/chart'

defineProps<{
  slots: ChartSlot[]
  activeIndex: number | null
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
  'update-label': [index: number, value: string]
}>()
</script>
