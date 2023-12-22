import { Glicko } from '@/types/Glicko'

export function getEloUrl(rating: number) {
  let variablePart: string
  if (rating < 400) variablePart = 'Bronze_01'
  else if (rating < 500) variablePart = 'Bronze_02'
  else if (rating < 600) variablePart = 'Bronze_03'
  else if (rating < 700) variablePart = 'Bronze_04'
  else if (rating < 800) variablePart = 'Bronze_05'
  else if (rating < 900) variablePart = 'Silver_01'
  else if (rating < 1000) variablePart = 'Silver_02'
  else if (rating < 1100) variablePart = 'Silver_03'
  else if (rating < 1200) variablePart = 'Silver_04'
  else if (rating < 1300) variablePart = 'Silver_05'
  else if (rating < 1400) variablePart = 'Gold_01'
  else if (rating < 1500) variablePart = 'Gold_02'
  else if (rating < 1600) variablePart = 'Gold_03'
  else if (rating < 1700) variablePart = 'Gold_04'
  else if (rating < 1800) variablePart = 'Gold_05'
  else if (rating < 1900) variablePart = 'Diamond_01'
  else if (rating < 2000) variablePart = 'Diamond_02'
  else if (rating < 2100) variablePart = 'Diamond_03'
  else if (rating < 2200) variablePart = 'Diamond_04'
  else if (rating < 2300) variablePart = 'Diamond_05'
  else variablePart = 'Elite_01'

  return `https://quake-stats.bethesda.net/ranks/${variablePart}.png`
}

type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Elite'
type Division = 1 | 2 | 3 | 4 | 5

const divisionSize = 100
const bronze1 = 300

type RatingInfo = {
  tier: Tier
  division: Division
  thumbnail: string
  rating: number
  deviation: number
}

const tiers: Tier[] = ['Bronze', 'Silver', 'Gold', 'Diamond', 'Elite']

export function getRatingInfo(glicko: Glicko): RatingInfo {
  const rating = Math.round(glicko.rating)
  const deviation = Math.round(glicko.deviation)
  const absoluteDivision = Math.max(
    Math.trunc((rating - bronze1) / divisionSize),
    0,
  )

  const tierIndex = Math.min(Math.trunc(absoluteDivision / 5), 4)
  const division = tierIndex === 4 ? 1 : (absoluteDivision % 5) + 1

  const result: RatingInfo = {
    rating,
    deviation,
    tier: tiers[tierIndex],
    division: division as Division,
    thumbnail: `https://quake-stats.bethesda.net/ranks/${tiers[tierIndex]}_0${division}.png`,
  }

  return result
}
