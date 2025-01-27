import { RatingDto, UserDto } from '@/services/nest-api'
import type { Choice } from '@/types/game.ts'
import type { Socket } from 'socket.io-client'

export enum Team {
  Order = 0,
  Chaos = 1,
}

export enum ServerMatchEvents {
  Message = 'message',
  /// Sends the player assignments
  Assignments = 'assignments', // new
  /// Send the match state report
  StateReport = 'state-report', // new
  /// Send the match result report
  MatchReport = 'match-report', // new
}

export enum ClientMatchEvents {
  GetAssignments = 'get-assignments',
  GetState = 'get-state',
  Pick = 'pick',
  Message = 'message',
  Surrender = 'surrender',
}

export type MessageData = {
  message: string
  sender: string
  time: number
}
export type AssignmentsData = {
  [Team.Order]: {
    profile: UserDto
  }
  [Team.Chaos]: {
    profile: UserDto
  }
}

export type StateReportData = {
  [Team.Order]: {
    timeLeft: number
    choices: Choice[]
    surrender: boolean
  }
  [Team.Chaos]: {
    timeLeft: number
    choices: Choice[]
    surrender: boolean
  }
  turn: Team | null
  finished: boolean
  pending: false
}

export type MatchReportData = {
  matchId: string
  winner: Team | null
  [Team.Order]: {
    score: number
    gain: number
    newRating: RatingDto
  }
  [Team.Chaos]: {
    score: number
    gain: number
    newRating: RatingDto
  }
}

export interface GameServerEventsMap {
  [ServerMatchEvents.Message](message: MessageData): void
  [ServerMatchEvents.Assignments](assignments: AssignmentsData): void
  [ServerMatchEvents.StateReport](report: StateReportData): void
  [ServerMatchEvents.MatchReport](report: MatchReportData): void
}

export interface GameClientEventsMap {
  [ClientMatchEvents.GetAssignments](): void
  [ClientMatchEvents.GetState](): void
  [ClientMatchEvents.Message](message: string): void
  [ClientMatchEvents.Pick](choice: Choice): void
  [ClientMatchEvents.Surrender](): void
}

export type GameSocket = Socket<GameServerEventsMap, GameClientEventsMap>
