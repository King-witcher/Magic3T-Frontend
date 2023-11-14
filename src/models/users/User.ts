import { WithId } from '@/types/WithId'

export type UserData = WithId & {
  nickname: string
  photoURL: string
  glicko: {
    rating: number
    deviation: number
    timestamp: number
  }
  role: 'player' | 'admin'
}
