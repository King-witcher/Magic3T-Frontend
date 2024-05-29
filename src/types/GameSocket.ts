import { Socket } from 'socket.io-client'
import { Choice, GameStateReport } from '@/types/game.ts'

export enum GameListenedEvent {
  OpponentUid = 'opponent-uid',
  Message = 'message',
  GameState = 'game-state',
  RatingsVariation = 'ratings-variation',
}

export enum GameEmittedEvents {
  GetState = 'get-state',
  GetOpponent = 'get-opponent',
  Choice = 'choice',
  Forfeit = 'forfeit',
  Message = 'message',
}

interface ListenEventsMap {
  [GameListenedEvent.OpponentUid](uid: string): void
  [GameListenedEvent.GameState](stateReport: GameStateReport): void
  [GameListenedEvent.Message](message: string): void
  [GameListenedEvent.RatingsVariation](data: {
    player: number
    opponent: number
  }): void
}

interface EmitEventsMap {
  [GameEmittedEvents.GetOpponent](): void
  [GameEmittedEvents.GetState](): void
  [GameEmittedEvents.Message](message: string): void
  [GameEmittedEvents.Choice](choice: Choice): void
  [GameEmittedEvents.Forfeit](): void
}

export type GameSocket = Socket<ListenEventsMap, EmitEventsMap>
