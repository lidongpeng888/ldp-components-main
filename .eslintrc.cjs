/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:storybook/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  globals: {
    __VUE_COMPONENT_LIBRARY_VERSION__: 'readonly',
    __VUE_COMPONENT_LIBRARY_DEV__: 'readonly'
  },
  rules: {
    // Vue 相关规则
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-emits-declaration': 'error',
    'vue/define-props-declaration': 'error',
    'vue/no-unused-vars': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/require-macro-variable-name': 'error',
    
    // TypeScript 相关规则
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // 使用 TypeScript 版本
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'arrow-spacing': 'error',
    'generator-star-spacing': 'error'
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{test,spec}.*'],
      env: {
        vitest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
}