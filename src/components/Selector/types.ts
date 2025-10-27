/**
 * Selector 选择器组件类型定义
 */

import type { CSSProperties } from 'vue'
import type { SelectProps, TreeSelectProps } from 'ant-design-vue'

/**
 * 选择器模式
 */
export interface SelectorMode {
  /** 选择器类型：普通选择器或树形选择器 */
  type: 'select' | 'tree-select'
  /** 是否多选 */
  multiple?: boolean
  /** 是否可搜索 */
  searchable?: boolean
  /** 是否启用虚拟滚动 */
  virtual?: boolean
}

/**
 * 选择器选项
 */
export interface SelectorOption {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
  /** 分组标题 */
  groupLabel?: string
  /** 子选项 */
  options?: SelectorOption[]
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 树形选择器数据
 */
export interface SelectorTreeData {
  /** 节点值 */
  value: string | number
  /** 节点标题 */
  title: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可选 */
  selectable?: boolean
  /** 是否可勾选 */
  checkable?: boolean
  /** 是否禁止勾选 */
  disableCheckbox?: boolean
  /** 是否是叶子节点 */
  isLeaf?: boolean
  /** 子节点 */
  children?: SelectorTreeData[]
  /** 其他自定义属性 */
  [key: string]: any
}

/**
 * 搜索配置
 */
export interface SearchConfig {
  /** 是否远程搜索 */
  remote?: boolean
  /** 防抖延迟时间(毫秒) */
  debounce?: number
  /** 搜索的字段 */
  searchKeys?: string[]
  /** 高亮样式 */
  highlightStyle?: string
  /** 是否保存搜索历史 */
  saveHistory?: boolean
  /** 历史记录最大数量 */
  historyMax?: number
}

/**
 * 虚拟滚动配置
 */
export interface VirtualConfig {
  /** 每项高度 */
  itemHeight?: number
  /** 启用虚拟滚动的阈值(项数) */
  threshold?: number
}

/**
 * 选择器组件Props
 */
export interface SelectorProps {
  /** 绑定值 */
  modelValue?: any
  /** 选择器模式 */
  mode?: SelectorMode
  /** 数据源(可以是数组或返回Promise的函数) */
  dataSource?: SelectorOption[] | SelectorTreeData[] | (() => Promise<SelectorOption[] | SelectorTreeData[]>)
  /** 选择器选项(普通选择器) */
  options?: SelectorOption[]
  /** 树形选择器数据 */
  treeData?: SelectorTreeData[]
  /** 占位文本 */
  placeholder?: string
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  allowClear?: boolean
  /** 最多显示的标签数 */
  maxTagCount?: number
  /** 隐藏标签时显示的内容 */
  maxTagPlaceholder?: any
  /** 选项标签属性 */
  optionLabelProp?: string
  /** 搜索时过滤对应的 option 属性 */
  optionFilterProp?: string
  /** 设置弹窗滚动高度 */
  listHeight?: number
  /** 下拉菜单和选择器同宽 */
  dropdownMatchSelectWidth?: boolean | number
  /** 下拉菜单样式 */
  dropdownStyle?: CSSProperties
  /** 下拉菜单类名 */
  dropdownClassName?: string
  /** 当下拉列表为空时显示的内容 */
  notFoundContent?: string | null
  /** 加载中提示文本 */
  loadingTip?: string
  /** 树形选择器默认展开所有树节点 */
  treeDefaultExpandAll?: boolean
  /** 树形选择器默认展开的树节点 */
  treeDefaultExpandedKeys?: string[]
  /** 树形选择器设置展开的树节点 */
  treeExpandedKeys?: string[]
  /** 树形选择器搜索时过滤对应的 treeNode 属性 */
  treeNodeFilterProp?: string
  /** 树形选择器作为 value 唯一标识的属性 */
  treeNodeLabelProp?: string
  /** 树形选择器使用简单格式的 treeData */
  treeDataSimpleMode?: boolean | object
  /** 树形选择器显示 Checkbox */
  treeCheckable?: boolean
  /** 树形选择器完全受控 */
  treeCheckStrictly?: boolean
  /** 树形选择器定义选中项回填的方式 */
  showCheckedStrategy?: 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD'
  /** 搜索配置 */
  searchConfig?: SearchConfig
  /** 虚拟滚动配置 */
  virtualConfig?: VirtualConfig
}

/**
 * 选择器组件Emits
 */
export interface SelectorEmits {
  /** 值变化事件 */
  'update:modelValue': (value: any) => void
  /** 选择器值变化事件 */
  'change': (value: any, option: any) => void
  /** 搜索事件 */
  'search': (value: string) => void
  /** 远程搜索事件 */
  'remoteSearch': (value: string) => void
  /** 获取焦点事件 */
  'focus': (e: FocusEvent) => void
  /** 失去焦点事件 */
  'blur': (e: FocusEvent) => void
  /** 下拉菜单显示/隐藏事件 */
  'dropdownVisibleChange': (visible: boolean) => void
  /** 选中事件 */
  'select': (value: any, option: any) => void
  /** 取消选中事件 */
  'deselect': (value: any, option: any) => void
  /** 清空事件 */
  'clear': () => void
  /** 弹出层滚动事件 */
  'popupScroll': (e: Event) => void
  /** 鼠标进入事件 */
  'mouseEnter': (e: MouseEvent) => void
  /** 鼠标离开事件 */
  'mouseLeave': (e: MouseEvent) => void
  /** 树节点展开事件 */
  'treeExpand': (expandedKeys: string[]) => void
}

/**
 * 选择器组件Slots
 */
export interface SelectorSlots {
  /** 自定义选项 */
  option?: (option: SelectorOption) => any
  /** 自定义选项组 */
  optionGroup?: (group: any) => any
  /** 自定义树节点 */
  title?: (nodeData: SelectorTreeData) => any
  /** 自定义下拉菜单 */
  dropdownRender?: (menu: any) => any
  /** 自定义下拉菜单为空时显示内容 */
  notFoundContent?: () => any
  /** 自定义标签 */
  tagRender?: (props: any) => any
  /** 自定义清除图标 */
  clearIcon?: () => any
  /** 自定义后缀图标 */
  suffixIcon?: () => any
  /** 自定义移除图标 */
  removeIcon?: () => any
  /** 自定义菜单滚动加载图标 */
  menuItemSelectedIcon?: () => any
  /** 自定义树节点展开/折叠图标 */
  switcherIcon?: () => any
}

/**
 * 选择器组件实例
 */
export interface SelectorInstance {
  /** 原生选择器实例 */
  $selectInstance: any
  /** 聚焦选择器 */
  focus: () => void
  /** 失焦选择器 */
  blur: () => void
} 