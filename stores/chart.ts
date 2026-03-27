import { defineStore } from 'pinia'
import type { Card, ChartSaveData } from '~/types'
import { STORAGE_KEYS, CARD_COUNT, MAX_HEADING_LENGTH, MAX_SUBTITLE_LENGTH } from '~/types'
import { useIconsStore } from './icons'

export const useChartStore = defineStore('chart', () => {
  // State
  const title = ref('My Communication Chart')
  const cards = ref<Card[]>([])
  const isDirty = ref(false)
  
  // Getters
  const hasCards = computed(() => cards.value.length > 0)
  const cardCount = computed(() => cards.value.length)
  
  // Actions
  function initializeChart() {
    const iconsStore = useIconsStore()
    
    // Try to load from localStorage
    const saved = loadFromStorage()
    if (saved) {
      title.value = saved.title
      cards.value = saved.cards
      return
    }
    
    // Create new chart with random icons
    title.value = 'My Communication Chart'
    cards.value = Array.from({ length: CARD_COUNT }, (_, i) => createEmptyCard(i))
    
    // Assign random icons
    const randomIcons = iconsStore.getRandomIcons(CARD_COUNT)
    cards.value.forEach((card, i) => {
      if (randomIcons[i]) {
        card.iconId = randomIcons[i].id
      }
    })
    
    saveToStorage()
  }
  
  function createEmptyCard(index: number): Card {
    return {
      id: `card-${index}`,
      iconId: null,
      heading: '',
      subtitle: '',
    }
  }
  
  function updateCardIcon(cardId: string, iconId: string | null) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.iconId = iconId
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateCardHeading(cardId: string, heading: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.heading = heading.slice(0, MAX_HEADING_LENGTH)
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateCardSubtitle(cardId: string, subtitle: string) {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.subtitle = subtitle.slice(0, MAX_SUBTITLE_LENGTH)
      isDirty.value = true
      saveToStorage()
    }
  }
  
  function updateTitle(newTitle: string) {
    title.value = newTitle
    isDirty.value = true
    saveToStorage()
  }
  
  function clearChart() {
    const iconsStore = useIconsStore()
    
    title.value = 'My Communication Chart'
    cards.value = Array.from({ length: CARD_COUNT }, (_, i) => createEmptyCard(i))
    
    // Assign new random icons
    const randomIcons = iconsStore.getRandomIcons(CARD_COUNT)
    cards.value.forEach((card, i) => {
      if (randomIcons[i]) {
        card.iconId = randomIcons[i].id
      }
    })
    
    isDirty.value = false
    saveToStorage()
  }
  
  function saveToStorage() {
    const data: ChartSaveData = {
      title: title.value,
      cards: cards.value,
    }
    localStorage.setItem(STORAGE_KEYS.CHART, JSON.stringify(data))
  }
  
  function loadFromStorage(): ChartSaveData | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHART)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load chart from storage:', error)
    }
    return null
  }
  
  return {
    // State
    title,
    cards,
    isDirty,
    
    // Getters
    hasCards,
    cardCount,
    
    // Actions
    initializeChart,
    updateCardIcon,
    updateCardHeading,
    updateCardSubtitle,
    updateTitle,
    clearChart,
    saveToStorage,
  }
})
