import { ReactNode, createContext, useContext } from 'react'

interface QueueContextData {
  enqueue(queuType: QueueType, callback: (gameId: string) => void): void
}

interface QueueContextProps {
  children: ReactNode
}

export enum QueueType {
  Casual,
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  async function enqueue(
    queueType: QueueType,
    callback: (gameId: string) => void
  ) {}

  return (
    <QueueContext.Provider value={{ enqueue }}>
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
