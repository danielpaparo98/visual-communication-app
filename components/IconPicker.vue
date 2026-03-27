<template>
  <AppModal v-model="isOpen" title="Choose an Icon" size="lg">
    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <AppInput
          v-model="searchQuery"
          type="search"
          placeholder="Search icons..."
          class="pl-12"
        />
      </div>
      
      <!-- Category Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-pill"
          :class="selectedCategory === category.id ? 'category-pill-active' : ''"
          @click="toggleCategory(category.id)"
        >
          <span>{{ category.icon }}</span>
          <span>{{ category.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Icons Grid -->
    <div v-if="filteredIcons.length > 0" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
      <button
        v-for="icon in filteredIcons"
        :key="icon.id"
        class="icon-item group"
        :class="{ 'icon-item-selected': selectedIconId === icon.id }"
        @click="selectIcon(icon)"
      >
        <img
          :src="`/icons/${icon.filename}`"
          :alt="icon.alt"
          class="w-full h-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-110"
        />
        <div class="icon-check-overlay">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else class="py-16 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">No icons found</p>
      <p class="text-gray-400 text-sm mt-1">Try a different search term</p>
    </div>
    
    <!-- Footer -->
    <template #footer>
      <div class="flex justify-between items-center">
        <span v-if="filteredIcons.length > 0" class="text-sm text-gray-500">
          {{ filteredIcons.length }} icon{{ filteredIcons.length !== 1 ? 's' : '' }} found
        </span>
        <span v-else></span>
        <div class="flex gap-3">
          <AppButton variant="ghost" @click="close">Cancel</AppButton>
          <AppButton variant="primary" :disabled="!selectedIconId" @click="confirm">
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </template>
            Select Icon
          </AppButton>
        </div>
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

<style scoped>
.category-pill {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
         bg-gray-100 text-gray-600 hover:bg-gray-200
         transition-all duration-200 cursor-pointer;
}

.category-pill-active {
  @apply bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700
         ring-2 ring-primary-300 shadow-sm;
}

.icon-item {
  @apply relative aspect-square rounded-xl border-2 border-gray-100 bg-white
         hover:border-primary-400 hover:bg-primary-50 hover:shadow-md
         transition-all duration-200 cursor-pointer overflow-hidden;
}

.icon-item-selected {
  @apply border-primary-500 ring-2 ring-primary-400 ring-offset-1 bg-primary-50;
}

.icon-check-overlay {
  @apply absolute inset-0 flex items-center justify-center
         bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl
         opacity-0 group-hover:opacity-100 transition-opacity duration-200;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400;
}
</style>
