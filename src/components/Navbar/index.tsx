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
import { useNavigate } from 'react-router-dom'
import LeaveModal from './components/LeaveModal'
import ProfilePopover from './components/ProfilePopopver'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useCallback } from 'react'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { isLoading, user, signIn } = useAuth()
  const { gameStatus } = useGame()
  const { serverOnline } = useServiceStatus()

  const handleLogoClick = useCallback(() => {
    if (gameStatus === GameStatus.Playing) {
      onOpen()
    } else navigate('/')
  }, [gameStatus])

  return (
    <Flex
      as="header"
      flex="0 0 55px"
      w="100%"
      alignItems="center"
      px="10px"
      bg="pink.600"
      color="white"
      gap="10px"
      justifyContent="space-between"
    >
      <Flex alignItems="center" gap={['0px', '5px']}>
        <Box
          p="10px"
          rounded="10px"
          userSelect="none"
          cursor="pointer"
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={handleLogoClick}
        >
          Magic3T
          <Tag ml="0.5rem" bgColor="whiteAlpha.400" color="white">
            alpha
          </Tag>
        </Box>
        {serverOnline === undefined && (
          <Tooltip
            hideBelow="md"
            label="O servidor principal foi desligado quando inativo para reduzir custos, mas já está sendo religado. Aguarde por cerca de 2 minutos até que tudo estja no ar novamente!"
          >
            <Flex
              gap="5px"
              alignItems="center"
              bg="whiteAlpha.300"
              p="5px"
              borderRadius="10px"
              userSelect="none"
            >
              <Spinner size="sm" />
              <Text color="red.100" fontSize="12px" hideBelow="sm">
                Aguardando servidor principal...
              </Text>
            </Flex>
          </Tooltip>
        )}
        {serverOnline === false && (
          <Flex gap="5px" alignItems="center" userSelect="none">
            <Box w="8px" h="8px" bg="red" borderRadius="10px" />
            <Text color="red.100" fontSize="12px">
              Servidor offline
            </Text>
          </Flex>
        )}
      </Flex>
      <Skeleton isLoaded={!isLoading} borderRadius="999px">
        {user ? (
          <Menu>
            <Tooltip label={user.displayName}>
              <MenuButton>
                <Avatar
                  src={user.photoURL || undefined}
                  w="40px"
                  h="40px"
                  bg="whiteAlpha.300"
                />
              </MenuButton>
            </Tooltip>
            <ProfilePopover />
          </Menu>
        ) : (
          <Button variant="signIn" onClick={signIn}>
            Entrar
          </Button>
        )}
      </Skeleton>
      <LeaveModal onClose={onClose} isOpen={isOpen} />
    </Flex>
  )
}
