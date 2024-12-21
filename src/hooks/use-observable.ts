import { useCallback, useRef } from 'react'

export type Observer<T> = (event: T) => void
export type Subscribe<T> = (observer: Observer<T>) => () => void

export function useObservable<T>(): [
  observe: Subscribe<T>,
  emit: (event: T) => void,
] {
  const nextId = useRef(0)
  const observableItems = useRef<Map<number, Observer<T>>>(new Map())

  const observe = useCallback((observer: Observer<T>) => {
    const id = nextId.current
    nextId.current += 1

    observableItems.current.set(id, observer)

    return () => {
      observableItems.current.delete(id)
    }
  }, [])

  const emit = useCallback((event: T) => {
    for (const [_, observer] of observableItems.current) {
      observer(event)
    }
  }, [])

  return [observe, emit]
}
