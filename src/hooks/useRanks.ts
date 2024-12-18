import { useConfig } from '@/contexts/config.context.tsx'
import type { Glicko } from '@/types/glicko.ts'
import type { Division } from '@/utils/ranks'

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
  division: Division
  rating: number
  isApex: boolean
  deviation: number
  reliable: boolean
  precise: boolean
}

function getC(inflationTime: number) {
  return Math.sqrt((350 ** 2 - 40 ** 2) / (inflationTime * 24 * 60 * 60 * 1000))
}

export function useRankInfo() {
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

  function getTier(rating: number): [Tier, number] {
    const decimalTier = (rating - initialRating) / tierSize + initialTier
    const boundedTier = Math.max(Math.min(decimalTier, 4), 0)
    const tierIndex = Math.floor(boundedTier)

    const division =
      tierIndex === 4 ? 1 : 4 - Math.floor(4 * (boundedTier - tierIndex))

    return [tierIndexes[tierIndex], division]
  }

  function getRankInfo({ rating, deviation, timestamp }: Glicko): RatingInfo {
    const [expectedTier, division] = getTier(rating)

    const currentRD = getRD({ rating, deviation, timestamp })
    const newDeviation = Math.round(currentRD)

    const reliable = newDeviation < maxReliableDeviation
    const tier = reliable ? expectedTier : Tier.Provisional

    return {
      rating: Math.round(rating),
      deviation: Math.round(getRD({ rating, deviation, timestamp })),
      tier,
      division: (reliable ? division : 1) as Division,
      reliable,
      isApex: false,
      precise: currentRD < 50,
    }
  }

  return {
    getRankInfo,
    getRD,
  }
}
