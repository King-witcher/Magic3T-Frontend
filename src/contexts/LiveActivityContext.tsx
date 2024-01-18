import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

// Forma que encontrei de fazer a navbar nao depender do gamecontext e queuecontext e também inflar um pouco o meu código, uma vez que eu amo aumentar o tamanho dos meus códigos =D

let lastKey = 0

type LiveActivity = {
  content: ReactNode
  tooltip?: string
  url?: string
}

type Remove = () => void

interface LiveActivityData {
  activities: Record<number, LiveActivity>
  push(activity: LiveActivity): Remove
}

interface Props {
  children?: ReactNode
}

const LiveActivityContext = createContext<LiveActivityData>(
  {} as LiveActivityData,
)

export function LiveActivityProvider({ children }: Props) {
  const [activities, setActivities] = useState<Record<number, LiveActivity>>({})

  const push = useCallback(
    (activity: LiveActivity) => {
      const key = lastKey++
      setActivities((current) => ({ ...current, [key]: activity }))
      return () => {
        delete activities[key]
        setActivities(activities)
      }
    },
    [setActivities],
  )

  return (
    <LiveActivityContext.Provider value={{ activities, push }}>
      {children}
    </LiveActivityContext.Provider>
  )
}

export const useLiveActivity = () => useContext(LiveActivityContext)
