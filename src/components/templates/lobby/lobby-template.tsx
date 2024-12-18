import { ButtonsContainer } from '@/components/atoms'
import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import { GameMode } from '@/types/queue'
import { Center, Heading, Stack, Text } from '@chakra-ui/react'
import { QueueModeButton } from './queue-mode-button'

export function LobbyTemplate() {
  const { queueUserCount, queueModes } = useQueue()
  const { serverStatus } = useServiceStatus()

  return (
    <Center className="lobby" h="full">
      <Stack gap="20px" w="full" maxW="800px">
        <Heading textAlign="center" color="light">
          Play Magic3T
        </Heading>

        <ButtonsContainer opacity={serverStatus !== ServerStatus.On ? 0.5 : 1}>
          <QueueModeButton
            name="Easy"
            isLoading={!!queueModes['bot-0']}
            gameMode={GameMode.Bot0}
          />
          <QueueModeButton
            name="Medium"
            isLoading={!!queueModes['bot-1']}
            gameMode={GameMode.Bot1}
          />
          <QueueModeButton
            name="Hard"
            isLoading={!!queueModes['bot-2']}
            gameMode={GameMode.Bot2}
          />
          <QueueModeButton
            name="Invincible"
            isLoading={!!queueModes['bot-3']}
            gameMode={GameMode.Bot3}
          />
        </ButtonsContainer>
        <ButtonsContainer opacity={serverStatus !== ServerStatus.On ? 0.5 : 1}>
          <QueueModeButton
            name="Human"
            isLoading={!!queueModes.ranked}
            playersInQueue={queueUserCount.ranked.queue}
            gameMode={GameMode.Ranked}
          />
        </ButtonsContainer>
        {serverStatus === ServerStatus.On &&
          (queueUserCount.connected > 1 ? (
            <Text textAlign="center" color="green.400">
              {queueUserCount.connected} players online
            </Text>
          ) : (
            <Text textAlign="center" color="gray.400">
              Only you are online. <br />
              Invite your friends to play Magic3T!
            </Text>
          ))}
        {serverStatus === ServerStatus.Loading && (
          <Text textAlign="center" color="blue.500">
            The server is rebooting...
          </Text>
        )}
        {serverStatus === ServerStatus.Off && (
          <Text textAlign="center" color="red.600">
            The server is offline.
          </Text>
        )}
      </Stack>
    </Center>
  )
}
