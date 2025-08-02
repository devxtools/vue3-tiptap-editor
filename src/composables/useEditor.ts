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

import useUploader from '@/components/Uploader/plugin';
import FontColorPlugin from '@/components/FontColor/plugin';

export function useEditor(options?: any, placeholder?: string) {
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
        content: null,
        // onRemoveUploader() {
        //     console.log('delete uploader');
        // },
    }, options);
    
    editor.value = new Editor(options); // 假设你用 Tiptap 等创建编辑器实例
   
    onBeforeUnmount(() => {
        editor.value?.destroy();
    });

    return {
        editor
    };
}
