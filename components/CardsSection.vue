<template>
  <div class="cards-section p-4">
    <h3 class="text-sm font-medium text-gray-900 mb-3">Card Management</h3>
    
    <!-- Card Statistics -->
    <div class="stats-grid grid grid-cols-2 gap-3 mb-4">
      <div class="stat-card bg-gray-50 rounded-lg p-3">
        <div class="text-xs text-gray-600 mb-1">Total Cards</div>
        <div class="text-2xl font-semibold text-gray-900">{{ cardCount }}</div>
      </div>
      <div class="stat-card bg-gray-50 rounded-lg p-3">
        <div class="text-xs text-gray-600 mb-1">Remaining</div>
        <div class="text-2xl font-semibold" :class="remainingCards > 0 ? 'text-green-600' : 'text-red-600'">
          {{ remainingCards }}
        </div>
      </div>
    </div>

    <!-- Add Card Button -->
    <button
      @click="handleAddCard"
      :disabled="!canAddCard"
      class="add-card-button w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors mb-4"
      :aria-label="canAddCard ? 'Add new card' : 'Maximum cards reached'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>{{ canAddCard ? 'Add Card' : 'Maximum Cards Reached' }}</span>
    </button>

    <!-- Bulk Actions -->
    <div class="bulk-actions">
      <h4 class="text-xs font-medium text-gray-600 mb-2">Bulk Actions</h4>
      
      <div class="action-buttons flex flex-col gap-2">
        <button
          @click="handleDuplicateAll"
          :disabled="!canDuplicateAll"
          class="action-button flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-left"
          :aria-label="canDuplicateAll ? 'Duplicate all cards' : 'Cannot duplicate: would exceed maximum'"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Duplicate All Cards</span>
        </button>

        <button
          @click="handleClearAll"
          class="action-button flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
          aria-label="Clear all cards"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Clear All Cards</span>
        </button>

        <button
          @click="handleRandomizeIcons"
          :disabled="cardCount === 0"
          class="action-button flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-left"
          aria-label="Randomize all icons"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Randomize Icons</span>
        </button>
      </div>
    </div>

    <!-- Card List (compact view) -->
    <div v-if="cardCount > 0" class="card-list mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-xs font-medium text-gray-600 mb-2">Cards ({{ cardCount }})</h4>
      <div class="space-y-1 max-h-48 overflow-y-auto">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="card-item flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded cursor-pointer"
          :class="{ 'bg-blue-50': selectedCardId === card.id }"
          @click="handleSelectCard(card.id)"
        >
          <span class="card-number w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded text-xs font-medium">
            {{ index + 1 }}
          </span>
          <span class="card-title flex-1 truncate">
            {{ card.heading || card.subtitle || 'Untitled' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChartStore } from '~/stores/chart'
import { useIconsStore } from '~/stores/icons'
import { MAX_CARDS } from '~/types'

const chartStore = useChartStore()
const iconsStore = useIconsStore()

// Computed
const cardCount = computed(() => chartStore.cardCount)
const canAddCard = computed(() => chartStore.canAddCard)
const cards = computed(() => chartStore.cards)
const selectedCardId = computed(() => chartStore.selectedCardId)

const remainingCards = computed(() => MAX_CARDS - cardCount.value)

const canDuplicateAll = computed(() => {
  return cardCount.value > 0 && (cardCount.value * 2) <= MAX_CARDS
})

// Event handlers
function handleAddCard() {
  chartStore.addCard()
}

function handleDuplicateAll() {
  if (!canDuplicateAll.value) return
  
  const currentCards = [...chartStore.cards]
  currentCards.forEach(card => {
    chartStore.duplicateCard(card.id)
  })
}

function handleClearAll() {
  if (confirm('Are you sure you want to clear all cards? This action cannot be undone.')) {
    chartStore.clearChart()
  }
}

function handleRandomizeIcons() {
  const randomIcons = iconsStore.getRandomIcons(cardCount.value)
  chartStore.cards.forEach((card, i) => {
    if (randomIcons[i]) {
      chartStore.updateCardIcon(card.id, randomIcons[i].id)
    }
  })
}

function handleSelectCard(cardId: string) {
  chartStore.selectCard(cardId)
}
</script>

<style scoped>
.stat-card {
  border: 1px solid #e5e7eb;
}

.action-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.card-list::-webkit-scrollbar {
  width: 4px;
}

.card-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.card-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>
