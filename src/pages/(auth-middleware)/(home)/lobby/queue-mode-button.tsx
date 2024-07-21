import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import type { GameMode } from '@/types/queue'
import { Center, type CenterProps, Flex, Spinner } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props extends CenterProps {
  children: ReactNode
  gameMode: GameMode
}

export function QueueModeButton({ children, gameMode, ...props }: Props) {
  const { queueModes, enqueue, dequeue } = useQueue()
  const { serverStatus } = useServiceStatus()
  const isDisabled = serverStatus !== ServerStatus.On
  const isLoading = !!queueModes[gameMode]

  const handleClick = () => {
    if (!isLoading) {
      enqueue(gameMode)
    } else {
      dequeue(gameMode)
    }
  }

  return (
    <Center
      flex="1"
      w="200px"
      bg={isDisabled ? 'gray.200' : 'gray.50'}
      color={isDisabled ? 'gray.400' : 'black'}
      cursor={isDisabled ? 'unset' : 'pointer'}
      transition="all 200ms"
      pos="relative"
      userSelect="none"
      onClick={isDisabled ? handleClick : undefined}
      _hover={
        isDisabled
          ? undefined
          : {
              bg: 'gray.200',
            }
      }
      {...props}
    >
      <Flex align="center" gap="5px">
        {isLoading && <Spinner size="sm" color="blue.300" />}
        {children}
      </Flex>
    </Center>
  )
}
