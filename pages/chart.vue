<template>
  <div class="chart-page">
    <!-- Main Content -->
    <main class="chart-main">
      <div class="chart-layout">
          <!-- Icon Sidebar -->
          <aside class="icon-sidebar">
            <div class="sidebar-header">
              <h2 class="sidebar-title">Icons</h2>
              <div class="sidebar-tabs">
                <button
                  v-for="category in iconCategories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  class="sidebar-tab"
                  :class="{ 'active': selectedCategory === category.id }"
                  :aria-label="`Filter by ${category.name}`"
                >
                  {{ category.icon }}
                </button>
              </div>
            </div>

            <!-- Search -->
            <div class="sidebar-search">
              <Icon name="lucide:search" class="w-4 h-4 text-neutral-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search icons..."
                class="search-input"
                :aria-label="'Search icons'"
              />
            </div>

            <!-- Icon Grid -->
            <div class="icon-grid">
              <div
                v-for="icon in filteredIcons"
                :key="icon.id"
                draggable="true"
                @dragstart="handleIconDragStart(icon)"
                @click="handleIconClick(icon)"
                class="icon-item"
                role="button"
                :aria-label="`${icon.name} icon`"
                tabindex="0"
              >
                <Icon :name="icon.name" :size="32" class="icon-display" />
              </div>
            </div>
          </aside>

          <!-- A4 Canvas -->
          <div class="canvas-area">
            <div
              ref="canvasRef"
              class="a4-canvas"
              :class="{ 'preview-mode': isPreviewMode }"
              @dragover.prevent
              @drop="handleDrop"
              @click="handleCanvasClick"
            >
              <!-- Chart Title on Canvas -->
              <div v-if="!isPreviewMode" class="canvas-title-section">
                <input
                  v-model="canvasTitle"
                  type="text"
                  class="canvas-title-input"
                  placeholder="Add a title..."
                  :aria-label="'Canvas title'"
                />
              </div>
              <div v-else class="canvas-title-display">
                {{ canvasTitle }}
              </div>

              <!-- Cards Grid -->
              <div class="cards-grid" :style="gridStyle">
                <div
                  v-for="(card, index) in cards"
                  :key="card.id"
                  class="chart-card"
                  :class="{ 'selected': selectedCardId === card.id && !isPreviewMode }"
                  @click.stop="handleCardClick(card.id)"
                  role="button"
                  tabindex="0"
                >
                  <!-- Icon Display -->
                  <div class="card-icon">
                    <Icon
                      v-if="card.iconId"
                      :name="getIconName(card.iconId)"
                      :size="48"
                      class="card-icon-image"
                    />
                    <div v-else class="card-icon-placeholder">
                      <Icon name="lucide:image" class="w-8 h-8 text-neutral-300" />
                    </div>
                  </div>

                  <!-- Text Inputs -->
                  <div class="card-text">
                    <input
                      v-if="!isPreviewMode"
                      v-model="card.heading"
                      type="text"
                      class="card-heading-input"
                      placeholder="Heading"
                      :aria-label="`Card ${index + 1} heading`"
                    />
                    <div v-else class="card-heading-display">
                      {{ card.heading }}
                    </div>

                    <input
                      v-if="!isPreviewMode"
                      v-model="card.subtitle"
                      type="text"
                      class="card-subtitle-input"
                      placeholder="Subtitle"
                      :aria-label="`Card ${index + 1} subtitle`"
                    />
                    <div v-else class="card-subtitle-display">
                      {{ card.subtitle }}
                    </div>
                  </div>

                  <!-- Delete Button (edit mode only) -->
                  <button
                    v-if="!isPreviewMode && selectedCardId === card.id"
                    @click.stop="handleDeleteCard(card.id)"
                    class="card-delete-btn"
                    :aria-label="'Delete card'"
                  >
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                </div>

                <!-- Add Card Button (edit mode only) -->
                <button
                  v-if="!isPreviewMode && cards.length < maxCards"
                  @click="handleAddCard"
                  class="add-card-btn"
                  :aria-label="'Add new card'"
                >
                  <Icon name="lucide:plus" class="w-8 h-8 text-neutral-400" />
                </button>
              </div>

              <!-- Empty State -->
              <div v-if="cards.length === 0 && !isPreviewMode" class="empty-state">
                <Icon name="lucide:layout-grid" class="w-16 h-16 text-neutral-300 mb-4" />
                <p class="text-neutral-500 mb-4">Drag icons here or click to add cards</p>
                <button @click="handleAddCard" class="add-first-card-btn">
                  Add First Card
                </button>
              </div>
            </div>

            <!-- Canvas Controls -->
            <div class="canvas-controls">
              <div class="control-group">
                <label class="control-label">Columns</label>
                <select v-model="columns" class="control-select" :aria-label="'Number of columns'">
                  <option :value="2">2</option>
                  <option :value="3">3</option>
                  <option :value="4">4</option>
                  <option :value="5">5</option>
                </select>
              </div>
              <div class="control-group">
                <label class="control-label">Rows</label>
                <select v-model="rows" class="control-select" :aria-label="'Number of rows'">
                  <option :value="5">5</option>
                  <option :value="7">7</option>
                  <option :value="10">10</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Export Modal -->
    <Teleport to="body">
      <div v-if="showExportModal" class="modal-overlay" @click="showExportModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Export Chart</h3>
            <button @click="showExportModal = false" class="modal-close" :aria-label="'Close modal'">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="modal-body">
            <div class="export-options">
              <button
                @click="handleExportPdf"
                class="export-option"
                :class="{ 'selected': exportFormat === 'pdf' }"
              >
                <Icon name="lucide:file-text" class="w-8 h-8" />
                <span>PDF</span>
              </button>
              <button
                @click="handleExportPng"
                class="export-option"
                :class="{ 'selected': exportFormat === 'png' }"
              >
                <Icon name="lucide:image" class="w-8 h-8" />
                <span>PNG</span>
              </button>
            </div>
            <button @click="handleDownload" class="download-btn">
              Download {{ exportFormat.toUpperCase() }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// Use editor layout (no header/footer)
definePageMeta({
  layout: 'editor'
})
import type { Card } from '~/types'
import type { IconCatalogItem } from '~/utils/iconCatalog'

// SEO
useHead({
  title: 'Create Chart - The Talking Chart',
  meta: [
    { name: 'description', content: 'Create your visual communication chart with customizable icons and text.' }
  ]
})

// Store
const chartStore = useChartStore()
const iconsStore = useIconsStore()

// State
const canvasTitle = ref('Communication Chart')
const isPreviewMode = ref(false)
const selectedCardId = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)
const searchQuery = ref('')
const showExportModal = ref(false)
const exportFormat = ref<'pdf' | 'png'>('pdf')
const canvasRef = ref<HTMLElement>()

