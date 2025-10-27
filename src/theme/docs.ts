/**
 * 主题文档生成器
 * 自动生成主题配置文档和使用指南
 */

import type { ThemeConfig, PresetTheme } from './types'
import { presetThemes, defaultTheme, darkTheme } from './config'

/**
 * 文档生成器类
 */
export class ThemeDocsGenerator {
  /**
   * 生成主题配置文档
   */
  static generateThemeConfigDocs(): string {
    const docs = [
      '# 主题配置文档',
      '',
      '## 概述',
      '',
      '本组件库基于 Ant Design Vue 主题系统，提供完整的主题定制能力。',
      '支持亮色/暗色主题切换，以及自定义主题配置。',
      '',
      '## 基础用法',
      '',
      '```typescript',
      'import { ThemeProvider } from "vue-component-library/theme"',
      '',
      '// 基础使用',
      '<ThemeProvider>',
      '  <App />',
      '</ThemeProvider>',
      '',
      '// 自定义主题',
      '<ThemeProvider :theme="customTheme" mode="dark">',
      '  <App />',
      '</ThemeProvider>',
      '```',
      '',
      '## 主题配置接口',
      '',
      this.generateThemeConfigInterface(),
      '',
      '## 预设主题',
      '',
      this.generatePresetThemesDocs(),
      '',
      '## 自定义令牌',
      '',
      this.generateCustomTokensDocs(),
      '',
      '## 组件主题配置',
      '',
      this.generateComponentThemesDocs(),
      '',
      '## 主题定制工具',
      '',
      this.generateCustomizerDocs(),
      '',
      '## 最佳实践',
      '',
      this.generateBestPractices()
    ]

    return docs.join('\n')
  }

  /**
   * 生成使用指南
   */
  static generateUsageGuide(): string {
    const guide = [
      '# 主题系统使用指南',
      '',
      '## 快速开始',
      '',
      '### 1. 安装和导入',
      '',
      '```typescript',
      'import { ThemeProvider, useTheme } from "vue-component-library/theme"',
      '```',
      '',
      '### 2. 基础配置',
      '',
      '```vue',
      '<template>',
      '  <ThemeProvider :theme="theme" :mode="mode">',
      '    <YourApp />',
      '  </ThemeProvider>',
      '</template>',
      '',
      '<script setup>',
      'import { ref } from "vue"',
      'import { ThemeProvider } from "vue-component-library/theme"',
      '',
      'const theme = ref({})',
      'const mode = ref("light")',
      '</script>',
      '```',
      '',
      '### 3. 使用主题Hook',
      '',
      '```typescript',
      'import { useTheme, useThemeMode, useThemeToken } from "vue-component-library/theme"',
      '',
      'export default defineComponent({',
      '  setup() {',
      '    const { theme, setTheme } = useTheme()',
      '    const { mode, setMode, isDark } = useThemeMode()',
      '    const token = useThemeToken()',
      '    ',
      '    return {',
      '      theme,',
      '      setTheme,',
      '      mode,',
      '      setMode,',
      '      isDark,',
      '      token',
      '    }',
      '  }',
      '})',
      '```',
      '',
      '## 高级用法',
      '',
      '### 主题定制器',
      '',
      '```typescript',
      'import { createThemeCustomizer } from "vue-component-library/theme"',
      '',
      'const customizer = createThemeCustomizer({',
      '  enablePreview: true,',
      '  initialTheme: {',
      '    token: {',
      '      colorPrimary: "#1890ff"',
      '    }',
      '  }',
      '})',
      '',
      '// 更新主色调',
      'customizer.updatePrimaryColor("#52c41a")',
      '',
      '// 导出主题',
      'const themeJson = customizer.exportTheme()',
      '',
      '// 导入主题',
      'customizer.importTheme(themeJson)',
      '```',
      '',
      '### 动态主题切换',
      '',
      '```vue',
      '<template>',
      '  <div>',
      '    <a-switch',
      '      v-model:checked="isDark"',
      '      @change="toggleTheme"',
      '    >',
      '      {{ isDark ? "暗色" : "亮色" }}',
      '    </a-switch>',
      '  </div>',
      '</template>',
      '',
      '<script setup>',
      'import { useThemeMode } from "vue-component-library/theme"',
      '',
      'const { mode, setMode, isDark } = useThemeMode()',
      '',
      'const toggleTheme = () => {',
      '  setMode(isDark.value ? "light" : "dark")',
      '}',
      '</script>',
      '```',
      '',
      '## 常见问题',
      '',
      '### Q: 如何自定义组件主题？',
      '',
      'A: 通过 `components` 配置项自定义组件主题：',
      '',
      '```typescript',
      'const customTheme = {',
      '  components: {',
      '    CustomModal: {',
      '      dragHandleColor: "#1890ff",',
      '      resizeHandleColor: "#52c41a"',
      '    }',
      '  }',
      '}',
      '```',
      '',
      '### Q: 如何实现主题持久化？',
      '',
      'A: 结合本地存储实现主题持久化：',
      '',
      '```typescript',
      'import { watch } from "vue"',
      'import { useTheme } from "vue-component-library/theme"',
      '',
      'const { theme, setTheme } = useTheme()',
      '',
      '// 从本地存储加载主题',
      'const savedTheme = localStorage.getItem("theme")',
      'if (savedTheme) {',
      '  setTheme(JSON.parse(savedTheme))',
      '}',
      '',
      '// 监听主题变化并保存',
      'watch(theme, (newTheme) => {',
      '  localStorage.setItem("theme", JSON.stringify(newTheme))',
      '}, { deep: true })',
      '```'
    ]

    return guide.join('\n')
  }

