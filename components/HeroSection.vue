<template>
  <section class="relative bg-white py-24 sm:py-32 border-b border-neutral-200">
    <div class="container mx-auto px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Badge -->
        <div class="inline-block mb-8">
          <span class="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            Free & Open Source
          </span>
        </div>
        
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-[1.1] tracking-tight">
          The Talking Chart
        </h1>
        
        <p class="text-xl sm:text-2xl text-neutral-600 mb-12 leading-relaxed font-normal max-w-2xl">
          Create visual communication charts for individuals with communication difficulties.
          <span class="text-neutral-900 font-medium">Free, easy to use, and works offline.</span>
        </p>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <NuxtLink to="/chart">
            <AppButton variant="primary" size="lg" class="w-full sm:w-auto">
              Create a Chart
            </AppButton>
          </NuxtLink>
          <a href="#about" class="group flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium">
            <span>Learn more</span>
            <svg class="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
        
        <!-- Stats row -->
        <div class="mt-20 grid grid-cols-3 gap-12 pt-12 border-t border-neutral-200">
          <div class="text-center">
            <div class="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">180+</div>
            <div class="text-sm text-neutral-500 mt-2 font-medium">Icons</div>
          </div>
          <div class="text-center border-l border-neutral-200">
            <div class="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">5</div>
            <div class="text-sm text-neutral-500 mt-2 font-medium">Categories</div>
          </div>
          <div class="text-center border-l border-neutral-200">
            <div class="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">100%</div>
            <div class="text-sm text-neutral-500 mt-2 font-medium">Free</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero section component
</script>
