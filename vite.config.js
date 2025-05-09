import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === 'production' ? '/toki/flash-deal/' : '/',
  // base: mode === 'production' ? '/toki/flash-deal/J3vWx/test/' : '/',
}))
