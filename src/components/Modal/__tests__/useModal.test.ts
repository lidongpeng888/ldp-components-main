import { describe, it, expect, vi } from 'vitest'
import { useModal } from '../useModal'

describe('useModal', () => {
  it('should initialize with default state', () => {
    const { visible, modalProps, confirmLoading } = useModal()

    expect(visible.value).toBe(false)
    expect(confirmLoading.value).toBe(false)
    expect(modalProps.value).toEqual({})
  })

  it('should open modal with options', () => {
    const { visible, modalProps, open } = useModal()

    const options = {
      title: 'Test Modal',
      width: 500
    }

    open(options)

    expect(visible.value).toBe(true)
    expect(modalProps.value).toEqual(options)
  })

  it('should close modal', () => {
    const { visible, close, open } = useModal()

    open({ title: 'Test' })
    expect(visible.value).toBe(true)

    close()
    expect(visible.value).toBe(false)
  })

  it('should handle confirm with async onOk', async () => {
    const onOk = vi.fn().mockResolvedValue(undefined)
    const { visible, confirmLoading, confirm, open } = useModal()

    open({ onOk })

    const confirmPromise = confirm()
    expect(confirmLoading.value).toBe(true)

    await confirmPromise
    expect(visible.value).toBe(false)
    expect(confirmLoading.value).toBe(false)
    expect(onOk).toHaveBeenCalled()
  })
})
