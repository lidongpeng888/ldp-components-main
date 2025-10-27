/**
 * 主题配置和预设
 */

import type { ThemeConfig, PresetTheme } from './types'

/**
 * 默认主题配置
 */
export const defaultTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorBgBase: '#ffffff',
    borderRadius: 6,
    fontSize: 14,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // 自定义令牌
    customModalDragColor: '#1677ff',
    customTableVirtualScrollBar: '#d9d9d9',
    customFormLabelColor: 'rgba(0, 0, 0, 0.88)',
    customEmptyIconColor: '#d9d9d9',
    customLoadingSpinColor: '#1677ff'
  },

  components: {
    CustomModal: {
      dragHandleColor: '#1677ff',
      resizeHandleColor: '#1677ff',
      dragHandleSize: 24,
      resizeHandleSize: 8
    },

    CustomTable: {
      virtualScrollBarWidth: 8,
      virtualScrollBarColor: '#d9d9d9',
      exportButtonColor: '#52c41a',
      columnSettingsIconColor: '#8c8c8c'
    },

    CustomForm: {
      collapsedIconColor: '#1677ff',
      groupTitleColor: 'rgba(0, 0, 0, 0.88)',
      dependencyLineColor: '#d9d9d9'
    },

    CustomQueryPanel: {
      expandButtonColor: '#1677ff',
      resetButtonColor: '#8c8c8c',
      searchButtonColor: '#1677ff'
    },

    CustomFileUpload: {
      dragAreaBorderColor: '#d9d9d9',
      dragAreaBackgroundColor: '#fafafa',
      progressBarColor: '#1677ff'
    },

    CustomEmpty: {
      iconColor: '#d9d9d9',
      textColor: 'rgba(0, 0, 0, 0.45)',
      actionButtonColor: '#1677ff'
    },

    CustomLoading: {
      spinColor: '#1677ff',
      overlayColor: 'rgba(255, 255, 255, 0.8)',
      textColor: 'rgba(0, 0, 0, 0.65)'
    },

    CustomMessage: {
      queueMaxCount: 5,
      defaultDuration: 3000,
      iconSize: 16
    },

    CustomTabs: {
      dragIndicatorColor: '#1677ff',
      closeIconColor: '#8c8c8c',
      addButtonColor: '#1677ff'
    },

    CustomCascader: {
      pathSeparatorColor: '#d9d9d9',
      loadingIconColor: '#1677ff',
      expandIconColor: '#8c8c8c'
    },

    CustomDropdown: {
      contextMenuShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
      nestedMenuIndicatorColor: '#8c8c8c',
      keyboardFocusColor: '#1677ff'
    },

    CustomLazyImage: {
      placeholderColor: '#f5f5f5',
      loadingSpinnerColor: '#1677ff',
      errorIconColor: '#ff4d4f'
    },

    CustomDatePicker: {
      todayButtonColor: '#1677ff',
      clearButtonColor: '#8c8c8c',
      shortcutButtonColor: '#1677ff'
    },

    CustomPopover: {
      arrowSize: 8,
      maxWidth: 300,
      animationDuration: 200
    },

    CustomTour: {
      spotlightColor: '#1677ff',
      maskColor: 'rgba(0, 0, 0, 0.5)',
      stepIndicatorColor: '#1677ff'
    },

    CustomSkeleton: {
      shimmerColor: '#f0f0f0',
      baseColor: '#f5f5f5',
      animationDuration: 1500
    }
  }
}

/**
 * 暗色主题配置
 */
