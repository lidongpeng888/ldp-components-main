# Vue Component Library

基于 Ant Design Vue 4.x 的企业级 Vue 3 组件库

## 特性

- 🚀 基于 Vue 3 + TypeScript + Vite
- 📦 支持 Tree Shaking，按需引入
- 🎨 基于 Ant Design Vue 4.x 设计系统
- 📖 完整的 TypeScript 类型定义
- 🔧 开箱即用的开发工具链
- 📚 Storybook 交互式文档
- ✅ 完整的单元测试覆盖

- 🎯 无障碍性支持

## 快速开始

### 安装

```bash
npm install vue-component-library
# 或
yarn add vue-component-library
# 或
pnpm add vue-component-library
```

### 使用

```typescript
import { createApp } from 'vue'
import ComponentLibrary from 'vue-component-library'
import 'vue-component-library/style'

const app = createApp(App)
app.use(ComponentLibrary)
app.mount('#app')
```

### 按需引入

```typescript
import { CustomModal, CustomTable } from 'vue-component-library'
import 'vue-component-library/es/custom-modal/style'
import 'vue-component-library/es/custom-table/style'
```

## 开发

### 环境要求

- Node.js >= 16
- npm >= 7 或 yarn >= 1.22 或 pnpm >= 6

### 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库文件
npm run build:lib

# 运行测试
npm run test

# 运行测试（监听模式）
npm run test:watch

# 生成测试覆盖率报告
npm run coverage

# 启动 Storybook
npm run storybook

# 构建 Storybook
npm run build-storybook

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

### 项目结构

```
vue-component-library/
├── src/                    # 源代码
│   ├── components/         # 组件
│   ├── hooks/             # 组合式函数
│   ├── utils/             # 工具函数
│   ├── styles/            # 样式文件
│   └── index.ts           # 入口文件
├── types/                 # 类型定义
├── .storybook/           # Storybook 配置
├── dist/                 # 构建输出
└── docs/                 # 文档
```

## 组件列表

当前组件库包含以下四个组件：

- [x] CustomDropdown - 下拉菜单组件，基于 `a-dropdown` 封装
- [x] CustomDatePicker - 日期选择器组件，基于 `a-date-picker` 封装
- [x] CustomSelector - 选择器组件，基于 `a-select` 和 `a-tree-select` 封装
- [x] CustomPopover - 气泡组件，基于 `a-popover` 封装

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

[MIT](./LICENSE)

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。
