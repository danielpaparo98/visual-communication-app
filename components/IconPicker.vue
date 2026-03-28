<template>
  <AppModal v-model="isOpen" title="Choose an Icon" size="lg" @close="handleClose">
    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <AppInput
          id="icon-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search icons..."
          class="pl-12"
          @input="handleSearchInput"
          :aria-label="'Search icons'"
        />
      </div>
      
      <!-- Category Filters -->
      <div class="flex flex-wrap gap-2" role="tablist" :aria-label="'Icon categories'">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-pill"
          :class="selectedCategory === category.id ? 'category-pill-active' : ''"
          @click="toggleCategory(category.id)"
          role="tab"
          :aria-selected="selectedCategory === category.id"
          :aria-controls="`category-${category.id}`"
          :aria-label="`Filter by ${category.label} icons`"
        >
          <span>{{ category.icon }}</span>
          <span>{{ category.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Icons Grid with Virtual Scrolling -->
    <div
      v-if="filteredIcons.length > 0"
      ref="scrollContainer"
      class="icons-scroll-container"
      @scroll="handleScroll"
      role="region"
      :aria-label="'Icon selection grid'"
    >
      <div
        class="icons-grid"
        :style="{
          height: `${totalHeight}px`,
          position: 'relative',
        }"
      >
        <div
          class="icons-viewport"
          :style="{
            transform: `translateY(${offsetY}px)`,
          }"
        >
          <button
            v-for="icon in visibleIcons"
            :key="icon.id"
            class="icon-item group"
            :class="{ 'icon-item-selected': selectedIconId === icon.id }"
            @click="selectIcon(icon)"
            :aria-label="`${icon.alt} icon`"
            :aria-pressed="selectedIconId === icon.id"
            role="option"
            tabindex="-1"
          >
            <img
              :src="`/icons/${icon.filename}`"
              :alt="icon.alt"
              class="icon-image"
              loading="lazy"
              :data-icon-id="icon.id"
            />
            <div class="icon-check-overlay">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-indicator" role="status" :aria-label="'Loading icons'">
        <LoadingSpinner size="sm" />
        <span>Loading icons...</span>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state" role="status" :aria-live="'polite'">
      <div class="empty-icon">
        <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="empty-title">No icons found</p>
      <p class="empty-description">Try a different search term or category</p>
    </div>
    
    <!-- Footer -->
    <template #footer>
      <div class="footer-content">
        <div class="footer-info">
          <span v-if="filteredIcons.length > 0" class="text-sm text-neutral-500">
            {{ filteredIcons.length }} icon{{ filteredIcons.length !== 1 ? 's' : '' }} found
          </span>
          <span v-if="selectedIconId" class="text-sm text-neutral-600">
            Selected: {{ getSelectedIconName() }}
          </span>
        </div>
        <div class="footer-actions">
          <AppButton variant="ghost" @click="handleClose" :aria-label="'Cancel icon selection'">
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            :disabled="!selectedIconId"
            @click="confirm"
            :aria-label="!selectedIconId ? 'Select an icon first' : 'Confirm icon selection'"
          >
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
import LoadingSpinner from '~/components/LoadingSpinner.vue'

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
const isLoading = ref(false)

// Virtual scrolling state
const scrollContainer = ref<HTMLElement>()
const ITEM_HEIGHT = 72 // Height of each icon item in pixels
const VISIBLE_BUFFER = 4 // Number of extra items to render above/below viewport
const offsetY = ref(0)

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

// Virtual scrolling computed
const totalHeight = computed(() => filteredIcons.value.length * ITEM_HEIGHT)

const viewportHeight = computed(() => {
  if (!scrollContainer.value) return 320 // Default height
  return scrollContainer.value.clientHeight
})

const startIndex = computed(() => {
  return Math.max(0, Math.floor(offsetY.value / ITEM_HEIGHT) - VISIBLE_BUFFER)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(viewportHeight.value / ITEM_HEIGHT)
  return Math.min(
    filteredIcons.value.length,
    startIndex.value + visibleCount + VISIBLE_BUFFER * 2
  )
})

const visibleIcons = computed(() => {
  return filteredIcons.value.slice(startIndex.value, endIndex.value)
})

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Methods
function handleSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    offsetY.value = 0
  }, 300)
}

function toggleCategory(categoryId: IconCategory) {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
  offsetY.value = 0
}

function selectIcon(icon: Icon) {
  selectedIconId.value = icon.id
}

