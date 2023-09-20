import axios from 'axios'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
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

  async function fetchStatus() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`)
      if (response.data.status === 'available') setServerOnline(true)
    } catch {
      setServerOnline(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <ServiceStatusContext.Provider value={{ serverOnline }}>
      {children}
    </ServiceStatusContext.Provider>
  )
}

export const useServiceStatus = () => useContext(ServiceStatusContext)
