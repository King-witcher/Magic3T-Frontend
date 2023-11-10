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
import { useGame } from './GameContext'

export enum GameMode {
  Casual = 'casual',
  Ranked = 'ranked',
}

type QueueModesType = {
  casual?: boolean
  ranked?: boolean
}

interface QueueContextData {
  enqueue(mode: GameMode): void
  dequeue(mode: GameMode): void
  queueModes: QueueModesType
}

interface QueueContextProps {
  children: ReactNode
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  const [socket, setSocket] = useState<ReturnType<typeof io>>()
  const [queueModes, setQueueModes] = useState<QueueModesType>({})
  const { user, getToken } = useAuth()
  const { connectGame } = useGame()

  useEffect(() => {
    let newSocket: ReturnType<typeof io>
    async function init() {
      if (user) {
        const token = await getToken()
        newSocket = io(`${import.meta.env.VITE_API_URL}/queue`, {
          auth: {
            token,
          },
        })
        newSocket.on('matchFound', (data) => {
          setQueueModes({})
          connectGame(data.matchId)
        })
        newSocket.on('disconnect', () => {
          setQueueModes({})
        })
        newSocket.on('queueModes', (data: any) => {
          setQueueModes(data)
        })
        setSocket(newSocket)
      }
    }
    init()

    return () => {
      if (newSocket) newSocket.disconnect()
      setQueueModes({})
    }
  }, [user])

  const enqueue = useCallback(
    async (mode: 'casual' | 'ranked') => {
      const token = await user?.getIdToken()

      socket?.emit(mode)

      setQueueModes((current) => ({
        ...current,
        [mode]: true,
      }))
    },
    [socket, user, setQueueModes],
  )

  const dequeue = useCallback(
    (mode: 'casual' | 'ranked') => {
      socket?.emit('dequeue', mode)
      setQueueModes((current) => ({
        ...current,
        [mode]: false,
      }))
    },
    [socket],
  )

  return (
    <QueueContext.Provider value={{ enqueue, dequeue, queueModes }}>
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
