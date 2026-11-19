import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Se pubblichi su GitHub Pages con repo "app-borsa", il base deve
// corrispondere al nome del repository, es: '/app-borsa/'
//
// Con "--mode android" (npm run build:android) la build è per l'APK:
// percorsi relativi e niente service worker, che dentro l'app non serve.
export default defineConfig(({ mode }) => ({
  base: mode === 'android' ? './' : '/app-borsa/',
  plugins: [
    react(),
    mode !== 'android' &&
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
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
}))
