export interface RatingConfig {
  deviationInflationTime: number
  distrust: number
  initialRD: number
  initialRating: number

  /** Max RD a player can have */
  maxRD: number

  /** Max RD a player can have to be placed */
  maxReliableDeviation: number

  ranks: {
    /** The size of each tier */
    tierSize: number

    /** The tier corresponding to the initial rating. Can be non integer. 0 is equivalent to Bronze 1 and 4, Elite. */
    initialTier: number
  }
}
