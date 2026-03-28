<template>
  <div class="loading-spinner" :class="sizeClass" role="status" :aria-label="loadingText || 'Loading...'">
    <svg class="spinner" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span v-if="loadingText" class="loading-text">{{ loadingText }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: '#3b82f6',
})

const sizeClass = computed(() => `size-${props.size}`)
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

.size-sm .spinner {
  width: 1.25rem;
  height: 1.25rem;
}

.size-md .spinner {
  width: 1.5rem;
  height: 1.5rem;
}

.size-lg .spinner {
  width: 2rem;
  height: 2rem;
}

.loading-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>
