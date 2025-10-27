/**
 * Upload 组件类型定义
 * 基于 Ant Design Vue Upload 组件进行扩展
 */

import type { CSSProperties } from 'vue'
import type { UploadProps as AntUploadProps, UploadFile } from 'ant-design-vue'

// 文件验证规则类型
export interface FileValidationRule {
  // 允许的文件类型 (MIME types 或文件扩展名)
  types?: string[]
  // 单个文件最大大小 (MB)
  maxSize?: number
  // 最大文件数量
  maxCount?: number
  // 批量上传时的总大小限制 (MB)
  maxTotalSize?: number
  // 自定义验证函数
  validator?: (file: File) => boolean | Promise<boolean> | string
}

// 文件预览配置
export interface PreviewConfig {
  // 是否启用预览
  enabled?: boolean
  // 图片预览配置
  image?: {
    thumbnail?: boolean
    fullscreen?: boolean
    zoom?: boolean
  }
  // 文档预览配置
  document?: {
    pdf?: boolean
    office?: boolean
    text?: boolean
  }
  // 视频预览配置
  video?: {
    poster?: boolean
    controls?: boolean
    autoplay?: boolean
  }
}

// 上传进度信息
export interface UploadProgress {
  file: UploadFile
  percent: number
  loaded: number
  total: number
  speed?: number // bytes/second
}

// 上传错误信息
export interface UploadError {
  file: UploadFile
  error: Error
  code?: string
  message?: string
  retryable?: boolean
}

// 简化的 Upload 组件 Props - 修复可选属性问题
export interface SimpleUploadProps {
  // 基础属性
  dragUpload?: boolean
  multiple?: boolean
  accept?: string
  disabled?: boolean
  action?: string
  
  // 简化的验证
  maxSize?: number // MB
  maxCount?: number
  allowedTypes?: string[]
  
  // 高级功能
  concurrent?: number // 并发上传数量
  retryCount?: number // 重试次数
  pasteUpload?: boolean // 粘贴上传
  autoUpload?: boolean // 自动上传
  
  // 事件处理 - 添加正确的类型注解
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  customRequest?: (options: {
    file: File
    onProgress: (event: { percent: number }) => void
    onSuccess: (response: any, file: File) => void
    onError: (error: Error, file: File) => void
  }) => void
}

// 完整的 Upload 组件 Props (保留原有接口以兼容)
export interface CustomUploadProps extends Omit<AntUploadProps, 'beforeUpload' | 'customRequest'> {
  // 文件验证规则
  validation?: FileValidationRule
  
  // 预览配置
  preview?: boolean | PreviewConfig
  
  // 拖拽上传 (基于 a-upload-dragger 组件)
  dragUpload?: boolean
  
  // 粘贴上传 (基于原生 paste 事件监听)
  pasteUpload?: boolean
  
  // 并发上传数量
  concurrent?: number
  
  // 失败重试次数
  retryCount?: number
  
  // 自动上传
  autoUpload?: boolean
  
  // 上传前的文件处理
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean> | File | Promise<File>
  
  // 自定义上传请求
  customRequest?: (options: any) => void
  
  // 样式相关
  className?: string
  style?: CSSProperties
}

// 简化的 Upload 组件 Emits - 修复类型匹配问题
export interface SimpleUploadEmits {
  // 文件状态改变
  change: [info: { file: UploadFile; fileList: UploadFile[] }]
  
  // 上传成功
  success: [file: UploadFile, response: any]
  
  // 上传失败
  error: [file: UploadFile, error: Error]
  
  // 文件移除
  remove: [file: UploadFile]
  
  // 文件预览
  preview: [file: UploadFile]
  
  // 高级功能事件
  progress: [progress: UploadProgress]
  paste: [files: File[]]
  'validation-error': [file: File, error: string]
}

// 完整的 Upload 组件 Emits (保留原有接口以兼容)
export interface CustomUploadEmits {
  // 文件状态改变
  'change': (info: { file: UploadFile; fileList: UploadFile[] }) => void
  
  // 上传进度
  'progress': (progress: UploadProgress) => void
  
  // 上传成功
  'success': (file: UploadFile, response: any) => void
  
  // 上传失败
  'error': (error: UploadError) => void
  
  // 文件预览
  'preview': (file: UploadFile) => void
  
  // 预览加载成功
  'preview-load': (file: UploadFile) => void
  
  // 预览加载失败
  'preview-error': (file: UploadFile, error: Error) => void
  
  // 文件移除
  'remove': (file: UploadFile) => void
  
  // 文件验证失败
  'validation-error': (file: File, error: string) => void
  
  // 粘贴上传
  'paste': (files: File[]) => void
}

// 自定义 Upload 组件 Slots
export interface CustomUploadSlots {
  // 默认插槽 - 上传按钮/区域
  default?: () => any
  
  // 文件列表项自定义渲染
  itemRender?: (props: { file: UploadFile; actions: any }) => any
  
  // 预览组件自定义渲染
  previewRender?: (props: { file: UploadFile; src: string }) => any
  
  // 拖拽区域自定义渲染
  dragRender?: () => any
  
  // 上传提示文本
  hint?: () => any
}

// 上传统计信息
export interface UploadStats {
  total: number
  uploading: number
  done: number
  error: number
  progress: number
}

// 组件实例暴露的方法
export interface CustomUploadExpose {
  // 原生 Upload 组件实例
  uploadInstance: any
  
  // 手动上传
  upload: () => void
  
  // 清空文件列表
  clearFiles: () => void
  
  // 重试失败的文件
  retry: (file?: UploadFile) => void
  
  // 获取文件列表
  getFileList: () => UploadFile[]
  
  // 添加文件
  addFiles: (files: File[]) => void
  
  // 移除文件
  removeFile: (file: UploadFile) => void
  
  // 获取上传统计信息
  getUploadStats: () => UploadStats
  
  // 是否有文件正在上传
  isUploading: () => boolean
  
  // 是否有失败的文件
  hasErrors: () => boolean
}

// 文件类型枚举
export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document', 
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  OTHER = 'other'
}

// 文件状态枚举
export enum FileStatus {
  UPLOADING = 'uploading',
  DONE = 'done',
  ERROR = 'error',
  REMOVED = 'removed'
}

// 预设的文件类型配置
export const FILE_TYPE_CONFIG = {
  [FileType.IMAGE]: {
    types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    maxSize: 10, // 10MB
    preview: true
  },
  [FileType.DOCUMENT]: {
    types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.pdf', '.doc', '.docx', '.txt'],
    maxSize: 50, // 50MB
    preview: true
  },
  [FileType.VIDEO]: {
    types: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
    extensions: ['.mp4', '.avi', '.mov', '.wmv'],
    maxSize: 500, // 500MB
    preview: true
  },
  [FileType.AUDIO]: {
    types: ['audio/mp3', 'audio/wav', 'audio/ogg'],
    extensions: ['.mp3', '.wav', '.ogg'],
    maxSize: 100, // 100MB
    preview: false
  },
  [FileType.ARCHIVE]: {
    types: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    extensions: ['.zip', '.rar', '.7z'],
    maxSize: 1000, // 1GB
    preview: false
  }
}