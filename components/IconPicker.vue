<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print flex flex-col">
    <!-- Header -->
    <div class="p-3 sm:p-4 border-b border-slate-100">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search icons…"
            class="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 w-11 min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- Upload custom SVG -->
        <button
          type="button"
          @click="triggerUpload"
          :disabled="isUploading"
          class="shrink-0 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
          title="Upload a custom SVG icon"
          aria-label="Upload a custom SVG icon"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span class="hidden sm:inline">Upload</span>
        </button>
      </div>

      <!-- Hidden file input — triggered programmatically by the Upload button -->
      <input
        ref="fileInputRef"
        type="file"
        accept=".svg,image/svg+xml"
        class="hidden"
        @change="onFileSelected"
      />

      <!-- Upload validation feedback -->
      <p
        v-if="uploadError"
        role="alert"
        class="mt-2 text-xs font-medium text-red-600"
      >
        {{ uploadError }}
      </p>
    </div>

    <!-- Mobile: tabs collapse to a dropdown -->
    <select
      v-if="!searchQuery"
      v-model="activeTabId"
      class="sm:hidden w-[calc(100%-1.5rem)] mx-3 my-2 min-h-[44px] text-sm font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-slate-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-400"
      aria-label="Icon categories"
    >
      <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
        {{ tab.label }} ({{ tab.count }})
      </option>
    </select>

    <!-- Desktop: horizontal scrolling chip row -->
    <div
      v-if="!searchQuery"
      class="hidden sm:flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide touch-scroll-x border-b border-slate-100"
      role="tablist"
      aria-label="Icon categories"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTabId = tab.id"
        :class="[
          'inline-flex items-center gap-1.5 whitespace-nowrap min-h-[44px] px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
          activeTabId === tab.id
            ? 'bg-primary-500 text-white shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800',
        ]"
        :aria-selected="activeTabId === tab.id"
        role="tab"
      >
        <span>{{ tab.label }}</span>
        <!-- Count badge -->
        <span
          class="inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 text-[10px] font-bold rounded-full tabular-nums"
          :class="activeTabId === tab.id
            ? 'bg-white/25 text-white'
            : 'bg-white text-slate-500'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Icon grid -->
    <div
      class="overflow-y-auto max-h-[420px] sm:max-h-[520px] p-3 sm:p-4 touch-scroll-y"
      :role="searchQuery ? 'region' : 'tabpanel'"
      aria-label="Icon results"
    >
      <div v-if="filteredIcons.length === 0" class="text-center py-10">
        <template v-if="isRecentsTab && recentIcons.length === 0">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <p class="text-slate-500 text-sm font-medium">No recently used icons yet</p>
          <p class="mt-1 text-xs text-slate-400">
            Select an icon to add it here for quick access next time.
          </p>
        </template>
        <template v-else-if="isFavoritesTab && prefsStore.favoriteIds.length === 0">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300">
              <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/>
            </svg>
          </div>
          <p class="text-slate-500 text-sm font-medium">Star icons to save them here</p>
          <p class="mt-1 text-xs text-slate-400">
            Click the star on any icon to add it to your favourites for quick access.
          </p>
        </template>
        <template v-else-if="isCustomTab && prefsStore.customIcons.length === 0">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p class="text-slate-500 text-sm font-medium">No custom icons yet</p>
          <p class="mt-1 text-xs text-slate-400">
            Click “Upload” to add your own SVG icons (up to 512×512 px, 100 KB each).
          </p>
        </template>
        <template v-else-if="searchQuery">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <path d="M8 11h6"/>
            </svg>
          </div>
          <p class="text-slate-500 text-sm font-medium">
            No icons match "{{ searchQuery }}"
          </p>
          <p class="mt-1 text-xs text-slate-400">
            Try a different search term or browse by category.
          </p>
          <button
            @click="searchQuery = ''"
            class="mt-3 inline-flex items-center min-h-[44px] px-4 text-sm font-semibold text-primary-600 hover:text-primary-700 rounded-lg"
          >
            Clear search
          </button>
        </template>
        <template v-else>
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <path d="M8 11h6"/>
            </svg>
          </div>
          <p class="text-slate-500 text-sm font-medium">No icons in this category</p>
        </template>
      </div>
      <div v-else class="grid grid-cols-4 sm:grid-cols-5 gap-2">
        <button
          v-for="icon in filteredIcons"
          :key="icon.id"
          draggable="true"
          @click="selectIcon(icon)"
          @dragstart="onIconDragStart(icon, $event)"
          :class="[
            'group relative flex flex-col items-center gap-1.5 p-2 pt-6 rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1',
            selectedIcon === icon.id
              ? 'border-primary-500 bg-primary-50 shadow-sm'
              : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
          ]"
          :title="icon.alt"
          :aria-label="`Select ${icon.alt}`"
          :aria-pressed="selectedIcon === icon.id"
        >
          <!-- Favorite star toggle — built-in icons only (click does not select) -->
          <span
            v-if="!icon.isCustom"
            draggable="false"
            @click.stop="prefsStore.toggleFavorite(icon.id)"
            class="absolute top-1 right-1 inline-flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center cursor-pointer text-base leading-none transition-colors select-none"
            :class="prefsStore.isFavorite(icon.id) ? 'text-yellow-500' : 'text-slate-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'"
            role="button"
            tabindex="0"
            :aria-label="prefsStore.isFavorite(icon.id) ? `Remove ${icon.alt} from favourites` : `Add ${icon.alt} to favourites`"
            @keydown.enter.prevent="prefsStore.toggleFavorite(icon.id)"
            @keydown.space.prevent="prefsStore.toggleFavorite(icon.id)"
          >
            {{ prefsStore.isFavorite(icon.id) ? '★' : '☆' }}
          </span>
          <!-- Delete button — custom icons only (click does not select) -->
          <span
            v-else
            draggable="false"
            @click.stop="deleteCustomIcon(icon.id, icon.alt)"
            class="absolute top-1 right-1 inline-flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center cursor-pointer rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors select-none"
            role="button"
            tabindex="0"
            :aria-label="`Delete custom icon ${icon.alt}`"
            title="Delete this custom icon"
            @keydown.enter.prevent="deleteCustomIcon(icon.id, icon.alt)"
            @keydown.space.prevent="deleteCustomIcon(icon.id, icon.alt)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
            </svg>
          </span>
          <!-- Info button — opens the detail popover (click does not select) -->
          <span
            draggable="false"
            @click.stop="openDetail(icon, $event)"
            @keydown.enter.prevent="openDetail(icon, $event)"
            @keydown.space.prevent="openDetail(icon, $event)"
            class="absolute top-1 right-9 inline-flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center rounded-full cursor-pointer select-none transition-colors"
            :class="detailIcon?.id === icon.id
              ? 'text-primary-600 bg-primary-100'
              : 'text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-slate-700 hover:bg-slate-200/60'"
            role="button"
            tabindex="0"
            :aria-label="`More information about ${icon.alt}`"
            :aria-expanded="detailIcon?.id === icon.id"
            title="More information"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </span>
          <img
            :src="icon.src"
            :alt="icon.alt"
            class="w-10 h-10 sm:w-11 sm:h-11 object-contain pointer-events-none"
            loading="lazy"
          />
          <span class="text-[10px] sm:text-xs text-slate-600 truncate max-w-full leading-tight">{{ icon.alt }}</span>
        </button>
      </div>
    </div>

    <!-- Footer hint -->
    <div class="px-3 sm:px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
      {{ filteredIcons.length }} icon{{ filteredIcons.length === 1 ? '' : 's' }} shown
    </div>

    <!-- Floating detail popover for the currently-inspected icon. Lives here
         rather than in chart.vue so the picker owns all icon interactions. -->
    <IconDetail
      :open="!!detailIcon"
      :icon="detailDetailIcon"
      :category-label="detailCategoryLabel"
      :is-favorite="detailIsFavorite"
      :anchor-rect="detailAnchorRect"
      @close="closeDetail"
      @assign="onDetailAssign"
      @toggle-favorite="onDetailToggleFavorite"
      @view-similar="onDetailViewSimilar"
    />
  </div>
