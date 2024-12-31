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
}

export type RatingDto = {
  score: number
  rd: number
  date: number
}
