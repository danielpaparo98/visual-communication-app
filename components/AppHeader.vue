<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 print:hidden">
    <div class="container mx-auto px-6">
      <nav class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-xl font-bold text-neutral-900 tracking-tight group-hover:tracking-wide transition-all duration-300">
            Talking Chart
          </span>
        </NuxtLink>
        
        <!-- Navigation -->
        <div class="flex items-center gap-8">
          <NuxtLink
            to="/"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/chart"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/chart' }"
          >
            Create
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header component with navigation
</script>

<style scoped>
@import "tailwindcss";
.nav-link {
  @apply text-sm font-medium text-neutral-500 hover:text-neutral-900
         transition-all duration-200 cursor-pointer relative;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-px bg-neutral-900
         transition-all duration-300;
}

.nav-link:hover::after,
.nav-link-active::after {
  @apply w-full;
}

.nav-link-active {
  @apply text-neutral-900 font-semibold;
}
</style>
