import { useConfig } from '@/contexts/config.context.tsx'
import { Glicko } from '@/types/glicko.ts'
import { Division, Tier, tiers } from '@/utils/ranks'
import { ThemeTypings } from '@chakra-ui/react'
import { useCallback } from 'react'

export type RatingColorScheme = {
  normal: ThemeTypings['colors']
  darker: ThemeTypings['colors']
  lighter: ThemeTypings['colors']
}

export const RatingColorSchemes: Record<Tier, RatingColorScheme> = {
  Unranked: {
    darker: 'gray.400',
    lighter: 'gray.100',
    normal: 'gray.200',
  },
  Bronze: {
    normal: 'orange.500',
    darker: 'orange.700',
    lighter: 'orange.400',
  },
  Silver: {
    normal: 'gray.400',
    darker: 'gray.500',
    lighter: 'gray.300',
  },
  Gold: {
    normal: 'yellow.300',
    darker: 'yellow.500',
    lighter: 'yellow.200',
  },
  Diamond: {
    normal: 'cyan.300',
    darker: 'cyan.500',
    lighter: 'cyan.100',
  },
  Elite: {
    normal: 'purple.300',
    darker: 'purple.600',
    lighter: 'purple.200',
  },
}

type RatingInfo = {
  tier: Tier
  division: Division
  thumbnail: string
  rating: number
  deviation: number
  reliable: boolean
  precise: boolean
  colorScheme: RatingColorScheme
}

function getC(inflationTime: number) {
  return Math.sqrt((350 ** 2 - 40 ** 2) / (inflationTime * 24 * 60 * 60 * 1000))
}

function getThumbnailByTierAndDivision(tier: number, division: number) {
  return `https://quake-stats.bethesda.net/ranks/${tiers[tier]}_0${division}.png`
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

  const getRD = useCallback(
    (rating: Glicko) => {
      if (rating.deviation === 0) return 0

      const c = getC(deviationInflationTime)
      const t = Date.now() - rating.timestamp.getTime()
      const candidate = Math.sqrt(rating.deviation ** 2 + c ** 2 * t)
      return Math.min(candidate, initialRD)
    },
    [deviationInflationTime],
  )

  const getRankThumbnail = useCallback(
    (rating: number) => {
      const infiniteTier = (rating - initialRating) / tierSize + initialTier + 1
      const boundedTier = Math.max(Math.min(infiniteTier, 5), 1)
      const tierINdex = Math.floor(boundedTier)
      const division = Math.floor(5 * (boundedTier - tierINdex)) + 1

      return getThumbnailByTierAndDivision(tierINdex, division)
    },
    [initialRating, tierSize, initialTier],
  )

  const getRankInfo = useCallback(
    ({ rating, deviation, timestamp }: Glicko): RatingInfo => {
      const infiniteTier = (rating - initialRating) / tierSize + initialTier + 1
      const boundedTier = Math.max(Math.min(infiniteTier, 5), 1)
      const tierIndex = Math.floor(boundedTier)
      const division =
        tierIndex === 5 ? 1 : Math.floor(5 * (boundedTier - tierIndex)) + 1

      const currentRD = getRD({ rating, deviation, timestamp })
      const newDeviation = Math.round(currentRD)

      const reliable = newDeviation < maxReliableDeviation

      return {
        rating: Math.round(rating),
        deviation: Math.round(getRD({ rating, deviation, timestamp })),
        tier: reliable ? tiers[tierIndex] : 'Unranked',
        division: (reliable ? division : 1) as Division,
        thumbnail: reliable
          ? getThumbnailByTierAndDivision(tierIndex, division)
          : 'https://quake-stats.bethesda.net/ranks/Zero_01.png',
        reliable,
        precise: currentRD < 50,
        colorScheme: reliable
          ? RatingColorSchemes[tiers[tierIndex]]
          : {
              darker: 'gray.400',
              lighter: 'gray.100',
              normal: 'gray.200',
            },
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
