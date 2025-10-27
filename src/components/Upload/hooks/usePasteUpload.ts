/**
 * 粘贴上传功能 Hook
 */

import { ref, onMounted, onUnmounted } from 'vue'
import type { UploadFile } from 'ant-design-vue'
import { extractFilesFromPaste, validateFile } from '../utils'
import type { FileValidationRule } from '../types'

export function usePasteUpload() {
  // 粘贴上传状态
  const pasteEnabled = ref(false)

  // 粘贴上传处理
  const handlePaste = async (
    event: ClipboardEvent,
    options: {
      pasteUpload: boolean
      validation?: FileValidationRule
      beforeUpload?: Function
      autoUpload: boolean
      fileList: UploadFile[]
      emit: Function
      onFileAdd: (file: UploadFile) => void
      onUpload: (file: UploadFile) => void
    }
  ) => {
    if (!options.pasteUpload) return
    
    // 只处理图片粘贴，避免干扰其他粘贴操作
    const items = event.clipboardData?.items
    if (!items) return
    
    let hasImageFile = false
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
        hasImageFile = true
        break
      }
    }
    
    if (!hasImageFile) return
    
    event.preventDefault()
    
    const files = extractFilesFromPaste(event)
    if (files.length > 0) {
      options.emit('paste', files)
      
      // 显示粘贴成功提示
      showPasteSuccess(files.length)
      
      // 对每个文件进行验证和处理
      for (const file of files) {
        // 文件验证
        if (options.validation) {
          const validationResult = await validateFile(
            file, 
            options.validation, 
            options.fileList.map(f => f.originFileObj!).filter(Boolean)
          )
          
          if (!validationResult.valid) {
            options.emit('validation-error', file, validationResult.error || '文件验证失败')
            continue
          }
        }
        
        // 调用用户自定义的 beforeUpload
        if (options.beforeUpload) {
          const result = await options.beforeUpload(file, files)
          if (result === false) {
            continue
          }
        }
        
        // 创建 UploadFile 对象，为粘贴的图片生成合适的文件名
        const timestamp = Date.now()
        const extension = file.type.split('/')[1] || 'png'
        const uploadFile: UploadFile = {
          uid: `paste-${timestamp}-${Math.random()}`,
          name: file.name || `pasted-image-${timestamp}.${extension}`,
          size: file.size,
          type: file.type,
          originFileObj: file,
          status: 'uploading'
        }
        
        // 添加到文件列表
        options.onFileAdd(uploadFile)
        
        // 如果启用自动上传，触发上传
        if (options.autoUpload) {
          options.onUpload(uploadFile)
        }
      }
    }
  }

  // 显示粘贴成功提示
  const showPasteSuccess = (count: number) => {
    const hint = document.querySelector('.upload-paste-hint') as HTMLElement
    if (hint) {
      const originalText = hint.textContent
      hint.textContent = `已粘贴 ${count} 个文件`
      hint.style.color = '#52c41a'
      
      setTimeout(() => {
        hint.textContent = originalText
        hint.style.color = '#999'
      }, 2000)
    }
  }

  // 初始化粘贴上传
  const initPasteUpload = (pasteUpload: boolean, handlePasteEvent: (event: ClipboardEvent) => void) => {
    if (pasteUpload) {
      pasteEnabled.value = true
      document.addEventListener('paste', handlePasteEvent)
    }
  }

  // 清理粘贴上传
  const cleanupPasteUpload = (pasteUpload: boolean, handlePasteEvent: (event: ClipboardEvent) => void) => {
    if (pasteUpload) {
      document.removeEventListener('paste', handlePasteEvent)
    }
  }

  return {
    pasteEnabled,
    handlePaste,
    showPasteSuccess,
    initPasteUpload,
    cleanupPasteUpload
  }
}