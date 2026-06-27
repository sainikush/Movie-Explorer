import { useEffect, useState } from 'react'
import { fetchMovieDetails, posterUrl, backdropUrl } from '../utils/api'

/**
 * Full-detail view for a single movie, opened by clicking a card.
 * Fetches /movie/{id} directly since list endpoints don't include
 * runtime, tagline, or named genres.
 */
const MovieModal = ({ id, onClose }) => {
  const [movie, setMovie]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchMovieDetails(id, controller.signal)
      .then(setMovie)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  // Esc to close + lock background scroll while the modal is open
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center
                 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={movie ? `${movie.title} details` : 'Movie details'}
        onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl sm:rounded-2xl bg-surface-800
                   min-h-full sm:min-h-0 sm:my-8 overflow-hidden"
      >
        <button
          onClick={onClose}
          aria-label="Close details"
          autoFocus
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60
                     text-white flex items-center justify-center
                     hover:bg-black/80 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-brand-400
                     transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="h-96 flex items-center justify-center" role="status" aria-label="Loading movie details">
            <svg className="w-8 h-8 text-brand-400 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {error && !loading && (
          <div className="h-96 flex flex-col items-center justify-center text-center px-6">
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={onClose} className="text-brand-400 text-sm font-medium hover:underline">
              Close
            </button>
          </div>
        )}

        {movie && !loading && !error && (
          <>
            <div className="relative h-48 sm:h-64 bg-surface-700">
              {backdropUrl(movie.backdrop_path) && (
                <img
                  src={backdropUrl(movie.backdrop_path)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-800 via-surface-800/40 to-transparent" />
            </div>

            <div className="p-5 sm:p-6 space-y-4 -mt-12 relative">
              <div className="flex gap-4">
                <img
                  src={posterUrl(movie.poster_path, 'w185')}
                  alt={`${movie.title} poster`}
                  className="w-24 sm:w-28 rounded-lg shadow-lg flex-shrink-0
                             aspect-[2/3] object-cover bg-surface-700"
                />
                <div className="flex-1 pt-12 sm:pt-14">
                  <h2 className="text-white font-bold text-lg sm:text-xl leading-tight">
                    {movie.title}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {movie.release_date?.slice(0, 4) || 'N/A'}
                    {movie.runtime ? ` • ${movie.runtime} min` : ''}
                    {' • '}<span aria-hidden="true">★</span> {movie.vote_average?.toFixed(1) ?? 'N/A'}
                  </p>
                </div>
              </div>

              {movie.tagline && (
                <p className="text-brand-400 text-sm italic">{movie.tagline}</p>
              )}

              {movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map(g => (
                    <span key={g.id} className="px-2.5 py-1 rounded-full bg-surface-700 text-gray-300 text-xs">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-300 text-sm leading-relaxed">
                {movie.overview || 'No description available.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MovieModal
