<template>
  <header class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md print:hidden">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo/Brand -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span class="text-xl font-heading font-bold text-primary-700">Talking Chart</span>
        </NuxtLink>
        
        <!-- Navigation -->
        <nav class="flex items-center gap-2">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/chart"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            :class="{ 'bg-primary-50 text-primary-700': $route.path === '/chart' }"
          >
            Create Chart
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component with navigation
</script>
