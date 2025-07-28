<script lang="ts" setup>
import { ref, inject, type Ref, computed, watch } from 'vue';
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

const link = ref();
const buttonRef = ref();
const inputRef = ref();
const showLinkPopup = ref(false);
const isLink = computed(() => editor?.value?.isActive('link'));

function ConfirmLink() {
    toggleOption('setLink', { href: link.value });
}

watch(()=> isLink.value, (newIsLink)=> {
    if (newIsLink) {
        link.value = editor?.value.getAttributes('link').href;
        inputRef.value?.focus();
        showLinkPopup.value = true;
    } else {
        inputRef.value?.blur();
        showLinkPopup.value = false;
    }
    buttonRef.value?.click();
})

function onEnter() {
    ConfirmLink();
}
function clickDel() {
    link.value = '';
    toggleOption('unsetLink');
}
function openLink() {
    if (!link.value) return;
    window.open(link.value, '_blank', 'noopener,noreferrer');
}
</script>

<template>
    <Popup v-model:value="link" :outside="isLink">
        <template #reference>
            <button
                ref="buttonRef"
                class="button"
                type="button"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isLink }"
            >
                <span class="flex items-center">
                    <SvgIcon 
                        name="link" 
                        class="icon" 
                        :class="{'!text-[var(--t-editor-primary-color)]': isLink }" 
                    />
                </span>
            </button>
        </template>
        <template #HorizontalContent>
            <PopupItem 
                type="custom"
                class="link-item"
                :value="link"
                :is-close="false"
            >
                <div class="flex items-center gap-1 relative">
                    <input 
                        ref="inputRef"
                        class="input-link mr-1.5 min-w-[200px]" 
                        placeholder="Please enter the link" 
                        v-model="link"
                        @keydown.enter="onEnter"
                    />
                    <SvgIcon 
                        name="return" 
                        class="t-v-return-icon" 
                    />
                    <span class="text-gray-100">｜</span>
                    <SvgIcon 
                        name="blank" 
                        class="t-v-blank-icon" 
                        :disabled="!link"
                        @click="openLink"
                    />
                    <span class="text-gray-100">｜</span>
                    <SvgIcon 
                        name="del" 
                        class="t-v-del-icon" 
                        :disabled="!link"
                        @click="clickDel"
                    />
                </div>
            </PopupItem>
        </template>
    </Popup>
</template>
