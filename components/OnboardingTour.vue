<template>
  <Teleport to="body">
    <Transition name="tour-overlay">
      <div
        v-if="isOpen"
        class="tour-overlay"
        @click="handleBackdropClick"
        role="dialog"
        :aria-label="`Onboarding tour - Step ${currentStep + 1} of ${steps.length}`"
      >
        <!-- Tour Highlight -->
        <div
          v-if="currentStep >= 0 && currentStep < steps.length"
          class="tour-highlight"
          :style="highlightStyle"
        />

        <!-- Tour Tooltip -->
        <Transition name="tour-tooltip">
          <div
            v-if="isOpen && currentStep >= 0 && currentStep < steps.length"
            class="tour-tooltip"
            :style="tooltipStyle"
            role="alert"
            aria-live="polite"
          >
            <div class="tour-content">
              <div class="tour-header">
                <h3 class="tour-title">{{ currentStepData?.title }}</h3>
                <button
                  class="tour-close"
                  @click="handleSkip"
                  aria-label="Skip tour"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="tour-progress">
                <span class="tour-step-indicator">
                  Step {{ currentStep + 1 }} of {{ steps.length }}
                </span>
                <div class="tour-progress-bar">
                  <div
                    class="tour-progress-fill"
                    :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
                  />
                </div>
              </div>
              <p class="tour-message">{{ currentStepData?.content }}</p>
              <div v-if="currentStepData?.action" class="tour-action">
                <button
                  class="tour-action-button primary"
                  @click="handleAction"
                  :aria-label="currentStepData.action.label"
                >
                  {{ currentStepData.action.label }}
                </button>
              </div>
              <div class="tour-navigation">
                <button
                  class="nav-button"
                  @click="handlePrev"
                  :disabled="currentStep === 0"
                  aria-label="Previous step"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 5 5v5a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2z" />
                  </svg>
                  Previous
                </button>
                <button
                  class="nav-button"
                  @click="handleNext"
                  :disabled="currentStep === steps.length - 1"
                  aria-label="Next step"
                >
                  {{ currentStep === steps.length - 1 ? 'Finish' : 'Next' }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-5 5v5a2 2 0 012 2h10a2 2 0 012 2v5a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { TourStep } from '~/types'

interface Props {
  modelValue: boolean
  steps: TourStep[]
  currentStep: number
  showSkip?: boolean
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSkip: true,
  showProgress: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'next-step': []
  'prev-step': []
  'skip': []
  'complete': []
}>()

const currentStepData = computed(() => props.steps[props.currentStep])

const highlightStyle = computed(() => {
  if (!currentStepData.value) return {}

  const target = document.querySelector(currentStepData.value.target)
  if (!target) return {}

  const rect = target.getBoundingClientRect()
  
  return {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    pointerEvents: 'none',
  } as const
})

const tooltipStyle = computed(() => {
  if (!currentStepData.value) return {}

  const target = document.querySelector(currentStepData.value.target)
  if (!target) return {}

  const rect = target.getBoundingClientRect()
  
  let top = rect.bottom + 10
  let left = rect.left + (rect.width / 2)
  
  // Adjust based on position
  switch (currentStepData.value.position) {
    case 'top':
      top = rect.top - 10
      break
    case 'bottom':
      top = rect.bottom + 10
      break
    case 'left':
      left = rect.left - 10
      top = rect.top + (rect.height / 2)
      break
    case 'right':
      left = rect.right + 10
      top = rect.top + (rect.height / 2)
      break
  }
  
  // Ensure tooltip stays within viewport
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  if (left + 300 > viewportWidth) {
    left = viewportWidth - 320
  }
  if (top + 200 > viewportHeight) {
    top = viewportHeight - 220
  }
  
  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    maxWidth: '320px',
  } as const
})

function handleBackdropClick(event: MouseEvent): void {
  // Don't close if clicking on the tooltip
  if ((event.target as HTMLElement).closest('.tour-tooltip')) {
    return
  }
  emit('update:modelValue', false)
}

function handleNext(): void {
  if (props.currentStep < props.steps.length - 1) {
    emit('next-step')
  } else {
    emit('complete')
    emit('update:modelValue', false)
  }
}

function handlePrev(): void {
  if (props.currentStep > 0) {
    emit('prev-step')
  }
}

function handleSkip(): void {
  emit('skip')
  emit('update:modelValue', false)
}

function handleAction(): void {
  if (currentStepData.value?.action) {
    currentStepData.value.action.handler()
    handleNext()
  }
}

// Handle keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSkip()
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      handlePrev()
    }
  }

  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tour-highlight {
  background: rgba(59, 130, 246, 0.3);
  border: 2px solid #3b82f6;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.tour-tooltip {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 320px;
  z-index: 10000;
}

.tour-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tour-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.tour-close {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tour-close:hover {
  background: rgba(107, 114, 128, 0.1);
}

.tour-close:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.tour-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tour-step-indicator {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.tour-progress-bar {
  width: 100px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.tour-progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.tour-message {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

.tour-action {
  margin-top: 0.5rem;
}

.tour-action-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tour-action-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.tour-action-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.tour-action-button.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.tour-action-button.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.tour-action-button.primary:focus {
  outline-color: #1d4ed8;
}

.tour-navigation {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transition animations */
.tour-overlay-enter-active,
.tour-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.tour-overlay-enter-from,
.tour-overlay-leave-to {
  opacity: 0;
}

.tour-overlay-enter-to,
.tour-overlay-leave-from {
  opacity: 1;
}

.tour-tooltip-enter-active {
  transition: all 0.3s ease;
}

.tour-tooltip-leave-active {
  transition: all 0.2s ease;
}

.tour-tooltip-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tour-tooltip-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.tour-tooltip-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.tour-tooltip-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .tour-tooltip-enter-active,
  .tour-tooltip-leave-active {
    transition: none;
  }

  .tour-tooltip-enter-from,
  .tour-tooltip-leave-to,
  .tour-tooltip-enter-to,
  .tour-tooltip-leave-from {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .tour-tooltip {
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 4rem);
  }

  .tour-content {
    padding: 1rem;
  }

  .tour-title {
    font-size: 1rem;
  }

  .tour-message {
    font-size: 0.8125rem;
  }
}
</style>
