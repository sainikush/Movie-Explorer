import { useState, memo } from 'react'
import { posterUrl } from '../utils/api'
import GenreBadge from './GenreBadge'

const MovieCard = ({ movie, genreMap, onSelect }) => {
  const [imgError, setImgError] = useState(false)
  const { id, title, poster_path, vote_average, release_date, overview, genre_ids } = movie
  const year   = release_date ? new Date(release_date).getFullYear() : 'N/A'
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A'

  // List endpoints only return genre_ids, not names — look the first
  // couple up against the id→name map built from useGenres().
  const genreLabels = (genre_ids || [])
    .slice(0, 2)
    .map(gid => genreMap?.[gid])
    .filter(Boolean)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      className="movie-card group w-full text-left
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-brand-400"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-surface-700 overflow-hidden">
        {!imgError && poster_path ? (
          <img
            src={posterUrl(poster_path)}
            alt={`${title} poster`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover
                       transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2
                        flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1
                        rounded-full bg-black/70 text-yellow-400
                        text-[10px] sm:text-xs font-semibold">
          ★ {rating}
        </div>
      </div>

      {/* Body */}
      <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
        <h3 className="text-xs sm:text-sm font-semibold text-white
                       leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-500">{year}</p>

        {genreLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genreLabels.map(label => <GenreBadge key={label} label={label} />)}
          </div>
        )}

        {/*
          Description: hidden on mobile (saves vertical space),
          visible from sm (640px) upward via responsive class
        */}
        <p className="hidden sm:block text-[10px] sm:text-xs
                      text-gray-400 leading-relaxed line-clamp-3">
          {overview || 'No description available.'}
        </p>
      </div>
    </button>
  )
}

export default memo(MovieCard)