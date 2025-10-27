/**
 * FilePreview 组件单元测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FilePreview from '../FilePreview.vue'
import type { UploadFile } from 'ant-design-vue'

// Mock ant-design-vue components
vi.mock('ant-design-vue', () => ({
  Button: {
    name: 'AButton',
    template: '<button class="ant-btn"><slot /></button>',
    props: ['type', 'size']
  }
}))

// Mock @ant-design/icons-vue
vi.mock('@ant-design/icons-vue', () => ({
  FileOutlined: { name: 'FileOutlined', template: '<span>📄</span>' },
  DownloadOutlined: { name: 'DownloadOutlined', template: '<span>⬇️</span>' }
}))

// Mock preview components
vi.mock('../ImagePreview.vue', () => ({
  default: {
    name: 'ImagePreview',
    template: '<div class="image-preview">Image Preview</div>',
    props: ['file', 'mode', 'width', 'height', 'lazy'],
    emits: ['load', 'error', 'click', 'fullscreen']
  }
}))

vi.mock('../VideoPreview.vue', () => ({
  default: {
    name: 'VideoPreview',
    template: '<div class="video-preview">Video Preview</div>',
    props: ['file', 'mode', 'width', 'height', 'lazy'],
    emits: ['load', 'error', 'click', 'fullscreen']
  }
}))

vi.mock('../DocumentPreview.vue', () => ({
  default: {
    name: 'DocumentPreview',
    template: '<div class="document-preview">Document Preview</div>',
    props: ['file', 'mode', 'width', 'height', 'lazy'],
    emits: ['load', 'error', 'click', 'fullscreen']
  }
}))

// Mock utils
vi.mock('../../utils', () => ({
  isImageFile: vi.fn(),
  isVideoFile: vi.fn(),
  isDocumentFile: vi.fn(),
  formatFileSize: vi.fn(() => '1.5 MB'),
  getFileType: vi.fn(() => 'other')
}))

describe('FilePreview', () => {
  let wrapper: any
  
  const mockImageFile: UploadFile = {
    uid: '1',
    name: 'test-image.jpg',
    status: 'done',
    type: 'image/jpeg',
    size: 1024 * 1024,
    url: 'https://example.com/image.jpg',
    originFileObj: new File([''], 'test-image.jpg', { type: 'image/jpeg' })
  }
  
  const mockVideoFile: UploadFile = {
    uid: '2',
    name: 'test-video.mp4',
    status: 'done',
    type: 'video/mp4',
    size: 1024 * 1024 * 10,
    url: 'https://example.com/video.mp4',
    originFileObj: new File([''], 'test-video.mp4', { type: 'video/mp4' })
  }
  
  const mockDocumentFile: UploadFile = {
    uid: '3',
    name: 'test-document.pdf',
    status: 'done',
    type: 'application/pdf',
    size: 1024 * 1024 * 2,
    url: 'https://example.com/document.pdf',
    originFileObj: new File([''], 'test-document.pdf', { type: 'application/pdf' })
  }
  
  const mockOtherFile: UploadFile = {
    uid: '4',
    name: 'test-file.txt',
    status: 'done',
    type: 'text/plain',
    size: 1024,
    url: 'https://example.com/file.txt',
    originFileObj: new File([''], 'test-file.txt', { type: 'text/plain' })
  }

  beforeEach(() => {
    wrapper = null
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders properly', () => {
    wrapper = mount(FilePreview, {
      props: {
        file: mockOtherFile
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.file-preview').exists()).toBe(true)
  })

  it('renders ImagePreview for image files', async () => {
    const { isImageFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(true)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockImageFile
      }
    })
    
    expect(wrapper.findComponent({ name: 'ImagePreview' }).exists()).toBe(true)
    expect(wrapper.find('.image-preview').exists()).toBe(true)
  })

  it('renders VideoPreview for video files', async () => {
    const { isImageFile, isVideoFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(false)
    vi.mocked(isVideoFile).mockReturnValue(true)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockVideoFile
      }
    })
    
    expect(wrapper.findComponent({ name: 'VideoPreview' }).exists()).toBe(true)
    expect(wrapper.find('.video-preview').exists()).toBe(true)
  })

  it('renders DocumentPreview for document files', async () => {
    const { isImageFile, isVideoFile, isDocumentFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(false)
    vi.mocked(isVideoFile).mockReturnValue(false)
    vi.mocked(isDocumentFile).mockReturnValue(true)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockDocumentFile
      }
    })
    
    expect(wrapper.findComponent({ name: 'DocumentPreview' }).exists()).toBe(true)
    expect(wrapper.find('.document-preview').exists()).toBe(true)
  })

  it('renders generic preview for other file types', async () => {
    const { isImageFile, isVideoFile, isDocumentFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(false)
    vi.mocked(isVideoFile).mockReturnValue(false)
    vi.mocked(isDocumentFile).mockReturnValue(false)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockOtherFile
      }
    })
    
    expect(wrapper.find('.generic-file-preview').exists()).toBe(true)
    expect(wrapper.find('.file-icon-container').exists()).toBe(true)
  })

  it('applies correct CSS classes based on file type', async () => {
    const { isImageFile, isVideoFile, isDocumentFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(true)
    vi.mocked(isVideoFile).mockReturnValue(false)
    vi.mocked(isDocumentFile).mockReturnValue(false)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockImageFile,
        mode: 'thumbnail'
      }
    })
    
    const previewElement = wrapper.find('.file-preview')
    expect(previewElement.classes()).toContain('file-preview--thumbnail')
    expect(previewElement.classes()).toContain('file-preview--image')
  })

  it('passes correct props to child components', async () => {
    const { isImageFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(true)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockImageFile,
        mode: 'inline',
        width: 300,
        height: 200,
        lazy: false
      }
    })
    
    const imagePreview = wrapper.findComponent({ name: 'ImagePreview' })
    expect(imagePreview.props('file')).toEqual(mockImageFile)
    expect(imagePreview.props('mode')).toBe('inline')
    expect(imagePreview.props('width')).toBe(300)
    expect(imagePreview.props('height')).toBe(200)
    expect(imagePreview.props('lazy')).toBe(false)
  })

  it('emits events from child components', async () => {
    const { isImageFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(true)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockImageFile
      }
    })
    
    const imagePreview = wrapper.findComponent({ name: 'ImagePreview' })
    
    // 模拟子组件事件
    await imagePreview.vm.$emit('load', mockImageFile)
    await imagePreview.vm.$emit('click', mockImageFile)
    await imagePreview.vm.$emit('fullscreen', mockImageFile, true)
    
    expect(wrapper.emitted('load')).toBeTruthy()
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('fullscreen')).toBeTruthy()
  })

  it('shows download button for generic files in inline mode', async () => {
    const { isImageFile, isVideoFile, isDocumentFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(false)
    vi.mocked(isVideoFile).mockReturnValue(false)
    vi.mocked(isDocumentFile).mockReturnValue(false)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockOtherFile,
        mode: 'inline'
      }
    })
    
    expect(wrapper.find('.file-actions').exists()).toBe(true)
    expect(wrapper.find('.ant-btn').exists()).toBe(true)
  })

  it('does not show download button for generic files in thumbnail mode', async () => {
    const { isImageFile, isVideoFile, isDocumentFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(false)
    vi.mocked(isVideoFile).mockReturnValue(false)
    vi.mocked(isDocumentFile).mockReturnValue(false)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockOtherFile,
        mode: 'thumbnail'
      }
    })
    
    expect(wrapper.find('.file-actions').exists()).toBe(false)
  })

  it('handles download functionality', async () => {
    const { isImageFile, isVideoFile, isDocumentFile } = await import('../../utils')
    vi.mocked(isImageFile).mockReturnValue(false)
    vi.mocked(isVideoFile).mockReturnValue(false)
    vi.mocked(isDocumentFile).mockReturnValue(false)
    
    // Mock document methods
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
    
    wrapper = mount(FilePreview, {
      props: {
        file: mockOtherFile,
        mode: 'inline'
      }
    })
    
    const downloadButton = wrapper.find('.ant-btn')
    await downloadButton.trigger('click')
    
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockLink.href).toBe(mockOtherFile.url)
    expect(mockLink.download).toBe(mockOtherFile.name)
    expect(mockLink.click).toHaveBeenCalled()
    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()
    
    // Cleanup
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})