// Layout settings
const columns = ref(4)
const rows = ref(7)
const maxCards = 50

// Initialize with default cards
onMounted(() => {
  if (cards.value.length === 0) {
    initializeDefaultCards()
  }
})

// Initialize default cards
const initializeDefaultCards = () => {
  const defaultIcons = [
    'tabler-stethoscope',
    'tabler-hospital',
    'tabler-pill',
    'tabler-ambulance',
    'tabler-heart-pulse',
    'tabler-vaccine',
    'tabler-thermometer',
    'tabler-bandage',
    'tabler-crutch',
    'tabler-wheelchair',
    'tabler-users',
    'tabler-user',
    'tabler-baby',
    'tabler-home',
    'tabler-heart',
  ]
  
  const newCards: Card[] = defaultIcons.map((iconName, index) => ({
    id: `card-${Date.now()}-${index}`,
    iconId: iconName,
    customIconId: null,
    heading: '',
    subtitle: '',
    textFormatting: {
      bold: false,
      italic: false,
      underline: false,
      color: '#0F172A',
      fontSize: 14,
      alignment: 'center',
      lineHeight: 1.5,
    },
  }))
  
  cards.value = newCards
}

// Computed
const iconCategories = computed(() => iconsStore.categories)

const cards = computed({
  get: () => chartStore.cards,
  set: (value) => chartStore.cards = value
})

const hasCards = computed(() => cards.value.length > 0)

