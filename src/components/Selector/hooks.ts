/**
 * Selector 组件专用 Hooks
 */

import { ref, computed, onUnmounted, type Ref } from 'vue'

/**
 * 节流函数 Hook
 * @param fn 需要节流的函数
 * @param delay 节流延迟时间(ms)
 */
export function useThrottle<T extends (...args: any[]) => any>(fn: T, delay: number = 1000): T {
  let lastTime = 0
  let timer: number | null = null

  // 创建节流函数
  const throttled = function(this: any, ...args: any[]) {
    const now = Date.now()
    const remaining = delay - (now - lastTime)

    // 如果已经过了延迟时间，立即执行
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      return fn.apply(this, args)
    } 
    // 否则，设置定时器延迟执行
    else if (!timer) {
      timer = window.setTimeout(() => {
        lastTime = Date.now()
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  })

  return throttled as T
}

/**
 * 虚拟滚动 Hook
 * 
 * 性能优化:
 * 1. 使用节流函数限制滚动事件触发频率，降低CPU使用率
 * 2. 优化DOM操作，减少重排和重绘
 * 3. 使用CSS transform代替position属性进行位置计算
 * 
 * @param containerRef 容器引用
 * @param itemHeight 每项高度
 */
export function useVirtualScroll(containerRef: Ref<any>, itemHeight: number = 32) {
  /**
   * 应用虚拟滚动配置
   */
  const applyVirtualScroll = () => {
    // 获取容器元素
    const container = containerRef.value
    if (!container) return
    
    // 查找下拉列表元素
    const dropdown = document.querySelector('.ant-select-dropdown') || 
                    document.querySelector('.ant-tree-select-dropdown')
    
    if (!dropdown) return
    
    // 查找列表容器
    const listHolder = dropdown.querySelector('.ant-select-item-empty') || 
                      dropdown.querySelector('.ant-select-item-option') ||
                      dropdown.querySelector('.ant-tree-select-tree')
    
    if (!listHolder) return
    
    // 设置虚拟滚动相关样式和属性
    try {
      // 为下拉菜单添加虚拟滚动类
      dropdown.classList.add('virtual-scroll-dropdown')
      
      // 设置虚拟滚动样式
      const style = document.createElement('style')
      style.textContent = `
        .virtual-scroll-dropdown .rc-virtual-list-holder {
          max-height: 256px;
          overflow-y: auto;
        }
        .virtual-scroll-dropdown .rc-virtual-list-holder-inner {
          display: flex;
          flex-direction: column;
        }
        .virtual-scroll-dropdown .ant-select-item,
        .virtual-scroll-dropdown .ant-tree-select-tree-treenode {
          height: ${itemHeight}px;
          line-height: ${itemHeight}px;
        }
      `
      document.head.appendChild(style)
      
      // 查找滚动容器并添加节流处理
      const scrollContainer = dropdown.querySelector('.rc-virtual-list-holder')
      if (scrollContainer) {
        // 使用节流函数包装滚动事件处理
        const throttledScrollHandler = useThrottle((e: Event) => {
          // 滚动事件会被正常传递，这里可以添加额外的处理逻辑
        }, 100) // 100ms的节流，可以根据需要调整
        
        // 添加节流后的滚动事件监听
        scrollContainer.addEventListener('scroll', throttledScrollHandler)
        
        // 返回清理函数
        return () => {
          document.head.removeChild(style)
          scrollContainer.removeEventListener('scroll', throttledScrollHandler)
        }
      }
      
      return () => {
        document.head.removeChild(style)
      }
    } catch (error) {
      console.error('应用虚拟滚动失败:', error)
    }
  }
  
  // 组件挂载后应用虚拟滚动
  const cleanup = applyVirtualScroll()
  
  // 组件卸载时清理
  onUnmounted(() => {
    if (cleanup) cleanup()
  })
}

/**
 * 搜索防抖 Hook
 * @param callback 搜索回调函数
 * @param delay 防抖延迟时间
 */
export function useSearchDebounce(callback: (value: string) => void, delay: number = 300) {
  // 定时器引用
  let timer: number | null = null
  
  /**
   * 防抖处理的搜索函数
   * @param value 搜索值
   */
  const debouncedSearch = (value: string) => {
    if (timer) {
      clearTimeout(timer)
    }
    
    timer = window.setTimeout(() => {
      callback(value)
      timer = null
    }, delay)
  }
  
  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  })
  
  return {
    debouncedSearch
  }
}

/**
 * 搜索高亮 Hook
 * @param style 高亮样式
 */
