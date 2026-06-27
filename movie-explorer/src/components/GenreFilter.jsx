const GenreFilter = ({ genres, activeGenre, onChange }) => {
  if (!genres.length) return null

  return (
    /*
     * overflow-x-auto + w-max inside = horizontal scroll on mobile
     * pb-1 prevents clipping of the scrollbar on some browsers
     * On desktop there are fewer genres visible so it rarely needs to scroll
     */
    <div className="w-full overflow-x-auto pb-1 -mb-1">
      <div className="flex items-center gap-1.5 sm:gap-2 w-max pr-4">
        <span className="text-[10px] sm:text-xs text-gray-500 font-medium
                         uppercase tracking-wider whitespace-nowrap mr-1">
          Genre
        </span>
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => onChange(genre.id)}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full
                        text-[10px] sm:text-xs font-medium whitespace-nowrap
                        border transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
                        ${activeGenre === genre.id
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-transparent text-gray-400 border-surface-600 hover:border-brand-400 hover:text-brand-400'
                        }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreFilter