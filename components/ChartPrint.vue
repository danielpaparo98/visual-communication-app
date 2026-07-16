<template>
  <!--
    Print-only rendering of the communication chart.
    Hidden on screen; visible only during window.print().
    Uses ChartCanvas as the single source of truth for card rendering.
  -->
  <div class="print-only-render">
    <ChartCanvas
      :slots="chartStore.slots"
      :title="chartStore.title"
      :layout-preset="chartStore.layoutPreset"
      :theme="chartStore.activeTheme"
      :preview-mode="true"
      :zoom="1"
      :heading-font-family="chartStore.activeHeadingFont.cssFamily"
      :body-font-family="chartStore.activeBodyFont.cssFamily"
    />
  </div>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'

const chartStore = useChartStore()
</script>

<style scoped>
/* Hidden on screen — only appears during print */
.print-only-render {
  display: none;
}

@media print {
  .print-only-render {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
