import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { useLiveActivity } from '@/contexts/live-activity.context.tsx'
import { Flex, Skeleton, Text, chakra } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { ActivityBadge } from './activity-badge'
import { ProfileButton } from './profile-button'

const Container = chakra(Flex, {
  baseStyle: {
    w: '100%',
    h: '65px',
    flex: '0 0 65px',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    justifyContent: 'space-between',
    gap: '10px',
    px: '10px',
    borderBottom: '1px solid #ffffff80',
    bg: 'linear-gradient(90deg, #ffffff30, #ffffff40, #ffffff30)',
    backgroundClip: 'padding-box',
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
