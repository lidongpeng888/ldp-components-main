/**
 * 主题系统入口文件
 * 导出所有主题相关的功能
 */

// 类型定义
export type {
  ThemeConfig,
  ThemeMode,
  ThemeContext,
  ThemeProviderProps,
  PresetTheme
} from './types'

// 主题配置
export {
  defaultTheme,
  darkTheme,
  presetThemes,
  getPresetTheme,
  mergeThemeConfig
} from './config'

// 主题提供者和Hooks
export {
  ThemeProvider,
  useTheme,
  useThemeConfig,
  useThemeMode,
  useThemeToken,
  useComponentTheme,
  createThemeVars,
  applyThemeVars,
  removeThemeVars,
  THEME_CONTEXT_KEY
} from './provider'

// 主题定制工具
export {
  ThemeCustomizer,
  createThemeCustomizer,
  ThemeColorUtils,
  defaultCustomizer
} from './customizer'

export type {
  ThemeSnapshot,
  ThemeCustomizerOptions
} from './customizer'

// 文档生成器
export {
  ThemeDocsGenerator,
  generateThemeDocs,
  exportThemeDocsToFiles
} from './docs'

// 默认导出主题提供者
export { ThemeProvider as default } from './provider'