import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useQueryParams() {
  const { search } = useLocation()
  return useMemo(() => {
    return new URLSearchParams(search)
  }, [search])
}
