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
    <div class="-t-v-tiptap-editor">
      <EditorContent class="-editor-content" :editor="editor" />
    </div>
    <slot name="end"></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, useSlots, nextTick, computed, watch } from 'vue';
import { EditorContent, JSONContent } from '@tiptap/vue-3';
import ToolsBar from '@/components/ToolsBar/index.vue';
import { useEditor } from '@/composables/useEditor';
import { useToolbarFollowKeyboard } from '@/composables/useToolbarFollowKeyboard';
type Props = {
  options?: Record<string, any>;
  screen?: string;
  toolsbar?: string[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  options: ()=> ({}),
  toolsbar: ()=> [
    'solid',
    'undo', 'redo', 
    'solid',
    'Heading','List','blockquote','codeBlock',
    'solid',
    'bold', 'italic', 'strike', 'code', 'underline',
    'fontBgColor', 'fontColor', 'Link', 'UploaderFiles', 'alignLeft', 'alignCenter',
    'alignRight', 'alignJustify', 'subscript', 'superscript'
  ],
  screen: 'xl',
  placeholder: '👉 Tiptap + Vue3 integrates basic functions of the rich text editor, you can happily edit...'
})

const editorHtml = defineModel('html');
const editorJson = defineModel('json', { type: Object, default: ()=> { return { type: 'doc', content:[] } } });

// const slots = useSlots();
const ToolsBarRef = ref();
const { editor } = useEditor(props.options);
const { offsetBottom, maxScrollY, keyboardHeight, isDesktop, isScrolling } = useToolbarFollowKeyboard(ToolsBarRef, props.screen);
provide('editor', editor); // 提供给所有子组件
provide('desktop', isDesktop); // 提供给所有子组件
provide('popupOffsetTop', offsetBottom); // 提供给所有子组件
provide('isScrolling', isScrolling); // 提供给所有子组件

function updateData() {
  editorJson.value = editor.value?.getJSON();
  editorHtml.value = editor.value?.getHTML();
}

function setContent(htmlJson: string|JSONContent) {
  editor.value?.commands.setContent(htmlJson);
}

editor.value?.on('update', ()=> {
  updateData();
})

onMounted(()=>{
  if (editorJson.value && editorJson.value.content?.length) {
    setContent(editorJson.value);
  } else if(editorHtml.value) {
    setContent(editorHtml.value);
  }
})

defineExpose({
  editor,
  setContent,
  getHTML() {
    return editor.value?.getHTML()
  },
  getJSON() {
    return editor.value?.getJSON()
  },
})
</script>
