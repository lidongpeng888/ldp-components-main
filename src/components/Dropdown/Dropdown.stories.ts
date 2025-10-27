/**
 * Dropdown 组件 Storybook 文档
 */

import type { Meta, StoryObj } from '@storybook/vue3'
import { h, ref } from 'vue'
import { Button, Menu } from 'ant-design-vue'
import Dropdown from './Dropdown.vue'
import 'ant-design-vue/dist/reset.css'

// 居中容器样式
const centerContainerStyle = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: `
# Dropdown 下拉菜单组件

基于 Ant Design Vue Dropdown 封装的增强型下拉菜单组件，100% 兼容原生 API，并新增以下功能：

## ✨ 核心特性

- 🖱️ **多种触发方式**: 支持 hover、click、contextmenu（右键菜单）三种触发方式
- 📍 **灵活定位**: 支持 12 个方向的定位选项，可自动调整位置避免超出视口
- 🎯 **手动控制**: 支持通过API手动控制下拉菜单的显示和隐藏
- 📱 **移动端适配**: 自动适应移动端环境，优化触控体验
- 🎨 **完全兼容**: 100% 兼容 Ant Design Vue Dropdown 原生 API

## 🛠️ 技术实现

- **VueUse**: 使用 VueUse 实现事件监听和移动设备检测
- **TypeScript**: 完整的类型定义和类型安全
- **响应式设计**: 移动端自动适配
        `
      }
    }
  },
  argTypes: {
    trigger: {
      control: { type: 'select' },
      options: ['hover', 'click', 'contextmenu'],
      description: '触发下拉的行为',
      table: {
        type: { summary: 'string | string[]' },
        defaultValue: { summary: 'hover' }
      }
    },
    placement: {
      control: { type: 'select' },
      options: [
        'top', 'topLeft', 'topRight', 'topCenter',
        'bottom', 'bottomLeft', 'bottomRight', 'bottomCenter'
      ],
      description: '菜单弹出位置',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'bottomLeft' }
      }
    },
    arrow: {
      control: { type: 'boolean' },
      description: '是否显示箭头',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    autoAdjust: {
      control: { type: 'boolean' },
      description: '是否自动调整位置',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    withIcon: {
      control: { type: 'boolean' },
      description: '菜单项是否带图标',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      control: { type: 'boolean' },
      description: '菜单是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    manualControl: {
      control: { type: 'boolean' },
      description: '是否手动控制菜单显示',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    closeOnClick: {
      control: { type: 'boolean' },
      description: '点击菜单项后是否自动关闭',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// 基础示例
export const Basic: Story = {
  args: {
    trigger: 'hover',
    placement: 'bottomLeft',
    arrow: false,
    disabled: false
  },
  render: (args) => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    setup() {
      return { args }
    },
    template: `
      <div style="${centerContainerStyle}">
        <Dropdown v-bind="args">
          <Button>下拉菜单 ▼</Button>
          <template #overlay>
            <AMenu>
              <AMenuItem key="1">菜单项 1</AMenuItem>
              <AMenuItem key="2">菜单项 2</AMenuItem>
              <AMenuItem key="3">菜单项 3</AMenuItem>
            </AMenu>
          </template>
        </Dropdown>
      </div>
    `
  })
}

// 不同触发方式
export const TriggerTypes: Story = {
  render: () => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    template: `
      <div style="${centerContainerStyle}">
        <div style="display: flex; gap: 16px;">
          <Dropdown trigger="hover">
            <Button>悬停触发</Button>
            <template #overlay>
              <AMenu>
                <AMenuItem key="1">菜单项 1</AMenuItem>
                <AMenuItem key="2">菜单项 2</AMenuItem>
              </AMenu>
            </template>
          </Dropdown>

          <Dropdown trigger="click">
            <Button>点击触发</Button>
            <template #overlay>
              <AMenu>
                <AMenuItem key="1">菜单项 1</AMenuItem>
                <AMenuItem key="2">菜单项 2</AMenuItem>
              </AMenu>
            </template>
          </Dropdown>

          <Dropdown trigger="contextmenu">
            <Button>右键菜单</Button>
            <template #overlay>
              <AMenu>
                <AMenuItem key="1">菜单项 1</AMenuItem>
                <AMenuItem key="2">菜单项 2</AMenuItem>
              </AMenu>
            </template>
          </Dropdown>
        </div>
      </div>
    `
  })
}

