<template>
  <div
    class="editor-card"
    :class="cardClasses"
    :style="cardStyle"
    role="article"
    :aria-label="`${card.heading} - ${card.subtitle}`"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <!-- Card Content -->
    <div class="card-content">
      <!-- Icon -->
      <div
        class="card-icon"
        v-if="card.iconId || card.customIconId"
        @click="handleIconClick"
        :class="{ 'icon-clickable': !isPreviewMode }"
      >
        <Icon
          v-if="card.iconId && isIconifyIcon(card.iconId)"
          :name="getMigratedIconName(card.iconId)"
          :alt="`${card.heading} icon`"
          class="icon-svg"
          :size="48"
        />
        <img
          v-else-if="card.customIconId && customIconUrl"
          :src="customIconUrl"
          :alt="`${card.heading} custom icon`"
          class="icon-image"
          loading="lazy"
        />
      </div>

      <!-- Text Content -->
      <div class="card-text">
        <div
          class="card-heading"
          :style="headingStyle"
          :contenteditable="!isPreviewMode"
          @blur="handleHeadingBlur"
          @keydown="handleTextKeydown"
          :aria-label="`Card heading: ${card.heading}`"
        >
          {{ card.heading }}
        </div>
        <div
          class="card-subtitle"
          :style="subtitleStyle"
          :contenteditable="!isPreviewMode"
          @blur="handleSubtitleBlur"
          @keydown="handleTextKeydown"
          :aria-label="`Card subtitle: ${card.subtitle}`"
        >
          {{ card.subtitle }}
        </div>
      </div>
    </div>

    <!-- Card Actions (only when selected and not in preview) -->
    <CardActions
      v-if="isSelected && !isPreviewMode"
      :card-id="card.id"
      @delete="handleDelete"
      @duplicate="handleDuplicate"
    />

    <!-- Text Formatting Toolbar (only when selected and not in preview) -->
    <TextFormattingToolbar
      v-if="isSelected && !isPreviewMode && showFormattingToolbar"
      v-model="showFormattingToolbar"
      :card-id="card.id"
      :formatting="card.textFormatting"
      :position="formattingToolbarPosition"
      @apply-formatting="handleApplyFormatting"
    />
  </div>
</template>

<script setup lang="ts">
import type { Card, StyleSettings, TextFormatting, CustomIcon } from '~/types'
import CardActions from '~/components/CardActions.vue'
import TextFormattingToolbar from '~/components/TextFormattingToolbar.vue'
import { useIconsStore } from '~/stores/icons'
import { useChartStore } from '~/stores/chart'
import { migrateIconName } from '~/utils/migrateIcons'

interface Props {
  card: Card
  isSelected: boolean
  isPreviewMode: boolean
  styleSettings: StyleSettings
  customIcons?: CustomIcon[]
}

const props = withDefaults(defineProps<Props>(), {
  customIcons: () => [],
})

const emit = defineEmits<{
  'update': [cardId: string, updates: Partial<Card>]
  'delete': [cardId: string]
  'duplicate': [cardId: string]
  'select': [cardId: string]
  'icon-click': [cardId: string]
}>()

const chartStore = useChartStore()

// Local state
const showFormattingToolbar = ref(false)
const formattingToolbarPosition = ref({ x: 0, y: 0 })

// Computed
const cardClasses = computed(() => ({
  'is-selected': props.isSelected,
  'is-preview-mode': props.isPreviewMode,
}))

const cardStyle = computed(() => {
  const theme = props.styleSettings.theme
  const colors = getThemeColors(theme)
  
  return {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    fontFamily: props.styleSettings.fontFamily,
  }
})

const headingStyle = computed(() => {
  const formatting = props.card.textFormatting
  return {
    fontWeight: formatting.bold ? '700' : '600',
    fontStyle: formatting.italic ? 'italic' : 'normal',
    textDecoration: formatting.underline ? 'underline' : 'none',
    color: formatting.color,
    backgroundColor: formatting.backgroundColor || 'transparent',
    fontSize: `${formatting.fontSize}px`,
    textAlign: formatting.alignment,
    lineHeight: formatting.lineHeight,
  }
})

const subtitleStyle = computed(() => {
  const formatting = props.card.textFormatting
  return {
    fontWeight: '500',
    fontStyle: formatting.italic ? 'italic' : 'normal',
    textDecoration: formatting.underline ? 'underline' : 'none',
    color: formatting.color,
    backgroundColor: formatting.backgroundColor || 'transparent',
    fontSize: `${formatting.fontSize * 0.85}px`,
    textAlign: formatting.alignment,
    lineHeight: formatting.lineHeight,
  }
})

