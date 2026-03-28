import { defineStore } from 'pinia'
import type { EditorLayoutState, EditorSection } from '~/types'

const STORAGE_KEY = 'editor-layout-state'

const DEFAULT_STATE: EditorLayoutState = {
  sidePanelOpen: true,
  activeSection: 'layout',
  floatingControlsVisible: true,
  bottomSheetOpen: false,
  bottomSheetExpanded: false,
}

export const useEditorLayoutStore = defineStore('editorLayout', () => {
  // State
  const state = reactive<EditorLayoutState>({ ...DEFAULT_STATE })

  // Actions
  function toggleSidePanel() {
    state.sidePanelOpen = !state.sidePanelOpen
    saveState()
  }

  function setActiveSection(section: EditorSection | null) {
    state.activeSection = section
    saveState()
  }

  function toggleFloatingControls() {
    state.floatingControlsVisible = !state.floatingControlsVisible
    saveState()
  }

  function toggleBottomSheet() {
    state.bottomSheetOpen = !state.bottomSheetOpen
    saveState()
  }

  function setBottomSheetExpanded(expanded: boolean) {
    state.bottomSheetExpanded = expanded
    saveState()
  }

  function resetState() {
    Object.assign(state, DEFAULT_STATE)
    saveState()
  }

  function saveState() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }

  function loadState() {
    if (import.meta.client) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          Object.assign(state, JSON.parse(saved))
        } catch (e) {
          console.error('Failed to load editor layout state:', e)
        }
      }
    }
  }

  // Initialize
  onMounted(() => {
    loadState()
  })

  return {
    state,
    toggleSidePanel,
    setActiveSection,
    toggleFloatingControls,
    toggleBottomSheet,
    setBottomSheetExpanded,
    resetState,
  }
})