</template>

<script setup lang="ts">
import { iconUrl } from '~/utils/iconLoader'
import { validateSvgFile } from '~/utils/iconValidator'
import type { ManifestIcon, IconCategory } from '~/types/icons'
import { useIconPreferencesStore } from '~/stores/iconPreferences'

const props = defineProps<{
  categories: IconCategory[]
  selectedIcon: string | null
}>()

const emit = defineEmits<{
  select: [icon: { id: string; filename: string; alt: string; category: string }]
}>()

const prefsStore = useIconPreferencesStore()
const searchQuery = ref('')

/** Virtual tab id for the Favorites tab (not a real category). */
const FAVORITES_TAB_ID = '__favorites__'
/** Virtual tab id for the Recently Used tab (not a real category). */
const RECENTS_TAB_ID = '__recents__'
/** Virtual tab id for the user-uploaded Custom icons tab. */
const CUSTOM_TAB_ID = '__custom__'

/**
 * A picker tab — either a virtual tab (Recents/Favorites/Custom) or a
 * real category, with an item count for display badges.
 */
interface PickerTab {
  id: string
  label: string
  /** Number of icons reachable from this tab, shown as a badge. */
  count: number
}

/**
 * Ordered list of all tabs: Recently Used first (most useful for returning
 * users), then regular categories, then Favorites, then Custom uploads last.
 *
 * Counts are reactive so badges update as the user stars icons, uploads
 * custom SVGs, or selects icons (which feeds the Recents list).
 */
