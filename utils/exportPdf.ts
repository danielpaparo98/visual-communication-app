import type { ExportQuality } from './exportFilename'

/**
 * Export the chart as a PDF by delegating to the browser's native print
 * pipeline (`window.print()`).
 *
 * Browser print-to-PDF produces **vector, infinitely-scalable output** —
 * the highest fidelity available — which is exactly what we want for a
 * communication board that may be printed at any size. This is deliberately
 * preferred over a rasterised jsPDF approach.
 *
 * The native print dialog does not let us programmatically set the saved
 * file name, but most browsers pre-fill the filename from `document.title`.
 * We therefore temporarily swap the document title for a clean,
 * title-derived slug so the suggested filename reads e.g.
 * `my-communication-chart.pdf` instead of the page heading.
 *
 * @param _canvasElement The chart DOM element (kept in the signature for
 *   API symmetry with {@link exportToPng}; native print renders its own
 *   print-only copy, so this element is not read here).
 * @param filename Suggested download name (without extension) — used to
 *   seed `document.title`.
 * @param _quality Unused by native print (vector output has no resolution);
 *   retained for signature parity.
 */
export function exportToPdf(
  _canvasElement: HTMLElement,
  filename: string,
  _quality: ExportQuality = 'normal',
): Promise<void> {
  // SSR guard — print is a client-only API.
  if (typeof window === 'undefined') return Promise.resolve()

  const previousTitle = document.title
  document.title = filename

  // `window.print()` blocks (synchronously) until the user dismisses the
  // dialog in most browsers, so the title has already been read by the
  // time we restore it. We restore on a short delay to be safe across
  // browsers that open the dialog asynchronously.
  window.print()

  window.setTimeout(() => {
    document.title = previousTitle
  }, 500)

  return Promise.resolve()
}
