import { AuthProvider } from '@/contexts/auth.context.tsx'
import { ConfigProvider } from '@/contexts/config.context.tsx'
import { GameProvider } from '@/contexts/game.context'
import { LiveActivityProvider } from '@/contexts/live-activity.context.tsx'
import { QueueProvider } from '@/contexts/queue.context'
import { ServiceStatusProvider } from '@/contexts/service-status.context.tsx'
import { chakraTheme } from '@/styles/chakraTheme'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const queryClient = new QueryClient()

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveActivityProvider>
        <ServiceStatusProvider>
          <ConfigProvider>
            <AuthProvider>
              <GameProvider>
                <QueueProvider>
                  <ChakraProvider theme={chakraTheme}>
                    {children}
                  </ChakraProvider>
                </QueueProvider>
              </GameProvider>
            </AuthProvider>
          </ConfigProvider>
        </ServiceStatusProvider>
      </LiveActivityProvider>
    </QueryClientProvider>
  )
}
