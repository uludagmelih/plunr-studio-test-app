import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        tailwindcss(),
    ],

    resolve: {
        preserveSymlinks: true,
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
            '@plunr': fileURLToPath(new URL(
                './vendor/plunr/admin-starterkit/resources/js',
                import.meta.url
            )),
        },
        dedupe: [
            'react',
            'react-dom',
            '@inertiajs/react',
        ],
    },

    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
