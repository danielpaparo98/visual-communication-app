<template>
  <div>
    <HeroSection />
    <HowItWorks />

    <!-- ── My Charts Gallery ── -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24" aria-label="My Charts">
      <!-- Header row -->
      <div class="flex items-center justify-between gap-4 mb-8">
        <h2 class="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          My Charts
        </h2>
        <button
          v-if="manager.charts.length > 0"
          :disabled="!manager.canCreateMore"
          class="btn-primary !px-5 !py-2.5 !text-sm shrink-0"
          @click="createNewChart"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          New Chart
        </button>
      </div>

      <!-- Near-limit warning -->
      <div
        v-if="manager.charts.length >= 18 && manager.charts.length < 20"
        class="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        role="alert"
      >
        <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          You have {{ manager.charts.length }} charts. The maximum is 20.
          Consider removing charts you no longer need.
        </p>
      </div>

      <!-- At-limit warning -->
      <div
        v-if="manager.charts.length >= 20"
        class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        role="alert"
      >
        <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          You've reached the maximum of 20 charts. Delete one before creating another.
        </p>
      </div>

      <!-- Has charts → card grid -->
      <div
        v-if="manager.charts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="chart in manager.chartList"
          :key="chart.id"
          class="group relative flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300"
        >
          <!-- Chart info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-heading font-bold text-lg text-slate-800 truncate">
              {{ chart.title }}
            </h3>
            <div class="mt-2 flex items-center gap-3 text-sm text-slate-500">
              <span class="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                </svg>
                {{ chart.slotCount }} / 20 icons
              </span>
              <span class="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {{ timeAgo(chart.updatedAt) }}
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="mt-4 flex items-center gap-2">
            <button
              class="flex-1 btn-primary !px-3 !py-2 !text-sm"
              @click="openChart(chart.id)"
            >
              Open
            </button>
            <button
              class="btn-secondary !px-3 !py-2 !text-sm"
              aria-label="Duplicate chart"
              @click="duplicateChart(chart.id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
            <button
              class="!px-3 !py-2 !text-sm inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-heading font-bold"
              aria-label="Delete chart"
              @click="confirmDeleteId = chart.id"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center"
      >
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
        <h3 class="font-heading font-bold text-xl text-slate-700 mb-2">
          No charts yet
        </h3>
        <p class="text-slate-500 max-w-sm mx-auto mb-6">
          Create your first communication board! Pick icons, add labels, and print — no sign-up required.
        </p>
        <button class="btn-primary" @click="createNewChart">
          Create Your First Chart
        </button>
      </div>
    </section>

    <!-- ── Delete Confirmation Modal ── -->
    <Teleport to="body">
      <div
        v-if="confirmDeleteId"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="confirmDeleteId = null" />

        <!-- Dialog -->
        <div class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h3 id="delete-title" class="font-heading font-bold text-lg text-slate-800 mb-2">
            Delete chart?
          </h3>
          <p class="text-sm text-slate-600 mb-6">
            This will permanently delete "{{ deletingChartTitle }}" and all its icons and labels. This action cannot be undone.
          </p>
          <div class="flex items-center justify-end gap-3">
            <button
              class="btn-secondary !px-4 !py-2 !text-sm"
              @click="confirmDeleteId = null"
            >
              Cancel
            </button>
            <button
              class="!px-4 !py-2 !text-sm inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-heading font-bold transition-all duration-200 shadow-sm hover:shadow-md"
              @click="handleDelete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useChartManagerStore } from '~/stores/chartManager'

const manager = useChartManagerStore()

const confirmDeleteId = ref<string | null>(null)

/** Title of the chart pending deletion — derived for the confirmation modal. */
const deletingChartTitle = computed(() => {
  const chart = manager.charts.find((c) => c.id === confirmDeleteId.value)
  return chart?.title ?? ''
})

/** Human-friendly relative time string. */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

async function createNewChart() {
  manager.createChart()
  await navigateTo('/chart')
}

async function openChart(id: string) {
  manager.setActiveChart(id)
  await navigateTo('/chart')
}

async function duplicateChart(id: string) {
  const newId = manager.duplicateChart(id)
  if (newId) {
    manager.setActiveChart(newId)
    await navigateTo('/chart')
  }
}

function handleDelete() {
  if (confirmDeleteId.value) {
    manager.deleteChart(confirmDeleteId.value)
    confirmDeleteId.value = null
  }
}

useHead({
  title: 'Free PECs Chart Generator',
  meta: [
    {
      name: 'description',
      content:
        'Create free, printable PECs communication charts. Pick from 400+ icons, add labels, and print. No sign-up required.',
    },
  ],
})
</script>
