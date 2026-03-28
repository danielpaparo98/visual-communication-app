<template>
  <aside
    class="side-panel w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 transition-transform duration-300 ease-in-out"
    :class="{ '-translate-x-full': !isOpen }"
    role="complementary"
    :aria-hidden="!isOpen"
    :aria-expanded="isOpen"
    aria-label="Editor controls"
  >
    <!-- Panel Header -->
    <div class="panel-header px-4 py-3 border-b border-gray-200">
      <h2 class="text-sm font-semibold text-gray-900">Editor Controls</h2>
    </div>

    <!-- Tab Navigation -->
    <nav class="panel-tabs flex border-b border-gray-200" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="handleTabChange(tab.id)"
        class="tab-button flex-1 flex flex-col items-center gap-1 px-2 py-3 text-sm font-medium transition-colors"
        :class="[
          activeSection === tab.id 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
        :aria-selected="activeSection === tab.id"
        :aria-controls="`panel-${tab.id}`"
        role="tab"
      >
        <component :is="tab.icon" class="w-5 h-5" aria-hidden="true" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <!-- Panel Content -->
    <div class="panel-content flex-1 overflow-y-auto">
      <!-- Layout Section -->
      <div
        v-show="activeSection === 'layout'"
        id="panel-layout"
        role="tabpanel"
        aria-labelledby="tab-layout"
      >
        <LayoutSection />
      </div>

      <!-- Cards Section -->
      <div
        v-show="activeSection === 'cards'"
        id="panel-cards"
        role="tabpanel"
        aria-labelledby="tab-cards"
      >
        <CardsSection />
      </div>

      <!-- Style Section -->
      <div
        v-show="activeSection === 'style'"
        id="panel-style"
        role="tabpanel"
        aria-labelledby="tab-style"
      >
        <StyleSection />
      </div>

      <!-- Export Section -->
      <div
        v-show="activeSection === 'export'"
        id="panel-export"
        role="tabpanel"
        aria-labelledby="tab-export"
      >
        <ExportSection />
      </div>
    </div>

    <!-- Panel Footer -->
    <div class="panel-footer px-4 py-3 border-t border-gray-200">
      <button
        @click="handleToggle"
        class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        <span>Collapse Panel</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import LayoutSection from './LayoutSection.vue'
import CardsSection from './CardsSection.vue'
import StyleSection from './StyleSection.vue'
import ExportSection from './ExportSection.vue'

interface Tab {
  id: string
  label: string
  icon: any
}

// Props
interface Props {
  isOpen: boolean
  activeSection: string | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'toggle-panel': []
  'section-change': [section: string]
}>()

// Tab definitions
const tabs: Tab[] = [
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

// Event handlers
function handleTabChange(sectionId: string) {
  emit('section-change', sectionId)
}

function handleToggle() {
  emit('toggle-panel')
}
</script>

<style scoped>
.side-panel {
  position: relative;
  z-index: 20;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
