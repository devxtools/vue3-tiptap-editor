<script lang="ts" setup>
import { ref, inject, type Ref, computed } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import Popup from '@/components/Popups/index.vue';
import PopupItem from '@/components/Popups/Item.vue';
import type { Editor } from '@tiptap/vue-3';
import useMods from '@/composables/useMods';
import { EnumAccept } from '@/components/Uploader/type';

type Props = {
}
const props = withDefaults(defineProps<Props>(), {
})

const editor = inject<Ref<Editor>>('editor');

const isImage = computed(()=> editor?.value.isActive('image'))
const isVideo = computed(()=> editor?.value.isActive('video'))
const isIframe = computed(()=> editor?.value.isActive('iframe'))
const isAudio = computed(()=> editor?.value.isActive('audio'))
const isFile = computed(()=> editor?.value.isActive('file'))

const isMediaList = computed(()=> isVideo.value || isVideo.value || isVideo.value);
    
const { toggleOption } = useMods(editor?.value as Editor);

type PopupItemOptions = {
    [key:string]: ()=> void
}

const popupItemOptions: PopupItemOptions = {
    media() {
        return { 
            type: 'Uploader',
            attrs: {
                name: 'Uploader',
                accept: EnumAccept.media,
                tip: 'Click to Upload',
                icon: 'media',
                src: null,
            }
        }
    },
    image() {
        return { 
            type: 'Uploader',
            attrs: {
                name: 'Uploader',
                accept: EnumAccept.image,
                tip: 'Click to Upload Image',
                icon: 'addImage',
                src: null,
            }
        }
    },
    video() {
        return { 
            type: 'Uploader',
            attrs: {
                name: 'Uploader',
                accept: EnumAccept.video,
                tip: 'Click to Upload Video',
                icon: 'addVideo',
                src: null,
            }
        }
    },
    audio() {
        return { 
            type: 'Uploader',
            attrs: {
                name: 'Uploader',
                accept: EnumAccept.audio,
                tip: 'Click to Upload Audio',
                icon: 'addAudio',
                src: null,
            }
        }
    },
    iframe() {
        return { 
            type: 'Uploader',
            attrs: {
                name: 'Uploader',
                accept: EnumAccept.iframe,
                tip: 'Enter video link',
                icon: 'youtube',
                src: null,
            }
        }
    },
    file() {
        return { 
            type: 'Uploader',
            attrs: {
                name: 'Uploader',
                accept: EnumAccept.file,
                tip: 'Click to Upload File',
                icon: 'file',
                src: null,
            }
        }
    }
}

function clickListItem({ value }: { value: string }) {
    const getConfigFn = popupItemOptions[value];
    if (getConfigFn) {
        const insertContents = getConfigFn();
        editor?.value?.chain().focus().insertContent([
            insertContents,
            { type: 'paragraph' }, // 再换一行
        ]).run();
    }
}
</script>

<template>
    <Popup @select="clickListItem">
        <template #reference>
            <button
                class="button"
                type="button"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isMediaList }"
            >
                <span class="flex items-center">
                    <SvgIcon 
                        name="upload" 
                        class="icon" 
                        :class="{'!text-[var(--t-editor-primary-color)]': isMediaList }" 
                    />
                    <SvgIcon name="dropdownSmall" class="w-3 h-3 text-gray-400" />
                </span>
            </button>
        </template>
        <template #content>
            <PopupItem 
                value="image"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isImage }"
            >
                <template #prefix>
                    <SvgIcon name="addImage" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isImage }"  />
                </template>
                <span class="px-2">上传图像</span>
            </PopupItem>
            <PopupItem 
                value="video"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isVideo }"
            >
                <template #prefix>
                    <SvgIcon name="addVideo" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isVideo }" />
                </template>
                <span class="px-2">上传视频</span>
            </PopupItem>
            <PopupItem 
                value="iframe"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isIframe }"
            >
                <template #prefix>
                    <SvgIcon name="youtube" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isIframe }" />
                </template>
                <span class="px-2">嵌入视频</span>
            </PopupItem>
            <PopupItem 
                value="audio"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isAudio }"
            >
                <template #prefix>
                    <SvgIcon name="audio" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isAudio }" />
                </template>
                <span class="px-2">上传音频</span>
            </PopupItem>
            <PopupItem 
                value="file"
                class="hover:bg-gray-100"
                :class="{'bg-[var(--t-editor-tools-hover-color)]': isFile }"
            >
                <template #prefix>
                    <SvgIcon name="file" class="w-4" :class="{'text-[var(--t-editor-primary-color)]': isFile }" />
                </template>
                <span class="px-2">上传文件</span>
            </PopupItem>
        </template>
    </Popup>
</template>