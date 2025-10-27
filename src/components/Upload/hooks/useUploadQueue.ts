/**
 * 上传队列管理 Hook
 */

import { ref, computed } from 'vue'
import type { UploadFile } from 'ant-design-vue'
import type { UploadProgress, UploadError } from '../types'
import { calculateUploadSpeed } from '../utils'

export function useUploadQueue(concurrent: number, retryCount: number) {
  // 上传队列管理
  const uploadQueue = ref<UploadFile[]>([])
  const currentUploading = ref<Set<string>>(new Set())
  const uploadingFiles = ref<Map<string, { startTime: number; loaded: number; retryCount: number }>>(new Map())

  // 开始上传文件
  const startUpload = (
    file: UploadFile, 
    callbacks: { onProgress: Function; onSuccess: Function; onError: Function },
    customRequest?: Function,
    emit?: Function
  ) => {
    const { onProgress, onSuccess, onError } = callbacks
    
    // 添加到当前上传列表
    currentUploading.value.add(file.uid)
    
    // 记录上传开始时间
    uploadingFiles.value.set(file.uid, {
      startTime: Date.now(),
      loaded: 0,
      retryCount: 0
    })
    
    // 如果用户提供了自定义请求处理
    if (customRequest) {
      const customOptions = {
        file,
        onProgress: (event: ProgressEvent) => {
          const uploadInfo = uploadingFiles.value.get(file.uid)
          if (uploadInfo) {
            uploadInfo.loaded = event.loaded
            const speed = calculateUploadSpeed(event.loaded, uploadInfo.startTime)
            
            const progress: UploadProgress = {
              file,
              percent: Math.round((event.loaded / event.total!) * 100),
              loaded: event.loaded,
              total: event.total!,
              speed
            }
            
            emit?.('progress', progress)
            onProgress(event)
          }
        },
        onSuccess: (response: any) => {
          finishUpload(file.uid, true)
          emit?.('success', file, response)
          onSuccess(response)
          processQueue()
        },
        onError: (error: Error) => {
          const uploadInfo = uploadingFiles.value.get(file.uid)
          if (uploadInfo && uploadInfo.retryCount < retryCount) {
            // 重试上传
            retryUpload(file, callbacks, customRequest, emit)
          } else {
            finishUpload(file.uid, false)
            const uploadError: UploadError = {
              file,
              error,
              retryable: uploadInfo ? uploadInfo.retryCount < retryCount : false
            }
            emit?.('error', uploadError)
            onError(error)
            processQueue()
          }
        }
      }
      
      customRequest(customOptions)
    } else {
      // 默认的上传处理 (模拟上传过程)
      simulateUpload(file, callbacks, emit)
    }
  }

  // 模拟上传过程
  const simulateUpload = (
    file: UploadFile, 
    callbacks: { onProgress: Function; onSuccess: Function; onError: Function },
    emit?: Function
  ) => {
    const { onProgress, onSuccess } = callbacks
    let loaded = 0
    const total = file.size || 1024 * 1024 // 默认 1MB
    const uploadInfo = uploadingFiles.value.get(file.uid)!
    
    const uploadStep = () => {
      // 模拟网络波动和上传速度
      const increment = Math.random() * 1024 * 50 + 1024 * 10 // 10KB-60KB per step
      loaded = Math.min(loaded + increment, total)
      
      if (loaded >= total) {
        finishUpload(file.uid, true)
        emit?.('success', file, { status: 'success' })
        onSuccess({ status: 'success' })
        processQueue()
        return
      }
      
      const speed = calculateUploadSpeed(loaded, uploadInfo.startTime)
      const progress: UploadProgress = {
        file,
        percent: Math.round((loaded / total) * 100),
        loaded,
        total,
        speed
      }
      
      emit?.('progress', progress)
      onProgress({ loaded, total })
      
      // 模拟网络延迟
      const delay = Math.random() * 100 + 50 // 50-150ms
      setTimeout(uploadStep, delay)
    }
    
    setTimeout(uploadStep, 100)
  }

  // 重试上传
  const retryUpload = (
    file: UploadFile, 
    callbacks: { onProgress: Function; onSuccess: Function; onError: Function },
    customRequest?: Function,
    emit?: Function
  ) => {
    const uploadInfo = uploadingFiles.value.get(file.uid)
    if (uploadInfo) {
      uploadInfo.retryCount++
      uploadInfo.startTime = Date.now()
      uploadInfo.loaded = 0
      
      // 延迟重试
      setTimeout(() => {
        startUpload(file, callbacks, customRequest, emit)
      }, 1000 * uploadInfo.retryCount) // 递增延迟
    }
  }

  // 完成上传
  const finishUpload = (fileId: string, success: boolean) => {
    currentUploading.value.delete(fileId)
    if (success) {
      uploadingFiles.value.delete(fileId)
    }
  }

  // 处理上传队列
  const processQueue = () => {
    while (uploadQueue.value.length > 0 && currentUploading.value.size < concurrent) {
      const nextFile = uploadQueue.value.shift()
      if (nextFile) {
        // 这里需要重新触发上传，但需要在调用处实现具体逻辑
      }
    }
  }

  // 检查并发限制
  const checkConcurrentLimit = (file: UploadFile) => {
    if (currentUploading.value.size >= concurrent) {
      // 添加到队列等待
      uploadQueue.value.push(file)
      return false
    }
    return true
  }

  // 清理上传状态
  const clearUploadState = () => {
    uploadingFiles.value.clear()
    uploadQueue.value = []
    currentUploading.value.clear()
  }

  return {
    uploadQueue,
    currentUploading,
    uploadingFiles,
    startUpload,
    simulateUpload,
    retryUpload,
    finishUpload,
    processQueue,
    checkConcurrentLimit,
    clearUploadState
  }
}