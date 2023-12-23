import { useAsync } from '@/hooks/useAsync'
import { firestore, getDoc } from '@/services/firestore'
import axios from 'axios'
import { doc } from 'firebase/firestore'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface ServiceStatusData {
  serverOnline: boolean | undefined
  maxReliableDeviation: number
  rdInflationTime: number
}

interface Props {
  children?: ReactNode
}

const ServiceStatusContext = createContext<ServiceStatusData>({
  serverOnline: false,
  maxReliableDeviation: 0,
  rdInflationTime: 180,
})

export function ServiceStatusProvider({ children }: Props) {
  const [serverOnline, setServerOnline] = useState<boolean>()
  const [maxReliableDeviation] = useAsync(async () => {
    const snap = await getDoc(doc(firestore, 'config/rating'))
    const configs = snap.data()
    return (configs?.maxReliableDeviation as number) || 0
  })
  const timeoutRef = useRef<NodeJS.Timeout>()

  const [rdInflationTime] = useAsync(async () => {
    const configSnap = await getDoc(doc(firestore, 'config/rating'))
    const configs = configSnap.data()
    const inflationTime = configs?.deviationInflationTime || 180
    return inflationTime as number
  })

  async function fetchStatus() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`)
      if (response.data.status === 'available') {
        setServerOnline(true)
        timeoutRef.current = setTimeout(fetchStatus, 5000)
      }
    } catch {
      setServerOnline(false)
      timeoutRef.current = setTimeout(fetchStatus, 2000)
    }
  }

  useEffect(() => {
    fetchStatus()
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <ServiceStatusContext.Provider
      value={{
        serverOnline,
        maxReliableDeviation: maxReliableDeviation || 350,
        rdInflationTime: rdInflationTime || 180,
      }}
    >
      {children}
    </ServiceStatusContext.Provider>
  )
}

export const useServiceStatus = () => useContext(ServiceStatusContext)