const filteredIcons = computed(() => {
  if (searchQuery.value) {
    iconsStore.setSearchQuery(searchQuery.value)
    return iconsStore.filteredIcons
  }
  
  iconsStore.setSelectedCategory(selectedCategory.value)
  return iconsStore.filteredIcons
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value}, 1fr)`,
}))

// Methods
const handlePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
  selectedCardId.value = null
}

const handleExport = () => {
  showExportModal.value = true
}

const handleExportPdf = () => {
  exportFormat.value = 'pdf'
}

const handleExportPng = () => {
  exportFormat.value = 'png'
}

const handleDownload = async () => {
  showExportModal.value = false
  // TODO: Implement actual export
  console.log('Exporting as', exportFormat.value)
}

const handleIconDragStart = (icon: IconCatalogItem) => {
  // Store dragged icon for drop
  sessionStorage.setItem('draggedIcon', JSON.stringify(icon))
}

const handleIconClick = (icon: IconCatalogItem) => {
  // Add new card with this icon
  if (cards.value.length < maxCards) {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      iconId: icon.id,
      customIconId: null,
      heading: '',
      subtitle: '',
      textFormatting: {
        bold: false,
        italic: false,
        underline: false,
        color: '#0F172A',
        fontSize: 14,
        alignment: 'center',
        lineHeight: 1.5,
      },
    }
    cards.value = [...cards.value, newCard]
    selectedCardId.value = newCard.id
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const draggedIconData = sessionStorage.getItem('draggedIcon')
  if (draggedIconData) {
    const icon = JSON.parse(draggedIconData) as IconCatalogItem
    handleIconClick(icon)
    sessionStorage.removeItem('draggedIcon')
  }
}

const handleCanvasClick = () => {
  selectedCardId.value = null
}

const handleCardClick = (cardId: string) => {
  if (!isPreviewMode.value) {
    selectedCardId.value = cardId
  }
}

const handleAddCard = () => {
  if (cards.value.length < maxCards) {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      iconId: null,
      customIconId: null,
      heading: '',
      subtitle: '',
      textFormatting: {
        bold: false,
        italic: false,
        underline: false,
        color: '#0F172A',
        fontSize: 14,
        alignment: 'center',
        lineHeight: 1.5,
      },
    }
    cards.value = [...cards.value, newCard]
    selectedCardId.value = newCard.id
  }
}

const handleDeleteCard = (cardId: string) => {
  cards.value = cards.value.filter(c => c.id !== cardId)
  if (selectedCardId.value === cardId) {
    selectedCardId.value = null
  }
}

const getIconName = (iconId: string) => {
  const icon = iconsStore.getIcon(iconId)
  return icon?.name || 'lucide:image'
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isPreviewMode.value = false
      selectedCardId.value = null
      showExportModal.value = false
    }
    if (e.key === 'Delete' && selectedCardId.value) {
      handleDeleteCard(selectedCardId.value)
    }
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault()
      handleExport()
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<style scoped>
.chart-page {
  min-height: 100vh;
  background: #FAFAFA;
}

/* Header */
.chart-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 50;
}

.chart-header .container {
  height: 100%;
}

.chart-title-input {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0F172A;
  border: none;
  background: transparent;
  text-align: center;
  width: 300px;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 200ms;
}

.chart-title-input:hover {
  background: #F3F4F6;
}

.chart-title-input:focus {
  outline: none;
  background: #F3F4F6;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #E5E7EB;
  background: white;
  color: #0F172A;
  cursor: pointer;
  transition: all 200ms;
}

.action-btn:hover:not(:disabled) {
  background: #F3F4F6;
  border-color: #D1D5DB;
}

.action-btn.active {
  background: #F3F4F6;
  border-color: #0F172A;
}

.action-btn.primary {
  background: #0F172A;
  color: white;
  border-color: #0F172A;
}

.action-btn.primary:hover:not(:disabled) {
  background: #1E293B;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Main Content */
.chart-main {
  padding: 2rem 0;
}

.chart-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Icon Sidebar */
.icon-sidebar {
  background: white;
  border-radius: 1rem;
  border: 1px solid #E5E7EB;
  padding: 1rem;
  height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 6rem;
}

.sidebar-header {
  margin-bottom: 1rem;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 0.75rem;
}

.sidebar-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sidebar-tab {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  background: white;
  cursor: pointer;
  transition: all 200ms;
  font-size: 1.25rem;
}

.sidebar-tab:hover {
  background: #F3F4F6;
}

.sidebar-tab.active {
  background: #0F172A;
  color: white;
  border-color: #0F172A;
}

.sidebar-search {
  position: relative;
  margin-bottom: 1rem;
}

.sidebar-search svg {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 200ms;
}

.search-input:focus {
  outline: none;
  border-color: #0F172A;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.icon-grid {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding-right: 0.25rem;
}

.icon-item {
  aspect-ratio: 1;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: grab;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.icon-item:hover {
  border-color: #0F172A;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-item:active {
  cursor: grabbing;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Canvas Area */
.canvas-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.a4-canvas {
  width: 210mm;
  min-height: 297mm;
  background: white;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 20mm;
  transition: all 200ms;
}

.a4-canvas.preview-mode {
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.canvas-title-section {
  margin-bottom: 1.5rem;
  text-align: center;
}

.canvas-title-input {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  border: none;
  background: transparent;
  text-align: center;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 200ms;
}

.canvas-title-input:hover {
  background: #F3F4F6;
}

.canvas-title-input:focus {
  outline: none;
  background: #F3F4F6;
}

.canvas-title-display {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  text-align: center;
  margin-bottom: 1.5rem;
}

.cards-grid {
  display: grid;
  gap: 1rem;
}

.chart-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 200ms;
  position: relative;
}

.chart-card:hover {
  border-color: #D1D5DB;
}

.chart-card.selected {
  border-color: #0F172A;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.card-icon {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  background: #F9FAFB;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-text {
  text-align: center;
}

.card-heading-input,
.card-subtitle-input {
  width: 100%;
  border: none;
  background: transparent;
  text-align: center;
  border-radius: 0.375rem;
  transition: background-color 200ms;
}

.card-heading-input {
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
  padding: 0.25rem;
}

.card-heading-input:focus {
  outline: none;
  background: #F3F4F6;
}

.card-subtitle-input {
  font-size: 0.875rem;
  color: #475569;
  padding: 0.25rem;
}

.card-subtitle-input:focus {
  outline: none;
  background: #F3F4F6;
}

.card-heading-display {
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.card-subtitle-display {
  font-size: 0.875rem;
  color: #475569;
}

.card-delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 200ms;
}

.card-delete-btn:hover {
  background: #DC2626;
}

.add-card-btn {
  aspect-ratio: 1;
  background: white;
  border: 2px dashed #E5E7EB;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms;
}

.add-card-btn:hover {
  border-color: #0F172A;
  background: #F9FAFB;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.add-first-card-btn {
  padding: 0.75rem 1.5rem;
  background: #0F172A;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms;
}

.add-first-card-btn:hover {
  background: #1E293B;
}

/* Canvas Controls */
.canvas-controls {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #E5E7EB;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.control-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.control-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0F172A;
  background: white;
  cursor: pointer;
  transition: all 200ms;
}

.control-select:focus {
  outline: none;
  border-color: #0F172A;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0F172A;
}

.modal-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #6B7280;
  transition: all 200ms;
}

.modal-close:hover {
  background: #F3F4F6;
  color: #0F172A;
}

.modal-body {
  padding: 1.5rem;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.export-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 200ms;
  color: #0F172A;
}

.export-option:hover {
  border-color: #D1D5DB;
  background: #F9FAFB;
}

.export-option.selected {
  border-color: #0F172A;
  background: #F3F4F6;
}

.download-btn {
  width: 100%;
  padding: 0.875rem;
  background: #0F172A;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 200ms;
}

.download-btn:hover {
  background: #1E293B;
}

/* Responsive */
@media (max-width: 1024px) {
  .chart-layout {
    grid-template-columns: 1fr;
  }

  .icon-sidebar {
    position: relative;
    top: 0;
    height: auto;
    max-height: 400px;
  }

  .a4-canvas {
    width: 100%;
    min-height: auto;
    aspect-ratio: 210 / 297;
  }
}

@media (max-width: 640px) {
  .chart-main {
    padding: 1rem 0;
  }

  .chart-title-input {
    width: 150px;
    font-size: 1rem;
  }

  .action-btn span {
    display: none;
  }

  .sidebar-tabs {
    gap: 0.25rem;
  }

  .sidebar-tab {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .icon-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .canvas-controls {
    flex-wrap: wrap;
  }
}
</style>
