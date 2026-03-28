<template>
  <section class="relative bg-white py-20 sm:py-28 border-b border-neutral-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-8 tracking-wide uppercase">
          <span>Free & Open Source</span>
        </div>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight tracking-tight">
          The Talking Chart
        </h1>
        
        <p class="text-xl sm:text-2xl text-neutral-600 mb-10 leading-relaxed font-normal">
          Create visual communication charts for individuals with communication difficulties.
          <span class="text-neutral-900 font-medium">Free, easy to use, and works offline.</span>
        </p>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <NuxtLink to="/chart">
            <AppButton variant="primary" size="lg" class="w-full sm:w-auto">
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </template>
              Create a Chart
            </AppButton>
          </NuxtLink>
          <a href="#about" class="group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
            <span>Learn more</span>
            <svg class="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
        
        <!-- Stats row -->
        <div class="mt-16 grid grid-cols-3 gap-8 pt-8 border-t border-neutral-200">
          <div class="text-center">
            <div class="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">180+</div>
            <div class="text-sm text-neutral-600 mt-1">Icons</div>
          </div>
          <div class="text-center border-l border-neutral-200">
            <div class="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">5</div>
            <div class="text-sm text-neutral-600 mt-1">Categories</div>
          </div>
          <div class="text-center border-l border-neutral-200">
            <div class="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">100%</div>
            <div class="text-sm text-neutral-600 mt-1">Free</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero section component
</script>
