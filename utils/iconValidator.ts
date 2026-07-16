/**
 * Validation utilities for user-uploaded custom SVG icons.
 *
 * The picker hands a selected `File` to {@link validateSvgFile}, which enforces
 * a small set of safety/quality rules before the icon is persisted as a base64
 * data URL in the icon-preferences store:
 *
 * 1. The file is genuinely an SVG (type *or* extension).
 * 2. The file is at most 100 KB (keeps localStorage usage bounded).
 * 3. The SVG parses and its dimensions do not exceed 512×512 px.
 *
 * All checks run client-side — this only ever runs in response to a user
 * picking a file in the browser, so DOM APIs (`DOMParser`, `FileReader`) are
 * always available.
 */

export interface ValidationResult {
  /** Whether the file passed every check. */
  valid: boolean
  /** Human-readable reason when `valid === false`. */
  error?: string
  /** Base64 data URL ready for storage/rendering when `valid === true`. */
  data?: string
}

/** Maximum allowed file size: 100 KB. */
const MAX_FILE_SIZE = 100 * 1024 // 102,400 bytes

/** Maximum allowed width or height of the SVG, in pixels. */
const MAX_DIMENSION = 512

/**
 * Validate a user-selected SVG file.
 *
 * Returns a {@link ValidationResult}; on success `data` holds the base64 data
 * URL. Never throws — parse/read failures are reported via `error`.
 */
export async function validateSvgFile(file: File): Promise<ValidationResult> {
  // 1. Type check — accept the official SVG MIME type, or fall back to the
  //    file extension (some OS/browser combos report an empty MIME for SVG).
  const isSvgType = file.type === 'image/svg+xml'
  const isSvgExt = file.name.toLowerCase().endsWith('.svg')
  if (!isSvgType && !isSvgExt) {
    return { valid: false, error: 'Please select an SVG file (.svg).' }
  }

  // 2. Size check.
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). The maximum size is 100 KB.`,
    }
  }

  // 3. Parse the markup and verify dimensions.
  let text: string
  try {
    text = await file.text()
  } catch {
    return { valid: false, error: 'Could not read the file. Please try again.' }
  }

  const dimError = checkSvgDimensions(text)
  if (dimError) {
    return { valid: false, error: dimError }
  }

  // Success — encode as a base64 data URL.
  try {
    const data = await fileToDataUrl(file)
    return { valid: true, data }
  } catch {
    return { valid: false, error: 'Could not encode the file. Please try again.' }
  }
}

/**
 * Parse SVG markup and confirm its dimensions are within bounds.
 *
 * Width/height are resolved in priority order:
 *  1. Explicit `width`/`height` attributes (units stripped).
 *  2. The `viewBox` attribute's third/fourth values.
 *
 * Returns an error string when the SVG is malformed or too large, otherwise
 * `null` to signal success.
 */
function checkSvgDimensions(svgText: string): string | null {
  let doc: Document
  try {
    doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  } catch {
    return 'The file is not valid SVG.'
  }

  // DOMParser surfaces parse errors as a <parsererror> element.
  if (doc.querySelector('parsererror')) {
    return 'The file is not valid SVG.'
  }

  const svg = doc.querySelector('svg')
  if (!svg) {
    return 'No <svg> element found in the file.'
  }

  const resolved = resolveSvgSize(svg)
  if (!resolved) {
    return 'The SVG must declare a size via width/height or a viewBox.'
  }

  const { width, height } = resolved
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return `Icon is too large (${width}×${height}). The maximum size is ${MAX_DIMENSION}×${MAX_DIMENSION} pixels.`
  }

  return null
}

/**
 * Best-effort resolution of an SVG's pixel dimensions.
 *
 * Returns `null` only when neither width/height attributes nor a usable
 * viewBox are present.
 */
function resolveSvgSize(svg: Element): { width: number; height: number } | null {
  const w = parseLength(svg.getAttribute('width'))
  const h = parseLength(svg.getAttribute('height'))
  if (w !== null && h !== null) {
    return { width: w, height: h }
  }

  const viewBox = svg.getAttribute('viewBox')
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/)
    const vbW = Number.parseFloat(parts[2] ?? '')
    const vbH = Number.parseFloat(parts[3] ?? '')
    if (!Number.isNaN(vbW) && !Number.isNaN(vbH)) {
      return { width: vbW, height: vbH }
    }
  }

  return null
}

/** Parse the leading numeric portion of a length attribute (e.g. "512px" → 512). */
function parseLength(value: string | null): number | null {
  if (!value) return null
  const match = /^([0-9]*\.?[0-9]+)/.exec(value.trim())
  if (!match) return null
  const n = Number.parseFloat(match[1])
  return Number.isNaN(n) ? null : n
}

/** Read a `File` as a base64 data URL via the FileReader API. */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('FileReader failed'))
    reader.readAsDataURL(file)
  })
}

/** Format a byte count as a compact human-readable string. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}
