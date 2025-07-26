import { GameClientEventsMap, GameServerEventsMap } from '@magic3t/types'
import type { Socket } from 'socket.io-client'

export type GameSocket = Socket<GameServerEventsMap, GameClientEventsMap>
