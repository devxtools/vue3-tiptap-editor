import { shallowRef } from 'vue';
// 自动导入所有 SVG 组件
const svgModules = import.meta.glob('@/assets/svg/*.svg', { eager: true })

// 构建 name => 组件 映射
const icons = shallowRef<Record<string, any>>({})

for (const p in svgModules) {
    const name = p.split('/').pop()?.replace('.svg', '') ?? ''
    icons.value[name] = (svgModules[p] as any).default;
}

export default function() {
    return icons;
}