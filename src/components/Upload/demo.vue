<template>
  <div class="upload-demo">
    <h2>简化版文件上传组件演示</h2>
    <p class="demo-intro">
      基于 Ant Design Vue 的 a-upload 和 a-upload-dragger 组件封装的简化版本，
      专注于基础上传功能，支持文件验证和拖拽上传。
    </p>
    
    <!-- 基础上传 - 单文件 -->
    <div class="demo-section">
      <h3>基础上传 - 单文件</h3>
      <p class="demo-description">支持单文件上传，带有文件大小和类型验证</p>
      <CustomUpload
        :multiple="false"
        :max-size="5"
        :allowed-types="['.jpg', '.png', '.gif', 'image/']"
        :max-count="1"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
      />
    </div>
    
    <!-- 基础上传 - 多文件 -->
    <div class="demo-section">
      <h3>基础上传 - 多文件</h3>
      <p class="demo-description">支持多文件上传，最多5个文件，每个文件最大10MB</p>
      <CustomUpload
        :multiple="true"
        :max-size="10"
        :max-count="5"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
      />
    </div>
    
    <!-- 拖拽上传 -->
    <div class="demo-section">
      <h3>拖拽上传</h3>
      <p class="demo-description">支持拖拽文件到区域内上传，仅支持图片文件</p>
      <CustomUpload
        drag-upload
        :multiple="true"
        :max-size="5"
        :allowed-types="['image/jpeg', 'image/png', 'image/gif', 'image/webp']"
        :max-count="3"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
      >
        <template #hint>
          仅支持 JPG、PNG、GIF、WebP 格式的图片文件
        </template>
      </CustomUpload>
    </div>
    
    <!-- 预览功能演示 -->
    <div class="demo-section">
      <h3>文件预览功能</h3>
      <p class="demo-description">支持图片、视频、文档文件的预览功能，点击文件列表中的预览图标查看</p>
      <CustomUpload
        :multiple="true"
        :max-size="10"
        :max-count="5"
        :preview="true"
        :preview-config="{
          image: { zoom: true, rotate: true, fullscreen: true },
          video: { controls: true, autoplay: false },
          document: { navigation: true, download: true }
        }"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
        @preview="handlePreview"
      />
    </div>
    
    <!-- 文件类型限制演示 -->
    <div class="demo-section">
      <h3>文件类型限制</h3>
      <p class="demo-description">仅允许上传 PDF 和 Word 文档</p>
      <CustomUpload
        :multiple="true"
        :max-size="20"
        :allowed-types="['application/pdf', '.doc', '.docx']"
        :max-count="3"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
      />
    </div>
    
    <!-- 自定义上传处理 -->
    <div class="demo-section">
      <h3>自定义上传处理</h3>
      <p class="demo-description">使用自定义的 beforeUpload 和 customRequest 处理</p>
      <CustomUpload
        :multiple="false"
        :max-size="2"
        :before-upload="customBeforeUpload"
        :custom-request="customRequest"
        @change="handleChange"
        @success="handleSuccess"
        @error="handleError"
      />
    </div>
    
    <!-- 上传状态显示 -->
    <div v-if="uploadStats.total > 0" class="upload-stats">
      <h4>上传统计:</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">总文件数:</span>
          <span class="stat-value">{{ uploadStats.total }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">上传中:</span>
          <span class="stat-value">{{ uploadStats.uploading }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已完成:</span>
          <span class="stat-value">{{ uploadStats.done }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">失败:</span>
          <span class="stat-value">{{ uploadStats.error }}</span>
        </div>
      </div>
    </div>
    
    <!-- 消息显示 -->
    <div v-if="messages.length > 0" class="messages">
      <a-alert
        v-for="(message, index) in messages"
        :key="index"
        :message="message.text"
        :type="message.type"
        show-icon
        closable
        @close="removeMessage(index)"
        style="margin-bottom: 8px;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Alert as AAlert } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'

import CustomUpload from './Upload.vue'

// 响应式数据
const messages = ref<{ text: string; type: 'success' | 'error' | 'warning' | 'info' }[]>([])
const allFiles = ref<UploadFile[]>([])

// 计算上传统计信息
const uploadStats = computed(() => {
  const total = allFiles.value.length
  const uploading = allFiles.value.filter(file => file.status === 'uploading').length
  const done = allFiles.value.filter(file => file.status === 'done').length
  const error = allFiles.value.filter(file => file.status === 'error').length
  
  return {
    total,
    uploading,
    done,
    error
  }
})

// 事件处理函数
const handleChange = (info: { file: UploadFile; fileList: UploadFile[] }) => {
  console.log('文件状态改变:', info)
  
  // 更新全局文件列表
  const existingIndex = allFiles.value.findIndex(f => f.uid === info.file.uid)
  if (existingIndex !== -1) {
    allFiles.value[existingIndex] = info.file
  } else {
    allFiles.value.push(info.file)
  }
  
  addMessage(`文件 ${info.file.name} 状态: ${info.file.status}`, 'info')
}

const handleSuccess = (file: UploadFile, response: any) => {
  console.log('上传成功:', file, response)
  addMessage(`文件 ${file.name} 上传成功`, 'success')
}

const handleError = (file: UploadFile, error: Error) => {
  console.log('上传失败:', file, error)
  addMessage(`文件 ${file.name} 上传失败: ${error.message}`, 'error')
}

const handlePreview = (file: UploadFile) => {
  console.log('预览文件:', file)
  addMessage(`预览文件: ${file.name}`, 'info')
}

// 自定义上传前处理
const customBeforeUpload = async (file: File): Promise<boolean> => {
  console.log('自定义上传前处理:', file)
  
  // 模拟一些自定义验证逻辑
  if (file.name.includes('test')) {
    addMessage('文件名不能包含 "test"', 'error')
    return false
  }
  
  addMessage(`通过自定义验证: ${file.name}`, 'success')
  return true
}

// 自定义上传请求
const customRequest = (options: {
  file: File
  onProgress: (event: { percent: number }) => void
  onSuccess: (response: any, file: File) => void
  onError: (error: Error, file: File) => void
}) => {
  console.log('自定义上传请求:', options)
  
  // 模拟上传进度
  let progress = 0
  const timer = setInterval(() => {
    progress += Math.random() * 30
    if (progress >= 100) {
      progress = 100
      clearInterval(timer)
      
      // 模拟上传成功
      setTimeout(() => {
        options.onSuccess({ url: 'https://example.com/uploaded-file' }, options.file)
        addMessage(`自定义上传完成: ${options.file.name}`, 'success')
      }, 200)
    }
    
    options.onProgress({ percent: Math.round(progress) })
  }, 200)
}

// 工具函数
const addMessage = (text: string, type: 'success' | 'error' | 'warning' | 'info') => {
  messages.value.push({ text, type })
  
  // 自动移除消息
  setTimeout(() => {
    const index = messages.value.findIndex(m => m.text === text && m.type === type)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }, 5000)
}

const removeMessage = (index: number) => {
  messages.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.upload-demo {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    margin-bottom: 16px;
    color: #262626;
  }
  
  .demo-intro {
    margin-bottom: 24px;
    padding: 16px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 6px;
    color: #0050b3;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .demo-section {
    margin-bottom: 32px;
    padding: 24px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    background: #fafafa;
    
    h3 {
      margin-bottom: 8px;
      color: #595959;
    }
    
    .demo-description {
      margin-bottom: 16px;
      padding: 8px 12px;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
      border-radius: 4px;
      color: #389e0d;
      font-size: 13px;
      line-height: 1.4;
    }
  }
  
  .paste-upload-area {
    padding: 40px 20px;
    text-align: center;
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    background: #fafafa;
    cursor: pointer;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #1890ff;
    }
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .upload-stats {
    margin-top: 24px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    
    h4 {
      margin-bottom: 12px;
      color: #262626;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      
      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: white;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        
        .stat-label {
          font-size: 12px;
          color: #666;
        }
        
        .stat-value {
          font-size: 14px;
          font-weight: 500;
          color: #262626;
        }
      }
    }
  }
  
  .messages {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    z-index: 1000;
  }
}
</style>