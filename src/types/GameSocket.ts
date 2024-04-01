import { Socket } from 'socket.io-client'
import { Choice } from '@/types/game.ts'

interface ListenEventsMap {
  oponentUid(uid: string): void
  // TODO: type this!!!
  gameState(stateReport: string): void
  message(message: string): void
  ratingsVariation(data: { player: number; oponent: number }): void
}

interface EmitEventsMap {
  getOponentProfile(): void
  message(message: string): void
  choice(choice: Choice): void
  ready(): void
  forfeit(): void
}

export type GameSocket = Socket<ListenEventsMap, EmitEventsMap>
