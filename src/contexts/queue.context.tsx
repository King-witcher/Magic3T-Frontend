import type { QueueSocket } from '@/types/QueueSocket.ts'
import type { GameMode, QueueModesType, QueueUserCount } from '@/types/queue.ts'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IoSearch } from 'react-icons/io5'
import { io } from 'socket.io-client'
import { useGame } from './game.context.tsx'
import { useLiveActivity } from './live-activity.context.tsx'
import { AuthState, useAuth } from './auth.context.tsx'

interface QueueContextData {
  enqueue(mode: GameMode): void
  dequeue(mode: GameMode): void
  queueModes: QueueModesType
  queueUserCount: QueueUserCount
}

interface QueueContextProps {
  children: ReactNode
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  const { push } = useLiveActivity()
  const [socket, setSocket] = useState<ReturnType<typeof io>>()
  const [queueModes, setQueueModes] = useState<QueueModesType>({})
  const [queueUserCount, setQueueUserCount] = useState<QueueUserCount>({
    casual: {
      inGame: Number.NaN,
      queue: 0,
    },
    connected: 0,
    ranked: {
      inGame: Number.NaN,
      queue: 0,
    },
  })
  const { user, authState, getToken } = useAuth()
  const { connectGame } = useGame()

  useEffect(() => {
    let newSocket: QueueSocket
    async function init() {
      if (authState !== AuthState.SignedIn) return

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
      newSocket.on('updateUserCount', (data) => {
        setQueueUserCount(data)
      })
      newSocket.on('disconnect', () => {
        setQueueModes({})
        setQueueUserCount({
          casual: {
            queue: 0,
            inGame: 0,
          },
          ranked: {
            queue: 0,
            inGame: 0,
          },
          connected: 0,
        })
      })
      newSocket.on('queueModes', (data) => {
        setQueueModes(data)
      })

      newSocket.emit('interact')
      if (socket) socket.disconnect()
      setSocket(newSocket)
    }
    const initPromise = init()

    return () => {
      initPromise.then(() => {
        if (newSocket) newSocket.disconnect()
        setQueueModes({})
      })
    }
  }, [user, authState])

  const enqueue = useCallback(
    async (mode: GameMode) => {
      setQueueModes((current) => ({
        ...current,
        [mode]: true,
      }))

      socket?.emit(mode)
    },
    [socket, user, setQueueModes]
  )

  const dequeue = useCallback(
    (mode: GameMode) => {
      socket?.emit('dequeue', mode)
      setQueueModes((current) => ({
        ...current,
        [mode]: false,
      }))
    },
    [socket]
  )

  useEffect(() => {
    if (queueModes.casual || queueModes.ranked) {
      return push({
        content: <IoSearch size="16px" />,
        tooltip: 'Procurando partida',
        url: '/',
      })
    }
  }, [queueModes.ranked, queueModes.casual])

  return (
    <QueueContext.Provider
      value={{ enqueue, dequeue, queueModes, queueUserCount }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
