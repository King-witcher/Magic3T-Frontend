import { AuthState, useAuth } from '@/contexts/AuthContext'
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileMenu from '../MainMenu/MainMenu'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useMemo } from 'react'
import { useRankInfo } from '@/hooks/useRanks'
import { useLiveActivity } from '@/contexts/LiveActivityContext'

export default function Navbar() {
  const { activities } = useLiveActivity()
  const navigate = useNavigate()
  const { authState, user } = useAuth()
  const { serverOnline } = useServiceStatus()
  const { getRankInfo } = useRankInfo()
  const rinfo = useMemo(() => {
    return user && getRankInfo(user.glicko)
  }, [user])

  return (
    <>
      <Flex
        as="header"
        flex="0 0 55px"
        h="55px"
        w="100%"
        alignItems="center"
        px="10px"
        bg="blue.600"
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
                <Text color="white" fontSize="12px">
                  Aguardando servidor...
                </Text>
              </Flex>
            </Tooltip>
          )}
          {Object.keys(activities).map((activityKey) => {
            const activity = activities[parseInt(activityKey)] // wtf é isso k

            return (
              <Tooltip
                key={activityKey}
                hideBelow="md"
                label={activity.tooltip}
              >
                <Link to={activity?.url || ''}>
                  <Flex
                    gap="5px"
                    alignItems="center"
                    bg="whiteAlpha.300"
                    p="5px 5px"
                    borderRadius="10px"
                    userSelect="none"
                    cursor="pointer"
                    _hover={{
                      bg: 'whiteAlpha.400',
                    }}
                    onClick={() => navigate('/')}
                  >
                    <Text color="white" fontSize="12px">
                      {activity.content}
                    </Text>
                  </Flex>
                </Link>
              </Tooltip>
            )
          })}
          {serverOnline === false && (
            <Flex gap="5px" alignItems="center" userSelect="none">
              <Box w="8px" h="8px" bg="red" borderRadius="10px" />
              <Text color="white" fontSize="12px">
                Servidor offline
              </Text>
            </Flex>
          )}
        </Flex>
        <Skeleton
          isLoaded={authState !== AuthState.Loading}
          borderRadius="999px"
        >
          <Menu>
            <Tooltip label={user?.nickname} openDelay={400}>
              <MenuButton
                borderRadius="8px"
                transition="all linear 80ms"
                borderColor={rinfo?.colorScheme.darker}
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
                  rounded="8px"
                  sx={{
                    '& img': {
                      rounded: '8px',
                    },
                  }}
                />
              </MenuButton>
            </Tooltip>
            <ProfileMenu />
          </Menu>
        </Skeleton>
      </Flex>
    </>
  )
}
