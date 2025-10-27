<template>
  <div class="selector-demo">
    <h2>基础用法</h2>
    <div class="demo-block">
      <custom-selector v-model="value" placeholder="请选择" :options="options" />
      <div class="demo-value">选中值: {{ value }}</div>
    </div>

    <h2>不同选择器类型</h2>
    <div class="demo-block">
      <h3>普通选择器</h3>
      <custom-selector 
        v-model="selectValue" 
        :mode="{ type: 'select' }" 
        :options="options" 
      />
      <div class="demo-value">选中值: {{ selectValue }}</div>
      
      <h3>树形选择器</h3>
      <custom-selector 
        v-model="treeValue" 
        :mode="{ type: 'tree-select' }" 
        :treeData="treeData" 
      />
      <div class="demo-value">选中值: {{ treeValue }}</div>
    </div>

    <h2>多选模式</h2>
    <div class="demo-block">
      <h3>普通多选</h3>
      <custom-selector 
        v-model="multiValue" 
        :mode="{ type: 'select', multiple: true }" 
        :options="options" 
      />
      <div class="demo-value">选中值: {{ multiValue }}</div>
      
      <h3>树形多选</h3>
      <custom-selector 
        v-model="multiTreeValue" 
        :mode="{ type: 'tree-select', multiple: true }" 
        :treeData="treeData" 
      />
      <div class="demo-value">选中值: {{ multiTreeValue }}</div>
    </div>

    <h2>搜索功能</h2>
    <div class="demo-block">
      <h3>本地搜索</h3>
      <custom-selector 
        v-model="searchValue" 
        :mode="{ type: 'select', searchable: true }" 
        :options="options" 
        @search="handleSearch"
      />
      <div class="demo-value">搜索值: {{ searchText }}</div>
      
      <h3>树形搜索</h3>
      <custom-selector 
        v-model="searchTreeValue" 
        :mode="{ type: 'tree-select', searchable: true }" 
        :treeData="treeData" 
        @search="handleTreeSearch"
      />
      <div class="demo-value">搜索值: {{ searchTreeText }}</div>
    </div>

    <h2>远程搜索</h2>
    <div class="demo-block">
      <custom-selector 
        v-model="remoteValue" 
        :mode="{ type: 'select', searchable: true }" 
        :options="remoteOptions" 
        :loading="loading"
        :searchConfig="{ remote: true, debounce: 500 }"
        @remoteSearch="handleRemoteSearch"
      />
      <div class="demo-value">远程搜索结果数: {{ remoteOptions.length }}</div>
    </div>

    <h2>动态数据源</h2>
    <div class="demo-block">
      <custom-selector 
        v-model="dynamicValue" 
        :dataSource="fetchData" 
        :loading="dynamicLoading"
      />
      <div class="demo-value">选中值: {{ dynamicValue }}</div>
    </div>

    <h2>选项分组</h2>
    <div class="demo-block">
      <custom-selector 
        v-model="groupValue" 
        :options="groupedOptions" 
      />
      <div class="demo-value">选中值: {{ groupValue }}</div>
    </div>

    <h2>虚拟滚动</h2>
    <div class="demo-block">
      <custom-selector 
        v-model="virtualValue" 
        :mode="{ type: 'select', virtual: true }" 
        :options="largeDataset" 
        :virtualConfig="{ itemHeight: 32, threshold: 100 }"
      />
      <div class="demo-value">选中值: {{ virtualValue }}</div>
      <div class="demo-tip">共 {{ largeDataset.length }} 个选项</div>
    </div>

    <h2>自定义渲染</h2>
    <div class="demo-block">
      <custom-selector 
        v-model="customValue" 
        :mode="{ type: 'select', multiple: true }" 
        :options="customOptions"
      >
        <template #option="{ value, label }">
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 8px;">🔍</span>
            <span>{{ label }} ({{ value }})</span>
          </div>
        </template>
        
        <template #tagRender="{ value, label, closable, onClose }">
          <a-tag :closable="closable" @close="onClose" style="margin-right: 3px;">
            {{ label }} ({{ value }})
          </a-tag>
        </template>
      </custom-selector>
      <div class="demo-value">选中值: {{ customValue }}</div>
    </div>

    <h2>平级数据转树形数据</h2>
    <div class="demo-block">
      <custom-selector 
        v-model="flatToTreeValue" 
        :mode="{ type: 'tree-select' }" 
        :treeData="convertedTreeData" 
      />
      <div class="demo-value">选中值: {{ flatToTreeValue }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomSelector from './Selector.vue'
import { useTreeDataConversion } from './hooks'

// 基础用法
const value = ref(null)
const options = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' },
  { value: '4', label: '选项4' },
  { value: '5', label: '选项5' }
]

