import { Choice } from '@/types/game'

export type RatingDto = {
  score: number
  rd: number
  date: number
}

export type UserDto = {
  id: string
  nickname: string | null
  summonerIcon: number
  role: 'bot' | 'player' | 'creator'
  rating: RatingDto
  stats: {
    wins: number
    draws: number
    defeats: number
  }
}

export interface MatchDtoTeam {
  id: string
  nickname: string
  ratingScore: number
  ratingGain: number
  matchScore: number
}

export enum Team {
  Order = 0,
  Chaos = 1,
}

export enum MatchEventType {
  Choice = 0,
  Forfeit = 1,
  Timeout = 2,
  Message = 3,
}

type BaseMatchEvent = {
  event: MatchEventType
  side: Team
  time: number
}

export type MatchDtoEvent = BaseMatchEvent &
  (
    | {
        event: MatchEventType.Choice
        choice: Choice
      }
    | {
        event: MatchEventType.Message
        message: string
      }
    | {
        event: MatchEventType.Timeout | MatchEventType.Forfeit
      }
  )

export interface MatchDto {
  id: string
  teams: Record<Team, MatchDtoTeam>
  events: MatchDtoEvent[]
  winner: Team | null
  time: number
}
