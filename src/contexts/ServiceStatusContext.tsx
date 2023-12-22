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
}

interface Props {
  children?: ReactNode
}

const ServiceStatusContext = createContext<ServiceStatusData>({
  serverOnline: false,
  maxReliableDeviation: 0,
})

export function ServiceStatusProvider({ children }: Props) {
  const [serverOnline, setServerOnline] = useState<boolean>()
  const [maxReliableDeviation] = useAsync(async () => {
    const snap = await getDoc(doc(firestore, 'config/rating'))
    const configs = snap.data()
    return configs?.maxReliableDeviation || 0
  })
  const timeoutRef = useRef<NodeJS.Timeout>()

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
      value={{ serverOnline, maxReliableDeviation }}
    >
      {children}
    </ServiceStatusContext.Provider>
  )
}

export const useServiceStatus = () => useContext(ServiceStatusContext)
