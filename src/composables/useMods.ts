import { isRef, type Ref } from 'vue';
import type { Editor, JSONContent, ChainedCommands } from '@tiptap/vue-3'

export function useMods(editor: Editor) {
    function toggleOption(mod: string, attrs?: Record<string, any>) {
        const chain = editor?.chain().focus();
        // @ts-ignore
        const command = chain[mod];
        if (command) {
            command(attrs).run()
        }
    }

    function charsWords() {
        if (!editor) return;
        let chars = 0, words = 0
        editor?.state.doc.descendants((node: { isText: any; text?: string }) => {
            if (node.isText) {
                chars += node.text?.length ?? 0;
                words += (node.text?.match(/\S+/g) ?? []).length;
            }
        })
        return { chars, words }
    }

    return {
        charsWords,
        toggleOption
    }
}

export default useMods;