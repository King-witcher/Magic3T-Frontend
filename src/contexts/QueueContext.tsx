import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

export enum GameMode {
  Casual = 'casual',
  Ranked = 'ranked',
}
interface QueueContextData {
  enqueue(
    queuType: GameMode,
    callback: (payload: { matchId: string; playerKey: string }) => void,
  ): void
  dequeue(): void
  /**Para qual modo se está na fila; caso não esteja, null. */
  queueMode: GameMode | null
}

interface QueueContextProps {
  children: ReactNode
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  const [socket, setSocket] = useState<ReturnType<typeof io>>()
  const [queueMode, setQueueMode] = useState<GameMode | null>(null)
  const { user } = useAuth()

  const enqueue = useCallback(
    async (
      queueMode: Parameters<QueueContextData['enqueue']>[0],
      callback: Parameters<QueueContextData['enqueue']>[1],
    ) => {
      if (socket) return

      const token = await user?.getIdToken()
      const newSocket = io(`${import.meta.env.VITE_API_URL}/queue`, {
        auth: {
          token,
        },
      })
      setSocket(newSocket)
      newSocket.on('connect', () => {
        newSocket.emit(queueMode)
      })
      newSocket.on('matchFound', callback)
      newSocket.on('disconnect', () => {
        setSocket(undefined)
        setQueueMode(null)
      })

      setQueueMode(queueMode)
    },
    [socket, user],
  )

  const dequeue = useCallback(() => {
    if (!socket) return
    socket.disconnect()
    setSocket(undefined)
    setQueueMode(null)
  }, [socket])

  useEffect(() => {
    socket?.disconnect()
    setSocket(undefined)
    setQueueMode(null)
  }, [user])

  return (
    <QueueContext.Provider value={{ enqueue, dequeue, queueMode }}>
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
