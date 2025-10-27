/**
 * 拖拽上传功能 Hook
 */

import { ref } from 'vue'
import type { UploadFile } from 'ant-design-vue'
import { validateFile } from '../utils'
import type { FileValidationRule } from '../types'

export function useDragUpload() {
  // 拖拽状态
  const isDragOver = ref(false)
  const dragCounter = ref(0)

  // 拖拽事件处理
  const handleDragEnter = (event: DragEvent, dragUpload: boolean) => {
    if (!dragUpload) return
    
    event.preventDefault()
    event.stopPropagation()
    
    dragCounter.value++
    if (dragCounter.value === 1) {
      isDragOver.value = true
    }
  }

  const handleDragLeave = (event: DragEvent, dragUpload: boolean) => {
    if (!dragUpload) return
    
    event.preventDefault()
    event.stopPropagation()
    
    dragCounter.value--
    if (dragCounter.value === 0) {
      isDragOver.value = false
    }
  }

  const handleDragOver = (event: DragEvent, dragUpload: boolean) => {
    if (!dragUpload) return
    
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = async (
    event: DragEvent,
    dragUpload: boolean,
    options: {
      validation?: FileValidationRule
      beforeUpload?: Function
      autoUpload: boolean
      fileList: UploadFile[]
      emit: Function
      onFileAdd: (file: UploadFile) => void
      onUpload: (file: UploadFile) => void
    }
  ) => {
    if (!dragUpload) return
    
    event.preventDefault()
    event.stopPropagation()
    
    isDragOver.value = false
    dragCounter.value = 0
    
    const files = Array.from(event.dataTransfer?.files || [])
    if (files.length > 0) {
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
        
        // 创建 UploadFile 对象
        const uploadFile: UploadFile = {
          uid: `drag-${Date.now()}-${Math.random()}`,
          name: file.name,
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

  return {
    isDragOver,
    dragCounter,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop
  }
}