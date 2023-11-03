import { useEffect, useState } from 'react'

export type Loader<T> = [data: T, loading: false] | [data: null, loading: true]

export function useAsync<T>(loader: () => Promise<T>): Loader<T> {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    loader().then(setData)
  }, [loader])

  if (data) return [data, false]
  else return [null, true]
}
