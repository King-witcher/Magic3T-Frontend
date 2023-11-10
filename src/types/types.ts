export type Choice = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export enum GameStatus {
  Victory = 'victory',
  Defeat = 'defeat',
  Draw = 'draw',
  Playing = 'playing',
  Waiting = 'waiting',
}

export type GameStateReport = {
  playerChoices: Choice[]
  oponentChoices: Choice[]
  status: GameStatus
  playerTimeLeft: number
  oponentTimeLeft: number
  turn: boolean
}
