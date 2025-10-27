import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import {
  ConfigProvider,
  Image,
  Select,
  TreeSelect,
  Tag,
  Button,
  Popover,
  Input,
  Tooltip
} from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'ant-design-vue/dist/reset.css'

// 全局设置
setup(app => {
  // 注册 Ant Design Vue 的组件
  app.component('AConfigProvider', ConfigProvider)
  app.component('AImage', Image)
  app.component('ASelect', Select)
  app.component('ATreeSelect', TreeSelect)
  app.component('ATag', Tag)
  app.component('AButton', Button)
  app.component('APopover', Popover)
  app.component('AInput', Input)
  app.component('ATooltip', Tooltip)

  // 注册所有图标组件
  for (const [name, component] of Object.entries(Icons)) {
    app.component(name, component)
  }
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      toc: true
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff'
        },
        {
          name: 'dark',
          value: '#1f1f1f'
        },
        {
          name: 'gray',
          value: '#f5f5f5'
        }
      ]
    }
  },
  decorators: [
    story => ({
      components: { story, AConfigProvider: ConfigProvider },
      template: `
        <AConfigProvider :locale="zhCN">
          <div style="padding: 20px;">
            <story />
          </div>
        </AConfigProvider>
      `,
      setup() {
        return { zhCN }
      }
    })
  ]
}

export default preview
