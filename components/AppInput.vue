<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxlength"
    :class="inputClasses"
    class="app-input"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  disabled?: boolean
  maxlength?: number
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClasses = computed(() => ({
  'app-input-error': props.error,
}))
</script>

<style scoped>
.app-input {
  @apply w-full rounded-lg border border-neutral-200 bg-white
         px-4 py-3 text-neutral-900 placeholder-neutral-400
         transition-all duration-200
         focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200
         hover:border-neutral-300
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.app-input-error {
  @apply border-neutral-900 focus:border-neutral-900 focus:ring-neutral-200;
}

/* Search input styling */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
</style>
