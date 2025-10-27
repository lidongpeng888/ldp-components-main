<template>
  <div class="upload-preview-demo">
    <!-- 演示场景导航 -->
    <div class="demo-navigation">
      <div class="demo-tabs">
        <button
          v-for="scenario in scenarios"
          :key="scenario.id"
          :class="['demo-tab', { active: currentScenario === scenario.id }]"
          @click="switchScenario(scenario.id)"
        >
          {{ scenario.title }}
        </button>
      </div>
      
      <!-- 控制面板切换 -->
      <div class="demo-controls">
        <button
          :class="['control-btn', { active: showCode }]"
          @click="toggleCode"
        >
          <CodeOutlined />
          代码示例
        </button>
        <button
          :class="['control-btn', { active: showConfig }]"
          @click="toggleConfig"
        >
          <SettingOutlined />
          配置面板
        </button>
      </div>
    </div>

    <!-- 演示内容区域 -->
    <div class="demo-content">
      <!-- 场景描述 -->
      <div class="scenario-description">
        <h3>{{ currentScenarioData?.title }}</h3>
        <p>{{ currentScenarioData?.description }}</p>
        <div v-if="currentScenarioData?.features" class="feature-list">
          <span
            v-for="feature in currentScenarioData.features"
            :key="feature"
            class="feature-tag"
          >
            {{ feature }}
          </span>
        </div>
      </div>

      <!-- 演示区域 -->
      <div class="demo-area">
        <div class="demo-main">
          <!-- 动态渲染当前场景组件 -->
          <component
            :is="currentScenarioData?.component"
            v-if="currentScenarioData"
            :config="currentConfig"
            @config-change="handleConfigChange"
            @event="handleScenarioEvent"
          />
        </div>

        <!-- 配置面板 -->
        <div v-if="showConfig" class="config-panel">
          <div class="config-header">
            <h4>配置选项</h4>
            <button class="reset-btn" @click="resetConfig">
              <ReloadOutlined />
              重置
            </button>
          </div>
          
          <div class="config-content">
            <ConfigPanel
              :config="currentConfig"
              :schema="currentScenarioData?.configSchema"
              @change="handleConfigChange"
            />
          </div>
        </div>
      </div>

      <!-- 代码示例 -->
      <div v-if="showCode" class="code-section">
        <div class="code-header">
          <h4>代码示例</h4>
          <button class="copy-btn" @click="copyCode">
            <CopyOutlined />
            复制代码
          </button>
        </div>
        
        <div class="code-content">
          <CodeHighlight
            :code="currentCode"
            language="vue"
            :show-line-numbers="true"
          />
        </div>
      </div>
    </div>

    <!-- 事件日志 -->
    <div v-if="showEventLog" class="event-log">
      <div class="log-header">
        <h4>事件日志</h4>
        <button class="clear-btn" @click="clearEventLog">
          <DeleteOutlined />
          清空
        </button>
      </div>
      
      <div class="log-content">
        <div
          v-for="(event, index) in eventLog"
          :key="index"
          class="log-item"
        >
          <span class="log-time">{{ formatTime(event.timestamp) }}</span>
          <span class="log-type">{{ event.type }}</span>
          <span class="log-data">{{ formatEventData(event.data) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  CodeOutlined, 
  SettingOutlined, 
  ReloadOutlined, 
  CopyOutlined, 
  DeleteOutlined 
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { 
  DemoScenario, 
  UploadPreviewConfig, 
  DemoEvent,
  ConfigSchema 
} from './types/demo'
import ConfigPanel from './components/ConfigPanel.vue'
import CodeHighlight from './components/CodeHighlight.vue'
import { useClipboard } from '@vueuse/core'

// 定义组件名称
defineOptions({
  name: 'UploadPreviewDemo'
})

// Props 定义
interface UploadPreviewDemoProps {
  // 演示场景配置
  scenarios?: DemoScenario[]
  // 默认显示的场景
  defaultScenario?: string
  // 是否显示代码示例
  showCode?: boolean
  // 是否显示配置面板
  showConfig?: boolean
  // 是否显示事件日志
  showEventLog?: boolean
}

const props = withDefaults(defineProps<UploadPreviewDemoProps>(), {
  scenarios: () => [],
  defaultScenario: '',
  showCode: false,
  showConfig: false,
  showEventLog: false
})

// Emits 定义
interface UploadPreviewDemoEmits {
  'scenario-change': [scenarioId: string]
  'config-change': [config: UploadPreviewConfig]
  'event': [event: DemoEvent]
}

const emit = defineEmits<UploadPreviewDemoEmits>()

// 状态管理
const currentScenario = ref<string>('')
const currentConfig = ref<UploadPreviewConfig>({})
const showCode = ref(props.showCode)
const showConfig = ref(props.showConfig)
const showEventLog = ref(props.showEventLog)
const eventLog = ref<DemoEvent[]>([])

// 默认场景配置
const defaultScenarios: DemoScenario[] = [
  {
    id: 'basic',
    title: '基础上传预览',
    description: '展示文件上传后立即预览的基本功能',
    features: ['文件上传', '立即预览', '多文件类型支持'],
    component: 'BasicIntegrationDemo',
    config: {
      upload: {
        multiple: true,
        dragUpload: true,
        maxSize: 10,
        allowedTypes: ['image/*', 'video/*', '.pdf']
      },
      preview: {
        enabled: true,
        mode: 'modal'
      },
      integration: {
        autoPreview: true,
        previewOnUpload: true
      }
    },
    configSchema: {
      upload: {
        multiple: { type: 'boolean', label: '多文件上传' },
        dragUpload: { type: 'boolean', label: '拖拽上传' },
        maxSize: { type: 'number', label: '最大文件大小(MB)', min: 1, max: 100 }
      },
      preview: {
        enabled: { type: 'boolean', label: '启用预览' },
        mode: { 
          type: 'select', 
          label: '预览模式', 
          options: [
            { value: 'modal', label: '模态框' },
            { value: 'inline', label: '内联' },
            { value: 'thumbnail', label: '缩略图' }
          ]
        }
      }
    }
  }
]

// 计算属性
const scenarios = computed(() => props.scenarios.length > 0 ? props.scenarios : defaultScenarios)

const currentScenarioData = computed(() => 
  scenarios.value.find(s => s.id === currentScenario.value)
)

const currentCode = computed(() => {
  if (!currentScenarioData.value) return ''
  
  // 根据当前配置生成代码示例
  return generateCodeExample(currentScenarioData.value, currentConfig.value)
})

// 剪贴板功能
const { copy, isSupported: clipboardSupported } = useClipboard()

// 方法定义
const switchScenario = (scenarioId: string) => {
  if (scenarioId === currentScenario.value) return
  
  currentScenario.value = scenarioId
  const scenario = scenarios.value.find(s => s.id === scenarioId)
  if (scenario) {
    currentConfig.value = { ...scenario.config }
    emit('scenario-change', scenarioId)
    
    // 记录场景切换事件
    logEvent({
      type: 'scenario-change',
      data: { scenarioId, title: scenario.title },
      timestamp: new Date()
    })
  }
}

const toggleCode = () => {
  showCode.value = !showCode.value
}

const toggleConfig = () => {
  showConfig.value = !showConfig.value
}

const handleConfigChange = (newConfig: Partial<UploadPreviewConfig>) => {
  currentConfig.value = { ...currentConfig.value, ...newConfig }
  emit('config-change', currentConfig.value)
  
  // 记录配置变更事件
  logEvent({
    type: 'config-change',
    data: newConfig,
    timestamp: new Date()
  })
}

const resetConfig = () => {
  const scenario = currentScenarioData.value
  if (scenario) {
    currentConfig.value = { ...scenario.config }
    message.success('配置已重置')
    
    logEvent({
      type: 'config-reset',
      data: { scenarioId: currentScenario.value },
      timestamp: new Date()
    })
  }
}

const copyCode = async () => {
  if (!clipboardSupported) {
    message.error('浏览器不支持剪贴板功能')
    return
  }
  
  try {
    await copy(currentCode.value)
    message.success('代码已复制到剪贴板')
    
    logEvent({
      type: 'code-copy',
      data: { scenarioId: currentScenario.value },
      timestamp: new Date()
    })
  } catch (error) {
    message.error('复制失败')
  }
}

const handleScenarioEvent = (event: DemoEvent) => {
  logEvent(event)
  emit('event', event)
}

const logEvent = (event: DemoEvent) => {
  eventLog.value.unshift(event)
  // 限制日志数量
  if (eventLog.value.length > 100) {
    eventLog.value = eventLog.value.slice(0, 100)
  }
}

const clearEventLog = () => {
  eventLog.value = []
  message.success('事件日志已清空')
}

const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString()
}

const formatEventData = (data: any): string => {
  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2)
  }
  return String(data)
}

