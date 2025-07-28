import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';

import { Editor, type JSONContent } from '@tiptap/vue-3';

import useUploader from '@/components/uploader/plugin';
import FontColorPlugin from '@/components/FontColor/plugin';

export function useEditor(options?: any, defaultContent?: string | JSONContent | null) {
    if (!options) options = {};
    const editor = ref<Editor>(); // 每次调用都是新的
    const ExternalExtensions = [].concat(options.extensions||[]);
    const extensions = [
        StarterKit.configure({
            link: false,  // 禁用内置的 link
        }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure(),
        TaskList,
        TaskItem,
        Highlight.configure({
            multicolor: true,
        }),
        Link.configure({
            openOnClick: false, // 编辑器内禁用点击跳转
        }),
        Superscript,
        Subscript,
        TextAlign.configure({
            types: ['heading', 'paragraph'], // 允许对齐的节点类型
        }),
        Image,
        useUploader(),
        FontColorPlugin,
        ...ExternalExtensions
    ]
    delete options.extensions;
    options = Object.assign({
        extensions,
        content: `
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
        `,
        onRemoveUploader() {
            console.log('delete uploader');
        },
    }, options);
    
    editor.value = new Editor(options); // 假设你用 Tiptap 等创建编辑器实例
   
    onBeforeUnmount(() => {
        editor.value?.destroy();
    });

    return {
        editor
    };
}
