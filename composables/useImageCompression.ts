import Compressor from 'compressorjs'
import type { CompressionOptions, CompressedImage } from '~/types'

/**
 * Image Compression Composable
 * Compresses uploaded images with configurable quality and size limits
 */
export function useImageCompression() {
  const isCompressing = ref(false)
  const compressionProgress = ref(0)

  /**
   * Compress an image file
   */
  async function compressImage(
    file: File,
    options: CompressionOptions = {}
  ): Promise<CompressedImage> {
    const {
      maxWidth = 800,
      maxHeight = 800,
      quality = 0.8,
      format = 'image/webp',
    } = options

    isCompressing.value = true
    compressionProgress.value = 0

    return new Promise((resolve, reject) => {
      new Compressor(file, {
        maxWidth,
        maxHeight,
        quality,
        mimeType: format,
        success(result) {
          compressionProgress.value = 100
          isCompressing.value = false

          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
              resolve({
                dataUrl: e.target?.result as string,
                blob: result,
                width: img.width,
                height: img.height,
                originalSize: file.size,
                compressedSize: result.size,
                format,
              })
            }
            img.onerror = () => reject(new Error('Failed to load compressed image'))
            img.src = e.target?.result as string
          }
          reader.onerror = () => reject(new Error('Failed to read compressed image'))
          reader.readAsDataURL(result)
        },
        error(err) {
          isCompressing.value = false
          reject(new Error(`Image compression failed: ${err.message}`))
        },
      })
    })
  }

  /**
   * Generate a thumbnail from an image
   */
  async function generateThumbnail(
    file: File,
    maxSize: number = 150
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          ctx.drawImage(img, 0, 0, width, height)

          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
        img.onerror = () => reject(new Error('Failed to generate thumbnail'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file for thumbnail'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Validate an image file
   */
  function validateFile(
    file: File,
    maxSize: number = 5 * 1024 * 1024, // 5MB
    allowedTypes: string[] = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  ): { valid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      return {
        valid: false,
        error: `File size exceeds maximum of ${maxSizeMB}MB`,
      }
    }

    return { valid: true }
  }

  /**
   * Get image dimensions from file
   */
  async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Convert data URL to blob
   */
  function dataUrlToBlob(dataUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      fetch(dataUrl)
        .then(res => res.blob())
        .then(resolve)
        .catch(reject)
    })
  }

  /**
   * Format file size for display
   */
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return {
    isCompressing,
    compressionProgress,
    compressImage,
    generateThumbnail,
    validateFile,
    getImageDimensions,
    dataUrlToBlob,
    formatFileSize,
  }
}
