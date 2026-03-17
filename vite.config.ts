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
        pvqcd: 'planes-viales-quinquenales-municipales/index.html',
        inventario: 'inventario-red-vial-cantonal/index.html',
        nicsp: 'valoracion-activos-viales-nicsp/index.html',
        ley8114: 'cumplimiento-ley-8114-ley-9329/index.html',
        utgv: 'utgv-planificacion-y-priorizacion-vial/index.html',
        'guia-pvqcd': 'guia/que-es-un-pvqcd/index.html',
        'guia-priorizar': 'guia/como-priorizar-inversion-en-red-vial-cantonal/index.html',
        'guia-errores-nicsp': 'guia/errores-en-valoracion-de-activos-viales-nicsp/index.html'
      },
      output: {
        manualChunks: {
          chartjs: ['chart.js/auto'],
        },
      },
    },
  },
})
