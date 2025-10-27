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
      class="image-preview-placeholder"
    >
      <div class="placeholder-content">
        <LoadingOutlined class="placeholder-icon" />
        <span class="placeholder-text">加载中...</span>
      </div>
    </div>
    
    <!-- 图片预览 -->
    <div v-else class="image-preview-content">
      <!-- 缩略图模式 -->
      <div v-if="mode === 'thumbnail'" class="thumbnail-container">
        <img
          :src="thumbnailSrc || previewState.src"
          :alt="file.name"
          class="thumbnail-image"
          @load="handleLoad"
          @error="handleError"
        />
        <div v-if="showOverlay" class="thumbnail-overlay">
          <EyeOutlined class="overlay-icon" />
        </div>
      </div>
      
      <!-- 内联预览模式 -->
      <div v-else-if="mode === 'inline'" class="inline-container">
        <img
          :src="previewState.src"
          :alt="file.name"
          class="inline-image"
          :style="imageStyle"
          @load="handleLoad"
          @error="handleError"
        />
        <div v-if="showControls" class="image-controls">
          <a-button-group size="small">
            <a-button @click.stop="zoomIn" :disabled="!zoom">
              <ZoomInOutlined />
            </a-button>
            <a-button @click.stop="zoomOut" :disabled="!zoom">
              <ZoomOutOutlined />
            </a-button>
            <a-button @click.stop="rotateLeft" :disabled="!rotate">
              <RotateLeftOutlined />
            </a-button>
            <a-button @click.stop="rotateRight" :disabled="!rotate">
              <RotateRightOutlined />
            </a-button>
            <a-button v-if="fullscreen" @click.stop="openFullscreen">
              <FullscreenOutlined />
            </a-button>
          </a-button-group>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="previewState.loading" class="loading-overlay">
        <a-spin size="large" />
      </div>
      
      <!-- 错误状态 -->
      <div v-if="previewState.error" class="error-overlay">
        <div class="error-content">
          <ExclamationCircleOutlined class="error-icon" />
          <span class="error-text">加载失败</span>
          <a-button size="small" @click="retry">重试</a-button>
        </div>
      </div>
    </div>
    
    <!-- 全屏预览模态框 -->
    <a-modal
      v-model:open="fullscreenVisible"
      :footer="null"
      :width="'90vw'"
      :style="{ top: '20px' }"
      :bodyStyle="{ padding: 0, height: '80vh' }"
      @cancel="closeFullscreen"
    >
      <div class="fullscreen-preview">
        <img
          :src="previewState.src"
          :alt="file.name"
          class="fullscreen-image"
          :style="fullscreenImageStyle"
        />
        <div class="fullscreen-controls">
          <a-button-group>
            <a-button @click="zoomIn">
              <ZoomInOutlined />
            </a-button>
            <a-button @click="zoomOut">
              <ZoomOutOutlined />
            </a-button>
            <a-button @click="rotateLeft">
              <RotateLeftOutlined />
            </a-button>
            <a-button @click="rotateRight">
              <RotateRightOutlined />
            </a-button>
            <a-button @click="resetTransform">
              <RedoOutlined />
            </a-button>
          </a-button-group>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { 
  Modal as AModal, 
  Button as AButton, 
  ButtonGroup as AButtonGroup,
  Spin as ASpin 
} from 'ant-design-vue'
import {
  LoadingOutlined,
  EyeOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  FullscreenOutlined,
  ExclamationCircleOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'
// 移除 VueUse 依赖，使用原生 Intersection Observer

import type { ImagePreviewProps, PreviewEmits, PreviewState } from './types'
import { getFilePreviewInfo, generateThumbnail, cleanupPreviewResource } from './utils'

// 定义组件名称
defineOptions({
  name: 'ImagePreview'
})

// 定义 Props
const props = withDefaults(defineProps<ImagePreviewProps>(), {
  mode: 'thumbnail',
  thumbnail: true,
  thumbnailSize: 200,
  fullscreen: true,
  zoom: true,
  rotate: true,
  loading: 'lazy',
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
const currentZoom = ref(1)
const currentRotation = ref(0)
const thumbnailSrc = ref<string>()
const placeholderRef = ref<HTMLElement>()
const isIntersecting = ref(false)
let intersectionObserver: IntersectionObserver | null = null

// 初始化懒加载观察器
const initIntersectionObserver = () => {
  if (!placeholderRef.value || intersectionObserver) return
  
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting.value = true
          loadPreview()
          // 一旦开始加载，就停止观察
          if (intersectionObserver) {
            intersectionObserver.unobserve(entry.target)
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  )
  
  intersectionObserver.observe(placeholderRef.value)
}

// 停止观察器
const stopObserver = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
}

// 计算属性
const previewClasses = computed(() => [
  'image-preview',
  `image-preview--${props.mode}`,
  {
    'image-preview--loading': previewState.value.loading,
    'image-preview--error': previewState.value.error,
    'image-preview--lazy': props.lazy
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

const imageStyle = computed(() => ({
  transform: `scale(${currentZoom.value}) rotate(${currentRotation.value}deg)`,
  transition: 'transform 0.3s ease'
}))

const fullscreenImageStyle = computed(() => ({
  transform: `scale(${currentZoom.value}) rotate(${currentRotation.value}deg)`,
  transition: 'transform 0.3s ease',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain' as const
}))

const showOverlay = computed(() => props.mode === 'thumbnail' && props.fullscreen)
const showControls = computed(() => props.mode === 'inline' && (props.zoom || props.rotate || props.fullscreen))

// 方法
const loadPreview = async () => {
  if (previewState.value.loaded || previewState.value.loading) return
  
  previewState.value.loading = true
  previewState.value.error = null
  
  try {
    const previewInfo = getFilePreviewInfo(props.file)
    previewState.value.src = previewInfo.src
    
    // 生成缩略图
    if (props.thumbnail && props.file.originFileObj) {
      try {
        thumbnailSrc.value = await generateThumbnail(props.file.originFileObj, props.thumbnailSize)
      } catch (error) {
        console.warn('Failed to generate thumbnail:', error)
      }
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

const handleLoad = () => {
  previewState.value.loading = false
  previewState.value.error = null
  emit('load', props.file)
}

const handleError = (error: Event) => {
  previewState.value.loading = false
  previewState.value.error = new Error('Image load failed')
  emit('error', props.file, new Error('Image load failed'))
}

const handleClick = () => {
  emit('click', props.file)
  
  if (props.mode === 'thumbnail' && props.fullscreen) {
    openFullscreen()
  }
}

const retry = () => {
  previewState.value.error = null
  loadPreview()
}

// 缩放控制
const zoomIn = () => {
  if (props.zoom) {
    currentZoom.value = Math.min(currentZoom.value * 1.2, 3)
  }
}

const zoomOut = () => {
  if (props.zoom) {
    currentZoom.value = Math.max(currentZoom.value / 1.2, 0.5)
  }
}

// 旋转控制
const rotateLeft = () => {
  if (props.rotate) {
    currentRotation.value -= 90
  }
}

const rotateRight = () => {
  if (props.rotate) {
    currentRotation.value += 90
  }
}

const resetTransform = () => {
  currentZoom.value = 1
  currentRotation.value = 0
}

// 全屏控制
const openFullscreen = () => {
  fullscreenVisible.value = true
  emit('fullscreen', props.file, true)
}

const closeFullscreen = () => {
  fullscreenVisible.value = false
  resetTransform()
  emit('fullscreen', props.file, false)
}

// 监听文件变化
watch(() => props.file, () => {
  // 清理之前的资源
  if (previewState.value.src) {
    cleanupPreviewResource(previewState.value.src)
  }
  if (thumbnailSrc.value) {
    cleanupPreviewResource(thumbnailSrc.value)
  }
  
  // 重置状态
  previewState.value = {
    loading: false,
    error: null,
    loaded: false,
    src: null
  }
  thumbnailSrc.value = undefined
  
  // 如果不是懒加载或已经在视口中，立即加载
  if (!props.lazy || isIntersecting.value) {
    loadPreview()
  }
}, { immediate: true })

// 组件挂载
onMounted(() => {
  if (!props.lazy) {
    loadPreview()
  } else {
    // 延迟初始化观察器，确保 DOM 已渲染
    setTimeout(() => {
      initIntersectionObserver()
    }, 0)
  }
})

// 组件卸载时清理资源
onUnmounted(() => {
  stopObserver()
  
  if (previewState.value.src) {
    cleanupPreviewResource(previewState.value.src)
  }
  if (thumbnailSrc.value) {
    cleanupPreviewResource(thumbnailSrc.value)
  }
})
</script>

<style lang="scss" scoped>
.image-preview {
  position: relative;
  display: inline-block;
  
  &--thumbnail {
    .thumbnail-container {
      position: relative;
      display: inline-block;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        .thumbnail-overlay {
          opacity: 1;
        }
      }
      
      .thumbnail-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
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
      
      .inline-image {
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 6px;
      }
      
      .image-controls {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 6px;
        padding: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover .image-controls {
        opacity: 1;
      }
    }
  }
  
  .image-preview-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    background: #f5f5f5;
    border-radius: 6px;
    
    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #999;
      
      .placeholder-icon {
        font-size: 24px;
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

.fullscreen-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  
  .fullscreen-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .fullscreen-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 6px;
    padding: 8px;
  }
}

// 深度选择器，修改 ant-design-vue 组件样式
:deep(.ant-modal-content) {
  background: #000;
}

:deep(.ant-modal-close) {
  color: white;
  
  &:hover {
    color: #1890ff;
  }
}
</style>