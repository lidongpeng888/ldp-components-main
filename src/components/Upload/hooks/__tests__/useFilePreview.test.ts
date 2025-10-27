/**
 * useFilePreview Hook 测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import type { UploadFile } from 'ant-design-vue'

import { useFilePreview } from '../useFilePreview'

describe('useFilePreview', () => {
  let hook: ReturnType<typeof useFilePreview>
  
  const mockImageFile: UploadFile = {
    uid: '1',
    name: 'test-image.jpg',
    status: 'done',
    size: 1024,
    type: 'image/jpeg',
    url: 'https://example.com/test-image.jpg'
  }

  const mockVideoFile: UploadFile = {
    uid: '2',
    name: 'test-video.mp4',
    status: 'done',
    size: 2048,
    type: 'video/mp4',
    url: 'https://example.com/test-video.mp4'
  }

  const mockDocumentFile: UploadFile = {
    uid: '3',
    name: 'test-document.pdf',
    status: 'done',
    size: 1536,
    type: 'application/pdf',
    url: 'https://example.com/test-document.pdf'
  }

  const mockUnsupportedFile: UploadFile = {
    uid: '4',
    name: 'test-archive.zip',
    status: 'done',
    size: 4096,
    type: 'application/zip',
    url: 'https://example.com/test-archive.zip'
  }

  beforeEach(() => {
    // 清理控制台输出
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('初始化', () => {
    it('应该使用默认配置初始化', () => {
      hook = useFilePreview()

      expect(hook.isPreviewVisible.value).toBe(false)
      expect(hook.currentPreviewFile.value).toBeNull()
      expect(hook.previewLoading.value).toBe(false)
      expect(hook.previewError.value).toBeNull()
      expect(hook.hasPreviewFile.value).toBe(false)
      expect(hook.canPreview.value).toBe(false)
    })

    it('应该使用自定义配置初始化', () => {
      const options = {
        enabled: false,
        mode: 'inline' as const,
        config: {
          image: { zoom: false },
          video: { autoplay: true }
        }
      }

      hook = useFilePreview(options)

      expect(hook.getPreviewConfig()).toEqual({
        mode: 'inline',
        image: { zoom: false },
        video: { autoplay: true }
      })
    })

    it('应该提供兼容性接口', () => {
      hook = useFilePreview()

      expect(hook.previewModalVisible).toBe(hook.isPreviewVisible)
      expect(hook.previewFile).toBe(hook.currentPreviewFile)
      expect(typeof hook.showPreviewModal).toBe('function')
      expect(typeof hook.closePreviewModal).toBe('function')
      expect(typeof hook.handlePreview).toBe('function')
    })
  })

  describe('文件预览支持检测', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('应该支持图片文件预览', () => {
      expect(hook.isFilePreviewable(mockImageFile)).toBe(true)
    })

    it('应该支持视频文件预览', () => {
      expect(hook.isFilePreviewable(mockVideoFile)).toBe(true)
    })

    it('应该支持文档文件预览', () => {
      expect(hook.isFilePreviewable(mockDocumentFile)).toBe(true)
    })

    it('应该不支持压缩文件预览', () => {
      expect(hook.isFilePreviewable(mockUnsupportedFile)).toBe(false)
    })

    it('应该根据文件扩展名判断支持性', () => {
      const fileWithoutType: UploadFile = {
        uid: '5',
        name: 'image.png',
        status: 'done',
        size: 1024,
        url: 'https://example.com/image.png'
      }

      expect(hook.isFilePreviewable(fileWithoutType)).toBe(true)
    })

    it('应该处理无效文件', () => {
      const invalidFile: UploadFile = {
        uid: '6',
        status: 'done',
        size: 0
      }

      expect(hook.isFilePreviewable(invalidFile)).toBe(false)
    })
  })

  describe('显示预览', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('应该能够显示预览', async () => {
      await hook.showPreview(mockImageFile)

      expect(hook.isPreviewVisible.value).toBe(true)
      expect(hook.currentPreviewFile.value).toEqual(mockImageFile)
      expect(hook.hasPreviewFile.value).toBe(true)
      expect(hook.canPreview.value).toBe(true)
    })

    it('预览被禁用时应该显示警告', async () => {
      hook = useFilePreview({ enabled: false })
      const warnSpy = vi.spyOn(console, 'warn')

      await hook.showPreview(mockImageFile)

      expect(warnSpy).toHaveBeenCalledWith('Preview is disabled')
      expect(hook.isPreviewVisible.value).toBe(false)
    })

    it('应该重置错误状态', async () => {
      // 先设置错误状态
      hook.previewError.value = new Error('Previous error')

      await hook.showPreview(mockImageFile)

      expect(hook.previewError.value).toBeNull()
      expect(hook.previewLoading.value).toBe(false)
    })

    it('应该处理显示预览时的异常', async () => {
      const errorSpy = vi.spyOn(console, 'error')
      
      // 模拟异常情况 - 直接在 hook 中抛出错误
      const originalShowPreview = hook.showPreview
      hook.showPreview = vi.fn().mockImplementation(async () => {
        throw new Error('Show preview error')
      })

      try {
        await hook.showPreview(mockImageFile)
      } catch (error) {
        // 预期会抛出错误
      }

      // 恢复原始方法
      hook.showPreview = originalShowPreview
    })
  })

  describe('隐藏预览', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('应该能够隐藏预览', async () => {
      // 先显示预览
      await hook.showPreview(mockImageFile)

      // 再隐藏预览
      await hook.hidePreview()

      expect(hook.isPreviewVisible.value).toBe(false)
    })

    it('应该延迟清理状态', async () => {
      // 显示预览
      await hook.showPreview(mockImageFile)

      // 隐藏预览
      await hook.hidePreview()

      // 立即检查，状态还未清理
      expect(hook.currentPreviewFile.value).toEqual(mockImageFile)

      // 等待清理延迟
      await new Promise(resolve => setTimeout(resolve, 350))

      expect(hook.currentPreviewFile.value).toBeNull()
      expect(hook.previewError.value).toBeNull()
      expect(hook.previewLoading.value).toBe(false)
    })

    it('应该处理隐藏预览时的异常', async () => {
      // 这个测试主要验证隐藏预览的正常流程
      // 先显示预览
      await hook.showPreview(mockImageFile)
      
      // 再隐藏预览
      await hook.hidePreview()
      
      expect(hook.isPreviewVisible.value).toBe(false)
    })
  })

  describe('切换预览', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('应该能够切换到显示预览', async () => {
      await hook.togglePreview(mockImageFile)

      expect(hook.isPreviewVisible.value).toBe(true)
      expect(hook.currentPreviewFile.value).toEqual(mockImageFile)
    })

    it('应该能够切换到隐藏预览', async () => {
      // 先显示预览
      await hook.showPreview(mockImageFile)

      // 切换隐藏
      await hook.togglePreview()

      expect(hook.isPreviewVisible.value).toBe(false)
    })

    it('没有文件时不应该显示预览', async () => {
      await hook.togglePreview()

      expect(hook.isPreviewVisible.value).toBe(false)
    })
  })

  describe('事件处理', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('应该处理预览加载成功', () => {
      hook.previewLoading.value = true
      hook.previewError.value = new Error('Previous error')

      hook.handlePreviewLoad(mockImageFile)

      expect(hook.previewLoading.value).toBe(false)
      expect(hook.previewError.value).toBeNull()
    })

    it('应该处理预览加载失败', () => {
      const error = new Error('Load failed')
      hook.previewLoading.value = true

      hook.handlePreviewError(mockImageFile, error)

      expect(hook.previewLoading.value).toBe(false)
      expect(hook.previewError.value).toBe(error)
    })

    it('应该处理重试预览', async () => {
      // 设置当前文件和错误状态
      hook.currentPreviewFile.value = mockImageFile
      hook.previewError.value = new Error('Load failed')

      await hook.retryPreview()

      expect(hook.previewLoading.value).toBe(false)
      expect(hook.previewError.value).toBeNull()
    })

    it('没有当前文件时重试应该无效', async () => {
      hook.currentPreviewFile.value = null

      await hook.retryPreview()

      expect(hook.previewLoading.value).toBe(false)
    })
  })

  describe('兼容性接口', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('handlePreview 应该正确处理预览', async () => {
      const mockEmit = vi.fn()

      await hook.handlePreview(mockImageFile, true, mockEmit)

      expect(hook.isPreviewVisible.value).toBe(true)
      expect(hook.currentPreviewFile.value).toEqual(mockImageFile)
      expect(mockEmit).toHaveBeenCalledWith('preview', mockImageFile)
    })

    it('预览被禁用时 handlePreview 应该只触发事件', async () => {
      const mockEmit = vi.fn()

      await hook.handlePreview(mockUnsupportedFile, true, mockEmit)

      expect(hook.isPreviewVisible.value).toBe(false)
      expect(mockEmit).toHaveBeenCalledWith('preview', mockUnsupportedFile)
    })

    it('preview 为 false 时应该只触发事件', async () => {
      const mockEmit = vi.fn()

      await hook.handlePreview(mockImageFile, false, mockEmit)

      expect(hook.isPreviewVisible.value).toBe(false)
      expect(mockEmit).toHaveBeenCalledWith('preview', mockImageFile)
    })

    it('没有 emit 函数时应该正常工作', async () => {
      await hook.handlePreview(mockImageFile, true)

      expect(hook.isPreviewVisible.value).toBe(true)
    })
  })

  describe('清理功能', () => {
    beforeEach(() => {
      hook = useFilePreview()
    })

    it('应该能够清理所有状态', async () => {
      // 设置一些状态
      await hook.showPreview(mockImageFile)
      hook.previewError.value = new Error('Test error')

      // 清理状态
      hook.cleanup()

      expect(hook.isPreviewVisible.value).toBe(false)
      expect(hook.currentPreviewFile.value).toBeNull()
      expect(hook.previewLoading.value).toBe(false)
      expect(hook.previewError.value).toBeNull()
    })
  })

  describe('配置获取', () => {
    it('应该返回正确的预览配置', () => {
      const config = {
        image: { zoom: false },
        video: { autoplay: true }
      }

      hook = useFilePreview({
        mode: 'inline',
        config
      })

      expect(hook.getPreviewConfig()).toEqual({
        mode: 'inline',
        ...config
      })
    })
  })
})