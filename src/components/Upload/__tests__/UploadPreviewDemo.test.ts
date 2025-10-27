import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UploadPreviewDemo from '../UploadPreviewDemo.vue'
import type { DemoScenario } from '../types/demo'

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useClipboard: () => ({
    copy: vi.fn().mockResolvedValue(undefined),
    isSupported: true
  })
}))

// Mock ant-design-vue message
vi.mock('ant-design-vue', async () => {
  const actual = await vi.importActual('ant-design-vue')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    }
  }
})

describe('UploadPreviewDemo', () => {
  const mockScenarios: DemoScenario[] = [
    {
      id: 'basic',
      title: '基础上传预览',
      description: '展示文件上传后立即预览的基本功能',
      features: ['文件上传', '立即预览'],
      component: 'BasicIntegrationDemo',
      config: {
        upload: {
          multiple: true,
          dragUpload: true,
          maxSize: 10
        },
        preview: {
          enabled: true,
          mode: 'modal'
        }
      },
      configSchema: {
        upload: {
          multiple: { type: 'boolean', label: '多文件上传' },
          dragUpload: { type: 'boolean', label: '拖拽上传' }
        }
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染组件', () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.upload-preview-demo').exists()).toBe(true)
  })

  it('应该显示场景导航', () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    const navigation = wrapper.find('.demo-navigation')
    expect(navigation.exists()).toBe(true)
    
    const tabs = wrapper.findAll('.demo-tab')
    expect(tabs).toHaveLength(1)
    expect(tabs[0].text()).toBe('基础上传预览')
  })

  it('应该显示场景描述', () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    const description = wrapper.find('.scenario-description')
    expect(description.exists()).toBe(true)
    expect(description.find('h3').text()).toBe('基础上传预览')
    expect(description.find('p').text()).toBe('展示文件上传后立即预览的基本功能')
  })

  it('应该显示功能特性标签', () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    const featureTags = wrapper.findAll('.feature-tag')
    expect(featureTags).toHaveLength(2)
    expect(featureTags[0].text()).toBe('文件上传')
    expect(featureTags[1].text()).toBe('立即预览')
  })

  it('应该支持控制面板切换', async () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic',
        showCode: false,
        showConfig: false
      }
    })

    // 初始状态
    expect(wrapper.find('.code-section').exists()).toBe(false)
    expect(wrapper.find('.config-panel').exists()).toBe(false)

    // 切换代码示例
    const codeBtn = wrapper.find('.control-btn:first-child')
    await codeBtn.trigger('click')
    expect(wrapper.find('.code-section').exists()).toBe(true)

    // 切换配置面板
    const configBtn = wrapper.find('.control-btn:last-child')
    await configBtn.trigger('click')
    expect(wrapper.find('.config-panel').exists()).toBe(true)
  })

  it('应该支持场景切换', async () => {
    const multipleScenarios: DemoScenario[] = [
      ...mockScenarios,
      {
        id: 'advanced',
        title: '高级功能',
        description: '高级上传预览功能',
        component: 'AdvancedDemo',
        config: {
          upload: { multiple: false },
          preview: { enabled: false }
        }
      }
    ]

    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: multipleScenarios,
        defaultScenario: 'basic'
      }
    })

    // 初始场景
    expect(wrapper.find('.scenario-description h3').text()).toBe('基础上传预览')

    // 切换场景
    const tabs = wrapper.findAll('.demo-tab')
    await tabs[1].trigger('click')
    
    expect(wrapper.find('.scenario-description h3').text()).toBe('高级功能')
  })

  it('应该触发场景切换事件', async () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    // 模拟场景切换
    await wrapper.vm.switchScenario('basic')
    
    const emitted = wrapper.emitted('scenario-change')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['basic'])
  })

  it('应该支持配置变更', async () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    const newConfig = { upload: { multiple: false } }
    await wrapper.vm.handleConfigChange(newConfig)
    
    const emitted = wrapper.emitted('config-change')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toMatchObject(newConfig)
  })

  it('应该支持配置重置', async () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    // 修改配置
    await wrapper.vm.handleConfigChange({ upload: { multiple: false } })
    
    // 重置配置
    await wrapper.vm.resetConfig()
    
    // 验证配置已重置为默认值
    expect(wrapper.vm.currentConfig.upload?.multiple).toBe(true)
  })

  it('应该正确处理事件日志', async () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic',
        showEventLog: true
      }
    })

    const testEvent = {
      type: 'test-event',
      data: { test: 'data' },
      timestamp: new Date()
    }

    await wrapper.vm.handleScenarioEvent(testEvent)
    
    expect(wrapper.vm.eventLog).toHaveLength(1)
    expect(wrapper.vm.eventLog[0]).toMatchObject(testEvent)
  })

  it('应该支持事件日志清空', async () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic',
        showEventLog: true
      }
    })

    // 添加事件
    await wrapper.vm.logEvent({
      type: 'test',
      data: {},
      timestamp: new Date()
    })

    expect(wrapper.vm.eventLog).toHaveLength(1)

    // 清空日志
    await wrapper.vm.clearEventLog()
    expect(wrapper.vm.eventLog).toHaveLength(0)
  })

  it('应该暴露正确的方法', () => {
    const wrapper = mount(UploadPreviewDemo, {
      props: {
        scenarios: mockScenarios,
        defaultScenario: 'basic'
      }
    })

    // 验证暴露的方法
    expect(typeof wrapper.vm.switchScenario).toBe('function')
    expect(typeof wrapper.vm.getCurrentScenario).toBe('function')
    expect(typeof wrapper.vm.getCurrentConfig).toBe('function')
    expect(typeof wrapper.vm.getEventLog).toBe('function')
    expect(typeof wrapper.vm.clearEventLog).toBe('function')
    expect(typeof wrapper.vm.resetConfig).toBe('function')
  })
})