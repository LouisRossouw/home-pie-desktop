import { resolve } from 'path'
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '~': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
