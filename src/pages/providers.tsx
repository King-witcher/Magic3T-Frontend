import { AuthProvider } from '@/contexts/AuthContext'
import { GameProvider } from '@/contexts/GameContext'
import { QueueProvider } from '@/contexts/QueueContext'
import { ServiceStatusProvider } from '@/contexts/ServiceStatusContext'
import { chakraTheme } from '@/styles/chakraTheme'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <ServiceStatusProvider>
      <AuthProvider>
        <GameProvider>
          <QueueProvider>
            <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
          </QueueProvider>
        </GameProvider>
      </AuthProvider>
    </ServiceStatusProvider>
  )
}
