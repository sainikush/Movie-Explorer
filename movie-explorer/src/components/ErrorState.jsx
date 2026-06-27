/**
 * Shown when the API call throws — covers both network errors
 * and non-2xx HTTP responses.
 *
 * Props:
 *  - message {string}   human-readable error detail
 *  - onRetry {function} called when the user clicks "Try again"
 */
const ErrorState = ({ message, onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center py-24 px-4 text-center"
  >
    {/* Icon */}
    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20
                    flex items-center justify-center mb-5">
      <svg className="w-6 h-6 text-red-400" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>

    <h2 className="text-white font-semibold text-lg mb-1">
      Something went wrong
    </h2>
    <p className="text-gray-500 text-sm mb-6 max-w-xs leading-relaxed">
      {message}
    </p>

    <button
      onClick={onRetry}
      className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600
                 text-white text-sm font-medium transition-colors duration-200"
    >
      Try again
    </button>
  </div>
)

export default ErrorState