export type UserData = {
  nickname: string
  glicko: {
    rating: number
    deviation: number
    timestamp: number
  }
  role: 'player' | 'admin'
}
