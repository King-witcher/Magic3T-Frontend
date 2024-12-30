import type { Choice } from '@/types/game'
import type { WithId } from '@/types/withId'

export interface HistoryMatchPlayer {
  uid: string
  name: string
  rating: number
  score: number
  gain: number
}

export enum Team {
  Order = 0,
  Chaos = 1,
}

export enum GameMode {
  Casual = 0b00,
  Ranked = 0b10,
  PvP = 0b00,
  PvC = 0b01,
}

export enum HistoryMatchEventsEnum {
  Choice = 0,
  Forfeit = 1,
  Timeout = 2,
  Message = 3,
}

type BaseMatchEvent = {
  event: HistoryMatchEventsEnum
  side: Team
  time: number
}

export type MatchEventModal = BaseMatchEvent &
  (
    | {
        event: HistoryMatchEventsEnum.Choice
        choice: Choice
      }
    | {
        event: HistoryMatchEventsEnum.Message
        message: string
      }
    | {
        event: HistoryMatchEventsEnum.Timeout | HistoryMatchEventsEnum.Forfeit
      }
  )

/** Represents a match registry in the History. */
export interface MatchModel extends WithId {
  [Team.Order]: HistoryMatchPlayer
  [Team.Chaos]: HistoryMatchPlayer
  events: MatchEventModal[]
  winner: Team | null
  gameMode: GameMode
  timestamp: Date
}
