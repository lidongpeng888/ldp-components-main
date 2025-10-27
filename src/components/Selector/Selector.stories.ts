import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch, computed } from 'vue'
import Selector from './Selector.vue'
import type { SelectorMode, SelectorOption, SelectorProps, SelectorTreeData, SearchConfig, VirtualConfig } from './types'

// 通用选项数据
const commonOptions: SelectorOption[] = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' },
  { value: '4', label: '选项4', disabled: true },
  { value: '5', label: '选项5' }
]

// 树形数据
const treeData: SelectorTreeData[] = [
  {
    title: '父节点1',
    value: '1',
    children: [
      {
        title: '子节点1.1',
        value: '1-1'
      },
      {
        title: '子节点1.2',
        value: '1-2',
        disabled: true
      }
    ]
  },
  {
    title: '父节点2',
    value: '2',
    children: [
      {
        title: '子节点2.1',
        value: '2-1'
      },
      {
        title: '子节点2.2',
        value: '2-2'
      }
    ]
  }
]

// 大数据集，用于虚拟滚动测试
const largeDataset: SelectorOption[] = Array.from({ length: 300 }, (_, i) => ({
  value: `item-${i}`,
  label: `选项 ${i + 1}`
}))

// 分组选项
const groupedOptions = [
  { 
    groupLabel: '水果',
    options: [
      { value: 'apple', label: '苹果' },
      { value: 'banana', label: '香蕉' },
      { value: 'orange', label: '橙子' }
    ]
  },
  {
    groupLabel: '蔬菜',
    options: [
      { value: 'tomato', label: '番茄' },
      { value: 'carrot', label: '胡萝卜' },
      { value: 'lettuce', label: '生菜' }
    ]
  }
]

// 默认搜索配置
const defaultSearchConfig: SearchConfig = {
  remote: false,
  debounce: 300,
  searchKeys: ['label', 'value'],
  highlightStyle: 'color: #1890ff; font-weight: bold;',
  saveHistory: true,
  historyMax: 5
}

// 默认虚拟滚动配置
const defaultVirtualConfig: VirtualConfig = {
  itemHeight: 32,
  threshold: 100
}

