/**
 * 类型系统测试
 */

import { describe, it, expect, vi } from 'vitest'
import {
  TypeValidator,
  ComponentPropsValidator,
  DataStructureValidator,
  ThemeConfigValidator,
  RuntimeTypeChecker,
  ValidationError,
  assertType,
  safeTypeConvert,
  combineTypeGuards,
  optionalTypeGuard,
  arrayTypeGuard
} from '../validation'

import type {
  ComponentSize,
  ComponentStatus,
  PlacementType,
  Option,
  TreeNode,
  TableColumn,
  FormField,
  FileItem,
  ThemeConfig
} from '../utils'

describe('Type System', () => {
  describe('TypeValidator', () => {
    it('should validate string type', () => {
      expect(TypeValidator.isString('hello')).toBe(true)
      expect(TypeValidator.isString(123)).toBe(false)
      expect(TypeValidator.isString(null)).toBe(false)
    })

    it('should validate number type', () => {
      expect(TypeValidator.isNumber(123)).toBe(true)
      expect(TypeValidator.isNumber(0)).toBe(true)
      expect(TypeValidator.isNumber(NaN)).toBe(false)
      expect(TypeValidator.isNumber('123')).toBe(false)
    })

    it('should validate boolean type', () => {
      expect(TypeValidator.isBoolean(true)).toBe(true)
      expect(TypeValidator.isBoolean(false)).toBe(true)
      expect(TypeValidator.isBoolean(0)).toBe(false)
      expect(TypeValidator.isBoolean('true')).toBe(false)
    })

    it('should validate function type', () => {
      expect(TypeValidator.isFunction(() => {})).toBe(true)
      expect(TypeValidator.isFunction(function() {})).toBe(true)
      expect(TypeValidator.isFunction({})).toBe(false)
    })

    it('should validate object type', () => {
      expect(TypeValidator.isObject({})).toBe(true)
      expect(TypeValidator.isObject({ a: 1 })).toBe(true)
      expect(TypeValidator.isObject([])).toBe(false)
      expect(TypeValidator.isObject(null)).toBe(false)
    })

    it('should validate array type', () => {
      expect(TypeValidator.isArray([])).toBe(true)
      expect(TypeValidator.isArray([1, 2, 3])).toBe(true)
      expect(TypeValidator.isArray({})).toBe(false)
    })

    it('should validate empty values', () => {
      expect(TypeValidator.isEmpty(null)).toBe(true)
      expect(TypeValidator.isEmpty(undefined)).toBe(true)
      expect(TypeValidator.isEmpty('')).toBe(true)
      expect(TypeValidator.isEmpty([])).toBe(true)
      expect(TypeValidator.isEmpty({})).toBe(true)
      expect(TypeValidator.isEmpty('hello')).toBe(false)
      expect(TypeValidator.isEmpty([1])).toBe(false)
      expect(TypeValidator.isEmpty({ a: 1 })).toBe(false)
    })
  })

  describe('ComponentPropsValidator', () => {
    it('should validate component size', () => {
      expect(ComponentPropsValidator.validateSize('small')).toBe(true)
      expect(ComponentPropsValidator.validateSize('middle')).toBe(true)
      expect(ComponentPropsValidator.validateSize('large')).toBe(true)
      expect(ComponentPropsValidator.validateSize('invalid')).toBe(false)
    })

    it('should validate component status', () => {
      expect(ComponentPropsValidator.validateStatus('success')).toBe(true)
      expect(ComponentPropsValidator.validateStatus('warning')).toBe(true)
      expect(ComponentPropsValidator.validateStatus('error')).toBe(true)
      expect(ComponentPropsValidator.validateStatus('info')).toBe(true)
      expect(ComponentPropsValidator.validateStatus('default')).toBe(true)
      expect(ComponentPropsValidator.validateStatus('invalid')).toBe(false)
    })

    it('should validate placement type', () => {
      expect(ComponentPropsValidator.validatePlacement('top')).toBe(true)
      expect(ComponentPropsValidator.validatePlacement('topLeft')).toBe(true)
      expect(ComponentPropsValidator.validatePlacement('bottom')).toBe(true)
      expect(ComponentPropsValidator.validatePlacement('invalid')).toBe(false)
    })

    it('should validate trigger type', () => {
      expect(ComponentPropsValidator.validateTrigger('hover')).toBe(true)
      expect(ComponentPropsValidator.validateTrigger('click')).toBe(true)
      expect(ComponentPropsValidator.validateTrigger('focus')).toBe(true)
      expect(ComponentPropsValidator.validateTrigger('contextmenu')).toBe(true)
      expect(ComponentPropsValidator.validateTrigger('invalid')).toBe(false)
    })

    it('should validate theme mode', () => {
      expect(ComponentPropsValidator.validateThemeMode('light')).toBe(true)
      expect(ComponentPropsValidator.validateThemeMode('dark')).toBe(true)
      expect(ComponentPropsValidator.validateThemeMode('auto')).toBe(true)
      expect(ComponentPropsValidator.validateThemeMode('invalid')).toBe(false)
    })

    it('should validate color values', () => {
      expect(ComponentPropsValidator.validateColor('#ff0000')).toBe(true)
      expect(ComponentPropsValidator.validateColor('#f00')).toBe(true)
      expect(ComponentPropsValidator.validateColor('rgb(255, 0, 0)')).toBe(true)
      expect(ComponentPropsValidator.validateColor('rgba(255, 0, 0, 0.5)')).toBe(true)
      expect(ComponentPropsValidator.validateColor('red')).toBe(true)
      expect(ComponentPropsValidator.validateColor('invalid')).toBe(false)
      expect(ComponentPropsValidator.validateColor('#gg0000')).toBe(false)
    })

    it('should validate URL', () => {
      expect(ComponentPropsValidator.validateUrl('https://example.com')).toBe(true)
      expect(ComponentPropsValidator.validateUrl('http://example.com')).toBe(true)
      expect(ComponentPropsValidator.validateUrl('ftp://example.com')).toBe(true)
      expect(ComponentPropsValidator.validateUrl('invalid-url')).toBe(false)
    })

    it('should validate email', () => {
      expect(ComponentPropsValidator.validateEmail('test@example.com')).toBe(true)
      expect(ComponentPropsValidator.validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(ComponentPropsValidator.validateEmail('invalid-email')).toBe(false)
      expect(ComponentPropsValidator.validateEmail('test@')).toBe(false)
    })

    it('should validate phone number', () => {
      expect(ComponentPropsValidator.validatePhone('13800138000')).toBe(true)
      expect(ComponentPropsValidator.validatePhone('15912345678')).toBe(true)
      expect(ComponentPropsValidator.validatePhone('12345678901')).toBe(false)
      expect(ComponentPropsValidator.validatePhone('1380013800')).toBe(false)
    })
  })

  describe('DataStructureValidator', () => {
    it('should validate options array', () => {
      const validOptions: Option[] = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2, disabled: true },
        { 
          label: 'Option 3', 
          value: 3, 
          children: [
            { label: 'Sub Option 1', value: 31 }
          ]
        }
      ]

      expect(DataStructureValidator.validateOptions(validOptions)).toBe(true)
      expect(DataStructureValidator.validateOptions([])).toBe(true)
      expect(DataStructureValidator.validateOptions([{ value: 1 }])).toBe(false) // missing label
      expect(DataStructureValidator.validateOptions([{ label: 'test' }])).toBe(false) // missing value
    })

    it('should validate tree data', () => {
      const validTreeData: TreeNode[] = [
        { key: '1', title: 'Node 1', value: 1 },
        { 
          key: '2', 
          title: 'Node 2', 
          children: [
            { key: '2-1', title: 'Sub Node 1', value: 21 }
          ]
        }
      ]

      expect(DataStructureValidator.validateTreeData(validTreeData)).toBe(true)
      expect(DataStructureValidator.validateTreeData([])).toBe(true)
      expect(DataStructureValidator.validateTreeData([{ title: 'test' }])).toBe(false) // missing key
      expect(DataStructureValidator.validateTreeData([{ key: '1' }])).toBe(false) // missing title
    })

    it('should validate table columns', () => {
      const validColumns: TableColumn[] = [
        { key: 'name', title: 'Name', dataIndex: 'name' },
        { key: 'age', title: 'Age', width: 100, sorter: true },
        { key: 'action', title: 'Action', fixed: 'right' }
      ]

      expect(DataStructureValidator.validateTableColumns(validColumns)).toBe(true)
      expect(DataStructureValidator.validateTableColumns([])).toBe(true)
      expect(DataStructureValidator.validateTableColumns([{ title: 'test' }])).toBe(false) // missing key
      expect(DataStructureValidator.validateTableColumns([{ key: 'test' }])).toBe(false) // missing title
    })

    it('should validate form fields', () => {
      const validFields: FormField[] = [
        { name: 'username', label: 'Username', type: 'input', required: true },
        { name: 'email', label: 'Email', type: 'email', rules: [] }
      ]

      expect(DataStructureValidator.validateFormFields(validFields)).toBe(true)
      expect(DataStructureValidator.validateFormFields([])).toBe(true)
      expect(DataStructureValidator.validateFormFields([{ label: 'test', type: 'input' }])).toBe(false) // missing name
    })

    it('should validate file list', () => {
      const validFiles: FileItem[] = [
        { uid: '1', name: 'file1.txt', status: 'done', url: 'http://example.com/file1.txt' },
        { uid: '2', name: 'file2.jpg', status: 'uploading', size: 1024 }
      ]

      expect(DataStructureValidator.validateFileList(validFiles)).toBe(true)
      expect(DataStructureValidator.validateFileList([])).toBe(true)
      expect(DataStructureValidator.validateFileList([{ name: 'test', status: 'done' }])).toBe(false) // missing uid
    })
  })

  describe('ThemeConfigValidator', () => {
    it('should validate theme config', () => {
      const validTheme: ThemeConfig = {
        token: {
          colorPrimary: '#1890ff',
          fontSize: 14,
          fontFamily: 'Arial'
        },
        components: {
          Button: {
            colorPrimary: '#1890ff'
          }
        }
      }

      expect(ThemeConfigValidator.validateThemeConfig(validTheme)).toBe(true)
      expect(ThemeConfigValidator.validateThemeConfig({})).toBe(true)
      expect(ThemeConfigValidator.validateThemeConfig(null)).toBe(false)
    })

    it('should validate theme token', () => {
      const validToken = {
        colorPrimary: '#1890ff',
        fontSize: 14,
        fontFamily: 'Arial'
      }

      expect(ThemeConfigValidator.validateThemeToken(validToken)).toBe(true)
      expect(ThemeConfigValidator.validateThemeToken({})).toBe(true)
      expect(ThemeConfigValidator.validateThemeToken({ colorPrimary: 'invalid-color' })).toBe(false)
    })
  })

  describe('RuntimeTypeChecker', () => {
    beforeEach(() => {
      RuntimeTypeChecker.clearErrors()
    })

    it('should check prop types', () => {
      const value = 'test'
      const result = RuntimeTypeChecker.checkProp(
        value,
        TypeValidator.isString,
        'title',
        'TestComponent'
      )

      expect(result).toBe(value)
      expect(RuntimeTypeChecker.hasErrors()).toBe(false)
    })

    it('should record validation errors', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const value = 123
      RuntimeTypeChecker.checkProp(
        value,
        TypeValidator.isString,
        'title',
        'TestComponent'
      )

      expect(RuntimeTypeChecker.hasErrors()).toBe(true)
      expect(RuntimeTypeChecker.getErrors()).toHaveLength(1)
      
      consoleSpy.mockRestore()
    })

    it('should clear errors', () => {
      RuntimeTypeChecker.checkProp(123, TypeValidator.isString, 'title')
      expect(RuntimeTypeChecker.hasErrors()).toBe(true)
      
      RuntimeTypeChecker.clearErrors()
      expect(RuntimeTypeChecker.hasErrors()).toBe(false)
      expect(RuntimeTypeChecker.getErrors()).toHaveLength(0)
    })
  })

  describe('Type Utilities', () => {
    it('should assert types correctly', () => {
      expect(() => {
        assertType('test', TypeValidator.isString)
      }).not.toThrow()

      expect(() => {
        assertType(123, TypeValidator.isString)
      }).toThrow(ValidationError)
    })

    it('should safely convert types', () => {
      const result1 = safeTypeConvert('123', Number, 0)
      expect(result1).toBe(123)

      const result2 = safeTypeConvert('invalid', Number, 0)
      expect(result2).toBe(0)
    })

    it('should combine type guards', () => {
      const isStringAndNotEmpty = combineTypeGuards(
        TypeValidator.isString,
        (value: any): value is string => value.length > 0
      )

      expect(isStringAndNotEmpty('hello')).toBe(true)
      expect(isStringAndNotEmpty('')).toBe(false)
      expect(isStringAndNotEmpty(123)).toBe(false)
    })

    it('should create optional type guard', () => {
      const isOptionalString = optionalTypeGuard(TypeValidator.isString)

      expect(isOptionalString('hello')).toBe(true)
      expect(isOptionalString(undefined)).toBe(true)
      expect(isOptionalString(123)).toBe(false)
    })

    it('should create array type guard', () => {
      const isStringArray = arrayTypeGuard(TypeValidator.isString)

      expect(isStringArray(['a', 'b', 'c'])).toBe(true)
      expect(isStringArray([])).toBe(true)
      expect(isStringArray(['a', 123])).toBe(false)
      expect(isStringArray('not array')).toBe(false)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with details', () => {
      const error = new ValidationError(
        'Invalid value',
        'testField',
        123,
        'string'
      )

      expect(error.message).toBe('Invalid value')
      expect(error.field).toBe('testField')
      expect(error.value).toBe(123)
      expect(error.expectedType).toBe('string')
      expect(error.name).toBe('ValidationError')
    })
  })
})