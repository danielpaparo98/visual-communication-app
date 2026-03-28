import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { 
  ExportQuality, 
  PaperSize, 
  WatermarkSettings, 
  PrintMargins,
  ExportFormat,
  ExtendedExportSettings 
} from '~/types'

export interface ExportProgressCallback {
  (progress: number, message: string): void
}

export interface ExportOptions {
  quality: ExportQuality
  paperSize: PaperSize
  orientation: 'portrait' | 'landscape'
  margins: PrintMargins
  scale: number
  colorMode: 'color' | 'grayscale' | 'black-white'
  watermark?: WatermarkSettings
  onProgress?: ExportProgressCallback
}

// Paper size dimensions in mm
const PAPER_DIMENSIONS: Record<PaperSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
  custom: { width: 210, height: 297 },
}

// Quality scale mapping
const QUALITY_SCALE: Record<ExportQuality, number> = {
  draft: 1,
  standard: 2,
  high: 3,
  ultra: 4,
}

export function usePdfExport() {
  /**
   * Export an HTML element to PDF
   */
  async function exportToPdf(
    element: HTMLElement,
    filename: string,
    options: ExportOptions
  ): Promise<void> {
    const { onProgress } = options

    try {
      onProgress?.(10, 'Preparing export...')

      // Calculate canvas options based on quality
      const scale = options.scale * QUALITY_SCALE[options.quality]
      
      // Capture the element as canvas
      onProgress?.(20, 'Capturing canvas...')
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      })

      onProgress?.(50, 'Generating PDF...')

      // Get paper dimensions
      const paper = PAPER_DIMENSIONS[options.paperSize]
      let pdfWidth = paper.width
      let pdfHeight = paper.height

      // Swap dimensions for portrait
      if (options.orientation === 'portrait') {
        [pdfWidth, pdfHeight] = [pdfHeight, pdfWidth]
      }

      // Calculate content area (subtract margins)
      const contentWidth = pdfWidth - options.margins.left - options.margins.right
      const contentHeight = pdfHeight - options.margins.top - options.margins.bottom

      // Calculate image dimensions to fit content area
      const imgWidth = contentWidth
      const imgHeight = (canvas.height * contentWidth) / canvas.width

      // Check if content fits on one page
      const fitsOnOnePage = imgHeight <= contentHeight

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.paperSize === 'custom' ? [pdfWidth, pdfHeight] : options.paperSize,
      })

      // Apply color mode
      if (options.colorMode === 'grayscale' || options.colorMode === 'black-white') {
        // Note: jsPDF doesn't have built-in grayscale, but we can apply it to the canvas
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            if (options.colorMode === 'black-white') {
              const bw = avg > 128 ? 255 : 0
              data[i] = bw
              data[i + 1] = bw
              data[i + 2] = bw
            } else {
              data[i] = avg
              data[i + 1] = avg
              data[i + 2] = avg
            }
          }
          ctx.putImageData(imageData, 0, 0)
        }
      }

      // Add watermark if enabled
      if (options.watermark?.enabled) {
        onProgress?.(60, 'Adding watermark...')
        await addWatermarkToCanvas(canvas, options.watermark, scale)
      }

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png')

      if (fitsOnOnePage) {
        // Single page export
        pdf.addImage(
          imgData,
          'PNG',
          options.margins.left,
          options.margins.top,
          imgWidth,
          imgHeight
        )
      } else {
        // Multi-page export
        onProgress?.(70, 'Creating multi-page PDF...')
        const totalPages = Math.ceil(imgHeight / contentHeight)
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage()
          }
          
          const yOffset = page * contentHeight
          const remainingHeight = Math.min(contentHeight, imgHeight - yOffset)
          
          // Calculate source crop
          const sourceY = (yOffset / imgHeight) * canvas.height
          const sourceHeight = (remainingHeight / imgHeight) * canvas.height
          
          // Create temporary canvas for cropped image
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = canvas.width
          tempCanvas.height = sourceHeight
          const tempCtx = tempCanvas.getContext('2d')
          
          if (tempCtx) {
            tempCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sourceHeight,
              0,
              0,
              canvas.width,
              sourceHeight
            )
            
            const croppedImgData = tempCanvas.toDataURL('image/png')
            pdf.addImage(
              croppedImgData,
              'PNG',
              options.margins.left,
              options.margins.top,
              imgWidth,
              remainingHeight
            )
          }
          
          onProgress?.(70 + (page / totalPages) * 20, `Processing page ${page + 1} of ${totalPages}...`)
        }
      }

      onProgress?.(95, 'Saving PDF...')
      pdf.save(`${filename}.pdf`)
      onProgress?.(100, 'Export complete!')
    } catch (error) {
      console.error('PDF export failed:', error)
      onProgress?.(0, 'Export failed')
      throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Export an HTML element to PNG
   */
  async function exportToPng(
    element: HTMLElement,
    filename: string,
    options: ExportOptions
  ): Promise<void> {
    const { onProgress } = options

    try {
      onProgress?.(10, 'Preparing export...')

      const scale = options.scale * QUALITY_SCALE[options.quality]
      
      onProgress?.(20, 'Capturing canvas...')
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: options.colorMode === 'black-white' ? '#ffffff' : undefined,
        allowTaint: true,
      })

      onProgress?.(50, 'Processing image...')

      // Apply color mode
      if (options.colorMode === 'grayscale' || options.colorMode === 'black-white') {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            if (options.colorMode === 'black-white') {
              const bw = avg > 128 ? 255 : 0
              data[i] = bw
              data[i + 1] = bw
              data[i + 2] = bw
            } else {
              data[i] = avg
              data[i + 1] = avg
              data[i + 2] = avg
            }
          }
          ctx.putImageData(imageData, 0, 0)
        }
      }

      // Add watermark if enabled
      if (options.watermark?.enabled) {
        onProgress?.(60, 'Adding watermark...')
        await addWatermarkToCanvas(canvas, options.watermark, scale)
      }

      onProgress?.(90, 'Saving image...')
      
      // Create download link
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      onProgress?.(100, 'Export complete!')
    } catch (error) {
      console.error('PNG export failed:', error)
      onProgress?.(0, 'Export failed')
      throw new Error(`Failed to export PNG: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Export an HTML element to JPG
   */
  async function exportToJpg(
    element: HTMLElement,
    filename: string,
    options: ExportOptions
  ): Promise<void> {
    const { onProgress } = options

    try {
      onProgress?.(10, 'Preparing export...')

      const scale = options.scale * QUALITY_SCALE[options.quality]
      
      onProgress?.(20, 'Capturing canvas...')
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      })

      onProgress?.(50, 'Processing image...')

      // Apply color mode
      if (options.colorMode === 'grayscale' || options.colorMode === 'black-white') {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            if (options.colorMode === 'black-white') {
              const bw = avg > 128 ? 255 : 0
              data[i] = bw
              data[i + 1] = bw
              data[i + 2] = bw
            } else {
              data[i] = avg
              data[i + 1] = avg
              data[i + 2] = avg
            }
          }
          ctx.putImageData(imageData, 0, 0)
        }
      }

      // Add watermark if enabled
      if (options.watermark?.enabled) {
        onProgress?.(60, 'Adding watermark...')
        await addWatermarkToCanvas(canvas, options.watermark, scale)
      }

      onProgress?.(90, 'Saving image...')
      
      // Create download link
      const link = document.createElement('a')
      link.download = `${filename}.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.95)
      link.click()
      
      onProgress?.(100, 'Export complete!')
    } catch (error) {
      console.error('JPG export failed:', error)
      onProgress?.(0, 'Export failed')
      throw new Error(`Failed to export JPG: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Export with extended settings
   */
  async function exportWithSettings(
    element: HTMLElement,
    filename: string,
    settings: ExtendedExportSettings,
    watermark?: WatermarkSettings,
    onProgress?: ExportProgressCallback
  ): Promise<void> {
    const options: ExportOptions = {
      quality: settings.quality,
      paperSize: settings.paperSize,
      orientation: settings.orientation,
      margins: settings.margins,
      scale: settings.scale,
      colorMode: settings.colorMode,
      watermark,
      onProgress,
    }

    switch (settings.format) {
      case 'pdf':
        await exportToPdf(element, filename, options)
        break
      case 'png':
        await exportToPng(element, filename, options)
        break
      case 'jpg':
        await exportToJpg(element, filename, options)
        break
      case 'svg':
        // SVG export would require a different approach
        throw new Error('SVG export is not yet implemented')
      default:
        throw new Error(`Unsupported export format: ${settings.format}`)
    }
  }

  return {
    exportToPdf,
    exportToPng,
    exportToJpg,
    exportWithSettings,
  }
}

/**
 * Add watermark to canvas
 */
async function addWatermarkToCanvas(
  canvas: HTMLCanvasElement,
  watermark: WatermarkSettings,
  scale: number
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { text, position, fontFamily, fontSize, fontWeight, color, opacity, rotation, margin } = watermark

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = color
  ctx.font = `${fontWeight} ${fontSize * scale}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const textMetrics = ctx.measureText(text)
  const textWidth = textMetrics.width
  const textHeight = fontSize * scale

  // Calculate position
  let x: number, y: number

  switch (position) {
    case 'top-left':
      x = margin * scale + textWidth / 2
      y = margin * scale + textHeight / 2
      break
    case 'top-center':
      x = canvas.width / 2
      y = margin * scale + textHeight / 2
      break
    case 'top-right':
      x = canvas.width - margin * scale - textWidth / 2
      y = margin * scale + textHeight / 2
      break
    case 'bottom-left':
      x = margin * scale + textWidth / 2
      y = canvas.height - margin * scale - textHeight / 2
      break
    case 'bottom-center':
      x = canvas.width / 2
      y = canvas.height - margin * scale - textHeight / 2
      break
    case 'bottom-right':
      x = canvas.width - margin * scale - textWidth / 2
      y = canvas.height - margin * scale - textHeight / 2
      break
    case 'center':
    default:
      x = canvas.width / 2
      y = canvas.height / 2
      break
  }

  // Apply rotation
  if (rotation !== 0) {
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-x, -y)
  }

  ctx.fillText(text, x, y)
  ctx.restore()
}
