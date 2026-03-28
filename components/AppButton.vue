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
  @apply inline-flex items-center justify-center gap-2 rounded-lg
         font-semibold transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed
         active:scale-[0.98] cursor-pointer;
}

.btn-sm {
  @apply px-5 py-2.5 text-sm;
}

.btn-md {
  @apply px-6 py-3 text-sm;
}

.btn-lg {
  @apply px-8 py-4 text-base;
}

.btn-primary {
  @apply bg-neutral-900 text-white
         hover:bg-neutral-800
         focus:ring-neutral-400;
}

.btn-secondary {
  @apply bg-neutral-100 text-neutral-900
         hover:bg-neutral-200
         focus:ring-neutral-400;
}

.btn-outline {
  @apply border-2 border-neutral-300 text-neutral-900
         hover:bg-neutral-50 hover:border-neutral-400
         focus:ring-neutral-400;
}

.btn-ghost {
  @apply text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900
         focus:ring-neutral-400;
}

.btn-danger {
  @apply bg-neutral-900 text-white
         hover:bg-neutral-800
         focus:ring-neutral-400;
}
</style>
