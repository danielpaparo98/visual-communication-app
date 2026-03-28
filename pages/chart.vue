<template>
  <div class="container h-full">
    <EditorShell />
  </div>
</template>

<script setup lang="ts">
import EditorShell from '~/components/EditorShell.vue'

// Initialize stores
const chartStore = useChartStore()
const iconsStore = useIconsStore()

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
