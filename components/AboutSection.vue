<template>
  <section id="about" class="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
            About
          </span>
          <h2 class="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
            Empowering Communication
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            The Talking Chart was created to help individuals who have difficulty communicating verbally.
            Whether due to illness, disability, or other circumstances, visual communication charts
            (PECS) can be a powerful tool.
          </p>
        </div>
        
        <!-- Feature Cards Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <div class="feature-card group">
            <div class="feature-icon bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-gray-900 mb-1">180+ Icons</h3>
            <p class="text-sm text-gray-500">Across 5 categories including family, health, and accessibility</p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-accent-100 text-accent-600 group-hover:bg-accent-500 group-hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-gray-900 mb-1">Fully Customizable</h3>
            <p class="text-sm text-gray-500">Add custom headings and subtitles to each card</p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-gray-900 mb-1">Auto-Saves</h3>
            <p class="text-sm text-gray-500">Your chart is automatically saved to your browser</p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-gray-900 mb-1">Print-Ready</h3>
            <p class="text-sm text-gray-500">Optimized for printing on A4 landscape paper</p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-gray-900 mb-1">Works Offline</h3>
            <p class="text-sm text-gray-500">No internet needed after first load</p>
          </div>
          
          <div class="feature-card group">
            <div class="feature-icon bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="font-heading font-semibold text-gray-900 mb-1">100% Free</h3>
            <p class="text-sm text-gray-500">Open source and free to use forever</p>
          </div>
        </div>
        
        <!-- CTA -->
        <div class="text-center">
          <NuxtLink to="/chart">
            <AppButton variant="primary" size="lg" class="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </template>
              Get Started Now
            </AppButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// About section component
</script>

<style scoped>
.feature-card {
  @apply relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100
         hover:shadow-lg hover:border-primary-200 transition-all duration-300
         cursor-default;
}

.feature-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center mb-4
         transition-colors duration-300;
}
</style>
