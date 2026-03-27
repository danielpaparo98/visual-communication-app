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
  @apply w-full rounded-xl border-2 border-gray-200 bg-white
         px-4 py-3 text-gray-900 placeholder-gray-400
         transition-all duration-200
         focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100
         hover:border-gray-300
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.app-input-error {
  @apply border-red-400 focus:border-red-500 focus:ring-red-100;
}

/* Search input styling */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}
</style>
