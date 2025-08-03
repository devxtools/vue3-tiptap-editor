declare module 'vue3-tiptap-editor' {
    import type { DefineComponent } from 'vue'

    // VueEditor.vue 导出的组件
    export const VueEditor: DefineComponent<any, any, any>

    // useEditors.ts 导出的组合式函数
    export function useEditors(): {
        charsWords: () => { chars: number; words: number },
        toggleOption: (mod: string, attrs?: Record<string, any>)=> void
    }
}
