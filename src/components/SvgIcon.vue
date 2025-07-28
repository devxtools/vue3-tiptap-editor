<script lang="ts" setup>
import { useStore } from '@/Store/index';
const Store = useStore();
type Props = {
    name: string
}
const props = withDefaults(defineProps<Props>(), {
    name: ''
})

function getSvgIcon(n: string) {
    return Store.svgIcons.value[n];
}
</script>

<template>
    <component :is="getSvgIcon(props.name)" />
</template>