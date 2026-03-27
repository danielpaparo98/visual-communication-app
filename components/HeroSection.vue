<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 py-20 sm:py-32">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10 pattern-bg"></div>
    
    <div class="container mx-auto px-4 relative">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
          The Talking Chart
        </h1>
        <p class="text-xl sm:text-2xl text-white/90 mb-8">
          Create visual communication charts for individuals with communication difficulties. 
          Free, easy to use, and works offline.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/chart">
            <AppButton variant="secondary" size="lg">
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </template>
              Create a Chart Now
            </AppButton>
          </NuxtLink>
          <a href="#about" class="text-white/80 hover:text-white transition-colors">
            Learn more ↓
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero section component
</script>

<style scoped>
.pattern-bg {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
