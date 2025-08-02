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

##### 文档还在编写中...
