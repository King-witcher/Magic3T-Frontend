import { WithId } from '@/types/withId.ts'
import { Choice } from '@/types/game.ts'

export interface PlayerMove {
  player: 'white' | 'black'
  move: Choice | 'forfeit' | 'timeout'
  time: number
}

export interface MatchPlayer {
  uid: string
  name: string
  rating: number
  rv: number
}

export interface Match extends WithId {
  white: MatchPlayer
  black: MatchPlayer
  moves: PlayerMove[]
  winner: 'white' | 'black' | 'none'
  mode: 'casual' | 'ranked'
  timestamp: Date
}
