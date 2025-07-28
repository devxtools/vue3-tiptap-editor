<script lang="ts" setup>
import { inject } from 'vue';
type Props = {
    value: any;
    label?: string;
    isClose?: boolean
    type?: string;
}
const props = withDefaults(defineProps<Props>(), {
    isClose: true,
    type: 'item'
});
type PopupPanelType = (e: MouseEvent, props: Props) => void;

const PopupPanel = inject<PopupPanelType>('PopupPanel');
function HandleClick(e: MouseEvent) {
    if (PopupPanel) {
        PopupPanel(e, props);
    }
}
</script>

<template>
    <li class="select-item" @click="HandleClick">
        <slot name="prefix"></slot>
        <slot>
            {{ props.label }}
        </slot>
        <slot name="suffix"></slot>
    </li>
</template>