function getSelectedIconName(): string {
  const icon = filteredIcons.value.find(i => i.id === selectedIconId.value)
  return icon?.alt || ''
}

function confirm() {
  if (selectedIconId.value) {
    emit('select', { cardId: props.cardId, iconId: selectedIconId.value })
    handleClose()
  }
}

function handleClose() {
  isOpen.value = false
  // Reset state after modal closes
  setTimeout(() => {
    searchQuery.value = ''
    selectedCategory.value = null
    selectedIconId.value = null
    offsetY.value = 0
  }, 200)
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  offsetY.value = target.scrollTop
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (!filteredIcons.value.length) return
  
  const currentIndex = filteredIcons.value.findIndex(i => i.id === selectedIconId.value)
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (currentIndex < filteredIcons.value.length - 1) {
        selectedIconId.value = filteredIcons.value[currentIndex + 1].id
        scrollToIcon(currentIndex + 1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (currentIndex > 0) {
        selectedIconId.value = filteredIcons.value[currentIndex - 1].id
        scrollToIcon(currentIndex - 1)
      }
      break
    case 'ArrowRight':
      event.preventDefault()
      if (currentIndex < filteredIcons.value.length - 1) {
        selectedIconId.value = filteredIcons.value[currentIndex + 1].id
        scrollToIcon(currentIndex + 1)
      }
      break
    case 'ArrowLeft':
      event.preventDefault()
      if (currentIndex > 0) {
        selectedIconId.value = filteredIcons.value[currentIndex - 1].id
        scrollToIcon(currentIndex - 1)
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      confirm()
      break
    case 'Escape':
      handleClose()
      break
  }
}

function scrollToIcon(index: number) {
  if (scrollContainer.value) {
    const targetScrollTop = index * ITEM_HEIGHT - viewportHeight.value / 2 + ITEM_HEIGHT / 2
    scrollContainer.value.scrollTop = Math.max(0, targetScrollTop)
  }
}

// Watch for modal open to set initial selection
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    selectedIconId.value = props.currentIconId
    // Load icons if not already loaded
    if (iconsStore.icons.length === 0) {
      isLoading.value = true
      iconsStore.loadIcons().finally(() => {
        isLoading.value = false
      })
    }
  }
})

// Cleanup
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
.category-pill {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
         bg-neutral-100 text-neutral-600 hover:bg-neutral-200
         transition-all duration-200 cursor-pointer;
}

.category-pill:focus-visible {
  @apply outline-none ring-2 ring-neutral-400 ring-offset-2;
}

.category-pill-active {
  @apply bg-neutral-900 text-white ring-2 ring-neutral-400;
}

.icons-scroll-container {
  position: relative;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;
}

.icons-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.icons-scroll-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.icons-scroll-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.icons-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media (min-width: 640px) {
  .icons-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .icons-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.icons-viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media (min-width: 640px) {
  .icons-viewport {
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .icons-viewport {
    grid-template-columns: repeat(8, 1fr);
  }
}

.icon-item {
  @apply relative aspect-square rounded-lg border border-neutral-200 bg-white
         hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm
         transition-all duration-200 cursor-pointer overflow-hidden
         focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2;
  height: 72px;
}

.icon-item-selected {
  @apply border-neutral-900 ring-2 ring-neutral-400 ring-offset-1 bg-neutral-50;
}

.icon-image {
  @apply w-full h-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-110;
}

.icon-check-overlay {
  @apply absolute inset-0 flex items-center justify-center
         bg-neutral-900 rounded-lg
         opacity-0 group-hover:opacity-100 transition-opacity duration-200;
}

.icon-item-selected .icon-check-overlay {
  @apply opacity-100;
}

.loading-indicator {
  @apply flex items-center justify-center gap-2 py-4 text-sm text-neutral-600;
}

.empty-state {
  @apply py-16 text-center;
}

.empty-icon {
  @apply w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center;
}

.empty-title {
  @apply text-neutral-600 font-medium text-lg;
}

.empty-description {
  @apply text-neutral-500 text-sm mt-1;
}

.footer-content {
  @apply flex justify-between items-center w-full;
}

.footer-info {
  @apply flex flex-col gap-1;
}

.footer-actions {
  @apply flex gap-3;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .category-pill,
  .icon-item,
  .icon-image,
  .icon-check-overlay {
    transition: none;
  }
  
  .icon-image:hover {
    transform: none;
  }
}
</style>
