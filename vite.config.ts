import path from 'path';

import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [svgr(), react()],
    base:"/ClevertecFrontendLab/TarasiukDima/",
    server: {
        host: true,
        port: 3000,
    },
    resolve: {
        alias: {
            '@public': path.resolve(__dirname, 'public'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@redux': path.resolve(__dirname, 'src/redux'),
            '@app_types': path.resolve(__dirname, 'src/app_types'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@services': path.resolve(__dirname, 'src/services'),
        },
    },
});
