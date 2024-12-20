import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@layouts': path.resolve(__dirname, 'src/layouts'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@utils': path.resolve(__dirname, 'src/utils'),
        },
    },
        server: {
            port: process.env.VITE_PORT,
            proxy: {
                '/api': process.env.VITE_BACKEND_URL || 'http://localhost:5000', // backend
            },
        },
    define: {
        'process.env': process.env,
    },
});
