<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    title="Export History"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
    size="lg"
  >
    <div class="export-history">
      <!-- Empty State -->
      <EmptyState
        v-if="history.length === 0"
        title="No export history"
        description="Your exported charts will appear here"
        action-label="Export a chart"
        @action="handleClose"
      />

      <!-- History List -->
      <div v-else class="history-list">
        <div
          v-for="item in history"
          :key="item.id"
          class="history-item"
        >
          <div class="history-item-content">
            <div class="history-item-icon">
              <svg v-if="item.format === 'pdf'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="item.format === 'png'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="item.format === 'jpg'" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div class="history-item-details">
              <h4 class="history-item-title">{{ item.filename }}</h4>
              <div class="history-item-meta">
                <span class="meta-item">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ item.format.toUpperCase() }}
                </span>
                <span class="meta-item">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {{ capitalizeFirst(item.quality) }}
                </span>
                <span class="meta-item">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ PAPER_SIZES[item.paperSize].name }}
                </span>
              </div>
              <p class="history-item-chart">{{ item.chartTitle }}</p>
              <p class="history-item-date">{{ formatDate(item.timestamp) }}</p>
            </div>
          </div>
          <div class="history-item-actions">
            <button
              @click="handleReExport(item)"
              class="action-btn"
              aria-label="Re-export chart"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              @click="handleDelete(item.id)"
              class="action-btn delete"
              aria-label="Delete history item"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Clear All Button -->
      <div v-if="history.length > 0" class="history-footer">
        <AppButton
          variant="secondary"
          @click="handleClearAll"
          class="clear-all-btn"
          aria-label="Clear all export history"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </template>
          Clear All History
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppButton from '~/components/AppButton.vue'
import EmptyState from '~/components/EmptyState.vue'
import { useExportStore } from '~/stores/export'
import { PAPER_SIZES } from '~/types'
import type { ExportHistoryItem } from '~/types'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  're-export': [item: ExportHistoryItem]
}>()

const exportStore = useExportStore()
const history = computed(() => exportStore.history)

const isOpen = computed(() => props.modelValue)

// Methods
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function handleReExport(item: ExportHistoryItem) {
  emit('re-export', item)
}

function handleDelete(id: string) {
  exportStore.history = exportStore.history.filter(item => item.id !== id)
}

function handleClearAll() {
  if (confirm('Are you sure you want to clear all export history?')) {
    exportStore.clearHistory()
  }
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.export-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.history-item-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.history-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  flex-shrink: 0;
}

.history-item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.history-item-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-item-chart {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-date {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.history-item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
  color: #374151;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.action-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.history-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.clear-all-btn {
  color: #dc2626;
}

.clear-all-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .history-item,
  .action-btn {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .history-item {
    flex-direction: column;
    align-items: stretch;
  }

  .history-item-content {
    width: 100%;
  }

  .history-item-actions {
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
