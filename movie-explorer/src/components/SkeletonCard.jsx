/**
 * Placeholder shown in the grid while movies are loading, so the
 * layout never appears blank during a fetch.
 */
const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden bg-surface-800" aria-hidden="true">
    <div className="aspect-[2/3] bg-surface-700 animate-pulse" />
    <div className="p-2 sm:p-3 space-y-2">
      <div className="h-3 bg-surface-700 rounded animate-pulse w-4/5" />
      <div className="h-2.5 bg-surface-700 rounded animate-pulse w-1/3" />
      <div className="hidden sm:block space-y-1.5 pt-1">
        <div className="h-2 bg-surface-700 rounded animate-pulse w-full" />
        <div className="h-2 bg-surface-700 rounded animate-pulse w-5/6" />
      </div>
    </div>
  </div>
)

export default SkeletonCard
