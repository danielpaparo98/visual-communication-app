<template>
  <div class="empty-state">
    <div v-if="illustration" class="empty-state-illustration">
      <slot name="illustration">
        <!-- Default illustration -->
        <svg class="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 17V7m0 10a2 2 0 012 2h10a2 2 0 012-2v10a2 2 0 01-2 2H9a2 2 0 01-2-2z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8v4m0 0l-3-3m3 3l3-3"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M14 11h4m-4 0h-4"
          />
        </svg>
      </slot>
    </div>
    <h2 class="empty-state-title">{{ title }}</h2>
    <p class="empty-state-description">{{ description }}</p>
    <div class="empty-state-actions">
      <button
        class="empty-state-action primary"
        @click="handleAction"
        :aria-label="actionLabel"
      >
        {{ actionLabel }}
      </button>
      <button
        v-if="showTutorial"
        class="empty-state-action secondary"
        @click="handleTutorial"
        aria-label="Start tutorial"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C7.11 3 5.669 3 4 3c-1.669 0-3.11 1.253-3.253V6.253c0-1.669 1.253-3 3-3h4c1.669 0 3 1.253 3 3v13c0 1.669-1.253 3-3 3z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 9l3 3m-3-3l-3 3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 002-2v10a2 2 0 01-2 2H9z"
          />
        </svg>
        Watch Tutorial
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  actionLabel: string
  showTutorial?: boolean
  illustration?: string
}

const props = withDefaults(defineProps<Props>(), {
  showTutorial: false,
})

const emit = defineEmits<{
  action: []
  'start-tutorial': []
}>()

function handleAction() {
  emit('action')
}

function handleTutorial() {
  emit('start-tutorial')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1.5rem;
}

.empty-state-illustration {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.empty-state-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 1.5rem;
  line-height: 1.6;
  max-width: 500px;
}

.empty-state-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.empty-state-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-state-action:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.empty-state-action:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.empty-state-action.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.empty-state-action.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.empty-state-action.primary:focus {
  outline-color: #1d4ed8;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .empty-state-action {
    transition: none;
  }

  .empty-state-action:hover {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-state-title {
    font-size: 1.25rem;
  }

  .empty-state-description {
    font-size: 0.875rem;
  }

  .empty-state-actions {
    flex-direction: column;
    width: 100%;
  }

  .empty-state-action {
    width: 100%;
    justify-content: center;
  }
}
</style>
