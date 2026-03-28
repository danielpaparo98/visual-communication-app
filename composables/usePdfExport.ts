import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { ExportQuality } from '~/types'

export function usePdfExport() {
  async function exportToPdf(
    element: HTMLElement,
    filename: string,
    quality: ExportQuality = 'standard'
  ): Promise<void> {
    // Configure canvas options based on quality
    const scale = quality === 'high' ? 3 : 2
    
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
    })
    
    // Create PDF with A4 landscape dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })
    
    // Calculate dimensions to fit A4 landscape
    const imgWidth = 297 // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Add image to PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
    
    // Save PDF
    pdf.save(`${filename}.pdf`)
  }
  
  return {
    exportToPdf,
  }
}
