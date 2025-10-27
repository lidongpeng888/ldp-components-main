<template>
  <div class="code-highlight">
    <pre
      ref="codeRef"
      :class="['code-block', `language-${language}`]"
    ><code
      :class="`language-${language}`"
      v-html="highlightedCode"
    ></code></pre>
    
    <!-- 行号显示 -->
    <div v-if="showLineNumbers" class="line-numbers">
      <span
        v-for="lineNumber in lineCount"
        :key="lineNumber"
        class="line-number"
      >
        {{ lineNumber }}
      </span>
    </div>
    
    <!-- 复制按钮 -->
    <button
      v-if="showCopyButton"
      class="copy-button"
      @click="copyCode"
    >
      <CopyOutlined />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useClipboard } from '@vueuse/core'

// 定义组件名称
defineOptions({
  name: 'CodeHighlight'
})

// Props 定义
interface CodeHighlightProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  theme?: 'light' | 'dark'
  maxHeight?: string
}

const props = withDefaults(defineProps<CodeHighlightProps>(), {
  language: 'javascript',
  showLineNumbers: false,
  showCopyButton: true,
  theme: 'light',
  maxHeight: '400px'
})

// 状态管理
const codeRef = ref<HTMLElement>()
const highlightedCode = ref('')

// 剪贴板功能
const { copy, isSupported: clipboardSupported } = useClipboard()

// 计算属性
const lineCount = computed(() => {
  return props.code.split('\n').length
})

// 简单的语法高亮实现
const highlightCode = (code: string, language: string): string => {
  // 这里实现一个简单的语法高亮
  // 在实际项目中，建议使用 Prism.js 或 highlight.js
  
  let highlighted = code
  
  if (language === 'vue' || language === 'html') {
    // HTML/Vue 标签高亮
    highlighted = highlighted.replace(
      /(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)(&gt;)/g,
      '$1<span class="tag">$2</span>$3$4'
    )
    
    // 属性高亮
    highlighted = highlighted.replace(
      /([a-zA-Z-]+)(=)(".*?")/g,
      '<span class="attr-name">$1</span>$2<span class="attr-value">$3</span>'
    )
  }
  
  if (language === 'javascript' || language === 'typescript' || language === 'vue') {
    // 关键字高亮
    const keywords = [
      'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
      'import', 'export', 'default', 'class', 'extends', 'interface', 'type',
      'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this'
    ]
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
      highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>')
    })
    
    // 字符串高亮
    highlighted = highlighted.replace(
      /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
      '<span class="string">$1$2$1</span>'
    )
    
    // 注释高亮
    highlighted = highlighted.replace(
      /(\/\/.*$)/gm,
      '<span class="comment">$1</span>'
    )
    
    highlighted = highlighted.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span class="comment">$1</span>'
    )
    
    // 数字高亮
    highlighted = highlighted.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      '<span class="number">$1</span>'
    )
  }
  
  return highlighted
}

// 方法定义
const copyCode = async () => {
  if (!clipboardSupported) {
    message.error('浏览器不支持剪贴板功能')
    return
  }
  
  try {
    await copy(props.code)
    message.success('代码已复制到剪贴板')
  } catch (error) {
    message.error('复制失败')
  }
}

const updateHighlight = () => {
  // HTML 转义
  const escapedCode = props.code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
  
  highlightedCode.value = highlightCode(escapedCode, props.language)
}

// 生命周期
onMounted(() => {
  updateHighlight()
})

// 监听代码变化
watch([() => props.code, () => props.language], () => {
  updateHighlight()
})

// 暴露组件方法
defineExpose({
  copyCode,
  getCode: () => props.code,
  getHighlightedCode: () => highlightedCode.value
})
</script>

<style lang="scss" scoped>
.code-highlight {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;

  .code-block {
    margin: 0;
    padding: 16px;
    background: transparent;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre;
    color: #333;

    code {
      background: transparent;
      padding: 0;
      border: none;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }
  }

  .line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: #f0f0f0;
    border-right: 1px solid #e8e8e8;
    padding: 16px 8px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #999;
    user-select: none;

    .line-number {
      display: block;
      text-align: right;
    }
  }

  .copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: #fff;
    color: #666;
    cursor: pointer;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;

    &:hover {
      border-color: #1890ff;
      color: #1890ff;
    }
  }

  &:hover .copy-button {
    opacity: 1;
  }

  // 当显示行号时，调整代码块的左边距
  &:has(.line-numbers) .code-block {
    padding-left: 56px;
  }
}

// 语法高亮样式
:deep(.code-block) {
  .keyword {
    color: #d73a49;
    font-weight: 600;
  }

  .string {
    color: #032f62;
  }

  .comment {
    color: #6a737d;
    font-style: italic;
  }

  .number {
    color: #005cc5;
  }

  .tag {
    color: #22863a;
    font-weight: 600;
  }

  .attr-name {
    color: #6f42c1;
  }

  .attr-value {
    color: #032f62;
  }
}

// 深色主题
.code-highlight[data-theme="dark"] {
  background: #1e1e1e;
  border-color: #333;

  .code-block {
    color: #d4d4d4;
  }

  .line-numbers {
    background: #252526;
    border-color: #333;
    color: #858585;
  }

  .copy-button {
    background: #2d2d30;
    border-color: #464647;
    color: #cccccc;

    &:hover {
      border-color: #007acc;
      color: #007acc;
    }
  }

  :deep(.code-block) {
    .keyword {
      color: #569cd6;
    }

    .string {
      color: #ce9178;
    }

    .comment {
      color: #6a9955;
    }

    .number {
      color: #b5cea8;
    }

    .tag {
      color: #4ec9b0;
    }

    .attr-name {
      color: #9cdcfe;
    }

    .attr-value {
      color: #ce9178;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .code-highlight {
    .code-block {
      font-size: 12px;
      padding: 12px;
    }

    .line-numbers {
      width: 32px;
      padding: 12px 4px;
      font-size: 12px;
    }

    &:has(.line-numbers) .code-block {
      padding-left: 44px;
    }
  }
}
</style>