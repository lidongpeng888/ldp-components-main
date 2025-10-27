// vite.config.ts
import { defineConfig } from "file:///Users/rxing/Downloads/ldp-components-main/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.9_sass@1.89.2/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/rxing/Downloads/ldp-components-main/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.4.19_@types+node@20.19.9_sass@1.89.2__vue@3.5.18_typescript@5.8.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/rxing/Downloads/ldp-components-main/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.19_@types+node@20.19.9_sass@1.89.2__vue@3.5.18_typescript@5.8.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import dts from "file:///Users/rxing/Downloads/ldp-components-main/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.19.9_rollup@4.46.2_typescript@5.8.3_vite@5.4.19_@types+node@20.19.9_sass@1.89.2_/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/rxing/Downloads/ldp-components-main";
var vite_config_default = defineConfig(({ mode }) => {
  const isLib = mode === "lib";
  return {
    plugins: [
      vue(),
      vueJsx(),
      // 生成 TypeScript 声明文件
      dts({
        include: ["src/**/*", "types/**/*"],
        exclude: ["src/**/__tests__/*", "src/**/*.stories.*"],
        outDir: "dist",
        staticImport: true,
        insertTypesEntry: true,
        rollupTypes: true
      })
    ],
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src"),
        "@/types": resolve(__vite_injected_original_dirname, "types"),
        "@/components": resolve(__vite_injected_original_dirname, "src/components"),
        "@/hooks": resolve(__vite_injected_original_dirname, "src/hooks"),
        "@/utils": resolve(__vite_injected_original_dirname, "src/utils")
      }
    },
    // 开发服务器配置
    server: {
      port: 3e3,
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
        localsConvention: "camelCase"
      }
    },
    // 构建配置
    build: isLib ? {
      // 库模式构建配置
      lib: {
        entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
        name: "VueComponentLibrary",
        fileName: (format) => `index.${format}.js`,
        formats: ["es", "umd", "cjs"]
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ["vue", "ant-design-vue"],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: "Vue",
            "ant-design-vue": "antd"
          },
          // 分离 CSS
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") {
              return "index.css";
            }
            return assetInfo.name;
          }
        }
      },
      // 生成源码映射
      sourcemap: true,
      // 压缩代码
      minify: "terser",
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
      outDir: "dist-dev",
      sourcemap: true
    },
    // 优化配置
    optimizeDeps: {
      include: ["vue", "ant-design-vue"],
      exclude: ["@vue/devtools-api"]
    },
    // 定义全局常量
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_COMPONENT_LIBRARY_VERSION__: JSON.stringify(process.env.npm_package_version || "0.1.0"),
      __VUE_COMPONENT_LIBRARY_DEV__: mode === "development"
    },
    // 测试配置
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/__tests__/setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "src/__tests__/",
          "**/*.d.ts",
          "**/*.stories.*",
          "dist/",
          "storybook-static/"
        ]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcnhpbmcvRG93bmxvYWRzL2xkcC1jb21wb25lbnRzLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9yeGluZy9Eb3dubG9hZHMvbGRwLWNvbXBvbmVudHMtbWFpbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcnhpbmcvRG93bmxvYWRzL2xkcC1jb21wb25lbnRzLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBpc0xpYiA9IG1vZGUgPT09ICdsaWInXG4gIFxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgdnVlSnN4KCksXG4gICAgICAvLyBcdTc1MUZcdTYyMTAgVHlwZVNjcmlwdCBcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcbiAgICAgIGR0cyh7XG4gICAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyonLCAndHlwZXMvKiovKiddLFxuICAgICAgICBleGNsdWRlOiBbJ3NyYy8qKi9fX3Rlc3RzX18vKicsICdzcmMvKiovKi5zdG9yaWVzLionXSxcbiAgICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICAgIHN0YXRpY0ltcG9ydDogdHJ1ZSxcbiAgICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICAgICAgcm9sbHVwVHlwZXM6IHRydWVcbiAgICAgIH0pXG4gICAgXSxcbiAgICBcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgICAgICdAL3R5cGVzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICd0eXBlcycpLFxuICAgICAgICAnQC9jb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cycpLFxuICAgICAgICAnQC9ob29rcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2hvb2tzJyksXG4gICAgICAgICdAL3V0aWxzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvdXRpbHMnKVxuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgLy8gXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU5MTREXHU3RjZFXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiAzMDAwLFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGhtcjogdHJ1ZVxuICAgIH0sXG4gICAgXG4gICAgLy8gQ1NTIFx1OTg4NFx1NTkwNFx1NzQwNlx1NTY2OFx1OTE0RFx1N0Y2RVxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiQC9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIjtgXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtb2R1bGVzOiB7XG4gICAgICAgIGxvY2Fsc0NvbnZlbnRpb246ICdjYW1lbENhc2UnXG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvLyBcdTY3ODRcdTVFRkFcdTkxNERcdTdGNkVcbiAgICBidWlsZDogaXNMaWIgPyB7XG4gICAgICAvLyBcdTVFOTNcdTZBMjFcdTVGMEZcdTY3ODRcdTVFRkFcdTkxNERcdTdGNkVcbiAgICAgIGxpYjoge1xuICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgICAgbmFtZTogJ1Z1ZUNvbXBvbmVudExpYnJhcnknLFxuICAgICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYGluZGV4LiR7Zm9ybWF0fS5qc2AsXG4gICAgICAgIGZvcm1hdHM6IFsnZXMnLCAndW1kJywgJ2NqcyddXG4gICAgICB9LFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAvLyBcdTc4NkVcdTRGRERcdTU5MTZcdTkwRThcdTUzMTZcdTU5MDRcdTc0MDZcdTkwQTNcdTRFOUJcdTRGNjBcdTRFMERcdTYwRjNcdTYyNTNcdTUzMDVcdThGREJcdTVFOTNcdTc2ODRcdTRGOURcdThENTZcbiAgICAgICAgZXh0ZXJuYWw6IFsndnVlJywgJ2FudC1kZXNpZ24tdnVlJ10sXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIC8vIFx1NTcyOCBVTUQgXHU2Nzg0XHU1RUZBXHU2QTIxXHU1RjBGXHU0RTBCXHU0RTNBXHU4RkQ5XHU0RTlCXHU1OTE2XHU5MEU4XHU1MzE2XHU3Njg0XHU0RjlEXHU4RDU2XHU2M0QwXHU0RjlCXHU0RTAwXHU0RTJBXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXG4gICAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgICAgdnVlOiAnVnVlJyxcbiAgICAgICAgICAgICdhbnQtZGVzaWduLXZ1ZSc6ICdhbnRkJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8gXHU1MjA2XHU3OUJCIENTU1xuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09ICdzdHlsZS5jc3MnKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnaW5kZXguY3NzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lIGFzIHN0cmluZ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFx1NzUxRlx1NjIxMFx1NkU5MFx1NzgwMVx1NjYyMFx1NUMwNFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgLy8gXHU1MzhCXHU3RjI5XHU0RUUzXHU3ODAxXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBDU1MgXHU0RUUzXHU3ODAxXHU1MjA2XHU1MjcyXG4gICAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlXG4gICAgfSA6IHtcbiAgICAgIC8vIFx1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlx1Njc4NFx1NUVGQVx1OTE0RFx1N0Y2RVxuICAgICAgb3V0RGlyOiAnZGlzdC1kZXYnLFxuICAgICAgc291cmNlbWFwOiB0cnVlXG4gICAgfSxcbiAgICBcbiAgICAvLyBcdTRGMThcdTUzMTZcdTkxNERcdTdGNkVcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsndnVlJywgJ2FudC1kZXNpZ24tdnVlJ10sXG4gICAgICBleGNsdWRlOiBbJ0B2dWUvZGV2dG9vbHMtYXBpJ11cbiAgICB9LFxuICAgIFxuICAgIC8vIFx1NUI5QVx1NEU0OVx1NTE2OFx1NUM0MFx1NUUzOFx1OTFDRlxuICAgIGRlZmluZToge1xuICAgICAgX19WVUVfT1BUSU9OU19BUElfXzogdHJ1ZSxcbiAgICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogZmFsc2UsXG4gICAgICBfX1ZVRV9DT01QT05FTlRfTElCUkFSWV9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24gfHwgJzAuMS4wJyksXG4gICAgICBfX1ZVRV9DT01QT05FTlRfTElCUkFSWV9ERVZfXzogbW9kZSA9PT0gJ2RldmVsb3BtZW50J1xuICAgIH0sXG4gICAgXG4gICAgLy8gXHU2RDRCXHU4QkQ1XHU5MTREXHU3RjZFXG4gICAgdGVzdDoge1xuICAgICAgZ2xvYmFsczogdHJ1ZSxcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgICAgc2V0dXBGaWxlczogWycuL3NyYy9fX3Rlc3RzX18vc2V0dXAudHMnXSxcbiAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCddLFxuICAgICAgICBleGNsdWRlOiBbXG4gICAgICAgICAgJ25vZGVfbW9kdWxlcy8nLFxuICAgICAgICAgICdzcmMvX190ZXN0c19fLycsXG4gICAgICAgICAgJyoqLyouZC50cycsXG4gICAgICAgICAgJyoqLyouc3Rvcmllcy4qJyxcbiAgICAgICAgICAnZGlzdC8nLFxuICAgICAgICAgICdzdG9yeWJvb2stc3RhdGljLydcbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsb0JBQW9CO0FBQzdVLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUp4QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLFFBQVEsU0FBUztBQUV2QixTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixPQUFPO0FBQUE7QUFBQSxNQUVQLElBQUk7QUFBQSxRQUNGLFNBQVMsQ0FBQyxZQUFZLFlBQVk7QUFBQSxRQUNsQyxTQUFTLENB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
