<script lang="ts" setup>
import { computed, type Ref, ref, inject, provide, nextTick, useSlots } from 'vue';
import SvgIcon from '../SvgIcon.vue';
import Heading from './Heading.vue';
import List from './List.vue';
import ToolButton from './Button.vue';
import ColorPickerList from './ColorPickerList.vue';
import UploaderFiles from './Files.vue';
import Link from './Link.vue';
import useMods from '@/composables/useMods';
import type { Editor, JSONContent } from '@tiptap/vue-3'
type Props = {
    extensions: string[];
}
const props = defineProps<Props>();
const editor = inject<Ref<Editor>>('editor');
const { toggleOption } = useMods(editor as Ref<Editor>);
const isUndo = computed(()=> !editor?.value?.can().undo());
const isRedo = computed(()=> !editor?.value?.can().redo());
const isBlockquote = computed(()=> editor?.value?.isActive('blockquote'));
const isCodeBlock = computed(()=> editor?.value?.isActive('codeBlock'));
const isBold = computed(()=> editor?.value?.isActive('bold'));
const isItalic = computed(()=> editor?.value?.isActive('italic'));
const isStrike = computed(()=> editor?.value?.isActive('strike'));
const isCode = computed(()=> editor?.value?.isActive('code'));
const isUnderline = computed(()=> editor?.value?.isActive('underline'));
const isSubscript = computed(()=> editor?.value?.isActive('subscript'));
const isSuperscript = computed(()=> editor?.value?.isActive('superscript'));
const isAlignLeft = computed(()=> editor?.value?.isActive({ textAlign: 'left' }));
const isAlignCenter = computed(()=> editor?.value?.isActive({ textAlign: 'center' }));
const isAlignRight = computed(()=> editor?.value?.isActive({ textAlign: 'right' }));
const isAlignJustify = computed(()=> editor?.value?.isActive({ textAlign: 'justify' }));

function undoRedo(name: string) {
    toggleOption(name);
}

function toggleAlignText(direction: string) {
    editor?.value.chain().focus().setTextAlign(direction).run();
}
</script>

<template>
    <div class="-t-v-editor-toolbar-container" tabindex="-1">
        <div 
            class="-t-v-editor-toolbar"
        >
            <slot name="after"></slot>
            <template v-for="(name, index) in extensions">
                <div v-if="name==='solid'" class="t-v-solid"></div>
                <ToolButton v-if="name==='undo'" :disabled="isUndo" icon="undo" @toggle="undoRedo('undo')" />
                <ToolButton v-if="name==='redo'" :disabled="isRedo" icon="redo" @toggle="undoRedo('redo')" />
                <Heading v-if="name==='Heading'" />
                <List v-if="name==='List'" />
                <ToolButton v-if="name==='blockquote'" :is-active="isBlockquote" icon="blockquote" @toggle="toggleOption('toggleBlockquote')" />
                <ToolButton v-if="name==='codeBlock'" :is-active="isCodeBlock" icon="codeBlock" @toggle="toggleOption('toggleCodeBlock')" />
                <ToolButton v-if="name==='bold'" :is-active="isBold" icon="bold" @toggle="toggleOption('toggleBold')" />
                <ToolButton v-if="name==='italic'" :is-active="isItalic" icon="italic" @toggle="toggleOption('toggleItalic')" />
                <ToolButton v-if="name==='strike'" :is-active="isStrike" icon="strike" @toggle="toggleOption('toggleStrike')" />
                <ToolButton v-if="name==='code'" :is-active="isCode" icon="code" @toggle="toggleOption('toggleCode')" />
                <ToolButton v-if="name==='underline'" :is-active="isUnderline" icon="underline" @toggle="toggleOption('toggleUnderline')" />
                <ColorPickerList v-if="name==='fontBgColor'" />
                <Link v-if="name==='Link'" />
                <ColorPickerList v-if="name==='fontColor'" icon="fontColor" :is-font="true" />
                <UploaderFiles v-if="name==='UploaderFiles'" />
                <ToolButton v-if="name==='alignLeft'" :is-active="isAlignLeft" icon="alignLeft" @toggle="toggleAlignText('left')" />
                <ToolButton v-if="name==='alignCenter'" :is-active="isAlignCenter" icon="alignCenter" @toggle="toggleAlignText('center')" />
                <ToolButton v-if="name==='alignRight'" :is-active="isAlignRight" icon="alignRight" @toggle="toggleAlignText('right')" />
                <ToolButton v-if="name==='alignJustify'" :is-active="isAlignJustify" icon="alignJustify" @toggle="toggleAlignText('justify')" />
                <ToolButton v-if="name==='subscript'" :is-active="isSubscript" icon="subscript" @toggle="toggleOption('toggleSubscript')" />
                <ToolButton v-if="name==='superscript'" :is-active="isSuperscript" icon="superscript" @toggle="toggleOption('toggleSuperscript')" />
            </template>
            <slot name="before"></slot>
            
                <!-- <slot name="after"></slot>
                <div class="t-v-solid" v-if="slots.after"></div>
            <ToolButton :disabled="isUndo" icon="undo" @toggle="undoRedo('undo')" />
            <ToolButton :disabled="isRedo" icon="redo" @toggle="undoRedo('redo')" />
            <div class="t-v-solid"></div>
            <Heading />
            <List />
            <ToolButton :is-active="isBlockquote" icon="blockquote" @toggle="toggleOption('toggleBlockquote')" />
            <ToolButton :is-active="isCodeBlock" icon="codeBlock" @toggle="toggleOption('toggleCodeBlock')" />
            <div class="t-v-solid"></div>
            <ToolButton :is-active="isBold" icon="bold" @toggle="toggleOption('toggleBold')" />
            <ToolButton :is-active="isItalic" icon="italic" @toggle="toggleOption('toggleItalic')" />
            <ToolButton :is-active="isStrike" icon="strike" @toggle="toggleOption('toggleStrike')" />
            <ToolButton :is-active="isCode" icon="code" @toggle="toggleOption('toggleCode')" />
            <ToolButton :is-active="isUnderline" icon="underline" @toggle="toggleOption('toggleUnderline')" />
            <ColorPickerList />
            <Link />
            <UploaderFiles />
            <div class="t-v-solid"></div>
            <ToolButton :is-active="isAlignLeft" icon="alignLeft" @toggle="toggleAlignText('left')" />
            <ToolButton :is-active="isAlignCenter" icon="alignCenter" @toggle="toggleAlignText('center')" />
            <ToolButton :is-active="isAlignRight" icon="alignRight" @toggle="toggleAlignText('right')" />
            <ToolButton :is-active="isAlignJustify" icon="alignJustify" @toggle="toggleAlignText('justify')" />
            <div class="t-v-solid"></div>
            <ToolButton :is-active="isSubscript" icon="subscript" @toggle="toggleOption('toggleSubscript')" />
            <ToolButton :is-active="isSuperscript" icon="superscript" @toggle="toggleOption('toggleSuperscript')" />
            <div class="t-v-solid"></div>
            <slot name="before"></slot> -->
        </div>
    </div>
</template>
