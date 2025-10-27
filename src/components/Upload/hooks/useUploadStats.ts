/**
 * 上传统计信息 Hook
 */

import { computed } from 'vue'
import type { Ref } from 'vue'
import type { UploadFile } from 'ant-design-vue'

export function useUploadStats(fileList: Ref<UploadFile[]>) {
  // 上传统计信息
  const uploadStats = computed(() => {
    const total = fileList.value.length
    const uploading = fileList.value.filter(f => f.status === 'uploading').length
    const done = fileList.value.filter(f => f.status === 'done').length
    const error = fileList.value.filter(f => f.status === 'error').length
    
    return {
      total,
      uploading,
      done,
      error,
      progress: total > 0 ? Math.round((done / total) * 100) : 0
    }
  })

  // 是否有文件正在上传
  const isUploading = computed(() => uploadStats.value.uploading > 0)

  // 是否有失败的文件
  const hasErrors = computed(() => uploadStats.value.error > 0)

  return {
    uploadStats,
    isUploading,
    hasErrors
  }
}