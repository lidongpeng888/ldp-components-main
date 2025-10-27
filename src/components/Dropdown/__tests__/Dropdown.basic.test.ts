import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dropdown from '../Dropdown.vue'
import { Menu } from 'ant-design-vue'

describe('Dropdown 组件基础功能测试', () => {
  beforeEach(() => {
    // 模拟 DOM API
    vi.stubGlobal('requestAnimationFrame', (fn: any) => setTimeout(fn, 16))
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  })

  it('正确渲染默认插槽内容', () => {
    const wrapper = mount(Dropdown, {
      slots: {
        default: '<button>触发按钮</button>',
        overlay: '<a-menu><a-menu-item key="1">菜单项 1</a-menu-item></a-menu>'
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('触发按钮')
  })

  it('正确设置 trigger 属性', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click'
      },
      slots: {
        default: '<button>点击触发</button>',
        overlay: '<a-menu><a-menu-item key="1">菜单项 1</a-menu-item></a-menu>'
      }
    })

    // 默认不显示
    expect(wrapper.find('.ant-dropdown').exists()).toBe(false)

    // 点击后显示
    await wrapper.find('button').trigger('click')
    
    // 由于 Dropdown 组件使用了 Portal，需要在 document.body 中查找
    // 注意：这个测试在实际环境中可能需要调整
    const dropdown = document.body.querySelector('.ant-dropdown')
    expect(dropdown).not.toBeNull()
  })

  it('正确设置 placement 属性', () => {
    const wrapper = mount(Dropdown, {
      props: {
        placement: 'topLeft'
      },
      slots: {
        default: '<button>位置测试</button>',
        overlay: '<a-menu><a-menu-item key="1">菜单项 1</a-menu-item></a-menu>'
      }
    })

    // 检查内部 a-dropdown 组件是否接收了正确的 placement 属性
    expect(wrapper.findComponent({ name: 'ADropdown' }).props('placement')).toBe('topLeft')
  })

  it('禁用状态正常工作', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        disabled: true,
        trigger: 'click'
      },
      slots: {
        default: '<button>禁用状态</button>',
        overlay: '<a-menu><a-menu-item key="1">菜单项 1</a-menu-item></a-menu>'
      }
    })

    // 触发器应该有禁用样式类
    expect(wrapper.find('.custom-dropdown-trigger--disabled').exists()).toBe(true)

    // 点击不应该显示下拉菜单
    await wrapper.find('button').trigger('click')
    const dropdown = document.body.querySelector('.ant-dropdown')
    expect(dropdown).toBeNull()
  })

  it('手动控制显示/隐藏', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        manualControl: true
      },
      slots: {
        default: '<button>手动控制</button>',
        overlay: '<a-menu><a-menu-item key="1">菜单项 1</a-menu-item></a-menu>'
      }
    })

    // 调用 show 方法
    await wrapper.vm.show()
    
    // 检查是否显示
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    
    // 调用 hide 方法
    await wrapper.vm.hide()
    
    // 检查是否隐藏
    expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
    
    // 调用 toggle 方法
    await wrapper.vm.toggle()
    
    // 检查是否切换为显示
    expect(wrapper.emitted('update:open')?.[2]).toEqual([true])
  })

  it('正确触发事件', async () => {
    const onVisibleChange = vi.fn()
    const onOpenChange = vi.fn()
    
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click',
        onVisibleChange,
        onOpenChange
      },
      slots: {
        default: '<button>事件测试</button>',
        overlay: '<a-menu><a-menu-item key="1">菜单项 1</a-menu-item></a-menu>'
      }
    })

    // 点击显示
    await wrapper.find('button').trigger('click')
    
    // 检查事件是否被触发
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    
    // 再次点击隐藏
    await wrapper.find('button').trigger('click')
    
    // 检查事件是否被触发
    expect(onVisibleChange).toHaveBeenCalledWith(false)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
}) 