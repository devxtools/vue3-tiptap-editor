<script lang="ts" setup>
import { ref, type Ref, inject, useSlots, onMounted, nextTick, onBeforeUnmount, getCurrentInstance, computed } from 'vue';
import Panel from './Panel.vue';

type Props = {
    show?: boolean;
    outside?: boolean;
    desktop?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    show: false,
    outside: true,
    desktop: false
})
const slots = useSlots();
const emit = defineEmits(['select'])
const modelValue = defineModel('value');
const buttonRef = ref();
const PanelRef = ref();
const rect = ref<DOMRect>({} as DOMRect);
const visible = ref(props.show);
const loading = ref(false);


const hasHorizontalContent = computed(() => typeof slots.HorizontalContent === 'function')
const hasContent = computed(() => typeof slots.content === 'function')


function onItem(itemProps: Record<string, any>) {
    modelValue.value = itemProps.value;
    if (itemProps.isClose) {
        close();
    }
    emit('select', itemProps, modelValue);
}

function togglePopup() {
    const el = buttonRef.value;
    const newRect = el.getBoundingClientRect();
    rect.value = newRect;
    visible.value = !visible.value;
}

function close() {
    visible.value = false;
}

function handleOutsideClick(event: MouseEvent) {
    if (!props.outside) return;
    const target = event.target as Node;
    const isPopupPanel = PanelRef.value?.$el.contains(target);
    const isReference = buttonRef.value?.contains(target);
    if (!isPopupPanel && !isReference) {
        close();
    }
}

function ReferenceEvent() {
    nextTick(() => {
        const el = buttonRef.value;
        if (el instanceof HTMLElement) {
            el.addEventListener('click', togglePopup);
            loading.value = true;
        }
        document.addEventListener('click', handleOutsideClick);
    });
}

onMounted(()=> {
    const parent = getCurrentInstance()?.vnode.el;
    buttonRef.value = parent?.nextElementSibling as HTMLElement;
    ReferenceEvent();
})

onBeforeUnmount(()=> {
    buttonRef.value?.removeEventListener('click', togglePopup);
    document.removeEventListener('click', handleOutsideClick);
})
</script>

<template>
    <slot name="reference"></slot>
    <Teleport to="body">
        <div class="-t-v-editor-popup-dropdown-wrap">
            <Panel :rect="rect" :visible="visible" ref="PanelRef" @select="onItem">
                <template v-if="hasHorizontalContent" #HorizontalContent>
                    <slot name="HorizontalContent"></slot>
                </template>
                <template v-else-if="hasContent" #content>
                    <slot name="content"></slot>
                </template>
            </Panel>
        </div>
    </Teleport>
</template>