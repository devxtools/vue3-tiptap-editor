import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import svgLoader from 'vite-svg-loader';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        svgLoader()
    ],
    // define: {
    //     'process.env.NODE_ENV': JSON.stringify('production') // ✅ 替换
    // },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/assets/style/vars.scss" as *;`
            }
        }
    },
    build: {
        // minify: false,             // ✅ 不压缩 JS/CSS
        // sourcemap: true,           // ✅ 生成 source map（可调试）
        target: 'esnext',          // ✅ 保留较新的语法（可选）
        cssCodeSplit: true,        // ✅ 保留独立 CSS 文件（不合并）
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Vue3TiptapEditor',
            fileName: (format) => `index.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: [
                'vue',
                'vue',
                '@tiptap/core',
                '@tiptap/vue-3',
                '@tiptap/starter-kit',
                '@tiptap/pm',
                '@tiptap/extension-link',
                '@tiptap/extension-image',
                '@tiptap/extension-floating-menu',
                '@tiptap/extension-bubble-menu',
                '@tiptap/extension-task-item',
                '@tiptap/extension-task-list',
                '@tiptap/extension-color',
                '@tiptap/extension-text-style',
                '@tiptap/extension-text-align',
                '@tiptap/extension-underline',
                '@tiptap/extension-highlight',
                '@tiptap/extension-subscript',
                '@tiptap/extension-superscript',
                '@vueuse/core',
                '@tiptap/extension-list-item',
            ], // 避免重复打包 vue
            output: {
                globals: { 
                    vue: 'Vue',
                    '@vueuse/core': 'VueUse',
                    '@tiptap/core': 'TiptapCore',
                    '@tiptap/starter-kit': 'StarterKit',
                    '@tiptap/vue-3': 'TiptapVue',
                    '@tiptap/extension-bubble-menu': 'BubbleMenu',
                    '@tiptap/extension-color': 'Color',
                    '@tiptap/extension-floating-menu': 'FloatingMenu',
                    '@tiptap/extension-highlight': 'Highlight',
                    '@tiptap/extension-image': 'Image',
                    '@tiptap/extension-link': 'Link',
                    '@tiptap/extension-list-item': 'ListItem',
                    '@tiptap/extension-subscript': 'Subscript',
                    '@tiptap/extension-superscript': 'Superscript',
                    '@tiptap/extension-task-item': 'TaskItem',
                    '@tiptap/extension-task-list': 'TaskList',
                    '@tiptap/extension-text-align': 'TextAlign',
                    '@tiptap/extension-text-style': 'TextStyle',
                    '@tiptap/extension-underline': 'Underline',
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    server: {
        host: true, // 关键配置：允许 IP 访问（自动设为 0.0.0.0）
        port: 9037
    },
})
