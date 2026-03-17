import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: ['buford-hydrogenous-unhorizontally.ngrok-free.dev'],
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        pvqcd: 'planes-viales-quinquenales-municipales/index.html'
      },
      output: {
        manualChunks: {
          chartjs: ['chart.js/auto'],
        },
      },
    },
  },
})
