<template>
  <div class="export-controls">
    <div v-if="isExporting" class="export-progress">
      <svg class="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="export-progress-text">Generating PDF...</span>
    </div>
    
    <div v-else class="export-success" :class="{ 'show': showSuccess }">
      <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="export-success-text">PDF exported successfully!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePdfExport } from '~/composables/usePdfExport'

interface Props {
  canvasRef: Ref<HTMLElement | undefined>
  filename: string
  quality: 'standard' | 'high'
  isExporting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'exporting': [isExporting: boolean]
  'success': []
  'error': [error: Error]
}>()

const { exportToPdf } = usePdfExport()
const showSuccess = ref(false)

watch(() => props.isExporting, async (isExporting) => {
  if (isExporting && props.canvasRef.value) {
    try {
      emit('exporting', true)
      await exportToPdf(props.canvasRef.value, props.filename, props.quality)
      emit('exporting', false)
      emit('success')
      
      // Show success message
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } catch (error) {
      emit('exporting', false)
      emit('error', error as Error)
    }
  }
})
</script>

<style scoped>
.export-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.export-progress,
.export-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.export-success {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
}

.export-success.show {
  opacity: 1;
  transform: translateY(0);
}

.export-progress-text,
.export-success-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.export-progress-text {
  color: #6b7280;
}

.export-success-text {
  color: #059669;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .export-progress,
  .export-success {
    transition: none;
  }
  
  .export-success.show {
    transform: none;
  }
}
</style>
