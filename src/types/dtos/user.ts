import { UserData } from '@/models/users/user'

export class UserDto {
  id!: string
  nickname!: string | null
  summonerIcon!: number
  role!: 'bot' | 'player' | 'creator'
  rating!: RatingDto
  stats!: {
    wins: number
    draws: number
    defeats: number
  }

  constructor(data: UserDto) {
    Object.assign(this, data)
  }

  static fromModel(model: UserData): UserDto {
    return new UserDto({
      id: model._id,
      nickname: model.identification?.nickname || null,
      summonerIcon: model.summoner_icon,
      role: model.role,
      stats: {
        wins: model.stats.wins,
        draws: model.stats.draws,
        defeats: model.stats.defeats,
      },
      rating: {
        score: model.glicko.rating,
        rd: model.glicko.deviation,
        date: model.glicko.timestamp.getTime(),
      },
    })
  }
}

export type RatingDto = {
  score: number
  rd: number
  date: number
}
