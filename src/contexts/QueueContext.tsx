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
    async (queueMode: 'casual' | 'ranked') => {
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
      newSocket.on('matchFound', (data) => {
        setQueueModes({})
      })
      newSocket.on('disconnect', () => {
        // setSocket(undefined)
        setQueueModes({})
      })

      setQueueModes((current) => ({
        ...current,
        [queueMode]: true,
      }))
    },
    [socket, user],
  )

  const dequeue = useCallback(
    (mode: 'casual' | 'ranked') => {
      if (!socket) return
      setSocket(undefined)
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
