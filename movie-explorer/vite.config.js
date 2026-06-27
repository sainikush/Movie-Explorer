import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Mirrors api/tmdb.js for local dev. `vite dev` never runs Vercel's
 * serverless runtime, so without this, /api/tmdb would 404 locally and
 * only work once deployed. This middleware makes `npm run dev` behave
 * the same way production does: the browser calls /api/tmdb, and THIS
 * process (not the browser) talks to TMDB.
 */
const tmdbDevProxy = (mode) => ({
  name: 'tmdb-dev-proxy',
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), '')
    const apiKey = env.TMDB_API_KEY

    server.middlewares.use('/api/tmdb', async (req, res) => {
      const fullUrl = new URL(req.url, 'http://localhost')
      const path = fullUrl.searchParams.get('path')

      if (!path) {
        res.statusCode = 400
        res.end(JSON.stringify({ status_message: 'Missing "path" query parameter.' }))
        return
      }
      if (!apiKey) {
        res.statusCode = 500
        res.end(JSON.stringify({ status_message: 'Missing TMDB_API_KEY in your .env file.' }))
        return
      }

      const tmdbUrl = new URL(`https://api.themoviedb.org/3${path}`)
      tmdbUrl.searchParams.set('api_key', apiKey)
      tmdbUrl.searchParams.set('language', 'en-US')
      fullUrl.searchParams.forEach((value, key) => {
        if (key !== 'path') tmdbUrl.searchParams.set(key, value)
      })

      try {
        const tmdbRes = await fetch(tmdbUrl.toString())
        const data = await tmdbRes.text()
        res.statusCode = tmdbRes.status
        res.setHeader('Content-Type', 'application/json')
        res.end(data)
      } catch {
        res.statusCode = 502
        res.end(JSON.stringify({ status_message: 'Could not reach TMDB from the dev server.' }))
      }
    })
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    tmdbDevProxy(mode),
  ],
}))
