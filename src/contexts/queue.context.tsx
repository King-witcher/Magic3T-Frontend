import { useGateway } from '@/hooks/use-gateway.ts'
import { useListener } from '@/hooks/use-listener.ts'
import type {
  QueueClientEventsMap,
  QueueServerEventsMap,
} from '@/types/QueueSocket.ts'
import { QueueMode, QueueModesType, QueueUserCount } from '@/types/queue.ts'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthState, useAuth } from './auth.context.tsx'
import { useGame } from './game.context.tsx'
import { useLiveActivity } from './live-activity.context.tsx'
import { NestApi } from '@/services'

interface QueueContextData {
  enqueue(mode: QueueMode): void
  dequeue(mode: QueueMode): void
  queueModes: QueueModesType
  queueUserCount: QueueUserCount
}

interface QueueContextProps {
  children: ReactNode
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  const { push } = useLiveActivity()
  // const [socket, setSocket] = useState<ReturnType<typeof io>>()
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
  const gameCtx = useGame()

  const gateway = useGateway<QueueServerEventsMap, QueueClientEventsMap>(
    'queue',
    authState === AuthState.SignedIn
  )

  useListener(gateway, 'matchFound', (data) => {
    setQueueModes({})
    gameCtx.connect(data.matchId)
  })

  useListener(gateway, 'updateUserCount', (data) => {
    setQueueUserCount(data)
  })

  useListener(gateway, 'queueModes', (data) => {
    setQueueModes(data)
  })

  useListener(gateway, 'disconnect', () => {
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

  useEffect(() => {
    gateway.emit('interact')
  }, [gateway])

  const enqueue = useCallback(
    async (mode: QueueMode) => {
      setQueueModes((current) => ({
        ...current,
        [mode]: true,
      }))

      const token = await getToken()
      await NestApi.Queue.enqueue(token, mode)
    },
    [gateway, user, setQueueModes, getToken]
  )

  const dequeue = useCallback(
    async (mode: QueueMode) => {
      const token = await getToken()
      await NestApi.Queue.dequeue(token)
      setQueueModes((current) => ({
        ...current,
        [mode]: false,
      }))
    },
    [gateway, getToken]
  )

  return (
    <QueueContext.Provider
      value={{ enqueue, dequeue, queueModes, queueUserCount }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => useContext(QueueContext)
