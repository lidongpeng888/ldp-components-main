/**
 * 主题系统基础测试
 */

import { describe, it, expect } from 'vitest'
import {
  defaultTheme,
  darkTheme,
  presetThemes,
  getPresetTheme,
  mergeThemeConfig,
  createThemeCustomizer,
  ThemeColorUtils
} from '../index'

describe('Theme System Basic Tests', () => {
  describe('Theme Configuration', () => {
    it('should have valid default theme', () => {
      expect(defaultTheme).toBeDefined()
      expect(defaultTheme.token).toBeDefined()
      expect(defaultTheme.token?.colorPrimary).toBe('#1677ff')
      expect(defaultTheme.components).toBeDefined()
    })

    it('should have valid dark theme', () => {
      expect(darkTheme).toBeDefined()
      expect(darkTheme.token).toBeDefined()
      expect(darkTheme.token?.colorPrimary).toBe('#1677ff')
      expect(darkTheme.token?.colorBgBase).toBe('#141414')
    })

    it('should merge theme configs correctly', () => {
      const customTheme = {
        token: {
          colorPrimary: '#ff0000'
        }
      }

      const merged = mergeThemeConfig(defaultTheme, customTheme)
      expect(merged.token?.colorPrimary).toBe('#ff0000')
      expect(merged.token?.colorSuccess).toBe(defaultTheme.token?.colorSuccess)
    })

    it('should get preset theme by name', () => {
      const blueTheme = getPresetTheme('blue')
      expect(blueTheme).toBeDefined()
      expect(blueTheme?.name).toBe('blue')
      expect(blueTheme?.config.token?.colorPrimary).toBe('#1890ff')
    })
  })

  describe('Preset Themes', () => {
    it('should have all required preset themes', () => {
      expect(presetThemes).toHaveLength(5)
      
      const themeNames = presetThemes.map(t => t.name)
      expect(themeNames).toContain('default')
      expect(themeNames).toContain('dark')
      expect(themeNames).toContain('blue')
      expect(themeNames).toContain('green')
      expect(themeNames).toContain('purple')
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

  describe('Theme Customizer', () => {
    it('should create customizer with default theme', () => {
      const customizer = createThemeCustomizer()
      expect(customizer.getTheme()).toEqual(defaultTheme)
    })

    it('should update primary color', () => {
      const customizer = createThemeCustomizer()
      customizer.updatePrimaryColor('#ff0000')
      expect(customizer.getTheme().token?.colorPrimary).toBe('#ff0000')
    })

    it('should update component theme', () => {
      const customizer = createThemeCustomizer()
      customizer.updateComponentTheme('CustomModal', {
        dragHandleColor: '#00ff00'
      })
      expect(customizer.getTheme().components?.CustomModal?.dragHandleColor).toBe('#00ff00')
    })

    it('should export and import theme', () => {
      const customizer = createThemeCustomizer()
      customizer.updatePrimaryColor('#ff0000')
      const exported = customizer.exportTheme()
      
      const newCustomizer = createThemeCustomizer()
      const success = newCustomizer.importTheme(exported)
      
      expect(success).toBe(true)
      expect(newCustomizer.getTheme().token?.colorPrimary).toBe('#ff0000')
    })

    it('should handle invalid theme import', () => {
      const customizer = createThemeCustomizer()
      const success = customizer.importTheme('invalid json')
      expect(success).toBe(false)
    })

    it('should create and restore snapshots', () => {
      const customizer = createThemeCustomizer()
      customizer.updatePrimaryColor('#ff0000')
      const snapshot = customizer.createSnapshot()
      
      customizer.updatePrimaryColor('#00ff00')
      expect(customizer.getTheme().token?.colorPrimary).toBe('#00ff00')
      
      customizer.restoreSnapshot(snapshot)
      expect(customizer.getTheme().token?.colorPrimary).toBe('#ff0000')
    })

    it('should generate CSS variables', () => {
      const customizer = createThemeCustomizer()
      const cssVars = customizer.generateCSSVars()
      expect(cssVars).toContain('--theme-color-primary')
      expect(cssVars).toContain(defaultTheme.token?.colorPrimary)
    })
  })

  describe('Theme Color Utils', () => {
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
})