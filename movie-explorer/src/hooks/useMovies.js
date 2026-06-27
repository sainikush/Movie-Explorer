import { useState, useEffect, useCallback, useRef } from 'react'
import { CATEGORY_FETCHERS, fetchByGenre, searchMovies } from '../utils/api'
import useDebounce from './useDebounce'

const MAX_PAGE = 500 // TMDB's own page ceiling

const useMovies = () => {
  const [movies, setMovies]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [query, setQuery]         = useState('')
  const [category, setCategory]   = useState('popular')
  const [activeGenre, setActiveGenre] = useState(null)
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 👇 400ms delay so we don't fire an API call on every keystroke
  const debouncedQuery = useDebounce(query, 400)
  const isSearching = debouncedQuery.trim().length > 0

  const controllerRef = useRef(null)

  const fetchPage = useCallback(async (pageToLoad, append) => {
    // Cancel whatever's still in flight before starting a new request
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const data = isSearching
        ? await searchMovies(debouncedQuery.trim(), pageToLoad, controller.signal)
        : activeGenre
          ? await fetchByGenre(activeGenre, pageToLoad, controller.signal)
          : await CATEGORY_FETCHERS[category](pageToLoad, controller.signal)

      setMovies(prev => (append ? [...prev, ...(data.results || [])] : (data.results || [])))
      setTotalPages(Math.min(data.total_pages || 1, MAX_PAGE))
      setPage(pageToLoad)
    } catch (err) {
      if (err.name === 'AbortError') return // a newer request superseded this one
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isSearching, debouncedQuery, category, activeGenre])

  // Reset to page 1 whenever the search term, category, or genre changes
  useEffect(() => {
    fetchPage(1, false)
    return () => controllerRef.current?.abort()
    // fetchPage is recreated from the same deps, so depending on it directly
    // would just re-run this effect for the same reasons — keeping the
    // dependency list explicit instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, activeGenre])

  const loadMore = useCallback(() => {
    if (loading || page >= totalPages) return
    fetchPage(page + 1, true)
  }, [loading, page, totalPages, fetchPage])

  const handleCategoryChange = useCallback((nextCategory) => {
    setActiveGenre(null) // categories and the genre filter are mutually exclusive
    setCategory(nextCategory)
  }, [])

  const handleGenreChange = useCallback((genreId) => {
    setActiveGenre(prev => (prev === genreId ? null : genreId)) // click again to clear
  }, [])

  const retry = useCallback(() => fetchPage(page, false), [fetchPage, page])

  return {
    movies, loading, error, query, setQuery,
    category, handleCategoryChange,
    activeGenre, handleGenreChange,
    page, totalPages, loadMore, isSearching, retry,
  }
}

export default useMovies
