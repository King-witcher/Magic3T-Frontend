import { useQueue } from '@/contexts/queue.context'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context'
import { Center, Heading, Stack, Text } from '@chakra-ui/react'
import { GameModesMenu } from './options-menu'

export function Lobby() {
  const { queueUserCount } = useQueue()
  const { serverStatus } = useServiceStatus()

  return (
    <Center h="full">
      <Stack gap="20px">
        <Heading textAlign="center">Select a game mode</Heading>
        <GameModesMenu />
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
