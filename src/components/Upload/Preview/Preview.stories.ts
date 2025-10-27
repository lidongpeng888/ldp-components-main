import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import type { UploadFile } from 'ant-design-vue'

import FilePreview from './FilePreview.vue'

// 扩展 File 类型以包含 uid 属性
interface ExtendedFile extends File {
  uid?: string
}

// 模拟文件数据
const createMockFile = (name: string, type: string, url: string): UploadFile => {
  const file = new File([''], name, { type }) as ExtendedFile
  // 添加 uid 属性到 File 对象
  file.uid = Math.random().toString()
  
  return {
    uid: Math.random().toString(),
    name,
    status: 'done',
    type,
    size: Math.floor(Math.random() * 1024 * 1024 * 10), // 随机大小 0-10MB
    url,
    originFileObj: file
  }
}

const mockFiles = {
  image: createMockFile(
    'sample-image.jpg',
    'image/jpeg',
    'https://via.placeholder.com/800x600/4CAF50/white?text=Sample+Image'
  ),
  video: createMockFile(
    'sample-video.mp4',
    'video/mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4'
  ),
  pdf: createMockFile(
    'sample-document.pdf',
    'application/pdf',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  ),
  text: createMockFile(
    'readme.txt',
    'text/plain',
    'data:text/plain;base64,SGVsbG8gV29ybGQh'
  )
}

const meta: Meta<typeof FilePreview> = {
  title: 'Components/Upload/Preview',
  component: FilePreview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '文件预览组件，支持图片、视频、文档等多种文件类型的预览功能。'
      }
    }
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['thumbnail', 'inline', 'modal'],
      description: '预览模式'
    },
    width: {
      control: 'number',
      description: '预览组件宽度'
    },
    height: {
      control: 'number',
      description: '预览组件高度'
    },
    lazy: {
      control: 'boolean',
      description: '是否启用懒加载'
    }
  }
}

export default meta
type Story = StoryObj<typeof FilePreview>

// 基础预览
export const Default: Story = {
  args: {
    file: mockFiles.image,
    mode: 'thumbnail',
    width: 200,
    height: 200,
    lazy: false
  }
}

// 图片预览
export const ImagePreviewStory: Story = {
  render: () => ({
    components: { FilePreview },
    setup() {
      return { mockFiles }
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div>
          <h4>缩略图模式</h4>
          <FilePreview 
            :file="mockFiles.image" 
            mode="thumbnail" 
            :width="150" 
            :height="150"
            :lazy="false"
          />
        </div>
        <div>
          <h4>内联模式</h4>
          <FilePreview 
            :file="mockFiles.image" 
            mode="inline" 
            :width="300"
            :lazy="false"
          />
        </div>
      </div>
    `
  })
}

// 视频预览
export const VideoPreviewStory: Story = {
  render: () => ({
    components: { FilePreview },
    setup() {
      return { mockFiles }
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div>
          <h4>视频缩略图</h4>
          <FilePreview 
            :file="mockFiles.video" 
            mode="thumbnail" 
            :width="200" 
            :height="150"
            :lazy="false"
          />
        </div>
        <div>
          <h4>视频播放器</h4>
          <FilePreview 
            :file="mockFiles.video" 
            mode="inline" 
            :width="400"
            :lazy="false"
          />
        </div>
      </div>
    `
  })
}

// 文档预览
export const DocumentPreview: Story = {
  render: () => ({
    components: { FilePreview },
    setup() {
      return { mockFiles }
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div>
          <h4>PDF 缩略图</h4>
          <FilePreview 
            :file="mockFiles.pdf" 
            mode="thumbnail" 
            :width="150" 
            :height="200"
            :lazy="false"
          />
        </div>
        <div>
          <h4>PDF 预览</h4>
          <FilePreview 
            :file="mockFiles.pdf" 
            mode="inline" 
            :width="400"
            :height="500"
            :lazy="false"
          />
        </div>
      </div>
    `
  })
}

// 多种文件类型
export const MultipleFileTypes: Story = {
  render: () => ({
    components: { FilePreview },
    setup() {
      return { mockFiles }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
        <div>
          <h4>图片</h4>
          <FilePreview 
            :file="mockFiles.image" 
            mode="thumbnail" 
            :width="150" 
            :height="150"
            :lazy="false"
          />
        </div>
        <div>
          <h4>视频</h4>
          <FilePreview 
            :file="mockFiles.video" 
            mode="thumbnail" 
            :width="150" 
            :height="150"
            :lazy="false"
          />
        </div>
        <div>
          <h4>PDF</h4>
          <FilePreview 
            :file="mockFiles.pdf" 
            mode="thumbnail" 
            :width="150" 
            :height="150"
            :lazy="false"
          />
        </div>
        <div>
          <h4>文本</h4>
          <FilePreview 
            :file="mockFiles.text" 
            mode="thumbnail" 
            :width="150" 
            :height="150"
            :lazy="false"
          />
        </div>
      </div>
    `
  })
}

// 懒加载演示
export const LazyLoading: Story = {
  render: () => ({
    components: { FilePreview },
    setup() {
      const files = ref([
        mockFiles.image,
        mockFiles.video,
        mockFiles.pdf,
        mockFiles.text
      ])
      return { files }
    },
    template: `
      <div style="height: 200vh; padding: 20px;">
        <h3>向下滚动查看懒加载效果</h3>
        <div style="margin-top: 100vh;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
            <FilePreview 
              v-for="file in files"
              :key="file.uid"
              :file="file" 
              mode="thumbnail" 
              :width="150" 
              :height="150"
              :lazy="true"
            />
          </div>
        </div>
      </div>
    `
  })
}

// 交互式预览
export const Interactive: Story = {
  render: () => ({
    components: { FilePreview },
    setup() {
      const selectedFile = ref(mockFiles.image)
      const mode = ref('thumbnail')
      
      const handleFileChange = (event: Event) => {
        const target = event.target as HTMLSelectElement
        const fileKey = target.value
        selectedFile.value = mockFiles[fileKey as keyof typeof mockFiles]
      }
      
      const handleModeChange = (event: Event) => {
        const target = event.target as HTMLSelectElement
        mode.value = target.value
      }
      
      return { 
        mockFiles, 
        selectedFile, 
        mode, 
        handleFileChange, 
        handleModeChange 
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <label>选择文件类型: </label>
          <select @change="handleFileChange">
            <option value="image">图片</option>
            <option value="video">视频</option>
            <option value="pdf">PDF</option>
            <option value="text">文本</option>
          </select>
          
          <label style="margin-left: 16px;">预览模式: </label>
          <select @change="handleModeChange">
            <option value="thumbnail">缩略图</option>
            <option value="inline">内联</option>
          </select>
        </div>
        
        <FilePreview 
          :file="selectedFile" 
          :mode="mode" 
          :width="mode === 'thumbnail' ? 200 : 400"
          :height="mode === 'thumbnail' ? 200 : undefined"
          :lazy="false"
        />
      </div>
    `
  })
}