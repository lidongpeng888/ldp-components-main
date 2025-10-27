/**
 * 上传预览演示组件类型定义
 */

import type { Component } from 'vue'
import type { UploadFile } from 'ant-design-vue'

// 演示场景配置
export interface DemoScenario {
  // 场景唯一标识
  id: string
  // 场景标题
  title: string
  // 场景描述
  description: string
  // 功能特性列表
  features?: string[]
  // 场景组件
  component: string | Component
  // 默认配置
  config: UploadPreviewConfig
  // 配置模式定义
  configSchema?: ConfigSchema
  // 代码示例
  code?: string
}

// 上传预览集成配置
export interface UploadPreviewConfig {
  // 上传配置
  upload?: {
    multiple?: boolean
    dragUpload?: boolean
    maxSize?: number
    allowedTypes?: string[]
    maxCount?: number
    concurrent?: number
    retryCount?: number
    autoUpload?: boolean
  }
  
  // 预览配置
  preview?: {
    enabled?: boolean
    mode?: 'modal' | 'inline' | 'thumbnail'
    imageConfig?: ImagePreviewConfig
    videoConfig?: VideoPreviewConfig
    documentConfig?: DocumentPreviewConfig
  }
  
  // 集成配置
  integration?: {
    autoPreview?: boolean
    previewOnUpload?: boolean
    thumbnailInList?: boolean
    quickActions?: boolean
    previewTrigger?: 'click' | 'hover' | 'manual'
  }
  
  // 性能配置
  performance?: {
    lazyLoad?: boolean
    cacheSize?: number
    preloadNext?: boolean
    virtualScroll?: boolean
  }
  
  // 样式配置
  style?: {
    theme?: 'light' | 'dark'
    size?: 'small' | 'medium' | 'large'
    borderRadius?: number
    spacing?: number
  }
}

// 图片预览配置
export interface ImagePreviewConfig {
  zoom?: boolean
  rotate?: boolean
  fullscreen?: boolean
  thumbnail?: boolean
  thumbnailSize?: number
  loading?: 'lazy' | 'eager'
}

// 视频预览配置
export interface VideoPreviewConfig {
  controls?: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  poster?: boolean
  preload?: 'none' | 'metadata' | 'auto'
}

// 文档预览配置
export interface DocumentPreviewConfig {
  navigation?: boolean
  download?: boolean
  scale?: number
  pageMode?: 'single' | 'continuous'
  toolbar?: boolean
}

// 配置模式定义
export interface ConfigSchema {
  [category: string]: {
    [key: string]: ConfigFieldSchema
  }
}

// 配置字段模式
export interface ConfigFieldSchema {
  type: 'boolean' | 'number' | 'string' | 'select' | 'multiSelect' | 'range'
  label: string
  description?: string
  default?: any
  min?: number
  max?: number
  step?: number
  options?: Array<{ value: any; label: string }>
  validation?: (value: any) => boolean | string
}

// 演示事件
export interface DemoEvent {
  type: string
  data: any
  timestamp: Date
  scenarioId?: string
  fileInfo?: {
    name: string
    type: string
    size: number
  }
}

// 演示统计信息
export interface DemoStats {
  totalUploads: number
  totalPreviews: number
  successRate: number
  averageUploadTime: number
  averagePreviewTime: number
  errorCount: number
  popularFileTypes: Array<{
    type: string
    count: number
    percentage: number
  }>
}

// 演示状态
export interface DemoState {
  currentScenario: string
  config: UploadPreviewConfig
  uploadedFiles: UploadFile[]
  previewHistory: PreviewHistoryItem[]
  eventLog: DemoEvent[]
  stats: DemoStats
}

// 预览历史记录
export interface PreviewHistoryItem {
  file: UploadFile
  previewTime: Date
  duration: number
  actions: PreviewAction[]
}

// 预览操作
export interface PreviewAction {
  type: 'zoom' | 'rotate' | 'download' | 'fullscreen' | 'navigate'
  timestamp: Date
  value?: any
  metadata?: Record<string, any>
}

// 文件类型统计
export interface FileTypeStats {
  type: string
  count: number
  totalSize: number
  averageSize: number
  successRate: number
}

// 演示组件属性
export interface DemoComponentProps {
  config: UploadPreviewConfig
  scenarioId?: string
  eventLogger?: (event: DemoEvent) => void
}

// 演示组件事件
export interface DemoComponentEmits {
  'config-change': [config: Partial<UploadPreviewConfig>]
  'event': [event: DemoEvent]
  'file-upload': [file: UploadFile]
  'file-preview': [file: UploadFile]
  'error': [error: Error, context?: any]
}

// 代码生成选项
export interface CodeGenerationOptions {
  language: 'vue' | 'react' | 'angular'
  framework: 'vue3' | 'vue2' | 'react' | 'angular'
  typescript: boolean
  includeStyles: boolean
  includeComments: boolean
  minify: boolean
}

// 导出配置
export interface ExportConfig {
  format: 'json' | 'yaml' | 'js' | 'ts'
  includeDefaults: boolean
  includeComments: boolean
  minify: boolean
}

// 导入配置
export interface ImportConfig {
  source: 'file' | 'url' | 'text'
  format: 'json' | 'yaml' | 'js' | 'ts'
  validate: boolean
  merge: boolean
}

// 预设配置
export interface PresetConfig {
  id: string
  name: string
  description: string
  config: UploadPreviewConfig
  tags: string[]
  author?: string
  version?: string
  createdAt?: Date
  updatedAt?: Date
}

// 演示场景类型枚举
export enum DemoScenarioType {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  MOBILE = 'mobile',
  CUSTOM = 'custom',
  INTEGRATION = 'integration',
  PERFORMANCE = 'performance'
}

// 事件类型枚举
export enum DemoEventType {
  SCENARIO_CHANGE = 'scenario-change',
  CONFIG_CHANGE = 'config-change',
  CONFIG_RESET = 'config-reset',
  FILE_UPLOAD = 'file-upload',
  FILE_PREVIEW = 'file-preview',
  PREVIEW_OPEN = 'preview-open',
  PREVIEW_CLOSE = 'preview-close',
  PREVIEW_ERROR = 'preview-error',
  CODE_COPY = 'code-copy',
  CONFIG_EXPORT = 'config-export',
  CONFIG_IMPORT = 'config-import',
  ERROR = 'error'
}

// 配置验证结果
export interface ConfigValidationResult {
  valid: boolean
  errors: Array<{
    path: string
    message: string
    value: any
  }>
  warnings: Array<{
    path: string
    message: string
    value: any
  }>
}

// 演示环境信息
export interface DemoEnvironment {
  browser: string
  version: string
  platform: string
  screenSize: {
    width: number
    height: number
  }
  touchSupport: boolean
  fileApiSupport: boolean
  clipboardApiSupport: boolean
}