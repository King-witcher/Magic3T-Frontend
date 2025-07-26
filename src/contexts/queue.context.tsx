import { useGateway } from '@/hooks/use-gateway.ts'
import { useListener } from '@/hooks/use-listener.ts'
import { NestApi } from '@/services'
import { QueueMode } from '@/types/queue.ts'
import {
  QueueClientEvents,
  QueueClientEventsMap,
  QueueServerEvents,
  QueueServerEventsMap,
  UserCountData,
} from '@magic3t/types'
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

export type QueueModesType = {
  'bot-0'?: boolean
  'bot-1'?: boolean
  'bot-2'?: boolean
  'bot-3'?: boolean
  casual?: boolean
  ranked?: boolean
}

interface QueueContextData {
  enqueue(mode: QueueMode): void
  dequeue(mode: QueueMode): void
  queueModes: QueueModesType
  queueUserCount: UserCountData
}

interface QueueContextProps {
  children: ReactNode
}

const QueueContext = createContext<QueueContextData>({} as QueueContextData)

export function QueueProvider({ children }: QueueContextProps) {
  const { push } = useLiveActivity()
  // const [socket, setSocket] = useState<ReturnType<typeof io>>()
  const [queueModes, setQueueModes] = useState<QueueModesType>({})
  const [queueUserCount, setQueueUserCount] = useState<UserCountData>({
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

  useListener(gateway, QueueServerEvents.MatchFound, (data) => {
    setQueueModes({})
    gameCtx.connect(data.matchId)
  })

  useListener(gateway, QueueServerEvents.UpdateUserCount, (data) => {
    setQueueUserCount(data)
  })

  useListener(gateway, QueueServerEvents.QueueModes, (data) => {
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
    gateway.emit(QueueClientEvents.Interact)
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
