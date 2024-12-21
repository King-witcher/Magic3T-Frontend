import { MatchSide } from '@/models'
import type { Choice, GameStateReport } from '@/types/game.ts'
import type { Socket } from 'socket.io-client'
import { Glicko } from './glicko'

export enum GameListenedEvent {
  OpponentUid = 'opponent-uid',
  Message = 'message',
  GameState = 'game-state',
  MatchReport = 'match-report',
  RatingsVariation = 'ratings-variation',
}

export enum GameEmittedEvents {
  GetState = 'get-state',
  GetOpponent = 'get-opponent',
  Choice = 'choice',
  Forfeit = 'forfeit',
  Message = 'message',
}

export type MatchReportData = {
  matchId: string
  winner: MatchSide | null
  white: {
    score: number
    gain: number
    newRating: Glicko
  }
  black: {
    score: number
    gain: number
    newRating: Glicko
  }
}

interface ListenEventsMap {
  [GameListenedEvent.OpponentUid](uid: string): void
  [GameListenedEvent.GameState](stateReport: GameStateReport): void
  [GameListenedEvent.Message](message: string): void
  [GameListenedEvent.MatchReport](matchReport: MatchReportData): void
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
