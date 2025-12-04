import { Cmd, Console } from '@/lib/console'
import { DependencyList, useEffect } from 'react'

export function useRegisterCommand(cmd: Cmd, deps: DependencyList = []) {
  useEffect(() => Console.addCommand(cmd), deps)
}
