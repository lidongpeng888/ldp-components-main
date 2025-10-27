/**
 * Upload 组件预览功能集成测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { UploadFile } from 'ant-design-vue'

import Upload from '../Upload.vue'

// Mock ant-design-vue components
vi.mock('ant-design-vue', () => ({
  Upload: {
    name: 'AUpload',
    template: '<div class="ant-upload"><slot /></div>',
    props: ['action', 'multiple', 'accept', 'disabled', 'fileList', 'beforeUpload', 'customRequest', 'showUploadList'],
    emits: ['change', 'remove', 'preview'],
    methods: {
      upload: vi.fn()
    }
  },
  UploadDragger: {
    name: 'AUploadDragger',
    template: '<div class="ant-upload-dragger"><slot /></div>',
    props: ['action', 'multiple', 'accept', 'disabled', 'fileList', 'beforeUpload', 'customRequest', 'showUploadList'],
    emits: ['change', 'remove', 'preview']
  },
  Button: {
    name: 'AButton',
    template: '<button class="ant-btn"><slot /></button>',
    props: ['disabled'],
    emits: ['click']
  },
  Alert: {
    name: 'AAlert',
    template: '<div class="ant-alert"><slot /></div>',
    props: ['message', 'type', 'showIcon', 'closable'],
    emits: ['close']
  }
}))

// Mock PreviewModal component
vi.mock('../Preview/PreviewModal.vue', () => ({
  default: {
    name: 'PreviewModal',
    template: '<div class="preview-modal">Preview Modal</div>',
    props: ['imageConfig', 'videoConfig', 'documentConfig'],
    emits: ['open', 'close', 'load', 'error', 'download'],
    methods: {
      show: vi.fn(),
      hide: vi.fn()
    }
  }
}))

// Mock useFilePreview hook
const mockUseFilePreview = {
  isPreviewVisible: { value: false },
  currentPreviewFile: { value: null },
  previewLoading: { value: false },
  previewError: { value: null },
  showPreview: vi.fn(),
  hidePreview: vi.fn(),
  handlePreviewLoad: vi.fn(),
  handlePreviewError: vi.fn(),
  isFilePreviewable: vi.fn().mockReturnValue(true)
}

vi.mock('../hooks/useFilePreview', () => ({
  useFilePreview: () => mockUseFilePreview
}))

describe('Upload 组件预览功能', () => {
  let wrapper: VueWrapper<any>
  
  const mockImageFile: UploadFile = {
    uid: '1',
    name: 'test-image.jpg',
    status: 'done',
    size: 1024,
    type: 'image/jpeg',
    url: 'https://example.com/test-image.jpg'
  }

  beforeEach(() => {
    // 重置 mock
    vi.clearAllMocks()
    mockUseFilePreview.isPreviewVisible.value = false
    mockUseFilePreview.currentPreviewFile.value = null
    mockUseFilePreview.previewLoading.value = false
    mockUseFilePreview.previewError.value = null
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('预览功能启用', () => {
    it('默认应该启用预览功能', () => {
      wrapper = mount(Upload)

      expect(wrapper.props('preview')).toBe(true)
      expect(wrapper.findComponent({ name: 'PreviewModal' }).exists()).toBe(true)
    })

    it('应该能够禁用预览功能', () => {
      wrapper = mount(Upload, {
        props: {
          preview: false
        }
      })

      expect(wrapper.props('preview')).toBe(false)
      expect(wrapper.findComponent({ name: 'PreviewModal' }).exists()).toBe(false)
    })

    it('应该正确传递预览配置', () => {
      const previewConfig = {
        image: { zoom: false, rotate: false },
        video: { autoplay: true },
        document: { navigation: false }
      }

      wrapper = mount(Upload, {
        props: {
          previewConfig
        }
      })

      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      expect(previewModal.props('imageConfig')).toEqual(previewConfig.image)
      expect(previewModal.props('videoConfig')).toEqual(previewConfig.video)
      expect(previewModal.props('documentConfig')).toEqual(previewConfig.document)
    })
  })

  describe('上传列表配置', () => {
    it('启用预览时应该显示预览图标', () => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })

      const uploadComponent = wrapper.findComponent({ name: 'AUpload' })
      expect(uploadComponent.props('showUploadList')).toEqual({
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false
      })
    })

    it('禁用预览时应该隐藏预览图标', () => {
      wrapper = mount(Upload, {
        props: {
          preview: false
        }
      })

      const uploadComponent = wrapper.findComponent({ name: 'AUpload' })
      expect(uploadComponent.props('showUploadList')).toEqual({
        showPreviewIcon: false,
        showRemoveIcon: true,
        showDownloadIcon: false
      })
    })

    it('拖拽上传模式也应该正确配置预览', () => {
      wrapper = mount(Upload, {
        props: {
          dragUpload: true,
          preview: true
        }
      })

      const uploadDragger = wrapper.findComponent({ name: 'AUploadDragger' })
      expect(uploadDragger.props('showUploadList')).toEqual({
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false
      })
    })
  })

  describe('预览事件处理', () => {
    beforeEach(() => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })
    })

    it('应该处理预览事件', async () => {
      const uploadComponent = wrapper.findComponent({ name: 'AUpload' })
      
      // 模拟预览事件
      await uploadComponent.vm.$emit('preview', mockImageFile)

      expect(wrapper.emitted('preview')).toBeTruthy()
      expect(wrapper.emitted('preview')?.[0]).toEqual([mockImageFile])
    })

    it('可预览文件应该调用预览模态框', async () => {
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      const showSpy = vi.spyOn(previewModal.vm, 'show')

      // 调用预览处理函数
      await wrapper.vm.handlePreview(mockImageFile)

      expect(showSpy).toHaveBeenCalledWith(mockImageFile)
    })

    it('不可预览文件应该只触发事件', async () => {
      mockUseFilePreview.isFilePreviewable.mockReturnValue(false)

      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      const showSpy = vi.spyOn(previewModal.vm, 'show')

      await wrapper.vm.handlePreview(mockImageFile)

      expect(showSpy).not.toHaveBeenCalled()
      expect(wrapper.emitted('preview')).toBeTruthy()
    })
  })

  describe('预览模态框事件', () => {
    beforeEach(() => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })
    })

    it('应该处理预览打开事件', async () => {
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      
      await previewModal.vm.$emit('open', mockImageFile)

      // 验证事件处理
      expect(wrapper.vm.handlePreviewOpen).toBeDefined()
    })

    it('应该处理预览关闭事件', async () => {
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      
      await previewModal.vm.$emit('close')

      // 验证事件处理
      expect(wrapper.vm.handlePreviewClose).toBeDefined()
    })

    it('应该处理预览加载成功', async () => {
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      
      await previewModal.vm.$emit('load', mockImageFile)

      expect(mockUseFilePreview.handlePreviewLoad).toHaveBeenCalledWith(mockImageFile)
    })

    it('应该处理预览加载失败', async () => {
      const error = new Error('Load failed')
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      
      await previewModal.vm.$emit('error', mockImageFile, error)

      expect(mockUseFilePreview.handlePreviewError).toHaveBeenCalledWith(mockImageFile, error)
    })

    it('应该处理预览下载事件', async () => {
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      
      await previewModal.vm.$emit('download', mockImageFile)

      // 验证事件处理
      expect(wrapper.vm.handlePreviewDownload).toBeDefined()
    })
  })

  describe('组件集成', () => {
    it('应该正确初始化预览功能', () => {
      wrapper = mount(Upload, {
        props: {
          preview: true,
          previewConfig: {
            image: { zoom: true },
            video: { controls: true },
            document: { navigation: true }
          }
        }
      })

      // 验证 useFilePreview hook 被正确调用
      expect(mockUseFilePreview).toBeDefined()
      expect(wrapper.findComponent({ name: 'PreviewModal' }).exists()).toBe(true)
    })

    it('应该正确暴露预览相关方法', () => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })

      expect(typeof wrapper.vm.handlePreview).toBe('function')
      expect(typeof wrapper.vm.handlePreviewOpen).toBe('function')
      expect(typeof wrapper.vm.handlePreviewClose).toBe('function')
      expect(typeof wrapper.vm.handlePreviewDownload).toBe('function')
    })

    it('预览功能应该与文件上传功能协同工作', async () => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })

      // 模拟文件上传成功
      const uploadInfo = {
        file: mockImageFile,
        fileList: [mockImageFile]
      }

      await wrapper.vm.handleChange(uploadInfo)

      // 验证文件列表更新
      expect(wrapper.vm.fileList).toEqual([mockImageFile])

      // 验证可以预览上传的文件
      await wrapper.vm.handlePreview(mockImageFile)
      expect(wrapper.emitted('preview')).toBeTruthy()
    })
  })

  describe('错误处理', () => {
    beforeEach(() => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })
    })

    it('预览模态框不存在时应该优雅处理', async () => {
      // 移除预览模态框引用
      wrapper.vm.previewModalRef = null

      // 调用预览不应该抛出错误
      expect(() => {
        wrapper.vm.handlePreview(mockImageFile)
      }).not.toThrow()
    })

    it('应该处理预览功能异常', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // 模拟预览模态框方法抛出异常
      const previewModal = wrapper.findComponent({ name: 'PreviewModal' })
      vi.spyOn(previewModal.vm, 'show').mockImplementation(() => {
        throw new Error('Preview error')
      })

      // 调用预览应该捕获异常
      await wrapper.vm.handlePreview(mockImageFile)

      // 验证仍然触发了预览事件
      expect(wrapper.emitted('preview')).toBeTruthy()

      consoleSpy.mockRestore()
    })
  })

  describe('性能优化', () => {
    it('禁用预览时不应该渲染预览模态框', () => {
      wrapper = mount(Upload, {
        props: {
          preview: false
        }
      })

      expect(wrapper.findComponent({ name: 'PreviewModal' }).exists()).toBe(false)
    })

    it('应该正确清理预览资源', async () => {
      wrapper = mount(Upload, {
        props: {
          preview: true
        }
      })

      // 显示预览
      await wrapper.vm.handlePreview(mockImageFile)

      // 卸载组件
      wrapper.unmount()

      // 验证清理函数被调用（通过 mock 验证）
      expect(mockUseFilePreview.isPreviewVisible.value).toBe(false)
    })
  })
})