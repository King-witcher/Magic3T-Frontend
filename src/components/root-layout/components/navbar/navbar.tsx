import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { useLiveActivity } from '@/contexts/live-activity.context.tsx'
import { Flex, Skeleton, Text, chakra } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { ActivityBadge } from './activity-badge'
import { ProfileButton } from './profile-button'

const Container = chakra(Flex, {
  baseStyle: {
    h: '55px',
    w: '100%',
    flex: '0 0 55px',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    px: '10px',
    bg: 'blue.600',
    color: 'white',
    shadow: '0 0 5px 0 #00000080',
  },
})

export function Navbar() {
  const { activities } = useLiveActivity()
  const { authState } = useAuth()

  return (
    <Container>
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
      {/* {authState === AuthState.SignedIn && (
        <Flex ml="auto">
          <Center
            boxSize="32px"
            rounded="8px"
            fontSize="20px"
            transition="all 100ms linear"
            cursor="pointer"
            _hover={{
              bg: 'whiteAlpha.300',
            }}
          >
            <ChatIcon />
          </Center>
          <Center
            boxSize="32px"
            rounded="8px"
            fontSize="20px"
            transition="all 100ms linear"
            cursor="pointer"
            _hover={{
              bg: 'whiteAlpha.300',
            }}
          >
            <BellIcon />
          </Center>
        </Flex>
      )} */}
      <Skeleton isLoaded={authState !== AuthState.Loading} borderRadius="999px">
        <ProfileButton />
      </Skeleton>
    </Container>
  )
}
