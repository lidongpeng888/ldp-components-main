/**
 * Modal 弹窗组件导出文件
 */

import Modal from './Modal.vue'
import type { App } from 'vue'

Modal.install = (app: App) => {
  app.component(Modal.name || 'CustomModal', Modal)
}

export default Modal
export * from './types'
export * from './hooks'
export * from './useModal'
