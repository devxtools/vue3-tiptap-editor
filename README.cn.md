# vue3-tiptap-editor

基于 [👉 Tiptap](https://tiptap.dev/docs/resources/whats-new) + Vue3 集成基础功能并保留扩展空间的Vue3富文本编辑器组件

📚 [👉 English Documentation](/README.md)

```text
因项目需要但官网并没有给出开箱即用的Vue3组件版，所以封装一个为了项目能开箱即用！
```

+ ✅ 支持响应式
+ 内置上传模块，视频、图像、音频、各种文件，与外部视频链接
+ 可自定义配主题我，主要css变量定义，可用root去做变量复盖

installation
```text
npm i vue3-tiptap-editor
pnpm add vue3-tiptap-editor
```

```js
// xxx.vue
<script lang="ts" setup>
import { ref } from 'vue';
import { VueEditor } from 'vue3-tiptap-editor';
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
        formDataHook(FormData, ctx) {
            // 通过FormData自行配置你要的参数
        },
        exceedSize(file) { // 例如：大于10MB，
            const MAX_SIZE = 1000 * 1024 * 1024; // 1000MB
            const bool = file.size > MAX_SIZE;
            if (bool) {
                // 你可以在这放你的Toast, Message 这类的
                console.log('最大上传文件为1000MB');
            }
            return bool;
        },
        filelink(rs) {
            return rs.data.filelink;
        }
    },
})

</script>
<!-- 响应式场景 -->
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

