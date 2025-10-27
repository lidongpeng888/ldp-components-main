/**
 * Upload 组件工具函数
 * 提供文件验证、类型检测、大小格式化等功能
 */

import type { FileValidationRule, FileType } from './types'
import { FILE_TYPE_CONFIG } from './types'

/**
 * 获取文件类型
 * @param file 文件对象
 * @returns 文件类型
 */
export function getFileType(file: File): FileType {
  const { type, name } = file
  const extension = name.toLowerCase().substring(name.lastIndexOf('.'))
  
  // 检查图片类型
  if (type.startsWith('image/') || FILE_TYPE_CONFIG.image.extensions.includes(extension)) {
    return 'image' as FileType
  }
  
  // 检查文档类型
  if (type.includes('pdf') || type.includes('document') || type.includes('text') || 
      FILE_TYPE_CONFIG.document.extensions.includes(extension)) {
    return 'document' as FileType
  }
  
  // 检查视频类型
  if (type.startsWith('video/') || FILE_TYPE_CONFIG.video.extensions.includes(extension)) {
    return 'video' as FileType
  }
  
  // 检查音频类型
  if (type.startsWith('audio/') || FILE_TYPE_CONFIG.audio.extensions.includes(extension)) {
    return 'audio' as FileType
  }
  
  // 检查压缩文件类型
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') ||
      FILE_TYPE_CONFIG.archive.extensions.includes(extension)) {
    return 'archive' as FileType
  }
  
  return 'other' as FileType
}

/**
 * 验证文件类型
 * @param file 文件对象
 * @param allowedTypes 允许的类型数组
 * @returns 是否通过验证
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  if (!allowedTypes || allowedTypes.length === 0) return true
  
  const { type, name } = file
  const extension = name.toLowerCase().substring(name.lastIndexOf('.'))
  
  return allowedTypes.some(allowedType => {
    // 检查 MIME 类型
    if (allowedType.includes('/')) {
      return type === allowedType || type.startsWith(allowedType.split('/')[0] + '/')
    }
    // 检查文件扩展名
    if (allowedType.startsWith('.')) {
      return extension === allowedType.toLowerCase()
    }
    // 检查通用类型 (如 'image', 'document')
    return type.startsWith(allowedType + '/')
  })
}

/**
 * 验证文件大小
 * @param file 文件对象
 * @param maxSize 最大大小 (MB)
 * @returns 是否通过验证
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  if (!maxSize) return true
  const fileSizeMB = file.size / (1024 * 1024)
  return fileSizeMB <= maxSize
}

/**
 * 验证文件数量
 * @param currentCount 当前文件数量
 * @param maxCount 最大文件数量
 * @returns 是否通过验证
 */
export function validateFileCount(currentCount: number, maxCount: number): boolean {
  if (!maxCount) return true
  return currentCount < maxCount
}

/**
 * 验证总文件大小
 * @param files 文件数组
 * @param maxTotalSize 最大总大小 (MB)
 * @returns 是否通过验证
 */
export function validateTotalSize(files: File[], maxTotalSize: number): boolean {
  if (!maxTotalSize) return true
  const totalSizeMB = files.reduce((total, file) => total + file.size, 0) / (1024 * 1024)
  return totalSizeMB <= maxTotalSize
}

/**
 * 综合文件验证
 * @param file 文件对象
 * @param rule 验证规则
 * @param currentFiles 当前文件列表
 * @returns 验证结果 { valid: boolean, error?: string }
 */
export async function validateFile(
  file: File, 
  rule: FileValidationRule, 
  currentFiles: File[] = []
): Promise<{ valid: boolean; error?: string }> {
  // 验证文件类型
  if (rule.types && !validateFileType(file, rule.types)) {
    return {
      valid: false,
      error: `不支持的文件类型。支持的类型: ${rule.types.join(', ')}`
    }
  }
  
  // 验证文件大小
  if (rule.maxSize && !validateFileSize(file, rule.maxSize)) {
    return {
      valid: false,
      error: `文件大小超出限制。最大允许: ${rule.maxSize}MB，当前: ${formatFileSize(file.size)}`
    }
  }
  
  // 验证文件数量
  if (rule.maxCount && !validateFileCount(currentFiles.length, rule.maxCount)) {
    return {
      valid: false,
      error: `文件数量超出限制。最大允许: ${rule.maxCount}个`
    }
  }
  
  // 验证总文件大小
  const allFiles = [...currentFiles, file]
  if (rule.maxTotalSize && !validateTotalSize(allFiles, rule.maxTotalSize)) {
    return {
      valid: false,
      error: `总文件大小超出限制。最大允许: ${rule.maxTotalSize}MB`
    }
  }
  
  // 自定义验证
  if (rule.validator) {
    try {
      const result = await rule.validator(file)
      if (typeof result === 'boolean') {
        return { valid: result, error: result ? undefined : '文件验证失败' }
      } else if (typeof result === 'string') {
        return { valid: false, error: result }
      }
    } catch (error) {
      return { valid: false, error: '文件验证过程中发生错误' }
    }
  }
  
  return { valid: true }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

/**
 * 检查文件是否为图片
 * @param file 文件对象
 * @returns 是否为图片
 */
export function isImageFile(file: File): boolean {
  return getFileType(file) === 'image'
}

/**
 * 检查文件是否为视频
 * @param file 文件对象
 * @returns 是否为视频
 */
export function isVideoFile(file: File): boolean {
  return getFileType(file) === 'video'
}

/**
 * 检查文件是否为文档
 * @param file 文件对象
 * @returns 是否为文档
 */
export function isDocumentFile(file: File): boolean {
  return getFileType(file) === 'document'
}

/**
 * 生成文件预览 URL
 * @param file 文件对象
 * @returns 预览 URL
 */
export function createFilePreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 释放文件预览 URL
 * @param url 预览 URL
 */
export function revokeFilePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * 从粘贴事件中提取文件
 * @param event 粘贴事件
 * @returns 文件数组
 */
export function extractFilesFromPaste(event: ClipboardEvent): File[] {
  const files: File[] = []
  const items = event.clipboardData?.items
  
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          files.push(file)
        }
      }
    }
  }
  
  return files
}

/**
 * 计算上传速度
 * @param loaded 已上传字节数
 * @param startTime 开始时间
 * @returns 上传速度 (bytes/second)
 */
export function calculateUploadSpeed(loaded: number, startTime: number): number {
  const elapsed = (Date.now() - startTime) / 1000 // 秒
  return elapsed > 0 ? loaded / elapsed : 0
}

/**
 * 估算剩余时间
 * @param loaded 已上传字节数
 * @param total 总字节数
 * @param speed 上传速度 (bytes/second)
 * @returns 剩余时间 (秒)
 */
export function estimateRemainingTime(loaded: number, total: number, speed: number): number {
  if (speed <= 0) return Infinity
  const remaining = total - loaded
  return remaining / speed
}

/**
 * 格式化剩余时间
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatRemainingTime(seconds: number): string {
  if (!isFinite(seconds)) return '计算中...'
  
  if (seconds < 60) {
    return `${Math.ceil(seconds)}秒`
  } else if (seconds < 3600) {
    return `${Math.ceil(seconds / 60)}分钟`
  } else {
    return `${Math.ceil(seconds / 3600)}小时`
  }
}