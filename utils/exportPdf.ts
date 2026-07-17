import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { exportFilename, QUALITY_SCALE, type ExportQuality } from './exportFilename'

/**
 * Export the chart as a PDF by capturing the DOM element with html2canvas
 * and embedding the image in a jsPDF document that fills an A4 landscape
 * page exactly.
 *
 * CSS transforms (zoom) are temporarily cleared before capture so the
 * element renders at its natural 1:1 pixel size.
 *
 * @param canvasElement The `.canvas-page` DOM node — must have a 1.414:1
 *   aspect ratio at capture time.
 * @param title Chart title — used to build the download filename.
 * @param quality Pixel-ratio (draft=1, normal=2, high=3).
 */
export async function exportToPdf(
  canvasElement: HTMLElement,
  title: string,
  quality: ExportQuality = 'normal',
): Promise<void> {
  const scale = QUALITY_SCALE[quality]

  // Temporarily strip CSS transforms so html2canvas captures the element
  // at its natural (un-zoomed) pixel size.
  const originalTransform = canvasElement.style.transform
  const originalTransformOrigin = canvasElement.style.transformOrigin
  canvasElement.style.transform = 'none'
  canvasElement.style.transformOrigin = ''

  // Wait for fonts before rasterising
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready
    } catch {
      // Non-critical
    }
  }

  try {
    const rendered = await html2canvas(canvasElement, {
      scale,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      ignoreElements: (el) => el.classList?.contains('print-footer'),
    })

    // Sanity check — abort if the capture produced nothing
    if (rendered.width < 10 || rendered.height < 10) {
      throw new Error('Captured chart is too small — please try again.')
    }

    const imgData = rendered.toDataURL('image/png')

    // A4 landscape dimensions in mm
    const PDF_WIDTH = 297
    const PDF_HEIGHT = 210

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Place the image so it fills the entire A4 page. We use explicit
    // PDF dimensions (not proportional from canvas) so the output is
    // always an exact A4 landscape, regardless of minor sub-pixel
    // aspect-ratio differences in the DOM capture.
    pdf.addImage(imgData, 'PNG', 0, 0, PDF_WIDTH, PDF_HEIGHT, undefined, 'none')

    const filename = exportFilename(title, 'pdf')
    pdf.save(filename)
  } finally {
    // Restore the original transform
    canvasElement.style.transform = originalTransform
    canvasElement.style.transformOrigin = originalTransformOrigin
  }
}
