import type { QueueModesType, QueueUserCount } from '@/types/queue.ts'
import type { Socket } from 'socket.io-client'

export interface QueueServerEventsMap {
  matchFound(data: { matchId: string }): void
  updateUserCount(data: QueueUserCount): void
  queueModes(data: QueueModesType): void
}

export interface QueueClientEventsMap {
  interact(): void
  fair(): void
  'bot-0'(): void
  'bot-1'(): void
  'bot-2'(): void
  'bot-3'(): void
  casual(): void
  ranked(): void
  dequeue(mode: string): void
}

export type QueueSocket = Socket<QueueServerEventsMap, QueueClientEventsMap>
