/**
 * VueUse 工具库集成
 * 统一导出常用的 VueUse 功能，避免重复实现
 */

// 只导出确认可用的基础函数
export {
  useLocalStorage,
  useSessionStorage,
  useDraggable,
  useClipboard,
  useDebounce,
  useThrottle,
  useToggle,
  useVModel,
  usePreferredDark,
  useMediaQuery,
  useBreakpoints
} from '@vueuse/core'

/**
 * 创建响应式断点系统
 */
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}

/**
 * 使用响应式断点
 */
export const useResponsiveBreakpoints = () => {
  return useBreakpoints(breakpoints)
}

/**
 * 常用的媒体查询
 */
export const useCommonMediaQueries = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isLargeScreen = useMediaQuery('(min-width: 1200px)')
  const isDarkMode = usePreferredDark()

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isDarkMode
  }
}
