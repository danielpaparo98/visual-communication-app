<template>
  <div class="notifications-container">
    <TransitionGroup name="notification" tag="div" class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-${notification.type}`"
        role="alert"
        :aria-label="notification.title"
      >
        <div class="notification-content">
          <div class="notification-header">
            <svg
              v-if="notification.type === 'success'"
              class="notification-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 18l6-6 6-6"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="notification-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke-width="2" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 15-3-3"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="notification-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else
              class="notification-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke-width="2" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 16v-4"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8h.01"
              />
            </svg>
            <h3 class="notification-title">{{ notification.title }}</h3>
            <button
              v-if="notification.duration !== 0"
              class="notification-close"
              @click="dismiss(notification.id)"
              :aria-label="'Dismiss notification'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="notification-message">{{ notification.message }}</p>
          <div v-if="notification.actions && notification.actions.length > 0" class="notification-actions">
            <button
              v-for="(action, index) in notification.actions"
              :key="`${notification.id}-action-${index}`"
              class="notification-action"
              @click="action.handler"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/types'

interface Props {
  notifications: Notification[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  dismiss: [id: string]
}>()

function dismiss(id: string) {
  emit('dismiss', id)
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: auto;
}

.notification {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
}

.notification-success {
  background: #ecfdf5;
  border: 1px solid #10b981;
}

.notification-error {
  background: #fef2f2;
  border: 1px solid #ef4444;
}

.notification-warning {
  background: #fffbeb;
  border: 1px solid #f59e0b;
}

.notification-info {
  background: #eff6ff;
  border: 1px solid #3b82f6;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.notification-icon.notification-success {
  color: #10b981;
}

.notification-icon.notification-error {
  color: #ef4444;
}

.notification-icon.notification-warning {
  color: #f59e0b;
}

.notification-icon.notification-info {
  color: #3b82f6;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.notification-close {
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

.notification-close:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.notification-message {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.notification-action {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-action:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.notification-action:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transition animations */
.notification-enter-active {
  animation: slideIn 0.3s ease-out;
}

.notification-leave-active {
  animation: slideOut 0.3s ease-in;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active {
    animation: none;
  }

  .notification-enter-from,
  .notification-leave-to {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .notification {
    min-width: 280px;
    max-width: calc(100vw - 2rem);
  }
}
</style>
