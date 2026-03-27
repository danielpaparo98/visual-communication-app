<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeOnBackdrop && close()"
        />
        
        <!-- Modal Content -->
        <div
          ref="modalRef"
          class="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 :id="titleId" class="text-xl font-heading font-semibold text-gray-900">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              @click="close()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="overflow-y-auto max-h-[calc(90vh-8rem)] p-6">
            <slot />
          </div>
          
          <!-- Footer (optional) -->
          <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const titleId = useId()
const modalRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

// Close on Escape key
onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
