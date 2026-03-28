/**
 * Icon Migration Helper
 * Maps old custom icon filenames to new icon names from the icon catalog
 */

import { getIconById } from './iconCatalog'

// Mapping from old custom icon filenames to new icon names
const ICON_MIGRATION_MAP: Record<string, string> = {
  // Disability icons
  'disability-001-house': 'tabler:home',
  'disability-002-parking': 'tabler:parking',
  'disability-003-sunglasses': 'tabler:device-mobile',
  'disability-004-disabled person': 'tabler:wheelchair',
  'disability-005-blind': 'tabler:blind',
  'disability-006-deaf': 'tabler:hearing',
  'disability-007-gas station': 'tabler:gas-station',
  'disability-008-smartwatch': 'tabler:device-watch',
  'disability-009-smartphone': 'tabler:device-mobile',
  'disability-010-medical app': 'tabler:stethoscope',
  'disability-011-disabled sign': 'tabler:accessible',
  'disability-012-dumb': 'tabler:brain',
  'disability-013-blind': 'tabler:blind',
  'disability-014-Walking aid': 'tabler:crutch',
  'disability-015-injured': 'tabler:bandage',
  'disability-016-crippled': 'tabler:wheelchair',
  'disability-017-disabled person': 'tabler:wheelchair',
  'disability-018-disabled person': 'tabler:wheelchair',
  'disability-019-injured': 'tabler:bandage',
  'disability-020-walking stick': 'tabler:walking-stick',
  'disability-021-hospital bed': 'tabler:bed',
  'disability-022-wheelchair': 'tabler:wheelchair',
  'disability-023-medical assistance': 'tabler:stethoscope',
  'disability-024-prosthetic': 'tabler:device',
  'disability-025-crutch': 'tabler:crutch',
  'disability-026-walking stick': 'tabler:walking-stick',
  'disability-027-Walking aid': 'tabler:crutch',
  'disability-028-prosthetic': 'tabler:device',
  'disability-029-car': 'tabler:car',
  'disability-030-wheelchair': 'tabler:wheelchair',
  'disability-031-wheelchair': 'tabler:wheelchair',
  'disability-032-braille': 'tabler:braille',
  'disability-033-wheelchair': 'tabler:wheelchair',
  'disability-034-audio book': 'tabler:book',
  'disability-036-prosthetic': 'tabler:device',
  'disability-037-prosthetic': 'tabler:device',
  'disability-038-sign language': 'tabler:sign-language',
  'disability-039-stairs': 'tabler:stairs',
  'disability-040-guide dog': 'tabler:dog',
  'disability-041-hospital': 'tabler:hospital',
  'disability-042-medical': 'tabler:stethoscope',
  'disability-043-accessibility': 'tabler:accessible',
  'disability-044-ramp': 'tabler:ramp',
  'disability-045-guide dog': 'tabler:dog',
  'disability-046-hospital': 'tabler:hospital',
  'disability-047-medical': 'tabler:first-aid-kit',
  'disability-048-emergency': 'tabler:ambulance',
  'disability-049-assistance': 'tabler:handshake',
  'disability-050-lift': 'tabler:elevator',

  // Family icons
  'family-001-dad': 'tabler:user',
  'family-002-mom': 'tabler:user',
  'family-003-son': 'tabler:user',
  'family-004-daughter': 'tabler:user',
  'family-005-baby': 'tabler:baby',
  'family-006-grandpa': 'tabler:user',
  'family-007-grandma': 'tabler:user',
  'family-008-uncle': 'tabler:user',
  'family-009-aunt': 'tabler:user',
  'family-010-cousin': 'tabler:user',
  'family-011-brother': 'tabler:user',
  'family-012-family': 'tabler:users',
  'family-013-home': 'tabler:home',
  'family-014-house': 'tabler:home',
  'family-015-love': 'tabler:heart',
  'family-016-heart': 'tabler:heart',
  'family-017-care': 'tabler:heart-handshake',
  'family-018-support': 'tabler:handshake',
  'family-019-together': 'tabler:users',
  'family-020-group': 'tabler:users',
  'family-021-people': 'tabler:users',
  'family-022-couple': 'tabler:heart-handshake',
  'family-023-marriage': 'tabler:heart',
  'family-024-wedding': 'tabler:heart',
  'family-025-celebration': 'tabler:gift',
  'family-026-party': 'tabler:confetti',
  'family-027-birthday': 'tabler:cake',
  'family-028-baby': 'tabler:baby-carriage',
  'family-029-child': 'tabler:user',
  'family-030-kids': 'tabler:users',
  'family-031-parents': 'tabler:users',
  'family-032-grandparents': 'tabler:users',
  'family-033-relatives': 'tabler:users',
  'family-034-friends': 'tabler:users',
  'family-035-community': 'tabler:users',
  'family-036-neighborhood': 'tabler:building',
  'family-037-village': 'tabler:home',
  'family-038-town': 'tabler:building',
  'family-039-city': 'tabler:building',
  'family-040-country': 'tabler:globe',

  // Alphabet icons
  'alphabet-001-A': 'emoji:🅰️',
  'alphabet-002-b': 'emoji:🅱️',
  'alphabet-003-c': 'emoji:🆎',
  'alphabet-004-d': 'emoji:🆎',
  'alphabet-005-e': 'emoji:🅴',
  'alphabet-006-f': 'emoji:🆎',
  'alphabet-007-g': 'emoji:🆎',
  'alphabet-008-h': 'emoji:🆎',
  'alphabet-009-I': 'emoji:🅸',
  'alphabet-010-j': 'emoji:🆎',
  'alphabet-011-k': 'emoji:🆎',
  'alphabet-012-l': 'emoji:🆎',
  'alphabet-013-m': 'emoji:🆎',
  'alphabet-014-n': 'emoji:🆎',
  'alphabet-015-o': 'emoji:🅾️',
  'alphabet-016-p': 'emoji:🅿️',
  'alphabet-017-q': 'emoji:🆎',
  'alphabet-018-r': 'emoji:🆎',
  'alphabet-019-s': 'emoji:🆎',
  'alphabet-020-t': 'emoji:🆎',
  'alphabet-021-u': 'emoji:🆎',
  'alphabet-022-v': 'emoji:🆎',
  'alphabet-023-w': 'emoji:🆎',
  'alphabet-024-x': 'emoji:🆎',
  'alphabet-025-y': 'emoji:🆎',
  'alphabet-026-z': 'emoji:🆎',
  'alphabet-027-0': 'emoji:0️⃣',
  'alphabet-028-1': 'emoji:1️⃣',
  'alphabet-029-2': 'emoji:2️⃣',
  'alphabet-030-3': 'emoji:3️⃣',
  'alphabet-031-4': 'emoji:4️⃣',
  'alphabet-032-5': 'emoji:5️⃣',
  'alphabet-033-6': 'emoji:6️⃣',
  'alphabet-034-7': 'emoji:7️⃣',
  'alphabet-035-8': 'emoji:8️⃣',
  'alphabet-036-9': 'emoji:9️⃣',

  // Health icons (if any existed)
  'health-001-heart': 'lucide:heart',
  'health-002-lungs': 'lucide:lungs',
  'health-003-brain': 'lucide:brain',
  'health-004-bone': 'lucide:bone',
  'health-005-eye': 'lucide:eye',
  'health-006-ear': 'lucide:ear',
  'health-007-tooth': 'lucide:tooth',
  'health-008-hand': 'lucide:hand',
  'health-009-foot': 'lucide:footprints',
  'health-010-activity': 'lucide:activity',

  // Feminine hygiene icons (if any existed)
  'feminine-hygiene-001-pad': 'tabler:heart',
  'feminine-hygiene-002-tampon': 'tabler:heart',
  'feminine-hygiene-003-cup': 'tabler:cup',
  'feminine-hygiene-004-care': 'tabler:heart-handshake',
  'feminine-hygiene-005-health': 'lucide:heart',
  'feminine-hygiene-006-wellness': 'lucide:activity',
  'feminine-hygiene-007-hygiene': 'tabler:droplet',
  'feminine-hygiene-008-clean': 'tabler:droplet',
  'feminine-hygiene-009-fresh': 'tabler:droplet',
  'feminine-hygiene-010-safe': 'tabler:shield',
}

