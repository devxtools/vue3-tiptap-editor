<script lang="ts" setup>
import { computed, ref, onBeforeUnmount } from 'vue';
import { NodeViewContent, nodeViewProps, NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import SvgIcon from '@/components/SvgIcon.vue';
import { detectMediaType, getFileSizeMB, getFileExtension } from '@/utils/index';
import { useUploader, type formDataHookContext } from '@/utils/uploader';
import { EnumAccept, EnumStatus, EnumMediaType } from './type';
import type { Accept, Options, Status, MediaType  } from './type';

type EditorOptions = {
    uploaderHooks?: {
        action: string;
        chunkSize?: number; 
        formDataHook?: (formData: FormData, ctx: formDataHookContext)=> void;
        exceedSize?: (file: File)=> boolean;
        removeModule?: (props: Record<string, any>) => void;
        filelink?: (data: any)=> string;
    }
}

const NodeProps = defineProps(nodeViewProps);
const emit = defineEmits(['remove-uploader']);
const props = ref(NodeProps.node.attrs);
const inputFileRef = ref();
const fileName = ref<string>();
const fileSize = ref<number>(0);
const progress = ref<number>(0);
const fileUrl = ref();
const status = ref<Status>(EnumStatus.ready);
const showImageStatus = [EnumStatus.file, EnumStatus.uploading, EnumStatus.success, EnumStatus.error];
const mediaType = ref<MediaType>(EnumMediaType.media);
const isMediaShow = computed(()=> fileUrl.value && showImageStatus.includes(status.value));
const isAudio = computed(()=> EnumAccept.audio.indexOf(props.value?.accept)>=0 || String('audio/*').indexOf(props.value?.accept)>=0);
const isMedia = computed(()=> [EnumAccept.image, EnumAccept.video, EnumAccept.media].includes(props.value?.accept));
const isFile = computed(()=> EnumAccept.file.indexOf(props.value?.accept)>=0 || String('/*').indexOf(props.value?.accept)>=0);
const isIframe = computed(()=> [EnumAccept.iframe].includes(props.value?.accept));

function useHooks() {
    const options = NodeProps.editor?.options as EditorOptions;
    const uploaderHooks = options?.uploaderHooks;
    return {
        ...uploaderHooks,
    }
}

function uploadFile(file: File) {
    const { action, formDataHook, filelink, chunkSize } = useHooks();
    status.value = EnumStatus.uploading;
    const upload = useUploader(file, {
        url: action as string,
        chunkSize,
        debug: process.env.NODE_ENV === 'development',
        formDataHook: formDataHook,
        onProgress: (percent) => {
            progress.value = parseFloat(percent.toFixed(2));
        },
        onSuccess: (rs) => {
            status.value = EnumStatus.success;
            URL.revokeObjectURL(fileUrl.value);
            if (filelink) {
                fileUrl.value = filelink(rs);
            } else {
                fileUrl.value = rs.data.filelink||rs.data.url||rs.data.fileurl||rs.data;
            }
            inputFileRef.value.value = null;
        },
        onError: (err)=> {
            console.error(err);
            status.value = EnumStatus.error;
            inputFileRef.value.value = null;
        }
    });
    upload.start();
}

function fileChange(e: Event) {
    const input = e.target as HTMLInputElement
    const files = input.files||[];
    const file = files[0];
    if (!file) return;
    // 这里只会有image, video 这2种类型
    fileName.value = file.name;
    fileSize.value = file.size;
    mediaType.value = detectMediaType(file.type) as MediaType;
    const blobUrl = URL.createObjectURL(file);
    fileUrl.value = blobUrl;
    status.value = EnumStatus.file;
    const { exceedSize } = useHooks();
    if (exceedSize) {
        const isExceedSize = exceedSize(file);
        if (isExceedSize) {
            return;
        }
    }
    uploadFile(file);
}
function openFileSelect() {
    inputFileRef.value?.click();
}

function confirmIframeUrl() {
    if (!fileUrl.value) return;
    mediaType.value = EnumMediaType.iframe;
    status.value = EnumStatus.success;
}

function deleteThisImage() {
    clearStatus();
}

function clearStatus() {
    URL.revokeObjectURL(fileUrl.value);
    status.value = EnumStatus.ready;
    fileName.value = '';
    fileSize.value = 0;
    progress.value = 0;
    fileUrl.value = '';
    inputFileRef.value.value = null;
}

function deleteThisNode() {
    const pos = NodeProps.getPos?.();
    if (typeof pos === 'number') {
        removeModule();
        NodeProps.editor
            .chain()
            .deleteRange({ from: pos, to: pos + NodeProps.node.nodeSize })
            .run()
    }
}

function removeModule() {
    const { removeModule } = useHooks();
    removeModule && removeModule(props);
}

onBeforeUnmount(()=> {
    removeModule();
})
</script>

<template>
    <NodeViewWrapper>
        <div class="uploader-wrap">
            <div 
                class="uploader-card"
                :class="{
                    'image-video-card': isMedia || isIframe,
                    'audio-card': isAudio,
                    'file-card': isFile,
                }" 
            >
                <SvgIcon class="uploader-close-icon" name="x" @click="deleteThisNode" />
                <div v-if="fileUrl && status===EnumStatus.success" class="uploader-del-image" @click="deleteThisImage">
                    <SvgIcon class="w-[16px] h-[16px] text-red-600" name="del" />
                </div>

                <div v-if="status===EnumStatus.ready && isMedia" class="uploader-entra" @click="openFileSelect">
                    <div class="entra-inner">
                        <SvgIcon class="icon" :name="props.icon" />
                        <div class="tip">{{ props.tip }}</div>
                    </div>
                </div>

                <div v-if="status===EnumStatus.ready && isIframe" class="uploader-entra iframe-entra">
                    <div class="entra-inner">
                        <input class="iframe-url" v-model="fileUrl" :placeholder="props.tip" @keydown.enter="confirmIframeUrl" />
                        <div class="button-row">
                            <button 
                                class="-t-v-editor-button-active"
                                @click="confirmIframeUrl"
                            >
                                <SvgIcon class="w-[20px] h-[20px] text-[var(--t-editor-primary-sub-color)]" name="return" />
                            </button>
                            <button 
                                class="-t-v-editor-button-active"
                                @click="confirmIframeUrl"
                            >
                                <SvgIcon class="w-[20px] h-[20px] text-[var(--t-editor-primary-sub-color)]" name="transfer" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="status===EnumStatus.ready" class="uploader-entra audio-file-entra" @click="openFileSelect">
                    <div class="entra-inner">
                        <SvgIcon class="icon" :name="props.icon||'add'" />
                        <div class="tip">{{ props.tip }}</div>
                    </div>
                </div>
                <template v-if="isMediaShow && status===EnumStatus.success">
                    <div v-if="mediaType===EnumMediaType.image" class="image-wrappe">
                        <img class="image" :src="fileUrl" />
                    </div>
                    <div v-else-if="mediaType===EnumMediaType.video" class="video-wrappe">
                        <video class="video" controls :src="fileUrl" />
                    </div>
                    <iframe 
                        v-else-if="mediaType===EnumMediaType.iframe"
                        class="iframe-video"
                        :src="fileUrl" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen
                    ></iframe>
                </template>
                <div v-if="status===EnumStatus.uploading" class="progress-block">
                    <div class="progress-bar">
                        <div
                            class="progress"
                            :style="{ width: progress + '%' }"
                        >
                        </div>
                    </div>
                    <div class="progress-info">
                        <div class="w-[60%] line-clamp-[9]">{{ fileName }}</div>
                        <div>size: {{ getFileSizeMB(fileSize) }}</div>
                        <div>{{ progress }}%</div>
                    </div>
                </div>

                <div v-if="status===EnumStatus.error" class="uploader-error">
                    <SvgIcon class="icon" name="error" />
                    <div class="text-red-500">
                        <span>系统异常！上传失败，</span>
                        <span class="text-gray-400 cursor-pointer" @click="clearStatus">点击重新上传</span>
                    </div>
                </div>

                <div v-if="isAudio" class="audio">
                    <audio controls :src="fileUrl" />
                </div>

                <div v-if="isFile" class="file">
                    <div class="file-inner">
                        <a class="file-relename" href="fileUrl">
                            {{fileName}}
                        </a>
                        <span>size: {{ getFileSizeMB(fileSize) }}</span>
                        <span class="file-type">
                            <b class="file-format">{{ getFileExtension(fileUrl).toLocaleUpperCase() }}</b>
                            <SvgIcon class="format-icon" name="file" />
                        </span>
                    </div>
                </div>

            </div>
            <input ref="inputFileRef" :accept="props.accept" type="file" class="input-file" @change="fileChange" />
        </div>
    </NodeViewWrapper>
</template>
