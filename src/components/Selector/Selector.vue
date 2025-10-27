<template>
  <div class="custom-selector-wrapper" :class="wrapperClasses">
    <!-- 基于 a-select 封装 -->
    <a-select
      v-if="mode.type === 'select'"
      ref="selectRef"
      v-bind="$attrs"
      :options="internalOptions"
      :value="internalValue"
      :mode="mode.multiple ? 'multiple' : undefined"
      :show-search="mode.searchable"
      :filter-option="handleFilterOption"
      :placeholder="placeholder"
      :loading="loading"
      :disabled="disabled"
      :allow-clear="allowClear"
      :max-tag-count="maxTagCount"
      :max-tag-placeholder="maxTagPlaceholder"
      :option-label-prop="optionLabelProp"
      :option-filter-prop="optionFilterProp"
      :virtual="mode.virtual"
      :list-height="listHeight"
      :dropdown-match-select-width="dropdownMatchSelectWidth"
      :dropdown-style="dropdownStyle"
      :dropdown-class-name="dropdownClassName"
      :class="selectClasses"
      @change="handleChange"
      @search="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @dropdown-visible-change="handleDropdownVisibleChange"
      @select="handleSelect"
      @deselect="handleDeselect"
      @clear="handleClear"
      @popup-scroll="handlePopupScroll"
      @mouse-enter="handleMouseEnter"
      @mouse-leave="handleMouseLeave"
    >
      <!-- 自定义选项插槽 -->
      <template #option="item" v-if="$slots.option">
        <slot name="option" v-bind="item" />
      </template>
      
      <!-- 自定义选项组插槽 -->
      <template #optionGroup="item" v-if="$slots.optionGroup">
        <slot name="optionGroup" v-bind="item" />
      </template>
      
      <!-- 自定义下拉菜单插槽 -->
      <template #dropdownRender="menu" v-if="$slots.dropdownRender">
        <slot name="dropdownRender" :menu="menu" />
      </template>
      
      <!-- 自定义下拉菜单为空时显示内容 -->
      <template #notFoundContent v-if="$slots.notFoundContent">
        <slot name="notFoundContent" />
      </template>
      <template #notFoundContent v-else-if="notFoundContent">
        {{ notFoundContent }}
      </template>
      
      <!-- 自定义标签插槽 -->
      <template #tagRender="props" v-if="$slots.tagRender">
        <slot name="tagRender" v-bind="props" />
      </template>
      
      <!-- 自定义清除图标 -->
      <template #clearIcon v-if="$slots.clearIcon">
        <slot name="clearIcon" />
      </template>
      
      <!-- 自定义箭头图标 -->
      <template #suffixIcon v-if="$slots.suffixIcon">
        <slot name="suffixIcon" />
      </template>
      <template #suffixIcon v-else-if="loading">
        <loading-outlined spin />
      </template>
      
      <!-- 自定义移除图标 -->
      <template #removeIcon v-if="$slots.removeIcon">
        <slot name="removeIcon" />
      </template>
      
      <!-- 自定义菜单滚动加载图标 -->
      <template #menuItemSelectedIcon v-if="$slots.menuItemSelectedIcon">
        <slot name="menuItemSelectedIcon" />
      </template>
    </a-select>
    
    <!-- 基于 a-tree-select 封装 -->
    <a-tree-select
      v-else
      ref="treeSelectRef"
      v-bind="$attrs"
      :value="internalValue"
      :tree-data="internalTreeData"
      :multiple="mode.multiple"
      :show-search="mode.searchable"
      :filter-tree-node="handleFilterTreeNode"
      :placeholder="placeholder"
      :loading="loading"
      :disabled="disabled"
      :allow-clear="allowClear"
      :max-tag-count="maxTagCount"
      :max-tag-placeholder="maxTagPlaceholder"
      :tree-default-expand-all="treeDefaultExpandAll"
      :tree-default-expanded-keys="treeDefaultExpandedKeys"
      :tree-expandedKeys="treeExpandedKeys"
      :tree-node-filter-prop="treeNodeFilterProp"
      :tree-node-label-prop="treeNodeLabelProp"
      :tree-data-simple-mode="treeDataSimpleMode"
      :tree-checkable="treeCheckable"
      :tree-check-strictly="treeCheckStrictly"
      :show-checked-strategy="showCheckedStrategy"
      :virtual="mode.virtual"
      :list-height="listHeight"
      :dropdown-match-select-width="dropdownMatchSelectWidth"
      :dropdown-style="dropdownStyle"
      :dropdown-class-name="dropdownClassName"
      :class="selectClasses"
      @change="handleChange"
      @search="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @dropdown-visible-change="handleDropdownVisibleChange"
      @select="handleSelect"
      @tree-expand="handleTreeExpand"
      @clear="handleClear"
      @mouse-enter="handleMouseEnter"
      @mouse-leave="handleMouseLeave"
    >
      <!-- 自定义树节点插槽 -->
      <template #title="nodeData" v-if="$slots.title">
        <slot name="title" v-bind="nodeData" />
      </template>
      
      <!-- 自定义下拉菜单插槽 -->
      <template #dropdownRender="menu" v-if="$slots.dropdownRender">
        <slot name="dropdownRender" :menu="menu" />
      </template>
      
      <!-- 自定义下拉菜单为空时显示内容 -->
      <template #notFoundContent v-if="$slots.notFoundContent">
        <slot name="notFoundContent" />
      </template>
      <template #notFoundContent v-else-if="notFoundContent">
        {{ notFoundContent }}
      </template>
      
      <!-- 自定义标签插槽 -->
      <template #tagRender="props" v-if="$slots.tagRender">
        <slot name="tagRender" v-bind="props" />
      </template>
      
      <!-- 自定义清除图标 -->
      <template #clearIcon v-if="$slots.clearIcon">
        <slot name="clearIcon" />
      </template>
      
      <!-- 自定义箭头图标 -->
      <template #suffixIcon v-if="$slots.suffixIcon">
        <slot name="suffixIcon" />
      </template>
      <template #suffixIcon v-else-if="loading">
        <loading-outlined spin />
      </template>
      
      <!-- 自定义移除图标 -->
      <template #removeIcon v-if="$slots.removeIcon">
        <slot name="removeIcon" />
      </template>
      
      <!-- 自定义菜单滚动加载图标 -->
      <template #switcherIcon v-if="$slots.switcherIcon">
        <slot name="switcherIcon" />
      </template>
    </a-tree-select>
    
    <!-- 加载中状态 -->
    <div v-if="loading && loadingTip" class="custom-selector-loading-tip">
      {{ loadingTip }}
    </div>
    
    <!-- 搜索历史 -->
    <div v-if="showSearchHistory && searchHistory.length > 0" class="custom-selector-search-history">
      <div class="custom-selector-search-history-title">
        <span>搜索历史</span>
        <a-button type="link" size="small" @click="clearSearchHistory">清除</a-button>
      </div>
      <div class="custom-selector-search-history-list">
        <a-tag 
          v-for="(item, index) in searchHistory" 
          :key="index" 
          class="custom-selector-search-history-item"
          @click="handleSearchHistoryClick(item)"
        >
          {{ item }}
        </a-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Select, TreeSelect } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useVirtualScroll, useSearchDebounce, useSearchHighlight, useThrottle } from './hooks'
