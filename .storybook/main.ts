import type { StorybookConfig } from '@storybook/vue3-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: false
  },
  viteFinal: async (config) => {
    // 添加路径别名
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': resolve(__dirname, '../src'),
        '@/types': resolve(__dirname, '../types'),
        '@/components': resolve(__dirname, '../src/components'),
        '@/hooks': resolve(__dirname, '../src/hooks'),
        '@/utils': resolve(__dirname, '../src/utils')
      }
    }

    // 添加 SCSS 支持
    if (config.css?.preprocessorOptions) {
      config.css.preprocessorOptions.scss = {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }

    return config
  }
}

export default config