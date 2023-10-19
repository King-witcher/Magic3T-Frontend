import axios from 'axios'
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
}

interface Props {
  children?: ReactNode
}

const ServiceStatusContext = createContext<ServiceStatusData>({
  serverOnline: false,
})

export function ServiceStatusProvider({ children }: Props) {
  const [serverOnline, setServerOnline] = useState<boolean>()
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
    <ServiceStatusContext.Provider value={{ serverOnline }}>
      {children}
    </ServiceStatusContext.Provider>
  )
}

export const useServiceStatus = () => useContext(ServiceStatusContext)
