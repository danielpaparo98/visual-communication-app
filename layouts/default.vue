<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
    <ChartPrint />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
// Default layout — header, page content, footer, hidden print sheet
</script>
