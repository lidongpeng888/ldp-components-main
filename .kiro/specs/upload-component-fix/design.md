# Upload 组件修复设计文档

## 概述

本设计文档旨在解决 Upload 组件中的蒙层问题和相关的 TypeScript 类型错误。主要问题包括：
1. 模态框状态管理导致的遮罩层问题
2. TypeScript 类型不匹配错误
3. 组件复杂度过高导致的稳定性问题

## 架构

### 问题分析

通过分析当前代码，发现以下主要问题：

1. **模态框状态管理问题**
   - `filePreview.previewModalVisible` 可能在初始化时状态异常
   - 模态框的 `v-model:open` 绑定可能导致状态同步问题

2. **TypeScript 类型错误**
   - `emit` 函数类型与 `CustomUploadEmits` 不匹配
   - 事件处理函数的参数类型定义不正确

3. **组件复杂度问题**
   - 过多的 hooks 和 composables 增加了调试难度
   - 状态管理分散在多个文件中

### 解决方案架构

采用渐进式修复策略：

1. **第一阶段：简化组件**
   - 暂时移除预览功能，专注于基础上传功能
   - 简化状态管理，减少 hooks 依赖

2. **第二阶段：修复类型错误**
   - 重新定义 emit 类型
   - 修复事件处理函数的类型定义

3. **第三阶段：恢复完整功能**
   - 重新实现预览功能，确保状态管理正确
   - 添加完整的测试用例

## 组件和接口

### 简化版 Upload 组件

```typescript
interface SimpleUploadProps {
  // 基础属性
  dragUpload?: boolean
  multiple?: boolean
  accept?: string
  disabled?: boolean
  action?: string
  
  // 简化的验证
  maxSize?: number
  maxCount?: number
  
  // 事件处理
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  customRequest?: (options: any) => void
}

interface SimpleUploadEmits {
  change: (info: { file: UploadFile; fileList: UploadFile[] }) => void
  success: (file: UploadFile, response: any) => void
  error: (file: UploadFile, error: Error) => void
}
```

### 状态管理简化

```typescript
// 移除复杂的 hooks，使用简单的 ref 管理状态
const fileList = ref<UploadFile[]>([])
const uploading = ref(false)

// 简化的事件处理
const handleChange = (info: UploadChangeParam) => {
  fileList.value = info.fileList
  emit('change', info)
}
```

## 数据模型

### 文件状态模型

```typescript
interface FileState {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  percent?: number
  response?: any
  error?: Error
}
```

## 错误处理

### 类型错误处理

1. **Emit 类型修复**
   - 使用正确的 Vue 3 emit 类型定义
   - 确保事件名称和参数类型匹配

2. **事件处理函数类型**
   - 为所有事件处理函数添加正确的类型注解
   - 使用 `any` 类型作为临时解决方案，后续优化

### 运行时错误处理

1. **模态框状态错误**
   - 添加状态重置机制
   - 确保模态框关闭时完全清理状态

2. **上传错误处理**
   - 添加网络错误重试机制
   - 提供用户友好的错误提示

## 测试策略

### 单元测试

1. **基础上传功能测试**
   - 文件选择和上传流程
   - 上传进度显示
   - 成功和失败状态处理

2. **拖拽上传测试**
   - 拖拽事件处理
   - 文件类型验证
   - 多文件上传

### 集成测试

1. **Storybook 测试**
   - 确保所有 Story 正常显示
   - 验证交互功能正常
   - 检查无遮罩层问题

2. **类型检查测试**
   - TypeScript 编译通过
   - 类型推断正确
   - 无类型错误警告

## 实施计划

### 阶段 1：紧急修复（立即执行）
- 移除导致蒙层的模态框
- 修复 TypeScript 类型错误
- 确保基础上传功能正常

### 阶段 2：功能恢复（后续优化）
- 重新实现预览功能
- 添加完整的验证机制
- 优化用户体验

### 阶段 3：测试和文档（最终完善）
- 添加完整的测试用例
- 更新 Storybook 文档
- 性能优化和代码重构