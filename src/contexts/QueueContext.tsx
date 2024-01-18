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
import { useLiveActivity } from './LiveActivityContext'
import { IoGameController, IoSearch } from 'react-icons/io5'
import { useGuardedAuth } from './GuardedAuthContext'

export enum GameMode {
  Bot0 = 'bot-0',
  Bot1 = 'bot-1',
  Bot2 = 'bot-2',
  Bot3 = 'bot-3',
  Casual = 'casual',
  Ranked = 'ranked',
}

type QueueModesType = {
  'bot-0'?: boolean
  'bot-1'?: boolean
  'bot-2'?: boolean
  'bot-3'?: boolean
  casual?: boolean
  ranked?: boolean
}

interface QueueUserCount {
  casual: {
    inGame: number
    queue: number
  }
  connected: number
  ranked: {
    inGame: number
    queue: number
  }
}

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
      inGame: NaN,
      queue: 0,
    },
    connected: 0,
    ranked: {
      inGame: NaN,
      queue: 0,
    },
  })
  const { user, getToken } = useGuardedAuth()
  const { connectGame } = useGame()

  useEffect(() => {
    let newSocket: ReturnType<typeof io>
    async function init() {
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
      newSocket.on('updateUserCount', (data: any) => {
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
      newSocket.on('queueModes', (data: any) => {
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
  }, [user])

  const enqueue = useCallback(
    async (mode: GameMode) => {
      setQueueModes((current) => ({
        ...current,
        [mode]: true,
      }))

      socket?.emit(mode)
    },
    [socket, user, setQueueModes],
  )

  const dequeue = useCallback(
    (mode: GameMode) => {
      socket?.emit('dequeue', mode)
      setQueueModes((current) => ({
        ...current,
        [mode]: false,
      }))
    },
    [socket],
  )

  useEffect(() => {
    if (queueModes.casual || queueModes.ranked) {
      return push({
        content: <IoSearch size="16px" />,
        tooltip: 'Procurnado partida',
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
