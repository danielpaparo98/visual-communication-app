<template>
  <header class="editor-header">
    <div class="header-left">
      <div class="title-input-wrapper">
        <input
          :value="title"
          type="text"
          class="title-input"
          placeholder="Chart Title"
          @change="handleTitleChange"
        />
        <div class="title-icon" v-if="isDirty">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <p class="header-hint">Click on any card to customize</p>
    </div>

    <div class="header-right">
      <button
        class="preview-toggle"
        :class="{ 'active': isPreviewMode }"
        @click="handleTogglePreview"
        :aria-label="isPreviewMode ? 'Switch to edit mode' : 'Switch to preview mode'"
      >
        <svg v-if="!isPreviewMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>{{ isPreviewMode ? 'Edit' : 'Preview' }}</span>
      </button>

      <AppButton
        variant="primary"
        size="sm"
        @click="handleExport"
        :disabled="isExporting"
      >
        <template #icon-left>
          <svg v-if="!isExporting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </template>
        {{ isExporting ? 'Exporting...' : 'Export PDF' }}
      </AppButton>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  isPreviewMode: boolean
  isDirty: boolean
  isExporting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:title': [title: string]
  'toggle-preview': []
  'export': []
}>()

function handleTitleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:title', target.value)
}

function handleTogglePreview() {
  emit('toggle-preview')
}

function handleExport() {
  emit('export')
}
</script>

<style scoped>
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.title-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.title-input {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.25rem 0;
  width: 100%;
  transition: border-color 0.2s ease;
}

.title-input:hover {
  border-color: #d1d5db;
}

.title-input:focus {
  outline: none;
  border-color: #111827;
}

.title-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.header-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
}

.preview-toggle:hover {
  background: #f9fafb;
}

.preview-toggle.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .title-input,
  .preview-toggle {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }
  
  .header-left {
    text-align: center;
  }
  
  .header-right {
    justify-content: center;
  }
}
</style>
