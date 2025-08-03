<script lang="ts" setup>
import { ref, inject, type Ref, computed, watchEffect } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import Popup from '@/components/Popups/index.vue';
import PopupItem from '@/components/Popups/Item.vue';
import ColorPicker from '@/components/ColorPicker.vue';
import type { Editor } from '@tiptap/vue-3';
import useMods from '@/composables/useMods';

type Props = {
    colors?: string[];
    isFont?: boolean;
    icon?: string;
}
const props = withDefaults(defineProps<Props>(), {
    isFont: false,
    icon: 'highlight',
    colors: ()=> [
        '#b45309', // 深黄棕
        '#dc2626', // 深红
        '#7c3aed', // 紫
        '#4d7c0f', // 深绿
        '#0284c7', // 深蓝
        '#6b7280', // 深灰
        '#c2410c'  // 深橙
    ]
})

const editor = inject<Ref<Editor>>('editor');
const color = ref('#000000');
const ColorPickerShow = ref(false);
const isHighlight = computed(()=> editor?.value.isActive('highlight'));
const isFontColor = computed(()=> editor?.value.isActive('fontColor'));

const isActive = computed(()=> props.isFont? isFontColor.value: isHighlight.value);
    
const { toggleOption } = useMods(editor as Ref<Editor>);


editor?.value.on('selectionUpdate', ({ editor }) => {
    const font_marks = editor.state.storedMarks || editor.state.selection.$from.marks();
    const font_color = font_marks.find(m => m.type.name === 'fontColor')?.attrs.color;

    const font_bg_marks = editor.state.storedMarks || editor.state.selection.$from.marks()
    const font_bg_highlightMark = font_bg_marks.find(m => m.type.name === 'highlight')
    const backgroundColor = font_bg_highlightMark?.attrs.color || null

    if (font_color) {
        color.value = font_color;
    }

    if (backgroundColor) {
        color.value = backgroundColor;
    }
})

function clickListItem({ type }: { type: string }) {  
    if (!editor || !editor.value) return;
     if (type==='custom') {
        ColorPickerShow.value = !ColorPickerShow.value;
        return;
    } 

    if (props.isFont) {
        if (type==='clear') {
            editor.value.commands.unsetFontColor();
        } else {
            editor.value.commands.setFontColor(color.value);
        }
        return;
    } 

    if (type==='clear') {
        editor.value.commands.toggleHighlight();
        return;
    }
    toggleOption('toggleHighlight', { color: color.value })
}
function colorPickerChnage(_color: Ref) {
    if (props.isFont && editor && editor.value) {
        editor.value.commands.setFontColor(_color.value);
        return;
    }
    toggleOption('toggleHighlight', { color: _color.value });
}
</script>

<template>
    <Popup v-model:value="color" @select="clickListItem">
        <template #reference>
            <button
                class="button"
                type="button"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isActive }"
            >
                <span class="flex items-center" :style="`--selected-color: ${color}`">
                    <SvgIcon 
                        class="icon" 
                        :name="props.icon" 
                        :class="{'!text-[var(--selected-color)]': isActive }"
                    />
                </span>
            </button>
        </template>
        <template #HorizontalContent>
            <PopupItem 
                class="color-item"
                type="clear"
                value="#000000"
                :is-close="false"
                title="Clear Color"
            >
                <div 
                    class="color clear-color border-[1px] border-gray-300" 
                ></div>
            </PopupItem>
            <PopupItem 
                v-for="(color, i) in props.colors"
                :value="color"
                :key="color"
                :style="`--t-color: ${color}`"
                class="color-item"
            >
                <div class="color"></div>
            </PopupItem>
            <PopupItem 
                class="color-item"
                type="custom"
                :value="color"
                :is-close="false"
            >
                <ColorPicker :show="ColorPickerShow" v-model:value="color" @chnage="colorPickerChnage">
                    <template #reference>
                        <div 
                            class="color" 
                            style="background: var(--t-linear-gradient-color);" 
                        ></div>
                    </template>
                </ColorPicker>
            </PopupItem>
        </template>
    </Popup>
</template>
