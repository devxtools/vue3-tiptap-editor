# Uploader 分片上传组件

`Uploader` 是一个轻量的原生 JavaScript 分片上传器，适用于大文件上传。支持网络感知、进度回调、自定义表单字段、调试模式等功能。

## ✨ 功能特性

- ✅ 支持自动分片（默认按文件大小和网络环境判断）
- ✅ 支持精准的上传进度回调
- ✅ 支持附加字段 / 自定义 `FormData` 钩子

---

## 📦 安装方式（如果你是 npm 包）

```bash
pnpm add uploader
```

```js
const uploader = new Uploader(file, {
  url: '/upload',
  chunkSize: 2 * 1024 * 1024, // 每片 2MB
  debug: import.meta.env.MODE === 'development',
  headers: {
    Authorization: 'Bearer token',
  },
  data: {
    userId: '12345',
  },
  onProgress: (percent, loaded, total) => {
    console.log(`进度：${percent.toFixed(2)}%`);
  },
  onSuccess: () => {
    console.log('上传完成！');
  },
  onError: (err) => {
    console.error('上传失败：', err);
  },
  formDataHook: (formData, ctx) => {
    // ctx 分片相关参数
    formData.append('token', 'xxxx...');
    formData.append('chunked', String(ctx.isChunked));
  },
});

uploader.start();
```

### 📘 API 文档
new Uploader(file, options)
| 参数        | 类型                | 说明       |
| --------- | ----------------- | -------- |
| `file`    | `File`            | 要上传的文件对象 |
| `options` | `UploaderOptions` | 上传配置（见下） |

### UploaderOptions 配置项
| 字段             | 类型                                 | 默认值           | 说明                 |
| -------------- | ---------------------------------- | ------------- | ------------------ |
| `url`          | `string`                           | 必填            | 接收上传的服务端地址         |
| `chunkSize`    | `number`                           | `1024 * 1024` | 分片大小，单位 Byte       |
| `headers`      | `Record<string, string>`           | -             | 自定义请求头             |
| `data`         | `Record<string, string>`           | -             | 附加表单字段             |
| `onProgress`   | `(percent, loaded, total) => void` | -             | 上传进度回调             |
| `onSuccess`   | `() => void`                       | -             | 上传完成回调             |
| `onError`      | `(err: any) => void`               | -             | 出错回调               |
| `formDataHook` | `(formData, ctx) => void`          | -             | 每次发送前处理 `FormData` |
| `debug`        | `boolean`                          | `development`       | 开启调试模式，仅推荐开发环境使用   |

### 实例方法
| 方法名        | 返回值    | 说明             |
| ---------- | ------ | -------------- |
| `.start()` | `void` | 启动上传（自动判断是否分片） |
| `.abort()` | `void` | 中断上传并取消所有请求    |
