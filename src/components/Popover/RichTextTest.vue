<template>
  <div style="padding: 50px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
    <h2>富文本测试</h2>
    
    <!-- 使用rich属性 -->
    <div>
      <h3>使用rich属性</h3>
      <Popover 
        title="富文本内容" 
        content="<p>这是一段<strong>富文本</strong>内容，支持 <a href='#'>链接</a>。</p><ul><li>列表项 1</li><li>列表项 2</li></ul>"
        :rich="true"
        trigger="click"
      >
        <a-button>点击查看富文本(使用rich)</a-button>
      </Popover>
    </div>
    
    <!-- 不使用rich属性 -->
    <div>
      <h3>不使用rich属性</h3>
      <Popover 
        title="普通文本内容" 
        content="<p>这是一段<strong>富文本</strong>内容，支持 <a href='#'>链接</a>。</p><ul><li>列表项 1</li><li>列表项 2</li></ul>"
        :rich="false"
        trigger="click"
      >
        <a-button>点击查看普通文本(不使用rich)</a-button>
      </Popover>
    </div>
    
    <!-- 使用插槽方式 -->
    <div>
      <h3>使用插槽方式</h3>
      <Popover 
        title="插槽内容" 
        trigger="click"
      >
        <template #content>
          <div>
            <p>这是一段<strong>富文本</strong>内容，支持 <a href='#'>链接</a>。</p>
            <ul>
              <li>列表项 1</li>
              <li>列表项 2</li>
            </ul>
          </div>
        </template>
        <a-button>点击查看插槽内容</a-button>
      </Popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import Popover from './Popover.vue'
import { Button } from 'ant-design-vue'
</script> 