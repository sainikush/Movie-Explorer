import { useMemo, useState } from 'react'
import SearchBar     from '../components/SearchBar'
import CategoryTabs  from '../components/CategoryTabs'
import GenreFilter   from '../components/GenreFilter'
import MovieGrid     from '../components/MovieGrid'
import LoadMoreButton from '../components/LoadMoreButton'
import ErrorState    from '../components/ErrorState'
import EmptyState    from '../components/EmptyState'
import MovieModal    from '../components/MovieModal'
import useMovies     from '../hooks/useMovies'
import useGenres     from '../hooks/useGenres'

const Home = () => {
  const {
    movies, loading, error, query, setQuery,
    category, handleCategoryChange,
    activeGenre, handleGenreChange,
    page, totalPages, loadMore, isSearching, retry,
  } = useMovies()

  const { genres } = useGenres()
  const [selectedId, setSelectedId] = useState(null)

  // id -> name lookup so MovieCard can show genre badges without an
  // extra request per card (TMDB's list endpoints only return genre_ids).
  const genreMap = useMemo(
    () => Object.fromEntries(genres.map(g => [g.id, g.name])),
    [genres]
  )

  return (
    <div className="min-h-screen bg-surface-900">

      {/* ── Hero header ─────────────────────────────── */}
      <header className="pt-20 sm:pt-24 pb-8 sm:pb-10
                         px-4 sm:px-6 lg:px-8
                         bg-gradient-to-b from-surface-800 to-surface-900">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

          {/* Title — smaller on mobile, larger on desktop */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Discover <span className="text-brand-400">Great Films</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
              Browse thousands of movies from The Movie Database
            </p>
          </div>

          {/* SearchBar — full width on mobile, centered on wider */}
          <SearchBar query={query} onChange={setQuery} loading={loading} />
        </div>
      </header>

      {/* ── Sticky filter bar ───────────────────────── */}
      <div className="sticky top-16 z-40
                      bg-surface-900/95 backdrop-blur-sm
                      border-b border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2 sm:space-y-3">
          {!isSearching && (
            <>
              <CategoryTabs active={category} onChange={handleCategoryChange} />
              <GenreFilter genres={genres} activeGenre={activeGenre} onChange={handleGenreChange} />
            </>
          )}
        </div>
      </div>

      {/* ── Main content ────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Section label */}
        {!error && (
          <div className="flex items-center justify-between mb-4 sm:mb-6" aria-live="polite">
            <h2 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
              {isSearching ? `Results for "${query}"` : 'Popular Movies'}
            </h2>
            {!loading && movies.length > 0 && (
              <span className="text-gray-500 text-xs">{movies.length} shown</span>
            )}
          </div>
        )}

        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : movies.length === 0 && !loading ? (
          <EmptyState query={query} />
        ) : (
          <MovieGrid movies={movies} loading={loading} genreMap={genreMap} onSelect={setSelectedId} />
        )}

        {!error && !isSearching && (
          <LoadMoreButton
            onClick={loadMore}
            loading={loading && page > 1}
            hasMore={page < totalPages}
          />
        )}
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-surface-700/50 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        py-4 sm:py-6
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">Built with React + Tailwind CSS</p>
          <p className="text-gray-600 text-xs">
            Data by{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
               className="text-brand-400 hover:underline">
              TMDB
            </a>
          </p>
        </div>
      </footer>

      {selectedId && <MovieModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  )
}

export default Home