// Methods
function isIconifyIcon(iconId: string): boolean {
  return migrateIconName(iconId).includes(':')
}

function getMigratedIconName(iconId: string): string {
  return migrateIconName(iconId)
}

const customIconUrl = computed(() => {
  if (!props.card.customIconId) return null
  const customIcon = props.customIcons.find((i: CustomIcon) => i.id === props.card.customIconId)
  return customIcon?.thumbnailUrl || null
})

function getThemeColors(theme: string) {
  // Default to neutral theme colors
  return {
    cardBackground: '#ffffff',
    border: '#e5e7eb',
  }
}

function handleHeadingBlur(event: FocusEvent) {
  const target = event.target as HTMLElement
  const newHeading = target.textContent?.trim() || ''
  if (newHeading !== props.card.heading) {
    emit('update', props.card.id, { heading: newHeading })
  }
}

function handleSubtitleBlur(event: FocusEvent) {
  const target = event.target as HTMLElement
  const newSubtitle = target.textContent?.trim() || ''
  if (newSubtitle !== props.card.subtitle) {
    emit('update', props.card.id, { subtitle: newSubtitle })
  }
}

function handleTextKeydown(event: KeyboardEvent) {
  // Allow Enter to blur the editable element
  if (event.key === 'Enter') {
    event.preventDefault()
    ;(event.target as HTMLElement).blur()
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Handle keyboard navigation
  if (event.key === 'Delete' || event.key === 'Backspace') {
    // Only delete if not editing text
    const target = event.target as HTMLElement
    if (!target.isContentEditable) {
      handleDelete()
    }
  } else if (event.key === 'Escape') {
    showFormattingToolbar.value = false
  } else if (event.key === 'f' || event.key === 'F') {
    // Show formatting toolbar when 'f' is pressed
    if (props.isSelected && !props.isPreviewMode) {
      showFormattingToolbar.value = !showFormattingToolbar.value
      // Position toolbar near the card
      const cardElement = event.currentTarget as HTMLElement
      const rect = cardElement.getBoundingClientRect()
      formattingToolbarPosition.value = {
        x: rect.left,
        y: rect.bottom + 8,
      }
    }
  }
}

function handleDelete() {
  emit('delete', props.card.id)
}

function handleDuplicate() {
  emit('duplicate', props.card.id)
}

function handleIconClick(event: Event) {
  event.stopPropagation() // Prevent card selection
  if (!props.isPreviewMode) {
    emit('icon-click', props.card.id)
  }
}

function handleApplyFormatting(formatting: Partial<TextFormatting>) {
  emit('update', props.card.id, {
    textFormatting: { ...props.card.textFormatting, ...formatting },
  })
}

// Watch for selection changes to show/hide formatting toolbar
watch(() => props.isSelected, (isSelected) => {
  if (isSelected) {
    // Auto-show formatting toolbar after a short delay
    setTimeout(() => {
      if (props.isSelected) {
        showFormattingToolbar.value = true
      }
    }, 300)
  } else {
    showFormattingToolbar.value = false
  }
})
</script>

<style scoped>
.editor-card {
  position: relative;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  background: #ffffff;
  transition: all 0.2s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  outline: none;
}

.editor-card:hover:not(.is-preview-mode) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.editor-card.is-selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editor-card.is-preview-mode {
  cursor: default;
}

.editor-card:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-clickable {
  cursor: pointer;
  border-radius: 8px;
  padding: 4px;
  transition: all 0.2s ease;
}

.icon-clickable:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: scale(1.05);
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.card-heading {
  font-size: 12pt;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
  word-break: break-word;
  min-height: 1.3em;
}

.card-heading:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
}

.card-subtitle {
  font-size: 10pt;
  font-weight: 500;
  color: #4b5563;
  line-height: 1.2;
  word-break: break-word;
  min-height: 1.2em;
}

.card-subtitle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .editor-card,
  .editor-card:hover:not(.is-preview-mode) {
    transition: none;
    transform: none;
  }
}

/* Print styles */
@media print {
  .editor-card {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
  
  .editor-card.is-selected {
    border-color: #e5e7eb;
    box-shadow: none;
  }
}
</style>
