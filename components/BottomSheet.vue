<template>
  <div 
    v-if="shouldShowBottomSheet"
    class="bottom-sheet-container fixed inset-0 z-40 pointer-events-none"
  >
    <!-- Backdrop -->
    <div
      v-if="isExpanded"
      class="backdrop absolute inset-0 bg-black/50 pointer-events-auto transition-opacity duration-300"
      :class="{ 'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
      @click="handleCollapse"
      aria-hidden="true"
    />

    <!-- Bottom Sheet -->
    <div
      class="bottom-sheet absolute left-0 right-0 bg-white shadow-2xl transition-all duration-300 pointer-events-auto"
      :class="[
        isExpanded ? expandedClasses : collapsedClasses,
        isMobile ? 'rounded-t-2xl' : 'rounded-t-lg'
      ]"
      role="dialog"
      :aria-modal="isExpanded"
      aria-label="Editor controls"
    >
      <!-- Handle for dragging (visual indicator) -->
      <div 
        v-if="isExpanded"
        class="drag-handle w-full flex justify-center py-2 cursor-pointer"
        @click="handleCollapse"
      >
        <div class="w-12 h-1 bg-gray-300 rounded-full" />
      </div>

      <!-- Collapsed State: Quick Actions -->
      <div v-if="!isExpanded" class="collapsed-content h-full flex items-center justify-around px-4">
        <button
          v-for="action in quickActions"
          :key="action.id"
          @click="handleQuickAction(action.id)"
          class="quick-action flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :aria-label="action.label"
        >
          <component :is="action.icon" class="w-6 h-6 text-gray-700" aria-hidden="true" />
          <span class="text-xs text-gray-600">{{ action.label }}</span>
        </button>
      </div>

      <!-- Expanded State: Full Controls -->
      <div v-else class="expanded-content flex flex-col">
        <!-- Tab Navigation -->
        <nav class="tabs flex border-b border-gray-200 overflow-x-auto" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            class="tab flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
            :class="[
              activeSection === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
            :aria-selected="activeSection === tab.id"
            :aria-controls="`bottom-sheet-${tab.id}`"
            role="tab"
          >
            <component :is="tab.icon" class="w-5 h-5" aria-hidden="true" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Tab Content -->
        <div class="tab-content flex-1 overflow-y-auto p-4">
          <!-- Layout Section -->
          <div
            v-show="activeSection === 'layout'"
            id="bottom-sheet-layout"
            role="tabpanel"
            aria-labelledby="tab-layout"
          >
            <LayoutSection />
          </div>

          <!-- Cards Section -->
          <div
            v-show="activeSection === 'cards'"
            id="bottom-sheet-cards"
            role="tabpanel"
            aria-labelledby="tab-cards"
          >
            <CardsSection />
          </div>

          <!-- Style Section -->
          <div
            v-show="activeSection === 'style'"
            id="bottom-sheet-style"
            role="tabpanel"
            aria-labelledby="tab-style"
          >
            <StyleSection />
          </div>

          <!-- Export Section -->
          <div
            v-show="activeSection === 'export'"
            id="bottom-sheet-export"
            role="tabpanel"
            aria-labelledby="tab-export"
          >
            <ExportSection />
          </div>
        </div>

        <!-- Close Button -->
        <div class="close-button border-t border-gray-200 p-3">
          <button
            @click="handleCollapse"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutSection from './LayoutSection.vue'
import CardsSection from './CardsSection.vue'
import StyleSection from './StyleSection.vue'
import ExportSection from './ExportSection.vue'
import { useEditorLayoutStore } from '~/stores/editorLayout'
import { useChartStore } from '~/stores/chart'

const editorLayout = useEditorLayoutStore()
const chartStore = useChartStore()

// Computed
const shouldShowBottomSheet = computed(() => {
  if (import.meta.client) {
    return window.innerWidth < 1024
  }
  return false
})

const isExpanded = computed(() => editorLayout.state.bottomSheetExpanded)
const activeSection = computed(() => editorLayout.state.activeSection)

const isMobile = computed(() => {
  if (import.meta.client) {
    return window.innerWidth < 768
  }
  return false
})

const collapsedClasses = computed(() => {
  return isMobile.value 
    ? 'bottom-0 h-14' 
    : 'bottom-0 h-16'
})

const expandedClasses = computed(() => {
  return isMobile.value
    ? 'bottom-0 h-[80vh]'
    : 'bottom-0 h-80'
})

// Quick actions for collapsed state
const quickActions = [
  {
    id: 'add',
    label: 'Add',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      `
    })
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      `
    })
  },
  {
    id: 'style',
    label: 'Style',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      `
    })
  },
  {
    id: 'export',
    label: 'Export',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      `
    })
  }
]

// Tabs for expanded state
const tabs = [
  {
    id: 'layout',
    label: 'Layout',
    icon: quickActions[1].icon
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: defineComponent({
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      `
    })
  },
  {
    id: 'style',
    label: 'Style',
    icon: quickActions[2].icon
  },
  {
    id: 'export',
    label: 'Export',
    icon: quickActions[3].icon
  }
]

// Event handlers
function handleQuickAction(actionId: string) {
  if (actionId === 'add') {
    chartStore.addCard()
  } else {
    // Expand bottom sheet and show the selected section
    editorLayout.setBottomSheetExpanded(true)
    editorLayout.setActiveSection(actionId as any)
  }
}

function handleTabChange(sectionId: string) {
  editorLayout.setActiveSection(sectionId as any)
}

function handleCollapse() {
  editorLayout.setBottomSheetExpanded(false)
}
</script>

<style scoped>
.tab-content::-webkit-scrollbar {
  width: 6px;
}

.tab-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.tab-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.quick-action:focus-visible,
.tab:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
