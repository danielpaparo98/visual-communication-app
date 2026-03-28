<template>
  <Icon :icon="name" :width="size" :height="size" :alt="alt" />
</template>

<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    alt?: string
  }>(),
  {
    size: 24,
    alt: '',
  }
)

// Use the Iconify icon component
const Icon = IconifyIcon
</script>
