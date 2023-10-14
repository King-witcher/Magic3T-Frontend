import { useAuth } from '@/contexts/AuthContext'
import { Avatar, Flex, FlexProps, Text, forwardRef } from '@chakra-ui/react'

const ProfileCard = forwardRef(function ProfileCard(props: FlexProps, ref) {
  const { user } = useAuth()
  console.log('rendered')
  return (
    <Flex
      ref={ref}
      alignItems="center"
      justifyContent="center"
      gap="15px"
      p="5px"
      h="40px"
      w={{
        base: '40px',
        sm: 'fit-content',
      }}
      pr={{ base: 'auto', md: '25px' }}
      userSelect="none"
      cursor="pointer"
      bg="whiteAlpha.300"
      _hover={{
        bg: 'whiteAlpha.400',
      }}
      borderRadius="50px"
      {...props}
    >
      <Avatar src={user?.photoURL || undefined} size="sm" />
      <Text hideBelow="md">{user?.displayName}</Text>
    </Flex>
  )
})

export default ProfileCard
