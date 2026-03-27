// This is a build-time utility
// Run with: bun run utils/generate-manifest.ts

import { readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface IconEntry {
  id: string
  filename: string
  category: string
  alt: string
  keywords: string[]
}

function generateManifest() {
  const iconsDir = join(process.cwd(), 'public', 'icons')
  const files = readdirSync(iconsDir).filter(f => f.endsWith('.svg'))
  
  const icons: IconEntry[] = files.map(filename => {
    const match = filename.match(/^(alphabet|disability|family|feminine-hygiene|health)-(\d+)-(.+)\.svg$/)
    if (!match) return null
    
    const [, category, num, name] = match
    const id = `${category}-${num}`
    
    return {
      id,
      filename,
      category,
      alt: name.replace(/-/g, ' '),
      keywords: name.toLowerCase().split(/[\s-]+/).filter(w => w.length > 1),
    }
  }).filter(Boolean) as IconEntry[]
  
  writeFileSync(
    join(process.cwd(), 'public', 'icons-manifest.json'),
    JSON.stringify(icons, null, 2)
  )
  
  console.log(`Generated manifest with ${icons.length} icons`)
}

generateManifest()
