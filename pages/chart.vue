<template>
  <div class="container mx-auto px-4 py-8">
    <ChartContainer />
  </div>
</template>

<script setup lang="ts">
const chartStore = useChartStore()
const iconsStore = useIconsStore()

// Initialize stores on page load
onMounted(async () => {
  await iconsStore.loadIcons()
  chartStore.initializeChart()
})

// SEO
useHead({
  title: 'Create Chart - The Talking Chart',
  meta: [
    { name: 'description', content: 'Create your visual communication chart with customizable icons and text.' }
  ]
})
</script>