import type { 
  SelectorProps, 
  SelectorEmits, 
  SelectorInstance, 
  SelectorOption, 
  SelectorTreeData,
  SelectorMode
} from './types'

// 定义组件名称
defineOptions({
  name: 'CustomSelector',
  inheritAttrs: false
})

// 定义 Props
const props = withDefaults(defineProps<SelectorProps>(), {
  modelValue: undefined,
  mode: () => ({ type: 'select', multiple: false, searchable: false, virtual: false }),
  dataSource: () => [],
  options: undefined,
  treeData: undefined,
  placeholder: '请选择',
  loading: false,
  disabled: false,
  allowClear: true,
  maxTagCount: undefined,
  maxTagPlaceholder: undefined,
  optionLabelProp: 'label',
  optionFilterProp: 'label',
  listHeight: 256,
  dropdownMatchSelectWidth: true,
  dropdownStyle: undefined,
  dropdownClassName: undefined,
  notFoundContent: '无匹配数据',
  loadingTip: '加载中...',
  treeDefaultExpandAll: false,
  treeDefaultExpandedKeys: undefined,
  treeExpandedKeys: undefined,
  treeNodeFilterProp: 'title',
  treeNodeLabelProp: 'title',
  treeDataSimpleMode: false,
  treeCheckable: false,
  treeCheckStrictly: false,
  showCheckedStrategy: 'SHOW_CHILD',
  searchConfig: () => ({ 
    remote: false, 
    debounce: 300, 
    searchKeys: ['label', 'value'], 
    highlightStyle: 'color: #1890ff; font-weight: bold;',
    saveHistory: false,
    historyMax: 10
  }),
  virtualConfig: () => ({ 
    itemHeight: 32, 
    threshold: 100 
  })
})

