import { ReactNode, createContext, useContext } from 'react'
import { Console } from './console'

type ProviderData = {
  console: Console
}

interface Props {
  children?: ReactNode
}

const ConsoleContext = createContext<ProviderData>({} as ProviderData)

const console = new Console()

export function ConsoleProvider({ children }: Props) {
  return (
    <ConsoleContext.Provider value={{ console }}>
      {children}
    </ConsoleContext.Provider>
  )
}

export const useConsole = () => useContext(ConsoleContext)
