import { type RefCallback, useCallback, useRef, useState } from 'react'

export type UseInfiniteScrollReturnType = {
  lastElementRef: RefCallback<Element>
  isLoading: boolean
}

/**
 * Provides a ref to handle infinite scroll only when the last element gets
 * visible on the user's viewport.
 *
 * @param loadFn
 * The function that should be called to load more content when the user scrolls
 * until the last element.
 * @param enabled
 * Enables calling the loadFn when at the end of the scrolling. Set this to
 * false when there is no more content to load.
 */
export function useInfiniteScroll(
  loadFn: () => Promise<unknown>,
  enabled: boolean
): UseInfiniteScrollReturnType {
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver>()

  const lastElementRef = useCallback(
    (node: Element | null) => {
      observerRef.current?.disconnect()

      if (!node) return
      if (isLoading) return
      if (!enabled) return

      const observer = new IntersectionObserver(async (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setIsLoading(true)
          await loadFn()
          setIsLoading(false)
        }
      })

      observerRef.current = observer

      observer.observe(node)
    },
    [loadFn, enabled, isLoading]
  )

  return { isLoading, lastElementRef }
}
