<script lang="ts" setup>
import { ref } from 'vue';
import { VueEditor } from 'vue3-tiptap-editor';
// import '../../../vue3-tiptap-editor/dist/index.css';
// import YouPlugin from 'YouPlugin';

const editorContent = ref(`
    <h1>H1</h1>
    <h2>H2</h2>
    <h3>H3</h3>
    <h4>H4</h4>
    <p><strong>vue3-tiptap-vue is a Vue3 component based on Tiptap + Vue3 integrated basic functions, not dependent on any UI framework</strong></p>
    <p>It is compatible with responsive layout, solving the problem of toolbar always staying within the visible screen range in H5 scenarios! However, it is a solution that is fixed close to the bottom.</p>
    <p>Because the project needs a rich text, I chose Tiptap, which does not have a component with integrated basic functions in the Vue3 version! So I had to write it myself! Then I extracted it and published it on NPM for easy use in other projects! Haha!</p>
    <ul>
        <li><p>Bullet List 1</p></li>
        <li><p>Bullet List 2</p></li>
        <li><p>Bullet List 3</p></li>
    </ul>

    <ol>
        <li><p>Ordered List1</p></li>
        <li><p>Ordered List2</p></li>
        <li><p>Ordered List3</p></li>
    </ol>

    <Uploader accept="image/*, video/*" icon="media" tip="Click to Upload Image/Video"></Uploader>
    <Uploader accept="image/*" icon="addImage" tip="Click to Upload Image"></Uploader>
    <Uploader accept="video/*" icon="addVideo" tip="Click to Upload Video"></Uploader>
    <Uploader accept="iframe" icon="youtube" tip="Enter video link"></Uploader>
    <Uploader accept="audio/mpeg, audio/wav, audio/ogg, audio/webm" icon="addAudio" tip="Click to Upload Audio"></Uploader>
    <Uploader accept="application/pdf, application/msword, text/plain, application/zip, application/x-rar-compressed, application/json, text/javascript, text/html, application/octet-stream, font/ttf, font/woff" icon="file" tip="Click to Upload File"></Uploader>
`);

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
        <VueEditor :options="EditorOptions" v-model:html="editorContent"></VueEditor>
    </div>
</template>