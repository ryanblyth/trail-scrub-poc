import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      external: ['mapbox-gl'],
      output: {
        manualChunks: {
          gsap: ['gsap'],
          turf: ['@turf/along', '@turf/length']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['gsap', 'lenis']
  },

})
