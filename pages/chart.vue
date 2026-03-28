<template>
  <div class="container">
    <ChartEditor />
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

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
