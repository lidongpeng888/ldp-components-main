/**
 * 文件预览工具函数
 */

import type { UploadFile } from 'ant-design-vue'
import type { FilePreviewInfo } from './types'
import { getFileType, isImageFile, isVideoFile, isDocumentFile } from '../utils'

/**
 * 获取文件预览信息
 * @param file 文件对象
 * @returns 预览信息
 */
export function getFilePreviewInfo(file: UploadFile): FilePreviewInfo {
  const originFile = file.originFileObj
  if (!originFile) {
    return {
      type: 'other',
      src: file.url || '',
      size: {}
    }
  }

  const fileType = getFileType(originFile)
  const src = file.url || URL.createObjectURL(originFile)

  const info: FilePreviewInfo = {
    type: fileType as any,
    src,
    size: {}
  }

  // 图片文件处理
  if (isImageFile(originFile)) {
    info.type = 'image'
    // 图片尺寸信息需要异步获取
    getImageDimensions(src).then(dimensions => {
      info.size = dimensions
    })
  }

  // 视频文件处理
  if (isVideoFile(originFile)) {
    info.type = 'video'
    // 视频信息需要异步获取
    getVideoInfo(src).then(videoInfo => {
      info.duration = videoInfo.duration
      info.size = videoInfo.size
      info.poster = videoInfo.poster
    })
  }

  // 文档文件处理
  if (isDocumentFile(originFile)) {
    info.type = 'document'
    // PDF 页数等信息需要异步获取
    if (originFile.type === 'application/pdf') {
      getPdfInfo(src).then(pdfInfo => {
        info.pages = pdfInfo.pages
      })
    }
  }

  return info
}

/**
 * 获取图片尺寸
 * @param src 图片地址
 * @returns Promise<{width: number, height: number}>
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = reject
    img.src = src
  })
}

/**
 * 获取视频信息
 * @param src 视频地址
 * @returns Promise<视频信息>
 */
export function getVideoInfo(src: string): Promise<{
  duration: number
  size: { width: number; height: number }
  poster: string
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      // 生成封面图
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      video.currentTime = Math.min(1, video.duration * 0.1) // 取10%位置作为封面
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const poster = canvas.toDataURL('image/jpeg', 0.8)
          
          resolve({
            duration: video.duration,
            size: {
              width: video.videoWidth,
              height: video.videoHeight
            },
            poster
          })
        }
      }
    }
    
    video.onerror = reject
    video.src = src
  })
}

/**
 * 获取PDF信息
 * @param src PDF地址
 * @returns Promise<PDF信息>
 */
export function getPdfInfo(src: string): Promise<{ pages: number }> {
  return new Promise((resolve) => {
    // 这里需要使用 PDF.js 库来解析PDF
    // 为了简化，先返回默认值
    // 实际项目中需要引入 pdfjs-dist 库
    
    // 模拟异步获取PDF页数
    setTimeout(() => {
      resolve({ pages: 1 })
    }, 100)
  })
}

/**
 * 生成缩略图
 * @param file 文件对象
 * @param size 缩略图尺寸
 * @returns Promise<缩略图URL>
 */
export function generateThumbnail(file: File, size: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    if (isImageFile(file)) {
      // 图片缩略图
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        // 计算缩略图尺寸，保持宽高比
        const { width, height } = calculateThumbnailSize(
          img.naturalWidth,
          img.naturalHeight,
          size
        )
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    } else if (isVideoFile(file)) {
      // 视频缩略图
      getVideoInfo(URL.createObjectURL(file))
        .then(info => resolve(info.poster))
        .catch(reject)
    } else {
      // 其他文件类型使用默认图标
      resolve(getDefaultFileIcon(file))
    }
  })
}

/**
 * 计算缩略图尺寸
 * @param originalWidth 原始宽度
 * @param originalHeight 原始高度
 * @param maxSize 最大尺寸
 * @returns 缩略图尺寸
 */
export function calculateThumbnailSize(
  originalWidth: number,
  originalHeight: number,
  maxSize: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight
  
  if (originalWidth > originalHeight) {
    return {
      width: maxSize,
      height: Math.round(maxSize / aspectRatio)
    }
  } else {
    return {
      width: Math.round(maxSize * aspectRatio),
      height: maxSize
    }
  }
}

/**
 * 获取默认文件图标
 * @param file 文件对象
 * @returns 图标URL或类名
 */
export function getDefaultFileIcon(file: File): string {
  const fileType = getFileType(file)
  
  // 这里可以返回对应的图标URL或者CSS类名
  const iconMap = {
    document: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDhIMzZMNTIgMjRWNTZIMTJWOFoiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0zNiA4VjI0SDUyIiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K',
    video: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iOCIgeT0iMTYiIHdpZHRoPSI0OCIgaGVpZ2h0PSIzMiIgcng9IjQiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjxwb2x5Z29uIHBvaW50cz0iMjYsMjQgMjYsNDAgMzgsMzIiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+Cg==',
    audio: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjQiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjxwb2x5Z29uIHBvaW50cz0iMjgsMjAgMjgsNDQgNDQsMzIiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+Cg==',
    archive: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTIiIHk9IjEyIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMjAgMjhIMzJNMjAgMzZINDQiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=',
    other: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTYiIHk9IjEyIiB3aWR0aD0iMzIiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMzIgMjhWMzYiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSI0MCIgcj0iMiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K'
  }
  
  return iconMap[fileType as keyof typeof iconMap] || iconMap.other
}

/**
 * 检查是否支持预览
 * @param file 文件对象
 * @returns 是否支持预览
 */
export function isPreviewSupported(file: File): boolean {
  return isImageFile(file) || isVideoFile(file) || isDocumentFile(file)
}

/**
 * 格式化视频时长
 * @param duration 时长（秒）
 * @returns 格式化后的时长字符串
 */
export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

/**
 * 清理预览资源
 * @param src 资源URL
 */
export function cleanupPreviewResource(src: string): void {
  if (src.startsWith('blob:')) {
    URL.revokeObjectURL(src)
  }
}