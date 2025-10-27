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
      class="video-preview-placeholder"
    >
      <div class="placeholder-content">
        <PlayCircleOutlined class="placeholder-icon" />
        <span class="placeholder-text">点击播放视频</span>
      </div>
    </div>
    
    <!-- 视频预览 -->
    <div v-else class="video-preview-content">
      <!-- 缩略图模式 -->
      <div v-if="mode === 'thumbnail'" class="thumbnail-container">
        <div class="video-thumbnail">
          <!-- 视频封面 -->
          <img
            v-if="posterSrc"
            :src="posterSrc"
            :alt="file.name"
            class="thumbnail-poster"
            @load="handlePosterLoad"
            @error="handlePosterError"
          />
          <!-- 默认封面 -->
          <div v-else class="default-poster">
            <PlayCircleOutlined class="poster-icon" />
          </div>
          
          <!-- 播放按钮覆盖层 -->
          <div class="play-overlay">
            <PlayCircleOutlined class="play-icon" />
          </div>
          
          <!-- 视频信息 -->
          <div class="video-info">
            <span v-if="videoInfo.duration" class="duration">
              {{ formatDuration(videoInfo.duration) }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 内联预览模式 -->
      <div v-else-if="mode === 'inline'" class="inline-container">
        <video
          ref="videoRef"
          :src="previewState.src"
          :poster="posterSrc"
          :controls="controls"
          :autoplay="autoplay"
          :muted="muted"
          :loop="loop"
          :preload="preload"
          class="inline-video"
          @loadedmetadata="handleVideoLoad"
          @error="handleVideoError"
          @play="handlePlay"
          @pause="handlePause"
          @ended="handleEnded"
        />
        
        <!-- 自定义控制条 -->
        <div v-if="!controls && showCustomControls" class="custom-controls">
          <a-button-group size="small">
            <a-button @click="togglePlay">
              <PlayCircleOutlined v-if="!isPlaying" />
              <PauseCircleOutlined v-else />
            </a-button>
            <a-button @click="toggleMute">
              <SoundOutlined v-if="!isMuted" />
              <SoundOutlined v-else style="opacity: 0.5" />
            </a-button>
            <a-button @click="toggleFullscreen">
              <FullscreenOutlined />
            </a-button>
          </a-button-group>
          
          <!-- 进度条 -->
          <div class="progress-container">
            <div class="progress-bar" @click="seekTo">
              <div 
                class="progress-fill" 
                :style="{ width: `${progress}%` }"
              />
            </div>
            <span class="time-info">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="previewState.loading" class="loading-overlay">
        <a-spin size="large" tip="加载视频中..." />
      </div>
      
      <!-- 错误状态 -->
      <div v-if="previewState.error" class="error-overlay">
        <div class="error-content">
          <ExclamationCircleOutlined class="error-icon" />
          <span class="error-text">视频加载失败</span>
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
      <div class="fullscreen-video-preview">
        <video
          ref="fullscreenVideoRef"
          :src="previewState.src"
          :poster="posterSrc"
          controls
          class="fullscreen-video"
          @loadedmetadata="handleVideoLoad"
        />
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
  Spin as ASpin
} from 'ant-design-vue'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  FullscreenOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { useIntersectionObserver } from '@vueuse/core'

import type { VideoPreviewProps, PreviewEmits, PreviewState } from './types'
import { getFilePreviewInfo, getVideoInfo, cleanupPreviewResource, formatDuration } from './utils'

// 定义组件名称
defineOptions({
  name: 'VideoPreview'
})

