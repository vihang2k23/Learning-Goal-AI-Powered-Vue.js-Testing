import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * Dev-only mock for Planner Pal E2E and local manual testing.
 */
function plannerProfileMockPlugin() {
  const defaultProfile = () => ({
    id: 1,
    name: 'Alex Planner',
    email: 'alex@example.com',
    avatar: 'https://example.com/avatar.png',
    bio: 'Organizing my week with Planner Pal.',
    created_at: '2024-01-15T10:00:00.000Z',
  })

  let profile = defaultProfile()

  return {
    name: 'planner-profile-api-mock',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '').split('?')[0]
        const match = pathname.match(/^\/api\/planner-profile\/(\d+)$/)
        if (!match) return next()

        const id = Number(match[1])

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ...profile, id }))
          return
        }

        if (req.method === 'PUT') {
          const chunks = []
          req.on('data', (c) => chunks.push(c))
          req.on('end', () => {
            try {
              const raw = chunks.length ? Buffer.concat(chunks).toString() : '{}'
              const data = JSON.parse(raw)
              profile = { ...profile, ...data, id }
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(profile))
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        res.statusCode = 405
        res.end()
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), plannerProfileMockPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    exclude: ['e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/components/PlannerPal.vue', 'src/services/plannerPalApi.js'],
      thresholds: {
        lines: 90,
        // SFC compiler emits helper functions; focus thresholds on lines/branches.
        functions: 75,
        branches: 85,
        statements: 90,
      },
    },
  },
})
