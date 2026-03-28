<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    title="Export Templates"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
    size="lg"
  >
    <div class="export-templates">
      <!-- Save Template Form -->
      <div class="save-template-form">
        <h4 class="section-title">Save Current Settings as Template</h4>
        <div class="form-row">
          <input
            v-model="templateName"
            type="text"
            class="template-name-input"
            placeholder="Enter template name..."
            :aria-label="'Template name'"
            @keydown.enter="handleSaveTemplate"
          />
          <AppButton
            @click="handleSaveTemplate"
            :disabled="!templateName.trim()"
            aria-label="Save template"
          >
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </template>
            Save
          </AppButton>
        </div>
      </div>

      <!-- Templates List -->
      <div class="templates-list-container">
        <h4 class="section-title">Saved Templates</h4>
        
        <!-- Empty State -->
        <EmptyState
          v-if="templates.length === 0"
          title="No templates saved"
          description="Save your export settings as templates for quick access"
          action-label="Create a template"
          @action="focusTemplateNameInput"
        />

        <!-- Templates Grid -->
        <div v-else class="templates-grid">
          <div
            v-for="template in templates"
            :key="template.id"
            class="template-card"
          >
            <div class="template-card-header">
              <h5 class="template-name">{{ template.name }}</h5>
              <button
                @click="handleDeleteTemplate(template.id)"
                class="delete-template-btn"
                aria-label="Delete template"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="template-card-body">
              <div class="template-preview">
                <div class="template-preview-content">
                  <div class="preview-item">
                    <span class="preview-label">Format:</span>
                    <span class="preview-value">{{ template.settings.format.toUpperCase() }}</span>
                  </div>
                  <div class="preview-item">
                    <span class="preview-label">Quality:</span>
                    <span class="preview-value capitalize">{{ template.settings.quality }}</span>
                  </div>
                  <div class="preview-item">
                    <span class="preview-label">Paper:</span>
                    <span class="preview-value">{{ PAPER_SIZES[template.settings.paperSize].name }}</span>
                  </div>
                  <div class="preview-item">
                    <span class="preview-label">Orientation:</span>
                    <span class="preview-value capitalize">{{ template.settings.orientation }}</span>
                  </div>
                  <div class="preview-item" v-if="template.watermark.enabled">
                    <span class="preview-label">Watermark:</span>
                    <span class="preview-value">{{ template.watermark.text }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="template-card-footer">
              <span class="template-date">{{ formatDate(template.createdAt) }}</span>
              <AppButton
                @click="handleLoadTemplate(template.id)"
                variant="primary"
                size="sm"
                aria-label="Load template"
              >
                Load
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppButton from '~/components/AppButton.vue'
import EmptyState from '~/components/EmptyState.vue'
import { useExportStore } from '~/stores/export'
import { PAPER_SIZES } from '~/types'
import type { ExportTemplate } from '~/types'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'load-template': [template: ExportTemplate]
}>()

const exportStore = useExportStore()
const templates = computed(() => exportStore.templates)

const isOpen = computed(() => props.modelValue)
const templateName = ref('')
const templateNameInput = ref<HTMLInputElement>()

// Methods
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function handleSaveTemplate() {
  if (!templateName.value.trim()) return

  exportStore.saveTemplate({
    name: templateName.value.trim(),
    settings: { ...exportStore.settings },
    watermark: { ...exportStore.watermark },
  })

  templateName.value = ''
}

function handleLoadTemplate(id: string) {
  const template = templates.value.find(t => t.id === id)
  if (template) {
    exportStore.loadTemplate(id)
    emit('load-template', template)
    emit('update:modelValue', false)
  }
}

function handleDeleteTemplate(id: string) {
  if (confirm('Are you sure you want to delete this template?')) {
    exportStore.deleteTemplate(id)
  }
}

function focusTemplateNameInput() {
  nextTick(() => {
    templateNameInput.value?.focus()
  })
}

function handleClose() {
  emit('update:modelValue', false)
  templateName.value = ''
}

// Focus input when opening
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    nextTick(() => {
      templateNameInput.value?.focus()
    })
  }
})
</script>

<style scoped>
.export-templates {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.save-template-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.template-name-input {
  flex: 1;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s ease;
}

.template-name-input:hover {
  border-color: #cbd5e1;
}

.template-name-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

.templates-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.template-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);
}

.template-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.template-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-template-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.delete-template-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.delete-template-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.template-card-body {
  flex: 1;
  margin-bottom: 0.75rem;
}

.template-preview {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
}

.template-preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
}

.preview-label {
  color: #6b7280;
  font-weight: 500;
}

.preview-value {
  color: #374151;
  font-weight: 600;
}

.capitalize {
  text-transform: capitalize;
}

.template-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.template-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .template-card,
  .delete-template-btn,
  .template-name-input {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }

  .template-card-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
