import { RefObject, useEffect } from 'react'

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: (ev: MouseEvent | TouchEvent | FocusEvent) => void
) {
  useEffect(() => {
    function listener(ev: MouseEvent) {
      const target = ev.target as Node
      if (!target || !ref.current) {
        return
      }

      if (!ref.current.contains(target)) {
        callback(ev)
      }
    }

    window.addEventListener('mousedown', listener)
    return () => window.removeEventListener('mousedown', listener)
  }, [callback])
}
