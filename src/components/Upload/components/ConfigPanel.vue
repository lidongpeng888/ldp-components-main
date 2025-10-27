<template>
  <div class="config-panel">
    <div
      v-for="(categoryFields, categoryName) in schema"
      :key="categoryName"
      class="config-category"
    >
      <h5 class="category-title">{{ getCategoryTitle(categoryName) }}</h5>
      
      <div class="config-fields">
        <div
          v-for="(fieldSchema, fieldName) in categoryFields"
          :key="fieldName"
          class="config-field"
        >
          <label class="field-label">
            {{ fieldSchema.label }}
            <span v-if="fieldSchema.description" class="field-description">
              {{ fieldSchema.description }}
            </span>
          </label>
          
          <!-- 布尔值字段 -->
          <div v-if="fieldSchema.type === 'boolean'" class="field-control">
            <a-switch
              :checked="getFieldValue(categoryName, fieldName)"
              @change="(value) => updateField(categoryName, fieldName, value)"
            />
          </div>
          
          <!-- 数字字段 -->
          <div v-else-if="fieldSchema.type === 'number'" class="field-control">
            <a-input-number
              :value="getFieldValue(categoryName, fieldName)"
              :min="fieldSchema.min"
              :max="fieldSchema.max"
              :step="fieldSchema.step || 1"
              @change="(value) => updateField(categoryName, fieldName, value)"
            />
          </div>
          
          <!-- 范围字段 -->
          <div v-else-if="fieldSchema.type === 'range'" class="field-control">
            <a-slider
              :value="getFieldValue(categoryName, fieldName)"
              :min="fieldSchema.min || 0"
              :max="fieldSchema.max || 100"
              :step="fieldSchema.step || 1"
              @change="(value) => updateField(categoryName, fieldName, value)"
            />
            <span class="range-value">{{ getFieldValue(categoryName, fieldName) }}</span>
          </div>
          
          <!-- 字符串字段 -->
          <div v-else-if="fieldSchema.type === 'string'" class="field-control">
            <a-input
              :value="getFieldValue(categoryName, fieldName)"
              @change="(e) => updateField(categoryName, fieldName, e.target.value)"
            />
          </div>
          
          <!-- 选择字段 -->
          <div v-else-if="fieldSchema.type === 'select'" class="field-control">
            <a-select
              :value="getFieldValue(categoryName, fieldName)"
              @change="(value) => updateField(categoryName, fieldName, value)"
            >
              <a-select-option
                v-for="option in fieldSchema.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>
          
          <!-- 多选字段 -->
          <div v-else-if="fieldSchema.type === 'multiSelect'" class="field-control">
            <a-select
              :value="getFieldValue(categoryName, fieldName)"
              mode="multiple"
              @change="(value) => updateField(categoryName, fieldName, value)"
            >
              <a-select-option
                v-for="option in fieldSchema.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
          </div>
          
          <!-- 验证错误提示 -->
          <div v-if="getFieldError(categoryName, fieldName)" class="field-error">
            {{ getFieldError(categoryName, fieldName) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 配置操作 -->
    <div class="config-actions">
      <a-button size="small" @click="exportConfig">
        <ExportOutlined />
        导出配置
      </a-button>
      <a-button size="small" @click="importConfig">
        <ImportOutlined />
        导入配置
      </a-button>
      <a-button size="small" @click="resetToDefaults">
        <ReloadOutlined />
        恢复默认
      </a-button>
    </div>
    
    <!-- 导入配置模态框 -->
    <a-modal
      v-model:visible="importModalVisible"
      title="导入配置"
      @ok="handleImportConfirm"
      @cancel="handleImportCancel"
    >
      <div class="import-content">
        <a-textarea
          v-model:value="importText"
          placeholder="请粘贴配置JSON..."
          :rows="10"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  Switch as ASwitch,
  InputNumber as AInputNumber,
  Slider as ASlider,
  Input as AInput,
  Select as ASelect,
  SelectOption as ASelectOption,
  Button as AButton,
  Modal as AModal,
  Textarea as ATextarea,
  message
} from 'ant-design-vue'
import { ExportOutlined, ImportOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import type { 
  UploadPreviewConfig, 
  ConfigSchema, 
  ConfigFieldSchema 
} from '../types/demo'
import { useClipboard } from '@vueuse/core'

// 定义组件名称
defineOptions({
  name: 'ConfigPanel'
})

// Props 定义
interface ConfigPanelProps {
  config: UploadPreviewConfig
  schema?: ConfigSchema
}

const props = withDefaults(defineProps<ConfigPanelProps>(), {
  schema: () => ({})
})

// Emits 定义
interface ConfigPanelEmits {
  change: [config: Partial<UploadPreviewConfig>]
}

const emit = defineEmits<ConfigPanelEmits>()

// 状态管理
const localConfig = ref<UploadPreviewConfig>({ ...props.config })
const validationErrors = ref<Record<string, string>>({})
const importModalVisible = ref(false)
const importText = ref('')

// 剪贴板功能
const { copy, isSupported: clipboardSupported } = useClipboard()

// 计算属性
const schema = computed(() => props.schema || getDefaultSchema())

// 方法定义
const getFieldValue = (category: string, field: string): any => {
  const categoryConfig = (localConfig.value as any)[category]
  return categoryConfig ? categoryConfig[field] : undefined
}

const updateField = (category: string, field: string, value: any) => {
  // 验证字段值
  const fieldSchema = schema.value[category]?.[field]
  if (fieldSchema?.validation) {
    const validationResult = fieldSchema.validation(value)
    const errorKey = `${category}.${field}`
    
    if (typeof validationResult === 'string') {
      validationErrors.value[errorKey] = validationResult
      return
    } else if (validationResult === false) {
      validationErrors.value[errorKey] = '无效的值'
      return
    } else {
      delete validationErrors.value[errorKey]
    }
  }
  
  // 更新配置
  if (!localConfig.value[category as keyof UploadPreviewConfig]) {
    (localConfig.value as any)[category] = {}
  }
  
  ;(localConfig.value as any)[category][field] = value
  
  // 触发变更事件
  emit('change', { [category]: { [field]: value } })
}

const getFieldError = (category: string, field: string): string | undefined => {
  return validationErrors.value[`${category}.${field}`]
}

const getCategoryTitle = (categoryName: string): string => {
  const titleMap: Record<string, string> = {
    upload: '上传配置',
    preview: '预览配置',
    integration: '集成配置',
    performance: '性能配置',
    style: '样式配置'
  }
  return titleMap[categoryName] || categoryName
}

const exportConfig = async () => {
  const configJson = JSON.stringify(localConfig.value, null, 2)
  
  if (clipboardSupported) {
    try {
      await copy(configJson)
      message.success('配置已复制到剪贴板')
    } catch (error) {
      message.error('复制失败')
    }
  } else {
    // 降级方案：下载文件
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'upload-preview-config.json'
    a.click()
    URL.revokeObjectURL(url)
    message.success('配置文件已下载')
  }
}

const importConfig = () => {
  importModalVisible.value = true
  importText.value = ''
}

const handleImportConfirm = () => {
  try {
    const importedConfig = JSON.parse(importText.value)
    
    // 验证配置格式
    if (typeof importedConfig !== 'object' || importedConfig === null) {
      throw new Error('配置格式无效')
    }
    
    // 合并配置
    localConfig.value = { ...localConfig.value, ...importedConfig }
    emit('change', importedConfig)
    
    importModalVisible.value = false
    message.success('配置导入成功')
  } catch (error) {
    message.error(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const handleImportCancel = () => {
  importModalVisible.value = false
  importText.value = ''
}

const resetToDefaults = () => {
  const defaultConfig = getDefaultConfig()
  localConfig.value = { ...defaultConfig }
  emit('change', defaultConfig)
  validationErrors.value = {}
  message.success('已恢复默认配置')
}

const getDefaultSchema = (): ConfigSchema => {
  return {
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
        max: 1000,
        description: '单个文件的最大大小限制'
      },
      maxCount: { 
        type: 'number', 
        label: '最大文件数量', 
        min: 1, 
        max: 100,
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

const getDefaultConfig = (): UploadPreviewConfig => {
  return {
    upload: {
      multiple: true,
      dragUpload: true,
      maxSize: 10,
      maxCount: 10,
      concurrent: 3,
      autoUpload: true
    },
    preview: {
      enabled: true,
      mode: 'modal'
    },
    integration: {
      autoPreview: false,
      previewOnUpload: true,
      thumbnailInList: true
    }
  }
}

// 监听配置变化
watch(() => props.config, (newConfig) => {
  localConfig.value = { ...newConfig }
}, { deep: true })

// 暴露组件方法
defineExpose({
  getConfig: () => localConfig.value,
  resetConfig: resetToDefaults,
  validateConfig: () => Object.keys(validationErrors.value).length === 0,
  getValidationErrors: () => validationErrors.value
})
</script>

<style lang="scss" scoped>
.config-panel {
  .config-category {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .category-title {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #262626;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 8px;
    }

    .config-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .config-field {
        .field-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #595959;
          line-height: 1.4;

          .field-description {
            display: block;
            font-size: 12px;
            font-weight: 400;
            color: #8c8c8c;
            margin-top: 2px;
          }
        }

        .field-control {
          position: relative;

          :deep(.ant-input-number),
          :deep(.ant-input),
          :deep(.ant-select) {
            width: 100%;
          }

          .range-value {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #666;
            background: #fff;
            padding: 0 4px;
          }
        }

        .field-error {
          margin-top: 4px;
          font-size: 12px;
          color: #ff4d4f;
        }
      }
    }
  }

  .config-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .ant-btn {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .import-content {
    .ant-input {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
    }
  }
}

// 深度选择器样式调整
:deep(.ant-slider) {
  margin: 8px 0;
}

:deep(.ant-switch) {
  margin: 0;
}

:deep(.ant-input-number) {
  .ant-input-number-input {
    text-align: left;
  }
}
</style>