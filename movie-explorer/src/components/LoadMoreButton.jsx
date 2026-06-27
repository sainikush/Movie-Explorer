/**
 * Pagination control shown below the grid.
 * Renders nothing once there's no further page to fetch.
 */
const LoadMoreButton = ({ onClick, loading, hasMore }) => {
  if (!hasMore) return null

  return (
    <div className="flex justify-center mt-8 sm:mt-10">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-busy={loading}
        className="px-6 py-2.5 rounded-full bg-surface-800 border border-surface-600
                   text-white text-sm font-medium flex items-center gap-2
                   hover:border-brand-400 hover:text-brand-400
                   disabled:opacity-60 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
                   transition-colors duration-200"
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </div>
  )
}

export default LoadMoreButton
