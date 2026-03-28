<template>
  <div class="container h-full">
    <ChartEditor />
  </div>
</template>

<script setup lang="ts">
// Use the dedicated editor layout (no header/footer)
definePageMeta({
  layout: 'editor'
})

import ChartEditor from '~/components/ChartEditor.vue'

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
