import { GameProvider } from '@/contexts/GameContext'
import { QueueProvider } from '@/contexts/QueueContext'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function GuardedProviders({ children }: Props) {
  return (
    <GameProvider>
      <QueueProvider>{children}</QueueProvider>
    </GameProvider>
  )
}
