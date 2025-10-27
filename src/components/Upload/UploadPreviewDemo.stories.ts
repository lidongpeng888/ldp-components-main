import type { Meta, StoryObj } from '@storybook/vue3'
import UploadPreviewDemo from './UploadPreviewDemo.vue'
import BasicIntegrationDemo from './demos/BasicIntegrationDemo.vue'
import type { DemoScenario } from './types/demo'

const meta: Meta<typeof UploadPreviewDemo> = {
  title: 'Components/Upload/UploadPreviewDemo',
  component: UploadPreviewDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '文件上传和预览功能的完整集成演示组件，展示各种使用场景和配置选项。'
      }
    }
  },
  argTypes: {
    scenarios: {
      description: '演示场景配置数组',
      control: { type: 'object' }
    },
    defaultScenario: {
      description: '默认显示的场景ID',
      control: { type: 'text' }
    },
    showCode: {
      description: '是否显示代码示例',
      control: { type: 'boolean' }
    },
    showConfig: {
      description: '是否显示配置面板',
      control: { type: 'boolean' }
    },
    showEventLog: {
      description: '是否显示事件日志',
      control: { type: 'boolean' }
    }
  }
}

export default meta
type Story = StoryObj<typeof UploadPreviewDemo>

// 默认场景配置
const defaultScenarios: DemoScenario[] = [
  {
    id: 'basic',
    title: '基础上传预览',
    description: '展示文件上传后立即预览的基本功能，支持图片、视频、文档等多种文件类型。',
    features: ['文件上传', '立即预览', '多文件类型支持', '拖拽上传'],
    component: BasicIntegrationDemo,
    config: {
      upload: {
        multiple: true,
        dragUpload: true,
        maxSize: 10,
        allowedTypes: ['image/*', 'video/*', '.pdf', '.doc', '.docx'],
        maxCount: 10,
        concurrent: 3,
        autoUpload: true
      },
      preview: {
        enabled: true,
        mode: 'modal',
        imageConfig: {
          zoom: true,
          rotate: true,
          fullscreen: true,
          thumbnail: true
        },
        videoConfig: {
          controls: true,
          autoplay: false,
          poster: true
        },
        documentConfig: {
          navigation: true,
          download: true
        }
      },
      integration: {
        autoPreview: false,
        previewOnUpload: true,
        thumbnailInList: true,
        quickActions: true
      }
    },
    configSchema: {
      upload: {
        multiple: { 
          type: 'boolean', 
          label: '多文件上传',
          description: '允许同时选择多个文件'
        },
        dragUpload: { 
          type: 'boolean', 
          label: '拖拽上传',
          description: '支持拖拽文件到上传区域'
        },
        maxSize: { 
          type: 'number', 
          label: '最大文件大小(MB)', 
          min: 1, 
          max: 100,
          description: '单个文件的最大大小限制'
        },
        maxCount: { 
          type: 'number', 
          label: '最大文件数量', 
          min: 1, 
          max: 50,
          description: '允许上传的最大文件数量'
        },
        concurrent: { 
          type: 'number', 
          label: '并发上传数', 
          min: 1, 
          max: 10,
          description: '同时上传的文件数量'
        },
        autoUpload: { 
          type: 'boolean', 
          label: '自动上传',
          description: '选择文件后自动开始上传'
        }
      },
      preview: {
        enabled: { 
          type: 'boolean', 
          label: '启用预览',
          description: '是否启用文件预览功能'
        },
        mode: { 
          type: 'select', 
          label: '预览模式',
          description: '预览的显示方式',
          options: [
            { value: 'modal', label: '模态框' },
            { value: 'inline', label: '内联显示' },
            { value: 'thumbnail', label: '缩略图' }
          ]
        }
      },
      integration: {
        autoPreview: { 
          type: 'boolean', 
          label: '自动预览',
          description: '上传完成后自动打开预览'
        },
        previewOnUpload: { 
          type: 'boolean', 
          label: '上传时预览',
          description: '文件上传过程中显示预览'
        },
        thumbnailInList: { 
          type: 'boolean', 
          label: '列表缩略图',
          description: '在文件列表中显示缩略图'
        }
      }
    }
  }
]

// 基础演示
export const Default: Story = {
  args: {
    scenarios: defaultScenarios,
    defaultScenario: 'basic',
    showCode: false,
    showConfig: false,
    showEventLog: false
  }
}

// 显示代码示例
export const WithCodeExample: Story = {
  args: {
    scenarios: defaultScenarios,
    defaultScenario: 'basic',
    showCode: true,
    showConfig: false,
    showEventLog: false
  }
}

// 显示配置面板
export const WithConfigPanel: Story = {
  args: {
    scenarios: defaultScenarios,
    defaultScenario: 'basic',
    showCode: false,
    showConfig: true,
    showEventLog: false
  }
}

// 完整功能演示
export const FullFeatures: Story = {
  args: {
    scenarios: defaultScenarios,
    defaultScenario: 'basic',
    showCode: true,
    showConfig: true,
    showEventLog: true
  }
}

// 自定义场景
export const CustomScenarios: Story = {
  args: {
    scenarios: [
      {
        id: 'images-only',
        title: '仅图片上传',
        description: '只允许上传图片文件，并提供丰富的图片预览功能。',
        features: ['图片上传', '图片预览', '缩放旋转', '全屏查看'],
        component: BasicIntegrationDemo,
        config: {
          upload: {
            multiple: true,
            dragUpload: true,
            maxSize: 5,
            allowedTypes: ['image/*'],
            maxCount: 20
          },
          preview: {
            enabled: true,
            mode: 'modal',
            imageConfig: {
              zoom: true,
              rotate: true,
              fullscreen: true,
              thumbnail: true,
              thumbnailSize: 100
            }
          },
          integration: {
            autoPreview: true,
            thumbnailInList: true
          }
        }
      },
      {
        id: 'documents-only',
        title: '文档上传',
        description: '专门用于文档文件的上传和预览，支持PDF、Word等格式。',
        features: ['文档上传', 'PDF预览', '文档下载', '页面导航'],
        component: BasicIntegrationDemo,
        config: {
          upload: {
            multiple: false,
            dragUpload: true,
            maxSize: 50,
            allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
            maxCount: 5
          },
          preview: {
            enabled: true,
            mode: 'modal',
            documentConfig: {
              navigation: true,
              download: true,
              scale: 1.0
            }
          },
          integration: {
            autoPreview: false,
            previewOnUpload: true
          }
        }
      }
    ],
    defaultScenario: 'images-only',
    showCode: true,
    showConfig: true,
    showEventLog: false
  }
}