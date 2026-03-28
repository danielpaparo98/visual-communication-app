<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="handleClose"
    title="Upload Custom Image"
    :close-on-backdrop-click="true"
    :close-on-escape="true"
  >
    <div class="image-uploader">
      <!-- Drag and Drop Zone -->
      <div
        class="drop-zone"
        :class="{ 'dragging': isDragging, 'has-error': error }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="handleFileInputClick"
        role="button"
        :aria-label="'Upload image or drag and drop'"
        tabindex="0"
      >
        <input
          ref="fileInput"
          type="file"
          class="file-input"
          :accept="allowedTypes.join(',')"
          @change="handleFileSelect"
          :aria-label="'Select image file'"
        />
        <div v-if="!previewUrl" class="drop-zone-content">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-4-4v4a4 4 0 014-4h4a4 4 0 014-4v4a4 4 0 01-4-4z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12m0 0l-3-3m3 3l3-3" />
          </svg>
          <p class="drop-zone-text">
            {{ isDragging ? 'Drop image here' : 'Click or drag image here' }}
          </p>
          <p class="drop-zone-hint">
            Max size: {{ formatFileSize(maxSize) }}
          </p>
        </div>
        <div v-else class="preview-container">
          <img
            :src="previewUrl"
            :alt="'Preview of uploaded image'"
            class="preview-image"
          />
          <button
            class="remove-button"
            @click.stop="handleRemove"
            :aria-label="'Remove image'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message" role="alert">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="2" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 15-3-3" />
        </svg>
        <p>{{ error }}</p>
        <button class="error-dismiss" @click="error = null" :aria-label="'Dismiss error'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Upload Button -->
      <div v-if="previewUrl" class="upload-actions">
        <AppButton
          variant="primary"
          @click="handleUpload"
          :disabled="isCompressing"
          :aria-label="isCompressing ? 'Compressing...' : 'Upload image'"
        >
          <template #icon-left>
            <svg v-if="!isCompressing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 012-2h12a2 2 0 012-2v-1a2 2 0 01-2-2h-1a2 2 0 01-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14" />
            </svg>
            <LoadingSpinner v-else size="sm" />
          </template>
          {{ isCompressing ? 'Compressing...' : 'Upload' }}
        </AppButton>
        <AppButton variant="secondary" @click="handleClose" :aria-label="'Cancel upload'">
          Cancel
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from '~/components/AppModal.vue'
import AppButton from '~/components/AppButton.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import { useImageCompression } from '~/composables/useImageCompression'

interface Props {
  modelValue: boolean
  cardId: string
  maxSize: number
  allowedTypes: string[]
  compress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compress: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'upload': [dataUrl: string, thumbnailUrl: string, width: number, height: number]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const previewUrl = ref<string | null>(null)
const error = ref<string | null>(null)

const { compressImage, validateFile, formatFileSize } = useImageCompression()
const isCompressing = ref(false)

function handleDragOver(event: DragEvent) {
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

function handleFileInputClick() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

async function handleFile(file: File) {
  // Validate file
  const validation = validateFile(file, props.maxSize, props.allowedTypes)
  if (!validation.valid) {
    error.value = validation.error || 'Invalid file'
    return
  }

  error.value = null

  try {
    if (props.compress) {
      isCompressing.value = true
      const compressed = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
        format: 'image/webp',
      })
      isCompressing.value = false

      previewUrl.value = compressed.dataUrl
    } else {
      // Just read the file without compression
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  } catch (err) {
    isCompressing.value = false
    error.value = err instanceof Error ? err.message : 'Failed to process image'
  }
}

function handleUpload() {
  if (previewUrl.value) {
    emit('upload', previewUrl.value, previewUrl.value, 800, 800)
    handleClose()
  }
}

function handleRemove() {
  previewUrl.value = null
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleClose() {
  emit('update:modelValue', false)
  // Reset state after close
  setTimeout(() => {
    previewUrl.value = null
    error.value = null
    isDragging.value = false
  }, 300)
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.drop-zone.dragging {
  border-color: #3b82f6;
  background: #eff6ff;
}

.drop-zone.has-error {
  border-color: #ef4444;
  background: #fef2f2;
}

.file-input {
  display: none;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.drop-zone-text {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.drop-zone-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

.preview-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: rgba(220, 38, 38, 1);
}

.remove-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #b91c1c;
}

.error-message p {
  flex: 1;
  font-size: 0.875rem;
  margin: 0;
}

.error-dismiss {
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

.error-dismiss:hover {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

.error-dismiss:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.upload-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .drop-zone,
  .remove-button,
  .error-dismiss {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .drop-zone {
    padding: 1.5rem;
    min-height: 150px;
  }

  .upload-actions {
    flex-direction: column;
  }
}
</style>
