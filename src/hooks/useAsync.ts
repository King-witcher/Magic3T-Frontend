import { DependencyList, useEffect, useState } from 'react'

export type Loader<T> =
  | [data: T, loading: false]
  | [data: null, loading: boolean]

export function useAsync<T>(
  loader: () => Promise<T>,
  deps: DependencyList = [],
): Loader<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setData(null)
    setIsLoading(true)
    loader()
      .then(setData)
      .finally(() => setIsLoading(false))
  }, deps)

  if (data) return [data, false]
  else return [null, isLoading]
}