// 定义 Emits
const emit = defineEmits<SelectorEmits>()

// 组件引用
const selectRef = ref<InstanceType<typeof Select> | null>(null)
const treeSelectRef = ref<InstanceType<typeof TreeSelect> | null>(null)

// 内部数据
const internalOptions = ref<SelectorOption[]>([])
const internalTreeData = ref<SelectorTreeData[]>([])
const searchValue = ref<string>('')
const searchHistory = ref<string[]>([])
const dropdownVisible = ref<boolean>(false)

// 内部值，用于v-model
const internalValue = ref(props.modelValue)

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  console.log('modelValue changed:', newVal)
  internalValue.value = newVal
}, { immediate: true, deep: true })

// 监听数据源变化
watch(() => props.dataSource, async (newVal) => {
  if (typeof newVal === 'function') {
    try {
      const data = await newVal()
      if (props.mode.type === 'select') {
        internalOptions.value = data as SelectorOption[]
      } else {
        internalTreeData.value = data as SelectorTreeData[]
      }
    } catch (error) {
      console.error('加载数据源失败:', error)
    }
  } else {
    if (props.mode.type === 'select') {
      internalOptions.value = newVal as SelectorOption[]
    } else {
      internalTreeData.value = newVal as SelectorTreeData[]
    }
  }
}, { immediate: true, deep: true })

// 监听选项变化
watch(() => props.options, (newVal) => {
  if (newVal) {
    internalOptions.value = [...newVal]
    console.log('options changed:', newVal)
  }
}, { immediate: true, deep: true })

// 监听树形数据变化
watch(() => props.treeData, (newVal) => {
  if (newVal) {
    internalTreeData.value = newVal
  }
}, { immediate: true, deep: true })

// 计算选择器类名
const selectClasses = computed(() => {
  return {
    'custom-selector': true,
    'custom-selector-multiple': props.mode.multiple,
    'custom-selector-searchable': props.mode.searchable,
    'custom-selector-virtual': props.mode.virtual,
    'custom-selector-loading': props.loading,
    'custom-selector-disabled': props.disabled
  }
})

// 计算包装器类名
const wrapperClasses = computed(() => {
  return {
    'custom-selector-wrapper': true,
    'custom-selector-wrapper-tree': props.mode.type === 'tree-select'
  }
})

// 使用搜索防抖
const { debouncedSearch } = useSearchDebounce(
  (value: string) => {
    if (props.searchConfig.remote) {
      emit('remoteSearch', value)
    }
    
    // 保存搜索历史
    if (props.searchConfig.saveHistory && value && !searchHistory.value.includes(value)) {
      searchHistory.value = [value, ...searchHistory.value].slice(0, props.searchConfig.historyMax)
      // 保存到本地存储
      try {
        localStorage.setItem('selector-search-history', JSON.stringify(searchHistory.value))
      } catch (e) {
        console.error('保存搜索历史失败:', e)
      }
    }
  }, 
  props.searchConfig.debounce
)

// 使用搜索高亮
const { highlightText } = useSearchHighlight(props.searchConfig.highlightStyle)

// 处理普通选择器过滤选项
const handleFilterOption = (input: string, option: any) => {
  if (!input || props.searchConfig.remote) return true
  
  // 获取过滤属性
  const filterProp = props.optionFilterProp || 'label'
  const value = option[filterProp]
  
  if (!value) return false
  
  // 支持多个搜索键
  if (Array.isArray(props.searchConfig.searchKeys)) {
    return props.searchConfig.searchKeys.some(key => {
      const keyValue = option[key]
      return keyValue && keyValue.toString().toLowerCase().includes(input.toLowerCase())
    })
  }
  
  return value.toString().toLowerCase().includes(input.toLowerCase())
}

// 处理树形选择器过滤节点
const handleFilterTreeNode = (input: string, treeNode: any) => {
  if (!input || props.searchConfig.remote) return true
  
  // 获取过滤属性
  const filterProp = props.treeNodeFilterProp || 'title'
  const value = treeNode[filterProp]
  
  if (!value) return false
  
  // 支持多个搜索键
  if (Array.isArray(props.searchConfig.searchKeys)) {
    return props.searchConfig.searchKeys.some(key => {
      const keyValue = treeNode[key]
      return keyValue && keyValue.toString().toLowerCase().includes(input.toLowerCase())
    })
  }
  
  return value.toString().toLowerCase().includes(input.toLowerCase())
}

// 处理选择器值变化
const handleChange = (value: any, option: any) => {
  console.log('handleChange', value, option)
  emit('update:modelValue', value)
  emit('change', value, option)
}

