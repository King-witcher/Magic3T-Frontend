import { NestApi } from '@/services/index'
import { useQuery } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { IoCloud, IoCloudOffline, IoMoon } from 'react-icons/io5'
import { useLiveActivity } from './live-activity.context'
import { Console } from '@/lib/console/console'
import { SystemCvars } from '@/lib/console'

export enum ServerStatus {
  Off = 0,
  Loading = 1,
  On = 2,
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
  const { push } = useLiveActivity()

  const pollRate = Number(Console.useCvar(SystemCvars.ClStatusPoll)) ?? 5000

  const statusQuery = useQuery({
    queryKey: ['server-status'],
    queryFn: NestApi.getStatus,
    refetchInterval: pollRate,
  })

  const serverStatus =
    statusQuery.data?.status === 'available'
      ? ServerStatus.On
      : statusQuery.isFetching
        ? ServerStatus.Loading
        : ServerStatus.Off

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

  const value = useMemo(() => {
    return {
      serverStatus,
    }
  }, [serverStatus])

  return (
    <ServiceStatusContext.Provider value={value}>
      {children}
    </ServiceStatusContext.Provider>
  )
}

export const useServiceStatus = () => useContext(ServiceStatusContext)
