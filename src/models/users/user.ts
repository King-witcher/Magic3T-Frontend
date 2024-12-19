import type { Glicko } from '@/types/glicko.ts'
import type { WithId } from '@/types/withId.ts'

export type UserData = WithId & {
  identification?: {
    unique_id: string // nickname.toLower() without spaces
    nickname: string
    last_changed: Date
  } | null

  experience: number
  magic_points: number // bought with money
  perfect_squares: number // earned playing
  summoner_icon: number

  role: 'player' | 'bot' | 'creator'

  glicko: Glicko

  stats: {
    wins: number
    draws: number
    defeats: number
  }
}
