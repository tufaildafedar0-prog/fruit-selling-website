import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Conditional base path: GitHub Pages needs '/fruit-selling-website/', Vercel needs '/'
    base: process.env.GITHUB_PAGES === 'true' ? '/fruit-selling-website/' : '/',
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
})
