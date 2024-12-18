import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import type { GameMode } from '@/types/queue'
import { getAcrylicProps } from '@/utils/style-helpers'
import {
  Box,
  Center,
  type CenterProps,
  Flex,
  keyframes,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'

interface Props extends CenterProps {
  gameMode: GameMode
  name: string
  playersInQueue?: number
  isLoading: boolean
}

export function QueueModeButton({
  children,
  gameMode,
  name,
  playersInQueue,
  isLoading,
  ...props
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
    <Center
      flex={{ base: '1 0 75px', sm: '1' }}
      h="75px"
      {...{
        ...getAcrylicProps(),
        rounded: 0,
        border: 'none',
        boxShadow: 'none',
      }}
      background="#ffffff30"
      color="light"
      cursor={isDisabled ? 'unset' : 'pointer'}
      transition="all 200ms, box-shadow 500ms"
      pos="relative"
      userSelect="none"
      boxShadow={isLoading ? 'inset 0 0 10px 0 #00ff40' : undefined}
      onClick={isDisabled ? undefined : handleClick}
      _hover={
        isDisabled
          ? undefined
          : {
              bgColor: '#ffffff60',
            }
      }
      _active={
        isDisabled
          ? undefined
          : {
              bgColor: '#ffffff20',
            }
      }
      {...props}
    >
      <Center
        h="full"
        aspectRatio={1}
        pos="absolute"
        left="0px"
        opacity={isLoading ? 1 : 0}
        transition="opacity 200ms"
      >
        <Spinner size="sm" speed="1s" />
      </Center>
      <Stack spacing={0}>
        <Text as="span" textAlign="center" fontSize="18px">
          {name}
        </Text>
        {playersInQueue !== undefined && (
          <Text
            as="span"
            fontSize="12px"
            fontWeight={500}
            color={playersInQueue ? 'green.400' : '#ffffff60'}
            textAlign="center"
          >
            {playersInQueue} player
            {playersInQueue !== 1 && 's'} in queue
          </Text>
        )}
      </Stack>
    </Center>
  )
}
