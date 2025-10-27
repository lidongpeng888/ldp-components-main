/**
 * 主题系统类型定义
 * 基于 Ant Design Vue 主题系统扩展
 */

import type { ThemeConfig as AntThemeConfig } from 'ant-design-vue'

/**
 * 自定义主题配置接口
 * 继承 Ant Design Vue 的主题配置并扩展
 */
export interface ThemeConfig extends AntThemeConfig {
  token?: AntThemeConfig['token'] & {
    // 扩展的设计令牌
    customModalDragColor?: string
    customTableVirtualScrollBar?: string
    customFormLabelColor?: string
    customEmptyIconColor?: string
    customLoadingSpinColor?: string
  }

  components?: AntThemeConfig['components'] & {
    // 自定义组件主题配置
    CustomModal?: {
      dragHandleColor?: string
      resizeHandleColor?: string
      dragHandleSize?: number
      resizeHandleSize?: number
    }

    CustomTable?: {
      virtualScrollBarWidth?: number
      virtualScrollBarColor?: string
      exportButtonColor?: string
      columnSettingsIconColor?: string
    }

    CustomForm?: {
      collapsedIconColor?: string
      groupTitleColor?: string
      dependencyLineColor?: string
    }

    CustomQueryPanel?: {
      expandButtonColor?: string
      resetButtonColor?: string
      searchButtonColor?: string
    }

    CustomFileUpload?: {
      dragAreaBorderColor?: string
      dragAreaBackgroundColor?: string
      progressBarColor?: string
    }

    CustomEmpty?: {
      iconColor?: string
      textColor?: string
      actionButtonColor?: string
    }

    CustomLoading?: {
      spinColor?: string
      overlayColor?: string
      textColor?: string
    }

    CustomMessage?: {
      queueMaxCount?: number
      defaultDuration?: number
      iconSize?: number
    }

    CustomTabs?: {
      dragIndicatorColor?: string
      closeIconColor?: string
      addButtonColor?: string
    }

    CustomCascader?: {
      pathSeparatorColor?: string
      loadingIconColor?: string
      expandIconColor?: string
    }

    CustomDropdown?: {
      contextMenuShadow?: string
      nestedMenuIndicatorColor?: string
      keyboardFocusColor?: string
    }

    CustomLazyImage?: {
      placeholderColor?: string
      loadingSpinnerColor?: string
      errorIconColor?: string
    }

    CustomDatePicker?: {
      todayButtonColor?: string
      clearButtonColor?: string
      shortcutButtonColor?: string
    }

    CustomPopover?: {
      arrowSize?: number
      maxWidth?: number
      animationDuration?: number
    }

    CustomTour?: {
      spotlightColor?: string
      maskColor?: string
      stepIndicatorColor?: string
    }

    CustomSkeleton?: {
      shimmerColor?: string
      baseColor?: string
      animationDuration?: number
    }
  }
}

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题上下文类型
 */
export interface ThemeContext {
  theme: ThemeConfig
  mode: ThemeMode
  setTheme: (theme: Partial<ThemeConfig>) => void
  setMode: (mode: ThemeMode) => void
  resetTheme: () => void
}

/**
 * 预设主题类型
 */
export interface PresetTheme {
  name: string
  displayName: string
  config: ThemeConfig
}

/**
 * 主题提供者属性
 */
export interface ThemeProviderProps {
  theme?: Partial<ThemeConfig>
  mode?: ThemeMode
  presetTheme?: string
  children?: any
}
