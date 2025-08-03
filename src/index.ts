import type { Ref } from 'vue';
import type { Editor } from '@tiptap/vue-3';
export * from '@tiptap/vue-3';
import { useEditor, Vue3Editor } from '@/composables/useEditor';
import { useMods } from '@/composables/useMods';
export { default as VueEditor } from '@/components/Editor.vue';

export function useEditors() {
    return useMods(Vue3Editor as Ref<Editor>);
}

export {
    useMods,
    useEditor,
    Vue3Editor
}

import './assets/style/main.css';