import { defineStore } from 'pinia'
import type { Icon, IconCategory, CategoryInfo } from '~/types'
import { CATEGORIES } from '~/utils/icons'

export const useIconsStore = defineStore('icons', () => {
  // State
  const icons = ref<Icon[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const selectedCategory = ref<IconCategory | null>(null)
  
  // Getters
  const categories = computed<CategoryInfo[]>(() => CATEGORIES)
  
  const filteredIcons = computed(() => {
    let result = icons.value
    
    // Filter by category
    if (selectedCategory.value) {
      result = result.filter(icon => icon.category === selectedCategory.value)
    }
    
    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter(icon => 
        icon.alt.toLowerCase().includes(query) ||
        icon.keywords.some(kw => kw.includes(query))
      )
    }
    
    return result
  })
  
  const iconsByCategory = computed(() => {
    const grouped: Record<IconCategory, Icon[]> = {
      alphabet: [],
      disability: [],
      family: [],
      'feminine-hygiene': [],
      health: [],
    }
    
    for (const icon of icons.value) {
      grouped[icon.category].push(icon)
    }
    
    return grouped
  })
  
  const getIconById = (id: string): Icon | undefined => {
    return icons.value.find(icon => icon.id === id)
  }
  
  const getRandomIcon = (): Icon | undefined => {
    if (icons.value.length === 0) return undefined
    return icons.value[Math.floor(Math.random() * icons.value.length)]
  }
  
  const getRandomIcons = (count: number): Icon[] => {
    const shuffled = [...icons.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
  
  // Actions
  async function loadIcons() {
    if (icons.value.length > 0) return // Already loaded
    
    isLoading.value = true
    try {
      const response = await fetch('/visual-communication-app/icons-manifest.json')
      const data = await response.json()
      icons.value = data
    } catch (error) {
      console.error('Failed to load icons:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }
  
  function setSelectedCategory(category: IconCategory | null) {
    selectedCategory.value = category
  }
  
  function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = null
  }
  
  return {
    // State
    icons,
    isLoading,
    searchQuery,
    selectedCategory,
    
    // Getters
    categories,
    filteredIcons,
    iconsByCategory,
    getIconById,
    getRandomIcon,
    getRandomIcons,
    
    // Actions
    loadIcons,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
  }
})
