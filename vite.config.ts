import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  
  return {
    plugins: [
      vue(),
      vueJsx(),
      // 生成 TypeScript 声明文件
      dts({
        include: ['src/**/*', 'types/**/*'],
        exclude: ['src/**/__tests__/*', 'src/**/*.stories.*'],
        outDir: 'dist',
        staticImport: true,
        insertTypesEntry: true,
        rollupTypes: true
      })
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/types': resolve(__dirname, 'types'),
        '@/components': resolve(__dirname, 'src/components'),
        '@/hooks': resolve(__dirname, 'src/hooks'),
        '@/utils': resolve(__dirname, 'src/utils')
      }
    },
    
    // 开发服务器配置
    server: {
      port: 3000,
      open: true,
      hmr: true
    },
    
    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      modules: {
        localsConvention: 'camelCase'
      }
    },
    
    // 构建配置
    build: isLib ? {
      // 库模式构建配置
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'VueComponentLibrary',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'umd', 'cjs']
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue', 'ant-design-vue'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            'ant-design-vue': 'antd'
          },
          // 分离 CSS
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'index.css'
            }
            return assetInfo.name as string
          }
        }
      },
      // 生成源码映射
      sourcemap: true,
      // 压缩代码
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // CSS 代码分割
      cssCodeSplit: false
    } : {
      // 开发模式构建配置
      outDir: 'dist-dev',
      sourcemap: true
    },
    
    // 优化配置
    optimizeDeps: {
      include: ['vue', 'ant-design-vue'],
      exclude: ['@vue/devtools-api']
    },
    
    // 定义全局常量
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_COMPONENT_LIBRARY_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
      __VUE_COMPONENT_LIBRARY_DEV__: mode === 'development'
    },
    
    // 测试配置
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/__tests__/',
          '**/*.d.ts',
          '**/*.stories.*',
          'dist/',
          'storybook-static/'
        ]
      }
    }
  }
})