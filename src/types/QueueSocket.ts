import { Socket } from 'socket.io-client'
import { QueueModesType, QueueUserCount } from '@/types/queue.ts'

interface ListenEventsMap {
  matchFound(data: { matchId: string }): void
  updateUserCount(data: QueueUserCount): void
  queueModes(data: QueueModesType): void
}

interface EmitEventsMap {
  interact(): void
}

export type QueueSocket = Socket<ListenEventsMap, EmitEventsMap>
