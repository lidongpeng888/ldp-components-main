// 开发环境入口文件
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 导入组件库
import ComponentLibrary from './index'

// 创建开发应用
const app = createApp({
  template: `
    <div style="padding: 20px;">
      <h1>Vue Component Library Development</h1>
      <p>组件库开发环境</p>
      <p>版本: {{ version }}</p>
      <p>开发模式: {{ isDev ? '是' : '否' }}</p>
    </div>
  `,
  data() {
    return {
      version: __VUE_COMPONENT_LIBRARY_VERSION__,
      isDev: __VUE_COMPONENT_LIBRARY_DEV__
    }
  }
})

// 安装插件
app.use(Antd)
app.use(ComponentLibrary)

// 挂载应用
app.mount('#app')