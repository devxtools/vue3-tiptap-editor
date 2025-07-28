<template>
  <div class="relative inline-block">
    <!-- 颜色显示块（自定义样式） -->
    <slot name="reference">
      <div
        class="w-[18px] h-[18px] rounded-full cursor-pointer"
        @click="openColorPicker"
        :style="{ backgroundColor: color }"
      ></div>
    </slot>
    <!-- 原生 color input，隐藏但保留功能 -->
    <input
      ref="inputRef"
      type="color"
      v-model="color"
      class="absolute opacity-0 pointer-events-none"
      tabindex="-1"
      @change="colorChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
type Props = {
  show?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  show: false
})

const color = defineModel<string>('value');
const emit = defineEmits(['chnage']);
const inputRef = ref();
function openColorPicker() {
  inputRef.value?.click();
}
watch(()=> props.show, (newShow)=> {
  if (newShow) {
    openColorPicker();
  }
})
function colorChange() {
  emit('chnage', color);
}
</script>
