import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base './' + HashRouter lets the build run from any static host (incl. GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
