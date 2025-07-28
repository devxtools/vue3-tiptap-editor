<template>
  <div 
    class="-t-v-editor-wrapper" 
    :class="{'-t-v-editor-h5-wrapper': !isDesktop}"
    :style="`--t-v-keyboard-height: ${keyboardHeight}px;`"
  >
    <slot name="start"></slot>
    <ToolsBar 
      v-show="editor" 
      ref="ToolsBarRef"
      tabindex="-1"
      contenteditable="false"
      :extensions="props.toolsbar"
    >
      <template #before>
        <slot name="toolsStart"></slot>
      </template>
      <template #after>
        <slot name="toolsAfter"></slot>
      </template>
    </ToolsBar>
    <EditorContent class="-t-v-tiptap-editor" :editor="editor"/>
    <slot name="end"></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, useSlots, nextTick, computed } from 'vue';
import { EditorContent, JSONContent } from '@tiptap/vue-3';
import ToolsBar from '@/components/ToolsBar/index.vue';
import { useEditor } from '@/composables/useEditor';
import { useToolbarFollowKeyboard } from '@/composables/useToolbarFollowKeyboard';
type Props = {
  options?: Record<string, any>;
  screen?: string;
  toolsbar?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  options: ()=> ({}),
  screen: 'xl',
  toolsbar: ()=> [
    'solid',
    'undo', 'redo', 
    'solid',
    'Heading','List','blockquote','codeBlock',
    'solid',
    'bold', 'italic', 'strike', 'code', 'underline',
    'fontBgColor', 'fontColor', 'Link', 'UploaderFiles', 'alignLeft', 'alignCenter',
    'alignRight', 'alignJustify', 'subscript', 'superscript'
  ]
})
const slots = useSlots();
const ToolsBarRef = ref();

const { editor } = useEditor(props.options);
const { offsetBottom, maxScrollY, keyboardHeight, isDesktop, isScrolling } = useToolbarFollowKeyboard(ToolsBarRef, props.screen);
provide('editor', editor); // 提供给所有子组件
provide('desktop', isDesktop); // 提供给所有子组件
provide('popupOffsetTop', offsetBottom); // 提供给所有子组件
provide('isScrolling', isScrolling); // 提供给所有子组件

function getStats() {
    let chars = 0, words = 0
    editor.value?.state.doc.descendants((node: { isText: any; text?: string }) => {
        if (node.isText) {
            chars += node.text?.length ?? 0;
            words += (node.text?.match(/\S+/g) ?? []).length;
        }
    })
    return { chars, words }
}

defineExpose({
  editor,
  setContent(html: string|JSONContent) {
    editor.value?.commands.setContent(html)
  },
  getHTML() {
    return editor.value?.getHTML()
  },
  getJSON() {
    return editor.value?.getJSON()
  },
  getStats
})
</script>