const tabs = computed<PickerTab[]>(() => [
  { id: RECENTS_TAB_ID, label: 'Recently Used', count: prefsStore.recentlyUsedIds.length },
  ...props.categories.map<PickerTab>((c) => ({
    id: c.id,
    label: c.label,
    count: c.icons.length,
  })),
  { id: FAVORITES_TAB_ID, label: 'Favorites', count: prefsStore.favoriteIds.length },
  { id: CUSTOM_TAB_ID, label: 'Custom', count: prefsStore.customIcons.length },
])

const activeTabId = ref(props.categories[0]?.id ?? RECENTS_TAB_ID)

/** True when the active tab is the Favorites virtual tab. */
const isFavoritesTab = computed(() => activeTabId.value === FAVORITES_TAB_ID)

/** True when the active tab is the Recently Used virtual tab. */
const isRecentsTab = computed(() => activeTabId.value === RECENTS_TAB_ID)

/** True when the active tab is the Custom-uploads virtual tab. */
const isCustomTab = computed(() => activeTabId.value === CUSTOM_TAB_ID)

/** Active category object (undefined for virtual tabs). */
const activeCategory = computed(() =>
  props.categories.find((c) => c.id === activeTabId.value)
)

/**
 * Lookup map from icon id -> icon object, built once per categories change.
 * Used to resolve favorite/recent ids back to full icon objects without
 * re-scanning every category on each render.
 */
const iconById = computed(() => {
  const map = new Map<string, ManifestIcon>()
  for (const cat of props.categories) {
    for (const icon of cat.icons) {
      map.set(icon.id, icon)
    }
  }
  return map
})

/**
 * Lookup map from icon id -> owning category id. Pre-computed so the grid can
 * emit the correct category without scanning on every selection.
 */
const categoryByIconId = computed(() => {
  const map = new Map<string, string>()
  for (const cat of props.categories) {
    for (const icon of cat.icons) {
      map.set(icon.id, cat.id)
    }
  }
  return map
})

/**
 * Recently used icons resolved to full objects, preserving the store's
 * most-recent-first ordering. Unknown ids (e.g. from a stale entry) are
 * silently skipped.
 */
const recentIcons = computed(() => {
  const out: ManifestIcon[] = []
  for (const id of prefsStore.recentlyUsedIds) {
    const icon = iconById.value.get(id)
    if (icon) out.push(icon)
  }
  return out
})

/**
 * Unified shape for any icon rendered in the picker grid. Covers both built-in
 * manifest icons and user-uploaded custom icons so a single grid template can
 * render either kind and emit a consistent select payload.
 */
interface PickableIcon {
  /** Stable id (built-in manifest id, or generated id for custom icons). */
  id: string
  /** Resolved image source: a remote URL for built-in, a data URL for custom. */
  src: string
  /** Display name / alt text. */
  alt: string
  /** Search keywords (custom icons reuse their name). */
  keywords: string[]
  /** True for user-uploaded icons (controls star vs. trash affordance). */
  isCustom: boolean
  /** Value emitted as `filename` when selected (real filename or data URL). */
  filename: string
  /** Category id emitted when selected (built-in category, or 'custom'). */
  category: string
}

/** Convert a built-in manifest icon into a grid-ready pickable icon. */
function manifestToPickable(icon: ManifestIcon): PickableIcon {
  return {
    id: icon.id,
    src: iconUrl(icon.filename),
    alt: icon.alt,
    keywords: icon.keywords,
    isCustom: false,
    filename: icon.filename,
    category: categoryByIconId.value.get(icon.id) ?? '',
  }
}

