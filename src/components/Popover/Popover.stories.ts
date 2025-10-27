import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, h } from 'vue'

import Popover from './Popover.vue'
import DemoComponent from './demo.vue'
import RichTextTest from './RichTextTest.vue'
import { Button } from 'ant-design-vue'

// 组件元数据
const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  argTypes: {
    title: {
      control: 'text',
      description: '气泡卡片标题',
      table: {
        type: { summary: 'string | VNode | (() => VNode)' },
        defaultValue: { summary: 'undefined' }
      }
    },
    content: {
      control: 'text',
      description: '气泡卡片内容',
      table: {
        type: { summary: 'string | VNode | (() => VNode)' },
        defaultValue: { summary: 'undefined' }
      }
    },
    visible: {
      control: 'boolean',
      description: '气泡是否可见',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    placement: {
      control: { type: 'select', options: [
        'top', 'left', 'right', 'bottom', 
        'topLeft', 'topRight', 
        'bottomLeft', 'bottomRight', 
        'leftTop', 'leftBottom', 
        'rightTop', 'rightBottom'
      ]},
      description: '气泡位置',
      table: {
        type: { summary: 'PopoverPlacement' },
        defaultValue: { summary: 'top' }
      }
    },
    trigger: {
      control: { type: 'select', options: ['hover', 'focus', 'click', 'contextmenu'] },
      description: '触发方式',
      table: {
        type: { summary: 'PopoverTrigger | PopoverTrigger[]' },
        defaultValue: { summary: 'hover' }
      }
    },
    theme: {
      control: { type: 'select', options: ['light', 'dark'] },
      description: '气泡主题',
      table: {
        type: { summary: 'light | dark' },
        defaultValue: { summary: 'light' }
      }
    },
    rich: {
      control: 'boolean',
      description: '是否支持富文本内容',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    showArrow: {
      control: 'boolean',
      description: '是否显示箭头',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    maxWidth: {
      control: 'text',
      description: '内容最大宽度',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    autoAdjustOverflow: {
      control: 'boolean',
      description: '气泡被遮挡时自动调整位置',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    }
  },
  args: {
    title: '气泡标题',
    content: '这是气泡内容',
    placement: 'top',
    trigger: 'hover',
    theme: 'light',
    rich: false,
    showArrow: true,
    autoAdjustOverflow: true
  }
}

export default meta
type Story = StoryObj<typeof Popover>

// 基础示例
export const Basic: Story = {
  render: (args) => ({
    components: { Popover },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 50px; display: flex; justify-content: center;">
        <Popover v-bind="args">
          <a-button>悬停我</a-button>
        </Popover>
      </div>
    `
  })
}

// 不同触发方式
export const Triggers: Story = {
  args: {
    title: '触发方式示例',
    content: '可以通过Controls面板修改内容'
  },
  render: (args) => ({
    components: { Popover },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 50px; display: flex; gap: 20px; justify-content: center;">
        <Popover 
          :title="args.title" 
          :content="args.content" 
          trigger="hover"
        >
          <a-button>悬停触发</a-button>
        </Popover>
        
        <Popover 
          :title="args.title" 
          :content="args.content" 
          trigger="click"
        >
          <a-button>点击触发</a-button>
        </Popover>
        
        <Popover 
          :title="args.title" 
          :content="args.content" 
          trigger="focus"
        >
          <a-input placeholder="聚焦触发" style="width: 120px;" />
        </Popover>
      </div>
    `
  })
}

// 不同位置
export const Placements: Story = {
  args: {
    content: '位置示例',
    showArrow: true,
    theme: 'light'
  },
  render: (args) => ({
    components: { Popover },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 50px; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        <Popover :content="args.content" placement="top" :showArrow="args.showArrow" :theme="args.theme">
          <a-button>上方</a-button>
        </Popover>
        
        <Popover :content="args.content" placement="bottom" :showArrow="args.showArrow" :theme="args.theme">
          <a-button>下方</a-button>
        </Popover>
        
        <Popover :content="args.content" placement="left" :showArrow="args.showArrow" :theme="args.theme">
          <a-button>左侧</a-button>
        </Popover>
        
        <Popover :content="args.content" placement="right" :showArrow="args.showArrow" :theme="args.theme">
          <a-button>右侧</a-button>
        </Popover>
      </div>
    `
  })
}

// 富文本内容
export const RichContent: Story = {
  render: () => ({
    components: { Popover, AButton: Button },
    template: `
      <div style="padding: 50px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <Popover 
          title="富文本内容" 
          content="<p>这是一段<strong>富文本</strong>内容，支持 <a href='#'>链接</a>。</p><ul><li>列表项 1</li><li>列表项 2</li></ul>"
          :rich="true"
          trigger="click"
        >
          <AButton>点击查看富文本</AButton>
        </Popover>
      </div>
    `
  })
}

// 主题
export const Themes: Story = {
  args: {
    title: '主题示例',
    content: '可以通过Controls面板切换主题'
  },
  render: (args) => ({
    components: { Popover },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 50px; display: flex; gap: 20px; justify-content: center;">
        <Popover 
          :title="args.title" 
          :content="args.content" 
          theme="light"
        >
          <a-button>亮色主题</a-button>
        </Popover>
        
        <Popover 
          :title="args.title" 
          :content="args.content" 
          theme="dark"
        >
          <a-button>暗色主题</a-button>
        </Popover>
      </div>
    `
  })
}

// 简单富文本测试
export const SimpleRichText: Story = {
  render: () => ({
    components: { Popover, AButton: Button },
    setup() {
      const htmlContent = '<p>这是<strong>加粗</strong>文本和<a href="#">链接</a></p>'
      return { htmlContent }
    },
    template: `
      <div style="padding: 50px; display: flex; justify-content: center;">
        <Popover 
          title="富文本测试" 
          :content="htmlContent"
          :rich="true"
          trigger="click"
        >
          <AButton>点击查看富文本</AButton>
        </Popover>
      </div>
    `
  })
}

// 直接HTML内容
export const DirectHTML: Story = {
  render: () => ({
    components: { Popover, AButton: Button },
    template: `
      <div style="padding: 50px; display: flex; justify-content: center;">
        <Popover 
          title="HTML内容" 
          content="<div style='color: red; font-weight: bold;'>这是红色加粗文本</div><ul><li>列表项1</li><li>列表项2</li></ul>"
          :rich="true"
          trigger="click"
        >
          <AButton>点击查看HTML内容</AButton>
        </Popover>
      </div>
    `
  })
}

// 完整演示
export const FullDemo: Story = {
  render: () => ({
    components: { DemoComponent },
    template: '<DemoComponent />'
  })
} 