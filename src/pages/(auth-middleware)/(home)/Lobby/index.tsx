import { useQueue } from '@/contexts/queue.context.tsx'
import {
  ServerStatus,
  useServiceStatus,
} from '@/contexts/service-status.context.tsx'
import {
  Center,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useGuardedAuth } from '@/contexts/guarded-auth.context.tsx'
import { GameMode } from '@/types/queue.ts'
import { ProfileComponent } from '@/components'

export default function Lobby() {
  const { enqueue, dequeue, queueModes, queueUserCount } = useQueue()
  const { serverStatus } = useServiceStatus()
  const { user } = useGuardedAuth()

  return (
    <Center h="100%" gap="15px" flexDir={['column', 'row']}>
      <Center flex="1">
        <Link to="/me">
          <ProfileComponent user={user} />
        </Link>
      </Center>
      <Divider orientation="vertical" hideBelow="sm" />
      <VStack flex="1">
        <Heading fontFamily="nunito variable">Jogar contra</Heading>

        {serverStatus === ServerStatus.On && (
          <Text fontSize="14px" fontWeight="700" color="green.500">
            {queueUserCount.connected <= 1
              ? 'Só você está online'
              : `${queueUserCount.connected} jogadores online`}
          </Text>
        )}

        {serverStatus === ServerStatus.Loading && (
          <Text fontSize="14px" fontWeight="700" color="blue.600">
            O servidor de jogo está sendo religado.
          </Text>
        )}

        {serverStatus === ServerStatus.Off && (
          <Text fontSize="14px" fontWeight="700" color="red.500">
            O servidor de jogo está fora do ar.
          </Text>
        )}
        <Menu>
          <MenuButton
            pointerEvents={serverStatus === ServerStatus.On ? 'all' : 'none'}
            disabled={
              queueModes['bot-1'] || queueModes['bot-2'] || queueModes['bot-3']
            }
            sx={{
              '&:hover .cpu-button': {
                bg: 'blue.200',
              },
            }}
          >
            <Flex
              className="cpu-button"
              alignItems="center"
              justifyContent="center"
              bg="gray.100"
              transition="background 80ms linear"
              rounded="10px"
              fontSize="20px"
              userSelect="none"
              w="200px"
              fontWeight={700}
              h="80px"
              cursor={serverStatus === ServerStatus.On ? 'pointer' : 'default'}
              opacity={serverStatus === ServerStatus.On ? 1 : 0.5}
              pointerEvents={serverStatus === ServerStatus.On ? 'all' : 'none'}
            >
              <VStack gap="0">
                <Flex
                  alignItems="center"
                  gap="10px"
                  fontSize="20px"
                  textAlign="center"
                >
                  {(queueModes['bot-0'] ||
                    queueModes['bot-1'] ||
                    queueModes['bot-2'] ||
                    queueModes['bot-3']) && (
                    <Spinner thickness="4px" speed="0.7s" />
                  )}
                  Máquina
                </Flex>
              </VStack>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={enqueue.bind(null, GameMode.Bot0)}>
              Fácil
            </MenuItem>
            <MenuItem onClick={enqueue.bind(null, GameMode.Bot1)}>
              Médio
            </MenuItem>
            <MenuItem onClick={enqueue.bind(null, GameMode.Bot2)}>
              Difícil
            </MenuItem>
            <MenuItem bg="red.100" onClick={enqueue.bind(null, GameMode.Bot3)}>
              Invencível
            </MenuItem>
            <MenuItem
              onClick={() => {
                const bots = [
                  GameMode.Bot0,
                  GameMode.Bot1,
                  GameMode.Bot2,
                  GameMode.Bot3,
                ]

                const bot = bots[Math.floor(Math.random() * 4)]

                enqueue(bot)
              }}
            >
              Qualquer um
            </MenuItem>
          </MenuList>
        </Menu>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          transition="background 80ms linear"
          rounded="10px"
          fontSize="20px"
          cursor={serverStatus === ServerStatus.On ? 'pointer' : 'default'}
          opacity={serverStatus === ServerStatus.On ? 1 : 0.5}
          pointerEvents={serverStatus === ServerStatus.On ? 'all' : 'none'}
          userSelect="none"
          w="200px"
          fontWeight={700}
          h="80px"
          _hover={{
            bg: 'blue.200',
          }}
          onClick={
            queueModes.ranked
              ? dequeue.bind(null, GameMode.Ranked)
              : enqueue.bind(null, GameMode.Ranked)
          }
        >
          <VStack gap="0">
            <Flex
              alignItems="center"
              gap="10px"
              fontSize="20px"
              textAlign="center"
            >
              {queueModes.ranked && <Spinner thickness="4px" speed="0.7s" />}
              Humano
            </Flex>
            <Text
              fontSize="14px"
              color={queueUserCount.ranked.queue ? 'green.400' : 'gray.400'}
            >
              {queueUserCount.ranked.queue} jogador
              {queueUserCount.ranked.queue !== 1 ? 'es' : ''}
            </Text>
          </VStack>
        </Flex>
      </VStack>
    </Center>
  )
}