export const darkTheme: ThemeConfig = {
  algorithm: ['dark'] as any,
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorText: 'rgba(255, 255, 255, 0.88)',
    colorBgBase: '#141414',
    borderRadius: 6,
    fontSize: 14,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // 自定义令牌 - 暗色主题
    customModalDragColor: '#1677ff',
    customTableVirtualScrollBar: '#434343',
    customFormLabelColor: 'rgba(255, 255, 255, 0.88)',
    customEmptyIconColor: '#434343',
    customLoadingSpinColor: '#1677ff'
  },

  components: {
    CustomModal: {
      dragHandleColor: '#1677ff',
      resizeHandleColor: '#1677ff',
      dragHandleSize: 24,
      resizeHandleSize: 8
    },

    CustomTable: {
      virtualScrollBarWidth: 8,
      virtualScrollBarColor: '#434343',
      exportButtonColor: '#52c41a',
      columnSettingsIconColor: '#8c8c8c'
    },

    CustomForm: {
      collapsedIconColor: '#1677ff',
      groupTitleColor: 'rgba(255, 255, 255, 0.88)',
      dependencyLineColor: '#434343'
    },

    CustomQueryPanel: {
      expandButtonColor: '#1677ff',
      resetButtonColor: '#8c8c8c',
      searchButtonColor: '#1677ff'
    },

    CustomFileUpload: {
      dragAreaBorderColor: '#434343',
      dragAreaBackgroundColor: '#1f1f1f',
      progressBarColor: '#1677ff'
    },

    CustomEmpty: {
      iconColor: '#434343',
      textColor: 'rgba(255, 255, 255, 0.45)',
      actionButtonColor: '#1677ff'
    },

    CustomLoading: {
      spinColor: '#1677ff',
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      textColor: 'rgba(255, 255, 255, 0.65)'
    },

    CustomMessage: {
      queueMaxCount: 5,
      defaultDuration: 3000,
      iconSize: 16
    },

    CustomTabs: {
      dragIndicatorColor: '#1677ff',
      closeIconColor: '#8c8c8c',
      addButtonColor: '#1677ff'
    },

    CustomCascader: {
      pathSeparatorColor: '#434343',
      loadingIconColor: '#1677ff',
      expandIconColor: '#8c8c8c'
    },

    CustomDropdown: {
      contextMenuShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.32)',
      nestedMenuIndicatorColor: '#8c8c8c',
      keyboardFocusColor: '#1677ff'
    },

    CustomLazyImage: {
      placeholderColor: '#262626',
      loadingSpinnerColor: '#1677ff',
      errorIconColor: '#ff4d4f'
    },

    CustomDatePicker: {
      todayButtonColor: '#1677ff',
      clearButtonColor: '#8c8c8c',
      shortcutButtonColor: '#1677ff'
    },

    CustomPopover: {
      arrowSize: 8,
      maxWidth: 300,
      animationDuration: 200
    },

    CustomTour: {
      spotlightColor: '#1677ff',
      maskColor: 'rgba(0, 0, 0, 0.7)',
      stepIndicatorColor: '#1677ff'
    },

    CustomSkeleton: {
      shimmerColor: '#303030',
      baseColor: '#262626',
      animationDuration: 1500
    }
  }
}

/**
 * 预设主题列表
 */
export const presetThemes: PresetTheme[] = [
  {
    name: 'default',
    displayName: '默认主题',
    config: defaultTheme
  },
  {
    name: 'dark',
    displayName: '暗色主题',
    config: darkTheme
  },
  {
    name: 'blue',
    displayName: '蓝色主题',
    config: {
      ...defaultTheme,
      token: {
        ...defaultTheme.token,
        colorPrimary: '#1890ff'
      }
    }
  },
  {
    name: 'green',
    displayName: '绿色主题',
    config: {
      ...defaultTheme,
      token: {
        ...defaultTheme.token,
        colorPrimary: '#52c41a'
      }
    }
  },
  {
    name: 'purple',
    displayName: '紫色主题',
    config: {
      ...defaultTheme,
      token: {
        ...defaultTheme.token,
        colorPrimary: '#722ed1'
      }
    }
  }
]

/**
 * 根据名称获取预设主题
 */
export function getPresetTheme(name: string): PresetTheme | undefined {
  return presetThemes.find(theme => theme.name === name)
}

/**
 * 合并主题配置
 */
export function mergeThemeConfig(base: ThemeConfig, override: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...base,
    token: {
      ...base.token,
      ...override.token
    },
    components: {
      ...base.components,
      ...override.components
    }
  }
}
