<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-neutral-200 print:hidden">
    <div class="container mx-auto">
      <nav class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Brand -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 group-hover:bg-neutral-800 transition-colors duration-200">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span class="text-lg font-bold text-neutral-900 tracking-tight">
              Talking Chart
            </span>
          </NuxtLink>
          
          <!-- Navigation -->
          <div class="flex items-center gap-1">
            <NuxtLink
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </NuxtLink>
            <NuxtLink
              to="/chart"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/chart' }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Chart</span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component with navigation
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
         text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900
         transition-colors duration-200 cursor-pointer;
}

.nav-link-active {
  @apply bg-neutral-100 text-neutral-900 font-semibold;
}
</style>
