/// <reference types="vite/client" />

// Vite 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_BUILD_MODE: 'development' | 'production' | 'test'
  readonly VITE_COMPONENT_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}