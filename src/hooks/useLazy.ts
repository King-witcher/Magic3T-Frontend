import { DependencyList, useCallback, useEffect, useState } from 'react'

export type LazyLoadData<ReturnType> = [ReturnType | null, boolean, () => void]

export function useLazy<ReturnType>(
  loadFunction: () => Promise<ReturnType>,
  deps: DependencyList = [],
): LazyLoadData<ReturnType> {
  const [loading, setLoading] = useState(false)
  const [resource, setResource] = useState<ReturnType | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const resource = await loadFunction()
      setResource(resource)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    setResource(null)
  }, deps)

  return [resource, loading, load] as const
}
