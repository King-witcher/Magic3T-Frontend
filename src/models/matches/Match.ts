import { WithId } from '@/types/WithId'
import { Choice } from '@/types/types'

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
