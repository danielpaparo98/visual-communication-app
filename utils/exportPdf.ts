import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { exportFilename, QUALITY_SCALE, type ExportQuality } from './exportFilename'

/**
 * Export the chart as a PDF by capturing the DOM element with html2canvas
 * and embedding the image in a jsPDF document with A4 landscape dimensions.
 *
 * This produces a **rasterised** PDF (the page is rendered as a flat image
 * inside the document) rather than a vector one.  For vector output users
 * can use the native browser print-to-PDF flow via the Print / Preview
 * button instead.
 *
 * @param canvasElement The chart DOM node to capture.
 * @param title Chart title — used to build the download filename.
 * @param quality Pixel-ratio for html2canvas (draft=1, normal=2, high=3).
 *   Higher values produce crisper output at the cost of a larger file.
 */
export async function exportToPdf(
  canvasElement: HTMLElement,
  title: string,
  quality: ExportQuality = 'normal',
): Promise<void> {
  const scale = QUALITY_SCALE[quality]

  // Wait for fonts to load before rasterising (prevents fallback-font text)
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
    } catch {
      // Non-critical
    }
  }

  const canvas = await html2canvas(canvasElement, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    ignoreElements: (el) => el.classList?.contains('print-footer'),
  })

  const imgData = canvas.toDataURL('image/png')

  // A4 landscape dimensions in mm
  const PDF_WIDTH = 297
  const PDF_HEIGHT = 210

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  // Scale the image to fit the page width
  const imgHeight = (canvas.height * PDF_WIDTH) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, PDF_WIDTH, imgHeight)

  const filename = exportFilename(title, 'pdf')
  pdf.save(filename)
}
