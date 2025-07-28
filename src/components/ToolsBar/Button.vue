<script lang="ts" setup>
import SvgIcon from '../SvgIcon.vue';

type Props = {
    isActive?: boolean
    icon: string; 
    disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    isActive: false,
    icon: '',
    disabled: false
})
const emit = defineEmits(['toggle']);
function HandleClick() {
    emit('toggle');
}
</script>

<template>
    <button 
        :class="{'is-active': props.isActive }" 
        :disabled="props.disabled"
        class="button" 
        type="button" 
        tabindex="-1"
        contenteditable="false"
        @click="HandleClick"
    >
        <SvgIcon :name="props.icon" class="icon" :class="{'is-active': props.isActive }"  />
    </button>
</template>