const generateCodeExample = (scenario: DemoScenario, config: UploadPreviewConfig): string => {
  // 生成基于当前配置的代码示例
  const configStr = JSON.stringify(config, null, 2)
  
  return `<template>
  <div class="upload-preview-example">
    <Upload
      v-bind="uploadConfig"
      @change="handleUploadChange"
      @preview="handlePreview"
    />
    
    <PreviewModal
      v-if="previewConfig.enabled"
      :visible="previewVisible"
      :file="currentFile"
      v-bind="previewConfig"
      @close="handlePreviewClose"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, PreviewModal } from '@/components'

const previewVisible = ref(false)
const currentFile = ref(null)

const config = ${configStr}

const uploadConfig = computed(() => config.upload)
const previewConfig = computed(() => config.preview)

const handleUploadChange = (info) => {
  console.log('Upload change:', info)
  
  if (config.integration?.autoPreview && info.file.status === 'done') {
    handlePreview(info.file)
  }
}

const handlePreview = (file) => {
  currentFile.value = file
  previewVisible.value = true
}

const handlePreviewClose = () => {
  previewVisible.value = false
  currentFile.value = null
}
<\/script>`
}

// 生命周期
onMounted(() => {
  // 初始化当前场景
  const initialScenario = props.defaultScenario || scenarios.value[0]?.id
  if (initialScenario) {
    switchScenario(initialScenario)
  }
})

