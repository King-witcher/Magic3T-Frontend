import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { getEloUrl } from '@/utils/getEloUrl'
import {
  Avatar,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Profile from './components/profile'

export default function Home() {
  const { enqueue, dequeue, queueModes, queueUserCount } = useQueue()
  const { serverOnline } = useServiceStatus()
  const { user } = useAuth()

  if (!user) return <SignInPage />

  if (serverOnline === undefined) {
    return (
      <Center w="100%" h="100%" fontSize="20px">
        Aguardando servidor principal
      </Center>
    )
  }

  if (serverOnline === false) {
    return (
      <Center w="100%" h="100%" fontSize="20px" color="red.500">
        Servidor principal offline
      </Center>
    )
  }

  return (
    <Center h="100%" gap="15px" flexDir={['column', 'row']}>
      <Center flex="1">
        <Profile user={user} />
      </Center>
      <Divider orientation="vertical" hideBelow={'sm'} />
      <VStack flex="1">
        <Heading fontFamily="nunito variable">Jogar contra</Heading>
        <Text fontSize="14px" fontWeight="700" color="green.500">
          {queueUserCount.connected <= 1
            ? 'Só você está online'
            : `${queueUserCount.connected} jogadores online`}
        </Text>
        <Menu>
          <MenuButton
            disabled={
              queueModes['bot-1'] || queueModes['bot-2'] || queueModes['bot-3']
            }
            sx={{
              '&:hover .cpu-button': {
                bg: 'pink.200',
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
              cursor="pointer"
              fontSize="20px"
              userSelect="none"
              w="200px"
              fontWeight={700}
              h="80px"
              // onClick={
              //   queueModes.bot
              //     ? dequeue.bind(null, GameMode.Bot)
              //     : enqueue.bind(null, GameMode.Bot)
              // }
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
        {/* <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          transition="background 80ms linear"
          rounded="10px"
          cursor="pointer"
          fontSize="20px"
          userSelect="none"
          w="200px"
          fontWeight={700}
          h="80px"
          _hover={{
            bg: 'pink.200',
          }}
          onClick={
            queueModes.casual
              ? dequeue.bind(null, GameMode.Casual)
              : enqueue.bind(null, GameMode.Casual)
          }
        >
          <VStack gap="0">
            <Flex
              alignItems="center"
              gap="10px"
              fontSize="20px"
              textAlign="center"
            >
              {queueModes.casual && <Spinner thickness="4px" speed="0.7s" />}
              Casual
            </Flex>
            <Text
              fontSize="14px"
              color={queueUserCount.casual.queue ? 'green.400' : 'gray.400'}
            >
              {queueUserCount.casual.queue} jogador
              {queueUserCount.casual.queue !== 1 ? 'es' : ''}
            </Text>
          </VStack>
        </Flex> */}
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          transition="background 80ms linear"
          rounded="10px"
          fontSize="20px"
          cursor="pointer"
          userSelect="none"
          w="200px"
          fontWeight={700}
          h="80px"
          _hover={{
            bg: 'pink.200',
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
