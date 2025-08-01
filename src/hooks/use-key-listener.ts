import { DependencyList, useEffect } from 'react'

export function useKeyListener(
  key: string,
  callback: (event: KeyboardEvent) => void,
  deps: DependencyList = [],
  enabled = true
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: callback changes every render
  useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      if (event.key === key) callback(event)
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [key, enabled, ...deps])
}
