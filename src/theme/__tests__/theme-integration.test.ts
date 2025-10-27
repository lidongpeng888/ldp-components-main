/**
 * 主题系统集成测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { ConfigProvider } from 'ant-design-vue'

import {
  ThemeProvider,
  useTheme,
  useThemeMode,
  useThemeToken,
  useComponentTheme,
  createThemeCustomizer,
  ThemeColorUtils,
  defaultTheme,
  darkTheme,
  presetThemes
} from '../index'

// 测试组件
const TestComponent = defineComponent({
  setup() {
    const theme = useTheme()
    const { mode, isDark } = useThemeMode()
    const token = useThemeToken()
    const modalTheme = useComponentTheme('CustomModal')

    return {
      theme,
      mode,
      isDark,
      token,
      modalTheme
    }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { class: 'mode' }, this.mode),
      h('span', { class: 'is-dark' }, String(this.isDark)),
      h('span', { class: 'primary-color' }, this.token.colorPrimary),
      h('span', { class: 'modal-drag-color' }, this.modalTheme?.dragHandleColor)
    ])
  }
})

describe('Theme Integration', () => {
  let mockMatchMedia: any

  beforeEach(() => {
    // Mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('ThemeProvider', () => {
    it('should provide default theme', () => {
      const wrapper = mount(ThemeProvider, {
        slots: {
          default: () => h(TestComponent)
        }
      })

      const testComponent = wrapper.findComponent(TestComponent)
      expect(testComponent.vm.mode).toBe('light')
      expect(testComponent.vm.isDark).toBe(false)
      expect(testComponent.vm.token.colorPrimary).toBe(defaultTheme.token?.colorPrimary)
    })

    it('should provide dark theme when mode is dark', () => {
      const wrapper = mount(ThemeProvider, {
        props: {
          mode: 'dark'
        },
        slots: {
          default: () => h(TestComponent)
        }
      })

      const testComponent = wrapper.findComponent(TestComponent)
      expect(testComponent.vm.mode).toBe('dark')
      expect(testComponent.vm.isDark).toBe(true)
    })

    it('should merge custom theme with default theme', () => {
      const customTheme = {
        token: {
          colorPrimary: '#ff0000'
        }
      }

      const wrapper = mount(ThemeProvider, {
        props: {
          theme: customTheme
        },
        slots: {
          default: () => h(TestComponent)
        }
      })

      const testComponent = wrapper.findComponent(TestComponent)
      expect(testComponent.vm.token.colorPrimary).toBe('#ff0000')
    })

    it('should apply preset theme', () => {
      const wrapper = mount(ThemeProvider, {
        props: {
          presetTheme: 'blue'
        },
        slots: {
          default: () => h(TestComponent)
        }
      })

      const testComponent = wrapper.findComponent(TestComponent)
      expect(testComponent.vm.token.colorPrimary).toBe('#1890ff')
    })

    it('should provide component theme', () => {
      const wrapper = mount(ThemeProvider, {
        slots: {
          default: () => h(TestComponent)
        }
      })

      const testComponent = wrapper.findComponent(TestComponent)
      expect(testComponent.vm.modalTheme?.dragHandleColor).toBe(
        defaultTheme.components?.CustomModal?.dragHandleColor
      )
    })
  })

  describe('Theme Hooks', () => {
    it('should throw error when used outside ThemeProvider', () => {
      const TestComponentWithoutProvider = defineComponent({
        setup() {
          expect(() => useTheme()).toThrow('useTheme must be used within ThemeProvider')
          return () => h('div')
        }
      })

      expect(() => {
        mount(TestComponentWithoutProvider)
      }).toThrow()
    })

    it('should update theme through context', async () => {
      const TestComponentWithUpdate = defineComponent({
        setup() {
          const { theme, setTheme } = useTheme()
          
          const updateTheme = () => {
            setTheme({
              token: {
                colorPrimary: '#00ff00'
              }
            })
          }

          return {
            theme,
            updateTheme
          }
        },
        render() {
          return h('div', [
            h('span', { class: 'primary-color' }, this.theme.token?.colorPrimary),
            h('button', { onClick: this.updateTheme }, 'Update Theme')
          ])
        }
      })

      const wrapper = mount(ThemeProvider, {
        slots: {
          default: () => h(TestComponentWithUpdate)
        }
      })

      const testComponent = wrapper.findComponent(TestComponentWithUpdate)
      expect(testComponent.find('.primary-color').text()).toBe(defaultTheme.token?.colorPrimary)

      await testComponent.find('button').trigger('click')
      expect(testComponent.find('.primary-color').text()).toBe('#00ff00')
    })
  })

  describe('ThemeCustomizer', () => {
    let customizer: any

    beforeEach(() => {
      customizer = createThemeCustomizer()
    })

    it('should create customizer with default theme', () => {
      expect(customizer.getTheme()).toEqual(defaultTheme)
    })

    it('should update primary color', () => {
      customizer.updatePrimaryColor('#ff0000')
      expect(customizer.getTheme().token?.colorPrimary).toBe('#ff0000')
    })

    it('should update component theme', () => {
      customizer.updateComponentTheme('CustomModal', {
        dragHandleColor: '#00ff00'
      })
      expect(customizer.getTheme().components?.CustomModal?.dragHandleColor).toBe('#00ff00')
    })

    it('should export and import theme', () => {
      customizer.updatePrimaryColor('#ff0000')
      const exported = customizer.exportTheme()
      
      const newCustomizer = createThemeCustomizer()
      const success = newCustomizer.importTheme(exported)
      
      expect(success).toBe(true)
      expect(newCustomizer.getTheme().token?.colorPrimary).toBe('#ff0000')
    })

    it('should handle invalid theme import', () => {
      const success = customizer.importTheme('invalid json')
      expect(success).toBe(false)
    })

    it('should create and restore snapshots', () => {
      customizer.updatePrimaryColor('#ff0000')
      const snapshot = customizer.createSnapshot()
      
      customizer.updatePrimaryColor('#00ff00')
      expect(customizer.getTheme().token?.colorPrimary).toBe('#00ff00')
      
      customizer.restoreSnapshot(snapshot)
      expect(customizer.getTheme().token?.colorPrimary).toBe('#ff0000')
    })

    it('should generate CSS variables', () => {
      const cssVars = customizer.generateCSSVars()
      expect(cssVars).toContain('--theme-color-primary')
      expect(cssVars).toContain(defaultTheme.token?.colorPrimary)
    })

    it('should add and remove listeners', () => {
      const listener = vi.fn()
      const removeListener = customizer.addListener(listener)
      
      customizer.updatePrimaryColor('#ff0000')
      expect(listener).toHaveBeenCalledWith(customizer.getTheme())
      
      removeListener()
      listener.mockClear()
      
      customizer.updatePrimaryColor('#00ff00')
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('ThemeColorUtils', () => {
    it('should generate color palette', () => {
      const palette = ThemeColorUtils.generatePalette('#1890ff')
      expect(palette.primary).toBe('#1890ff')
      expect(palette['primary-1']).toBeDefined()
      expect(palette['primary-10']).toBeDefined()
    })

    it('should adjust brightness', () => {
      const lighter = ThemeColorUtils.adjustBrightness('#1890ff', 0.2)
      const darker = ThemeColorUtils.adjustBrightness('#1890ff', -0.2)
      
      expect(lighter).not.toBe('#1890ff')
      expect(darker).not.toBe('#1890ff')
      expect(lighter).not.toBe(darker)
    })

    it('should check color contrast', () => {
      const contrast = ThemeColorUtils.checkContrast('#ffffff', '#000000')
      expect(contrast).toBeGreaterThan(1)
      
      const lowContrast = ThemeColorUtils.checkContrast('#ffffff', '#f0f0f0')
      expect(lowContrast).toBeLessThan(contrast)
    })
  })

  describe('Preset Themes', () => {
    it('should have all required preset themes', () => {
      expect(presetThemes).toHaveLength(5)
      expect(presetThemes.map(t => t.name)).toContain('default')
      expect(presetThemes.map(t => t.name)).toContain('dark')
      expect(presetThemes.map(t => t.name)).toContain('blue')
      expect(presetThemes.map(t => t.name)).toContain('green')
      expect(presetThemes.map(t => t.name)).toContain('purple')
    })

    it('should have valid theme configurations', () => {
      presetThemes.forEach(preset => {
        expect(preset.name).toBeTruthy()
        expect(preset.displayName).toBeTruthy()
        expect(preset.config).toBeTruthy()
        expect(preset.config.token).toBeTruthy()
        expect(preset.config.token?.colorPrimary).toBeTruthy()
      })
    })
  })

  describe('Ant Design Vue Integration', () => {
    it('should integrate with ConfigProvider', () => {
      const wrapper = mount(ThemeProvider, {
        slots: {
          default: () => h(ConfigProvider, {}, () => h('div', 'test'))
        }
      })

      // 验证 ConfigProvider 被正确渲染
      expect(wrapper.findComponent(ConfigProvider).exists()).toBe(true)
    })

    it('should pass theme to ConfigProvider', () => {
      const customTheme = {
        token: {
          colorPrimary: '#ff0000'
        }
      }

      const wrapper = mount(ThemeProvider, {
        props: {
          theme: customTheme
        },
        slots: {
          default: () => h('div', 'test')
        }
      })

      const configProvider = wrapper.findComponent(ConfigProvider)
      expect(configProvider.props('theme')).toMatchObject(
        expect.objectContaining({
          token: expect.objectContaining({
            colorPrimary: '#ff0000'
          })
        })
      )
    })
  })

  describe('Auto Theme Detection', () => {
    it('should detect system dark mode in auto mode', () => {
      // Mock dark mode preference
      mockMatchMedia.mockImplementation(query => ({
        matches: query.includes('prefers-color-scheme: dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      const wrapper = mount(ThemeProvider, {
        props: {
          mode: 'auto'
        },
        slots: {
          default: () => h(TestComponent)
        }
      })

      const testComponent = wrapper.findComponent(TestComponent)
      // 在自动模式下，应该根据系统偏好选择主题
      expect(testComponent.vm.mode).toBe('auto')
    })
  })
})