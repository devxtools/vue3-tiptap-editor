<script lang="ts" setup>
import { inject, type Ref, computed } from 'vue';
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

const isBulletList = computed(()=> editor?.value.isActive('bulletList'))
const isOrderedList = computed(()=> editor?.value.isActive('orderedList'))
const isTaskList = computed(()=> editor?.value.isActive('taskList'))

const isList = computed(()=> isBulletList.value || isOrderedList.value || isTaskList.value);
    
const { toggleOption } = useMods(editor?.value as Editor);

function clickListItem({ value }: { value: string }) {
    toggleOption(value);
}
</script>

<template>
    <Popup @select="clickListItem">
        <template #reference>
            <button
                class="button"
                type="button"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isList }"
            >
                <span class="flex items-center">
                    <SvgIcon 
                        name="list" 
                        class="icon" 
                        :class="{'!text-[var(--t-editor-primary-color)]': isList }" 
                    />
                    <SvgIcon name="dropdownSmall" class="w-3 h-3 text-gray-400" />
                </span>
            </button>
        </template>
        <template #content>
            <PopupItem 
                value="toggleBulletList"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isBulletList }"
            >
                <template #prefix>
                    <SvgIcon name="bulletList" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isBulletList }"  />
                </template>
                <span class="px-2">Bullet List</span>
            </PopupItem>
            <PopupItem 
                value="toggleOrderedList"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isOrderedList }"
            >
                <template #prefix>
                    <SvgIcon name="orderedList" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isOrderedList }" />
                </template>
                <span class="px-2">Ordered List</span>
            </PopupItem>
            <PopupItem 
                value="toggleTaskList"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isTaskList }"
            >
                <template #prefix>
                    <SvgIcon name="taskList" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isTaskList }" />
                </template>
                <span class="px-2">Task List</span>
            </PopupItem>
        </template>
    </Popup>
</template>