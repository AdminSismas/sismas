import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['swiper/scss', 'swiper/scss/navigation', 'swiper/scss/pagination'],
    include: []
  }
});