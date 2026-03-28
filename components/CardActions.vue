<template>
  <div class="card-actions">
    <button
      class="action-button action-button-duplicate"
      @click="handleDuplicate"
      :aria-label="`Duplicate card ${cardId}`"
      title="Duplicate card"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
    
    <button
      class="action-button action-button-delete"
      @click="handleDelete"
      :aria-label="`Delete card ${cardId}`"
      title="Delete card"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  cardId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'delete': [cardId: string]
  'duplicate': [cardId: string]
}>()

function handleDelete() {
  emit('delete', props.cardId)
}

function handleDuplicate() {
  emit('duplicate', props.cardId)
}
</script>

<style scoped>
.card-actions {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
  z-index: 10;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  transform: scale(1.1);
}

.action-button-duplicate {
  background: white;
  color: #4b5563;
}

.action-button-duplicate:hover {
  background: #f3f4f6;
  color: #111827;
}

.action-button-delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-button-delete:hover {
  background: #fecaca;
  color: #b91c1c;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .action-button {
    transition: none;
  }
  
  .action-button:hover {
    transform: none;
  }
}
</style>
