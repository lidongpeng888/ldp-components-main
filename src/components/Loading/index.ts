/**
 * Loading 加载组件
 * 基于 Ant Design Vue Spin 组件封装
 */

import Loading from './Loading.vue'
import { createApp, h } from 'vue'
import type { App } from 'vue'
import type {
  LoadingProps,
  LoadingEmits,
  LoadingSlots,
  LoadingInstance,
  LoadingStyle,
  LoadingSize,
  LoadingPosition,
  GlobalLoadingConfig
} from './types'

// 全局加载实例
let globalLoadingInstance: any = null

// 全局配置
let globalConfig: GlobalLoadingConfig = {
  defaultDelay: 0,
  defaultMinDuration: 300,
  defaultMaxDuration: 30000,
  defaultLoadingStyle: 'spin',
  defaultSize: 'default',
  defaultText: '加载中...',
  defaultMask: {
    color: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.8
  }
}

// 组件安装函数
Loading.install = (app: App) => {
  app.component('Loading', Loading)
  app.component('CustomLoading', Loading)

  // 全局方法
  app.config.globalProperties.$loading = {
    show: showGlobalLoading,
    hide: hideGlobalLoading,
    config: setGlobalConfig
  }
}

// 全局加载方法
export function showGlobalLoading(options: Partial<LoadingProps> = {}) {
  if (globalLoadingInstance) {
    hideGlobalLoading()
  }

  const container = document.createElement('div')
  container.className = 'global-loading-container'
  document.body.appendChild(container)

  // 合并配置，处理属性映射
  const mergedProps = {
    spinning: true,
    fullscreen: true,
    delay: globalConfig.defaultDelay,
    minDuration: globalConfig.defaultMinDuration,
    maxDuration: globalConfig.defaultMaxDuration,
    loadingStyle: globalConfig.defaultLoadingStyle,
    size: globalConfig.defaultSize,
    text: globalConfig.defaultText,
    maskColor: globalConfig.defaultMask?.color,
    maskOpacity: globalConfig.defaultMask?.opacity,
    ...options,
    onCancel: () => {
      hideGlobalLoading()
    }
  }

  const app = createApp({
    render() {
      return h(Loading, mergedProps)
    }
  })

  globalLoadingInstance = {
    app,
    container,
    hide: () => hideGlobalLoading()
  }

  app.mount(container)

  return globalLoadingInstance
}

export function hideGlobalLoading() {
  if (globalLoadingInstance) {
    globalLoadingInstance.app.unmount()
    if (globalLoadingInstance.container.parentNode) {
      globalLoadingInstance.container.parentNode.removeChild(globalLoadingInstance.container)
    }
    globalLoadingInstance = null
  }
}

export function setGlobalConfig(config: Partial<GlobalLoadingConfig>) {
  globalConfig = { ...globalConfig, ...config }
}

// 便捷方法
export const loading = {
  show: showGlobalLoading,
  hide: hideGlobalLoading,
  config: setGlobalConfig
}

// 导出组件和类型
export default Loading
export { Loading }
export type {
  LoadingProps,
  LoadingEmits,
  LoadingSlots,
  LoadingInstance,
  LoadingStyle,
  LoadingSize,
  LoadingPosition,
  GlobalLoadingConfig
}
