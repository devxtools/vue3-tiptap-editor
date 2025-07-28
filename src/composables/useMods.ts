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
    return {
        toggleOption,
    }
}

export default useMods;