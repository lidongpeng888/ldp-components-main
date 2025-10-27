// Vitest 测试环境设置文件
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局测试配置
config.global.stubs = {
  // 存根 Ant Design Vue 组件以避免测试中的复杂性
  'a-button': true,
  'a-input': true,
  'a-select': true,
  'a-table': true,
  'a-modal': true,
  'a-form': true,
  'a-form-item': true,
  'a-upload': true,
  'a-empty': true,
  'a-tabs': true,
  'a-tab-pane': true,
  'a-spin': true,
  'a-popover': true,
  'a-dropdown': true,
  'a-date-picker': true,
  'a-cascader': true,
  'a-image': true,
  'a-tour': true,
  'a-skeleton': true
}

// Mock 全局变量
Object.defineProperty(window, '__VUE_COMPONENT_LIBRARY_VERSION__', {
  value: '0.1.0',
  writable: false
})

Object.defineProperty(window, '__VUE_COMPONENT_LIBRARY_DEV__', {
  value: true,
  writable: false
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
})