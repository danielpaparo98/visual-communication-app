<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppHeader />
    <main class="flex-1 pt-16">
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
