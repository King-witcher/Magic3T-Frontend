import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { useLiveActivity } from '@/contexts/live-activity.context.tsx'
import { Flex, Skeleton, Text, chakra } from '@chakra-ui/react'
import { ActivityBadge } from './activity-badge'
import { Link } from '@tanstack/react-router'
import { ProfileButton } from './profile-button'

const Container = chakra(Flex, {
  baseStyle: {
    w: '100%',
    flex: '0 0 65px',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    px: '10px',
    borderBottom: '1px solid #ffffff40',
    bg: '#ffffff30',
    color: 'white',
    zIndex: 1,
    shadow: '0 0 12px 0 #00000040',
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
          <Text fontWeight={400}>Play</Text>
          <Text fontWeight={700}>Magic3T</Text>
        </Flex>
        {Object.entries(activities).map(([key, activity]) => (
          <ActivityBadge key={key} liveActivity={activity} />
        ))}
      </Flex>
      <Skeleton isLoaded={authState !== AuthState.Loading} borderRadius="999px">
        <ProfileButton />
      </Skeleton>
    </Container>
  )
}
