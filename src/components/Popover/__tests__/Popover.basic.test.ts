import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Popover from '../Popover.vue'

// 模拟 ant-design-vue 组件
vi.mock('ant-design-vue', () => {
  return {
    Popover: {
      name: 'a-popover',
      props: {
        title: [String, Object, Function],
        content: [String, Object, Function],
        visible: Boolean,
        placement: String,
        trigger: [String, Array],
        mouseEnterDelay: Number,
        mouseLeaveDelay: Number,
        overlayStyle: Object,
        overlayClassName: String,
        arrowPointAtCenter: Boolean,
        autoAdjustOverflow: Boolean,
        destroyTooltipOnHide: Boolean,
        getPopupContainer: Function
      },
      template: '<div class="ant-popover-mock"><slot /></div>'
    }
  }
})

describe('Popover 组件', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = null
    vi.clearAllMocks()
  })

  it('应该正确渲染气泡组件', () => {
    wrapper = mount(Popover, {
      props: {
        title: '标题',
        content: '内容'
      },
      slots: {
        default: '<button>触发元素</button>'
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.custom-popover-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-popover-mock').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('应该正确传递属性到气泡组件', () => {
    wrapper = mount(Popover, {
      props: {
        title: '标题',
        content: '内容',
        placement: 'top',
        trigger: 'hover',
        mouseEnterDelay: 0.2,
        mouseLeaveDelay: 0.3,
        arrowPointAtCenter: true,
        autoAdjustOverflow: false
      }
    })

    // 检查 props 是否正确传递
    expect(wrapper.vm.title).toBe('标题')
    expect(wrapper.vm.content).toBe('内容')
    expect(wrapper.vm.placement).toBe('top')
    expect(wrapper.vm.trigger).toBe('hover')
    expect(wrapper.vm.mouseEnterDelay).toBe(0.2)
    expect(wrapper.vm.mouseLeaveDelay).toBe(0.3)
    expect(wrapper.vm.arrowPointAtCenter).toBe(true)
    expect(wrapper.vm.autoAdjustOverflow).toBe(false)
  })

  it('应该正确处理可见性变化', async () => {
    const onVisibleChange = vi.fn()
    const onUpdateVisible = vi.fn()
    
    wrapper = mount(Popover, {
      props: {
        title: '标题',
        content: '内容',
        visible: false,
        'onUpdate:visible': onUpdateVisible,
        onVisibleChange
      }
    })

    // 模拟可见性变化
    await wrapper.vm.handleVisibleChange(true)
    
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    expect(onUpdateVisible).toHaveBeenCalledWith(true)
  })

  it('应该正确处理主题设置', () => {
    wrapper = mount(Popover, {
      props: {
        title: '标题',
        content: '内容',
        theme: 'dark'
      }
    })

    expect(wrapper.classes()).toContain('custom-popover-theme-dark')
  })

  it('应该正确处理箭头显示', () => {
    wrapper = mount(Popover, {
      props: {
        title: '标题',
        content: '内容',
        showArrow: false
      }
    })

    expect(wrapper.classes()).toContain('custom-popover-no-arrow')
  })

  it('应该正确处理富文本内容', () => {
    wrapper = mount(Popover, {
      props: {
        content: '<p>富文本</p>',
        rich: true
      }
    })

    expect(wrapper.vm.contentClasses).toEqual({ 'custom-popover-content-rich': true })
    expect(wrapper.vm.renderContent).toBe('<p>富文本</p>')
  })

  it('应该提供show和hide方法', () => {
    const onVisibleChange = vi.fn()
    const onUpdateVisible = vi.fn()
    
    wrapper = mount(Popover, {
      props: {
        'onUpdate:visible': onUpdateVisible,
        onVisibleChange
      }
    })

    // 调用show方法
    wrapper.vm.show()
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    expect(onUpdateVisible).toHaveBeenCalledWith(true)
    
    // 调用hide方法
    wrapper.vm.hide()
    expect(onVisibleChange).toHaveBeenCalledWith(false)
    expect(onUpdateVisible).toHaveBeenCalledWith(false)
  })
}) 