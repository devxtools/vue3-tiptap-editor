# vue3-tiptap-editor
A Vue 3 rich text editor component based on [👉 Tiptap](https://tiptap.dev/docs/resources/whats-new), with built-in core features and full extensibility.

📚 [👉 中文文档](/README.cn.md)

```text
Due to project requirements and the lack of an out-of-the-box Vue 3 component from the official Tiptap site, this wrapper was created to provide a ready-to-use solution for our project.
```


✅ Supports reactivity
+ Built-in upload module for videos, images, audio, and various files, including support for external video links
+ Theme customization supported via CSS variables—easily overridden using :root

installation
```text
npm i vue3-tiptap-editor
pnpm add vue3-tiptap-editor
```

```js
// xxx.vue
<script lang="ts" setup>
import { ref } from 'vue';
import { VueEditor, useMods } from 'vue3-tiptap-editor';
import '@/assets/style/editor.css';
import '@/assets/style/tools-bar.css';
// import YouPlugin from 'YouPlugin';

const EditorOptions = ref({
    extensions: [
        // 扩展 plugin
        // YouPlugin,
    ],
    uploaderHooks:{
        action: 'Your interface',
        formDataHook(FormData, data) {
            // Configure the parameters you want through FormData
        },
        exceedSize(file) { // For example: greater than 10MB,
            const MAX_SIZE = 1000 * 1024 * 1024; // 1000MB
            const bool = file.size > MAX_SIZE;
            if (bool) {
                // You can put your Toast, Message, etc. here
                console.log('The maximum upload file size is 1000MB');
            }
            return bool;
        },
        filelink(rs) {
            return rs.data.filelink;
        }
    },
})

</script>
<!-- Responsive scenes -->
<template>
    <div class="xl:p-[100px]">
        <VueEditor :options="EditorOptions"></VueEditor>
    </div>
</template>
```

## options 参数说明
| 参数名   | 类型     | 默认值   | 描述                       |
|----------|----------|----------|----------------------------|
| `extensions`  | `Array` | `'[]'`     | 插件扩展。可参考 [Tiptap 自定义扩展文档](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new) |
| `uploaderHooks`  | `Object` | `'uploaderHooks'`     | 上传文件相关的钩子函数集合，用于扩展上传行为（如校验、预处理、自定义上传等） |

## uploaderHooks 参数说明
| 参数名   | 类型     | 默认值   | 描述                       |
|----------|----------|----------|----------------------------|
| `action`  | `string` | `'null'`     | 上传文件的接口地址 |
| `formDataHook`  | `Function(FormData, data)` | `-`     | 可自定义提交参数 |
| `exceedSize`  | `Function(file)` | `-`     | 判断文件大小，返回true则继续上传，false拦截并停止上传 |
| `filelink`  | `Function(res)` | `res.data.filelink、res.data.url、res.data.fileurl、res.data`     | 上传成功后返回访问文件的地址给filelink |


## useEditors
```js
import { useEditors } from 'vue3-tiptap-editor';
const { charsWords } = useEditors();
const editorCharsWords = computed(()=> charsWords());
```

| 参数名   | 类型     | 默认值   | 描述                       |
|----------|----------|----------|----------------------------|
| `charsWords`  | `Function` | `-`     | 读取编辑器内的字符长度、单词长度 |
