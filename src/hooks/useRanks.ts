import { useConfig } from '@/contexts/ConfigContext'
import { Glicko } from '@/types/Glicko'
import { useCallback } from 'react'

type Tiers = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Elite'
type Division = 1 | 2 | 3 | 4 | 5
const tiers: Tiers[] = ['Bronze', 'Silver', 'Gold', 'Diamond', 'Elite']

type RatingInfo = {
  tier: Tiers
  division: Division
  thumbnail: string
  rating: number
  deviation: number
}

function getC(inflationTime: number) {
  const c = Math.sqrt(
    (350 ** 2 - 40 ** 2) / (inflationTime * 24 * 60 * 60 * 1000),
  )
  return c
}

function getThumbnailByTierAndDivision(tier: number, division: number) {
  return `https://quake-stats.bethesda.net/ranks/${tiers[tier]}_0${division}.png`
}

export function useRankInfo() {
  const {
    ratingConfig: {
      initialRating,
      deviationInflationTime,
      maxRD,
      ranks: { initialTier, tierSize },
    },
  } = useConfig()

  const getRD = useCallback(
    (rating: Glicko) => {
      const c = getC(deviationInflationTime)
      const t = Date.now() - rating.timestamp.getTime()
      const candidate = Math.sqrt(rating.deviation ** 2 + c ** 2 * t)
      return Math.min(candidate, maxRD)
    },
    [deviationInflationTime],
  )

  const getRankThumbnail = useCallback(
    (rating: number) => {
      const infiniteTier = (rating - initialRating) / tierSize + initialTier
      const boundedTier = Math.max(Math.min(infiniteTier, 5), 0)
      const tierINdex = Math.floor(boundedTier)
      const division = Math.floor(5 * (boundedTier - tierINdex)) + 1

      return getThumbnailByTierAndDivision(tierINdex, division)
    },
    [initialRating, tierSize, initialTier],
  )

  const getRankInfo = useCallback(
    ({ rating, deviation, timestamp }: Glicko): RatingInfo => {
      const infiniteTier = (rating - initialRating) / tierSize + initialTier
      const boundedTier = Math.max(Math.min(infiniteTier, 5), 0)
      const tierIndex = Math.floor(boundedTier)
      const division = Math.floor(5 * (boundedTier - tierIndex)) + 1

      return {
        rating: Math.round(rating),
        deviation: Math.round(getRD({ rating, deviation, timestamp })),
        tier: tiers[tierIndex],
        division: division as Division,
        thumbnail: getThumbnailByTierAndDivision(tierIndex, division),
      }
    },
    [initialTier, tierSize, initialRating, getRD],
  )

  return {
    getRankThumbnail,
    getRankInfo,
    getRD,
  }
}