/** Convert a user-uploaded custom icon into a grid-ready pickable icon. */
function customToPickable(c: { id: string; name: string; data: string }): PickableIcon {
  return {
    id: c.id,
    // Custom icons store a base64 data URL — use it directly as the src.
    src: c.data,
    alt: c.name,
    keywords: [c.name],
    isCustom: true,
    filename: c.data,
    category: 'custom',
  }
}

const filteredIcons = computed<PickableIcon[]>(() => {
  const q = searchQuery.value.toLowerCase().trim()

  // ── Search mode: query spans ALL icon sources (built-in + custom) so the
  //    user gets the same hit set regardless of which tab was active. The
  //    tab strip is hidden while a query is present, so a tab-scoped search
  //    wouldn't make sense anyway.
  if (q) {
    const matches = (icon: PickableIcon): boolean =>
      icon.alt.toLowerCase().includes(q) ||
      icon.keywords.some((k) => k.toLowerCase().includes(q))

    const results: PickableIcon[] = []
    // Built-in icons from every category.
    for (const cat of props.categories) {
      for (const icon of cat.icons) {
        results.push(manifestToPickable(icon))
      }
    }
    // User-uploaded custom icons.
    for (const c of prefsStore.customIcons) {
      results.push(customToPickable(c))
    }
    return results.filter(matches)
  }

  // ── Browse mode (no query): show only the active tab's icons. ──

  // Custom uploads tab
  if (isCustomTab.value) {
    return prefsStore.customIcons.map(customToPickable)
  }

  // Recently used tab
  if (isRecentsTab.value) {
    return recentIcons.value.map(manifestToPickable)
  }

  // Favorites tab
  if (isFavoritesTab.value) {
    const favorites: PickableIcon[] = []
    for (const cat of props.categories) {
      for (const icon of cat.icons) {
        if (prefsStore.isFavorite(icon.id)) {
          favorites.push(manifestToPickable(icon))
        }
      }
    }
    return favorites
  }

  // Regular category tab
  return (activeCategory.value?.icons ?? []).map(manifestToPickable)
})

function selectIcon(icon: PickableIcon) {
  emit('select', {
    id: icon.id,
    filename: icon.filename,
    alt: icon.alt,
    category: icon.category,
  })
}

/**
 * Begin dragging an icon onto the canvas.
 *
 * Two data types are written to `dataTransfer`:
 * - `text/icon-id`  — just the id, used by drop targets to *detect* an icon
 *   drag via `dataTransfer.types` during `dragover` (payload isn't readable
 *   mid-drag, but the type list is).
 * - `text/icon-data` — the full `{ id, filename, alt, category }` payload as
 *   JSON, read on `drop` to assign the icon in one step without a lookup.
 */
function onIconDragStart(icon: PickableIcon, e: DragEvent) {
  if (!e.dataTransfer) return
  e.dataTransfer.effectAllowed = 'copy'
  e.dataTransfer.setData('text/icon-id', icon.id)
  e.dataTransfer.setData(
    'text/icon-data',
    JSON.stringify({
      id: icon.id,
      filename: icon.filename,
      alt: icon.alt,
      category: icon.category,
    }),
  )
}

// ── Icon detail popover ────────────────────────────────────────────────────

/**
 * Currently-inspected icon (drives the floating IconDetail popover). `null`
 * when the popover is closed. Only built-in and custom icons the picker can
 * resolve into a {@link PickableIcon} are inspectable.
 */
const detailIcon = ref<PickableIcon | null>(null)

/**
 * Anchor rect of the trigger element captured at open time. Passed straight
 * to IconDetail so it can position itself without re-measuring.
 */
const detailAnchorRect = ref<DOMRect | null>(null)

/**
 * Projection of {@link detailIcon} into the smaller `DetailIcon` shape the
 * IconDetail component consumes (decouples it from the picker's internal
 * type).
 */
const detailDetailIcon = computed(() => {
  const icon = detailIcon.value
  if (!icon) return null
  return {
    id: icon.id,
    src: icon.src,
    alt: icon.alt,
    keywords: icon.keywords,
    isCustom: icon.isCustom,
  }
})

/** True when the inspected icon is in the user's favourites. */
const detailIsFavorite = computed(() =>
  detailIcon.value ? prefsStore.isFavorite(detailIcon.value.id) : false,
)

