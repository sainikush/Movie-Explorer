const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

/**
 * Builds a poster/backdrop image URL from a TMDB path.
 * Returns null when there's no path so callers can fall back to a placeholder.
 * (Images are served straight from TMDB's CDN — only the JSON requests
 * go through our /api/tmdb proxy below.)
 */
export const posterUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null

export const backdropUrl = (path, size = 'w1280') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null

/**
 * Low-level fetch wrapper shared by every endpoint below.
 * Calls our own /api/tmdb proxy (api/tmdb.js on Vercel, or the matching
 * Vite dev middleware locally) instead of TMDB directly — see those
 * files for why. Surfaces TMDB's own error message and supports request
 * cancellation via AbortController.
 */
const apiFetch = async (endpoint, params = {}, signal) => {
  const url = new URL('/api/tmdb', window.location.origin)
  url.searchParams.set('path', endpoint)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  let res
  try {
    res = await fetch(url.toString(), { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Network error. Check your connection and try again.')
  }

  if (!res.ok) {
    // Pull TMDB's own error message when available
    const body = await res.json().catch(() => ({}))
    if (res.status === 401) throw new Error('Invalid API key.')
    if (res.status === 429) throw new Error('Too many requests. Please wait a moment and try again.')
    throw new Error(body.status_message || `Request failed (${res.status}).`)
  }

  return res.json()
}

export const fetchPopular = (page = 1, signal) =>
  apiFetch('/movie/popular', { page }, signal)

export const fetchTrending = (page = 1, signal) =>
  apiFetch('/trending/movie/week', { page }, signal)

export const fetchTopRated = (page = 1, signal) =>
  apiFetch('/movie/top_rated', { page }, signal)

export const searchMovies = (query, page = 1, signal) =>
  apiFetch('/search/movie', { query, page, include_adult: false }, signal)

export const fetchByGenre = (genreId, page = 1, signal) =>
  apiFetch('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' }, signal)

export const fetchGenres = (signal) =>
  apiFetch('/genre/movie/list', {}, signal)

export const fetchMovieDetails = (id, signal) =>
  apiFetch(`/movie/${id}`, {}, signal)

/** Maps a UI category key to the right TMDB endpoint. */
export const CATEGORY_FETCHERS = {
  popular: fetchPopular,
  trending: fetchTrending,
  top_rated: fetchTopRated,
}
