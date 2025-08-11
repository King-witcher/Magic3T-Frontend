import { CommandHandler, Console } from '@/lib/console'
import { DependencyList, useEffect } from 'react'

export function useRegisterCommand(
  command: string,
  handler: CommandHandler,
  deps: DependencyList = []
) {
  useEffect(() => Console.addCommand(command, handler), deps)
}
