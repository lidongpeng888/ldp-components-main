<template>
  <div class="custom-upload">
    <!-- 拖拽上传模式 -->
    <a-upload-dragger
      v-if="props.dragUpload"
      ref="uploadRef"
      :action="props.action"
      :multiple="props.multiple"
      :accept="props.accept"
      :disabled="props.disabled"
      v-model:file-list="fileList"
      :before-upload="handleBeforeUpload"
      :custom-request="props.customRequest"
      :show-upload-list="{
        showPreviewIcon: props.preview,
        showRemoveIcon: true,
        showDownloadIcon: false
      }"
      @change="handleChange"
      @remove="handleRemove"
      @preview="handlePreview"
    >
      <slot name="dragRender">
        <div class="upload-drag-content">
          <p class="upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="upload-drag-text">点击或拖拽文件到此区域上传</p>
          <p class="upload-drag-hint">
            <slot name="hint">
              支持单个或批量上传
            </slot>
          </p>
        </div>
      </slot>
    </a-upload-dragger>
    
    <!-- 普通上传模式 -->
    <a-upload
      v-else
      ref="uploadRef"
      :action="props.action"
      :multiple="props.multiple"
      :accept="props.accept"
      :disabled="props.disabled"
      v-model:file-list="fileList"
      :before-upload="handleBeforeUpload"
      :custom-request="props.customRequest"
      :show-upload-list="{
        showPreviewIcon: props.preview,
        showRemoveIcon: true,
        showDownloadIcon: false
      }"
      @change="handleChange"
      @remove="handleRemove"
      @preview="handlePreview"
    >
      <slot>
        <a-button :disabled="props.disabled">
          <UploadOutlined />
          上传文件
        </a-button>
      </slot>
    </a-upload>
    
    <!-- 文件验证错误提示 -->
    <div v-if="validationErrors.length > 0" class="upload-validation-errors">
      <a-alert
        v-for="(error, index) in validationErrors"
        :key="index"
        :message="error"
        type="error"
        show-icon
        closable
        @close="removeValidationError(index)"
      />
    </div>
    
    <!-- 粘贴上传提示 -->
    <div v-if="props.pasteUpload" class="upload-paste-hint">
      <span>支持 Ctrl+V 粘贴图片上传</span>
    </div>
    
    <!-- 上传队列状态 -->
    <div v-if="uploadQueue.length > 0 || currentUploading.size > 0" class="upload-queue-status">
      <span>队列中: {{ uploadQueue.length }} | 上传中: {{ currentUploading.size }}</span>
    </div>
    
    <!-- 预览模态框 -->
    <PreviewModal
      v-if="props.preview"
      ref="previewModalRef"
      :image-config="props.previewConfig?.image"
      :video-config="props.previewConfig?.video"
      :document-config="props.previewConfig?.document"
      @open="handlePreviewOpen"
      @close="handlePreviewClose"
      @load="handlePreviewLoad"
      @error="handlePreviewError"
      @download="handlePreviewDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Upload as AUpload, UploadDragger as AUploadDragger, Button as AButton, Alert as AAlert, message } from 'ant-design-vue'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons-vue'
import type { UploadFile, UploadChangeParam } from 'ant-design-vue'
import type { SimpleUploadProps, SimpleUploadEmits, UploadProgress, UploadError } from './types'
import { useFilePreview } from './hooks/useFilePreview'
import { useUploadQueue } from './hooks/useUploadQueue'
import { usePasteUpload } from './hooks/usePasteUpload'
import PreviewModal from './Preview/PreviewModal.vue'

// 定义组件名称
defineOptions({
  name: 'CustomUpload'
})

// 扩展 Props 接口以支持高级功能
interface ExtendedUploadProps extends SimpleUploadProps {
  // 预览功能配置
  preview?: boolean
  previewConfig?: {
    image?: {
      zoom?: boolean
      rotate?: boolean
      fullscreen?: boolean
    }
    video?: {
      controls?: boolean
      autoplay?: boolean
    }
    document?: {
      navigation?: boolean
      download?: boolean
    }
  }
  
  // 高级功能配置
  concurrent?: number // 并发上传数量
  retryCount?: number // 重试次数
  pasteUpload?: boolean // 粘贴上传
  autoUpload?: boolean // 自动上传
}

// 定义 Props - 使用扩展的接口
const props = withDefaults(defineProps<ExtendedUploadProps>(), {
  dragUpload: false,
  multiple: false,
  disabled: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  maxSize: 10,
  maxCount: 10,
  allowedTypes: () => [],
  preview: true,
  previewConfig: () => ({
    image: {
      zoom: true,
      rotate: true,
      fullscreen: true
    },
    video: {
      controls: true,
      autoplay: false
    },
    document: {
      navigation: true,
      download: true
    }
  }),
  // 高级功能默认值
  concurrent: 3,
  retryCount: 2,
  pasteUpload: false,
  autoUpload: true
})

