import { ConsoleProvider } from '@/lib/console'
import { AuthProvider } from '@/contexts/auth.context'
import { GameProvider } from '@/contexts/game.context'
import { LiveActivityProvider } from '@/contexts/live-activity.context'
import { QueueProvider } from '@/contexts/queue.context'
import { ServiceStatusProvider } from '@/contexts/service-status.context'
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
        <ConsoleProvider>
          <ServiceStatusProvider>
            <AuthProvider>
              <GameProvider>
                <QueueProvider>{children}</QueueProvider>
              </GameProvider>
            </AuthProvider>
          </ServiceStatusProvider>
        </ConsoleProvider>
      </LiveActivityProvider>
    </QueryClientProvider>
  )
}
