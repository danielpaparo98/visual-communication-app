import { defineStore } from 'pinia'
import type { ManifestIcon } from '~/types/icons'

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Data for a user-uploaded custom icon.
 * Stored in localStorage alongside the built-in icon favorites.
 */
export interface CustomIconData {
  id: string
  /** Display name shown under the icon and used as the slot `alt`. */
  name: string
  /** Base64 data URL (`data:image/svg+xml;base64,…`) used directly as an `<img src>`. */
  data: string
  /** ISO timestamp of when the icon was added (newest last). */
  createdAt: string
}

/**
 * Input shape accepted by {@link useIconPreferencesStore.addCustomIcon}.
 * The store stamps `createdAt` itself, so callers only provide the essentials.
 */
export interface CustomIconInput {
  id: string
  name: string
  data: string
}

/** Outcome of an `addCustomIcon` call — communicates cap rejections cleanly. */
export interface CustomIconResult {
  success: boolean
  /** Human-readable reason when `success === false`. */
  error?: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  FAVORITES: 'ttc-icon-favorites',
  RECENTS: 'ttc-icon-recents',
  CUSTOM: 'ttc-custom-icons',
} as const

/** Maximum number of recently-used icons to track. */
const MAX_RECENTS = 20

/** Maximum number of user-uploaded custom icons kept in localStorage. */
const MAX_CUSTOM_ICONS = 20

// ── Helpers ────────────────────────────────────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (!import.meta.client) return
  localStorage.setItem(key, JSON.stringify(value))
}

// ── Store ──────────────────────────────────────────────────────────────────

/**
 * Pinia store managing icon-level user preferences.
 *
 * Handles three independent preference lists, all persisted to localStorage:
 * - **Favorites**: icons the user has starred for quick access
 * - **Recently used**: last 20 icons the user selected
 * - **Custom icons**: user-uploaded icon data
 *
 * Persistence is handled directly via localStorage reads/writes in each
 * action — no external persistence layer required since these are small
 * datasets that change infrequently.
 */
export const useIconPreferencesStore = defineStore('iconPreferences', () => {
  // ── State ──────────────────────────────────────────────────────────────

  /** IDs of icons the user has favorited. */
  const favoriteIds = ref<string[]>(
    loadFromStorage<string[]>(STORAGE_KEYS.FAVORITES, []),
  )

  /** IDs of icons the user has recently used (most recent first). */
  const recentlyUsedIds = ref<string[]>(
    loadFromStorage<string[]>(STORAGE_KEYS.RECENTS, []),
  )

  /** User-uploaded custom icons. */
  const customIcons = ref<CustomIconData[]>(
    loadFromStorage<CustomIconData[]>(STORAGE_KEYS.CUSTOM, []),
  )

  // ── Actions ────────────────────────────────────────────────────────────

  /**
   * Add or remove an icon from the favorites list.
   * Persists the updated list to localStorage.
   */
  function toggleFavorite(iconId: string): void {
    const idx = favoriteIds.value.indexOf(iconId)
    if (idx === -1) {
      favoriteIds.value.push(iconId)
    } else {
      favoriteIds.value.splice(idx, 1)
    }
    saveToStorage(STORAGE_KEYS.FAVORITES, favoriteIds.value)
  }

  /** Check whether a given icon is in the user's favorites. */
  function isFavorite(iconId: string): boolean {
    return favoriteIds.value.includes(iconId)
  }

  /**
   * Record an icon as recently used.
   *
   * Moves the icon to the front of the list (or inserts it at position 0
   * if it wasn't already present). The list is capped at {@link MAX_RECENTS}
   * entries, evicting the least-recently-used item from the end.
   */
  function trackRecent(iconId: string): void {
    const idx = recentlyUsedIds.value.indexOf(iconId)
    if (idx !== -1) {
      recentlyUsedIds.value.splice(idx, 1)
    }
    recentlyUsedIds.value.unshift(iconId)
    if (recentlyUsedIds.value.length > MAX_RECENTS) {
      recentlyUsedIds.value.pop()
    }
    saveToStorage(STORAGE_KEYS.RECENTS, recentlyUsedIds.value)
  }

  /**
   * Add a new user-uploaded custom icon and persist the list.
   *
   * Enforces the {@link MAX_CUSTOM_ICONS} cap, returning a failed result
   * (without mutating state) when the limit has been reached so the caller
   * can surface a message to the user.
   */
  function addCustomIcon(input: CustomIconInput): CustomIconResult {
    if (customIcons.value.length >= MAX_CUSTOM_ICONS) {
      return {
        success: false,
        error: `You can save up to ${MAX_CUSTOM_ICONS} custom icons. Remove one before adding another.`,
      }
    }
    customIcons.value.push({ ...input, createdAt: new Date().toISOString() })
    saveToStorage(STORAGE_KEYS.CUSTOM, customIcons.value)
    return { success: true }
  }

  /** Remove a custom icon by id and persist the updated list. */
  function removeCustomIcon(id: string): void {
    const idx = customIcons.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      customIcons.value.splice(idx, 1)
      saveToStorage(STORAGE_KEYS.CUSTOM, customIcons.value)
    }
  }

  return {
    // State
    favoriteIds,
    recentlyUsedIds,
    customIcons,
    // Actions
    toggleFavorite,
    isFavorite,
    trackRecent,
    addCustomIcon,
    removeCustomIcon,
  }
})