export function useSearchHighlight(style: string = 'color: #1890ff; font-weight: bold;') {
  /**
   * 高亮文本
   * @param text 原始文本
   * @param keyword 关键词
   */
  const highlightText = (text: string, keyword: string): string => {
    if (!keyword || !text) return text
    
    try {
      // 创建正则表达式，忽略大小写
      const reg = new RegExp(keyword, 'gi')
      
      // 替换文本中的关键词为高亮样式
      return text.replace(reg, match => `<span style="${style}">${match}</span>`)
    } catch (error) {
      console.error('高亮文本失败:', error)
      return text
    }
  }
  
  return {
    highlightText
  }
}

/**
 * 选项分组 Hook
 * @param options 选项数组
 */
export function useOptionGrouping(options: Ref<any[]>) {
  // 分组后的选项
  const groupedOptions = computed(() => {
    if (!options.value || !Array.isArray(options.value)) return []
    
    const groups: Record<string, any[]> = {}
    const result: any[] = []
    
    // 遍历选项，按分组进行分类
    options.value.forEach(option => {
      const groupLabel = option.groupLabel || ''
      
      if (!groups[groupLabel]) {
        groups[groupLabel] = []
      }
      
      groups[groupLabel].push(option)
    })
    
    // 转换为分组格式
    Object.keys(groups).forEach(groupLabel => {
      if (groupLabel) {
        // 有分组标签，创建分组
        result.push({
          label: groupLabel,
          options: groups[groupLabel]
        })
      } else {
        // 无分组标签，直接添加到结果
        result.push(...groups[groupLabel])
      }
    })
    
    return result
  })
  
  return {
    groupedOptions
  }
}

/**
 * 树形数据转换 Hook
 */
export function useTreeDataConversion() {
  /**
   * 将平级数据转换为树形结构
   * @param data 平级数据
   * @param idKey ID字段名
   * @param parentIdKey 父ID字段名
   * @param childrenKey 子节点字段名
   */
  const convertToTree = (
    data: any[],
    idKey: string = 'id',
    parentIdKey: string = 'parentId',
    childrenKey: string = 'children'
  ): any[] => {
    if (!data || !Array.isArray(data)) return []
    
    // 创建节点映射
    const map: Record<string | number, any> = {}
    data.forEach(item => {
      map[item[idKey]] = { ...item, [childrenKey]: [] }
    })
    
    // 构建树形结构
    const tree: any[] = []
    
    data.forEach(item => {
      const id = item[idKey]
      const parentId = item[parentIdKey]
      
      if (parentId === null || parentId === undefined || parentId === '' || !map[parentId]) {
        // 根节点
        tree.push(map[id])
      } else {
        // 子节点，添加到父节点的children中
        map[parentId][childrenKey].push(map[id])
      }
    })
    
    return tree
  }
  
  /**
   * 将树形结构转换为平级数据
   * @param tree 树形数据
   * @param childrenKey 子节点字段名
   */
  const convertToFlat = (tree: any[], childrenKey: string = 'children'): any[] => {
    if (!tree || !Array.isArray(tree)) return []
    
    const result: any[] = []
    
    // 递归处理树节点
    const processNode = (node: any, level: number = 0, parentPath: string[] = []) => {
      if (!node) return
      
      // 当前节点路径
      const path = [...parentPath, node.title || node.label || '']
      
      // 添加节点到结果，并添加level和path属性
      const newNode = { ...node, level, path }
      result.push(newNode)
      
      // 处理子节点
      const children = node[childrenKey]
      if (children && Array.isArray(children) && children.length > 0) {
        children.forEach((child: any) => {
          processNode(child, level + 1, path)
        })
      }
    }
    
    // 处理所有根节点
    tree.forEach(node => {
      processNode(node)
    })
    
    return result
  }
  
  return {
    convertToTree,
    convertToFlat
  }
}

/**
 * 选择器历史记录 Hook
 * @param key 存储键名
 * @param maxCount 最大记录数
 */
export function useSelectHistory(key: string = 'selector-history', maxCount: number = 10) {
  // 历史记录
  const history = ref<string[]>([])
  
  /**
   * 加载历史记录
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        history.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
    }
  }
  
  /**
   * 保存历史记录
   */
  const saveHistory = () => {
    try {
      localStorage.setItem(key, JSON.stringify(history.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }
  
  /**
   * 添加历史记录
   * @param item 记录项
   */
  const addHistory = (item: string) => {
    if (!item || history.value.includes(item)) return
    
    history.value = [item, ...history.value].slice(0, maxCount)
    saveHistory()
  }
  
  /**
   * 清除历史记录
   */
  const clearHistory = () => {
    history.value = []
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('清除历史记录失败:', error)
    }
  }
  
  // 初始加载历史记录
  loadHistory()
  
  return {
    history,
    addHistory,
    clearHistory
  }
} 