// 扩展 Emits 接口以支持高级功能
interface ExtendedUploadEmits extends SimpleUploadEmits {
  preview: [file: UploadFile]
  progress: [progress: UploadProgress]
  paste: [files: File[]]
  'validation-error': [file: File, error: string]
}

// 定义 Emits - 使用扩展的接口
const emit = defineEmits<ExtendedUploadEmits>()

// 状态管理
const uploadRef = ref()
const fileList = ref<UploadFile[]>([])
const validationErrors = ref<string[]>([])

// 预览功能
const previewModalRef = ref()
const {
  isPreviewVisible,
  currentPreviewFile,
  previewLoading,
  previewError,
  showPreview,
  hidePreview,
  handlePreviewLoad,
  handlePreviewError,
  isFilePreviewable
} = useFilePreview({
  enabled: props.preview,
  mode: 'modal',
  config: props.previewConfig
})

// 上传队列管理 - 并发控制和重试机制
const {
  uploadQueue,
  currentUploading,
  uploadingFiles,
  startUpload,
  retryUpload,
  finishUpload,
  processQueue,
  checkConcurrentLimit,
  clearUploadState
} = useUploadQueue(props.concurrent || 3, props.retryCount || 2)

// 粘贴上传功能
const {
  pasteEnabled,
  handlePaste,
  initPasteUpload,
  cleanupPasteUpload
} = usePasteUpload()