// 定义 Props
const props = withDefaults(defineProps<VideoPreviewProps>(), {
  mode: 'thumbnail',
  poster: true,
  controls: true,
  autoplay: false,
  muted: false,
  loop: false,
  preload: 'metadata',
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
const posterSrc = ref<string>()
const placeholderRef = ref<HTMLElement>()
const isIntersecting = ref(false)
const videoRef = ref<HTMLVideoElement>()
const fullscreenVideoRef = ref<HTMLVideoElement>()

// 视频播放状态
const isPlaying = ref(false)
const isMuted = ref(props.muted)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

// 视频信息
const videoInfo = ref<{
  duration?: number
  size?: { width: number; height: number }
  poster?: string
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
  'video-preview',
  `video-preview--${props.mode}`,
  {
    'video-preview--loading': previewState.value.loading,
    'video-preview--error': previewState.value.error,
    'video-preview--lazy': props.lazy
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

const showCustomControls = computed(() => props.mode === 'inline' && !props.controls)

// 方法
const loadPreview = async () => {
  if (previewState.value.loaded || previewState.value.loading) return
  
  previewState.value.loading = true
  previewState.value.error = null
  
  try {
    const previewInfo = getFilePreviewInfo(props.file)
    previewState.value.src = previewInfo.src
    
    // 生成视频封面
    if (props.poster && props.file.originFileObj) {
      try {
        const videoInfoData = await getVideoInfo(previewInfo.src)
        videoInfo.value = videoInfoData
        posterSrc.value = videoInfoData.poster
      } catch (error) {
        console.warn('Failed to generate video poster:', error)
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

const handleClick = () => {
  emit('click', props.file)
  
  if (props.mode === 'thumbnail') {
    openFullscreen()
  }
}

const handlePosterLoad = () => {
  // 封面加载成功
}

const handlePosterError = () => {
  // 封面加载失败，使用默认图标
  posterSrc.value = undefined
}

const handleVideoLoad = (event: Event) => {
  const video = event.target as HTMLVideoElement
  duration.value = video.duration
  videoInfo.value.duration = video.duration
  videoInfo.value.size = {
    width: video.videoWidth,
    height: video.videoHeight
  }
  
  emit('load', props.file)
}

const handleVideoError = (error: Event) => {
  previewState.value.error = new Error('Video load failed')
  emit('error', props.file, new Error('Video load failed'))
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  progress.value = 0
  currentTime.value = 0
}

const retry = () => {
  previewState.value.error = null
  loadPreview()
}

// 视频控制方法
const togglePlay = () => {
  const video = videoRef.value
  if (!video) return
  
  if (isPlaying.value) {
    video.pause()
  } else {
    video.play()
  }
}

const toggleMute = () => {
  const video = videoRef.value
  if (!video) return
  
  video.muted = !video.muted
  isMuted.value = video.muted
}

const toggleFullscreen = () => {
  openFullscreen()
}

const seekTo = (event: MouseEvent) => {
  const video = videoRef.value
  if (!video) return
  
  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  
  video.currentTime = percentage * duration.value
}

const updateProgress = () => {
  const video = videoRef.value
  if (!video) return
  
  currentTime.value = video.currentTime
  progress.value = (video.currentTime / duration.value) * 100
}

// 时间格式化
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 全屏控制
const openFullscreen = () => {
  fullscreenVisible.value = true
  emit('fullscreen', props.file, true)
}

const closeFullscreen = () => {
  fullscreenVisible.value = false
  emit('fullscreen', props.file, false)
}

// 监听文件变化
watch(() => props.file, () => {
  // 清理之前的资源
  if (previewState.value.src) {
    cleanupPreviewResource(previewState.value.src)
  }
  if (posterSrc.value) {
    cleanupPreviewResource(posterSrc.value)
  }
  
  // 重置状态
  previewState.value = {
    loading: false,
    error: null,
    loaded: false,
    src: null
  }
  posterSrc.value = undefined
  videoInfo.value = {}
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  progress.value = 0
  
  // 如果不是懒加载或已经在视口中，立即加载
  if (!props.lazy || isIntersecting.value) {
    loadPreview()
  }
}, { immediate: true })

// 监听视频播放进度
let progressTimer: number | null = null

watch(isPlaying, (playing) => {
  if (playing) {
    progressTimer = window.setInterval(updateProgress, 100)
  } else {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }
})

// 组件挂载
onMounted(() => {
  if (!props.lazy) {
    loadPreview()
  }
})

// 组件卸载时清理资源
onUnmounted(() => {
  stopObserver()
  
  if (progressTimer) {
    clearInterval(progressTimer)
  }
  
  if (previewState.value.src) {
    cleanupPreviewResource(previewState.value.src)
  }
  if (posterSrc.value) {
    cleanupPreviewResource(posterSrc.value)
  }
})
</script>

<style lang="scss" scoped>
.video-preview {
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
        
        .play-overlay {
          opacity: 1;
        }
      }
      
      .video-thumbnail {
        position: relative;
        width: 100%;
        height: 100%;
        
        .thumbnail-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .default-poster {
          width: 100%;
          height: 100%;
          min-height: 120px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .poster-icon {
            font-size: 48px;
            color: #1890ff;
          }
        }
        
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          
          .play-icon {
            color: white;
            font-size: 48px;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          }
        }
        
        .video-info {
          position: absolute;
          bottom: 8px;
          right: 8px;
          
          .duration {
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
          }
        }
      }
    }
  }
  
  &--inline {
    .inline-container {
      position: relative;
      
      .inline-video {
        width: 100%;
        height: auto;
        border-radius: 6px;
        background: #000;
      }
      
      .custom-controls {
        position: absolute;
        bottom: 8px;
        left: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 6px;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .progress-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          
          .progress-bar {
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            cursor: pointer;
            
            .progress-fill {
              height: 100%;
              background: #1890ff;
              border-radius: 2px;
              transition: width 0.1s ease;
            }
          }
          
          .time-info {
            color: white;
            font-size: 12px;
            white-space: nowrap;
          }
        }
      }
      
      &:hover .custom-controls {
        opacity: 1;
      }
    }
  }
  
  .video-preview-placeholder {
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
        font-size: 48px;
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

.fullscreen-video-preview {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .fullscreen-video {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
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

:deep(.ant-btn-group .ant-btn) {
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  background: transparent;
  
  &:hover {
    color: #1890ff;
    border-color: #1890ff;
  }
}
</style>