/**
 * Migrate an old icon filename to a new icon name
 * @param oldName - The old icon filename or ID
 * @returns The new icon name from the icon catalog, or the original name if no mapping exists
 */
export function migrateIconName(oldName: string): string {
  // Direct mapping lookup
  if (ICON_MIGRATION_MAP[oldName]) {
    return ICON_MIGRATION_MAP[oldName]
  }

  // Try to extract the base name without extension
  const baseName = oldName.replace(/\.(svg|png|jpg|jpeg)$/i, '')
  if (ICON_MIGRATION_MAP[baseName]) {
    return ICON_MIGRATION_MAP[baseName]
  }

  // Try to extract just the ID part (e.g., "alphabet-001" from "alphabet-001-A.svg")
  const idMatch = baseName.match(/^([a-z-]+)-\d+/i)
  if (idMatch) {
    const id = idMatch[1]
    // Find all icons that start with this ID and return the first match
    for (const [oldKey, newIcon] of Object.entries(ICON_MIGRATION_MAP)) {
      if (oldKey.startsWith(id)) {
        return newIcon
      }
    }
  }

  // Return the original name if no mapping found
  return oldName
}

/**
 * Check if an icon name needs migration
 * @param iconName - The icon name to check
 * @returns True if the icon needs migration, false otherwise
 */
export function shouldMigrateIcon(iconName: string): boolean {
  return iconName in ICON_MIGRATION_MAP
}

/**
 * Get the migration map for debugging purposes
 */
export function getMigrationMap(): Record<string, string> {
  return { ...ICON_MIGRATION_MAP }
}

/**
 * Validate if a migrated icon name exists in the icon catalog
 * @param iconName - The icon name to validate
 * @returns True if the icon exists in the catalog, false otherwise
 */
export function validateMigratedIcon(iconName: string): boolean {
  // Check if it's an iconify icon
  if (iconName.includes(':')) {
    return true // Iconify icons are dynamically loaded, so we can't validate them
  }

  // Check if it's in our catalog
  const icon = getIconById(iconName)
  return icon !== undefined
}

/**
 * Batch migrate multiple icon names
 * @param iconNames - Array of icon names to migrate
 * @returns Array of migrated icon names
 */
export function batchMigrateIcons(iconNames: string[]): string[] {
  return iconNames.map(name => migrateIconName(name))
}
