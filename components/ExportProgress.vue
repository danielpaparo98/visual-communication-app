<template>
  <div class="export-progress">
    <!-- Progress Bar -->
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{ width: `${progress}%` }"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
      />
    </div>

    <!-- Progress Percentage -->
    <div class="progress-percentage">
      {{ Math.round(progress) }}%
    </div>

    <!-- Stage Indicators -->
    <div class="stage-indicators">
      <div
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="stage"
        :class="{
          'active': currentStageIndex === index,
          'completed': currentStageIndex > index,
          'pending': currentStageIndex < index
        }"
      >
        <div class="stage-icon">
          <svg v-if="currentStageIndex > index" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="currentStageIndex === index" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
          </svg>
        </div>
        <span class="stage-label">{{ stage.label }}</span>
      </div>
    </div>

    <!-- Current Message -->
    <div v-if="message" class="progress-message">
      {{ message }}
    </div>

    <!-- Estimated Time -->
    <div v-if="estimatedTime && !error" class="estimated-time">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Estimated time: {{ estimatedTime }}</span>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Cancel Button -->
    <button
      v-if="!error && !completed"
      @click="handleCancel"
      class="cancel-btn"
      aria-label="Cancel export"
    >
      Cancel
    </button>

    <!-- Retry Button -->
    <button
      v-if="error"
      @click="handleRetry"
      class="retry-btn"
      aria-label="Retry export"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Retry
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Stage {
  id: string
  label: string
}

interface Props {
  progress: number
  message?: string
  error?: string | null
  completed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  error: null,
  completed: false,
})

const emit = defineEmits<{
  cancel: []
  retry: []
}>()

const stages: Stage[] = [
  { id: 'preparing', label: 'Preparing' },
  { id: 'rendering', label: 'Rendering' },
  { id: 'exporting', label: 'Exporting' },
  { id: 'completing', label: 'Completing' },
]

const currentStageIndex = computed(() => {
  if (props.error) return -1
  if (props.completed) return stages.length - 1
  
  const progress = props.progress
  if (progress < 25) return 0
  if (progress < 50) return 1
  if (progress < 75) return 2
  return 3
})

const estimatedTime = computed(() => {
  if (props.completed || props.error) return null
  
  const progress = props.progress
  if (progress < 10) return 'Calculating...'
  
  // Simple estimation based on remaining progress
  const remaining = 100 - progress
  const secondsPerPercent = 0.1 // Adjust based on actual performance
  const estimatedSeconds = Math.ceil(remaining * secondsPerPercent)
  
  if (estimatedSeconds < 60) {
    return `${estimatedSeconds} second${estimatedSeconds > 1 ? 's' : ''}`
  }
  
  const minutes = Math.floor(estimatedSeconds / 60)
  const seconds = estimatedSeconds % 60
  return `${minutes}m ${seconds}s`
})

function handleCancel() {
  emit('cancel')
}

function handleRetry() {
  emit('retry')
}
</script>

<style scoped>
.export-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.stage-indicators {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
}

.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.stage.active {
  opacity: 1;
}

.stage.completed {
  opacity: 1;
}

.stage-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  transition: all 0.3s ease;
}

.stage.active .stage-icon {
  background: #3b82f6;
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.stage.completed .stage-icon {
  background: #10b981;
  color: white;
}

.stage-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stage.active .stage-label {
  color: #3b82f6;
  font-weight: 600;
}

.progress-message {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.estimated-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
}

.cancel-btn,
.retry-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.retry-btn {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.retry-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.cancel-btn:focus-visible,
.retry-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .progress-bar,
  .stage,
  .stage-icon,
  .cancel-btn,
  .retry-btn {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .export-progress {
    padding: 1.5rem;
  }

  .stage-indicators {
    gap: 0.75rem;
  }

  .stage-icon {
    width: 32px;
    height: 32px;
  }

  .stage-label {
    font-size: 0.625rem;
  }
}
</style>