/**
 * Human-readable category label for the inspected icon. Built-in icons map
 * to their manifest category label; custom uploads get an explicit string.
 */
const detailCategoryLabel = computed(() => {
  const icon = detailIcon.value
  if (!icon) return ''
  if (icon.isCustom) return 'Custom upload'
  const cat = props.categories.find((c) => c.id === icon.category)
  return cat?.label ?? 'Icon'
})

/**
 * Open the detail popover for an icon. Captures the trigger element's
 * viewport rect so IconDetail can position itself alongside it.
 */
function openDetail(icon: PickableIcon, event: Event) {
  const target = event.currentTarget
  if (target instanceof HTMLElement) {
    detailAnchorRect.value = target.getBoundingClientRect()
  } else {
    detailAnchorRect.value = null
  }
  detailIcon.value = icon
}

/** Close the detail popover and clear the anchor rect. */
function closeDetail() {
  detailIcon.value = null
  detailAnchorRect.value = null
}

/** "Assign to Slot" — same handler as clicking the card itself, then close. */
function onDetailAssign() {
  const icon = detailIcon.value
  if (!icon) return
  selectIcon(icon)
  closeDetail()
}

/** Favourite toggle from the popover — built-in icons only. */
function onDetailToggleFavorite() {
  const icon = detailIcon.value
  if (!icon || icon.isCustom) return
  prefsStore.toggleFavorite(icon.id)
}

/**
 * "View Similar" — switch the picker to the inspected icon's owning tab so
 * the user sees sibling icons. Always clears any active search query so the
 * full set is visible, then dismisses the popover.
 */
function onDetailViewSimilar() {
  const icon = detailIcon.value
  if (!icon) return
  if (icon.isCustom) {
    activeTabId.value = CUSTOM_TAB_ID
  } else if (props.categories.some((c) => c.id === icon.category)) {
    activeTabId.value = icon.category
  }
  searchQuery.value = ''
  closeDetail()
}

// ── Custom icon upload ─────────────────────────────────────────────────────

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadError = ref('')
const isUploading = ref(false)

/** Open the native file picker for SVG uploads. */
function triggerUpload() {
  uploadError.value = ''
  fileInputRef.value?.click()
}

/**
 * Handle a file chosen via the hidden input: validate it, then add it to the
 * store. Validation errors are surfaced inline beneath the search bar.
 */
async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  // Reset the input so selecting the same file again re-triggers `change`.
  target.value = ''
  if (!file) return

  isUploading.value = true
  uploadError.value = ''

  const result = await validateSvgFile(file)
  if (!result.valid || !result.data) {
    uploadError.value = result.error ?? 'That file could not be used.'
    isUploading.value = false
    return
  }

  // Derive a friendly name from the filename (e.g. "my-icon.svg" → "my icon").
  const name =
    file.name.replace(/\.svg$/i, '').replace(/[-_]+/g, ' ').trim() ||
    'Custom icon'
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const added = prefsStore.addCustomIcon({ id, name, data: result.data })
  if (!added.success) {
    uploadError.value = added.error ?? 'Could not add the icon.'
  } else {
    // Reveal the newly added icon to the user.
    activeTabId.value = CUSTOM_TAB_ID
    searchQuery.value = ''
  }
  isUploading.value = false
}

/** Delete a custom icon after a lightweight confirmation. */
function deleteCustomIcon(id: string, name: string) {
  if (
    window.confirm(`Delete the custom icon “${name}”? This cannot be undone.`)
  ) {
    prefsStore.removeCustomIcon(id)
  }
}

watch(
  () => props.categories,
  (cats) => {
    if (cats?.length) {
      const currentTabStillValid =
        cats.some((c) => c.id === activeTabId.value) ||
        activeTabId.value === FAVORITES_TAB_ID ||
        activeTabId.value === RECENTS_TAB_ID ||
        activeTabId.value === CUSTOM_TAB_ID
      const firstCat = cats[0]
      if (!currentTabStillValid && firstCat) {
        activeTabId.value = firstCat.id
      }
    }
  },
  { immediate: true }
)

// When the search is cleared while no valid tab is active, fall back to
// the first category.
watch(searchQuery, (q) => {
  if (!q && !activeTabId.value && props.categories[0]) {
    activeTabId.value = props.categories[0].id
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
