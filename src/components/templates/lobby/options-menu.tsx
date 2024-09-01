import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import { GameMode } from '@/types/queue'
import { Flex, Stack, Text } from '@chakra-ui/react'
import { QueueModeButton } from './queue-mode-button'

export function GameModesMenu() {
  const { queueUserCount } = useQueue()
  const { serverStatus } = useServiceStatus()

  return (
    <Flex
      gap="0"
      flexDir="row"
      h="200px"
      rounded="16px"
      overflow="hidden"
      boxShadow="0 2px 8px 2px #00000020"
    >
      <Stack gap="0">
        <QueueModeButton gameMode={GameMode.Bot0}>Easy</QueueModeButton>
        <QueueModeButton
          gameMode={GameMode.Bot1}
          borderTop="1px solid var(--chakra-colors-gray-200)"
        >
          Medium
        </QueueModeButton>
        <QueueModeButton
          gameMode={GameMode.Bot2}
          borderTop="1px solid var(--chakra-colors-gray-200)"
        >
          Hard
        </QueueModeButton>
        <QueueModeButton
          gameMode={GameMode.Bot3}
          borderTop="1px solid var(--chakra-colors-gray-200)"
          _hover={{
            bg: 'black',
            borderRight: '4px solid red',
            color: 'red',
          }}
        >
          Invincible
        </QueueModeButton>
      </Stack>
      <QueueModeButton
        gameMode={GameMode.Ranked}
        borderLeft="1px solid"
        borderColor="gray.300"
      >
        <Stack>
          <Text as="span" textAlign="center">
            vs Human
          </Text>
          {serverStatus === ServerStatus.On && (
            <Text
              as="span"
              fontSize="12px"
              color={queueUserCount.ranked.queue ? 'green.400' : 'gray.400'}
              textAlign="center"
            >
              {queueUserCount.ranked.queue} player
              {queueUserCount.ranked.queue !== 1 && 's'}
            </Text>
          )}
        </Stack>
      </QueueModeButton>
    </Flex>
  )
}
