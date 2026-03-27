<template>
  <div class="chart-container">
    <!-- Chart Header -->
    <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
      <div class="flex-1">
        <input
          v-model="chartTitle"
          type="text"
          class="text-2xl sm:text-3xl font-heading font-bold text-gray-900 bg-transparent border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-primary-400 focus:outline-none w-full"
          placeholder="Chart Title"
          @change="saveTitle"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <AppButton variant="outline" size="sm" @click="handleClear">
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </template>
          Clear
        </AppButton>
        
        <AppButton variant="primary" size="sm" @click="handlePrint">
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </template>
          Print
        </AppButton>
      </div>
    </div>
    
    <!-- Print-only Title -->
    <div class="hidden print:block mb-4 text-center">
      <h1 class="text-3xl font-heading font-bold text-gray-900">{{ chartTitle }}</h1>
    </div>
    
    <!-- Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      <ChartCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        @update:icon="updateCardIcon"
        @update:heading="updateCardHeading"
        @update:subtitle="updateCardSubtitle"
        @open-picker="openPickerForCard"
      />
    </div>
    
    <!-- Icon Picker Modal -->
    <IconPicker
      v-model="showIconPicker"
      :card-id="activeCardId"
      :current-icon-id="currentIconId"
      @select="handleIconSelect"
    />
    
    <!-- Clear Confirmation Modal -->
    <AppModal v-model="showClearModal" title="Clear Chart?">
      <p class="text-gray-600">
        Are you sure you want to clear the chart? This will reset all cards with new random icons and cannot be undone.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <AppButton variant="ghost" @click="showClearModal = false">Cancel</AppButton>
          <AppButton variant="danger" @click="confirmClear">Clear Chart</AppButton>
        </div>
      </template>
    </AppModal>
    
    <!-- Print Watermark (only visible when printing) -->
    <div class="hidden print:block fixed bottom-4 left-0 right-0 text-center">
      <p class="text-xs text-gray-400">Created with The Talking Chart - Free Visual Communication Tool</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const chartStore = useChartStore()

// State
const showIconPicker = ref(false)
const showClearModal = ref(false)
const activeCardId = ref('')
const chartTitle = ref(chartStore.title)

// Computed
const cards = computed(() => chartStore.cards)

const currentIconId = computed(() => {
  const card = cards.value.find(c => c.id === activeCardId.value)
  return card?.iconId || null
})

// Methods
function saveTitle() {
  chartStore.updateTitle(chartTitle.value)
}

function updateCardIcon(cardId: string, iconId: string) {
  chartStore.updateCardIcon(cardId, iconId)
}

function updateCardHeading(cardId: string, heading: string) {
  chartStore.updateCardHeading(cardId, heading)
}

function updateCardSubtitle(cardId: string, subtitle: string) {
  chartStore.updateCardSubtitle(cardId, subtitle)
}

function openPickerForCard(cardId: string) {
  activeCardId.value = cardId
  showIconPicker.value = true
}

function handleIconSelect({ cardId, iconId }: { cardId: string; iconId: string }) {
  chartStore.updateCardIcon(cardId, iconId)
}

function handleClear() {
  showClearModal.value = true
}

function confirmClear() {
  chartStore.clearChart()
  chartTitle.value = chartStore.title
  showClearModal.value = false
}

function handlePrint() {
  window.print()
}
</script>

<style scoped>
@media print {
  .chart-container {
    padding: 0;
  }
}
</style>
