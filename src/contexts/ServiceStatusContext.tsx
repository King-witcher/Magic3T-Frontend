import axios from 'axios'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLiveActivity } from './LiveActivityContext'
import { IoCloud, IoCloudOffline, IoMoon } from 'react-icons/io5'

export enum ServerStatus {
  Off,
  Loading,
  On,
}

interface ServiceStatusData {
  serverStatus: ServerStatus
}

interface Props {
  children?: ReactNode
}

const ServiceStatusContext = createContext<ServiceStatusData>({
  serverStatus: ServerStatus.Off,
})

export function ServiceStatusProvider({ children }: Props) {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(
    ServerStatus.Loading,
  )
  const { push } = useLiveActivity()
  const timeoutRef = useRef<NodeJS.Timeout>()

  async function fetchStatus() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`)
      if (response.data.status === 'available') {
        setServerStatus(ServerStatus.On)
        timeoutRef.current = setTimeout(fetchStatus, 5000)
      }
    } catch {
      setServerStatus(ServerStatus.Off)
      timeoutRef.current = setTimeout(fetchStatus, 2000)
    }
  }

  useEffect(() => {
    switch (serverStatus) {
      case ServerStatus.Off:
        return push({
          content: <IoCloudOffline size="16px" />,
          tooltip: 'Servidor de jogo inativo',
        })
      case ServerStatus.Loading:
        return push({
          content: <IoMoon size="16px" />,
          tooltip:
            'O servidor de jogo pegou no sono. Aguarde por cerca de três minutos enquanto ele toma um café.',
        })
      case ServerStatus.On:
        return push({
          content: <IoCloud size="16px" />,
          tooltip: 'Servidor de jogo ativo',
        })
    }
  }, [serverStatus])

  useEffect(() => {
    fetchStatus()
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <ServiceStatusContext.Provider
      value={{
        serverStatus: serverStatus,
      }}
    >
      {children}
    </ServiceStatusContext.Provider>
  )
}

export const useServiceStatus = () => useContext(ServiceStatusContext)
