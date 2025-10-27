// dayjs类型声明文件
declare module 'dayjs' {
  import dayjs from 'dayjs';
  export default dayjs;
}

declare module 'dayjs/plugin/utc' {
  const plugin: any;
  export default plugin;
}

declare module 'dayjs/plugin/timezone' {
  const plugin: any;
  export default plugin;
}

declare module 'dayjs/plugin/customParseFormat' {
  const plugin: any;
  export default plugin;
} 