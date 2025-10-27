<template>
  <div class="popover-demo">
    <h2>基础用法</h2>
    <div class="demo-block">
      <Popover title="标题" content="这是一段内容">
        <a-button>悬停我</a-button>
      </Popover>
    </div>

    <h2>不同触发方式</h2>
    <div class="demo-block">
      <div class="demo-row">
        <div class="demo-item">
          <h3>悬停触发</h3>
          <Popover title="标题" content="这是一段内容" trigger="hover">
            <a-button>悬停我</a-button>
          </Popover>
        </div>
        
        <div class="demo-item">
          <h3>点击触发</h3>
          <Popover title="标题" content="这是一段内容" trigger="click">
            <a-button>点击我</a-button>
          </Popover>
        </div>
        
        <div class="demo-item">
          <h3>聚焦触发</h3>
          <Popover title="标题" content="这是一段内容" trigger="focus">
            <a-input placeholder="点击输入框" style="width: 200px;" />
          </Popover>
        </div>
      </div>
      
      <div class="demo-row" style="margin-top: 20px;">
        <div class="demo-item">
          <h3>右键菜单触发</h3>
          <Popover title="右键菜单" content="这是一个右键菜单" trigger="contextmenu">
            <div style="width: 200px; height: 100px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center;">
              右键点击此区域
            </div>
          </Popover>
        </div>
        
        <div class="demo-item">
          <h3>多种触发方式</h3>
          <Popover title="多种触发" content="支持多种触发方式" :trigger="['hover', 'click']">
            <a-button>悬停或点击</a-button>
          </Popover>
        </div>
      </div>
    </div>

    <h2>不同位置</h2>
    <div class="demo-block">
      <div class="placement-container">
        <div class="placement-row">
          <Popover content="左上角气泡" placement="topLeft">
            <a-button>左上角</a-button>
          </Popover>
          
          <Popover content="上方气泡" placement="top">
            <a-button>上方</a-button>
          </Popover>
          
          <Popover content="右上角气泡" placement="topRight">
            <a-button>右上角</a-button>
          </Popover>
        </div>
        
        <div class="placement-row placement-middle">
          <div class="placement-col">
            <Popover content="左上方气泡" placement="leftTop">
              <a-button>左上方</a-button>
            </Popover>
            
            <Popover content="左侧气泡" placement="left">
              <a-button>左侧</a-button>
            </Popover>
            
            <Popover content="左下方气泡" placement="leftBottom">
              <a-button>左下方</a-button>
            </Popover>
          </div>
          
          <div class="placement-center">
            <div>12个方向</div>
          </div>
          
          <div class="placement-col">
            <Popover content="右上方气泡" placement="rightTop">
              <a-button>右上方</a-button>
            </Popover>
            
            <Popover content="右侧气泡" placement="right">
              <a-button>右侧</a-button>
            </Popover>
            
            <Popover content="右下方气泡" placement="rightBottom">
              <a-button>右下方</a-button>
            </Popover>
          </div>
        </div>
        
        <div class="placement-row">
          <Popover content="左下角气泡" placement="bottomLeft">
            <a-button>左下角</a-button>
          </Popover>
          
          <Popover content="下方气泡" placement="bottom">
            <a-button>下方</a-button>
          </Popover>
          
          <Popover content="右下角气泡" placement="bottomRight">
            <a-button>右下角</a-button>
          </Popover>
        </div>
      </div>
    </div>

    <h2>富文本内容</h2>
    <div class="demo-block">
      <Popover 
        title="富文本内容" 
        content="<p>这是一段<strong>富文本</strong>内容，支持 <a href='#'>链接</a>。</p><ul><li>列表项 1</li><li>列表项 2</li></ul>"
        :rich="true"
      >
        <a-button>富文本内容</a-button>
      </Popover>
    </div>

    <h2>主题</h2>
    <div class="demo-block">
      <div class="demo-row">
        <div class="demo-item">
          <h3>亮色主题（默认）</h3>
          <Popover 
            title="亮色主题" 
            content="这是亮色主题的气泡" 
            theme="light"
          >
            <a-button>亮色主题</a-button>
          </Popover>
        </div>
        
        <div class="demo-item">
          <h3>暗色主题</h3>
          <Popover 
            title="暗色主题" 
            content="这是暗色主题的气泡" 
            theme="dark"
          >
            <a-button>暗色主题</a-button>
          </Popover>
        </div>
      </div>
    </div>

    <h2>自定义内容</h2>
    <div class="demo-block">
      <Popover>
        <template #title>
          <div style="display: flex; align-items: center;">
            <span style="color: #1890ff; margin-right: 8px;">
              <info-circle-outlined />
            </span>
            <span>自定义标题</span>
          </div>
        </template>
        <template #content>
          <div style="padding: 8px;">
            <p>自定义内容区域</p>
            <div style="margin-top: 8px;">
              <a-button type="primary" size="small">确认</a-button>
              <a-button size="small" style="margin-left: 8px;">取消</a-button>
            </div>
          </div>
        </template>
        <a-button>自定义内容</a-button>
      </Popover>
    </div>

    <h2>自定义样式</h2>
    <div class="demo-block">
      <div class="demo-row">
        <div class="demo-item">
          <h3>无箭头</h3>
          <Popover 
            title="无箭头" 
            content="这是一个没有箭头的气泡" 
            :showArrow="false"
          >
            <a-button>无箭头</a-button>
          </Popover>
        </div>
        
        <div class="demo-item">
          <h3>最大宽度</h3>
          <Popover 
            title="最大宽度" 
            content="这是一个设置了最大宽度的气泡，内容很长时会自动换行，避免气泡过宽。这是一个设置了最大宽度的气泡，内容很长时会自动换行，避免气泡过宽。" 
            :maxWidth="200"
          >
            <a-button>最大宽度</a-button>
          </Popover>
        </div>
        
        <div class="demo-item">
          <h3>自定义偏移</h3>
          <Popover 
            title="自定义偏移" 
            content="这是一个设置了偏移量的气泡" 
            :offset="[20, 20]"
          >
            <a-button>自定义偏移</a-button>
          </Popover>
        </div>
      </div>
    </div>

    <h2>边界检测</h2>
    <div class="demo-block">
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <Popover 
          content="这个气泡会自动调整位置，避免超出视口"
          :autoAdjustOverflow="true"
        >
          <a-button>边缘位置</a-button>
        </Popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Popover from './Popover.vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
</script>

<style lang="scss" scoped>
.popover-demo {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  
  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }
  
  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
  }
  
  .demo-block {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background-color: #fafafa;
  }
  
  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
  
  .demo-item {
    flex: 1;
    min-width: 200px;
  }
  
  // 位置演示样式
  .placement-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .placement-row {
    display: flex;
    gap: 20px;
  }
  
  .placement-middle {
    width: 100%;
    justify-content: space-between;
  }
  
  .placement-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .placement-center {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
  }
}
</style> 