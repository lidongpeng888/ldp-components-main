/**
 * useModal Hook - 支持命令式调用弹窗
 * 提供弹窗的状态管理和命令式调用功能
 */

import { ref, reactive, computed, type Ref } from 'vue'

export interface ModalOptions {
  title?: string
  content?: string
  width?: number | string
  centered?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  destroyOnClose?: boolean
  zIndex?: number
  okText?: string
  cancelText?: string
  okType?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  okButtonProps?: Record<string, any>
  cancelButtonProps?: Record<string, any>
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}

export interface ConfirmOptions extends ModalOptions {
  type?: 'info' | 'success' | 'error' | 'warning' | 'confirm'
  icon?: any
  autoFocusButton?: 'ok' | 'cancel' | null
}

export interface UseModalReturn {
  /** 弹窗显示状态 */
  visible: Ref<boolean>
  /** 弹窗配置 */
  modalProps: Ref<ModalOptions>
  /** 确认加载状态 */
  confirmLoading: Ref<boolean>
  /** 打开弹窗 */
  open: (options?: ModalOptions) => void
  /** 关闭弹窗 */
  close: () => void
  /** 确认操作 */
  confirm: () => Promise<void>
  /** 取消操作 */
  cancel: () => void
  /** 更新弹窗配置 */
  updateModal: (options: Partial<ModalOptions>) => void
}

export function useModal(defaultOptions: ModalOptions = {}): UseModalReturn {
  const visible = ref(false)
  const confirmLoading = ref(false)
  const modalProps = ref<ModalOptions>({ ...defaultOptions })

  // 打开弹窗
  const open = (options: ModalOptions = {}) => {
    modalProps.value = { ...defaultOptions, ...options }
    visible.value = true
  }

  // 关闭弹窗
  const close = () => {
    visible.value = false
    confirmLoading.value = false
  }

  // 确认操作
  const confirm = async () => {
    if (modalProps.value.onOk) {
      try {
        confirmLoading.value = true
        await modalProps.value.onOk()
        close()
      } catch (error) {
        console.error('Modal confirm error:', error)
      } finally {
        confirmLoading.value = false
      }
    } else {
      close()
    }
  }

  // 取消操作
  const cancel = () => {
    if (modalProps.value.onCancel) {
      modalProps.value.onCancel()
    }
    close()
  }

  // 更新弹窗配置
  const updateModal = (options: Partial<ModalOptions>) => {
    modalProps.value = { ...modalProps.value, ...options }
  }

  return {
    visible,
    modalProps,
    confirmLoading,
    open,
    close,
    confirm,
    cancel,
    updateModal
  }
}