  /**
   * 生成迁移指南
   */
  static generateMigrationGuide(): string {
    const migration = [
      '# 主题系统迁移指南',
      '',
      '## 从 Ant Design Vue 3.x 迁移',
      '',
      '### 主要变化',
      '',
      '1. **Design Token 系统**',
      '   - 使用新的 Design Token 系统',
      '   - 支持更细粒度的主题定制',
      '',
      '2. **主题配置结构**',
      '   - 新增 `components` 配置项',
      '   - 扩展的 `token` 配置',
      '',
      '### 迁移步骤',
      '',
      '#### 1. 更新主题配置',
      '',
      '**旧版本：**',
      '```javascript',
      'const theme = {',
      '  primaryColor: "#1890ff",',
      '  linkColor: "#1890ff"',
      '}',
      '```',
      '',
      '**新版本：**',
      '```typescript',
      'const theme: ThemeConfig = {',
      '  token: {',
      '    colorPrimary: "#1890ff",',
      '    colorLink: "#1890ff"',
      '  }',
      '}',
      '```',
      '',
      '#### 2. 更新组件使用',
      '',
      '**旧版本：**',
      '```vue',
      '<a-config-provider :theme="theme">',
      '  <App />',
      '</a-config-provider>',
      '```',
      '',
      '**新版本：**',
      '```vue',
      '<ThemeProvider :theme="theme">',
      '  <App />',
      '</ThemeProvider>',
      '```',
      '',
      '#### 3. 更新自定义样式',
      '',
      '**旧版本：**',
      '```less',
      '@primary-color: #1890ff;',
      '@link-color: #1890ff;',
      '```',
      '',
      '**新版本：**',
      '```css',
      ':root {',
      '  --theme-color-primary: #1890ff;',
      '  --theme-color-link: #1890ff;',
      '}',
      '```',
      '',
      '## 兼容性说明',
      '',
      '- ✅ 完全兼容 Ant Design Vue 4.x',
      '- ✅ 支持所有原生主题配置',
      '- ✅ 向后兼容旧版本配置',
      '- ⚠️ 部分高级功能需要更新配置格式',
      '',
      '## 自动迁移工具',
      '',
      '我们提供了自动迁移工具帮助您快速迁移：',
      '',
      '```bash',
      'npx vue-component-library migrate-theme',
      '```'
    ]

    return migration.join('\n')
  }

  private static generateThemeConfigInterface(): string {
    return [
      '```typescript',
      'interface ThemeConfig {',
      '  // 继承 Ant Design Vue 主题配置',
      '  token?: {',
      '    // 基础颜色',
      '    colorPrimary?: string',
      '    colorSuccess?: string',
      '    colorWarning?: string',
      '    colorError?: string',
      '    colorInfo?: string',
      '    colorText?: string',
      '    colorBgBase?: string',
      '    ',
      '    // 尺寸',
      '    borderRadius?: number',
      '    fontSize?: number',
      '    ',
      '    // 字体',
      '    fontFamily?: string',
      '    ',
      '    // 自定义令牌',
      '    customModalDragColor?: string',
      '    customTableVirtualScrollBar?: string',
      '    // ... 更多自定义令牌',
      '  }',
      '  ',
      '  components?: {',
      '    // 自定义组件主题',
      '    CustomModal?: {',
      '      dragHandleColor?: string',
      '      resizeHandleColor?: string',
      '      dragHandleSize?: number',
      '      resizeHandleSize?: number',
      '    }',
      '    // ... 更多组件主题',
      '  }',
      '}',
      '```'
    ].join('\n')
  }

