/**
 * 主题提供者组件
 * 基于 Ant Design Vue ConfigProvider 扩展
 */

import { defineComponent, provide, inject, computed, ref, watch, h, onMounted, onUnmounted } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import type { PropType, ComputedRef, Ref, InjectionKey } from 'vue'
import type { ThemeConfig, ThemeMode, ThemeContext, ThemeProviderProps } from './types'
import { defaultTheme, darkTheme, mergeThemeConfig, getPresetTheme } from './config'

/**
 * 主题上下文注入键
 */
export const THEME_CONTEXT_KEY: InjectionKey<ThemeContext> = Symbol('theme-context')

/**
 * 主题提供者组件
 */
export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Partial<ThemeConfig>>,
      default: () => ({})
    },
    mode: {
      type: String as PropType<ThemeMode>,
      default: 'light'
    },
    presetTheme: {
      type: String,
      default: 'default'
    }
  },
  setup(props, { slots }) {
    // 当前主题配置
    const currentTheme = ref<ThemeConfig>(defaultTheme)
    const currentMode = ref<ThemeMode>(props.mode)
    
    // 计算最终主题配置
    const finalTheme = computed(() => {
      let baseTheme = { ...defaultTheme }
      
      // 根据模式选择基础主题
      if (currentMode.value === 'dark') {
        baseTheme = { ...darkTheme }
      } else if (currentMode.value === 'auto') {
        // 自动模式：根据系统主题选择
        if (typeof window !== 'undefined') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          baseTheme = prefersDark ? { ...darkTheme } : { ...defaultTheme }
        }
      }
      
      // 应用预设主题
      if (props.presetTheme && props.presetTheme !== 'default') {
        const preset = getPresetTheme(props.presetTheme)
        if (preset) {
          baseTheme = mergeThemeConfig(baseTheme, preset.config)
        }
      }
      
      // 合并用户自定义主题
      return mergeThemeConfig(baseTheme, props.theme)
    })
    
    // 系统主题监听器
    let mediaQuery: MediaQueryList | null = null
    let handleSystemThemeChange: (() => void) | null = null
    
    // 监听系统主题变化（自动模式）
    onMounted(() => {
      if (typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        handleSystemThemeChange = () => {
          if (currentMode.value === 'auto') {
            // 触发重新计算
            currentTheme.value = { ...currentTheme.value }
          }
        }
        
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      }
    })
    
    onUnmounted(() => {
      if (mediaQuery && handleSystemThemeChange) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      }
    })
    
    // 主题上下文
    const themeContext: ThemeContext = {
      theme: finalTheme.value,
      mode: currentMode.value,
      setTheme: (theme: Partial<ThemeConfig>) => {
        currentTheme.value = mergeThemeConfig(currentTheme.value, theme)
      },
      setMode: (mode: ThemeMode) => {
        currentMode.value = mode
      },
      resetTheme: () => {
        currentTheme.value = defaultTheme
        currentMode.value = 'light'
      }
    }
    
    // 提供主题上下文
    provide(THEME_CONTEXT_KEY, themeContext)
    
    // 监听props变化
    watch(() => props.mode, (newMode) => {
      currentMode.value = newMode
    })
    
    return () => h(ConfigProvider, { theme: finalTheme.value }, slots.default)
  }
})

/**
 * 使用主题的Hook
 */
export function useTheme(): ThemeContext {
  const context = inject(THEME_CONTEXT_KEY)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}

/**
 * 使用主题配置的Hook
 */
export function useThemeConfig(): ComputedRef<ThemeConfig> {
  const context = useTheme()
  return computed(() => context.theme)
}

/**
 * 使用主题模式的Hook
 */
export function useThemeMode(): {
  mode: Ref<ThemeMode>
  setMode: (mode: ThemeMode) => void
  isDark: ComputedRef<boolean>
  isLight: ComputedRef<boolean>
  isAuto: ComputedRef<boolean>
} {
  const context = useTheme()
  
  const isDark = computed(() => context.mode === 'dark')
  const isLight = computed(() => context.mode === 'light')
  const isAuto = computed(() => context.mode === 'auto')
  
  return {
    mode: ref(context.mode),
    setMode: context.setMode,
    isDark,
    isLight,
    isAuto
  }
}

/**
 * 使用主题令牌的Hook
 */
export function useThemeToken() {
  const context = useTheme()
  
  return computed(() => context.theme.token || {})
}

/**
 * 使用组件主题的Hook
 */
export function useComponentTheme<T extends keyof NonNullable<ThemeConfig['components']>>(
  componentName: T
): ComputedRef<NonNullable<ThemeConfig['components']>[T] | undefined> {
  const context = useTheme()
  
  return computed(() => {
    return context.theme.components?.[componentName]
  })
}

/**
 * 创建主题变量CSS
 */
export function createThemeVars(theme: ThemeConfig): Record<string, string> {
  const vars: Record<string, string> = {}
  
  // 基础令牌
  if (theme.token) {
    Object.entries(theme.token).forEach(([key, value]) => {
      vars[`--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = String(value)
    })
  }
  
  // 组件令牌
  if (theme.components) {
    Object.entries(theme.components).forEach(([componentName, componentTheme]) => {
      if (componentTheme && typeof componentTheme === 'object') {
        Object.entries(componentTheme).forEach(([key, value]) => {
          const varName = `--${componentName.toLowerCase()}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
          vars[varName] = String(value)
        })
      }
    })
  }
  
  return vars
}

/**
 * 应用主题变量到DOM
 */
export function applyThemeVars(theme: ThemeConfig, target: HTMLElement = document.documentElement) {
  const vars = createThemeVars(theme)
  
  Object.entries(vars).forEach(([key, value]) => {
    target.style.setProperty(key, value)
  })
}

/**
 * 移除主题变量
 */
export function removeThemeVars(theme: ThemeConfig, target: HTMLElement = document.documentElement) {
  const vars = createThemeVars(theme)
  
  Object.keys(vars).forEach(key => {
    target.style.removeProperty(key)
  })
}