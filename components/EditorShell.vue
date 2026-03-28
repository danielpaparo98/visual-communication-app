<template>
  <div class="editor-shell h-screen flex flex-col bg-gray-50 overflow-hidden">
    <!-- Editor Top Bar -->
    <EditorTopBar />
    
    <!-- Editor Workspace -->
    <EditorWorkspace />
    
    <!-- Bottom Sheet (mobile/tablet) -->
    <BottomSheet />
  </div>
</template>

<script setup lang="ts">
import EditorTopBar from './EditorTopBar.vue'
import EditorWorkspace from './EditorWorkspace.vue'
import BottomSheet from './BottomSheet.vue'
import { useEditorLayoutStore } from '~/stores/editorLayout'

const editorLayout = useEditorLayoutStore()

// Handle viewport resize
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  // The editorLayout store already has computed viewportSize
  // This is a placeholder for any additional resize handling
}
</script>
