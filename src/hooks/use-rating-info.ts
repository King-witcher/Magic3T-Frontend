import { useConfig } from '@/contexts/config.context.tsx'
import { RatingDto } from '@/types/dtos/user'
import type { Division } from '@/utils/ranks'
import { block } from '@/utils/utils'

export enum Tier {
  Provisional = 'provisional',
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Diamond = 'diamond',
  Master = 'master',
  Challenger = 'challenger',
}

const tierIndexes = [
  Tier.Bronze,
  Tier.Silver,
  Tier.Gold,
  Tier.Diamond,
  Tier.Master,
]

export type RatingInfo = {
  tier: Tier
  division?: Division
  leaguePoints: number
  rating: number
  isApex: boolean
  deviation: number
  reliable: boolean
  precise: boolean
}

export const divisionMap = {
  0: '',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
}

function getC(inflationTime: number) {
  return Math.sqrt((350 ** 2 - 40 ** 2) / (inflationTime * 24 * 60 * 60 * 1000))
}

export function useRatingInfo() {
  const {
    ratingConfig: {
      base_score,
      rd_inflation_time,
      max_rd,
      min_rd,
      base_league,
      league_length,
      rd_threshold,
    },
  } = useConfig()

  function getRD(rating: RatingDto) {
    if (rating.rd === 0) return 0

    const c = getC(rd_inflation_time)
    const t = Date.now() - rating.date
    const candidate = Math.sqrt(rating.rd ** 2 + c ** 2 * t)
    return Math.min(candidate, max_rd)
  }

  function convertToLp(elo: number) {
    const divisionSize = league_length / 4
    return Math.round((elo * 100) / divisionSize)
  }

  function getTier(rating: number): [Tier, Division | undefined, number] {
    const tiersAwayFromInitial =
      (rating - base_score) / league_length + base_league
    const boundedTier = Math.max(Math.min(tiersAwayFromInitial, 4), 0)
    const tierIndex = Math.floor(boundedTier)

    let division: number | undefined = undefined

    if (tierIndex < 4) {
      division =
        tierIndex === 4 ? 1 : 4 - Math.floor(4 * (boundedTier - tierIndex))
    }

    const leaguePoints = block(() => {
      const divisionSize = league_length / 4
      const lowestTier = base_score - league_length * base_league
      const apexTier = lowestTier + league_length * 4 // master

      if (rating <= lowestTier) {
        return Math.ceil((100 * (rating - lowestTier)) / divisionSize)
      }

      const totalLp = Math.floor((100 * (rating - lowestTier)) / divisionSize)

      if (rating < apexTier) {
        return totalLp % 100
      }

      if (rating >= apexTier) {
        return totalLp - 1600
      }
      return 0
    })

    return [
      tierIndexes[tierIndex],
      division as Division | undefined,
      leaguePoints,
    ]
  }

  function getRankInfo({ score, rd, date }: RatingDto): RatingInfo {
    const [expectedTier, division, leaguePoints] = getTier(score)

    const currentRD = getRD({ score, rd, date })
    const newDeviation = Math.round(currentRD)
    const reliable = newDeviation < rd_threshold
    const tier = reliable ? expectedTier : Tier.Provisional

    return {
      rating: Math.round(score),
      deviation: Math.round(getRD({ score, rd, date })),
      tier,
      division: reliable ? division : undefined,
      leaguePoints,
      reliable,
      isApex: false,
      precise: currentRD < 50,
    }
  }

  return {
    getRankInfo,
    convertToLp,
    getRD,
  }
}
