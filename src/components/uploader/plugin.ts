import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Uploader from './index.vue'; // 上传组件
import { toKebabCase } from '@/utils/index';
import { EnumAccept, type Accept, type Options } from './type';

export default function useUploader(options?: Options) {
    options = Object.assign({
        name: 'Uploader',
        accept: EnumAccept.media,
        tip: 'Click to Upload',
        placeholder: 'edia URL can be entered manually',
        icon: 'media'
    }, options);
    const tag = toKebabCase(options.name as string);
    return Node.create({
        name: options.name,
        group: 'block',
        atom: true,
        selectable: true, // ✅ 允许该节点被选中
        draggable: true,
        defining: true,
        addAttributes() {
            return {
                accept: { default: options.accept },
                tip: { default: options.tip },
                icon: { default: options.icon },
                placeholder: { default: options.placeholder },
                src: null,
            }
        },
        parseHTML() {
            return [
                {
                    tag,
                }
            ]
        },
        renderHTML({ HTMLAttributes }) {
            return [tag, mergeAttributes(HTMLAttributes)]
        },
        addNodeView() {
            return VueNodeViewRenderer(Uploader)
        }
    })
}