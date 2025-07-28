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
            formats: ['es','umd','iife']
        },
        rollupOptions: {
            external: ['vue'], // 避免重复打包 vue
            output: {
                globals: { vue: 'Vue' }
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
