import { AuthState, useAuth } from '@/contexts/AuthContext'
import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import ProfileMenu from '../MainMenu/MainMenu'
import { useMemo } from 'react'
import { useRankInfo } from '@/hooks/useRanks'
import { useLiveActivity } from '@/contexts/LiveActivityContext'
import ActivityBadge from './components/ActivityBadge'

export default function Navbar() {
  const { activities } = useLiveActivity()
  const { authState, user } = useAuth()
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
          {Object.entries(activities).map(([key, activity]) => (
            <ActivityBadge key={key} liveActivity={activity} />
          ))}
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
