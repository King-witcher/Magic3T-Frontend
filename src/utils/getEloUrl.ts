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
