const CATEGORIES = [
  { key: 'popular',   label: 'Popular',   icon: '🔥' },
  { key: 'trending',  label: 'Trending',  icon: '📈' },
  { key: 'top_rated', label: 'Top Rated', icon: '⭐' },
]

const CategoryTabs = ({ active, onChange }) => (
  /*
   * flex-wrap: pills wrap on narrow screens
   * gap tightens on mobile, loosens on sm+
   */
  <div role="tablist" className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
    {CATEGORIES.map(({ key, label, icon }) => (
      <button
        key={key}
        role="tab"
        aria-selected={active === key}
        onClick={() => onChange(key)}
        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm
                    font-medium border transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
                    ${active === key
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-transparent border-surface-600 text-gray-400 hover:border-brand-400 hover:text-brand-400'
                    }`}
      >
        <span className="mr-1 text-xs">{icon}</span>
        {label}
      </button>
    ))}
  </div>
)

export default CategoryTabs