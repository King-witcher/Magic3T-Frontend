import type { Glicko } from '@/types/glicko.ts'
import type { WithId } from '@/types/withId.ts'

export type UserData = WithId & {
  nickname: string
  photoURL: string
  glicko: Glicko
  role: 'player' | 'creator' | 'bot'
  stats: {
    wins: number
    draws: number
    defeats: number
  }
}
