import { useGameConnector } from '@/hooks/useGameConnector'
import { ReactNode, createContext, useContext } from 'react'

interface GameData extends ReturnType<typeof useGameConnector> {}

interface Props {
  children?: ReactNode
}

const GameContext = createContext<GameData>({} as GameData)

export function GameProvider({ children }: Props) {
  const connector = useGameConnector()

  return (
    <GameContext.Provider value={connector}>{children}</GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
