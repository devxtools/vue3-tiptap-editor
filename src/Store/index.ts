import { ref, shallowRef } from 'vue';
import useIcons from '@/composables/useIcons'

export function useStore() {
    const svgIcons = shallowRef<{ [key: string]: any }>(useIcons());
    
    return {
        svgIcons
    }
}