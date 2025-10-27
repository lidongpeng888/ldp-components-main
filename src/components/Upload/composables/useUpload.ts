/**
 * 上传组件主要逻辑组合函数
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { UploadFile } from 'ant-design-vue'
import type { CustomUploadProps, CustomUploadEmits, UploadError } from '../types'
import { validateFile } from '../utils'
import {
  useUploadQueue,
  useDragUpload,
  usePasteUpload,
  useFilePreview,
  useUploadStats
} from '../hooks'

export function useUpload(props: CustomUploadProps, emit: CustomUploadEmits) {
  // 组件引用
  const uploadRef = ref()

  // 响应式数据
  const fileList = ref<UploadFile[]>([])
  const validationErrors = ref<string[]>([])

  // 使用各种 hooks
  const uploadQueue = useUploadQueue(props.concurrent, props.retryCount)
  const dragUpload = useDragUpload()
  const pasteUpload = usePasteUpload()
  const filePreview = useFilePreview()
  const uploadStats = useUploadStats(fileList)

  // 计算属性
  const uploadClasses = computed(() => {
    return [
      'custom-upload',
      {
        'custom-upload--drag': props.dragUpload,
        'custom-upload--paste': props.pasteUpload,
        'custom-upload--drag-over': dragUpload.isDragOver.value
      },
      props.className
    ]
  })

  // 透传给 a-upload 的属性
  const uploadProps = computed(() => {
    const { 
      validation, 
      preview, 
      dragUpload, 
      pasteUpload, 
      concurrent, 
      retryCount, 
      autoUpload,
      beforeUpload,
      customRequest,
      className,
      style,
      ...antProps 
    } = props
    
    return antProps
  })

  // 文件上传前的处理
  const handleBeforeUpload = async (file: File, fileList: File[]) => {
    // 文件验证
    if (props.validation) {
      const currentFiles = fileList.slice(0, -1) // 排除当前文件
      const validationResult = await validateFile(file, props.validation, currentFiles)
      
      if (!validationResult.valid) {
        validationErrors.value.push(validationResult.error || '文件验证失败')
        // emit('validation-error', file, validationResult.error || '文件验证失败')
        return false
      }
    }
    
    // 调用用户自定义的 beforeUpload
    if (props.beforeUpload) {
      const result = await props.beforeUpload(file, fileList)
      if (result === false) {
        return false
      }
      if (result instanceof File) {
        return result
      }
    }
    
    // 如果不是自动上传，返回 false 阻止默认上传行为
    return props.autoUpload !== false
  }

  // 自定义上传请求
  const handleCustomRequest = (options: any) => {
    const { file, onProgress, onSuccess, onError } = options
    
    // 检查并发限制
    if (!uploadQueue.checkConcurrentLimit(file)) {
      return
    }
    
    // 如果用户提供了自定义请求处理函数，使用它
    if (props.customRequest) {
      props.customRequest(options)
      return
    }
    
    // 否则使用默认的模拟上传或队列管理
    uploadQueue.startUpload(file, { onProgress, onSuccess, onError }, props.customRequest)
  }

  // 文件状态改变处理
  const handleChange = (info: { file: UploadFile; fileList: UploadFile[] }) => {
    fileList.value = info.fileList
    emit('change', info)
  }

  // 文件移除处理
  const handleRemove = (file: UploadFile) => {
    emit('remove', file)
    return true
  }

  // 添加文件到列表
  const addFileToList = (file: UploadFile) => {
    fileList.value.push(file)
  }

  // 上传文件
  const uploadFile = (file: UploadFile) => {
    handleCustomRequest({
      file,
      onProgress: (event: ProgressEvent) => {
        const percent = Math.round((event.loaded / event.total!) * 100)
        file.percent = percent
      },
      onSuccess: (response: any) => {
        file.status = 'done'
        file.response = response
        emit('success', file, response)
      },
      onError: (error: Error) => {
        file.status = 'error'
        file.error = error
        const uploadError: UploadError = {
          file,
          error,
          retryable: true
        }
        emit('error', uploadError)
      }
    })
  }

  // 移除验证错误
  const removeValidationError = (index: number) => {
    validationErrors.value.splice(index, 1)
  }

  // 手动上传
  const upload = () => {
    uploadRef.value?.upload()
  }

  // 清空文件列表
  const clearFiles = () => {
    fileList.value = []
    uploadQueue.clearUploadState()
    validationErrors.value = []
  }

  // 重试失败的文件
  const retry = (file?: UploadFile) => {
    if (file) {
      // 重试指定文件
      const fileIndex = fileList.value.findIndex(f => f.uid === file.uid)
      if (fileIndex !== -1 && file.status === 'error') {
        file.status = 'uploading'
        file.percent = 0
        
        // 重置重试计数
        const uploadInfo = uploadQueue.uploadingFiles.value.get(file.uid)
        if (uploadInfo) {
          uploadInfo.retryCount = 0
        }
        
        // 重新触发上传
        uploadFile(file)
      }
    } else {
      // 重试所有失败的文件
      const failedFiles = fileList.value.filter(f => f.status === 'error')
      failedFiles.forEach(failedFile => {
        retry(failedFile)
      })
    }
  }

  // 获取文件列表
  const getFileList = () => {
    return fileList.value
  }

  // 添加文件
  const addFiles = (files: File[]) => {
    files.forEach(file => {
      const uploadFile: UploadFile = {
        uid: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
        status: 'uploading'
      }
      fileList.value.push(uploadFile)
    })
  }

  // 移除文件
  const removeFile = (file: UploadFile) => {
    const index = fileList.value.findIndex(f => f.uid === file.uid)
    if (index !== -1) {
      fileList.value.splice(index, 1)
    }
  }

  // 监听文件列表变化
  watch(() => props.fileList, (newFileList) => {
    if (newFileList) {
      fileList.value = [...newFileList]
    }
  }, { immediate: true })

  // 组件挂载时的处理
  onMounted(() => {
    // 初始化粘贴上传
    const handlePasteEvent = (event: ClipboardEvent) => {
      pasteUpload.handlePaste(event, {
        pasteUpload: props.pasteUpload,
        validation: props.validation,
        beforeUpload: props.beforeUpload,
        autoUpload: props.autoUpload,
        fileList: fileList.value,
        emit,
        onFileAdd: addFileToList,
        onUpload: uploadFile
      })
    }

    pasteUpload.initPasteUpload(props.pasteUpload, handlePasteEvent)
  })

  // 组件卸载时的清理
  onUnmounted(() => {
    const handlePasteEvent = (event: ClipboardEvent) => {
      pasteUpload.handlePaste(event, {
        pasteUpload: props.pasteUpload,
        validation: props.validation,
        beforeUpload: props.beforeUpload,
        autoUpload: props.autoUpload,
        fileList: fileList.value,
        emit,
        onFileAdd: addFileToList,
        onUpload: uploadFile
      })
    }

    pasteUpload.cleanupPasteUpload(props.pasteUpload, handlePasteEvent)
    uploadQueue.clearUploadState()
  })

  return {
    // refs
    uploadRef,
    fileList,
    validationErrors,
    
    // computed
    uploadClasses,
    uploadProps,
    ...uploadStats,
    
    // hooks
    dragUpload,
    pasteUpload,
    filePreview,
    
    // methods
    handleBeforeUpload,
    handleCustomRequest,
    handleChange,
    handleRemove,
    removeValidationError,
    upload,
    clearFiles,
    retry,
    getFileList,
    addFiles,
    removeFile,
    addFileToList,
    uploadFile
  }
}