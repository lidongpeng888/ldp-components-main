/**
 * Upload 组件 Storybook 文档
 */

import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Button } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import Upload from './Upload.vue'
import type { FileValidationRule } from './types'

// 简单的事件处理函数，用于替代 @storybook/addon-actions
const createAction = (name: string) => (...args: any[]) => {
  console.log(`[${name}]`, ...args)
}

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,
  parameters: {
    docs: {
      description: {
        component: `
# Upload 文件上传组件

基于 Ant Design Vue Upload 组件封装的增强文件上传组件，**完全基于原生功能实现，不使用 VueUse 库**。

## 核心特性

- ✅ **零 VueUse 依赖** - 完全基于 Ant Design Vue 和原生 Web API
- 🎯 **拖拽上传** - 基于 \`a-upload-dragger\` 组件实现
- 📋 **粘贴上传** - 基于原生 \`paste\` 事件监听实现
- 🔒 **文件验证** - 支持类型、大小、数量等多维度验证
- 📊 **并发控制** - 支持限制同时上传的文件数量
- 🔄 **重试机制** - 支持失败文件的自动/手动重试
- 📈 **进度追踪** - 实时显示上传进度、速度和统计信息
- 🎨 **文件预览** - 基于原生 Intersection Observer 实现懒加载预览
- 🎛️ **完全兼容** - 保留 \`a-upload\` 的所有原生 API 和功能

## 技术实现

- **拖拽上传**: 使用 \`a-upload-dragger\` 组件 + 原生拖拽事件
- **粘贴上传**: 原生 \`ClipboardEvent\` + \`paste\` 事件监听
- **文件预览**: 原生 \`Intersection Observer\` API 实现懒加载
- **并发控制**: 队列管理 + Promise 控制
- **重试机制**: 递增延迟重试策略

## 基础用法

\`\`\`vue
<template>
  <CustomUpload
    :validation="{ maxSize: 10, maxCount: 5 }"
    :concurrent="2"
    :retry-count="3"
    @change="handleChange"
  >
    <a-button>
      <UploadOutlined />
      选择文件
    </a-button>
  </CustomUpload>
</template>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    // 基础属性
    multiple: {
      control: { type: 'boolean' },
      description: '是否支持多选文件'
    },
    accept: {
      control: { type: 'text' },
      description: '接受上传的文件类型'
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用'
    },
    
    // 扩展属性
    dragUpload: {
      control: { type: 'boolean' },
      description: '是否启用拖拽上传'
    },
    pasteUpload: {
      control: { type: 'boolean' },
      description: '是否启用粘贴上传'
    },
    preview: {
      control: { type: 'boolean' },
      description: '是否启用文件预览'
    },
    concurrent: {
      control: { type: 'number', min: 1, max: 10 },
      description: '并发上传数量'
    },
    retryCount: {
      control: { type: 'number', min: 0, max: 10 },
      description: '失败重试次数'
    },
    autoUpload: {
      control: { type: 'boolean' },
      description: '是否自动上传'
    },
    
    // 验证配置
    validation: {
      control: { type: 'object' },
      description: '文件验证规则配置'
    },
    
    // 事件
    onChange: { 
      action: 'change',
      description: '文件状态改变时触发'
    },
    onProgress: { 
      action: 'progress',
      description: '上传进度变化时触发'
    },
    onSuccess: { 
      action: 'success',
      description: '上传成功时触发'
    },
    onError: { 
      action: 'error',
      description: '上传失败时触发'
    },
    onPreview: { 
      action: 'preview',
      description: '预览文件时触发'
    },
    onRemove: { 
      action: 'remove',
      description: '移除文件时触发'
    },
    onValidationError: { 
      action: 'validation-error',
      description: '文件验证失败时触发'
    },
    onPaste: { 
      action: 'paste',
      description: '粘贴文件时触发'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// 基础上传
export const Default: Story = {
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    maxSize: 10,
    maxCount: 5,
    onChange: createAction('change'),
    onSuccess: createAction('success'),
    onError: createAction('error'),
    onRemove: createAction('remove')
  },
  parameters: {
    docs: {
      description: {
        story: '基于 `a-upload` 组件的基础上传功能，支持文件验证、并发控制和重试机制。'
      }
    }
  },
  render: (args) => ({
    components: { Upload, 'a-button': Button, UploadOutlined },
    setup() {
      return { args }
    },
    template: `
      <Upload v-bind="args">
        <a-button>
          <UploadOutlined />
          选择文件
        </a-button>
      </Upload>
    `
  })
}

// 拖拽上传
export const DragUpload: Story = {
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    dragUpload: true,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxSize: 5,
    maxCount: 3,
    multiple: true,
    onChange: createAction('change'),
    onSuccess: createAction('success'),
    onError: createAction('error')
  },
  parameters: {
    docs: {
      description: {
        story: '基于 `a-upload-dragger` 组件实现的拖拽上传功能，支持拖拽状态视觉反馈。'
      }
    }
  }
}

// 多文件上传
export const MultipleUpload: Story = {
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    multiple: true,
    maxSize: 10,
    maxCount: 5,
    onChange: createAction('change'),
    onSuccess: createAction('success'),
    onError: createAction('error')
  },
  parameters: {
    docs: {
      description: {
        story: '支持多文件选择和上传功能。'
      }
    }
  },
  render: (args) => ({
    components: { Upload, 'a-button': Button, UploadOutlined },
    setup() {
      return { args }
    },
    template: `
      <div>
        <p style="margin-bottom: 16px; color: #666;">
          支持选择多个文件同时上传
        </p>
        <Upload v-bind="args">
          <a-button>
            <UploadOutlined />
            选择多个文件
          </a-button>
        </Upload>
      </div>
    `
  })
}

// 多种文件类型
export const MultipleTypes: Story = {
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    multiple: true,
    allowedTypes: [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      '.doc', '.docx'
    ],
    maxSize: 20,
    maxCount: 10,
    onChange: createAction('change'),
    onSuccess: createAction('success'),
    onError: createAction('error')
  },
  parameters: {
    docs: {
      description: {
        story: '支持多种文件类型上传，包含总文件大小限制和并发控制。'
      }
    }
  },
  render: (args) => ({
    components: { Upload, 'a-button': Button, UploadOutlined },
    setup() {
      return { args }
    },
    template: `
      <div>
        <p style="margin-bottom: 16px; color: #666;">
          支持图片、PDF、Word 文档，最大 20MB，总计不超过 100MB，并发上传3个文件
        </p>
        <Upload v-bind="args">
          <a-button>
            <UploadOutlined />
            上传多种文件
          </a-button>
        </Upload>
      </div>
    `
  })
}

// 文件类型限制
export const TypeRestriction: Story = {
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    allowedTypes: ['image/jpeg', 'image/png'],
    maxSize: 5,
    onChange: createAction('change'),
    onSuccess: createAction('success'),
    onError: createAction('error')
  },
  parameters: {
    docs: {
      description: {
        story: '限制只能上传特定类型的文件，这里只允许 JPEG 和 PNG 图片。'
      }
    }
  },
  render: (args) => ({
    components: { Upload, 'a-button': Button, UploadOutlined },
    setup() {
      return { args }
    },
    template: `
      <div>
        <p style="margin-bottom: 16px; color: #666;">
          只允许上传 JPEG 和 PNG 图片，最大 5MB
        </p>
        <Upload v-bind="args">
          <a-button>
            <UploadOutlined />
            选择图片
          </a-button>
        </Upload>
      </div>
    `
  })
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    maxSize: 10
  },
  render: (args) => ({
    components: { Upload, 'a-button': Button, UploadOutlined },
    setup() {
      return { args }
    },
    template: `
      <Upload v-bind="args">
        <a-button disabled>
          <UploadOutlined />
          禁用状态
        </a-button>
      </Upload>
    `
  })
}

// 自定义验证
export const CustomValidation: Story = {
  args: {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    maxSize: 5,
    beforeUpload: (file: File) => {
      // 自定义验证：文件名不能包含中文
      if (/[\u4e00-\u9fa5]/.test(file.name)) {
        console.error('文件名不能包含中文字符')
        return false
      }
      return true
    },
    onChange: createAction('change'),
    onSuccess: createAction('success'),
    onError: createAction('error')
  },
  parameters: {
    docs: {
      description: {
        story: '自定义验证规则演示，支持复杂的文件验证逻辑。'
      }
    }
  },
  render: (args) => ({
    components: { Upload, 'a-button': Button, UploadOutlined },
    setup() {
      return { args }
    },
    template: `
      <div>
        <p style="margin-bottom: 16px; color: #666;">
          自定义验证：文件名不能包含中文字符
        </p>
        <Upload v-bind="args">
          <a-button>
            <UploadOutlined />
            选择文件
          </a-button>
        </Upload>
      </div>
    `
  })
}