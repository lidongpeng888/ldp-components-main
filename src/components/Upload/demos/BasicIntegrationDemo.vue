<template>
  <div class="basic-integration-demo">
    <div class="demo-description">
      <h4>基础上传预览集成演示</h4>
      <p>展示文件上传后立即预览的基本功能，支持图片、视频、文档等多种文件类型。</p>
    </div>

    <div class="demo-content">
      <!-- 上传组件 -->
      <div class="upload-section">
        <Upload
          v-bind="uploadProps"
          @change="handleUploadChange"
          @preview="handlePreview"
          @success="handleUploadSuccess"
          @error="handleUploadError"
        >
          <div class="upload-area">
            <InboxOutlined class="upload-icon" />
            <p class="upload-text">点击或拖拽文件到此区域上传</p>
            <p class="upload-hint">支持图片、视频、文档等多种格式</p>
          </div>
        </Upload>
      </div>

      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="file-list-section">
        <h5>已上传文件</h5>
        <div class="file-list">
          <div
            v-for="file in fileList"
            :key="file.uid"
            class="file-item"
            @click="handleFileClick(file)"
          >
            <!-- 文件缩略图 -->
            <div class="file-thumbnail">
              <img
                v-if="file.thumbUrl || isImageFile(file)"
                :src="file.thumbUrl || file.url"
                :alt="file.name"
                @error="handleThumbnailError"
              />
              <div v-else class="file-icon">
                <FileOutlined />
              </div>
            </div>
            
            <!-- 文件信息 -->
            <div class="file-info">
              <div class="file-name" :title="file.name">{{ file.name }}</div>
              <div class="file-meta">
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <span class="file-status" :class="file.status">
                  {{ getStatusText(file.status) }}
                </span>
              </div>
            </div>
            
            <!-- 文件操作 -->
            <div class="file-actions">
              <button
                v-if="canPreview(file)"
                class="action-btn preview-btn"
                @click.stop="handlePreview(file)"
                title="预览"
              >
                <EyeOutlined />
              </button>
              <button
                class="action-btn download-btn"
                @click.stop="handleDownload(file)"
                title="下载"
              >
                <DownloadOutlined />
              </button>
              <button
                class="action-btn remove-btn"
                @click.stop="handleRemove(file)"
                title="删除"
              >
                <DeleteOutlined />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览模态框 -->
    <PreviewModal
      v-if="previewVisible"
      :visible="previewVisible"
      :file="currentPreviewFile"
      v-bind="previewConfig"
      @close="handlePreviewClose"
      @download="handlePreviewDownload"
    />

    <!-- 统计信息 -->
    <div v-if="showStats" class="stats-section">
      <div class="stats-item">
        <span class="stats-label">总文件数:</span>
        <span class="stats-value">{{ fileList.length }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">成功上传:</span>
        <span class="stats-value">{{ successCount }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">上传失败:</span>
        <span class="stats-value">{{ errorCount }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">总大小:</span>
        <span class="stats-value">{{ formatFileSize(totalSize) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  InboxOutlined,
  FileOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'
import Upload from '../Upload.vue'
import PreviewModal from '../Preview/PreviewModal.vue'
import type { UploadPreviewConfig, DemoEvent } from '../types/demo'

// 定义组件名称
defineOptions({
  name: 'BasicIntegrationDemo'
})

// Props 定义
interface BasicIntegrationDemoProps {
  config: UploadPreviewConfig
  showStats?: boolean
}

const props = withDefaults(defineProps<BasicIntegrationDemoProps>(), {
  showStats: true
})

// Emits 定义
interface BasicIntegrationDemoEmits {
  'config-change': [config: Partial<UploadPreviewConfig>]
  'event': [event: DemoEvent]
}

const emit = defineEmits<BasicIntegrationDemoEmits>()

// 状态管理
const fileList = ref<UploadFile[]>([])
const previewVisible = ref(false)
const currentPreviewFile = ref<UploadFile | null>(null)

// 计算属性
const uploadProps = computed(() => ({
  multiple: props.config.upload?.multiple ?? true,
  dragUpload: props.config.upload?.dragUpload ?? true,
  maxSize: props.config.upload?.maxSize ?? 10,
  maxCount: props.config.upload?.maxCount ?? 10,
  allowedTypes: props.config.upload?.allowedTypes ?? [],
  concurrent: props.config.upload?.concurrent ?? 3,
  autoUpload: props.config.upload?.autoUpload ?? true,
  preview: props.config.preview?.enabled ?? true
}))

const previewConfig = computed(() => ({
  imageConfig: props.config.preview?.imageConfig,
  videoConfig: props.config.preview?.videoConfig,
  documentConfig: props.config.preview?.documentConfig
}))

const successCount = computed(() => 
  fileList.value.filter(file => file.status === 'done').length
)

const errorCount = computed(() => 
  fileList.value.filter(file => file.status === 'error').length
)

const totalSize = computed(() => 
  fileList.value.reduce((total, file) => total + (file.size || 0), 0)
)

// 方法定义
const handleUploadChange = (info: { file: UploadFile; fileList: UploadFile[] }) => {
  fileList.value = [...info.fileList]
  
  // 记录上传变化事件
  emit('event', {
    type: 'upload-change',
    data: {
      fileName: info.file.name,
      status: info.file.status,
      fileCount: info.fileList.length
    },
    timestamp: new Date()
  })
  
  // 自动预览逻辑
  if (props.config.integration?.autoPreview && info.file.status === 'done') {
    setTimeout(() => {
      handlePreview(info.file)
    }, 500)
  }
}

const handleUploadSuccess = (file: UploadFile, response: any) => {
  message.success(`文件 "${file.name}" 上传成功`)
  
  emit('event', {
    type: 'upload-success',
    data: {
      fileName: file.name,
      fileSize: file.size,
      response
    },
    timestamp: new Date()
  })
}

const handleUploadError = (file: UploadFile, error: Error) => {
  message.error(`文件 "${file.name}" 上传失败: ${error.message}`)
  
  emit('event', {
    type: 'upload-error',
    data: {
      fileName: file.name,
      error: error.message
    },
    timestamp: new Date()
  })
}

const handlePreview = (file: UploadFile) => {
  if (!canPreview(file)) {
    message.warning('该文件类型不支持预览')
    return
  }
  
  currentPreviewFile.value = file
  previewVisible.value = true
  
  emit('event', {
    type: 'preview-open',
    data: {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    },
    timestamp: new Date()
  })
}

const handlePreviewClose = () => {
  previewVisible.value = false
  
  emit('event', {
    type: 'preview-close',
    data: {
      fileName: currentPreviewFile.value?.name
    },
    timestamp: new Date()
  })
  
  currentPreviewFile.value = null
}

const handlePreviewDownload = (file: UploadFile) => {
  handleDownload(file)
  
  emit('event', {
    type: 'preview-download',
    data: {
      fileName: file.name
    },
    timestamp: new Date()
  })
}

const handleFileClick = (file: UploadFile) => {
  if (canPreview(file)) {
    handlePreview(file)
  }
}

const handleDownload = (file: UploadFile) => {
  if (file.url) {
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name || 'download'
    a.click()
    
    message.success(`开始下载 "${file.name}"`)
    
    emit('event', {
      type: 'file-download',
      data: {
        fileName: file.name
      },
      timestamp: new Date()
    })
  }
}

const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
    message.success(`文件 "${file.name}" 已删除`)
    
    emit('event', {
      type: 'file-remove',
      data: {
        fileName: file.name
      },
      timestamp: new Date()
    })
  }
}

const handleThumbnailError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const isImageFile = (file: UploadFile): boolean => {
  return file.type?.startsWith('image/') ?? false
}

const canPreview = (file: UploadFile): boolean => {
  if (!props.config.preview?.enabled) return false
  
  const type = file.type || ''
  return (
    type.startsWith('image/') ||
    type.startsWith('video/') ||
    type === 'application/pdf' ||
    type.includes('text/')
  )
}

const formatFileSize = (size?: number): string => {
  if (!size) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0
  let fileSize = size
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  
  return `${fileSize.toFixed(1)} ${units[unitIndex]}`
}

const getStatusText = (status?: string): string => {
  const statusMap: Record<string, string> = {
    uploading: '上传中',
    done: '已完成',
    error: '上传失败',
    removed: '已删除'
  }
  return statusMap[status || ''] || '未知'
}

// 监听配置变化
watch(() => props.config, (newConfig) => {
  // 配置变化时的处理逻辑
  emit('event', {
    type: 'config-applied',
    data: newConfig,
    timestamp: new Date()
  })
}, { deep: true })

// 暴露组件方法
defineExpose({
  getFileList: () => fileList.value,
  clearFiles: () => {
    fileList.value = []
    emit('event', {
      type: 'files-cleared',
      data: {},
      timestamp: new Date()
    })
  },
  getStats: () => ({
    total: fileList.value.length,
    success: successCount.value,
    error: errorCount.value,
    totalSize: totalSize.value
  })
})
</script>

<style lang="scss" scoped>
.basic-integration-demo {
  .demo-description {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #1890ff;

    h4 {
      margin: 0 0 8px 0;
      color: #262626;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }
  }

  .demo-content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .upload-section {
      .upload-area {
        padding: 40px 20px;
        text-align: center;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        background: #fafafa;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          border-color: #1890ff;
          background: #f0f8ff;
        }

        .upload-icon {
          font-size: 48px;
          color: #999;
          margin-bottom: 16px;
        }

        .upload-text {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #666;
        }

        .upload-hint {
          margin: 0;
          font-size: 14px;
          color: #999;
        }
      }
    }

    .file-list-section {
      h5 {
        margin: 0 0 16px 0;
        font-size: 14px;
        font-weight: 600;
        color: #262626;
      }

      .file-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          .file-thumbnail {
            width: 48px;
            height: 48px;
            border-radius: 4px;
            overflow: hidden;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .file-icon {
              font-size: 24px;
              color: #999;
            }
          }

          .file-info {
            flex: 1;
            min-width: 0;

            .file-name {
              font-size: 14px;
              font-weight: 500;
              color: #262626;
              margin-bottom: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .file-meta {
              display: flex;
              gap: 12px;
              font-size: 12px;

              .file-size {
                color: #666;
              }

              .file-status {
                &.uploading {
                  color: #1890ff;
                }

                &.done {
                  color: #52c41a;
                }

                &.error {
                  color: #ff4d4f;
                }
              }
            }
          }

          .file-actions {
            display: flex;
            gap: 4px;

            .action-btn {
              width: 28px;
              height: 28px;
              border: 1px solid #d9d9d9;
              border-radius: 4px;
              background: #fff;
              color: #666;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s;

              &:hover {
                border-color: #1890ff;
                color: #1890ff;
              }

              &.remove-btn:hover {
                border-color: #ff4d4f;
                color: #ff4d4f;
              }
            }
          }
        }
      }
    }
  }

  .stats-section {
    display: flex;
    gap: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 6px;
    margin-top: 24px;

    .stats-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .stats-label {
        font-size: 12px;
        color: #666;
      }

      .stats-value {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .basic-integration-demo {
    .demo-content .upload-section .upload-area {
      padding: 24px 16px;

      .upload-icon {
        font-size: 36px;
      }

      .upload-text {
        font-size: 14px;
      }

      .upload-hint {
        font-size: 12px;
      }
    }

    .stats-section {
      flex-wrap: wrap;
      gap: 16px;

      .stats-item {
        flex: 1;
        min-width: 80px;
      }
    }
  }
}
</style>