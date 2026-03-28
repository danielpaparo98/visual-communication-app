<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          @click="closeOnBackdrop && close()"
        />
        
        <!-- Modal Content -->
        <div
          ref="modalRef"
          class="modal-content relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
            <h2 :id="titleId" class="text-xl sm:text-2xl font-bold text-neutral-900">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              class="modal-close-btn"
              @click="close()"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="overflow-y-auto max-h-[calc(90vh-10rem)] p-6 scrollbar-thin">
            <slot />
          </div>
          
          <!-- Footer (optional) -->
          <div v-if="$slots.footer" class="border-t border-neutral-200 px-6 py-4 bg-neutral-50">
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
@import "tailwindcss";
.modal-content {
  @apply bg-white rounded-xl shadow-xl;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.modal-close-btn {
  @apply rounded-lg p-2.5 text-neutral-400
         hover:bg-neutral-100 hover:text-neutral-600
         transition-all duration-200 cursor-pointer
         focus:outline-none focus:ring-2 focus:ring-neutral-400;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
