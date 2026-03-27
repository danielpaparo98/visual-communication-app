<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxlength"
    :class="inputClasses"
    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
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
  'border-red-500 focus:border-red-500 focus:ring-red-500/20': props.error,
}))
</script>
