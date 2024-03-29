import { useCallback, useState } from 'react'
import type {
  PaginatedFetchFunction,
  UsePaginatedReturnType,
} from '@/types/pagination.ts'

export const usePaginated = <DataType, CursorType = string>(
  fetchFunction: PaginatedFetchFunction<DataType, CursorType>,
  pageSize: number,
): UsePaginatedReturnType<DataType> => {
  const [data, setData] = useState<DataType[]>([])
  const [cursor, setCursor] = useState<CursorType | null>(null)
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPage = useCallback(async () => {
    if (isAllDataLoaded) return
    if (isLoading) return

    setIsLoading(true)
    const { result, cursor: nextCursor } = await fetchFunction(pageSize, cursor)
    setData((current) => [...current, ...result])
    setCursor(nextCursor)
    setIsLoading(false)

    if (result.length < pageSize || nextCursor === null) {
      setIsAllDataLoaded(true)
    }
  }, [pageSize, isAllDataLoaded, cursor, isLoading, fetchFunction, setData])

  const reFetch = useCallback(async () => {
    if (isLoading) return
    setData([])
    setIsAllDataLoaded(false)

    setIsLoading(true)
    const { result, cursor: nextCursor } = await fetchFunction(pageSize, cursor)
    setData(result)
    setCursor(nextCursor)
    setIsLoading(false)
  }, [fetchFunction, pageSize, isLoading])

  return {
    data,
    isAllDataLoaded,
    isLoading,
    fetchPage,
    reFetch,
  }
}
