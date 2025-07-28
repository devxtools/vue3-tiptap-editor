// FontColor.ts
import { Mark, mergeAttributes } from '@tiptap/core'

export interface FontColorOptions {
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontColor: {
            setFontColor: (color: string) => ReturnType
            unsetFontColor: () => ReturnType
        }
    }
}

export const FontColor = Mark.create<FontColorOptions>({
    name: 'fontColor',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    addAttributes() {
        return {
            color: {
                default: null,
                parseHTML: element => element.style.color || null,
                renderHTML: attributes => {
                    if (!attributes.color) return {}
                    return {
                        style: `color: ${attributes.color}`,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                style: 'color',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands() {
        return {
            setFontColor:
                color =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { color })
                    },
            unsetFontColor:
                () =>
                    ({ commands }) => {
                        return commands.unsetMark(this.name)
                    },
        }
    },
})

export default FontColor;