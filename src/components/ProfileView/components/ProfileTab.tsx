import ProfileComponent from '@/components/ProfileComponent'
import { UserData } from '@/models/users/User'
import { Center } from '@chakra-ui/react'

interface Props {
  user: UserData
}

const tierMap = {
  Unranked: 'Indefinido',
  Bronze: 'Bronze',
  Silver: 'Prata',
  Gold: 'Ouro',
  Diamond: 'Diamante',
  Elite: 'Elite',
}

const divisionMap = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
}

export default function ProfileTab({ user }: Props) {
  return (
    <Center h="100%">
      <ProfileComponent user={user} />
    </Center>
  )
}
