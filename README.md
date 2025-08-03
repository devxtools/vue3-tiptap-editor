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

## options
| Parameter       | Type     | Default           | Description                                                                                                                                 |
| --------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `extensions`    | `Array`  | `[]`              | Plugin extensions. Refer to [Tiptap Custom Extensions](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new) for details. |
| `uploaderHooks` | `Object` | `'uploaderHooks'` | A collection of hooks related to file uploading, allowing behaviors like validation, preprocessing, and custom upload logic.                |

## uploaderHooks 
| Parameter      | Type                       | Default                                                                | Description                                                                |
| -------------- | -------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `action`       | `string`                   | `null`                                                                 | The URL endpoint for file uploads.                                         |
| `formDataHook` | `Function(FormData, data)` | `-`                                                                    | Allows customization of the upload request payload.                        |
| `exceedSize`   | `Function(file)`           | `-`                                                                    | Function to check file size. Return `true` to proceed or `false` to block. |
| `filelink`     | `Function(res)`            | `res.data.filelink`, `res.data.url`, `res.data.fileurl`, or `res.data` | Defines how to extract the file URL from the upload response.              |


## useEditors
```js
import { useEditors } from 'vue3-tiptap-editor';
const { charsWords } = useEditors();
const editorCharsWords = computed(()=> charsWords());
```

| Parameter    | Type       | Default | Description                                                       |
| ------------ | ---------- | ------- | ----------------------------------------------------------------- |
| `charsWords` | `Function` | `-`     | Returns the number of characters and words in the editor content. |
