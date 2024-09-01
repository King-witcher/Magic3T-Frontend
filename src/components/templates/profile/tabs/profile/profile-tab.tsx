import { ProfileCard } from '@/components/molecules'
import type { UserData } from '@/models/users/User'
import { Center } from '@chakra-ui/react'

interface Props {
  user: UserData
}

export function ProfileTab({ user }: Props) {
  return (
    <Center h="100%">
      <ProfileCard user={user} />
    </Center>
  )
}
