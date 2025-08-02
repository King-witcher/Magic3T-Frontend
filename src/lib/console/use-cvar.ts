import { useSyncExternalStore } from 'react'
import { useConsole } from './console-provider'

export function useCvar(cvar: string) {
  const { console } = useConsole()

  return useSyncExternalStore(
    (callback) => {
      return console.on('changeCvar', (changedCvar) => {
        if (changedCvar === cvar) {
          callback()
        }
      })
    },
    () => console.cvars[cvar]
  )
}
