import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { GameStatus } from '@/types/types'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  Skeleton,
  Spinner,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import LeaveModal from './components/LeaveModal'
import ProfileMenu from '../MainMenu/MainMenu'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useCallback } from 'react'
import { useQueue } from '@/contexts/QueueContext'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { loading, user } = useAuth()
  const { gameState } = useGame()
  const { serverOnline } = useServiceStatus()
  const { queueModes } = useQueue()

  const handleLogoClick = useCallback(() => {
    if (gameState?.gameStatus === GameStatus.Playing) {
      onOpen()
    } else navigate('/')
  }, [gameState?.gameStatus])

  return (
    <>
      <Flex
        as="header"
        flex="0 0 55px"
        h="55px"
        w="100%"
        alignItems="center"
        px="10px"
        bg="pink.600"
        color="white"
        gap="10px"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap={['5px']}>
          <Flex
            as={Link}
            to="/"
            p="10px"
            rounded="10px"
            userSelect="none"
            cursor="pointer"
            gap="3px"
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <Text fontWeight={400}>Jogar</Text>
            <Text fontWeight={700}>Magic3T</Text>
          </Flex>
          {serverOnline === undefined && (
            <Tooltip
              hideBelow="md"
              label="O servidor principal foi desligado quando inativo para reduzir custos, mas já está sendo religado. Aguarde por cerca de 2 minutos até que tudo estja no ar novamente!"
            >
              <Flex
                gap="5px"
                alignItems="center"
                bg="whiteAlpha.300"
                p="5px 10px"
                borderRadius="10px"
                userSelect="none"
              >
                <Spinner size="xs" speed="700ms" />
                <Text color="red.100" fontSize="12px">
                  Aguardando servidor...
                </Text>
              </Flex>
            </Tooltip>
          )}
          {queueModes.casual ||
            (queueModes.ranked && (
              <Tooltip
                hideBelow="md"
                label="Você está na fila para encontrar uma partida e será redirecionado para a partida assim que outro jogador for encontrado."
              >
                <Flex
                  gap="5px"
                  alignItems="center"
                  bg="whiteAlpha.300"
                  p="5px 10px"
                  borderRadius="10px"
                  userSelect="none"
                  cursor="pointer"
                  _hover={{
                    bg: 'whiteAlpha.400',
                  }}
                  onClick={() => navigate('/')}
                >
                  <Spinner size="xs" speed="700ms" />
                  <Text color="red.100" fontSize="12px">
                    Na fila
                  </Text>
                </Flex>
              </Tooltip>
            ))}
          {serverOnline === false && (
            <Flex gap="5px" alignItems="center" userSelect="none">
              <Box w="8px" h="8px" bg="red" borderRadius="10px" />
              <Text color="red.100" fontSize="12px">
                Servidor offline
              </Text>
            </Flex>
          )}
          {gameState && (
            <Flex
              gap="5px"
              alignItems="center"
              bg="whiteAlpha.300"
              p="5px 10px"
              borderRadius="10px"
              userSelect="none"
              cursor="pointer"
              _hover={{
                bg: 'whiteAlpha.400',
              }}
              onClick={() => navigate('/')}
            >
              <Text color="red.100" fontSize="12px">
                Em jogo
              </Text>
            </Flex>
          )}
        </Flex>
        <Skeleton isLoaded={!loading} borderRadius="999px">
          <Menu>
            <Tooltip label={user?.nickname} openDelay={400}>
              <MenuButton
                borderRadius="999px"
                transition="all linear 80ms"
                sx={{
                  img: {
                    transition: 'all linear 80ms',
                  },
                  _hover: {
                    backdropFilter: 'brightness(1.15)',
                    img: {
                      filter: 'brightness(1.1)',
                    },
                  },
                }}
              >
                <Avatar
                  src={user?.photoURL || undefined}
                  w="40px"
                  h="40px"
                  bg="whiteAlpha.300"
                />
              </MenuButton>
            </Tooltip>
            <ProfileMenu />
          </Menu>
        </Skeleton>
        <LeaveModal onClose={onClose} isOpen={isOpen} />
      </Flex>
    </>
  )
}
