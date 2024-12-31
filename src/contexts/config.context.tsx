import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import type { RatingConfig } from '@/models/configs/rating-config'
import { type ReactNode, createContext, useContext } from 'react'

// Config Context

interface ConfigData {
  ratingConfig: RatingConfig
}

interface Props {
  children?: ReactNode
}

const defaultRatingConfig: RatingConfig = {
  rd_inflation_time: Number.POSITIVE_INFINITY,
  base_score: 1500,
  max_rd: 350,
  min_rd: 0,
  rd_threshold: 0,
  league_length: 200,
  base_league: 2,
}

const ConfigContext = createContext<ConfigData>({} as ConfigData)

export function ConfigProvider({ children }: Props) {
  const [ratingConfig] = useAsync(async () => {
    return models.configs.getRatingConfig()
  }, [])
  return (
    <ConfigContext.Provider
      value={{
        ratingConfig: ratingConfig ?? defaultRatingConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
