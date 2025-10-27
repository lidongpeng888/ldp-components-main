import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Selector from '../Selector.vue'

// 模拟 ant-design-vue 组件
vi.mock('ant-design-vue', () => {
  return {
    Select: {
      name: 'a-select',
      props: {
        options: Array,
        value: [String, Number, Array],
        mode: String,
        showSearch: Boolean,
        filterOption: Function,
        placeholder: String,
        loading: Boolean,
        disabled: Boolean,
        allowClear: Boolean,
        maxTagCount: Number,
        maxTagPlaceholder: [String, Function],
        optionLabelProp: String,
        optionFilterProp: String,
        virtual: Boolean,
        listHeight: Number,
        dropdownMatchSelectWidth: [Boolean, Number],
        dropdownStyle: Object,
        dropdownClassName: String,
        notFoundContent: String
      },
      template: '<div class="ant-select-mock"><slot /></div>'
    },
    TreeSelect: {
      name: 'a-tree-select',
      props: {
        treeData: Array,
        value: [String, Number, Array],
        multiple: Boolean,
        showSearch: Boolean,
        filterTreeNode: Function,
        placeholder: String,
        loading: Boolean,
        disabled: Boolean,
        allowClear: Boolean,
        maxTagCount: Number,
        maxTagPlaceholder: [String, Function],
        treeDefaultExpandAll: Boolean,
        treeDefaultExpandedKeys: Array,
        treeExpandedKeys: Array,
        treeNodeFilterProp: String,
        treeNodeLabelProp: String,
        treeDataSimpleMode: [Boolean, Object],
        treeCheckable: Boolean,
        treeCheckStrictly: Boolean,
        showCheckedStrategy: String,
        virtual: Boolean,
        listHeight: Number,
        dropdownMatchSelectWidth: [Boolean, Number],
        dropdownStyle: Object,
        dropdownClassName: String,
        notFoundContent: String
      },
      template: '<div class="ant-tree-select-mock"><slot /></div>'
    },
    LoadingOutlined: {
      name: 'LoadingOutlined',
      template: '<span class="anticon-loading-mock" />'
    }
  }
})

describe('Selector 组件', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = null
    vi.clearAllMocks()
  })

  it('应该正确渲染普通选择器', () => {
    wrapper = mount(Selector, {
      props: {
        placeholder: '请选择',
        options: [
          { value: '1', label: '选项1' },
          { value: '2', label: '选项2' }
        ]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.custom-selector-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-select-mock').exists()).toBe(true)
  })

  it('应该正确渲染树形选择器', () => {
    wrapper = mount(Selector, {
      props: {
        mode: { type: 'tree-select' },
        placeholder: '请选择',
        treeData: [
          {
            title: '父节点1',
            value: '1',
            children: [
              {
                title: '子节点1.1',
                value: '1-1'
              }
            ]
          }
        ]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.custom-selector-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-tree-select-mock').exists()).toBe(true)
  })

  it('应该正确传递属性到选择器组件', () => {
    wrapper = mount(Selector, {
      props: {
        placeholder: '请选择测试',
        loading: true,
        disabled: true,
        allowClear: false,
        options: [
          { value: '1', label: '选项1' },
          { value: '2', label: '选项2' }
        ]
      }
    })

    // 检查 props 是否正确传递
    expect(wrapper.vm.placeholder).toBe('请选择测试')
    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.vm.disabled).toBe(true)
    expect(wrapper.vm.allowClear).toBe(false)
  })

  it('应该正确处理多选模式', () => {
    wrapper = mount(Selector, {
      props: {
        mode: { type: 'select', multiple: true },
        options: [
          { value: '1', label: '选项1' },
          { value: '2', label: '选项2' }
        ]
      }
    })

    expect(wrapper.vm.mode.multiple).toBe(true)
  })

  it('应该正确处理搜索模式', () => {
    wrapper = mount(Selector, {
      props: {
        mode: { type: 'select', searchable: true },
        options: [
          { value: '1', label: '选项1' },
          { value: '2', label: '选项2' }
        ]
      }
    })

    expect(wrapper.vm.mode.searchable).toBe(true)
  })

  it('应该正确处理虚拟滚动模式', () => {
    wrapper = mount(Selector, {
      props: {
        mode: { type: 'select', virtual: true },
        options: [
          { value: '1', label: '选项1' },
          { value: '2', label: '选项2' }
        ]
      }
    })

    expect(wrapper.vm.mode.virtual).toBe(true)
  })

  it('应该正确处理选项分组', () => {
    wrapper = mount(Selector, {
      props: {
        options: [
          { value: '1', label: '选项1', groupLabel: '分组1' },
          { value: '2', label: '选项2', groupLabel: '分组1' },
          { value: '3', label: '选项3', groupLabel: '分组2' }
        ]
      }
    })

    expect(wrapper.vm.internalOptions).toHaveLength(3)
  })

  it('应该正确处理远程搜索配置', () => {
    const handleRemoteSearch = vi.fn()
    
    wrapper = mount(Selector, {
      props: {
        mode: { type: 'select', searchable: true },
        searchConfig: { remote: true, debounce: 500 },
        options: []
      },
      attrs: {
        onRemoteSearch: handleRemoteSearch
      }
    })

    expect(wrapper.vm.searchConfig.remote).toBe(true)
    expect(wrapper.vm.searchConfig.debounce).toBe(500)
  })

  it('应该正确处理树形选择器配置', () => {
    wrapper = mount(Selector, {
      props: {
        mode: { type: 'tree-select' },
        treeDefaultExpandAll: true,
        treeCheckable: true,
        treeData: [
          {
            title: '父节点1',
            value: '1',
            children: [
              {
                title: '子节点1.1',
                value: '1-1'
              }
            ]
          }
        ]
      }
    })

    expect(wrapper.vm.treeDefaultExpandAll).toBe(true)
    expect(wrapper.vm.treeCheckable).toBe(true)
  })
}) 