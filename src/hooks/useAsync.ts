import { DependencyList, useEffect, useState } from 'react'

export type Loader<T> = [data: T, loading: false] | [data: null, loading: true]

export function useAsync<T>(
  loader: () => Promise<T>,
  deps: DependencyList = [],
): Loader<T> {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    console.log(loader)
    loader().then(setData)
  }, deps)

  if (data) return [data, false]
  else return [null, true]
}
