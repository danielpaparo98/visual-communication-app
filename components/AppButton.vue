<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    class="btn-base"
    @click="$emit('click', $event)"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }

  return [base[props.variant], sizes[props.size]]
})
</script>

<style scoped>
.btn-base {
  @apply inline-flex items-center justify-center gap-2 rounded-xl
         font-medium transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed
         transform active:scale-95 cursor-pointer;
}

.btn-sm {
  @apply px-4 py-2 text-sm;
}

.btn-md {
  @apply px-5 py-2.5 text-sm;
}

.btn-lg {
  @apply px-6 py-3 text-base;
}

.btn-primary {
  @apply bg-gradient-to-r from-primary-600 to-primary-500 text-white
         hover:from-primary-700 hover:to-primary-600
         focus:ring-primary-400 shadow-md hover:shadow-lg;
}

.btn-secondary {
  @apply bg-gradient-to-r from-accent-500 to-accent-400 text-white
         hover:from-accent-600 hover:to-accent-500
         focus:ring-accent-300 shadow-md hover:shadow-lg;
}

.btn-outline {
  @apply border-2 border-primary-500 text-primary-600
         hover:bg-primary-50 hover:border-primary-600
         focus:ring-primary-400;
}

.btn-ghost {
  @apply text-gray-600 hover:bg-gray-100 hover:text-gray-900
         focus:ring-gray-300;
}

.btn-danger {
  @apply bg-gradient-to-r from-red-600 to-red-500 text-white
         hover:from-red-700 hover:to-red-600
         focus:ring-red-400 shadow-md hover:shadow-lg;
}
</style>
