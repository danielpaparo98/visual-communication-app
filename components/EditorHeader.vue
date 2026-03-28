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
          :aria-label="'Chart title: ' + title"
        />
        <div class="title-icon" v-if="isDirty">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <p class="header-hint">Click on any card to customize</p>
    </div>
 
    <div class="header-center">
      <!-- Undo/Redo Buttons -->
      <div class="undo-redo-group">
        <button
          class="icon-button"
          @click="handleUndo"
          :disabled="!canUndo"
          :aria-label="'Undo last action' + (canUndo ? '' : ' (disabled)')"
          title="Undo (Ctrl+Z)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v10a8 8 0 01-8 8H11a8 8 0 01-8-8V10a8 8 0 018-8z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l6-6m-6 6l6-6" />
          </svg>
        </button>
        <button
          class="icon-button"
          @click="handleRedo"
          :disabled="!canRedo"
          :aria-label="'Redo last action' + (canRedo ? '' : ' (disabled)')"
          title="Redo (Ctrl+Y)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 01-8-8V10a8 8 0 018 8h10a8 8 0 018-8V10a8 8 0 01-8-8z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10l-6-6m6 6l-6-6" />
          </svg>
        </button>
      </div>
    </div>
 
    <div class="header-right">
      <!-- Save Indicator -->
      <div v-if="showSaveButton" class="save-indicator" :class="{ 'saving': isSaving }">
        <button
          class="save-button"
          @click="handleSave"
          :disabled="isSaving"
          :aria-label="isSaving ? 'Saving...' : 'Save chart'"
        >
          <svg v-if="!isSaving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l-1-1m-1 1v11a2 2 0 012 2h5a2 2 0 002-2V5a2 2 0 00-2-2h11l-1-1" />
          </svg>
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="lastSavedText" class="save-text">{{ lastSavedText }}</span>
        </button>
      </div>
 
      <!-- Preview Toggle -->
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
 
      <!-- Export Button -->
      <AppButton
        variant="primary"
        size="sm"
        @click="handleExport"
        :disabled="isExporting"
        :aria-label="isExporting ? 'Exporting...' : 'Export chart as PDF'"
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
  canUndo: boolean
  canRedo: boolean
  showSaveButton?: boolean
  isSaving?: boolean
  lastSavedText?: string
}
 
const props = withDefaults(defineProps<Props>(), {
  showSaveButton: false,
  isSaving: false,
  lastSavedText: '',
})
 
const emit = defineEmits<{
  'update:title': [title: string]
  'toggle-preview': []
  'export': []
  'undo': []
  'redo': []
  'save': []
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

function handleUndo() {
  emit('undo')
}

function handleRedo() {
  emit('redo')
}

function handleSave() {
  emit('save')
}
</script>
 
<style scoped>
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  gap: 1.5rem;
}
 
.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
  min-width: 0;
}
 
.title-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
 
.title-input {
  font-size: 1.625rem;
  font-weight: 700;
  color: #0f172a;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.375rem 0;
  width: 100%;
  transition: border-color 0.2s ease;
  line-height: 1.3;
}
 
.title-input:hover {
  border-color: #cbd5e1;
}
 
.title-input:focus {
  outline: none;
  border-color: #0f172a;
}
 
.title-input::placeholder {
  color: #94a3b8;
}
 
.title-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
 
.header-hint {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.undo-redo-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}

.icon-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
 
.header-right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-shrink: 0;
}

.save-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.save-text {
  font-size: 0.75rem;
  color: #64748b;
}

.save-indicator.saving .save-text {
  color: #3b82f6;
}
 
.preview-toggle {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.125rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}
 
.preview-toggle:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
 
.preview-toggle.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
}
 
.preview-toggle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
 
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .title-input,
  .preview-toggle,
  .icon-button,
  .save-button {
    transition: none;
  }
}
 
/* Responsive */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1.25rem 1.5rem;
    gap: 1rem;
  }
  
  .header-left {
    text-align: center;
  }
  
  .header-center {
    order: 3;
    justify-content: center;
  }
  
  .header-right {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .title-input {
    font-size: 1.375rem;
  }
  
  .save-text {
    display: none;
  }
}
</style>
