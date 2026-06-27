import { useState, useEffect } from 'react'

/**
 * Returns a debounced copy of `value` that only updates once `delay`ms
 * have passed without `value` changing again. Used so the search bar
 * doesn't fire an API request on every keystroke.
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
