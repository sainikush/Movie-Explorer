import { memo } from 'react'
import MovieCard    from './MovieCard'
import SkeletonCard from './SkeletonCard'

/**
 * Breakpoint → columns mapping (Tailwind):
 *   default  (< 640px)  → 2 cols   mobile
 *   sm       (≥ 640px)  → 3 cols   large mobile / small tablet
 *   md       (≥ 768px)  → 4 cols   tablet
 *   lg       (≥ 1024px) → 5 cols   laptop
 *   xl       (≥ 1280px) → 6 cols   desktop
 */
const GRID_COLS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4'

const MovieGrid = ({ movies, loading, genreMap, onSelect }) => {

  if (loading && movies.length === 0) {
    return (
      <div className={GRID_COLS}>
        {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className={GRID_COLS}>
      {movies.map(m => (
        <MovieCard key={m.id} movie={m} genreMap={genreMap} onSelect={onSelect} />
      ))}
      {loading && Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={`more-${i}`} />
      ))}
    </div>
  )
}

export default memo(MovieGrid)
