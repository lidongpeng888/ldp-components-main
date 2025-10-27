/**
 * Upload 组件单元测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Upload from '../Upload.vue'
import type { FileValidationRule } from '../types'

// Mock ant-design-vue components
vi.mock('ant-design-vue', () => ({
  Upload: {
    name: 'AUpload',
    template: '<div class="ant-upload"><slot /></div>',
    props: ['fileList', 'beforeUpload', 'customRequest'],
    emits: ['change', 'preview', 'remove']
  },
  Button: {
    name: 'AButton',
    template: '<button class="ant-btn"><slot /></button>'
  },
  Alert: {
    name: 'AAlert',
    template: '<div class="ant-alert"><slot /></div>',
    props: ['message', 'type', 'showIcon', 'closable'],
    emits: ['close']
  }
}))

// Mock @ant-design/icons-vue
vi.mock('@ant-design/icons-vue', () => ({
  InboxOutlined: { name: 'InboxOutlined', template: '<span>📁</span>' },
  UploadOutlined: { name: 'UploadOutlined', template: '<span>⬆️</span>' }
}))

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useClipboard: () => ({
    copy: vi.fn(),
    isSupported: true
  })
}))

describe('Upload', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = null
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders properly', () => {
    wrapper = mount(Upload)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.custom-upload').exists()).toBe(true)
  })

  it('renders with default button when no slot provided', () => {
    wrapper = mount(Upload)
    expect(wrapper.find('.ant-btn').exists()).toBe(true)
  })

  it('renders drag area when dragUpload is true', () => {
    wrapper = mount(Upload, {
      props: {
        dragUpload: true
      }
    })
    
    expect(wrapper.find('.upload-drag-area').exists()).toBe(true)
    expect(wrapper.find('.upload-drag-content').exists()).toBe(true)
  })

  it('applies correct CSS classes', () => {
    wrapper = mount(Upload, {
      props: {
        dragUpload: true,
        pasteUpload: true,
        className: 'custom-class'
      }
    })
    
    const uploadElement = wrapper.find('.custom-upload')
    expect(uploadElement.classes()).toContain('custom-upload--drag')
    expect(uploadElement.classes()).toContain('custom-upload--paste')
    expect(uploadElement.classes()).toContain('custom-class')
  })

  it('passes correct props to a-upload', () => {
    const props = {
      multiple: true,
      accept: 'image/*',
      disabled: false,
      dragUpload: true
    }
    
    wrapper = mount(Upload, { props })
    
    const aUpload = wrapper.findComponent({ name: 'AUpload' })
    expect(aUpload.props('multiple')).toBe(true)
    expect(aUpload.props('accept')).toBe('image/*')
    expect(aUpload.props('disabled')).toBe(false)
    expect(aUpload.props('dragger')).toBe(true)
  })

  it('handles file validation correctly', async () => {
    const validation: FileValidationRule = {
      types: ['image/jpeg', 'image/png'],
      maxSize: 5,
      maxCount: 3
    }
    
    const onValidationError = vi.fn()
    
    wrapper = mount(Upload, {
      props: {
        validation,
        onValidationError
      }
    })
    
    // 模拟文件上传前的验证
    const aUpload = wrapper.findComponent({ name: 'AUpload' })
    const beforeUpload = aUpload.props('beforeUpload')
    
    // 测试无效文件类型
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' })
    const result = await beforeUpload(invalidFile, [])
    
    expect(result).toBe(false)
    expect(wrapper.vm.validationErrors.length).toBeGreaterThan(0)
  })

  it('emits change event when file status changes', async () => {
    wrapper = mount(Upload)
    
    const aUpload = wrapper.findComponent({ name: 'AUpload' })
    const changeInfo = {
      file: { uid: '1', name: 'test.jpg', status: 'done' },
      fileList: [{ uid: '1', name: 'test.jpg', status: 'done' }]
    }
    
    await aUpload.vm.$emit('change', changeInfo)
    
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0][0]).toEqual(changeInfo)
  })

  it('handles paste upload when enabled', async () => {
    const onPaste = vi.fn()
    
    wrapper = mount(Upload, {
      props: {
        pasteUpload: true,
        onPaste
      }
    })
    
    // 模拟粘贴事件
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: {
        items: [
          {
            kind: 'file',
            getAsFile: () => new File([''], 'test.jpg', { type: 'image/jpeg' })
          }
        ]
      } as any
    })
    
    await wrapper.trigger('paste', pasteEvent)
    
    expect(onPaste).toHaveBeenCalled()
  })

  it('exposes correct methods', () => {
    wrapper = mount(Upload)
    
    const exposedMethods = wrapper.vm
    expect(typeof exposedMethods.upload).toBe('function')
    expect(typeof exposedMethods.clearFiles).toBe('function')
    expect(typeof exposedMethods.retry).toBe('function')
    expect(typeof exposedMethods.getFileList).toBe('function')
    expect(typeof exposedMethods.addFiles).toBe('function')
    expect(typeof exposedMethods.removeFile).toBe('function')
  })

  it('clears files correctly', async () => {
    wrapper = mount(Upload)
    
    // 添加一些文件
    wrapper.vm.fileList = [
      { uid: '1', name: 'test1.jpg' },
      { uid: '2', name: 'test2.jpg' }
    ]
    
    await nextTick()
    expect(wrapper.vm.fileList.length).toBe(2)
    
    // 清空文件
    wrapper.vm.clearFiles()
    
    await nextTick()
    expect(wrapper.vm.fileList.length).toBe(0)
  })

  it('adds files correctly', async () => {
    wrapper = mount(Upload)
    
    const files = [
      new File([''], 'test1.jpg', { type: 'image/jpeg' }),
      new File([''], 'test2.jpg', { type: 'image/jpeg' })
    ]
    
    wrapper.vm.addFiles(files)
    
    await nextTick()
    expect(wrapper.vm.fileList.length).toBe(2)
    expect(wrapper.vm.fileList[0].name).toBe('test1.jpg')
    expect(wrapper.vm.fileList[1].name).toBe('test2.jpg')
  })

  it('removes file correctly', async () => {
    wrapper = mount(Upload)
    
    // 添加文件
    wrapper.vm.fileList = [
      { uid: '1', name: 'test1.jpg' },
      { uid: '2', name: 'test2.jpg' }
    ]
    
    await nextTick()
    expect(wrapper.vm.fileList.length).toBe(2)
    
    // 移除文件
    wrapper.vm.removeFile({ uid: '1', name: 'test1.jpg' })
    
    await nextTick()
    expect(wrapper.vm.fileList.length).toBe(1)
    expect(wrapper.vm.fileList[0].uid).toBe('2')
  })

  it('handles validation errors display', async () => {
    wrapper = mount(Upload)
    
    // 添加验证错误
    wrapper.vm.validationErrors = ['文件类型不支持', '文件大小超出限制']
    
    await nextTick()
    
    const errorAlerts = wrapper.findAll('.ant-alert')
    expect(errorAlerts.length).toBe(2)
  })

  it('removes validation error when alert is closed', async () => {
    wrapper = mount(Upload)
    
    wrapper.vm.validationErrors = ['错误1', '错误2']
    await nextTick()
    
    // 模拟关闭第一个错误
    wrapper.vm.removeValidationError(0)
    await nextTick()
    
    expect(wrapper.vm.validationErrors.length).toBe(1)
    expect(wrapper.vm.validationErrors[0]).toBe('错误2')
  })
})