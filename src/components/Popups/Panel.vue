<script lang="ts" setup>
import { computed, type Ref, ref, inject, watch, useSlots, onMounted, nextTick, provide } from 'vue';
type Props = {
    visible: Boolean;
    rect: DOMRect ,
    zIndex?: number;
}
const props = defineProps<Props>();
const emit = defineEmits(['select']);
const popupPanelRef = ref();
const contentRef = ref();
const slots = useSlots();
const desktop = inject<Ref<boolean>>('desktop');
const isScrolling = inject<Ref<boolean>>('isScrolling');
const popupOffsetTop = inject<Ref<number>>('popupOffsetTop');

// if (!desktop?.value) {
//     nextTick(()=>{
//         const el = contentRef.value?.$el as HTMLElement;
//         console.log(el, 'el=')
//         watch(()=> popupOffsetTop?.value, (newValue)=> {
//             const height = el?.offsetHeight||0;
//         })
//     })
// }
const popupPanelHeight = ref(0);

watch(() => props.rect, async (newRect) => {
    await nextTick();
    if (popupPanelHeight.value > 0) return;
    const el = popupPanelRef.value?.$el || popupPanelRef.value;
    if (el && newRect) {
        const height = el.offsetHeight;
        popupPanelHeight.value = height; // 或根据 el 的高度调整
    }
}, { immediate: true });

const computedStyle = computed(()=> {
    // @ts-ignore
    const newRect = props.rect;
    if (newRect) {
        let _top = newRect.bottom + 8;
        if (!desktop?.value) {
            // H5
            _top = Number(popupOffsetTop?.value) - popupPanelHeight.value - 5;
        }
        let style = {
            top: `${_top}px`,
            left: `${newRect.left + newRect.width / 2}px`,
            zIndex: props.zIndex,
        };
        return style;
    }
    return null;
});

function onItemSelect(e:MouseEvent, itemProps: Record<string, any>) {
    emit('select', itemProps, e);
}
provide('PopupPanel', onItemSelect);
</script>

<template>
    <div 
        v-if="props.visible" 
        class="-t-v-popup-panel"
        :class="{'-t-v-popup-panel-h5': !desktop, 'opacity-0': isScrolling}"
        :style="computedStyle"
        tabindex="-1"
        contenteditable="false"
    >
        <div class="-t-v-popup-panel-inner z-50 bg-white rounded-[10px]" ref="popupPanelRef">
            <ul 
                v-if="slots.content"
                class="-t-v-content"
                ref="contentRef"
            >
                <slot name="content"></slot>
            </ul>
            <ul 
                v-if="slots.HorizontalContent"
                class="-t-v-h-content"
                ref="contentRef"
            >
                <slot name="HorizontalContent"></slot>
            </ul>
        </div>
    </div>
</template>
