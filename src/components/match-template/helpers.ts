import { MatchModel, MatchSide } from '@/models'
import { MatchResult } from '@/types'

export function getSide(match: MatchModel, id: string) {
  return id === match.white.uid
    ? MatchSide.White
    : id === match.black.uid
      ? MatchSide.Black
      : null
}

export function getResult(match: MatchModel, side: MatchSide) {
  return match.winner === null
    ? MatchResult.Draw
    : match.winner === side
      ? MatchResult.Victory
      : MatchResult.Defeat
}
