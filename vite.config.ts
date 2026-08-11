import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Se pubblichi su GitHub Pages con repo "app-borsa", il base deve
// corrispondere al nome del repository, es: '/app-borsa/'
export default defineConfig({
  base: '/app-borsa/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'App Borsa - Analisi Tecnica',
        short_name: 'App Borsa',
        description: 'Grafici di borsa con analisi tecnica avanzata',
        theme_color: '#131722',
        background_color: '#131722',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