const meta = {
  title: 'Components/Selector',
  component: Selector,
  argTypes: {
    // 数据相关
    modelValue: {
      control: {
        type: 'object'
      },
      description: '选择器的值'
    },
    options: {
      control: 'object',
      description: '选择器选项数据',
      table: {
        type: { summary: 'SelectorOption[]' }
      }
    },
    treeData: {
      control: 'object',
      description: '树形选择器数据',
      table: {
        type: { summary: 'SelectorTreeData[]' }
      }
    },
    dataSource: {
      control: 'object',
      description: '数据源(可以是数组或返回Promise的函数)',
      table: {
        type: { summary: 'SelectorOption[] | SelectorTreeData[] | (() => Promise<...>)' }
      }
    },
    mode: {
      control: 'object',
      description: '选择器模式配置',
      table: {
        type: { summary: 'SelectorMode' },
        defaultValue: { summary: '{ type: "select", multiple: false, searchable: false, virtual: false }' }
      }
    },
    placeholder: {
      control: 'text',
      description: '占位文本',
      table: {
        defaultValue: { summary: '请选择' }
      }
    },
    loading: {
      control: 'boolean',
      description: '加载状态',
      table: {
        defaultValue: { summary: false }
      }
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
      table: {
        defaultValue: { summary: false }
      }
    },
    allowClear: {
      control: 'boolean',
      description: '是否可清空',
      table: {
        defaultValue: { summary: true }
      }
    },
    maxTagCount: {
      control: 'number',
      description: '最多显示的标签数',
      table: {
        defaultValue: { summary: 'undefined' }
      }
    },
    maxTagPlaceholder: {
      control: 'text',
      description: '隐藏标签时显示的内容',
      table: {
        defaultValue: { summary: 'undefined' }
      }
    },
    optionLabelProp: {
      control: 'text',
      description: '选项标签属性',
      table: {
        defaultValue: { summary: 'label' }
      }
    },
    optionFilterProp: {
      control: 'text',
      description: '搜索时过滤对应的option属性',
      table: {
        defaultValue: { summary: 'label' }
      }
    },
    listHeight: {
      control: 'number',
      description: '设置弹窗滚动高度',
      table: {
        defaultValue: { summary: '256' }
      }
    },
    dropdownMatchSelectWidth: {
      control: 'boolean',
      description: '下拉菜单和选择器同宽',
      table: {
        defaultValue: { summary: 'true' }
      }
    },
    dropdownStyle: {
      control: 'object',
      description: '下拉菜单样式',
      table: {
        type: { summary: 'CSSProperties' }
      }
    },
    dropdownClassName: {
      control: 'text',
      description: '下拉菜单类名',
      table: {
        defaultValue: { summary: 'undefined' }
      }
    },
    notFoundContent: {
      control: 'text',
      description: '当下拉列表为空时显示的内容',
      table: {
        defaultValue: { summary: '无匹配数据' }
      }
    },
    loadingTip: {
      control: 'text',
      description: '加载中提示文本',
      table: {
        defaultValue: { summary: '加载中...' }
      }
    },
    searchConfig: {
      control: 'object',
      description: '搜索配置',
      table: {
        type: { summary: 'SearchConfig' }
      }
    },
    virtualConfig: {
      control: 'object',
      description: '虚拟滚动配置',
      table: {
        type: { summary: 'VirtualConfig' }
      }
    },
    // 树形选择器特有属性
    treeDefaultExpandAll: {
      control: 'boolean',
      description: '树形选择器默认展开所有树节点',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    treeDefaultExpandedKeys: {
      control: 'array',
      description: '树形选择器默认展开的树节点',
      table: {
        type: { summary: 'string[]' }
      }
    },
    treeExpandedKeys: {
      control: 'array',
      description: '树形选择器设置展开的树节点',
      table: {
        type: { summary: 'string[]' }
      }
    },
    treeNodeFilterProp: {
      control: 'text',
      description: '树形选择器搜索时过滤对应的treeNode属性',
      table: {
        defaultValue: { summary: 'title' }
      }
    },
    treeNodeLabelProp: {
      control: 'text',
      description: '树形选择器作为value唯一标识的属性',
      table: {
        defaultValue: { summary: 'title' }
      }
    },
    treeDataSimpleMode: {
      control: 'boolean',
      description: '树形选择器使用简单格式的treeData',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    treeCheckable: {
      control: 'boolean',
      description: '树形选择器显示Checkbox',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    treeCheckStrictly: {
      control: 'boolean',
      description: '树形选择器完全受控',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    showCheckedStrategy: {
      control: 'select',
      options: ['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD'],
      description: '树形选择器定义选中项回填的方式',
      table: {
        defaultValue: { summary: 'SHOW_CHILD' }
      }
    },
    // 事件
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: '值更新事件'
    },
    onChange: {
      action: 'change',
      description: '选择器值变化事件'
    },
    onSearch: {
      action: 'search',
      description: '搜索事件'
    },
    onRemoteSearch: {
      action: 'remoteSearch',
      description: '远程搜索事件'
    },
    onFocus: {
      action: 'focus',
      description: '获取焦点事件'
    },
    onBlur: {
      action: 'blur',
      description: '失去焦点事件'
    },
    onClear: {
      action: 'clear',
      description: '清空事件'
    },
    onDropdownVisibleChange: {
      action: 'dropdownVisibleChange',
      description: '下拉菜单显示/隐藏事件'
    },
    onSelect: {
      action: 'select',
      description: '选中事件'
    },
    onDeselect: {
      action: 'deselect',
      description: '取消选中事件'
    },
    onPopupScroll: {
      action: 'popupScroll',
      description: '弹出层滚动事件'
    },
    onMouseEnter: {
      action: 'mouseEnter',
      description: '鼠标进入事件'
    },
    onMouseLeave: {
      action: 'mouseLeave',
      description: '鼠标离开事件'
    },
    onTreeExpand: {
      action: 'treeExpand',
      description: '树节点展开事件'
    }
  },
  args: {
    placeholder: '请选择',
    loading: false,
    disabled: false,
    allowClear: true,
    mode: { type: 'select', multiple: false, searchable: false, virtual: false },
    options: commonOptions,
    listHeight: 256,
    dropdownMatchSelectWidth: true,
    notFoundContent: '无匹配数据',
    loadingTip: '加载中...',
    optionLabelProp: 'label',
    optionFilterProp: 'label'
  }
} satisfies Meta<typeof Selector>

export default meta
type Story = StoryObj<typeof Selector>

interface StoryContext {
  args: Partial<SelectorProps> & {
    'onUpdate:modelValue'?: (value: any) => void
    onChange?: (value: any, option: any) => void
    onSearch?: (value: string) => void
    onRemoteSearch?: (value: string) => void
    onFocus?: (e: FocusEvent) => void
    onBlur?: (e: FocusEvent) => void
    onClear?: () => void
    onDropdownVisibleChange?: (visible: boolean) => void
    onSelect?: (value: any, option: any) => void
    onDeselect?: (value: any, option: any) => void
    onPopupScroll?: (e: Event) => void
    onMouseEnter?: (e: MouseEvent) => void
    onMouseLeave?: (e: MouseEvent) => void
    onTreeExpand?: (expandedKeys: string[]) => void
  }
}

// 通用的渲染函数
const createRender = (title: string) => (args: StoryContext['args']) => ({
  components: { CustomSelector: Selector },
  setup() {
    // 使用ref跟踪当前值，初始值从args获取
    const value = ref(args.modelValue);
    
    // 处理值变化
    const handleChange = (newValue: any) => {
      value.value = newValue;
      args['onUpdate:modelValue']?.(newValue);
    };
    
    // 监听args.modelValue的变化
    watch(() => args.modelValue, (newValue) => {
      // 只有当值真正变化时才更新
      if (JSON.stringify(newValue) !== JSON.stringify(value.value)) {
        console.log('modelValue changed:', newValue);
        value.value = newValue;
      }
    }, { immediate: true, deep: true });
    
    return {
      value,
      args,
      handleChange,
      title
    };
  },
  template: `
    <div style="max-width: 500px; margin: 0 auto;">
      <h3>{{ title }}</h3>
      <CustomSelector
        :modelValue="value"
        @update:modelValue="handleChange"
        :options="args.options"
        :mode="args.mode"
        :placeholder="args.placeholder"
        :loading="args.loading"
        :disabled="args.disabled"
        :allow-clear="args.allowClear"
        :max-tag-count="args.maxTagCount"
        :max-tag-placeholder="args.maxTagPlaceholder"
        :option-label-prop="args.optionLabelProp"
        :option-filter-prop="args.optionFilterProp"
        :list-height="args.listHeight"
        :dropdown-match-select-width="args.dropdownMatchSelectWidth"
        :dropdown-style="args.dropdownStyle"
        :dropdown-class-name="args.dropdownClassName"
        :not-found-content="args.notFoundContent"
        :loading-tip="args.loadingTip"
        :search-config="args.searchConfig"
        :virtual-config="args.virtualConfig"
        :tree-data="args.treeData"
        :tree-default-expand-all="args.treeDefaultExpandAll"
        :tree-default-expanded-keys="args.treeDefaultExpandedKeys"
        :tree-expanded-keys="args.treeExpandedKeys"
        :tree-node-filter-prop="args.treeNodeFilterProp"
        :tree-node-label-prop="args.treeNodeLabelProp"
        :tree-data-simple-mode="args.treeDataSimpleMode"
        :tree-checkable="args.treeCheckable"
        :tree-check-strictly="args.treeCheckStrictly"
        :show-checked-strategy="args.showCheckedStrategy"
        @change="args.onChange"
        @search="args.onSearch"
        @remote-search="args.onRemoteSearch"
        @focus="args.onFocus"
        @blur="args.onBlur"
        @clear="args.onClear"
        @dropdown-visible-change="args.onDropdownVisibleChange"
        @select="args.onSelect"
        @deselect="args.onDeselect"
        @popup-scroll="args.onPopupScroll"
        @mouse-enter="args.onMouseEnter"
        @mouse-leave="args.onMouseLeave"
        @tree-expand="args.onTreeExpand"
      />
      <div style="margin-top: 16px;">
        <h4>当前值:</h4>
        <pre>{{ JSON.stringify(value, null, 2) }}</pre>
        <div style="margin-top: 8px;">
          <h4>Controls面板值:</h4>
          <pre>{{ JSON.stringify(args.modelValue, null, 2) }}</pre>
        </div>
      </div>
    </div>
  `
});

// 基础示例
export const Basic: Story = {
  args: {
    options: commonOptions,
    modelValue: null
  },
  render: createRender('基础用法')
}

// 多选模式
export const Multiple: Story = {
  args: {
    options: commonOptions,
    modelValue: [],
    mode: { type: 'select', multiple: true, searchable: false, virtual: false },
    maxTagCount: 3,
    maxTagPlaceholder: (omittedValues: any[]) => `+${omittedValues.length}...`
  },
  render: createRender('多选模式')
}

// 可搜索模式
export const Searchable: Story = {
  args: {
    options: [
      { value: 'apple', label: '苹果' },
      { value: 'banana', label: '香蕉' },
      { value: 'orange', label: '橙子' },
      { value: 'grape', label: '葡萄' },
      { value: 'watermelon', label: '西瓜' },
      { value: 'strawberry', label: '草莓' }
    ],
    modelValue: null,
    mode: { type: 'select', multiple: false, searchable: true, virtual: false },
    searchConfig: defaultSearchConfig
  },
  render: createRender('可搜索模式')
}

// 禁用状态
export const Disabled: Story = {
  args: {
    options: commonOptions,
    modelValue: '1',
    disabled: true
  },
  render: createRender('禁用状态')
}

// 加载状态
export const Loading: Story = {
  args: {
    options: commonOptions,
    modelValue: null,
    loading: true,
    loadingTip: '数据加载中，请稍候...'
  },
  render: createRender('加载状态')
}

// 树形选择器
export const TreeSelect: Story = {
  args: {
    treeData,
    modelValue: null,
    mode: { type: 'tree-select', multiple: false, searchable: false, virtual: false },
    treeDefaultExpandAll: true,
    treeNodeFilterProp: 'title',
    treeNodeLabelProp: 'title'
  },
  render: createRender('树形选择器')
}

// 树形多选
export const TreeMultiple: Story = {
  args: {
    treeData,
    modelValue: [],
    mode: { type: 'tree-select', multiple: true, searchable: false, virtual: false },
    treeDefaultExpandAll: true,
    treeCheckable: true,
    showCheckedStrategy: 'SHOW_PARENT'
  },
  render: createRender('树形多选')
}

// 分组选择器
export const GroupedOptions: Story = {
  args: {
    options: groupedOptions,
    modelValue: null,
    mode: { type: 'select', multiple: false, searchable: true, virtual: false }
  },
  render: createRender('分组选择器')
}

// 虚拟滚动
export const VirtualScroll: Story = {
  args: {
    options: largeDataset,
    modelValue: null,
    mode: { type: 'select', multiple: false, searchable: true, virtual: true },
    virtualConfig: {
      itemHeight: 32,
      threshold: 100
    },
    listHeight: 300
  },
  render: createRender('虚拟滚动')
} 