// 不同位置
export const Placements: Story = {
  render: () => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    template: `
      <div style="${centerContainerStyle}">
        <div style="min-height: 300px; display: flex; justify-content: center; align-items: center; padding: 100px 0;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 300px;">
            <Dropdown placement="topLeft">
              <Button>上左</Button>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">菜单项</AMenuItem>
                  <AMenuItem key="2">菜单项</AMenuItem>
                </AMenu>
              </template>
            </Dropdown>

            <Dropdown placement="top">
              <Button>上中</Button>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">菜单项</AMenuItem>
                  <AMenuItem key="2">菜单项</AMenuItem>
                </AMenu>
              </template>
            </Dropdown>

            <Dropdown placement="topRight">
              <Button>上右</Button>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">菜单项</AMenuItem>
                  <AMenuItem key="2">菜单项</AMenuItem>
                </AMenu>
              </template>
            </Dropdown>

            <div></div>
            <div style="display: flex; justify-content: center; align-items: center; height: 80px;">
              <div style="font-size: 16px; color: #999;">触发点</div>
            </div>
            <div></div>

            <Dropdown placement="bottomLeft">
              <Button>下左</Button>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">菜单项</AMenuItem>
                  <AMenuItem key="2">菜单项</AMenuItem>
                </AMenu>
              </template>
            </Dropdown>

            <Dropdown placement="bottom">
              <Button>下中</Button>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">菜单项</AMenuItem>
                  <AMenuItem key="2">菜单项</AMenuItem>
                </AMenu>
              </template>
            </Dropdown>

            <Dropdown placement="bottomRight">
              <Button>下右</Button>
              <template #overlay>
                <AMenu>
                  <AMenuItem key="1">菜单项</AMenuItem>
                  <AMenuItem key="2">菜单项</AMenuItem>
                </AMenu>
              </template>
            </Dropdown>
          </div>
        </div>
      </div>
    `
  })
}

// 带箭头
export const WithArrow: Story = {
  render: () => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    template: `
      <div style="${centerContainerStyle}">
        <Dropdown :arrow="true">
          <Button>带箭头</Button>
          <template #overlay>
            <AMenu>
              <AMenuItem key="1">菜单项 1</AMenuItem>
              <AMenuItem key="2">菜单项 2</AMenuItem>
            </AMenu>
          </template>
        </Dropdown>
      </div>
    `
  })
}

// 手动控制
export const ManualControl: Story = {
  render: () => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    setup() {
      const dropdownRef = ref<any>(null)
      const visible = ref(false)
      
      const showDropdown = () => {
        if (dropdownRef.value) {
          dropdownRef.value.show()
          visible.value = true
        }
      }
      
      const hideDropdown = () => {
        if (dropdownRef.value) {
          dropdownRef.value.hide()
          visible.value = false
        }
      }
      
      const toggleDropdown = () => {
        if (visible.value) {
          hideDropdown()
        } else {
          showDropdown()
        }
      }
      
      return {
        dropdownRef,
        visible,
        showDropdown,
        hideDropdown,
        toggleDropdown
      }
    },
    template: `
      <div style="${centerContainerStyle}">
        <div style="display: flex; align-items: center; gap: 16px;">
          <Dropdown ref="dropdownRef" :manual-control="true" @visibleChange="visible = $event">
            <Button>手动控制 {{ visible ? '(已打开)' : '(已关闭)' }}</Button>
            <template #overlay>
              <AMenu>
                <AMenuItem key="1">菜单项 1</AMenuItem>
                <AMenuItem key="2">菜单项 2</AMenuItem>
              </AMenu>
            </template>
          </Dropdown>
          
          <div>
            <Button @click="showDropdown" style="margin-right: 8px;">显示</Button>
            <Button @click="hideDropdown" style="margin-right: 8px;">隐藏</Button>
            <Button @click="toggleDropdown">切换</Button>
          </div>
        </div>
      </div>
    `
  })
}

// 带图标菜单
export const WithIcon: Story = {
  render: () => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    template: `
      <div style="${centerContainerStyle}">
        <Dropdown :with-icon="true">
          <Button>带图标菜单</Button>
          <template #overlay>
            <AMenu>
              <AMenuItem key="1">
                <template #icon>👤</template>
                用户
              </AMenuItem>
              <AMenuItem key="2">
                <template #icon>⚙️</template>
                设置
              </AMenuItem>
              <AMenuItem key="3">
                <template #icon>🚪</template>
                退出
              </AMenuItem>
            </AMenu>
          </template>
        </Dropdown>
      </div>
    `
  })
}

// 禁用状态
export const Disabled: Story = {
  render: () => ({
    components: { Dropdown, Button, AMenu: Menu, AMenuItem: Menu.Item },
    template: `
      <div style="${centerContainerStyle}">
        <Dropdown :disabled="true">
          <Button>禁用状态</Button>
          <template #overlay>
            <AMenu>
              <AMenuItem key="1">菜单项 1</AMenuItem>
              <AMenuItem key="2">菜单项 2</AMenuItem>
            </AMenu>
          </template>
        </Dropdown>
      </div>
    `
  })
} 