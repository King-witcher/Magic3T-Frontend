import { Glicko } from '@/types/Glicko'
import { WithId } from '@/types/WithId'

export type UserData = WithId & {
  nickname: string
  photoURL: string
  glicko: Glicko
  role: 'player' | 'admin' | 'bot'
  stats: {
    wins: number
    draws: number
    defeats: number
  }
}
