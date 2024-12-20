import { useConfig } from '@/contexts/config.context.tsx'
import type { Glicko } from '@/types/glicko.ts'
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
      initialRating,
      deviationInflationTime,
      maxReliableDeviation,
      initialRD,
      ranks: { initialTier, tierSize },
    },
  } = useConfig()

  function getRD(rating: Glicko) {
    if (rating.deviation === 0) return 0

    const c = getC(deviationInflationTime)
    const t = Date.now() - rating.timestamp.getTime()
    const candidate = Math.sqrt(rating.deviation ** 2 + c ** 2 * t)
    return Math.min(candidate, initialRD)
  }

  function convertToLp(elo: number) {
    const divisionSize = tierSize / 4
    return Math.round((elo * 100) / divisionSize)
  }

  function getTier(rating: number): [Tier, Division | undefined, number] {
    const tiersAwayFromInitial =
      (rating - initialRating) / tierSize + initialTier
    const boundedTier = Math.max(Math.min(tiersAwayFromInitial, 4), 0)
    const tierIndex = Math.floor(boundedTier)

    let division: number | undefined = undefined

    if (tierIndex < 4) {
      division =
        tierIndex === 4 ? 1 : 4 - Math.floor(4 * (boundedTier - tierIndex))
    }

    const leaguePoints = block(() => {
      const divisionSize = tierSize / 4
      const lowestTier = initialRating - tierSize * initialTier
      const apexTier = lowestTier + tierSize * 4 // master

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

  function getRankInfo({ rating, deviation, timestamp }: Glicko): RatingInfo {
    const [expectedTier, division, leaguePoints] = getTier(rating)

    const currentRD = getRD({ rating, deviation, timestamp })
    const newDeviation = Math.round(currentRD)
    const reliable = newDeviation < maxReliableDeviation
    const tier = reliable ? expectedTier : Tier.Provisional

    return {
      rating: Math.round(rating),
      deviation: Math.round(getRD({ rating, deviation, timestamp })),
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
