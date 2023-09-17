export type Choice = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export enum GameStatus {
  Undefined = 'undefined',
  Ongoing = 'ongoing',
  Victory = 'victory',
  Draw = 'draw',
  Defeat = 'defeat',
}

export type GameState = {
  playerChoices: Choice[]
  oponentChoices: Choice[]
  gameStatus: GameStatus
  playerTimeLeft: number
  oponentTimeLeft: number
}
