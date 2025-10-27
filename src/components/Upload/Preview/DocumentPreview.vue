<template>
  <div 
    :class="previewClasses"
    :style="previewStyle"
    @click="handleClick"
  >
    <!-- 懒加载占位符 -->
    <div 
      v-if="lazy && !isIntersecting" 
      ref="placeholderRef"
      class="document-preview-placeholder"
    >
      <div class="placeholder-content">
        <FileTextOutlined class="placeholder-icon" />
        <span class="placeholder-text">点击预览文档</span>
      </div>
    </div>
    
    <!-- 文档预览 -->
    <div v-else class="document-preview-content">
      <!-- 缩略图模式 -->
      <div v-if="mode === 'thumbnail'" class="thumbnail-container">
        <div class="document-thumbnail">
          <FileTextOutlined class="document-icon" />
          <div class="document-info">
            <div class="document-name">{{ file.name }}</div>
            <div class="document-size">{{ formatFileSize(file.size || 0) }}</div>
            <div v-if="documentInfo.pages" class="document-pages">
              {{ documentInfo.pages }} 页
            </div>
          </div>
        </div>
        <div v-if="showOverlay" class="thumbnail-overlay">
          <EyeOutlined class="overlay-icon" />
        </div>
      </div>
      
      <!-- 内联预览模式 -->
      <div v-else-if="mode === 'inline'" class="inline-container">
        <!-- PDF 预览 -->
        <div v-if="isPdfFile" class="pdf-preview">
          <div v-if="showNavigation" class="pdf-navigation">
            <a-button-group size="small">
              <a-button @click="previousPage" :disabled="currentPage <= 1">
                <LeftOutlined />
              </a-button>
              <a-input-number
                v-model:value="currentPage"
                :min="1"
                :max="totalPages"
                size="small"
                style="width: 80px"
                @change="goToPage"
              />
              <span class="page-info">/ {{ totalPages }}</span>
              <a-button @click="nextPage" :disabled="currentPage >= totalPages">
                <RightOutlined />
              </a-button>
            </a-button-group>
            
            <a-button-group size="small">
              <a-button @click="zoomOut">
                <ZoomOutOutlined />
              </a-button>
              <span class="zoom-info">{{ Math.round(currentScale * 100) }}%</span>
              <a-button @click="zoomIn">
                <ZoomInOutlined />
              </a-button>
            </a-button-group>
            
            <a-button v-if="allowDownload" size="small" @click="downloadFile">
              <DownloadOutlined />
              下载
            </a-button>
          </div>
          
          <div class="pdf-viewer" ref="pdfViewerRef">
            <canvas
              ref="pdfCanvasRef"
              class="pdf-canvas"
              :style="canvasStyle"
            />
          </div>
        </div>
        
        <!-- 其他文档类型预览 -->
        <div v-else class="document-viewer">
          <div class="document-placeholder">
            <FileTextOutlined class="placeholder-icon" />
            <div class="placeholder-text">
              <p>{{ file.name }}</p>
              <p class="file-info">{{ formatFileSize(file.size || 0) }}</p>
              <a-button type="primary" @click="downloadFile">
                <DownloadOutlined />
                下载查看
              </a-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="previewState.loading" class="loading-overlay">
        <a-spin size="large" tip="加载文档中..." />
      </div>
      
      <!-- 错误状态 -->
      <div v-if="previewState.error" class="error-overlay">
        <div class="error-content">
          <ExclamationCircleOutlined class="error-icon" />
          <span class="error-text">文档加载失败</span>
          <a-button size="small" @click="retry">重试</a-button>
        </div>
      </div>
    </div>
    
    <!-- 全屏预览模态框 -->
    <a-modal
      v-model:open="fullscreenVisible"
      :footer="null"
      :width="'95vw'"
      :style="{ top: '10px' }"
      :bodyStyle="{ padding: 0, height: '90vh' }"
      @cancel="closeFullscreen"
    >
      <div class="fullscreen-document-preview">
        <div v-if="isPdfFile" class="fullscreen-pdf-viewer">
          <div class="fullscreen-pdf-navigation">
            <a-button-group>
              <a-button @click="previousPage" :disabled="currentPage <= 1">
                <LeftOutlined />
              </a-button>
              <a-input-number
                v-model:value="currentPage"
                :min="1"
                :max="totalPages"
                @change="goToPage"
              />
              <span class="page-info">/ {{ totalPages }}</span>
              <a-button @click="nextPage" :disabled="currentPage >= totalPages">
                <RightOutlined />
              </a-button>
            </a-button-group>
            
            <a-button-group>
              <a-button @click="zoomOut">
                <ZoomOutOutlined />
              </a-button>
              <span class="zoom-info">{{ Math.round(currentScale * 100) }}%</span>
              <a-button @click="zoomIn">
                <ZoomInOutlined />
              </a-button>
            </a-button-group>
            
            <a-button @click="downloadFile">
              <DownloadOutlined />
              下载
            </a-button>
          </div>
          
          <div class="fullscreen-pdf-content">
            <canvas
              ref="fullscreenPdfCanvasRef"
              class="fullscreen-pdf-canvas"
              :style="fullscreenCanvasStyle"
            />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  Modal as AModal, 
  Button as AButton, 
  ButtonGroup as AButtonGroup,
  Spin as ASpin,
  InputNumber as AInputNumber
} from 'ant-design-vue'
import {
  FileTextOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { useIntersectionObserver } from '@vueuse/core'

import type { DocumentPreviewProps, PreviewEmits, PreviewState } from './types'
import { getFilePreviewInfo, cleanupPreviewResource } from './utils'
import { formatFileSize } from '../utils'

// 定义组件名称
defineOptions({
  name: 'DocumentPreview'
})

// 定义 Props
const props = withDefaults(defineProps<DocumentPreviewProps>(), {
  mode: 'thumbnail',
  showNavigation: true,
  scale: 1,
  allowDownload: true,
  lazy: true
})

// 定义 Emits
const emit = defineEmits<PreviewEmits>()

// 响应式数据
const previewState = ref<PreviewState>({
  loading: false,
  error: null,
  loaded: false,
  src: null
})

const fullscreenVisible = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const currentScale = ref(props.scale)
const placeholderRef = ref<HTMLElement>()
const isIntersecting = ref(false)
const pdfViewerRef = ref<HTMLElement>()
const pdfCanvasRef = ref<HTMLCanvasElement>()
const fullscreenPdfCanvasRef = ref<HTMLCanvasElement>()

// PDF.js 相关
let pdfDocument: any = null
let currentPageObject: any = null

// 文档信息
const documentInfo = ref<{
  pages?: number
  size?: { width: number; height: number }
}>({})

// 懒加载观察器
const { stop: stopObserver } = useIntersectionObserver(
  placeholderRef,
  ([{ isIntersecting: intersecting }]) => {
    isIntersecting.value = intersecting
    if (intersecting) {
      loadPreview()
    }
  },
  {
    threshold: 0.1,
    rootMargin: '50px'
  }
)

// 计算属性
const previewClasses = computed(() => [
  'document-preview',
  `document-preview--${props.mode}`,
  {
    'document-preview--loading': previewState.value.loading,
    'document-preview--error': previewState.value.error,
    'document-preview--lazy': props.lazy
  },
  props.className
])

const previewStyle = computed(() => {
  const style: any = {}
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return style
})

const canvasStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  transformOrigin: 'top left',
  transition: 'transform 0.3s ease'
}))

const fullscreenCanvasStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  transformOrigin: 'center',
  transition: 'transform 0.3s ease'
}))

const isPdfFile = computed(() => {
  return props.file.type === 'application/pdf' || 
         props.file.name?.toLowerCase().endsWith('.pdf')
})

const showOverlay = computed(() => props.mode === 'thumbnail')

// 方法
const loadPreview = async () => {
  if (previewState.value.loaded || previewState.value.loading) return
  
  previewState.value.loading = true
  previewState.value.error = null
  
  try {
    const previewInfo = getFilePreviewInfo(props.file)
    previewState.value.src = previewInfo.src
    
    if (isPdfFile.value) {
      await loadPdfDocument()
    }
    
    previewState.value.loaded = true
    emit('load', props.file)
  } catch (error) {
    previewState.value.error = error as Error
    emit('error', props.file, error as Error)
  } finally {
    previewState.value.loading = false
  }
}

const loadPdfDocument = async () => {
  if (!previewState.value.src) return
  
  try {
    // 这里需要使用 PDF.js 库
    // 为了演示，我们模拟 PDF 加载过程
    // 实际项目中需要引入 pdfjs-dist 库
    
    // 模拟 PDF 文档加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟 PDF 信息
    totalPages.value = Math.floor(Math.random() * 10) + 1
    documentInfo.value.pages = totalPages.value
    
    // 渲染第一页
    await renderPage(1)
  } catch (error) {
    throw new Error('PDF 加载失败')
  }
}

const renderPage = async (pageNumber: number) => {
  if (!isPdfFile.value) return
  
  try {
    // 模拟页面渲染
    await nextTick()
    
    const canvas = fullscreenVisible.value ? fullscreenPdfCanvasRef.value : pdfCanvasRef.value
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 设置画布尺寸
    canvas.width = 600
    canvas.height = 800
    
    // 绘制模拟的 PDF 页面
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#333333'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`PDF 页面 ${pageNumber}`, canvas.width / 2, canvas.height / 2)
    
    ctx.font = '16px Arial'
    ctx.fillText(`共 ${totalPages.value} 页`, canvas.width / 2, canvas.height / 2 + 40)
    
    currentPage.value = pageNumber
  } catch (error) {
    console.error('页面渲染失败:', error)
  }
}

const handleClick = () => {
  emit('click', props.file)
  
  if (props.mode === 'thumbnail') {
    openFullscreen()
  }
}

