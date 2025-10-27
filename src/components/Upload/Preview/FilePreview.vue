<template>
  <div class="file-preview" :class="previewClasses">
    <!-- 图片预览 -->
    <ImagePreview
      v-if="isImageFile"
      :file="file"
      :mode="mode"
      :width="width"
      :height="height"
      :lazy="lazy"
      :thumbnail="imageConfig.thumbnail"
      :thumbnail-size="imageConfig.thumbnailSize"
      :fullscreen="imageConfig.fullscreen"
      :zoom="imageConfig.zoom"
      :rotate="imageConfig.rotate"
      :loading="imageConfig.loading"
      :class-name="className"
      @load="handleLoad"
      @error="handleError"
      @click="handleClick"
      @fullscreen="handleFullscreen"
    />
    
    <!-- 视频预览 -->
    <VideoPreview
      v-else-if="isVideoFile"
      :file="file"
      :mode="mode"
      :width="width"
      :height="height"
      :lazy="lazy"
      :poster="videoConfig.poster"
      :controls="videoConfig.controls"
      :autoplay="videoConfig.autoplay"
      :muted="videoConfig.muted"
      :loop="videoConfig.loop"
      :preload="videoConfig.preload"
      :class-name="className"
      @load="handleLoad"
      @error="handleError"
      @click="handleClick"
      @fullscreen="handleFullscreen"
    />
    
    <!-- 文档预览 -->
    <DocumentPreview
      v-else-if="isDocumentFile"
      :file="file"
      :mode="mode"
      :width="width"
      :height="height"
      :lazy="lazy"
      :show-navigation="documentConfig.showNavigation"
      :scale="documentConfig.scale"
      :allow-download="documentConfig.allowDownload"
      :class-name="className"
      @load="handleLoad"
      @error="handleError"
      @click="handleClick"
      @fullscreen="handleFullscreen"
    />
    
    <!-- 其他文件类型 -->
    <div v-else class="generic-file-preview">
      <div class="file-icon-container">
        <div class="file-icon">
          <FileOutlined />
        </div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size || 0) }}</div>
          <div class="file-type">{{ getFileTypeLabel(file) }}</div>
        </div>
      </div>
      
      <div v-if="mode !== 'thumbnail'" class="file-actions">
        <a-button type="primary" @click="downloadFile">
          <DownloadOutlined />
          下载文件
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button as AButton } from 'ant-design-vue'
import { FileOutlined, DownloadOutlined } from '@ant-design/icons-vue'

import ImagePreview from './ImagePreview.vue'
import VideoPreview from './VideoPreview.vue'
import DocumentPreview from './DocumentPreview.vue'

import type { 
  BasePreviewProps, 
  PreviewEmits, 
  ImagePreviewProps,
  VideoPreviewProps,
  DocumentPreviewProps
} from './types'
import { 
  isImageFile as checkIsImageFile, 
  isVideoFile as checkIsVideoFile, 
  isDocumentFile as checkIsDocumentFile, 
  formatFileSize, 
  getFileType 
} from '../utils'

// 定义组件名称
defineOptions({
  name: 'FilePreview'
})

// 扩展预览配置接口
interface FilePreviewProps extends BasePreviewProps {
  // 图片预览配置
  imageConfig?: Partial<Pick<ImagePreviewProps, 'thumbnail' | 'thumbnailSize' | 'fullscreen' | 'zoom' | 'rotate' | 'loading'>>
  // 视频预览配置
  videoConfig?: Partial<Pick<VideoPreviewProps, 'poster' | 'controls' | 'autoplay' | 'muted' | 'loop' | 'preload'>>
  // 文档预览配置
  documentConfig?: Partial<Pick<DocumentPreviewProps, 'showNavigation' | 'scale' | 'allowDownload'>>
}

// 定义 Props
const props = withDefaults(defineProps<FilePreviewProps>(), {
  mode: 'thumbnail',
  lazy: true,
  imageConfig: () => ({
    thumbnail: true,
    thumbnailSize: 200,
    fullscreen: true,
    zoom: true,
    rotate: true,
    loading: 'lazy'
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
const emit = defineEmits<PreviewEmits>()

// 计算属性
const previewClasses = computed(() => [
  'file-preview',
  `file-preview--${props.mode}`,
  {
    'file-preview--image': isImageFile.value,
    'file-preview--video': isVideoFile.value,
    'file-preview--document': isDocumentFile.value,
    'file-preview--generic': !isPreviewSupported.value
  },
  props.className
])

const isImageFile = computed(() => {
  return props.file.originFileObj ? 
    checkIsImageFile(props.file.originFileObj) : 
    props.file.type?.startsWith('image/') || false
})

const isVideoFile = computed(() => {
  return props.file.originFileObj ? 
    checkIsVideoFile(props.file.originFileObj) : 
    props.file.type?.startsWith('video/') || false
})

const isDocumentFile = computed(() => {
  return props.file.originFileObj ? 
    checkIsDocumentFile(props.file.originFileObj) : 
    props.file.type?.includes('pdf') || 
    props.file.type?.includes('document') || 
    props.file.type?.includes('text') || false
})

const isPreviewSupported = computed(() => {
  return isImageFile.value || isVideoFile.value || isDocumentFile.value
})

// 方法
const handleLoad = (file: any) => {
  emit('load', file)
}

const handleError = (file: any, error: Error) => {
  emit('error', file, error)
}

const handleClick = (file: any) => {
  emit('click', file)
}

const handleFullscreen = (file: any, fullscreen: boolean) => {
  emit('fullscreen', file, fullscreen)
}

const downloadFile = () => {
  if (props.file.url) {
    const link = document.createElement('a')
    link.href = props.file.url
    link.download = props.file.name || 'file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const getFileTypeLabel = (file: any): string => {
  if (!file.originFileObj && !file.type) return '未知类型'
  
  const fileType = file.originFileObj ? 
    getFileType(file.originFileObj) : 
    file.type?.split('/')[0] || 'other'
  
  const typeLabels = {
    image: '图片文件',
    video: '视频文件',
    document: '文档文件',
    audio: '音频文件',
    archive: '压缩文件',
    other: '其他文件'
  }
  
  return typeLabels[fileType as keyof typeof typeLabels] || '其他文件'
}
</script>

<style lang="scss" scoped>
.file-preview {
  position: relative;
  
  &--thumbnail {
    .generic-file-preview {
      display: inline-block;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      min-width: 120px;
      
      &:hover {
        border-color: #1890ff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .file-icon-container {
        .file-icon {
          font-size: 48px;
          color: #1890ff;
          margin-bottom: 8px;
        }
        
        .file-info {
          .file-name {
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
          
          .file-size,
          .file-type {
            font-size: 12px;
            color: #666;
            margin-bottom: 2px;
          }
        }
      }
    }
  }
  
  &--inline,
  &--modal {
    .generic-file-preview {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding: 24px;
      text-align: center;
      background: white;
      
      .file-icon-container {
        margin-bottom: 16px;
        
        .file-icon {
          font-size: 64px;
          color: #1890ff;
          margin-bottom: 12px;
        }
        
        .file-info {
          .file-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
            word-break: break-all;
          }
          
          .file-size,
          .file-type {
            font-size: 14px;
            color: #666;
            margin-bottom: 4px;
          }
        }
      }
      
      .file-actions {
        margin-top: 16px;
      }
    }
  }
}
</style>