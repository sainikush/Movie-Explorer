import { useState, useEffect } from 'react'
import { fetchGenres } from '../utils/api'

/**
 * Loads TMDB's master genre list once on mount. Movie list endpoints
 * (popular/trending/top_rated/search) only return `genre_ids`, not
 * names — this hook gives the UI an id -> name lookup to render
 * genre badges and the genre filter bar without an extra request per card.
 */
const useGenres = () => {
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchGenres(controller.signal)
      .then(data => setGenres(data.genres || []))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message)
      })

    return () => controller.abort()
  }, [])

  return { genres, error }
}

export default useGenres
