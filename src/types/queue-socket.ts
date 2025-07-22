import type { Socket } from 'socket.io-client'
import { QueueClientEventsMap, QueueServerEventsMap } from '@magic3t/types'

export type QueueSocket = Socket<QueueServerEventsMap, QueueClientEventsMap>