  private static generatePresetThemesDocs(): string {
    const docs = ['| 主题名称 | 描述 | 主色调 |', '|---------|------|--------|']
    
    presetThemes.forEach(theme => {
      const primaryColor = theme.config.token?.colorPrimary || '#1677ff'
      docs.push(`| ${theme.displayName} | ${theme.name} | ${primaryColor} |`)
    })

    docs.push('', '### 使用预设主题', '', '```vue', '<ThemeProvider preset-theme="dark">', '  <App />', '</ThemeProvider>', '```')

    return docs.join('\n')
  }

  private static generateCustomTokensDocs(): string {
    const customTokens = Object.keys(defaultTheme.token || {}).filter(key => key.startsWith('custom'))
    
    const docs = [
      '自定义令牌用于扩展 Ant Design Vue 的设计系统：',
      '',
      '| 令牌名称 | 描述 | 默认值 |',
      '|---------|------|--------|'
    ]

    customTokens.forEach(token => {
      const value = (defaultTheme.token as any)?.[token] || ''
      const description = this.getTokenDescription(token)
      docs.push(`| ${token} | ${description} | ${value} |`)
    })

    return docs.join('\n')
  }

  private static generateComponentThemesDocs(): string {
    const components = Object.keys(defaultTheme.components || {})
    
    const docs = [
      '每个组件都支持独立的主题配置：',
      '',
      '### 支持的组件',
      ''
    ]

    components.forEach(component => {
      docs.push(`- **${component}**`)
      const config = (defaultTheme.components as any)?.[component]
      if (config && typeof config === 'object') {
        Object.keys(config).forEach(key => {
          docs.push(`  - ${key}: ${config[key]}`)
        })
      }
      docs.push('')
    })

    return docs.join('\n')
  }

  private static generateCustomizerDocs(): string {
    return [
      '主题定制工具提供可视化的主题编辑能力：',
      '',
      '### 功能特性',
      '',
      '- 🎨 可视化主题编辑',
      '- 🔄 实时预览',
      '- 📥 主题导入导出',
      '- 📸 主题快照',
      '- 🎯 颜色对比度检查',
      '',
      '### 基础用法',
      '',
      '```typescript',
      'import { createThemeCustomizer } from "vue-component-library/theme"',
      '',
      'const customizer = createThemeCustomizer({',
      '  enablePreview: true',
      '})',
      '',
      '// 更新主色调',
      'customizer.updatePrimaryColor("#1890ff")',
      '',
      '// 监听主题变化',
      'customizer.addListener((theme) => {',
      '  console.log("Theme updated:", theme)',
      '})',
      '```'
    ].join('\n')
  }

  private static generateBestPractices(): string {
    return [
      '### 1. 主题结构组织',
      '',
      '```typescript',
      '// 推荐的主题文件结构',
      'themes/',
      '├── index.ts          // 主题入口',
      '├── light.ts          // 亮色主题',
      '├── dark.ts           // 暗色主题',
      '├── custom.ts         // 自定义主题',
      '└── tokens.ts         // 设计令牌',
      '```',
      '',
      '### 2. 性能优化',
      '',
      '- 使用 CSS 变量而非 JavaScript 动态计算',
      '- 避免频繁的主题切换',
      '- 合理使用主题缓存',
      '',
      '### 3. 可访问性',
      '',
      '- 确保颜色对比度符合 WCAG 标准',
      '- 支持高对比度模式',
      '- 提供主题切换的键盘快捷键',
      '',
      '### 4. 团队协作',
      '',
      '- 建立设计令牌规范',
      '- 使用版本控制管理主题',
      '- 提供主题文档和示例'
    ].join('\n')
  }

  private static getTokenDescription(token: string): string {
    const descriptions: Record<string, string> = {
      customModalDragColor: '弹窗拖拽句柄颜色',
      customTableVirtualScrollBar: '表格虚拟滚动条颜色',
      customFormLabelColor: '表单标签颜色',
      customEmptyIconColor: '空状态图标颜色',
      customLoadingSpinColor: '加载动画颜色'
    }
    
    return descriptions[token] || '自定义令牌'
  }
}

/**
 * 生成完整的主题文档
 */
export function generateThemeDocs(): {
  config: string
  usage: string
  migration: string
} {
  return {
    config: ThemeDocsGenerator.generateThemeConfigDocs(),
    usage: ThemeDocsGenerator.generateUsageGuide(),
    migration: ThemeDocsGenerator.generateMigrationGuide()
  }
}

/**
 * 导出主题文档到文件
 */
export function exportThemeDocsToFiles(): void {
  const docs = generateThemeDocs()
  
  // 在实际项目中，这里应该写入文件系统
  console.log('Theme Config Docs:', docs.config)
  console.log('Usage Guide:', docs.usage)
  console.log('Migration Guide:', docs.migration)
}