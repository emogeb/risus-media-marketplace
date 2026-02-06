import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        // shared / main app
        'resources/css/app.css',
        'resources/js/app.ts',

        // admin spa (vue)
        'resources/admin/main.ts',
        // admin ayrı css kullanıyorsan aç:
        'resources/admin/style.css',
      ],
      ssr: 'resources/js/ssr.ts',
      refresh: [
        'resources/js/**',
        'resources/admin/**',
        'resources/views/**',
        'routes/**',
      ],
    }),

    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),

    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
      '@admin': path.resolve(__dirname, 'resources/admin'),
    },
  },

  // Admin SPA'yı /admin altında history mode ile kullanıyorsan
  // asset path'leri düzgün kalsın diye önerilir:
  base: '/',
});