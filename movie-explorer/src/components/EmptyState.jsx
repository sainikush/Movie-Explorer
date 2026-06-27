/**
 * Shown when the API succeeds but returns zero results —
 * typically after a search that matches nothing.
 *
 * Props:
 *  - query {string} the search term that returned nothing
 */
const EmptyState = ({ query }) => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
    <div className="w-14 h-14 rounded-full bg-surface-700 flex items-center
                    justify-center mb-5 text-3xl">
      🎬
    </div>
    <h2 className="text-white font-semibold text-lg mb-1">No results found</h2>
    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
      No movies matched{' '}
      <span className="text-brand-400 font-medium">"{query}"</span>.
      Try a different title or keyword.
    </p>
  </div>
)

export default EmptyState