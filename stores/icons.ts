import { defineStore } from 'pinia'
import { ICON_CATALOG, searchIcons, getIconById, getAllIcons, type IconCatalogItem } from '~/utils/iconCatalog'

const STORAGE_KEY_RECENT = 'recent-icons'
const STORAGE_KEY_FAVORITES = 'favorite-icons'

export const useIconsStore = defineStore('icons', () => {
  // State
  const isLoading = ref(false)
  const searchQuery = ref('')
  const selectedCategory = ref<string | null>(null)
  const recentIcons = ref<string[]>([])
  const favoriteIcons = ref<string[]>([])
  const showFavorites = ref(false)
  
  // Computed
  const filteredIcons = computed(() => {
    if (searchQuery.value) {
      return searchIcons(searchQuery.value)
    }
    if (selectedCategory.value) {
      const category = ICON_CATALOG.find(c => c.id === selectedCategory.value)
      return category?.icons || []
    }
    return ICON_CATALOG.flatMap(c => c.icons)
  })
  
  const categories = computed(() => ICON_CATALOG)
  
  const recentIconItems = computed(() => {
    return recentIcons.value
      .map(id => getIconById(id))
      .filter((icon): icon is IconCatalogItem => icon !== undefined)
  })
  
  const favoriteIconItems = computed(() => {
    return favoriteIcons.value
      .map(id => getIconById(id))
      .filter((icon): icon is IconCatalogItem => icon !== undefined)
  })
  
  // Actions
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }
  
  function setSelectedCategory(categoryId: string | null) {
    selectedCategory.value = categoryId
  }
  
  function addToRecent(iconId: string) {
    recentIcons.value = [iconId, ...recentIcons.value.filter(id => id !== iconId)].slice(0, 20)
    saveRecentIcons()
  }
  
  function toggleFavorite(iconId: string) {
    if (favoriteIcons.value.includes(iconId)) {
      favoriteIcons.value = favoriteIcons.value.filter(id => id !== iconId)
    } else {
      favoriteIcons.value = [iconId, ...favoriteIcons.value]
    }
    saveFavoriteIcons()
  }
  
  function isFavorite(iconId: string): boolean {
    return favoriteIcons.value.includes(iconId)
  }
  
  function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = null
  }
  
  function getIcon(iconId: string): IconCatalogItem | undefined {
    return getIconById(iconId)
  }
  
  // Backward compatibility methods
  async function loadIcons() {
    // Icons are now loaded from the catalog, no async loading needed
    // This method exists for backward compatibility
    isLoading.value = false
  }
  
  function getRandomIcon(): IconCatalogItem | undefined {
    const allIcons = getAllIcons()
    if (allIcons.length === 0) return undefined
    return allIcons[Math.floor(Math.random() * allIcons.length)]
  }
  
  function getRandomIcons(count: number): IconCatalogItem[] {
    const allIcons = getAllIcons()
    if (allIcons.length === 0) return []
    const shuffled = [...allIcons].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
  
  function toggleShowFavorites() {
    showFavorites.value = !showFavorites.value
    if (showFavorites.value) {
      selectedCategory.value = null
      searchQuery.value = ''
    }
  }
  
  // Persistence
  function saveRecentIcons() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recentIcons.value))
    }
  }
  
  function saveFavoriteIcons() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favoriteIcons.value))
    }
  }
  
  function loadRecentIcons() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT)
      if (saved) {
        try {
          recentIcons.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load recent icons:', e)
        }
      }
    }
  }
  
  function loadFavoriteIcons() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES)
      if (saved) {
        try {
          favoriteIcons.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load favorite icons:', e)
        }
      }
    }
  }
  
  // Initialize
  onMounted(() => {
    loadRecentIcons()
    loadFavoriteIcons()
  })
  
  return {
    isLoading,
    searchQuery,
    selectedCategory,
    recentIcons,
    favoriteIcons,
    recentIconItems,
    favoriteIconItems,
    showFavorites,
    filteredIcons,
    categories,
    setSearchQuery,
    setSelectedCategory,
    addToRecent,
    toggleFavorite,
    isFavorite,
    clearFilters,
    getIcon,
    getRandomIcon,
    getRandomIcons,
    loadIcons,
    toggleShowFavorites,
  }
})
