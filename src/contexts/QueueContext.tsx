import { useGameConnector } from '@/hooks/useGameConnector'
import { ReactNode, createContext, useContext, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export enum GameMode {
  Casual = 'casual',
}
interface QueueContextData {
  enqueue(queuType: GameMode, callback: (gameId: string) => void): void
  dequeue(): void
  /**Para qual modo se está na fila; caso não esteja, null. */
  queueMode: GameMode | null
}

interface QueueContextProps {
  children: ReactNode
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  const socketRef = useRef<ReturnType<typeof io>>()
  const [queueMode, setQueueMode] = useState<GameMode | null>(null)

  async function enqueue(
    queueMode: GameMode,
    callback: (gameId: string) => void
  ) {
    console.log(socketRef.current)
    if (socketRef.current) return
    const socket = (socketRef.current = io(
      `${import.meta.env.VITE_API_URL}/queue`
    ))
    socket.on('matchFound', callback)
    socket.on('disconnect', () => {
      socketRef.current = undefined
      setQueueMode(null)
    })
    socket.emit('enqueue')

    setQueueMode(queueMode)
  }

  function handleMatchFound(callback: (gameId: string) => void) {}

  async function dequeue() {
    if (!socketRef.current) return
    socketRef.current.disconnect()
    socketRef.current = undefined
    setQueueMode(null)
  }

  return (
    <QueueContext.Provider value={{ enqueue, dequeue, queueMode }}>
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
