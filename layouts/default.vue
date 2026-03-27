<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
    <!-- Subtle background pattern -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.015]">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    <AppHeader />
    <main class="flex-1 relative">
      <NuxtPage :transition="{
        name: 'page',
        mode: 'out-in'
      }" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout with header and footer
</script>
