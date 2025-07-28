import { computed, onBeforeMount, onMounted, Ref, ref, watch } from 'vue';
import { useDebounceFn, useWindowScroll, breakpointsTailwind, useBreakpoints, type MaybeRefOrGetter } from '@vueuse/core';

export function useToolbarFollowKeyboard(elRef: Ref, screen: MaybeRefOrGetter |string) {
    const { x, y } = useWindowScroll();
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isDesktop = breakpoints.greaterOrEqual(screen||'xl');
    const offsetBottom = ref(0);
    const maxScrollY = ref(0);
    const keyboardHeight = ref(0);
    const lastY = ref(0);
    const isScrolling = ref(false);
    const isKeyboard = ref(false);

    const onScrollStop = useDebounceFn(() => {
        isScrolling.value = false;
        if (elRef.value?.$el) {
            elRef.value.$el.style.opacity = '1';
        }
    }, 200);

    const handleOffset = (newY: number)=> {
        const el = elRef.value?.$el as HTMLElement;
        if (!isScrolling.value) {
            isScrolling.value = true;
            el.style.opacity = '0';
        }
        onScrollStop();

        if (!el) return;
        // if (lastY.value>0 && newY >= lastY.value) {
        //     window.scrollTo({
        //         top: maxScrollY.value,
        //         behavior: 'auto',
        //     });
        //     return;
        // };
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const bodyoffsetHeight = document.body.offsetHeight;
                    const innerHeight = window.innerHeight;
                    const toolbarHeight = el.offsetHeight;
                    const keyboard_height = Number(Math.max(0, innerHeight - (window.visualViewport?.height || 0)));
                    keyboardHeight.value = keyboard_height;
                    const _maxScrollY = bodyoffsetHeight - (innerHeight - keyboard_height);
                    maxScrollY.value = _maxScrollY;
                    offsetBottom.value = (innerHeight + scrollY) - keyboard_height - toolbarHeight;
                    el.style.top = `${offsetBottom.value}px`;
                    if (newY > _maxScrollY) {
                        window.scrollTo({
                            top: _maxScrollY,
                            behavior: 'auto',
                        });
                        lastY.value = newY;
                    }
                })
            })
        })
    }

    let lastHeight = window.visualViewport?.height ?? 0;
    let timer = ref<NodeJS.Timeout>();
    const handlerKeyboardOpen = () => {
        const currentHeight = window.visualViewport?.height ?? 0;
        if (timer.value) {
            clearTimeout(timer.value);
        }
        if (currentHeight < lastHeight - 100) {
            console.log('🔼 键盘弹出')
            isKeyboard.value = true;
        } else if (currentHeight > lastHeight + 100) {
            console.log('🔽 键盘收起')
            isKeyboard.value = false;
            handleOffset(y.value);
            timer.value = setTimeout(()=>{
                clearTimeout(timer.value);
            }, 1280);
        }
        lastHeight = currentHeight;
    }

    if (!isDesktop.value) {
        // 小于1280px才生效
        watch(y, (newY) => {
            handleOffset(newY);
        })
    }

    onMounted(()=>{
        !isDesktop.value && window.visualViewport?.addEventListener('resize', handlerKeyboardOpen);
    })

    onBeforeMount(()=> {
        !isDesktop.value && window.visualViewport?.removeEventListener('resize', handlerKeyboardOpen);
    })
    
    return {
        offsetBottom,
        maxScrollY,
        keyboardHeight,
        isScrolling,
        isDesktop,
        isKeyboard
    }
}

