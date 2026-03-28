export function useKeyboardShortcuts() {
  const chartStore = useChartStore()

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  function handleKeyDown(event: KeyboardEvent) {
    // Ignore if typing in an input
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }

    // Ctrl/Cmd + S: Save (prevent default)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      chartStore.saveToStorage()
    }

    // Ctrl/Cmd + P: Export PDF
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault()
      chartStore.exportToPDF()
    }

    // Escape: Deselect all / Close modals
    if (event.key === 'Escape') {
      chartStore.deselectAll()
    }

    // Delete: Remove selected card
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (chartStore.selectedCardId) {
        chartStore.removeCard(chartStore.selectedCardId)
      }
    }

    // Ctrl/Cmd + D: Duplicate selected card
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault()
      if (chartStore.selectedCardId) {
        chartStore.duplicateCard(chartStore.selectedCardId)
      }
    }

    // Plus/Equal: Zoom in
    if (event.key === '+' || event.key === '=') {
      chartStore.zoomIn()
    }

    // Minus: Zoom out
    if (event.key === '-') {
      chartStore.zoomOut()
    }

    // Zero: Reset zoom
    if (event.key === '0') {
      chartStore.resetZoom()
    }
  }

  return {
    // Expose for testing
    handleKeyDown,
  }
}
