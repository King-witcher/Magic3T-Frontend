import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import type { GameMode } from '@/types/queue'
import { Spinner } from '@chakra-ui/react'
import styles from './styles.module.sass'
import { ReactNode } from '@tanstack/react-router'

interface Props {
  gameMode: GameMode
  children?: ReactNode
  name: string
  playersInQueue?: number
  isLoading: boolean
  onClick: () => void
}

export function QueueModeButton({
  children,
  gameMode,
  name,
  playersInQueue,
  isLoading,
}: Props) {
  const { enqueue, dequeue } = useQueue()
  const { serverStatus } = useServiceStatus()
  const isDisabled = serverStatus !== ServerStatus.On

  const handleClick = () => {
    if (!isLoading) {
      enqueue(gameMode)
    } else {
      dequeue(gameMode)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.queue_mode_button} ${isLoading ? styles.loading : ''} ${isDisabled ? styles.disabled : ''}`}
    >
      <div className={styles.spinner_container}>
        <Spinner size="sm" speed="1s" />
      </div>

      <div className="flex flex-col">
        <span className="text-center text-lg">{name}</span>
        {playersInQueue !== undefined && (
          <span
            className={`text-xs font-medium text-center ${playersInQueue ? 'text-green-400' : 'text-[#ffffff60]'}`}
            color={playersInQueue ? 'green.400' : '#ffffff60'}
          >
            {playersInQueue} player
            {playersInQueue !== 1 && 's'} in queue
          </span>
        )}
      </div>
    </button>
  )
}
