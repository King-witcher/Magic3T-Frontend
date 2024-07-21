import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import type { RatingConfig } from '@/models/configs/RatingConfig'
import { type ReactNode, createContext, useContext } from 'react'

// Config Context

interface ConfigData {
  ratingConfig: RatingConfig
}

interface Props {
  children?: ReactNode
}

const defaultRatingConfig: RatingConfig = {
  deviationInflationTime: 0,
  distrust: 0,
  initialRating: 1500,
  initialRD: 350,
  maxRD: 350,
  maxReliableDeviation: 1,
  ranks: {
    initialTier: 0,
    tierSize: 1000,
  },
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
