/**
 * Shared types for the export pipeline.
 *
 * Consumed by the export dialog (`components/ExportDialog.vue`), the chart
 * page (`pages/chart.vue`) and the export-preferences store
 * (`stores/exportPreferences.ts`) so the contract between "what the user
 * picked" and "what the page executes" stays in one place.
 */

import type { ExportQuality } from '~/utils/exportFilename'

/** Export format options surfaced in the export dialog. */
export type ExportFormat = 'pdf' | 'png'

/**
 * The full export request produced by the dialog and handled by the page.
 *
 * @property format  'pdf' (native print) or 'png' (rasterised image).
 * @property quality Pixel-ratio level passed through to the capture engine.
 * @property batch   When `true`, export every chart in the manager store
 *                   instead of just the active one.
 */
export interface ExportConfig {
  format: ExportFormat
  quality: ExportQuality
  batch: boolean
}

/** A successful export outcome — used to render the success state. */
export interface ExportSuccess {
  ok: true
  /** Display filename of the produced file (or suggested print name). */
  filename: string
  /** Number of charts exported (1 for single, N for batch). */
  count: number
}

/** A failed export outcome — surfaces a human-readable error message. */
export interface ExportFailure {
  ok: false
  error: string
}

/** Discriminated union of the two outcomes. */
export type ExportResult = ExportSuccess | ExportFailure

/** Progress feedback while exporting multiple charts. */
export interface BatchProgress {
  /** 1-indexed chart currently being exported. */
  current: number
  total: number
}
