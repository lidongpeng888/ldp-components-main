/**
 * Loading 加载组件 Storybook 文档
 */

import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Button, Space, message } from 'ant-design-vue'
import { action } from '@storybook/addon-actions'
import Loading, { loading } from './index'
import 'ant-design-vue/dist/reset.css'

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    docs: {
      description: {
        component: `
# Loading 加载组件

基于 Ant Design Vue Spin 封装的增强型加载组件，100% 兼容原生 API，并新增以下功能：

## ✨ 核心特性

- 🎨 **多种样式**: 基于 a-spin 组件封装，支持转圈、点状、条状、波浪、脉冲、弹跳等多种样式
- 📏 **灵活尺寸**: 支持小、中、大三种尺寸配置
- ⏱️ **延迟显示**: 支持延迟显示功能，避免短时间加载的闪烁效果
- 🚫 **可取消加载**: 支持长时间操作的取消功能，提升用户体验
- 🌐 **全屏加载**: 支持全屏遮罩加载效果
- 🔧 **全局方法**: 提供便捷的全局调用方法
- 🎭 **自定义指示器**: 支持自定义加载指示器和文本
- ✅ **完全兼容**: 100% 兼容 Ant Design Vue Spin 原生 API

## 🛠️ 技术实现

- **Ant Design Vue**: 基于 a-spin 组件封装
- **TypeScript**: 完整的类型定义和类型安全
- **Vue 3**: 使用 Composition API 和响应式系统
- **全局管理**: 支持全局加载状态管理
        `
      }
    }
  },
  argTypes: {
    // 基础属性
    spinning: {
      control: { type: 'boolean' },
      description: '是否为加载中状态'
    },
    loadingStyle: {
      control: { type: 'select' },
      options: ['spin', 'dots', 'bars', 'wave', 'pulse', 'bounce'],
      description: '加载样式'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
      description: '加载尺寸'
    },
    position: {
      control: { type: 'select' },
      options: ['global', 'container', 'inline'],
      description: '加载位置类型'
    },

    // 文本相关
    text: {
      control: { type: 'text' },
      description: '加载文本'
    },
    showText: {
      control: { type: 'boolean' },
      description: '是否显示文本'
    },
    tip: {
      control: { type: 'text' },
      description: 'Ant Design Spin 原生文本属性'
    },

    // 时间相关
    delay: {
      control: { type: 'number', min: 0, max: 5000, step: 100 },
      description: '延迟显示时间(ms)'
    },
    minDuration: {
      control: { type: 'number', min: 0, max: 3000, step: 100 },
      description: '最小显示时间(ms)'
    },
    maxDuration: {
      control: { type: 'number', min: 1000, max: 60000, step: 1000 },
      description: '最大显示时间(ms)'
    },

    // 全屏相关
    fullscreen: {
      control: { type: 'boolean' },
      description: '是否全屏遮罩'
    },
    maskColor: {
      control: { type: 'color' },
      description: '遮罩背景色'
    },
    maskOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: '遮罩透明度'
    },

    // 取消相关
    cancelable: {
      control: { type: 'boolean' },
      description: '是否可取消'
    },
    cancelText: {
      control: { type: 'text' },
      description: '取消按钮文本'
    },

    // 样式相关
    className: {
      control: { type: 'text' },
      description: '自定义类名'
    },
    wrapperClassName: {
      control: { type: 'text' },
      description: 'Ant Design Spin 包装器类名'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// 基础用法
export const Default: Story = {
  args: {
    spinning: true,
    text: '加载中...',
    loadingStyle: 'spin',
    size: 'default',
    position: 'container',
    showText: true,
    delay: 0,
    cancelable: false,
    cancelText: '取消',
    minDuration: 300,
    maxDuration: 30000,
    fullscreen: false,
    maskColor: 'rgba(255, 255, 255, 0.8)',
    maskOpacity: 0.8
  },
  render: (args: any) => ({
    components: { Loading, Button },
    setup() {
      const spinning = ref(args.spinning)

      const toggle = () => {
        spinning.value = !spinning.value
      }

      return {
        args,
        spinning,
        toggle
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <Button @click="toggle" type="primary">
            {{ spinning ? '停止加载' : '开始加载' }}
          </Button>
        </div>
        <Loading 
          :spinning="spinning" 
          :loading-style="args.loadingStyle"
          :size="args.size"
          :position="args.position"
          :text="args.text"
          :show-text="args.showText"
          :delay="args.delay"
          :cancelable="args.cancelable"
          :cancel-text="args.cancelText"
          :min-duration="args.minDuration"
          :max-duration="args.maxDuration"
          :fullscreen="args.fullscreen"
          :mask-color="args.maskColor"
          :mask-opacity="args.maskOpacity"
        >
          <div style="padding: 40px; background: #fafafa; border-radius: 8px; text-align: center;">
            <h3>被包装的内容</h3>
            <p>当加载状态为 true 时会显示加载指示器</p>
            <p>这里是一些示例内容，用于展示加载效果</p>
          </div>
        </Loading>
      </div>
    `
  })
}

// 不同样式
export const Styles: Story = {
  render: () => ({
    components: { Loading },
    setup() {
      const styles = ['spin', 'dots', 'bars', 'wave', 'pulse', 'bounce']

      return {
        styles
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
        <div v-for="style in styles" :key="style" style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px; text-transform: capitalize;">{{ style }} 样式</h4>
          <Loading 
            :spinning="true" 
            :loading-style="style"
            :text="style + ' 加载中...'"
          >
            <div style="height: 120px; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
              {{ style }} 样式的加载效果
            </div>
          </Loading>
        </div>
      </div>
    `
  })
}

// 不同尺寸
export const Sizes: Story = {
  render: () => ({
    components: { Loading },
    setup() {
      const sizes = ['small', 'default', 'large']

      return {
        sizes
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
        <div v-for="size in sizes" :key="size" style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px; text-transform: capitalize;">{{ size }} 尺寸</h4>
          <Loading 
            :spinning="true" 
            :size="size"
            :text="size + ' 尺寸'"
          >
            <div style="height: 100px; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
              {{ size }} 尺寸的加载效果
            </div>
          </Loading>
        </div>
      </div>
    `
  })
}

// 延迟显示
export const DelayedLoading: Story = {
  render: () => ({
    components: { Loading, Button },
    setup() {
      const delayLoading = ref(false)

      const toggleDelayLoading = () => {
        action('toggle-delay-loading')()
        delayLoading.value = !delayLoading.value
        if (delayLoading.value) {
          setTimeout(() => {
            delayLoading.value = false
          }, 3000)
        }
      }

      const handleShow = () => {
        action('delayed-loading-show')()
      }

      const handleHide = () => {
        action('delayed-loading-hide')()
      }

      return {
        delayLoading,
        toggleDelayLoading,
        handleShow,
        handleHide
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <Button @click="toggleDelayLoading" type="primary">
            {{ delayLoading ? '停止加载' : '开始延迟加载' }}
          </Button>
        </div>
        <Loading 
          :spinning="delayLoading" 
          :delay="500"
          text="延迟 500ms 显示..."
          @show="handleShow"
          @hide="handleHide"
        >
          <div style="padding: 40px; background: #fafafa; border-radius: 8px; text-align: center;">
            <h3>延迟显示演示</h3>
            <p>延迟 500ms 后显示加载指示器</p>
            <p>避免短时间加载的闪烁效果</p>
            <p>适用于可能很快完成的操作</p>
          </div>
        </Loading>
      </div>
    `
  })
}

// 可取消加载
export const CancelableLoading: Story = {
  render: () => ({
    components: { Loading, Button },
    setup() {
      const cancelableLoading = ref(false)

      const startCancelableLoading = () => {
        action('start-cancellable-loading')()
        cancelableLoading.value = true
        // 10秒后自动停止
        setTimeout(() => {
          if (cancelableLoading.value) {
            cancelableLoading.value = false
            action('loading-completed')()
          }
        }, 10000)
      }

      const handleCancel = () => {
        action('cancel-loading')()
        cancelableLoading.value = false
      }

      const handleShow = () => {
        action('cancelable-loading-show')()
      }

      const handleHide = () => {
        action('cancelable-loading-hide')()
      }

      const handleTimeout = () => {
        action('cancelable-loading-timeout')()
      }

      return {
        cancelableLoading,
        startCancelableLoading,
        handleCancel,
        handleShow,
        handleHide,
        handleTimeout
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <Button @click="startCancelableLoading" type="primary" :disabled="cancelableLoading">
            开始可取消加载
          </Button>
        </div>
        <Loading 
          :spinning="cancelableLoading" 
          :cancelable="true"
          cancel-text="取消操作"
          text="处理中，可以取消..."
          @cancel="handleCancel"
          @show="handleShow"
          @hide="handleHide"
          @timeout="handleTimeout"
        >
          <div style="padding: 40px; background: #fafafa; border-radius: 8px; text-align: center;">
            <h3>可取消加载演示</h3>
            <p>长时间操作，支持用户取消</p>
            <p>点击取消按钮可以中断操作</p>
            <p>10秒后自动完成</p>
          </div>
        </Loading>
      </div>
    `
  })
}

// 全屏加载
export const FullscreenLoading: Story = {
  render: () => ({
    components: { Button, Space },
    setup() {
      const showFullscreenLoading = () => {
        action('show-fullscreen-loading')()
        loading.show({
          text: '全屏加载中...',
          loadingStyle: 'pulse'
        })

        setTimeout(() => {
          action('hide-fullscreen-loading')()
          loading.hide()
          message.success('加载完成')
        }, 3000)
      }

      const showCancelableFullscreen = () => {
        action('show-cancelable-fullscreen')()
        loading.show({
          text: '处理中，可以取消...',
          cancelable: true,
          loadingStyle: 'wave'
        })
      }

      const showTimedLoading = () => {
        action('show-timed-loading')()
        loading.show({
          text: '3秒后自动关闭...',
          loadingStyle: 'bounce'
        })

        setTimeout(() => {
          action('hide-timed-loading')()
          loading.hide()
          message.success('加载完成')
        }, 3000)
      }

      const handleGlobalCancel = () => {
        action('global-loading-cancel')()
        loading.hide()
        message.info('全局加载已取消')
      }

      return {
        showFullscreenLoading,
        showCancelableFullscreen,
        showTimedLoading,
        handleGlobalCancel
      }
    },
    template: `
      <div>
        <h3>全屏加载演示</h3>
        <Space wrap>
          <Button @click="showFullscreenLoading" type="primary">显示全屏加载</Button>
          <Button @click="showCancelableFullscreen">可取消全屏加载</Button>
          <Button @click="showTimedLoading">定时加载(3秒)</Button>
          <Button @click="handleGlobalCancel" danger>取消全局加载</Button>
        </Space>
        <div style="margin-top: 16px; padding: 16px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 6px;">
          <p style="margin: 0; color: #52c41a; font-size: 14px;">
            💡 点击按钮体验全屏加载效果，支持不同样式和可取消功能
          </p>
        </div>
      </div>
    `
  })
}

// 全局方法
export const GlobalMethods: Story = {
  render: () => ({
    components: { Button, Space },
    setup() {
      const showGlobalLoading = () => {
        action('show-global-loading')()
        loading.show({
          text: '全局加载中...'
        })
      }

      const hideGlobalLoading = () => {
        action('hide-global-loading')()
        loading.hide()
      }

      const showWithConfig = () => {
        action('show-config-loading')()
        loading.show({
          text: '自定义配置加载...',
          loadingStyle: 'dots',
          size: 'large',
          delay: 300
        })
      }

      const setGlobalConfig = () => {
        action('set-global-config')()
        loading.config({
          defaultDelay: 500,
          defaultMinDuration: 1000,
          defaultMaxDuration: 15000,
          defaultLoadingStyle: 'pulse',
          defaultSize: 'large',
          defaultText: '自定义配置加载中...'
        })
        message.success('全局配置已更新')
      }

      const resetGlobalConfig = () => {
        action('reset-global-config')()
        loading.config({
          defaultDelay: 0,
          defaultMinDuration: 300,
          defaultMaxDuration: 30000,
          defaultLoadingStyle: 'spin',
          defaultSize: 'default',
          defaultText: '加载中...'
        })
        message.success('全局配置已重置')
      }

      return {
        showGlobalLoading,
        hideGlobalLoading,
        showWithConfig,
        setGlobalConfig,
        resetGlobalConfig
      }
    },
    template: `
      <div>
        <h3>全局方法调用</h3>
        <Space wrap>
          <Button @click="showGlobalLoading" type="primary">显示全局加载</Button>
          <Button @click="hideGlobalLoading" danger>隐藏全局加载</Button>
          <Button @click="showWithConfig">自定义配置加载</Button>
          <Button @click="setGlobalConfig">设置全局配置</Button>
          <Button @click="resetGlobalConfig">重置全局配置</Button>
        </Space>
        <div style="margin-top: 16px; padding: 16px; background: #fff7e6; border: 1px solid #ffd591; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #d46b08;">使用方法:</h4>
          <pre style="margin: 0; font-size: 12px; color: #8c8c8c;"><code>// 显示加载
loading.show({ text: '加载中...', loadingStyle: 'spin' })

// 隐藏加载
loading.hide()</code></pre>
        </div>
      </div>
    `
  })
}

// 自定义指示器
export const CustomIndicator: Story = {
  render: () => ({
    components: { Loading },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <!-- 自定义图标 -->
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">自定义图标</h4>
          <Loading :spinning="true">
            <template #indicator>
              <div style="font-size: 24px; animation: spin 1s linear infinite;">
                🔄
              </div>
            </template>
            <template #tip>
              <span style="color: #1890ff;">自定义加载文本</span>
            </template>
            <div style="height: 100px; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
              使用自定义指示器
            </div>
          </Loading>
        </div>
        
        <!-- 自定义动画 -->
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">自定义动画</h4>
          <Loading :spinning="true">
            <template #indicator>
              <div style="display: flex; gap: 4px;">
                <div v-for="i in 3" :key="i" 
                     style="width: 8px; height: 8px; background: #1890ff; border-radius: 50%; animation: bounce 1.4s ease-in-out infinite both;"
                     :style="{ animationDelay: (i - 1) * 0.16 + 's' }">
                </div>
              </div>
            </template>
            <template #tip>
              <span style="color: #722ed1;">自定义动画效果</span>
            </template>
            <div style="height: 100px; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
              使用自定义动画
            </div>
          </Loading>
        </div>
        
        <!-- 复杂自定义 -->
        <div style="padding: 24px; border: 1px solid #f0f0f0; border-radius: 8px;">
          <h4 style="text-align: center; margin-bottom: 16px;">复杂自定义</h4>
          <Loading :spinning="true">
            <template #indicator>
              <div style="text-align: center;">
                <div style="width: 40px; height: 40px; margin: 0 auto 8px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); border-radius: 50%; animation: pulse 2s ease-in-out infinite;">
                </div>
                <div style="font-size: 12px; color: #666;">处理中...</div>
              </div>
            </template>
            <div style="height: 100px; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
              复杂自定义指示器
            </div>
          </Loading>
        </div>
      </div>
      
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      </style>
    `
  })
}

// 交互式示例
export const Interactive: Story = {
  render: () => ({
    components: { Loading, Button, Space },
    setup() {
      const spinning = ref(false)
      const loadingStyle = ref('spin')
      const size = ref('default')
      const position = ref('container')
      const text = ref('加载中...')
      const showText = ref(true)
      const delay = ref(0)
      const minDuration = ref(300)
      const maxDuration = ref(30000)
      const cancelable = ref(false)
      const cancelText = ref('取消')
      const fullscreen = ref(false)
      const maskColor = ref('rgba(255, 255, 255, 0.8)')
      const maskOpacity = ref(0.8)

      const styles = ['spin', 'dots', 'bars', 'wave', 'pulse', 'bounce']
      const sizes = ['small', 'default', 'large']
      const positions = ['global', 'container', 'inline']

      const toggle = () => {
        action('toggle-loading')(spinning.value ? 'stop' : 'start')
        spinning.value = !spinning.value
      }

      const handleCancel = () => {
        action('interactive-cancel-loading')()
        spinning.value = false
      }

      const handleShow = () => {
        action('interactive-loading-show')()
      }

      const handleHide = () => {
        action('interactive-loading-hide')()
      }

      const handleTimeout = () => {
        action('interactive-loading-timeout')()
      }

      const handleStyleChange = (newStyle: string) => {
        action('style-change')(newStyle)
        loadingStyle.value = newStyle
      }

      const handleSizeChange = (newSize: string) => {
        action('size-change')(newSize)
        size.value = newSize
      }

      const handlePositionChange = (newPosition: string) => {
        action('position-change')(newPosition)
        position.value = newPosition
      }

      const handleTextChange = (newText: string) => {
        action('text-change')(newText)
        text.value = newText
      }

      return {
        spinning,
        loadingStyle,
        size,
        position,
        text,
        showText,
        delay,
        minDuration,
        maxDuration,
        cancelable,
        cancelText,
        fullscreen,
        maskColor,
        maskOpacity,
        loadingStyles: styles,
        sizes,
        positions,
        toggle,
        handleCancel,
        handleShow,
        handleHide,
        handleTimeout,
        handleStyleChange,
        handleSizeChange,
        handlePositionChange,
        handleTextChange
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 24px; padding: 16px; background: #fafafa; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">配置选项</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: end;">
            <!-- 基础配置 -->
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">样式:</label>
              <select v-model="loadingStyle" @change="handleStyleChange($event.target.value)" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
                <option v-for="s in loadingStyles" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">尺寸:</label>
              <select v-model="size" @change="handleSizeChange($event.target.value)" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
                <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">位置:</label>
              <select v-model="position" @change="handlePositionChange($event.target.value)" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
                <option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            
            <!-- 文本配置 -->
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">文本:</label>
              <input v-model="text" @input="handleTextChange($event.target.value)" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            <div>
              <label style="display: flex; align-items: center; font-size: 14px;">
                <input type="checkbox" v-model="showText" style="margin-right: 8px;" />
                显示文本
              </label>
            </div>
            
            <!-- 时间配置 -->
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">延迟(ms):</label>
              <input v-model.number="delay" type="number" min="0" max="2000" step="100" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">最小显示(ms):</label>
              <input v-model.number="minDuration" type="number" min="0" max="3000" step="100" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            
            <!-- 取消配置 -->
            <div>
              <label style="display: flex; align-items: center; font-size: 14px;">
                <input type="checkbox" v-model="cancelable" style="margin-right: 8px;" />
                可取消
              </label>
            </div>
            <div v-if="cancelable">
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">取消文本:</label>
              <input v-model="cancelText" style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            
            <!-- 全屏配置 -->
            <div>
              <label style="display: flex; align-items: center; font-size: 14px;">
                <input type="checkbox" v-model="fullscreen" style="margin-right: 8px;" />
                全屏模式
              </label>
            </div>
            <div v-if="fullscreen">
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">遮罩颜色:</label>
              <input v-model="maskColor" type="color" style="width: 100%; padding: 4px; border: 1px solid #d9d9d9; border-radius: 4px;" />
            </div>
            <div v-if="fullscreen">
              <label style="display: block; margin-bottom: 4px; font-size: 14px;">透明度: {{ maskOpacity }}</label>
              <input v-model.number="maskOpacity" type="range" min="0" max="1" step="0.1" style="width: 100%;" />
            </div>
            
            <!-- 控制按钮 -->
            <div>
              <Button @click="toggle" type="primary">
                {{ spinning ? '停止' : '开始' }}
              </Button>
            </div>
          </div>
        </div>
        
        <Loading 
          :spinning="spinning"
          :loading-style="loadingStyle"
          :size="size"
          :position="position"
          :text="text"
          :show-text="showText"
          :delay="delay"
          :min-duration="minDuration"
          :max-duration="maxDuration"
          :cancelable="cancelable"
          :cancel-text="cancelText"
          :fullscreen="fullscreen"
          :mask-color="maskColor"
          :mask-opacity="maskOpacity"
          @cancel="handleCancel"
          @show="handleShow"
          @hide="handleHide"
          @timeout="handleTimeout"
        >
          <div style="padding: 40px; background: #fafafa; border-radius: 8px; text-align: center; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
            <h3>交互式加载演示</h3>
            <p>调整上方配置选项来体验不同的加载效果</p>
            <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 4px; font-size: 14px; color: #666;">
              <div>样式: <strong>{{ loadingStyle }}</strong> | 尺寸: <strong>{{ size }}</strong> | 位置: <strong>{{ position }}</strong></div>
              <div v-if="delay > 0">延迟: <strong>{{ delay }}ms</strong></div>
              <div v-if="minDuration > 0">最小显示: <strong>{{ minDuration }}ms</strong></div>
              <div>{{ cancelable ? '可取消' : '不可取消' }} | {{ fullscreen ? '全屏模式' : '容器模式' }}</div>
            </div>
          </div>
        </Loading>
      </div>
    `
  })
}

// Actions 事件演示
export const ActionsDemo: Story = {
  render: () => ({
    components: { Loading, Button, Space, message },
    setup() {
      const spinning = ref(false)
      const loadingStyle = ref('spin')
      const size = ref('default')
      const text = ref('加载中...')
      const cancelable = ref(true)
      const delay = ref(500)
      const minDuration = ref(1000)
      const maxDuration = ref(5000)

      const startLoading = () => {
        action('start-loading-demo')()
        spinning.value = true
      }

      const stopLoading = () => {
        action('stop-loading-demo')()
        spinning.value = false
      }

      const handleShow = () => {
        action('loading-show-event')()
        message.info('Loading 显示事件触发')
      }

      const handleHide = () => {
        action('loading-hide-event')()
        message.success('Loading 隐藏事件触发')
      }

      const handleCancel = () => {
        action('loading-cancel-event')()
        spinning.value = false
        message.warning('Loading 取消事件触发')
      }

      const handleTimeout = () => {
        action('loading-timeout-event')()
        spinning.value = false
        message.error('Loading 超时事件触发')
      }

      const changeStyle = (style: string) => {
        action('change-loading-style')(style)
        loadingStyle.value = style
      }

      const changeSize = (newSize: string) => {
        action('change-loading-size')(newSize)
        size.value = newSize
      }

      const changeText = (newText: string) => {
        action('change-loading-text')(newText)
        text.value = newText
      }

      return {
        spinning,
        loadingStyle,
        size,
        text,
        cancelable,
        delay,
        minDuration,
        maxDuration,
        startLoading,
        stopLoading,
        handleShow,
        handleHide,
        handleCancel,
        handleTimeout,
        changeStyle,
        changeSize,
        changeText
      }
    },
    template: `
      <div>
        <h3>🎯 Actions 事件演示</h3>
        <p style="color: #666; margin-bottom: 16px;">
          这个示例专门用于演示 Loading 组件的各种事件 Actions。
          在 Storybook 的 Actions 面板中可以查看所有触发的事件。
        </p>

        <!-- 控制面板 -->
        <div style="margin-bottom: 24px; padding: 16px; background: #f0f8ff; border: 1px solid #bae7ff; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">🎮 控制面板</h4>
          <Space wrap>
            <Button @click="startLoading" type="primary" :disabled="spinning">
              开始加载
            </Button>
            <Button @click="stopLoading" danger :disabled="!spinning">
              停止加载
            </Button>
          </Space>
        </div>

        <!-- 配置面板 -->
        <div style="margin-bottom: 24px; padding: 16px; background: #fff7e6; border: 1px solid #ffd591; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">⚙️ 配置面板</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">样式:</label>
              <Space>
                <Button size="small" @click="changeStyle('spin')" :type="loadingStyle === 'spin' ? 'primary' : 'default'">旋转</Button>
                <Button size="small" @click="changeStyle('dots')" :type="loadingStyle === 'dots' ? 'primary' : 'default'">点状</Button>
                <Button size="small" @click="changeStyle('bars')" :type="loadingStyle === 'bars' ? 'primary' : 'default'">条状</Button>
                <Button size="small" @click="changeStyle('wave')" :type="loadingStyle === 'wave' ? 'primary' : 'default'">波浪</Button>
                <Button size="small" @click="changeStyle('pulse')" :type="loadingStyle === 'pulse' ? 'primary' : 'default'">脉冲</Button>
                <Button size="small" @click="changeStyle('bounce')" :type="loadingStyle === 'bounce' ? 'primary' : 'default'">弹跳</Button>
              </Space>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">尺寸:</label>
              <Space>
                <Button size="small" @click="changeSize('small')" :type="size === 'small' ? 'primary' : 'default'">小</Button>
                <Button size="small" @click="changeSize('default')" :type="size === 'default' ? 'primary' : 'default'">中</Button>
                <Button size="small" @click="changeSize('large')" :type="size === 'large' ? 'primary' : 'default'">大</Button>
              </Space>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: bold;">文本:</label>
              <Space>
                <Button size="small" @click="changeText('加载中...')" :type="text === '加载中...' ? 'primary' : 'default'">默认</Button>
                <Button size="small" @click="changeText('处理中...')" :type="text === '处理中...' ? 'primary' : 'default'">处理中</Button>
                <Button size="small" @click="changeText('请稍候...')" :type="text === '请稍候...' ? 'primary' : 'default'">请稍候</Button>
                <Button size="small" @click="changeText('正在保存...')" :type="text === '正在保存...' ? 'primary' : 'default'">保存中</Button>
              </Space>
            </div>
          </div>
        </div>

        <!-- Loading 组件 -->
        <Loading 
          :spinning="spinning"
          :loading-style="loadingStyle"
          :size="size"
          :text="text"
          :delay="delay"
          :min-duration="minDuration"
          :max-duration="maxDuration"
          :cancelable="cancelable"
          cancel-text="取消操作"
          @show="handleShow"
          @hide="handleHide"
          @cancel="handleCancel"
          @timeout="handleTimeout"
        >
          <div style="padding: 40px; background: #fafafa; border-radius: 8px; text-align: center; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
            <h3>📊 Actions 演示区域</h3>
            <p>当前配置：</p>
            <div style="margin: 16px 0; padding: 12px; background: white; border-radius: 4px; font-size: 14px; color: #666;">
              <div>样式: <strong>{{ loadingStyle }}</strong></div>
              <div>尺寸: <strong>{{ size }}</strong></div>
              <div>文本: <strong>{{ text }}</strong></div>
              <div>延迟: <strong>{{ delay }}ms</strong></div>
              <div>最小显示: <strong>{{ minDuration }}ms</strong></div>
              <div>最大显示: <strong>{{ maxDuration }}ms</strong></div>
              <div>可取消: <strong>{{ cancelable ? '是' : '否' }}</strong></div>
            </div>
            <p style="color: #999; font-size: 12px;">
              💡 提示：点击"开始加载"后，可以通过"取消操作"按钮或等待超时来触发不同的事件
            </p>
          </div>
        </Loading>

        <!-- 事件说明 -->
        <div style="margin-top: 24px; padding: 16px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #52c41a;">📋 事件说明</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; font-size: 14px;">
            <div>
              <strong>基础事件:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>@show: 加载显示时触发</li>
                <li>@hide: 加载隐藏时触发</li>
                <li>@cancel: 用户取消时触发</li>
                <li>@timeout: 超时时触发</li>
              </ul>
            </div>
            <div>
              <strong>配置变更事件:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>change-loading-style: 样式变更</li>
                <li>change-loading-size: 尺寸变更</li>
                <li>change-loading-text: 文本变更</li>
              </ul>
            </div>
            <div>
              <strong>控制事件:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>start-loading-demo: 开始加载</li>
                <li>stop-loading-demo: 停止加载</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  })
}

// 高级功能演示
export const AdvancedFeatures: Story = {
  render: () => ({
    components: { Loading, Button, Space },
    setup() {
      const containerLoading = ref(false)
      const inlineLoading = ref(false)
      const customMaskLoading = ref(false)
      const timedLoading = ref(false)
      const positionLoading = ref(false)

      const showContainerLoading = () => {
        action('show-container-loading')()
        containerLoading.value = true
        setTimeout(() => {
          action('hide-container-loading')()
          containerLoading.value = false
        }, 3000)
      }

      const showInlineLoading = () => {
        action('show-inline-loading')()
        inlineLoading.value = true
        setTimeout(() => {
          action('hide-inline-loading')()
          inlineLoading.value = false
        }, 2000)
      }

      const showCustomMaskLoading = () => {
        action('show-custom-mask-loading')()
        customMaskLoading.value = true
        setTimeout(() => {
          action('hide-custom-mask-loading')()
          customMaskLoading.value = false
        }, 3000)
      }

      const showTimedLoading = () => {
        action('show-timed-loading')()
        timedLoading.value = true
        // 这个会在组件内部通过 minDuration 和 maxDuration 控制
      }

      const showPositionLoading = () => {
        action('show-position-loading')()
        positionLoading.value = true
        setTimeout(() => {
          action('hide-position-loading')()
          positionLoading.value = false
        }, 3000)
      }

      const handleTimedCancel = () => {
        action('timed-loading-cancel')()
        timedLoading.value = false
        message.info('定时加载已取消')
      }

      const handleContainerShow = () => {
        action('container-loading-show')()
      }

      const handleContainerHide = () => {
        action('container-loading-hide')()
      }

      const handleInlineShow = () => {
        action('inline-loading-show')()
      }

      const handleInlineHide = () => {
        action('inline-loading-hide')()
      }

      const handleCustomMaskShow = () => {
        action('custom-mask-loading-show')()
      }

      const handleCustomMaskHide = () => {
        action('custom-mask-loading-hide')()
      }

      const handleTimedShow = () => {
        action('timed-loading-show')()
      }

      const handleTimedHide = () => {
        action('timed-loading-hide')()
      }

      const handleTimedTimeout = () => {
        action('timed-loading-timeout')()
      }

      const handlePositionShow = () => {
        action('position-loading-show')()
      }

      const handlePositionHide = () => {
        action('position-loading-hide')()
      }

      return {
        containerLoading,
        inlineLoading,
        customMaskLoading,
        timedLoading,
        positionLoading,
        showContainerLoading,
        showInlineLoading,
        showCustomMaskLoading,
        showTimedLoading,
        showPositionLoading,
        handleTimedCancel,
        handleContainerShow,
        handleContainerHide,
        handleInlineShow,
        handleInlineHide,
        handleCustomMaskShow,
        handleCustomMaskHide,
        handleTimedShow,
        handleTimedHide,
        handleTimedTimeout,
        handlePositionShow,
        handlePositionHide
      }
    },
    template: `
      <div>
        <h3>高级功能演示</h3>
        
        <!-- 控制面板 -->
        <div style="margin-bottom: 24px; padding: 16px; background: #f0f8ff; border: 1px solid #bae7ff; border-radius: 8px;">
          <h4 style="margin: 0 0 16px 0;">控制面板</h4>
          <Space wrap>
            <Button @click="showContainerLoading" :disabled="containerLoading">
              容器内加载 (3秒)
            </Button>
            <Button @click="showInlineLoading" :disabled="inlineLoading">
              行内加载 (2秒)
            </Button>
            <Button @click="showCustomMaskLoading" :disabled="customMaskLoading">
              自定义遮罩 (3秒)
            </Button>
            <Button @click="showTimedLoading" :disabled="timedLoading">
              定时控制加载
            </Button>
            <Button @click="showPositionLoading" :disabled="positionLoading">
              全局位置 (3秒)
            </Button>
          </Space>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          
          <!-- 容器内加载 -->
          <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h4 style="margin: 0 0 16px 0;">🎯 容器内加载</h4>
            <Loading 
              :spinning="containerLoading"
              text="容器内加载中..."
              loading-style="spin"
              size="default"
              position="container"
              :delay="200"
              :show-text="true"
              @show="handleContainerShow"
              @hide="handleContainerHide"
            >
              <div style="height: 120px; background: #fafafa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666;">
                <div style="text-align: center;">
                  <div>📊 数据内容区域</div>
                  <div style="font-size: 12px; margin-top: 8px;">position="container"</div>
                </div>
              </div>
            </Loading>
          </div>

          <!-- 行内加载 -->
          <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h4 style="margin: 0 0 16px 0;">📍 行内加载</h4>
            <div style="padding: 20px; background: #fafafa; border-radius: 4px;">
              <p>这是一段文本内容，其中包含
                <Loading 
                  :spinning="inlineLoading"
                  position="inline"
                  loading-style="dots"
                  size="small"
                  :show-text="false"
                  @show="handleInlineShow"
                  @hide="handleInlineHide"
                >
                  行内加载效果
                </Loading>
                的演示。</p>
              <div style="font-size: 12px; color: #999; margin-top: 8px;">position="inline"</div>
            </div>
          </div>

          <!-- 自定义遮罩 -->
          <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h4 style="margin: 0 0 16px 0;">🎨 自定义遮罩</h4>
            <Loading 
              :spinning="customMaskLoading"
              text="自定义遮罩颜色..."
              loading-style="pulse"
              size="large"
              mask-color="rgba(255, 87, 34, 0.1)"
              :mask-opacity="0.9"
              :delay="0"
              @show="handleCustomMaskShow"
              @hide="handleCustomMaskHide"
            >
              <div style="height: 120px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                <div style="text-align: center;">
                  <div>🌈 彩色背景</div>
                  <div style="font-size: 12px; margin-top: 8px;">maskColor="rgba(255,87,34,0.1)"</div>
                </div>
              </div>
            </Loading>
          </div>

          <!-- 定时控制 -->
          <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h4 style="margin: 0 0 16px 0;">⏱️ 定时控制</h4>
            <Loading 
              :spinning="timedLoading"
              text="最多显示10秒，最少2秒..."
              loading-style="wave"
              size="default"
              :min-duration="2000"
              :max-duration="10000"
              :cancelable="true"
              cancel-text="提前结束"
              @cancel="handleTimedCancel"
              @show="handleTimedShow"
              @hide="handleTimedHide"
              @timeout="handleTimedTimeout"
            >
              <div style="height: 120px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #52c41a;">
                <div style="text-align: center;">
                  <div>⏰ 时间控制演示</div>
                  <div style="font-size: 12px; margin-top: 8px;">minDuration={2000} maxDuration={10000}</div>
                </div>
              </div>
            </Loading>
          </div>

          <!-- 全局位置 -->
          <div style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
            <h4 style="margin: 0 0 16px 0;">🌍 全局位置</h4>
            <Loading 
              :spinning="positionLoading"
              text="全局遮罩效果..."
              loading-style="bounce"
              size="large"
              position="global"
              mask-color="rgba(0, 0, 0, 0.6)"
              :mask-opacity="0.8"
              @show="handlePositionShow"
              @hide="handlePositionHide"
            >
              <div style="height: 120px; background: #fff2e6; border: 1px solid #ffd591; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #d46b08;">
                <div style="text-align: center;">
                  <div>🌐 全局遮罩</div>
                  <div style="font-size: 12px; margin-top: 8px;">position="global"</div>
                </div>
              </div>
            </Loading>
          </div>

          <!-- 功能说明 -->
          <div style="padding: 20px; border: 1px solid #e6f7ff; background: #f6ffed; border-radius: 8px; grid-column: 1 / -1;">
            <h4 style="margin: 0 0 12px 0; color: #52c41a;">💡 功能说明</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; font-size: 14px; color: #666;">
              <div>
                <strong>position 属性:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>container: 容器内遮罩（默认）</li>
                  <li>inline: 行内显示，不遮罩</li>
                  <li>global: 全局遮罩，固定定位</li>
                </ul>
              </div>
              <div>
                <strong>时间控制:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>delay: 延迟显示时间</li>
                  <li>minDuration: 最小显示时间</li>
                  <li>maxDuration: 最大显示时间</li>
                </ul>
              </div>
              <div>
                <strong>遮罩定制:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>maskColor: 遮罩背景色</li>
                  <li>maskOpacity: 遮罩透明度</li>
                  <li>showText: 控制文本显示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })
}

/*
🎯 Loading 组件 Actions 完善总结

已添加的 Actions 事件：

1. 基础事件 Actions：
   - toggle-delay-loading: 延迟加载切换
   - delayed-loading-show: 延迟加载显示
   - delayed-loading-hide: 延迟加载隐藏
   - start-cancellable-loading: 开始可取消加载
   - cancel-loading: 取消加载
   - loading-completed: 加载完成
   - cancelable-loading-show: 可取消加载显示
   - cancelable-loading-hide: 可取消加载隐藏
   - cancelable-loading-timeout: 可取消加载超时

2. 全局方法 Actions：
   - show-fullscreen-loading: 显示全屏加载
   - hide-fullscreen-loading: 隐藏全屏加载
   - show-cancelable-fullscreen: 显示可取消全屏加载
   - show-timed-loading: 显示定时加载
   - hide-timed-loading: 隐藏定时加载
   - global-loading-cancel: 全局加载取消
   - show-global-loading: 显示全局加载
   - hide-global-loading: 隐藏全局加载
   - show-config-loading: 显示配置加载
   - set-global-config: 设置全局配置
   - reset-global-config: 重置全局配置

3. 交互式 Actions：
   - toggle-loading: 切换加载状态
   - interactive-cancel-loading: 交互式取消加载
   - interactive-loading-show: 交互式加载显示
   - interactive-loading-hide: 交互式加载隐藏
   - interactive-loading-timeout: 交互式加载超时
   - style-change: 样式变更
   - size-change: 尺寸变更
   - position-change: 位置变更
   - text-change: 文本变更

4. 高级功能 Actions：
   - show-container-loading: 显示容器加载
   - hide-container-loading: 隐藏容器加载
   - container-loading-show: 容器加载显示事件
   - container-loading-hide: 容器加载隐藏事件
   - show-inline-loading: 显示行内加载
   - hide-inline-loading: 隐藏行内加载
   - inline-loading-show: 行内加载显示事件
   - inline-loading-hide: 行内加载隐藏事件
   - show-custom-mask-loading: 显示自定义遮罩加载
   - hide-custom-mask-loading: 隐藏自定义遮罩加载
   - custom-mask-loading-show: 自定义遮罩加载显示事件
   - custom-mask-loading-hide: 自定义遮罩加载隐藏事件
   - show-timed-loading: 显示定时加载
   - timed-loading-cancel: 定时加载取消
   - timed-loading-show: 定时加载显示事件
   - timed-loading-hide: 定时加载隐藏事件
   - timed-loading-timeout: 定时加载超时事件
   - show-position-loading: 显示位置加载
   - hide-position-loading: 隐藏位置加载
   - position-loading-show: 位置加载显示事件
   - position-loading-hide: 位置加载隐藏事件

5. Actions 演示专用 Actions：
   - start-loading-demo: 开始加载演示
   - stop-loading-demo: 停止加载演示
   - loading-show-event: 加载显示事件
   - loading-hide-event: 加载隐藏事件
   - loading-cancel-event: 加载取消事件
   - loading-timeout-event: 加载超时事件
   - change-loading-style: 变更加载样式
   - change-loading-size: 变更加载尺寸
   - change-loading-text: 变更加载文本

这些 Actions 涵盖了 Loading 组件的所有主要功能和事件，
可以在 Storybook 的 Actions 面板中查看所有触发的事件，
帮助开发者了解组件的使用方式和事件流程。
*/
