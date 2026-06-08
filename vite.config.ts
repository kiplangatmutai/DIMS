import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { handleRequest } from './server/index.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dha-device-hub/',
  plugins: [
    {
      name: 'dims-dev-api',
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          const url = request.url || ''

          if (!url.startsWith('/api') && !url.startsWith('/dha-device-hub/api')) {
            next()
            return
          }

          await handleRequest(request, response)
        })
      },
    },
    react(),
  ],
})
