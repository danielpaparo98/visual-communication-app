<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24" aria-label="How It Works">
    <h2 class="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 text-center mb-12 sm:mb-16 tracking-tight">
      How it works
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="relative text-center"
      >
        <!-- Step number circle -->
        <div
          class="w-14 h-14 rounded-full bg-primary-100 text-primary-700 font-heading font-bold text-2xl flex items-center justify-center mx-auto mb-5"
          :aria-label="'Step ' + (i + 1)"
        >
          {{ i + 1 }}
        </div>
        <h3 class="font-heading font-bold text-xl text-slate-800 mb-2">{{ step.title }}</h3>
        <p class="text-slate-600 leading-relaxed max-w-xs mx-auto">{{ step.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Pick Your Icons',
    description:
      'Browse 416 icons across 9 categories. Tap any card slot and choose the icon that fits.',
  },
  {
    title: 'Add Labels',
    description:
      'Give each icon a short label so everyone understands what it means.',
  },
  {
    title: 'Print & Go',
    description:
      'Hit Print. Your chart comes out clean on A4 landscape. Ready to use.',
  },
]
</script>
