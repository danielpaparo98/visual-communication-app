<template>
  <div class="editor-workspace flex-1 flex overflow-hidden relative">
    <!-- Side Panel (desktop) -->
    <SidePanel 
      v-if="shouldShowSidePanel"
      :is-open="editorLayout.state.sidePanelOpen"
      :active-section="editorLayout.state.activeSection"
      @toggle-panel="editorLayout.toggleSidePanel"
      @section-change="editorLayout.setActiveSection"
    />
    
    <!-- Canvas Area -->
    <div class="canvas-area flex-1 overflow-auto bg-gray-100 relative">
      <EditorCanvas />
    </div>
    
    <!-- Floating Controls -->
    <FloatingControls />
  </div>
</template>

<script setup lang="ts">
import SidePanel from './SidePanel.vue'
import EditorCanvas from './EditorCanvas.vue'
import FloatingControls from './FloatingControls.vue'
import { useEditorLayoutStore } from '~/stores/editorLayout'

const editorLayout = useEditorLayoutStore()

// Computed
const shouldShowSidePanel = computed(() => {
  return editorLayout.state.sidePanelOpen && editorLayout.state.viewportSize === 'desktop'
})
</script>

<style scoped>
.canvas-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* Custom scrollbar for canvas area */
.canvas-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.canvas-area::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.canvas-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.canvas-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
