import { createApp, ref, h, nextTick, type Ref, type Slots, onBeforeUnmount } from 'vue';
import PopupPanel from '../components/Popups/Panel.vue';
// 没有在使用
type Props = {
    slots: Slots;
    referenceRef: Ref;
}

export function usePopups({ slots, referenceRef }: Props) {
    let container = document.createElement('div');
    container.classList.add('vue-tiptap-editor-dropdown-panel');
    document.body.appendChild(container);
    const isMount = ref(false);
    const visible = ref(false);
    const rect: Ref<DOMRect | null> = ref(null);
    const app = createApp({
        render() {
            const emit = defineEmits(['select'])
            return h(PopupPanel, {
                visible: visible.value,
                rect: rect,
                zIndex: 10,
                onItem(event, item) {
                    console.log(event, item, 'clickItem')
                    // close();
                    // clickItem.call(event, item, index);
                    emit('select', event, item)
                }
            },{
                content: slots.content,
                HorizontalContent: slots.HorizontalContent,
            });
        },
    });

    

    function handleOutsideClick(event: MouseEvent) {
        const target = event.target as Node;
        const reference_el = referenceRef.value?.nextSibling;
        const isPopupPanel = container?.contains(target);
        const isReference = reference_el?.contains(target);
        if (!isPopupPanel && !isReference) {
            close();
        }
    }

    function open(_rect: DOMRect) {
        if (!isMount.value) {
            app.mount(container);
            isMount.value = true;
        }
        rect.value = _rect;
        visible.value = true;
        nextTick(() => {
            document.addEventListener('click', handleOutsideClick);
        });
    }
    function close() {
        // rect.value = null;
        visible.value = false;
    }
    // requestAnimationFrame
    function destroy() {
        close();
        nextTick(() => {
            document.removeEventListener('click', handleOutsideClick);
            app?.unmount();
            container.remove();
            isMount.value = false;
        });
    }

    return {
        visible,
        open,
        close,
        destroy
    }
}

export default usePopups;