/**
 * PreviewModal 组件测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { UploadFile } from 'ant-design-vue'

import PreviewModal from '../PreviewModal.vue'

// Mock ant-design-vue components
vi.mock('ant-design-vue', () => ({
  Modal: {
    name: 'AModal',
    template: '<div class="ant-modal"><slot /></div>',
    props: ['open', 'title', 'width', 'footer', 'centered', 'destroyOnClose', 'maskClosable'],
    emits: ['cancel']
  },
  Spin: {
    name: 'ASpin',
    template: '<div class="ant-spin"><slot /></div>',
    props: ['size']
  },
  Result: {
    name: 'AResult',
    template: '<div class="ant-result"><slot name="extra" /></div>',
    props: ['status', 'title', 'subTitle']
  },
  Button: {
    name: 'AButton',
    template: '<button class="ant-btn"><slot /></button>',
    props: ['type', 'disabled'],
    emits: ['click']
  }
}))

// Mock FilePreview component
vi.mock('../FilePreview.vue', () => ({
  default: {
    name: 'FilePreview',
    template: '<div class="file-preview">File Preview</div>',
    props: ['file', 'mode', 'width', 'height', 'imageConfig', 'videoConfig', 'documentConfig'],
    emits: ['load', 'error', 'click']
  }
}))

// Mock utils
vi.mock('../../utils', () => ({
  formatFileSize: (size: number) => `${size} bytes`
}))

describe('PreviewModal', () => {
  let wrapper: VueWrapper<any>
  
  const mockFile: UploadFile = {
    uid: '1',
    name: 'test-image.jpg',
    status: 'done',
    size: 1024,
    type: 'image/jpeg',
    url: 'https://example.com/test-image.jpg'
  }

  beforeEach(() => {
    wrapper = mount(PreviewModal, {
      props: {
        width: '80%',
        height: '80vh'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('基础功能', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.file-preview-modal').exists()).toBe(true)
    })

    it('初始状态应该是隐藏的', () => {
      expect(wrapper.vm.visible).toBe(false)
      expect(wrapper.vm.currentFile).toBeUndefined()
    })

    it('应该正确设置默认配置', () => {
      expect(wrapper.props('width')).toBe('80%')
      expect(wrapper.props('height')).toBe('80vh')
      expect(wrapper.props('imageConfig')).toEqual({
        thumbnail: false,
        fullscreen: true,
        zoom: true,
        rotate: true,
        loading: 'eager'
      })
    })
  })

  describe('显示和隐藏', () => {
    it('应该能够显示预览模态框', async () => {
      // 调用 show 方法
      wrapper.vm.show(mockFile)
      await nextTick()

      expect(wrapper.vm.visible).toBe(true)
      expect(wrapper.vm.currentFile).toEqual(mockFile)
      expect(wrapper.emitted('open')).toBeTruthy()
      expect(wrapper.emitted('open')?.[0]).toEqual([mockFile])
    })

    it('应该能够隐藏预览模态框', async () => {
      // 先显示
      wrapper.vm.show(mockFile)
      await nextTick()

      // 再隐藏
      wrapper.vm.hide()
      await nextTick()

      expect(wrapper.vm.visible).toBe(false)
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('关闭时应该延迟清理状态', async () => {
      // 显示预览
      wrapper.vm.show(mockFile)
      await nextTick()

      // 关闭预览
      wrapper.vm.hide()
      await nextTick()

      // 立即检查，状态还未清理
      expect(wrapper.vm.currentFile).toEqual(mockFile)

      // 等待清理延迟
      await new Promise(resolve => setTimeout(resolve, 350))

      expect(wrapper.vm.currentFile).toBeUndefined()
    })
  })

  describe('计算属性', () => {
    it('应该正确计算模态框标题', async () => {
      wrapper.vm.show(mockFile)
      await nextTick()

      expect(wrapper.vm.modalTitle).toBe('test-image.jpg')
    })

    it('没有文件时应该显示默认标题', () => {
      expect(wrapper.vm.modalTitle).toBe('文件预览')
    })

    it('应该正确计算模态框宽度', () => {
      expect(wrapper.vm.modalWidth).toBe('80%')
    })

    it('数字宽度应该转换为像素', async () => {
      await wrapper.setProps({ width: 800 })
      expect(wrapper.vm.modalWidth).toBe('800px')
    })

    it('应该正确计算预览区域尺寸', () => {
      expect(wrapper.vm.previewWidth).toBe('100%')
      expect(wrapper.vm.previewHeight).toBe('calc(80vh - 120px)')
    })
  })

  describe('事件处理', () => {
    it('应该处理预览加载成功', async () => {
      wrapper.vm.show(mockFile)
      await nextTick()

      wrapper.vm.handlePreviewLoad(mockFile)

      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBeNull()
      expect(wrapper.emitted('load')).toBeTruthy()
      expect(wrapper.emitted('load')?.[0]).toEqual([mockFile])
    })

    it('应该处理预览加载失败', async () => {
      const error = new Error('Load failed')
      wrapper.vm.show(mockFile)
      await nextTick()

      wrapper.vm.handlePreviewError(mockFile, error)

      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBe(error)
      expect(wrapper.emitted('error')).toBeTruthy()
      expect(wrapper.emitted('error')?.[0]).toEqual([mockFile, error])
    })

    it('应该处理重试预览', async () => {
      const error = new Error('Load failed')
      wrapper.vm.show(mockFile)
      wrapper.vm.handlePreviewError(mockFile, error)
      await nextTick()

      wrapper.vm.retryPreview()

      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.vm.error).toBeNull()
    })

    it('应该处理文件下载', async () => {
      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      }
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)

      wrapper.vm.show(mockFile)
      await nextTick()

      wrapper.vm.downloadFile()

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe(mockFile.url)
      expect(mockLink.download).toBe(mockFile.name)
      expect(mockLink.click).toHaveBeenCalled()
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink)
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink)
      expect(wrapper.emitted('download')).toBeTruthy()
      expect(wrapper.emitted('download')?.[0]).toEqual([mockFile])

      // Cleanup
      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })

  describe('状态管理', () => {
    it('文件变化时应该重置状态', async () => {
      const file1: UploadFile = { ...mockFile, uid: '1', name: 'file1.jpg' }
      const file2: UploadFile = { ...mockFile, uid: '2', name: 'file2.jpg' }

      // 显示第一个文件
      wrapper.vm.show(file1)
      await nextTick()

      // 设置错误状态
      wrapper.vm.handlePreviewError(file1, new Error('Test error'))

      // 切换到第二个文件
      wrapper.vm.show(file2)
      await nextTick()

      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.vm.error).toBeNull()
      expect(wrapper.vm.currentFile).toEqual(file2)
    })

    it('应该正确暴露组件方法', () => {
      expect(typeof wrapper.vm.show).toBe('function')
      expect(typeof wrapper.vm.hide).toBe('function')
      expect(wrapper.vm.currentFile).toBeUndefined()
      expect(wrapper.vm.visible).toBe(false)
    })
  })

  describe('响应式设计', () => {
    it('应该在移动端正确显示', async () => {
      // 模拟移动端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      })

      wrapper = mount(PreviewModal, {
        props: {
          width: '95%'
        }
      })

      expect(wrapper.vm.modalWidth).toBe('95%')
    })
  })

  describe('错误边界', () => {
    it('没有文件URL时下载应该不执行', () => {
      const fileWithoutUrl: UploadFile = {
        ...mockFile,
        url: undefined
      }

      wrapper.vm.show(fileWithoutUrl)
      wrapper.vm.downloadFile()

      expect(wrapper.emitted('download')).toBeFalsy()
    })

    it('重试时没有当前文件应该不执行', () => {
      wrapper.vm.retryPreview()

      expect(wrapper.vm.loading).toBe(false)
    })
  })
})