// 文件验证函数 - 添加更好的类型安全
const validateFile = (file: File): { valid: boolean; error?: string } => {
  // 文件大小验证 (maxSize 单位为 MB)
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    return {
      valid: false,
      error: `文件大小不能超过 ${props.maxSize}MB，当前文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    }
  }
  
  // 文件类型验证
  if (props.allowedTypes && props.allowedTypes.length > 0) {
    const isValidType = props.allowedTypes.some((type: string) => {
      if (type.startsWith('.')) {
        // 扩展名验证
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      // MIME 类型验证
      return file.type.includes(type)
    })
    
    if (!isValidType) {
      return {
        valid: false,
        error: `不支持的文件类型，仅支持: ${props.allowedTypes.join(', ')}，当前文件类型: ${file.type || '未知'}`
      }
    }
  }
  
  // 文件数量验证 (检查当前文件列表数量)
  if (props.maxCount && fileList.value.length >= props.maxCount) {
    return {
      valid: false,
      error: `最多只能上传 ${props.maxCount} 个文件，当前已有 ${fileList.value.length} 个文件`
    }
  }
  
  return { valid: true }
}

// 上传前处理 - 添加正确的类型注解
const handleBeforeUpload = async (file: File): Promise<boolean> => {
  // 单文件模式下，如果已有文件则先清空
  if (!props.multiple && fileList.value.length > 0) {
    fileList.value = []
  }
  
  // 文件验证
  const validation = validateFile(file)
  if (!validation.valid) {
    validationErrors.value.push(validation.error!)
    
    // 显示文件验证失败的 toast 提示
    message.error(`文件验证失败: ${validation.error}`)
    
    return false
  }
  
  // 调用用户自定义的 beforeUpload
  if (props.beforeUpload) {
    try {
      const result = await props.beforeUpload(file)
      if (result === false) {
        return false
      }
    } catch (error) {
      console.error('beforeUpload error:', error)
      validationErrors.value.push(`上传前处理失败: ${error instanceof Error ? error.message : '未知错误'}`)
      return false
    }
  }
  
  return true
}

// 文件状态改变处理 - 集成并发控制
const handleChange = (info: UploadChangeParam): void => {
  console.log('Upload change:', info)
  
  // 更新文件列表
  fileList.value = [...info.fileList]
  
  // 清除相关的验证错误
  if (info.file.status === 'done' || info.file.status === 'uploading') {
    validationErrors.value = validationErrors.value.filter(error => 
      !error.includes(info.file.name || '')
    )
  }
  
  // 处理上传状态变化
  if (info.file.status === 'uploading') {
    // 文件开始上传，检查并发限制
    if (!checkConcurrentLimit(info.file)) {
      console.log('File queued due to concurrent limit:', info.file.name)
      return
    }
    
    // 开始上传，使用队列管理
    const callbacks = {
      onProgress: (event: ProgressEvent) => {
        const progress: UploadProgress = {
          file: info.file,
          percent: Math.round((event.loaded / event.total!) * 100),
          loaded: event.loaded,
          total: event.total!,
          speed: 0 // 将在 useUploadQueue 中计算
        }
        emit('progress', progress)
      },
      onSuccess: (response: any) => {
        finishUpload(info.file.uid, true)
        
        // 显示上传成功的 toast 提示
        message.success(`文件 "${info.file.name}" 上传成功`)
        
        emit('success', info.file, response)
        processQueue() // 处理队列中的下一个文件
      },
      onError: (error: Error) => {
        // 尝试重试
        const uploadInfo = uploadingFiles.value.get(info.file.uid)
        if (uploadInfo && uploadInfo.retryCount < (props.retryCount || 2)) {
          console.log(`Retrying upload for ${info.file.name}, attempt ${uploadInfo.retryCount + 1}`)
          
          // 显示重试提示
          message.warning(`文件 "${info.file.name}" 上传失败，正在重试 (${uploadInfo.retryCount + 1}/${props.retryCount || 2})`)
          
          retryUpload(info.file, callbacks, props.customRequest, emit)
        } else {
          finishUpload(info.file.uid, false)
          const uploadError: UploadError = {
            file: info.file,
            error,
            retryable: false
          }
          
          // 显示上传失败的 toast 提示
          message.error(`文件 "${info.file.name}" 上传失败: ${error.message}`)
          
          emit('error', info.file, error)
          processQueue() // 处理队列中的下一个文件
        }
      }
    }
    
    // 如果有自定义请求处理，使用队列管理
    if (props.customRequest) {
      startUpload(info.file, callbacks, props.customRequest, emit)
    }
  } else if (info.file.status === 'done') {
    finishUpload(info.file.uid, true)
    
    // 显示上传成功的 toast 提示
    message.success(`文件 "${info.file.name}" 上传成功`)
    
    emit('success', info.file, info.file.response || {})
    processQueue()
  } else if (info.file.status === 'error') {
    const errorMsg = info.file.error?.message || 'Upload failed'
    
    // 显示上传失败的 toast 提示
    message.error(`文件 "${info.file.name}" 上传失败: ${errorMsg}`)
    
    emit('error', info.file, new Error(errorMsg))
    processQueue()
  }
  
  // 始终触发 change 事件
  emit('change', { file: info.file, fileList: info.fileList })
}

// 文件移除处理 - 添加正确的类型注解
const handleRemove = (file: UploadFile): boolean => {
  emit('remove', file)
  return true
}

// 移除验证错误 - 添加正确的类型注解
const removeValidationError = (index: number): void => {
  validationErrors.value.splice(index, 1)
}

// 预览处理函数
const handlePreview = (file: UploadFile): void => {
  if (props.preview && isFilePreviewable(file)) {
    previewModalRef.value?.show(file)
  }
  emit('preview', file)
}

const handlePreviewOpen = (file: UploadFile): void => {
  console.log('Preview opened:', file.name)
}

const handlePreviewClose = (): void => {
  console.log('Preview closed')
}

const handlePreviewDownload = (file: UploadFile): void => {
  console.log('File downloaded from preview:', file.name)
}

// 粘贴上传处理
const handlePasteEvent = async (event: ClipboardEvent): Promise<void> => {
  await handlePaste(event, {
    pasteUpload: props.pasteUpload || false,
    validation: {
      types: props.allowedTypes,
      maxSize: props.maxSize,
      maxCount: props.maxCount
    },
    beforeUpload: props.beforeUpload,
    autoUpload: props.autoUpload || true,
    fileList: fileList.value,
    emit: (eventName: string, ...args: any[]) => {
      if (eventName === 'validation-error') {
        const [file, error] = args
        // 显示粘贴文件验证失败的 toast 提示
        message.error(`粘贴文件验证失败: ${error}`)
      } else if (eventName === 'paste') {
        const [files] = args
        // 显示粘贴成功的 toast 提示
        message.success(`成功粘贴 ${files.length} 个文件`)
      }
      emit(eventName as any, ...args)
    },
    onFileAdd: (file: UploadFile) => {
      fileList.value = [...fileList.value, file]
    },
    onUpload: (file: UploadFile) => {
      // 触发上传
      if (props.autoUpload) {
        handleUploadFile(file)
      }
    }
  })
}

// 手动上传文件
const handleUploadFile = (file: UploadFile): void => {
  if (!checkConcurrentLimit(file)) {
    console.log('File queued due to concurrent limit:', file.name)
    return
  }
  
  const callbacks = {
    onProgress: (event: ProgressEvent) => {
      const progress: UploadProgress = {
        file,
        percent: Math.round((event.loaded / event.total!) * 100),
        loaded: event.loaded,
        total: event.total!,
        speed: 0
      }
      emit('progress', progress)
    },
    onSuccess: (response: any) => {
      finishUpload(file.uid, true)
      // 更新文件状态
      const fileIndex = fileList.value.findIndex(f => f.uid === file.uid)
      if (fileIndex !== -1) {
        fileList.value[fileIndex].status = 'done'
        fileList.value[fileIndex].response = response
      }
      
      // 显示上传成功的 toast 提示
      message.success(`文件 "${file.name}" 上传成功`)
      
      emit('success', file, response)
      processQueue()
    },
    onError: (error: Error) => {
      const uploadInfo = uploadingFiles.value.get(file.uid)
      if (uploadInfo && uploadInfo.retryCount < (props.retryCount || 2)) {
        // 显示重试提示
        message.warning(`文件 "${file.name}" 上传失败，正在重试 (${uploadInfo.retryCount + 1}/${props.retryCount || 2})`)
        
        retryUpload(file, callbacks, props.customRequest, emit)
      } else {
        finishUpload(file.uid, false)
        // 更新文件状态
        const fileIndex = fileList.value.findIndex(f => f.uid === file.uid)
        if (fileIndex !== -1) {
          fileList.value[fileIndex].status = 'error'
          fileList.value[fileIndex].error = error
        }
        
        // 显示上传失败的 toast 提示
        message.error(`文件 "${file.name}" 上传失败: ${error.message}`)
        
        emit('error', file, error)
        processQueue()
      }
    }
  }
  
  startUpload(file, callbacks, props.customRequest, emit)
}

// 组件生命周期
onMounted(() => {
  // 初始化粘贴上传
  if (props.pasteUpload) {
    initPasteUpload(true, handlePasteEvent)
  }
})

onUnmounted(() => {
  // 清理粘贴上传
  if (props.pasteUpload) {
    cleanupPasteUpload(true, handlePasteEvent)
  }
  
  // 清理上传状态
  clearUploadState()
})

// 获取上传统计信息
const getUploadStats = () => {
  const total = fileList.value.length
  const uploading = fileList.value.filter(file => file.status === 'uploading').length
  const done = fileList.value.filter(file => file.status === 'done').length
  const error = fileList.value.filter(file => file.status === 'error').length
  
  return {
    total,
    uploading,
    done,
    error,
    progress: total > 0 ? Math.round((done / total) * 100) : 0
  }
}

// 手动触发上传
const triggerUpload = (): void => {
  if (uploadRef.value && uploadRef.value.upload) {
    uploadRef.value.upload()
  }
}

// 暴露组件方法 - 包含高级功能
defineExpose({
  uploadInstance: uploadRef,
  clearFiles: (): void => {
    fileList.value = []
    validationErrors.value = []
    clearUploadState()
  },
  getFileList: (): UploadFile[] => fileList.value,
  getUploadStats,
  startUpload: triggerUpload,
  hasErrors: (): boolean => validationErrors.value.length > 0,
  isUploading: (): boolean => fileList.value.some(file => file.status === 'uploading'),
  
  // 高级功能方法
  retryFailedUploads: (): void => {
    const failedFiles = fileList.value.filter(file => file.status === 'error')
    if (failedFiles.length === 0) {
      message.info('没有失败的文件需要重试')
      return
    }
    
    message.info(`开始重试 ${failedFiles.length} 个失败的文件`)
    
    failedFiles.forEach(file => {
      file.status = 'uploading'
      handleUploadFile(file)
    })
  },
  
  pauseUploads: (): void => {
    // 暂停当前上传（实际实现需要更复杂的逻辑）
    console.log('Pausing uploads...')
  },
  
  resumeUploads: (): void => {
    // 恢复上传
    processQueue()
  },
  
  getQueueStatus: () => ({
    queue: uploadQueue.value.length,
    uploading: currentUploading.value.size,
    total: fileList.value.length
  })
})
</script>

<style lang="scss" scoped>
.custom-upload {
  // 移除 position: relative 避免可能的层级问题
  
  .upload-drag-content {
    padding: 40px 20px;
    text-align: center;
    
    .upload-drag-icon {
      font-size: 48px;
      color: #999;
      margin-bottom: 16px;
    }
    
    .upload-drag-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .upload-drag-hint {
      font-size: 14px;
      color: #999;
    }
  }
  
  .upload-validation-errors {
    margin-top: 16px;
    
    .ant-alert {
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .upload-paste-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    text-align: center;
  }
  
  .upload-queue-status {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
    text-align: center;
    padding: 4px 8px;
    background: #f5f5f5;
    border-radius: 4px;
  }
}

// 深度选择器，修改 ant-design-vue 组件样式
:deep(.ant-upload-drag) {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  background: #fafafa;
  transition: border-color 0.3s;
  
  &:hover {
    border-color: #1890ff;
  }
  
  &.ant-upload-drag-hover {
    border-color: #1890ff;
  }
}

:deep(.ant-upload-list) {
  margin-top: 16px;
}

:deep(.ant-upload-btn) {
  display: block;
  width: 100%;
}
</style>