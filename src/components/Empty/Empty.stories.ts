/**
 * Empty 空状态组件 Storybook 文档
 */

import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Button, message } from 'ant-design-vue'
import { action } from '@storybook/addon-actions'
import Empty from './Empty.vue'
import type { ActionButton } from './types'
import 'ant-design-vue/dist/reset.css'

const meta: Meta<typeof Empty> = {
  title: 'Components/Empty',
  component: Empty,
  parameters: {
    docs: {
      description: {
        component: `
# Empty 空状态组件

基于 Ant Design Vue Empty 封装的增强型空状态组件，100% 兼容原生 API，并新增以下功能：

## ✨ 核心特性

- 🎯 **多场景适配**: 基于 a-empty 组件封装，支持无数据、网络错误、权限不足、搜索无结果等场景
- 🔧 **智能操作**: 支持重试按钮、反馈链接、自定义操作按钮
- 🎨 **灵活定制**: 支持自定义图标、标题、描述文本和操作区域
- 📱 **响应式设计**: 自适应不同屏幕尺寸和设备类型
- 🎭 **插槽支持**: 完整的插槽系统，支持自定义图像、描述和操作区域
- ✅ **完全兼容**: 100% 兼容 Ant Design Vue Empty 原生 API

## 🛠️ 技术实现

- **Ant Design Vue**: 基于 a-empty 组件封装
- **TypeScript**: 完整的类型定义和类型安全
- **Vue 3**: 使用 Composition API 和插槽系统
- **场景化设计**: 预设常见业务场景的空状态样式
        `
      }
    }
  },
  argTypes: {
    scenario: {
      control: { type: 'select' },
      options: ['default', 'no-data', 'network-error', 'permission-denied', 'search-no-result'],
      description: '空状态场景类型'
    },
    title: {
      control: { type: 'text' },
      description: '自定义标题'
    },
    description: {
      control: { type: 'text' },
      description: '自定义描述文本'
    },
    showRetry: {
      control: { type: 'boolean' },
      description: '是否显示重试按钮'
    },
    showFeedback: {
      control: { type: 'boolean' },
      description: '是否显示反馈链接'
    },
    // Actions
    onRetry: {
      action: 'retry',
      description: '重试按钮点击事件'
    },
    onFeedback: {
      action: 'feedback',
      description: '反馈链接点击事件'
    },
    onActionClick: {
      action: 'action-click',
      description: '自定义操作按钮点击事件'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    scenario: 'default',
    showRetry: false,
    showFeedback: false
  },
  render: (args: any) => ({
    components: { Empty },
    setup() {
      const handleRetry = action('default-retry-clicked')
      const handleFeedback = action('default-feedback-clicked')
      const handleActionClick = action('default-action-clicked')

      return {
        args: {
          ...args,
          onRetry: handleRetry,
          onFeedback: handleFeedback,
          onActionClick: handleActionClick
        }
      }
    },
    template: `
      <div style="padding: 40px; border: 1px solid #f0f0f0; border-radius: 8px;">
        <Empty 
          v-bind="args" 
          @retry="args.onRetry"
          @feedback="args.onFeedback"
          @action-click="args.onActionClick"
        />
      </div>
    `
  })
}

// 不同场景
export const Scenarios: Story = {
  render: () => ({
    components: { Empty, Button },
    setup() {
      const handleRetry = action('retry-clicked')
      const handleFeedback = action('feedback-clicked')

      return {
        handleRetry,
        handleFeedback
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">默认状态</h4>
          <Empty scenario="default" />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">无数据</h4>
          <Empty scenario="no-data" />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">网络错误</h4>
          <Empty 
            scenario="network-error" 
            :show-retry="true"
            @retry="handleRetry"
          />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">权限不足</h4>
          <Empty 
            scenario="permission-denied"
            :show-feedback="true"
            @feedback="handleFeedback"
          />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">搜索无结果</h4>
          <Empty scenario="search-no-result" />
        </div>
      </div>
    `
  })
}

// 自定义内容
export const CustomContent: Story = {
  render: () => ({
    components: { Empty, Button },
    setup() {
      const onRefreshPage = action('refresh-page-clicked')
      const onGoHome = action('go-home-clicked')

      const customActions = ref<ActionButton[]>([
        {
          text: '刷新页面',
          type: 'primary',
          onClick: onRefreshPage
        },
        {
          text: '返回首页',
          type: 'default',
          onClick: onGoHome
        }
      ])

      const handleActionClick = action('action-clicked')

      return {
        customActions,
        handleActionClick
      }
    },
    template: `
      <div style="padding: 40px; border: 1px solid #f0f0f0; border-radius: 8px;">
        <Empty
          title="自定义标题"
          description="这是自定义的描述文本，可以包含更详细的说明信息"
          :actions="customActions"
          @action-click="handleActionClick"
        />
      </div>
    `
  })
}

// 自定义插槽
export const CustomSlots: Story = {
  render: () => ({
    components: { Empty, Button },
    setup() {
      const handleSuccess = action('continue-operation-clicked')
      const handleViewDocs = action('view-docs-clicked')
      const handleStartUsing = action('start-using-clicked')

      return {
        handleSuccess,
        handleViewDocs,
        handleStartUsing
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <!-- 自定义图标 -->
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">自定义图标</h4>
          <Empty>
            <template #image>
              <div style="font-size: 64px; color: #1890ff;">
                🎉
              </div>
            </template>
            <template #description>
              <span style="color: #1890ff;">恭喜！操作成功完成</span>
            </template>
          </Empty>
        </div>
        
        <!-- 自定义操作 -->
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">自定义操作</h4>
          <Empty>
            <template #image>
              <div style="font-size: 48px; color: #52c41a;">
                ✅
              </div>
            </template>
            <template #description>
              <div>
                <p style="margin: 0; color: #52c41a; font-weight: 500;">任务完成</p>
                <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">所有任务已成功处理</p>
              </div>
            </template>
            <template #actions>
              <Button type="primary" @click="handleSuccess">
                继续操作
              </Button>
            </template>
          </Empty>
        </div>
        
        <!-- 复杂自定义 -->
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">复杂自定义</h4>
          <Empty>
            <template #image>
              <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">
                🚀
              </div>
            </template>
            <template #description>
              <div style="text-align: center;">
                <h3 style="margin: 16px 0 8px 0; color: #262626;">准备就绪</h3>
                <p style="margin: 0; color: #666;">系统已准备完毕，可以开始使用</p>
                <div style="margin-top: 12px; padding: 8px 12px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 4px; display: inline-block;">
                  <span style="color: #52c41a; font-size: 12px;">✓ 所有检查已通过</span>
                </div>
              </div>
            </template>
            <template #actions>
              <div style="display: flex; gap: 8px; justify-content: center;">
                <Button @click="handleViewDocs">查看文档</Button>
                <Button type="primary" @click="handleStartUsing">开始使用</Button>
              </div>
            </template>
          </Empty>
        </div>
      </div>
    `
  })
}

// 自定义标题和描述测试
export const CustomTitleAndDescription: Story = {
  render: () => ({
    components: { Empty },
    setup() {
      return {}
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">只自定义标题</h4>
          <Empty 
            title="这是自定义标题"
            scenario="no-data"
          />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">只自定义描述</h4>
          <Empty 
            description="这是自定义的描述文本"
            scenario="no-data"
          />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">同时自定义标题和描述</h4>
          <Empty 
            title="自定义标题"
            description="这是自定义的描述文本，应该与标题同时显示"
            scenario="no-data"
          />
        </div>
        
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">网络错误场景 + 自定义</h4>
          <Empty 
            title="网络连接失败"
            description="请检查网络设置后重试，如果问题持续存在请联系技术支持"
            scenario="network-error"
            :show-retry="true"
          />
        </div>
      </div>
    `
  })
}

// 交互式示例
export const Interactive: Story = {
  render: () => ({
    components: { Empty, Button },
    setup() {
      const scenario = ref('no-data')
      const showRetry = ref(false)
      const showFeedback = ref(false)
      const customTitle = ref('')
      const customDescription = ref('')

      const scenarios = [
        { value: 'default', label: '默认' },
        { value: 'no-data', label: '无数据' },
        { value: 'network-error', label: '网络错误' },
        { value: 'permission-denied', label: '权限不足' },
        { value: 'search-no-result', label: '搜索无结果' }
      ]

      const handleRetry = action('interactive-retry-clicked')
      const handleFeedback = action('interactive-feedback-clicked')

      return {
        scenario,
        scenarios,
        showRetry,
        showFeedback,
        customTitle,
        customDescription,
        handleRetry,
        handleFeedback
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 24px; padding: 16px; background: #fafafa; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">配置选项</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: end;">
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">场景类型:</label>
              <select v-model="scenario" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
                <option v-for="item in scenarios" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">自定义标题:</label>
              <input v-model="customTitle" placeholder="输入自定义标题" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">自定义描述:</label>
              <input v-model="customDescription" placeholder="输入自定义描述" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            <div>
              <label style="display: flex; align-items: center; font-size: 14px;">
                <input type="checkbox" v-model="showRetry" style="margin-right: 8px;" />
                显示重试按钮
              </label>
            </div>
            <div>
              <label style="display: flex; align-items: center; font-size: 14px;">
                <input type="checkbox" v-model="showFeedback" style="margin-right: 8px;" />
                显示反馈链接
              </label>
            </div>
          </div>
        </div>
        
        <div style="padding: 40px; border: 1px solid #f0f0f0; border-radius: 8px; min-height: 300px; display: flex; align-items: center; justify-content: center;">
          <Empty
            :scenario="scenario"
            :title="customTitle || undefined"
            :description="customDescription || undefined"
            :show-retry="showRetry"
            :show-feedback="showFeedback"
            @retry="handleRetry"
            @feedback="handleFeedback"
          />
        </div>
      </div>
    `
  })
}
