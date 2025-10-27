/**
 * 文件预览组件类型定义
 */

import type { UploadFile } from 'ant-design-vue'

// 预览模式
export type PreviewMode = 'thumbnail' | 'modal' | 'inline'

// 预览组件基础属性
export interface BasePreviewProps {
  file: UploadFile
  mode?: PreviewMode
  width?: number | string
  height?: number | string
  lazy?: boolean
  className?: string
}

// 图片预览属性
export interface ImagePreviewProps extends BasePreviewProps {
  // 是否显示缩略图
  thumbnail?: boolean
  // 缩略图尺寸
  thumbnailSize?: number
  // 是否支持全屏预览
  fullscreen?: boolean
  // 是否支持缩放
  zoom?: boolean
  // 是否支持旋转
  rotate?: boolean
  // 预加载策略
  loading?: 'lazy' | 'eager'
}

// 文档预览属性
export interface DocumentPreviewProps extends BasePreviewProps {
  // 是否显示页面导航
  showNavigation?: boolean
  // 默认缩放比例
  scale?: number
  // 是否允许下载
  allowDownload?: boolean
  // PDF.js 配置
  pdfConfig?: {
    workerSrc?: string
    cMapUrl?: string
  }
}

// 视频预览属性
export interface VideoPreviewProps extends BasePreviewProps {
  // 是否显示封面
  poster?: boolean
  // 是否显示控制条
  controls?: boolean
  // 是否自动播放
  autoplay?: boolean
  // 是否静音
  muted?: boolean
  // 是否循环播放
  loop?: boolean
  // 预加载策略
  preload?: 'none' | 'metadata' | 'auto'
}

// 预览组件事件
export interface PreviewEmits {
  'load': (file: UploadFile) => void
  'error': (file: UploadFile, error: Error) => void
  'click': (file: UploadFile) => void
  'fullscreen': (file: UploadFile, fullscreen: boolean) => void
}

// 预览状态
export interface PreviewState {
  loading: boolean
  error: Error | null
  loaded: boolean
  src: string | null
}

// 懒加载配置
export interface LazyLoadConfig {
  // 根边距
  rootMargin?: string
  // 阈值
  threshold?: number | number[]
  // 是否启用
  enabled?: boolean
}

// 文件预览信息
export interface FilePreviewInfo {
  type: 'image' | 'document' | 'video' | 'audio' | 'other'
  src: string
  thumbnail?: string
  poster?: string
  duration?: number
  pages?: number
  size: {
    width?: number
    height?: number
  }
}