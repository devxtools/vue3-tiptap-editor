<script lang="ts" setup>
import { ref, type Ref, inject, computed, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import Popup from '@/components/Popups/index.vue';
import PopupItem from '@/components/Popups/Item.vue';
import type { Editor } from '@tiptap/vue-3';
import useMods from '@/composables/useMods';

type Props = {
    
}
const props = withDefaults(defineProps<Props>(), {
    
})

const editor = inject<Ref<Editor>>('editor');
const { toggleOption } = useMods(editor?.value as Editor);
const level = defineModel('level');
const isHeading = computed(() => !!editor?.value?.isActive('heading'));

const currentLevel = computed(() => {
  return editor?.value?.isActive('heading')
    ? editor.value.getAttributes('heading').level
    : 0 // 0 表示当前是普通段落
})

watch(()=> currentLevel.value, (newLevel)=> {
    level.value = newLevel;
})

function clickHeading({ value }: { value: number }) {
    toggleOption('toggleHeading', { level: value });
}
</script>

<template>
    <Popup @select="clickHeading">
        <template #reference>
            <button
                class="button"
                type="button"
                tabindex="-1"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isHeading }"
                @click="toggleOption('toggleBold')"
            >
                <span class="flex items-center">
                    <SvgIcon 
                        class="icon" 
                        :name="isHeading?'h'+currentLevel:'h'"
                        :class="{'!text-[var(--t-editor-primary-color)]': isHeading }" 
                    />
                    <SvgIcon name="dropdownSmall" class="w-3 h-3 text-gray-400" />
                </span>
            </button>
        </template>
        <template #content>
            <PopupItem 
                v-for="i in 4"  
                :value="i"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': currentLevel===i }"
            >
                <template #prefix>
                    <SvgIcon 
                        :name="`h${i}`" 
                        class="w-5 h-5" 
                        :class="{'text-[var(--t-editor-primary-color)]': currentLevel===i }" 
                    />
                </template>
                <span class="px-2">Heading {{ i }}</span>
            </PopupItem>
        </template>
    </Popup>
</template>