// 不同选择器类型
const selectValue = ref(null)
const treeValue = ref(null)
const treeData = [
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
        value: '1-2'
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
      }
    ]
  }
]

// 多选模式
const multiValue = ref([])
const multiTreeValue = ref([])

// 搜索功能
const searchValue = ref(null)
const searchTreeValue = ref(null)
const searchText = ref('')
const searchTreeText = ref('')

const handleSearch = (value: string) => {
  searchText.value = value
}

const handleTreeSearch = (value: string) => {
  searchTreeText.value = value
}

// 远程搜索
const remoteValue = ref(null)
const remoteOptions = ref<any[]>([])
const loading = ref(false)

const handleRemoteSearch = async (value: string) => {
  if (!value) {
    remoteOptions.value = []
    return
  }
  
  loading.value = true
  try {
    // 模拟远程搜索
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成模拟数据
    remoteOptions.value = Array.from({ length: 10 }, (_, i) => ({
      value: `${value}-${i}`,
      label: `${value} 结果 ${i + 1}`
    }))
  } finally {
    loading.value = false
  }
}

// 动态数据源
const dynamicValue = ref(null)
const dynamicLoading = ref(false)

const fetchData = async () => {
  dynamicLoading.value = true
  try {
    // 模拟远程数据获取
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 返回模拟数据
    return Array.from({ length: 20 }, (_, i) => ({
      value: `dynamic-${i}`,
      label: `动态选项 ${i + 1}`
    }))
  } finally {
    dynamicLoading.value = false
  }
}

// 选项分组
const groupValue = ref(null)
const groupedOptions = [
  { value: 'g1-1', label: '选项1-1', groupLabel: '分组1' },
  { value: 'g1-2', label: '选项1-2', groupLabel: '分组1' },
  { value: 'g2-1', label: '选项2-1', groupLabel: '分组2' },
  { value: 'g2-2', label: '选项2-2', groupLabel: '分组2' },
  { value: 'g3-1', label: '选项3-1', groupLabel: '分组3' }
]

// 虚拟滚动
const virtualValue = ref(null)
const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
  value: `item-${i}`,
  label: `选项 ${i + 1}`
}))

// 自定义渲染
const customValue = ref([])
const customOptions = [
  { value: 'custom-1', label: '自定义选项1' },
  { value: 'custom-2', label: '自定义选项2' },
  { value: 'custom-3', label: '自定义选项3' }
]

// 平级数据转树形数据
const flatToTreeValue = ref(null)
const flatData = [
  { id: '1', name: '节点1', parentId: null },
  { id: '2', name: '节点2', parentId: null },
  { id: '1-1', name: '节点1.1', parentId: '1' },
  { id: '1-2', name: '节点1.2', parentId: '1' },
  { id: '2-1', name: '节点2.1', parentId: '2' },
  { id: '1-1-1', name: '节点1.1.1', parentId: '1-1' }
]

const { convertToTree } = useTreeDataConversion()

// 转换为树形结构
const convertedTreeData = computed(() => {
  return convertToTree(flatData, 'id', 'parentId').map(node => ({
    value: node.id,
    title: node.name,
    children: node.children?.map((child: any) => ({
      value: child.id,
      title: child.name,
      children: child.children?.map((grandChild: any) => ({
        value: grandChild.id,
        title: grandChild.name
      })) || []
    })) || []
  }))
})
</script>

<style lang="scss" scoped>
.selector-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }
  
  h3 {
    margin: 16px 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  .demo-block {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background-color: #fafafa;
  }
  
  .demo-value {
    margin-top: 10px;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-family: monospace;
    word-break: break-all;
  }
  
  .demo-tip {
    margin-top: 8px;
    color: #999;
    font-size: 12px;
  }
}
</style> 