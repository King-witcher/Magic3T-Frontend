import { useAuth } from '@/contexts/AuthContext'
import { Center, Stack, Text } from '@chakra-ui/react'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <Center w="100%" h="100%">
      <Text>
        Aguarde, em breve teremos algo aqui
        {user ? `, ${user.displayName}` : null}!
      </Text>
    </Center>
  )
}
