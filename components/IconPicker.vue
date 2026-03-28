<template>
  <AppModal v-model="isOpen" title="Choose an Icon" size="lg" @close="handleClose">
    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon name="lucide:search" class="w-5 h-5" />
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
          :class="[
            selectedCategory === category.id ? 'category-pill-active' : '',
            showFavorites ? 'opacity-50' : ''
          ]"
          @click="toggleCategory(category.id)"
          role="tab"
          :aria-selected="selectedCategory === category.id"
          :aria-controls="`category-${category.id}`"
          :aria-label="`Filter by ${category.name} icons`"
          :disabled="showFavorites"
        >
          <span>{{ category.icon }}</span>
          <span>{{ category.name }}</span>
        </button>
      </div>
      
      <!-- Favorites Toggle -->
      <div class="flex items-center gap-2">
        <button
          @click="toggleShowFavorites"
          class="favorites-toggle"
          :class="{ 'favorites-toggle-active': showFavorites }"
          :aria-label="showFavorites ? 'Show all icons' : 'Show favorites only'"
        >
          <Icon :name="showFavorites ? 'tabler:star-filled' : 'tabler:star'" class="w-5 h-5" />
          <span>{{ showFavorites ? 'All Icons' : 'Favorites' }}</span>
        </button>
      </div>
    </div>
    
    <!-- Recent Icons -->
    <div v-if="!showFavorites && !searchQuery && !selectedCategory && recentIconItems.length > 0" class="mb-6">
      <h3 class="section-title">Recent</h3>
      <div class="icon-grid">
        <button
          v-for="icon in recentIconItems"
          :key="icon.id"
          @click="selectIcon(icon)"
          class="icon-item group"
          :class="{ 'icon-item-selected': selectedIconId === icon.id }"
          :aria-label="`${icon.name} icon`"
          :aria-pressed="selectedIconId === icon.id"
          role="option"
        >
          <Icon :name="icon.name" :size="48" />
          <div v-if="selectedIconId === icon.id" class="icon-check-overlay">
            <Icon name="lucide:check" class="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
    
    <!-- Favorite Icons -->
    <div v-if="showFavorites && favoriteIconItems.length > 0" class="mb-6">
      <h3 class="section-title">Favorites</h3>
      <div class="icon-grid">
        <button
          v-for="icon in favoriteIconItems"
          :key="icon.id"
          @click="selectIcon(icon)"
          class="icon-item group"
          :class="{ 'icon-item-selected': selectedIconId === icon.id }"
          :aria-label="`${icon.name} icon`"
          :aria-pressed="selectedIconId === icon.id"
          role="option"
        >
          <Icon :name="icon.name" :size="48" />
          <div v-if="selectedIconId === icon.id" class="icon-check-overlay">
            <Icon name="lucide:check" class="w-5 h-5 text-white" />
          </div>
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
            :aria-label="`${icon.name} icon`"
            :aria-pressed="selectedIconId === icon.id"
            role="option"
            tabindex="-1"
          >
            <Icon :name="icon.name" :size="48" />
            <div class="icon-check-overlay">
              <Icon name="lucide:check" class="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state" role="status" :aria-live="'polite'">
      <div class="empty-icon">
        <Icon name="lucide:search-x" class="w-8 h-8 text-neutral-400" />
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
              <Icon name="lucide:check" class="w-4 h-4" />
            </template>
            Select Icon
          </AppButton>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import type { IconCatalogItem } from '~/utils/iconCatalog'

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
const selectedIconId = ref<string | null>(null)
const offsetY = ref(0)

// Virtual scrolling state
const scrollContainer = ref<HTMLElement>()
const ITEM_HEIGHT = 72 // Height of each icon item in pixels
const VISIBLE_BUFFER = 4 // Number of extra items to render above/below viewport

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const categories = computed(() => iconsStore.categories)
const filteredIcons = computed(() => iconsStore.filteredIcons)
const selectedCategory = computed(() => iconsStore.selectedCategory)
const showFavorites = computed(() => iconsStore.showFavorites)
const recentIconItems = computed(() => iconsStore.recentIconItems)
const favoriteIconItems = computed(() => iconsStore.favoriteIconItems)

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

function toggleCategory(categoryId: string) {
  if (iconsStore.selectedCategory === categoryId) {
    iconsStore.setSelectedCategory(null)
  } else {
    iconsStore.setSelectedCategory(categoryId)
  }
  offsetY.value = 0
}

function toggleShowFavorites() {
  iconsStore.toggleShowFavorites()
  offsetY.value = 0
}

function selectIcon(icon: IconCatalogItem) {
  console.log('[IconPicker] selectIcon:', icon)
  selectedIconId.value = icon.id
  // Add to recent icons
  iconsStore.addToRecent(icon.id)
}

function getSelectedIconName(): string {
  const icon = filteredIcons.value.find(i => i.id === selectedIconId.value)
  return icon?.name || ''
}

function confirm() {
  console.log('[IconPicker] confirm, selectedIconId:', selectedIconId.value)
  if (selectedIconId.value) {
    // Use the icon name (with colon) instead of ID
    const icon = filteredIcons.value.find(i => i.id === selectedIconId.value)
    if (icon) {
      console.log('[IconPicker] Emitting select:', { cardId: props.cardId, iconId: icon.name })
      emit('select', { cardId: props.cardId, iconId: icon.name })
    }
    handleClose()
  }
}

function handleClose() {
  isOpen.value = false
  // Reset state after modal closes
  setTimeout(() => {
    searchQuery.value = ''
    iconsStore.setSelectedCategory(null)
    iconsStore.showFavorites = false
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
  if (isOpen && props.currentIconId) {
    // Find the icon by name (currentIconId is the name with colon)
    const icon = filteredIcons.value.find(i => i.name === props.currentIconId)
    selectedIconId.value = icon?.id || null
  }
})

// Watch for search query changes
watch(searchQuery, (query) => {
  iconsStore.setSearchQuery(query)
})

// Cleanup
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped>
@import "tailwindcss";
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

.category-pill:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.favorites-toggle {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
         bg-neutral-100 text-neutral-600 hover:bg-neutral-200
         transition-all duration-200 cursor-pointer;
}

.favorites-toggle-active {
  @apply bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400;
}

.section-title {
  @apply text-sm font-semibold text-neutral-700 mb-3;
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
  }
}

@media (min-width: 768px) {
  .icons-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.icon-item {
  @apply relative flex items-center justify-center p-4 rounded-lg
         bg-white border-2 border-neutral-200
         hover:border-neutral-400 hover:bg-neutral-50
         transition-all duration-200;
  aspect-ratio: 1;
}

.icon-item:focus-visible {
  @apply outline-none ring-2 ring-neutral-400 ring-offset-2;
}

.icon-item-selected {
  @apply border-neutral-900 bg-neutral-100;
}

.icon-check-overlay {
  @apply absolute inset-0 flex items-center justify-center
         bg-neutral-900/80 rounded-lg opacity-0
         transition-opacity duration-200;
}

.icon-item-selected .icon-check-overlay {
  @apply opacity-100;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-icon {
  @apply mb-4;
}

.empty-title {
  @apply text-lg font-medium text-neutral-700 mb-2;
}

.empty-description {
  @apply text-sm text-neutral-500;
}

.footer-content {
  @apply flex items-center justify-between w-full;
}

.footer-info {
  @apply flex flex-col gap-1;
}

.footer-actions {
  @apply flex items-center gap-3;
}
</style>