// 处理搜索
const handleSearch = (value: string) => {
  searchValue.value = value
  emit('search', value)
  debouncedSearch(value)
}

// 处理焦点
const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}

// 处理失焦
const handleBlur = (e: FocusEvent) => {
  emit('blur', e)
}

// 处理下拉菜单显示/隐藏
const handleDropdownVisibleChange = (visible: boolean) => {
  dropdownVisible.value = visible
  emit('dropdownVisibleChange', visible)
  
  // 显示下拉菜单时，加载搜索历史
  if (visible && props.searchConfig.saveHistory) {
    try {
      const history = localStorage.getItem('selector-search-history')
      if (history) {
        searchHistory.value = JSON.parse(history)
      }
    } catch (e) {
      console.error('加载搜索历史失败:', e)
    }
  }
}

// 处理选择
const handleSelect = (value: any, option: any) => {
  emit('select', value, option)
}

// 处理取消选择
const handleDeselect = (value: any, option: any) => {
  emit('deselect', value, option)
}

// 处理清除
const handleClear = () => {
  emit('clear')
}

// 处理弹出层滚动
const handlePopupScroll = useThrottle((e: Event) => {
  emit('popupScroll', e)
}, 200) // 200ms的节流时间，可根据需要调整

// 处理鼠标进入
const handleMouseEnter = (e: MouseEvent) => {
  emit('mouseEnter', e)
}

// 处理鼠标离开
const handleMouseLeave = (e: MouseEvent) => {
  emit('mouseLeave', e)
}

// 处理树节点展开
const handleTreeExpand = (expandedKeys: string[]) => {
  emit('treeExpand', expandedKeys)
}

// 处理搜索历史点击
const handleSearchHistoryClick = (value: string) => {
  searchValue.value = value
  handleSearch(value)
  
  if (selectRef.value) {
    selectRef.value.focus()
  } else if (treeSelectRef.value) {
    treeSelectRef.value.focus()
  }
}

// 清除搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
  try {
    localStorage.removeItem('selector-search-history')
  } catch (e) {
    console.error('清除搜索历史失败:', e)
  }
}

// 计算是否显示搜索历史
const showSearchHistory = computed(() => {
  return props.searchConfig.saveHistory && dropdownVisible.value && props.mode.searchable
})

// 初始化虚拟滚动
const initVirtualScroll = () => {
  if (props.mode.virtual && props.virtualConfig.threshold > 0) {
    const threshold = props.virtualConfig.threshold
    const itemHeight = props.virtualConfig.itemHeight
    
    // 根据选择器类型应用虚拟滚动
    if (props.mode.type === 'select' && internalOptions.value.length > threshold) {
      // 应用虚拟滚动
      useVirtualScroll(selectRef, itemHeight)
    } else if (props.mode.type === 'tree-select' && internalTreeData.value.length > threshold) {
      // 应用虚拟滚动
      useVirtualScroll(treeSelectRef, itemHeight)
    }
  }
}

// 组件挂载后初始化
onMounted(() => {
  nextTick(() => {
    initVirtualScroll()
  })
})

// 获取当前选择器实例
const getSelectInstance = () => {
  return props.mode.type === 'select' ? selectRef.value : treeSelectRef.value
}

// 聚焦选择器
const focus = () => {
  const instance = getSelectInstance()
  if (instance) {
    instance.focus()
  }
}

// 失焦选择器
const blur = () => {
  const instance = getSelectInstance()
  if (instance) {
    instance.blur()
  }
}

// 暴露组件实例方法
const instance: SelectorInstance = {
  focus,
  blur,
  get $selectInstance() {
    return getSelectInstance()
  }
}

defineExpose(instance)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.custom-selector-wrapper {
  width: 100%;
  position: relative;
  
  .custom-selector {
    width: 100%;
    
    &-loading-tip {
      margin-top: 4px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
    
    &-search-history {
      margin-top: 8px;
      border-top: 1px solid #f0f0f0;
      padding-top: 8px;
      
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }
      
      &-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      &-item {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          color: #1890ff;
          border-color: #1890ff;
        }
      }
    }
  }
  
  &.custom-selector-wrapper-tree {
    // 树形选择器特有样式
  }
}

// 支持暗色模式
:deep(.ant-select-dropdown) {
  &.custom-selector-dropdown-dark {
    background-color: #1f1f1f;
    
    .ant-select-item {
      color: rgba(255, 255, 255, 0.85);
      
      &-option-selected {
        background-color: #111b26;
      }
      
      &-option-active:not(.ant-select-item-option-disabled) {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }
  }
}
</style> 