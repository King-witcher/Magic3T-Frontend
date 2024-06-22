import { Choice } from '@/types/game'
import { WithId } from '@/types/withId'

export interface HistoryMatchPlayer {
  uid: string
  name: string
  score: number
  gain: number
}

export enum MatchSide {
  White = 0,
  Black = 1,
}

export enum GameMode {
  Casual = 0b00,
  Ranked = 0b10,
  PvP = 0b00,
  PvC = 0b01,
}

export enum HistoryMatchEventsEnum {
  Choice,
  Forfeit,
  Timeout,
  Message,
}

type BaseMatchEvent = {
  event: HistoryMatchEventsEnum
  side: MatchSide
  time: number
}

export type HistoryMatchEvent = BaseMatchEvent &
  (
    | {
        event: HistoryMatchEventsEnum.Choice
        message: never
        choice: Choice
      }
    | {
        event: HistoryMatchEventsEnum.Message
        message: string
        choice: never
      }
    | {
        event: HistoryMatchEventsEnum.Timeout | HistoryMatchEventsEnum.Forfeit
        message: never
        choice: never
      }
  )

/** Represents a match registry in the History. */
export interface MatchModel extends WithId {
  white: HistoryMatchPlayer
  black: HistoryMatchPlayer
  events: HistoryMatchEvent[]
  winner: MatchSide | null
  gameMode: GameMode
  timestamp: Date
}
