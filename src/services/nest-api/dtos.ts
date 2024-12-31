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
