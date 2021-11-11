import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}, // vConsole の起動に必要
  },
  plugins: [vue()],
})
