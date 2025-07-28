<script lang="ts" setup>
import { ref } from 'vue';
import { VueEditor } from 'vue3-tiptap-editor';
import '../../dist/index.css';
// import YouPlugin from 'YouPlugin';

const EditorOptions = ref({
    extensions: [
        // 扩展 plugin
        // YouPlugin,
    ],
    uploaderHooks:{
        action: 'Your upload interface url',
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