export type PaginatedResponse<DataType, CursorType = string> = {
  result: DataType[]
  cursor: CursorType
}

/**
 * Represents a function that the usePaginated hook will call to fetch pages of
 * content and handle the data storage logic.
 */
export type PaginatedFetchFunction<DataType, CursorType = string> = (
  pageSize: number,
  cursor: CursorType | null
) => Promise<PaginatedResponse<DataType, CursorType>>

export type UsePaginatedReturnType<DataType> = {
  data: DataType[]

  isLoading: boolean

  /** Determines whether the content was fully loaded. */
  isAllDataLoaded: boolean

  /** Fetches one more page of content and appends it to the end of the current data array. */
  fetchPage(): Promise<void>

  /** Clears the data array and re-fetches the first page of data. */
  reFetch(): Promise<void>
}
