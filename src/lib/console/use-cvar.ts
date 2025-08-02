import { useSyncExternalStore } from 'react'
import { Console } from './console'

export function useCvar(cvar: string) {
  return useSyncExternalStore(
    (callback) => {
      return Console.on('changeCvar', (changedCvar) => {
        if (changedCvar === cvar) {
          callback()
        }
      })
    },
    () => Console.cvars[cvar]
  )
}
