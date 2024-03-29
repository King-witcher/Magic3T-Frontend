import { ChangeEvent, useCallback, useState } from 'react'

export function useInput(initialState?: string) {
  const [data, setData] = useState(initialState)

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value)
  }, [])

  return [data, handleChange]
}