const retry = () => {
  previewState.value.error = null
  loadPreview()
}

// 页面导航
const previousPage = () => {
  if (currentPage.value > 1) {
    renderPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    renderPage(currentPage.value + 1)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    renderPage(page)
  }
}

// 缩放控制
const zoomIn = () => {
  currentScale.value = Math.min(currentScale.value * 1.2, 3)
}

const zoomOut = () => {
  currentScale.value = Math.max(currentScale.value / 1.2, 0.5)
}

// 下载文件
const downloadFile = () => {
  if (props.file.url) {
    const link = document.createElement('a')
    link.href = props.file.url
    link.download = props.file.name || 'document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// 全屏控制
const openFullscreen = () => {
  fullscreenVisible.value = true
  emit('fullscreen', props.file, true)
  
  // 在全屏模式下重新渲染当前页面
  nextTick(() => {
    if (isPdfFile.value) {
      renderPage(currentPage.value)
    }
  })
}

const closeFullscreen = () => {
  fullscreenVisible.value = false
  currentScale.value = props.scale
  emit('fullscreen', props.file, false)
}

// 监听文件变化
watch(() => props.file, () => {
  // 清理之前的资源
  if (previewState.value.src) {
    cleanupPreviewResource(previewState.value.src)
  }
  
  // 重置状态
  previewState.value = {
    loading: false,
    error: null,
    loaded: false,
    src: null
  }
  currentPage.value = 1
  totalPages.value = 1
  currentScale.value = props.scale
  documentInfo.value = {}
  
  // 如果不是懒加载或已经在视口中，立即加载
  if (!props.lazy || isIntersecting.value) {
    loadPreview()
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  if (!props.lazy) {
    loadPreview()
  }
})

// 组件卸载时清理资源
onUnmounted(() => {
  stopObserver()
  
  if (previewState.value.src) {
    cleanupPreviewResource(previewState.value.src)
  }
  
  // 清理 PDF 资源
  if (pdfDocument) {
    pdfDocument.destroy?.()
  }
})
</script>

<style lang="scss" scoped>
.document-preview {
  position: relative;
  display: inline-block;
  
  &--thumbnail {
    .thumbnail-container {
      position: relative;
      display: inline-block;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      
      &:hover {
        border-color: #1890ff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        .thumbnail-overlay {
          opacity: 1;
        }
      }
      
      .document-thumbnail {
        padding: 16px;
        text-align: center;
        min-width: 120px;
        
        .document-icon {
          font-size: 48px;
          color: #1890ff;
          margin-bottom: 8px;
        }
        
        .document-info {
          .document-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .document-size,
          .document-pages {
            font-size: 12px;
            color: #666;
            margin-bottom: 2px;
          }
        }
      }
      
      .thumbnail-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .overlay-icon {
          color: white;
          font-size: 24px;
        }
      }
    }
  }
  
  &--inline {
    .inline-container {
      position: relative;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      background: white;
      
      .pdf-preview {
        .pdf-navigation {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
          
          .page-info,
          .zoom-info {
            font-size: 14px;
            color: #666;
            margin: 0 8px;
          }
        }
        
        .pdf-viewer {
          padding: 16px;
          text-align: center;
          overflow: auto;
          max-height: 600px;
          
          .pdf-canvas {
            border: 1px solid #e8e8e8;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }
      }
      
      .document-viewer {
        padding: 40px 20px;
        text-align: center;
        
        .document-placeholder {
          .placeholder-icon {
            font-size: 64px;
            color: #1890ff;
            margin-bottom: 16px;
          }
          
          .placeholder-text {
            p {
              margin: 8px 0;
              
              &:first-child {
                font-size: 16px;
                font-weight: 500;
                color: #333;
              }
            }
            
            .file-info {
              font-size: 14px;
              color: #666;
              margin-bottom: 16px;
            }
          }
        }
      }
    }
  }
  
  .document-preview-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    background: #f5f5f5;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
      background: #f0f8ff;
    }
    
    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #666;
      
      .placeholder-icon {
        font-size: 32px;
        color: #1890ff;
      }
      
      .placeholder-text {
        font-size: 14px;
      }
    }
  }
  
  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 6px;
  }
  
  .error-overlay {
    .error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #ff4d4f;
      
      .error-icon {
        font-size: 24px;
      }
      
      .error-text {
        font-size: 14px;
      }
    }
  }
}

.fullscreen-document-preview {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  
  .fullscreen-pdf-viewer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .fullscreen-pdf-navigation {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: white;
      border-bottom: 1px solid #e8e8e8;
      
      .page-info,
      .zoom-info {
        font-size: 14px;
        color: #666;
        margin: 0 8px;
      }
    }
    
    .fullscreen-pdf-content {
      flex: 1;
      padding: 20px;
      text-align: center;
      overflow: auto;
      
      .fullscreen-pdf-canvas {
        border: 1px solid #e8e8e8;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        background: white;
      }
    }
  }
}
</style>