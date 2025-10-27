/**
 * 文件预览功能 Hook - 重新实现，确保状态管理正确
 */

import { ref, computed, nextTick } from 'vue'
import type { UploadFile } from 'ant-design-vue'

export interface UseFilePreviewOptions {
  // 是否启用预览功能
  enabled?: boolean
  // 预览模式
  mode?: 'modal' | 'inline'
  // 预览配置
  config?: {
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
}

export function useFilePreview(options: UseFilePreviewOptions = {}) {
  const {
    enabled = true,
    mode = 'modal',
    config = {}
  } = options

  // 预览状态管理 - 使用独立的状态避免同步问题
  const isPreviewVisible = ref(false)
  const currentPreviewFile = ref<UploadFile | null>(null)
  const previewLoading = ref(false)
  const previewError = ref<Error | null>(null)

  // 计算属性
  const hasPreviewFile = computed(() => currentPreviewFile.value !== null)
  const canPreview = computed(() => enabled && hasPreviewFile.value)

  // 显示预览
  const showPreview = async (file: UploadFile) => {
    if (!enabled) {
      console.warn('Preview is disabled')
      return
    }

    try {
      // 重置状态
      previewError.value = null
      previewLoading.value = true
      
      // 设置当前预览文件
      currentPreviewFile.value = file
      
      // 等待下一个 tick 确保状态更新
      await nextTick()
      
      // 显示预览模态框
      isPreviewVisible.value = true
      
      console.log('Preview opened for file:', file.name)
    } catch (error) {
      console.error('Failed to show preview:', error)
      previewError.value = error instanceof Error ? error : new Error('Unknown error')
    } finally {
      previewLoading.value = false
    }
  }

  // 隐藏预览
  const hidePreview = async () => {
    try {
      // 关闭模态框
      isPreviewVisible.value = false
      
      // 延迟清理状态，避免关闭动画时的闪烁
      setTimeout(() => {
        currentPreviewFile.value = null
        previewError.value = null
        previewLoading.value = false
      }, 300)
      
      console.log('Preview closed')
    } catch (error) {
      console.error('Failed to hide preview:', error)
    }
  }

  // 切换预览状态
  const togglePreview = (file?: UploadFile) => {
    if (isPreviewVisible.value) {
      hidePreview()
    } else if (file) {
      showPreview(file)
    }
  }

  // 预览加载成功处理
  const handlePreviewLoad = (file: UploadFile) => {
    previewLoading.value = false
    previewError.value = null
    console.log('Preview loaded successfully:', file.name)
  }

  // 预览加载失败处理
  const handlePreviewError = (file: UploadFile, error: Error) => {
    previewLoading.value = false
    previewError.value = error
    console.error('Preview load failed:', file.name, error)
  }

  // 重试预览
  const retryPreview = () => {
    if (currentPreviewFile.value) {
      showPreview(currentPreviewFile.value)
    }
  }

  // 检查文件是否支持预览
  const isFilePreviewable = (file: UploadFile): boolean => {
    if (!file.type && !file.name) return false
    
    const fileType = file.type || ''
    const fileName = file.name || ''
    
    // 图片文件
    if (fileType.startsWith('image/')) return true
    
    // 视频文件
    if (fileType.startsWith('video/')) return true
    
    // 文档文件
    if (fileType.includes('pdf') || 
        fileType.includes('document') || 
        fileType.includes('text')) return true
    
    // 根据文件扩展名判断
    const ext = fileName.toLowerCase().split('.').pop()
    const previewableExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'mp4', 'avi', 'mov']
    
    return previewableExts.includes(ext || '')
  }

  // 获取预览配置
  const getPreviewConfig = () => {
    return {
      mode,
      ...config
    }
  }

  // 清理预览状态
  const cleanup = () => {
    isPreviewVisible.value = false
    currentPreviewFile.value = null
    previewLoading.value = false
    previewError.value = null
  }

  return {
    // 状态
    isPreviewVisible,
    currentPreviewFile,
    previewLoading,
    previewError,
    
    // 计算属性
    hasPreviewFile,
    canPreview,
    
    // 方法
    showPreview,
    hidePreview,
    togglePreview,
    handlePreviewLoad,
    handlePreviewError,
    retryPreview,
    isFilePreviewable,
    getPreviewConfig,
    cleanup,
    
    // 兼容性 - 保持原有接口
    previewModalVisible: isPreviewVisible,
    previewFile: currentPreviewFile,
    showPreviewModal: showPreview,
    closePreviewModal: hidePreview,
    handlePreview: (file: UploadFile, preview: boolean | object, emit?: Function) => {
      if (preview && isFilePreviewable(file)) {
        showPreview(file)
      }
      if (emit) {
        emit('preview', file)
      }
    }
  }
}