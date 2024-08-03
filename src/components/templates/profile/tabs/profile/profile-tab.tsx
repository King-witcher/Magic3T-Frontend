import { ProfileComponent } from '@/components'
import type { UserData } from '@/models/users/User'
import { Center } from '@chakra-ui/react'

interface Props {
  user: UserData
}

export function ProfileTab({ user }: Props) {
  return (
    <Center h="100%">
      <ProfileComponent user={user} />
    </Center>
  )
}
