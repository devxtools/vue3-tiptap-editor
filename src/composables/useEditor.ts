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

import { Editor } from '@tiptap/vue-3';

import useUploader from '@/components/uploader/plugin';
import FontColorPlugin from '@/components/FontColor/plugin';

export function useEditor(options?: any) {
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
            <p><strong>vue-tiptap-vue 是一款基于 Tiptap + Vue3 集成基础功能的Vue3 组件，不依赖于任何UI框架</strong></p>
            <p>它兼容了响应式布局，解决了H5场景时工具栏常驻在可视屏幕范围内的问题！不过它是固定紧贴下方的方案</p>
            <p>因为项目需要一个富文本，选了Tiptap, 它没有Vue3版的集成基础功能的组件！所以只能自已写了！然后顺手抽离出来发布到NPM上，方便其它项目使用！哈哈！</p>
            <ul>
                <li><p>Bullet List 1</p></li>
                <li><p>Bullet List 2</p></li>
                <li><p>Bullet List 3</p></li>
            </ul>

            <ol>
                <li><p>Ordered List</p></li>
                <li><p>Ordered List</p></li>
                <li><p>Ordered List</p></li>
            </ol>

            <h2>后续还需扩展的功能</h2>
            <ol>
                <li><p>字体color</p></li>
                <li><p>？</p></li>
                <li><p>？</p></li>
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
