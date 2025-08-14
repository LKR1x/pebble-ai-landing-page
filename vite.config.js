import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/pebble-ai-landing-page/',
  plugins: [react()],
  assetsInclude: ['**/*.riv'], // 👈 Tell Vite to treat .riv as an asset
})
