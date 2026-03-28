/**
 * Icon Catalog for the new icon system
 * Uses @nuxt/icon (Iconify) and @tabler/icons-vue
 */

export interface IconCatalogItem {
  id: string
  name: string
  category: string
  keywords: string[]
  source: 'iconify' | 'tabler'
}

export interface IconCategory {
  id: string
  name: string
  icon: string
  color: string
  icons: IconCatalogItem[]
}

export const ICON_CATALOG: IconCategory[] = [
  {
    id: 'medical',
    name: 'Medical',
    icon: '🏥',
    color: 'red',
    icons: [
      { id: 'tabler-stethoscope', name: 'tabler:stethoscope', category: 'medical', keywords: ['doctor', 'health', 'medical', 'checkup'], source: 'tabler' },
      { id: 'tabler-hospital', name: 'tabler:hospital', category: 'medical', keywords: ['clinic', 'healthcare', 'emergency'], source: 'tabler' },
      { id: 'tabler-pill', name: 'tabler:pill', category: 'medical', keywords: ['medicine', 'drug', 'pharmacy'], source: 'tabler' },
      { id: 'tabler-ambulance', name: 'tabler:ambulance', category: 'medical', keywords: ['emergency', 'rescue', 'transport'], source: 'tabler' },
      { id: 'tabler-heart-pulse', name: 'tabler:heart-pulse', category: 'medical', keywords: ['ecg', 'heartbeat', 'cardiac'], source: 'tabler' },
      { id: 'tabler-vaccine', name: 'tabler:vaccine', category: 'medical', keywords: ['shot', 'injection', 'immunization'], source: 'tabler' },
      { id: 'tabler-thermometer', name: 'tabler:thermometer', category: 'medical', keywords: ['temperature', 'fever', 'heat'], source: 'tabler' },
      { id: 'tabler-bandage', name: 'tabler:bandage', category: 'medical', keywords: ['first-aid', 'injury', 'wound'], source: 'tabler' },
      { id: 'tabler-crutch', name: 'tabler:crutch', category: 'medical', keywords: ['injury', 'support', 'mobility'], source: 'tabler' },
      { id: 'tabler-wheelchair', name: 'tabler:wheelchair', category: 'medical', keywords: ['accessibility', 'mobility', 'disabled'], source: 'tabler' },
      { id: 'tabler-needle', name: 'tabler:needle', category: 'medical', keywords: ['injection', 'syringe', 'vaccine'], source: 'tabler' },
      { id: 'tabler-microscope', name: 'tabler:microscope', category: 'medical', keywords: ['lab', 'research', 'science'], source: 'tabler' },
      { id: 'tabler-test-tubes', name: 'tabler:test-tubes', category: 'medical', keywords: ['lab', 'test', 'research'], source: 'tabler' },
      { id: 'tabler-heart-rate-monitor', name: 'tabler:heart-rate-monitor', category: 'medical', keywords: ['monitor', 'vital', 'ecg'], source: 'tabler' },
      { id: 'tabler-dna', name: 'tabler:dna', category: 'medical', keywords: ['genetics', 'biology', 'science'], source: 'tabler' },
      { id: 'tabler-clipboard-list', name: 'tabler:clipboard-list', category: 'medical', keywords: ['records', 'prescription', 'notes'], source: 'tabler' },
      { id: 'tabler-first-aid-kit', name: 'tabler:first-aid-kit', category: 'medical', keywords: ['emergency', 'kit', 'supplies'], source: 'tabler' },
      { id: 'tabler-activity-heartbeat', name: 'tabler:activity-heartbeat', category: 'medical', keywords: ['pulse', 'vital', 'monitor'], source: 'tabler' },
      { id: 'tabler-heart-off', name: 'tabler:heart-off', category: 'medical', keywords: ['broken', 'sad', 'health'], source: 'tabler' },
      { id: 'tabler-heart-handshake', name: 'tabler:heart-handshake', category: 'medical', keywords: ['care', 'support', 'help'], source: 'tabler' },
    ]
  },
  {
    id: 'health',
    name: 'Health',
    icon: '❤️',
    color: 'pink',
    icons: [
      { id: 'lucide-activity', name: 'lucide:activity', category: 'health', keywords: ['pulse', 'heart', 'vital'], source: 'iconify' },
      { id: 'lucide-heart', name: 'lucide:heart', category: 'health', keywords: ['love', 'cardio', 'organ'], source: 'iconify' },
      { id: 'lucide-brain', name: 'lucide:brain', category: 'health', keywords: ['mind', 'thinking', 'mental'], source: 'iconify' },
      { id: 'lucide-lungs', name: 'lucide:lungs', category: 'health', keywords: ['breathing', 'respiratory'], source: 'iconify' },
      { id: 'lucide-bone', name: 'lucide:bone', category: 'health', keywords: ['skeleton', 'body'], source: 'iconify' },
      { id: 'lucide-eye', name: 'lucide:eye', category: 'health', keywords: ['vision', 'sight'], source: 'iconify' },
      { id: 'lucide-ear', name: 'lucide:ear', category: 'health', keywords: ['hearing', 'audio'], source: 'iconify' },
      { id: 'lucide-tooth', name: 'lucide:tooth', category: 'health', keywords: ['dental', 'mouth'], source: 'iconify' },
      { id: 'lucide-hand', name: 'lucide:hand', category: 'health', keywords: ['touch', 'grip'], source: 'iconify' },
      { id: 'lucide-footprints', name: 'lucide:footprints', category: 'health', keywords: ['walking', 'steps'], source: 'iconify' },
      { id: 'lucide-droplet', name: 'lucide:droplet', category: 'health', keywords: ['blood', 'water', 'fluid'], source: 'iconify' },
      { id: 'lucide-sun', name: 'lucide:sun', category: 'health', keywords: ['vitamin', 'light', 'energy'], source: 'iconify' },
      { id: 'lucide-moon', name: 'lucide:moon', category: 'health', keywords: ['sleep', 'night', 'rest'], source: 'iconify' },
      { id: 'lucide-zap', name: 'lucide:zap', category: 'health', keywords: ['energy', 'power', 'vitality'], source: 'iconify' },
      { id: 'lucide-flame', name: 'lucide:flame', category: 'health', keywords: ['fever', 'hot', 'burn'], source: 'iconify' },
      { id: 'lucide-thermometer', name: 'lucide:thermometer', category: 'health', keywords: ['temperature', 'fever'], source: 'iconify' },
      { id: 'lucide-scale', name: 'lucide:scale', category: 'health', keywords: ['weight', 'balance'], source: 'iconify' },
      { id: 'lucide-timer', name: 'lucide:timer', category: 'health', keywords: ['time', 'exercise'], source: 'iconify' },
      { id: 'lucide-smile', name: 'lucide:smile', category: 'health', keywords: ['happy', 'emotion', 'face'], source: 'iconify' },
      { id: 'lucide-frown', name: 'lucide:frown', category: 'health', keywords: ['sad', 'emotion', 'face'], source: 'iconify' },
    ]
  },
  {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    color: 'green',
    icons: [
      { id: 'tabler-users', name: 'tabler:users', category: 'family', keywords: ['people', 'group', 'crowd'], source: 'tabler' },
      { id: 'tabler-user', name: 'tabler:user', category: 'family', keywords: ['person', 'individual', 'man'], source: 'tabler' },
      { id: 'tabler-user-plus', name: 'tabler:user-plus', category: 'family', keywords: ['add', 'invite', 'new'], source: 'tabler' },
      { id: 'tabler-user-minus', name: 'tabler:user-minus', category: 'family', keywords: ['remove', 'delete'], source: 'tabler' },
      { id: 'tabler-baby', name: 'tabler:baby', category: 'family', keywords: ['infant', 'child', 'newborn'], source: 'tabler' },
      { id: 'tabler-baby-carriage', name: 'tabler:baby-carriage', category: 'family', keywords: ['stroller', 'pushchair'], source: 'tabler' },
      { id: 'tabler-heart-handshake', name: 'tabler:heart-handshake', category: 'family', keywords: ['love', 'relationship', 'care'], source: 'tabler' },
      { id: 'tabler-heart', name: 'tabler:heart', category: 'family', keywords: ['love', 'like', 'favorite'], source: 'tabler' },
      { id: 'tabler-heart-broken', name: 'tabler:heart-broken', category: 'family', keywords: ['broken', 'sad', 'loss'], source: 'tabler' },
      { id: 'tabler-home', name: 'tabler:home', category: 'family', keywords: ['house', 'living', 'family'], source: 'tabler' },
      { id: 'tabler-building', name: 'tabler:building', category: 'family', keywords: ['apartment', 'housing'], source: 'tabler' },
      { id: 'tabler-chair', name: 'tabler:chair', category: 'family', keywords: ['furniture', 'seat'], source: 'tabler' },
      { id: 'tabler-bed', name: 'tabler:bed', category: 'family', keywords: ['sleep', 'rest', 'furniture'], source: 'tabler' },
      { id: 'tabler-armchair', name: 'tabler:armchair', category: 'family', keywords: ['sofa', 'couch', 'furniture'], source: 'tabler' },
      { id: 'tabler-utensils', name: 'tabler:utensils', category: 'family', keywords: ['food', 'eating', 'dining'], source: 'tabler' },
      { id: 'tabler-plate', name: 'tabler:plate', category: 'family', keywords: ['food', 'dining'], source: 'tabler' },
      { id: 'tabler-cup', name: 'tabler:cup', category: 'family', keywords: ['drink', 'coffee', 'tea'], source: 'tabler' },
      { id: 'tabler-gift', name: 'tabler:gift', category: 'family', keywords: ['present', 'celebration'], source: 'tabler' },
      { id: 'tabler-confetti', name: 'tabler:confetti', category: 'family', keywords: ['party', 'celebration'], source: 'tabler' },
      { id: 'tabler-balloon', name: 'tabler:balloon', category: 'family', keywords: ['party', 'celebration'], source: 'tabler' },
    ]
  },
  {
    id: 'alphabet',
    name: 'Alphabet & Numbers',
    icon: '🔤',
    color: 'blue',
    icons: [
      { id: 'emoji-A', name: 'emoji:🅰️', category: 'alphabet', keywords: ['letter', 'a', 'alphabet'], source: 'iconify' },
      { id: 'emoji-B', name: 'emoji:🅱️', category: 'alphabet', keywords: ['letter', 'b', 'alphabet'], source: 'iconify' },
      { id: 'emoji-C', name: 'emoji:🆎', category: 'alphabet', keywords: ['letter', 'c', 'alphabet'], source: 'iconify' },
      { id: 'emoji-1', name: 'emoji:1️⃣', category: 'alphabet', keywords: ['number', 'one', 'digit'], source: 'iconify' },
      { id: 'emoji-2', name: 'emoji:2️⃣', category: 'alphabet', keywords: ['number', 'two', 'digit'], source: 'iconify' },
      { id: 'emoji-3', name: 'emoji:3️⃣', category: 'alphabet', keywords: ['number', 'three', 'digit'], source: 'iconify' },
      { id: 'emoji-4', name: 'emoji:4️⃣', category: 'alphabet', keywords: ['number', 'four', 'digit'], source: 'iconify' },
      { id: 'emoji-5', name: 'emoji:5️⃣', category: 'alphabet', keywords: ['number', 'five', 'digit'], source: 'iconify' },
      { id: 'emoji-6', name: 'emoji:6️⃣', category: 'alphabet', keywords: ['number', 'six', 'digit'], source: 'iconify' },
      { id: 'emoji-7', name: 'emoji:7️⃣', category: 'alphabet', keywords: ['number', 'seven', 'digit'], source: 'iconify' },
      { id: 'emoji-8', name: 'emoji:8️⃣', category: 'alphabet', keywords: ['number', 'eight', 'digit'], source: 'iconify' },
      { id: 'emoji-9', name: 'emoji:9️⃣', category: 'alphabet', keywords: ['number', 'nine', 'digit'], source: 'iconify' },
      { id: 'emoji-0', name: 'emoji:0️⃣', category: 'alphabet', keywords: ['number', 'zero', 'digit'], source: 'iconify' },
      { id: 'emoji-star', name: 'emoji:⭐', category: 'alphabet', keywords: ['star', 'favorite', 'rating'], source: 'iconify' },
      { id: 'emoji-heart', name: 'emoji:❤️', category: 'alphabet', keywords: ['love', 'heart', 'favorite'], source: 'iconify' },
      { id: 'emoji-check', name: 'emoji:✅', category: 'alphabet', keywords: ['check', 'done', 'success'], source: 'iconify' },
      { id: 'emoji-cross', name: 'emoji:❌', category: 'alphabet', keywords: ['cross', 'error', 'wrong'], source: 'iconify' },
      { id: 'emoji-question', name: 'emoji:❓', category: 'alphabet', keywords: ['question', 'help', 'unknown'], source: 'iconify' },
      { id: 'emoji-exclamation', name: 'emoji:❗', category: 'alphabet', keywords: ['exclamation', 'alert', 'warning'], source: 'iconify' },
      { id: 'emoji-arrow-up', name: 'emoji:⬆️', category: 'alphabet', keywords: ['up', 'arrow', 'direction'], source: 'iconify' },
    ]
  },
  {
    id: 'daily',
    name: 'Daily Activities',
    icon: '🏠',
    color: 'orange',
    icons: [
      { id: 'tabler-home', name: 'tabler:home', category: 'daily', keywords: ['house', 'living', 'residence'], source: 'tabler' },
      { id: 'tabler-phone', name: 'tabler:phone', category: 'daily', keywords: ['call', 'telephone', 'mobile'], source: 'tabler' },
      { id: 'tabler-car', name: 'tabler:car', category: 'daily', keywords: ['vehicle', 'transport', 'drive'], source: 'tabler' },
      { id: 'tabler-bus', name: 'tabler:bus', category: 'daily', keywords: ['transport', 'public', 'travel'], source: 'tabler' },
      { id: 'tabler-train', name: 'tabler:train', category: 'daily', keywords: ['transport', 'rail', 'travel'], source: 'tabler' },
      { id: 'tabler-plane', name: 'tabler:plane', category: 'daily', keywords: ['flight', 'travel', 'air'], source: 'tabler' },
      { id: 'tabler-bike', name: 'tabler:bike', category: 'daily', keywords: ['bicycle', 'cycle', 'transport'], source: 'tabler' },
      { id: 'tabler-walk', name: 'tabler:walk', category: 'daily', keywords: ['walking', 'pedestrian'], source: 'tabler' },
      { id: 'tabler-shopping-cart', name: 'tabler:shopping-cart', category: 'daily', keywords: ['shop', 'buy', 'store'], source: 'tabler' },
      { id: 'tabler-credit-card', name: 'tabler:credit-card', category: 'daily', keywords: ['payment', 'money', 'card'], source: 'tabler' },
      { id: 'tabler-wallet', name: 'tabler:wallet', category: 'daily', keywords: ['money', 'cash', 'finance'], source: 'tabler' },
      { id: 'tabler-calendar', name: 'tabler:calendar', category: 'daily', keywords: ['date', 'schedule', 'time'], source: 'tabler' },
      { id: 'tabler-clock', name: 'tabler:clock', category: 'daily', keywords: ['time', 'watch', 'hour'], source: 'tabler' },
      { id: 'tabler-alarm', name: 'tabler:alarm', category: 'daily', keywords: ['alarm', 'wake', 'reminder'], source: 'tabler' },
      { id: 'tabler-map-pin', name: 'tabler:map-pin', category: 'daily', keywords: ['location', 'place', 'address'], source: 'tabler' },
      { id: 'tabler-globe', name: 'tabler:globe', category: 'daily', keywords: ['world', 'earth', 'global'], source: 'tabler' },
      { id: 'tabler-camera', name: 'tabler:camera', category: 'daily', keywords: ['photo', 'picture', 'image'], source: 'tabler' },
      { id: 'tabler-music', name: 'tabler:music', category: 'daily', keywords: ['song', 'audio', 'sound'], source: 'tabler' },
      { id: 'tabler-video', name: 'tabler:video', category: 'daily', keywords: ['movie', 'film', 'watch'], source: 'tabler' },
      { id: 'tabler-book', name: 'tabler:book', category: 'daily', keywords: ['read', 'library', 'education'], source: 'tabler' },
    ]
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    icon: '♿',
    color: 'purple',
    icons: [
      { id: 'tabler-wheelchair', name: 'tabler:wheelchair', category: 'accessibility', keywords: ['mobility', 'disabled', 'chair'], source: 'tabler' },
      { id: 'tabler-blind', name: 'tabler:blind', category: 'accessibility', keywords: ['vision', 'sight', 'cane'], source: 'tabler' },
      { id: 'tabler-hearing', name: 'tabler:hearing', category: 'accessibility', keywords: ['deaf', 'audio', 'ear'], source: 'tabler' },
      { id: 'tabler-crutch', name: 'tabler:crutch', category: 'accessibility', keywords: ['injury', 'support', 'mobility'], source: 'tabler' },
      { id: 'tabler-braille', name: 'tabler:braille', category: 'accessibility', keywords: ['blind', 'touch', 'dots'], source: 'tabler' },
      { id: 'tabler-sign-language', name: 'tabler:sign-language', category: 'accessibility', keywords: ['deaf', 'hands', 'gesture'], source: 'tabler' },
      { id: 'tabler-accessible', name: 'tabler:accessible', category: 'accessibility', keywords: ['access', 'inclusive', 'ramp'], source: 'tabler' },
      { id: 'tabler-stairs', name: 'tabler:stairs', category: 'accessibility', keywords: ['steps', 'climb', 'floor'], source: 'tabler' },
      { id: 'tabler-elevator', name: 'tabler:elevator', category: 'accessibility', keywords: ['lift', 'floor', 'access'], source: 'tabler' },
      { id: 'tabler-door', name: 'tabler:door', category: 'accessibility', keywords: ['entrance', 'exit', 'access'], source: 'tabler' },
      { id: 'tabler-ramp', name: 'tabler:ramp', category: 'accessibility', keywords: ['wheelchair', 'slope', 'access'], source: 'tabler' },
      { id: 'tabler-parking', name: 'tabler:parking', category: 'accessibility', keywords: ['car', 'vehicle', 'spot'], source: 'tabler' },
      { id: 'tabler-restroom', name: 'tabler:restroom', category: 'accessibility', keywords: ['toilet', 'bathroom', 'wc'], source: 'tabler' },
      { id: 'tabler-bus-stop', name: 'tabler:bus-stop', category: 'accessibility', keywords: ['transport', 'public', 'stop'], source: 'tabler' },
      { id: 'tabler-crosswalk', name: 'tabler:crosswalk', category: 'accessibility', keywords: ['pedestrian', 'crossing', 'safety'], source: 'tabler' },
      { id: 'tabler-traffic-light', name: 'tabler:traffic-light', category: 'accessibility', keywords: ['signal', 'stop', 'go'], source: 'tabler' },
      { id: 'tabler-guide-dog', name: 'tabler:dog', category: 'accessibility', keywords: ['service', 'blind', 'animal'], source: 'tabler' },
      { id: 'tabler-prosthetic', name: 'tabler:device', category: 'accessibility', keywords: ['prosthetic', 'artificial', 'limb'], source: 'tabler' },
      { id: 'tabler-hearing-aid', name: 'tabler:device', category: 'accessibility', keywords: ['hearing', 'audio', 'device'], source: 'tabler' },
      { id: 'tabler-walking-stick', name: 'tabler:walking-stick', category: 'accessibility', keywords: ['cane', 'blind', 'support'], source: 'tabler' },
    ]
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍔',
    color: 'yellow',
    icons: [
      { id: 'tabler-utensils', name: 'tabler:utensils', category: 'food', keywords: ['fork', 'knife', 'spoon', 'eating'], source: 'tabler' },
      { id: 'tabler-coffee', name: 'tabler:coffee', category: 'food', keywords: ['cafe', 'drink', 'beverage'], source: 'tabler' },
      { id: 'tabler-glass', name: 'tabler:glass', category: 'food', keywords: ['drink', 'water', 'cup'], source: 'tabler' },
      { id: 'tabler-wine', name: 'tabler:wine', category: 'food', keywords: ['alcohol', 'drink', 'beverage'], source: 'tabler' },
      { id: 'tabler-beer', name: 'tabler:beer', category: 'food', keywords: ['alcohol', 'drink', 'beverage'], source: 'tabler' },
      { id: 'tabler-pizza', name: 'tabler:pizza', category: 'food', keywords: ['italian', 'food', 'slice'], source: 'tabler' },
      { id: 'tabler-hamburger', name: 'tabler:hamburger', category: 'food', keywords: ['burger', 'fast', 'food'], source: 'tabler' },
      { id: 'tabler-fish', name: 'tabler:fish', category: 'food', keywords: ['seafood', 'animal', 'food'], source: 'tabler' },
      { id: 'tabler-egg', name: 'tabler:egg', category: 'food', keywords: ['breakfast', 'food', 'protein'], source: 'tabler' },
      { id: 'tabler-cheese', name: 'tabler:cheese', category: 'food', keywords: ['dairy', 'food', 'slice'], source: 'tabler' },
      { id: 'tabler-bread', name: 'tabler:bread', category: 'food', keywords: ['bakery', 'food', 'loaf'], source: 'tabler' },
      { id: 'tabler-apple', name: 'tabler:apple', category: 'food', keywords: ['fruit', 'healthy', 'food'], source: 'tabler' },
      { id: 'tabler-carrot', name: 'tabler:carrot', category: 'food', keywords: ['vegetable', 'healthy', 'food'], source: 'tabler' },
      { id: 'tabler-cherry', name: 'tabler:cherry', category: 'food', keywords: ['fruit', 'sweet', 'food'], source: 'tabler' },
      { id: 'tabler-grape', name: 'tabler:grape', category: 'food', keywords: ['fruit', 'wine', 'food'], source: 'tabler' },
      { id: 'tabler-lemon', name: 'tabler:lemon', category: 'food', keywords: ['fruit', 'citrus', 'food'], source: 'tabler' },
      { id: 'tabler-ice-cream', name: 'tabler:ice-cream', category: 'food', keywords: ['dessert', 'sweet', 'cold'], source: 'tabler' },
      { id: 'tabler-cake', name: 'tabler:cake', category: 'food', keywords: ['birthday', 'dessert', 'sweet'], source: 'tabler' },
      { id: 'tabler-cookie', name: 'tabler:cookie', category: 'food', keywords: ['snack', 'sweet', 'biscuit'], source: 'tabler' },
      { id: 'tabler-milk', name: 'tabler:milk', category: 'food', keywords: ['dairy', 'drink', 'beverage'], source: 'tabler' },
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌳',
    color: 'green',
    icons: [
      { id: 'tabler-tree', name: 'tabler:tree', category: 'nature', keywords: ['forest', 'wood', 'plant'], source: 'tabler' },
      { id: 'tabler-sun', name: 'tabler:sun', category: 'nature', keywords: ['light', 'day', 'weather'], source: 'tabler' },
      { id: 'tabler-moon', name: 'tabler:moon', category: 'nature', keywords: ['night', 'dark', 'space'], source: 'tabler' },
      { id: 'tabler-star', name: 'tabler:star', category: 'nature', keywords: ['space', 'night', 'sky'], source: 'tabler' },
      { id: 'tabler-cloud', name: 'tabler:cloud', category: 'nature', keywords: ['weather', 'sky', 'rain'], source: 'tabler' },
      { id: 'tabler-cloud-rain', name: 'tabler:cloud-rain', category: 'nature', keywords: ['rain', 'weather', 'storm'], source: 'tabler' },
      { id: 'tabler-cloud-snow', name: 'tabler:cloud-snow', category: 'nature', keywords: ['snow', 'winter', 'weather'], source: 'tabler' },
      { id: 'tabler-cloud-lightning', name: 'tabler:cloud-lightning', category: 'nature', keywords: ['storm', 'thunder', 'weather'], source: 'tabler' },
      { id: 'tabler-wind', name: 'tabler:wind', category: 'nature', keywords: ['air', 'breeze', 'weather'], source: 'tabler' },
      { id: 'tabler-temperature', name: 'tabler:temperature', category: 'nature', keywords: ['hot', 'cold', 'weather'], source: 'tabler' },
      { id: 'tabler-flower', name: 'tabler:flower', category: 'nature', keywords: ['plant', 'bloom', 'garden'], source: 'tabler' },
      { id: 'tabler-leaf', name: 'tabler:leaf', category: 'nature', keywords: ['plant', 'tree', 'nature'], source: 'tabler' },
      { id: 'tabler-seedling', name: 'tabler:seedling', category: 'nature', keywords: ['plant', 'grow', 'nature'], source: 'tabler' },
      { id: 'tabler-mountain', name: 'tabler:mountain', category: 'nature', keywords: ['hill', 'peak', 'landscape'], source: 'tabler' },
      { id: 'tabler-water', name: 'tabler:water', category: 'nature', keywords: ['ocean', 'sea', 'river'], source: 'tabler' },
      { id: 'tabler-fire', name: 'tabler:fire', category: 'nature', keywords: ['flame', 'hot', 'burn'], source: 'tabler' },
      { id: 'tabler-snowflake', name: 'tabler:snowflake', category: 'nature', keywords: ['winter', 'cold', 'ice'], source: 'tabler' },
      { id: 'tabler-rainbow', name: 'tabler:rainbow', category: 'nature', keywords: ['color', 'weather', 'sky'], source: 'tabler' },
      { id: 'tabler-butterfly', name: 'tabler:butterfly', category: 'nature', keywords: ['insect', 'fly', 'beautiful'], source: 'tabler' },
      { id: 'tabler-bug', name: 'tabler:bug', category: 'nature', keywords: ['insect', 'pest', 'nature'], source: 'tabler' },
    ]
  },
  {
    id: 'emotions',
    name: 'Emotions',
    icon: '😀',
    color: 'pink',
    icons: [
      { id: 'emoji-smile', name: 'emoji:😀', category: 'emotions', keywords: ['happy', 'joy', 'face'], source: 'iconify' },
      { id: 'emoji-laugh', name: 'emoji:😂', category: 'emotions', keywords: ['laugh', 'funny', 'face'], source: 'iconify' },
      { id: 'emoji-love', name: 'emoji:😍', category: 'emotions', keywords: ['love', 'heart', 'face'], source: 'iconify' },
      { id: 'emoji-sad', name: 'emoji:😢', category: 'emotions', keywords: ['sad', 'cry', 'face'], source: 'iconify' },
      { id: 'emoji-angry', name: 'emoji:😠', category: 'emotions', keywords: ['angry', 'mad', 'face'], source: 'iconify' },
      { id: 'emoji-surprised', name: 'emoji:😮', category: 'emotions', keywords: ['surprised', 'wow', 'face'], source: 'iconify' },
      { id: 'emoji-confused', name: 'emoji:😕', category: 'emotions', keywords: ['confused', 'unsure', 'face'], source: 'iconify' },
      { id: 'emoji-wink', name: 'emoji:😉', category: 'emotions', keywords: ['wink', 'playful', 'face'], source: 'iconify' },
      { id: 'emoji-cool', name: 'emoji:😎', category: 'emotions', keywords: ['cool', 'sunglasses', 'face'], source: 'iconify' },
      { id: 'emoji-thinking', name: 'emoji:🤔', category: 'emotions', keywords: ['thinking', 'wonder', 'face'], source: 'iconify' },
      { id: 'emoji-sleeping', name: 'emoji:😴', category: 'emotions', keywords: ['sleep', 'tired', 'face'], source: 'iconify' },
      { id: 'emoji-sick', name: 'emoji:🤒', category: 'emotions', keywords: ['sick', 'ill', 'face'], source: 'iconify' },
      { id: 'emoji-scared', name: 'emoji:😨', category: 'emotions', keywords: ['scared', 'fear', 'face'], source: 'iconify' },
      { id: 'emoji-tired', name: 'emoji:😫', category: 'emotions', keywords: ['tired', 'exhausted', 'face'], source: 'iconify' },
      { id: 'emoji-bored', name: 'emoji:😑', category: 'emotions', keywords: ['bored', 'neutral', 'face'], source: 'iconify' },
      { id: 'emoji-excited', name: 'emoji:🤩', category: 'emotions', keywords: ['excited', 'star', 'face'], source: 'iconify' },
      { id: 'emoji-crying', name: 'emoji:😭', category: 'emotions', keywords: ['crying', 'tears', 'face'], source: 'iconify' },
      { id: 'emoji-smirk', name: 'emoji:😏', category: 'emotions', keywords: ['smirk', 'sly', 'face'], source: 'iconify' },
      { id: 'emoji-blush', name: 'emoji:😊', category: 'emotions', keywords: ['blush', 'happy', 'face'], source: 'iconify' },
      { id: 'emoji-neutral', name: 'emoji:😐', category: 'emotions', keywords: ['neutral', 'okay', 'face'], source: 'iconify' },
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    color: 'blue',
    icons: [
      { id: 'tabler-device-mobile', name: 'tabler:device-mobile', category: 'technology', keywords: ['phone', 'smartphone', 'mobile'], source: 'tabler' },
      { id: 'tabler-device-laptop', name: 'tabler:device-laptop', category: 'technology', keywords: ['laptop', 'computer', 'notebook'], source: 'tabler' },
      { id: 'tabler-device-desktop', name: 'tabler:device-desktop', category: 'technology', keywords: ['desktop', 'computer', 'pc'], source: 'tabler' },
      { id: 'tabler-device-tablet', name: 'tabler:device-tablet', category: 'technology', keywords: ['tablet', 'ipad', 'device'], source: 'tabler' },
      { id: 'tabler-keyboard', name: 'tabler:keyboard', category: 'technology', keywords: ['typing', 'input', 'keys'], source: 'tabler' },
      { id: 'tabler-mouse', name: 'tabler:mouse', category: 'technology', keywords: ['click', 'pointer', 'input'], source: 'tabler' },
      { id: 'tabler-monitor', name: 'tabler:monitor', category: 'technology', keywords: ['screen', 'display', 'monitor'], source: 'tabler' },
      { id: 'tabler-wifi', name: 'tabler:wifi', category: 'technology', keywords: ['wireless', 'network', 'internet'], source: 'tabler' },
      { id: 'tabler-bluetooth', name: 'tabler:bluetooth', category: 'technology', keywords: ['wireless', 'connect', 'device'], source: 'tabler' },
      { id: 'tabler-battery', name: 'tabler:battery', category: 'technology', keywords: ['power', 'charge', 'energy'], source: 'tabler' },
      { id: 'tabler-charging', name: 'tabler:charging', category: 'technology', keywords: ['power', 'charge', 'electric'], source: 'tabler' },
      { id: 'tabler-plug', name: 'tabler:plug', category: 'technology', keywords: ['power', 'electric', 'outlet'], source: 'tabler' },
      { id: 'tabler-bolt', name: 'tabler:bolt', category: 'technology', keywords: ['power', 'electric', 'energy'], source: 'tabler' },
      { id: 'tabler-database', name: 'tabler:database', category: 'technology', keywords: ['data', 'storage', 'server'], source: 'tabler' },
      { id: 'tabler-server', name: 'tabler:server', category: 'technology', keywords: ['server', 'host', 'network'], source: 'tabler' },
      { id: 'tabler-cloud', name: 'tabler:cloud', category: 'technology', keywords: ['cloud', 'storage', 'online'], source: 'tabler' },
      { id: 'tabler-code', name: 'tabler:code', category: 'technology', keywords: ['programming', 'developer', 'script'], source: 'tabler' },
      { id: 'tabler-terminal', name: 'tabler:terminal', category: 'technology', keywords: ['console', 'command', 'shell'], source: 'tabler' },
      { id: 'tabler-cpu', name: 'tabler:cpu', category: 'technology', keywords: ['processor', 'chip', 'computer'], source: 'tabler' },
      { id: 'tabler-memory', name: 'tabler:memory', category: 'technology', keywords: ['ram', 'storage', 'chip'], source: 'tabler' },
    ]
  },
]

/**
 * Search icons by query across all categories
 */
export function searchIcons(query: string): IconCatalogItem[] {
  if (!query || query.trim() === '') return []
  
  const lowerQuery = query.toLowerCase().trim()
  return ICON_CATALOG.flatMap(category => 
    category.icons.filter(icon => 
      icon.name.toLowerCase().includes(lowerQuery) ||
      icon.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    )
  )
}

/**
 * Get icon by ID
 */
export function getIconById(id: string): IconCatalogItem | undefined {
  return ICON_CATALOG.flatMap(category => category.icons).find(icon => icon.id === id)
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): IconCategory | undefined {
  return ICON_CATALOG.find(category => category.id === id)
}

/**
 * Get all icons from a specific category
 */
export function getIconsByCategory(categoryId: string): IconCatalogItem[] {
  const category = getCategoryById(categoryId)
  return category?.icons || []
}

/**
 * Get all icons from all categories
 */
export function getAllIcons(): IconCatalogItem[] {
  return ICON_CATALOG.flatMap(category => category.icons)
}
