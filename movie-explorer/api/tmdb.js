
export default async function handler(req, res) {
  const { path, ...params } = req.query

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ status_message: 'Missing "path" query parameter.' })
  }

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      status_message: 'Server is missing TMDB_API_KEY. Set it in Vercel → Project Settings → Environment Variables.',
    })
  }

  const url = new URL(`https://api.themoviedb.org/3${path}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  })

  try {
    const tmdbRes = await fetch(url.toString())
    const data = await tmdbRes.json()
    res.status(tmdbRes.status).json(data)
  } catch {
    res.status(502).json({ status_message: 'Could not reach TMDB from the server.' })
  }
}