// 监听场景变化
watch(() => props.scenarios, (newScenarios) => {
  if (newScenarios.length > 0 && !currentScenario.value) {
    switchScenario(newScenarios[0].id)
  }
}, { immediate: true })

// 暴露组件方法
defineExpose({
  switchScenario,
  getCurrentScenario: () => currentScenario.value,
  getCurrentConfig: () => currentConfig.value,
  getEventLog: () => eventLog.value,
  clearEventLog,
  resetConfig
})
</script>

<style lang="scss" scoped>
.upload-preview-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .demo-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .demo-tabs {
      display: flex;
      gap: 8px;

      .demo-tab {
        padding: 8px 16px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: #fff;
        color: #666;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #1890ff;
          color: #1890ff;
        }

        &.active {
          border-color: #1890ff;
          background: #1890ff;
          color: #fff;
        }
      }
    }

    .demo-controls {
      display: flex;
      gap: 8px;

      .control-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: #fff;
        color: #666;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #1890ff;
          color: #1890ff;
        }

        &.active {
          border-color: #1890ff;
          background: #e6f7ff;
          color: #1890ff;
        }
      }
    }
  }

  .demo-content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .scenario-description {
      h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: #262626;
      }

      p {
        margin: 0 0 12px 0;
        color: #666;
        line-height: 1.6;
      }

      .feature-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .feature-tag {
          padding: 4px 8px;
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          border-radius: 4px;
          font-size: 12px;
          color: #52c41a;
        }
      }
    }

    .demo-area {
      display: flex;
      gap: 24px;

      .demo-main {
        flex: 1;
        min-height: 400px;
        padding: 24px;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        background: #fafafa;
      }

      .config-panel {
        width: 300px;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        background: #fff;

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;

          h4 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
          }

          .reset-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: #fff;
            color: #666;
            cursor: pointer;
            font-size: 12px;

            &:hover {
              border-color: #1890ff;
              color: #1890ff;
            }
          }
        }

        .config-content {
          padding: 16px;
        }
      }
    }

    .code-section {
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      background: #fff;

      .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;

        h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background: #fff;
          color: #666;
          cursor: pointer;
          font-size: 12px;

          &:hover {
            border-color: #1890ff;
            color: #1890ff;
          }
        }
      }

      .code-content {
        padding: 16px;
        background: #f8f8f8;
      }
    }
  }

  .event-log {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background: #fff;

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }

      .clear-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: #fff;
        color: #666;
        cursor: pointer;
        font-size: 12px;

        &:hover {
          border-color: #ff4d4f;
          color: #ff4d4f;
        }
      }
    }

    .log-content {
      max-height: 300px;
      overflow-y: auto;
      padding: 16px;

      .log-item {
        display: flex;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;
        font-size: 12px;

        &:last-child {
          border-bottom: none;
        }

        .log-time {
          color: #999;
          white-space: nowrap;
        }

        .log-type {
          color: #1890ff;
          font-weight: 500;
          white-space: nowrap;
        }

        .log-data {
          color: #666;
          word-break: break-all;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .upload-preview-demo {
    padding: 16px;

    .demo-navigation {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .demo-tabs {
        flex-wrap: wrap;
      }
    }

    .demo-content .demo-area {
      flex-direction: column;

      .config-panel {
        width: 100%;
      }
    }
  }
}
</style>