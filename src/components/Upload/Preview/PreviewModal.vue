<template>
  <a-modal
    v-model:open="visible"
    :title="modalTitle"
    :width="modalWidth"
    :footer="null"
    :centered="true"
    :destroyOnClose="true"
    :maskClosable="true"
    class="file-preview-modal"
    @cancel="handleClose"
  >
    <div class="preview-modal-content">
      <FilePreview
        v-if="currentFile"
        :file="currentFile"
        mode="modal"
        :width="previewWidth"
        :height="previewHeight"
        :image-config="imageConfig"
        :video-config="videoConfig"
        :document-config="documentConfig"
        @load="handlePreviewLoad"
        @error="handlePreviewError"
        @click="handlePreviewClick"
      />
      
      <!-- 加载状态 -->
      <div v-if="loading" class="preview-loading">
        <a-spin size="large" />
        <p>正在加载预览...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-if="error" class="preview-error">
        <a-result
          status="error"
          title="预览失败"
          :sub-title="error.message"
        >
          <template #extra>
            <a-button type="primary" @click="retryPreview">
              重试
            </a-button>
            <a-button @click="downloadFile">
              下载文件
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <template #footer>
      <div class="preview-modal-footer">
        <div class="file-info">
          <span class="file-name">{{ currentFile?.name }}</span>
          <span class="file-size">{{ formatFileSize(currentFile?.size || 0) }}</span>
        </div>
        
        <div class="actions">
          <a-button @click="downloadFile" :disabled="!currentFile?.url">
            <DownloadOutlined />
            下载
          </a-button>
          <a-button @click="handleClose">
            关闭
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Modal as AModal, Spin as ASpin, Result as AResult, Button as AButton } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'

import FilePreview from './FilePreview.vue'
import { formatFileSize } from '../utils'
import type { ImagePreviewProps, VideoPreviewProps, DocumentPreviewProps } from './types'

// 定义组件名称
defineOptions({
  name: 'PreviewModal'
})

// 定义 Props
interface PreviewModalProps {
  // 模态框配置
  width?: number | string
  height?: number | string
  
  // 预览配置
  imageConfig?: Partial<Pick<ImagePreviewProps, 'thumbnail' | 'thumbnailSize' | 'fullscreen' | 'zoom' | 'rotate' | 'loading'>>
  videoConfig?: Partial<Pick<VideoPreviewProps, 'poster' | 'controls' | 'autoplay' | 'muted' | 'loop' | 'preload'>>
  documentConfig?: Partial<Pick<DocumentPreviewProps, 'showNavigation' | 'scale' | 'allowDownload'>>
}

const props = withDefaults(defineProps<PreviewModalProps>(), {
  width: '80%',
  height: '80vh',
  imageConfig: () => ({
    thumbnail: false,
    fullscreen: true,
    zoom: true,
    rotate: true,
    loading: 'eager'
  }),
  videoConfig: () => ({
    poster: true,
    controls: true,
    autoplay: false,
    muted: false,
    loop: false,
    preload: 'metadata'
  }),
  documentConfig: () => ({
    showNavigation: true,
    scale: 1,
    allowDownload: true
  })
})

// 定义 Emits
interface PreviewModalEmits {
  'open': [file: UploadFile]
  'close': []
  'load': [file: UploadFile]
  'error': [file: UploadFile, error: Error]
  'download': [file: UploadFile]
}

const emit = defineEmits<PreviewModalEmits>()

// 状态管理
const visible = ref(false)
const currentFile = ref<UploadFile>()
const loading = ref(false)
const error = ref<Error | null>(null)

// 计算属性
const modalTitle = computed(() => {
  return currentFile.value?.name || '文件预览'
})

const modalWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  }
  return props.width
})

const previewWidth = computed(() => {
  if (typeof props.width === 'number') {
    return props.width - 48 // 减去 modal padding
  }
  return '100%'
})

const previewHeight = computed(() => {
  if (typeof props.height === 'number') {
    return props.height - 120 // 减去 header 和 footer 高度
  }
  return 'calc(80vh - 120px)'
})

// 监听文件变化，重置状态
watch(currentFile, (newFile) => {
  if (newFile) {
    loading.value = true
    error.value = null
  }
})

// 方法
const show = (file: UploadFile) => {
  currentFile.value = file
  visible.value = true
  emit('open', file)
}

const hide = () => {
  visible.value = false
  // 延迟清理状态，避免关闭动画时出现闪烁
  setTimeout(() => {
    currentFile.value = undefined
    loading.value = false
    error.value = null
  }, 300)
  emit('close')
}

const handleClose = () => {
  hide()
}

const handlePreviewLoad = (file: UploadFile) => {
  loading.value = false
  error.value = null
  emit('load', file)
}

const handlePreviewError = (file: UploadFile, err: Error) => {
  loading.value = false
  error.value = err
  emit('error', file, err)
}

const handlePreviewClick = (file: UploadFile) => {
  // 可以在这里处理预览点击事件，比如切换全屏等
  console.log('Preview clicked:', file)
}

const retryPreview = () => {
  if (currentFile.value) {
    loading.value = true
    error.value = null
    // 强制重新渲染预览组件
    nextTick(() => {
      // 预览组件会自动重新加载
    })
  }
}

const downloadFile = () => {
  if (currentFile.value?.url) {
    const link = document.createElement('a')
    link.href = currentFile.value.url
    link.download = currentFile.value.name || 'file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    emit('download', currentFile.value)
  }
}

// 暴露方法
defineExpose({
  show,
  hide,
  currentFile: computed(() => currentFile.value),
  visible: computed(() => visible.value)
})
</script>

<style lang="scss" scoped>
.file-preview-modal {
  :deep(.ant-modal-content) {
    padding: 0;
  }
  
  :deep(.ant-modal-header) {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .ant-modal-title {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  :deep(.ant-modal-body) {
    padding: 0;
    max-height: 80vh;
    overflow: hidden;
  }
  
  .preview-modal-content {
    position: relative;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .preview-loading {
      text-align: center;
      padding: 40px;
      
      p {
        margin-top: 16px;
        color: #666;
      }
    }
    
    .preview-error {
      width: 100%;
      padding: 40px;
    }
  }
  
  .preview-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    
    .file-info {
      flex: 1;
      
      .file-name {
        font-weight: 500;
        color: #333;
        margin-right: 12px;
      }
      
      .file-size {
        color: #666;
        font-size: 12px;
      }
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .file-preview-modal {
    :deep(.ant-modal) {
      width: 95% !important;
      margin: 10px auto;
    }
    
    .preview-modal-footer {
      flex-direction: column;
      gap: 12px;
      
      .file-info {
        text-align: center;
      }
    }
  }
}
</style>