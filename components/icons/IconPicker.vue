<template>
  <AppModal v-model="isOpen" title="Choose an Icon" size="lg">
    <!-- Search and Filters -->
    <div class="mb-4 space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <AppInput
          v-model="searchQuery"
          type="search"
          placeholder="Search icons..."
          class="pl-10"
        />
      </div>
      
      <!-- Category Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.id"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category.id 
            ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-500' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="toggleCategory(category.id)"
        >
          <span>{{ category.icon }}</span>
          <span>{{ category.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Icons Grid -->
    <div v-if="filteredIcons.length > 0" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
      <button
        v-for="icon in filteredIcons"
        :key="icon.id"
        class="group relative aspect-square rounded-xl border-2 border-gray-200 bg-white p-2 hover:border-primary-400 hover:bg-primary-50 transition-all"
        :class="{ 'ring-2 ring-primary-500 border-primary-500': selectedIconId === icon.id }"
        @click="selectIcon(icon)"
      >
        <img
          :src="`/icons/${icon.filename}`"
          :alt="icon.alt"
          class="w-full h-full object-contain"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-primary-500/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else class="py-12 text-center text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>No icons found matching your search</p>
    </div>
    
    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="close">Cancel</AppButton>
        <AppButton variant="primary" :disabled="!selectedIconId" @click="confirm">
          Select Icon
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import type { Icon, IconCategory } from '~/types'

interface Props {
  modelValue: boolean
  cardId: string
  currentIconId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  currentIconId: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select': [{ cardId: string; iconId: string }]
}>()

const iconsStore = useIconsStore()

// Local state
const searchQuery = ref('')
const selectedCategory = ref<IconCategory | null>(null)
const selectedIconId = ref<string | null>(null)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const categories = computed(() => iconsStore.categories)

const filteredIcons = computed(() => {
  let icons = iconsStore.icons
  
  if (selectedCategory.value) {
    icons = icons.filter(i => i.category === selectedCategory.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    icons = icons.filter(i => 
      i.alt.toLowerCase().includes(query) ||
      i.keywords.some(k => k.includes(query))
    )
  }
  
  return icons
})

// Methods
function toggleCategory(categoryId: IconCategory) {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

function selectIcon(icon: Icon) {
  selectedIconId.value = icon.id
}

function confirm() {
  if (selectedIconId.value) {
    emit('select', { cardId: props.cardId, iconId: selectedIconId.value })
    close()
  }
}

function close() {
  isOpen.value = false
  // Reset state
  setTimeout(() => {
    searchQuery.value = ''
    selectedCategory.value = null
    selectedIconId.value = null
  }, 200)
}

// Watch for modal open to set initial selection
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    selectedIconId.value = props.currentIconId
  }
})
</script>
